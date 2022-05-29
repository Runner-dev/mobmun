import { FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import drive from "~/services/drive.server";
import { useState } from "react";
import { ActionFunction, Form, LoaderFunction, useLoaderData } from "remix";
import { json, redirect } from "remix";
import invariant from "tiny-invariant";
import { v4 } from "uuid";
import DriveInput from "~/components/DriveInput";
import { getAllianceByUser } from "~/models/alliance.server";
import {
  createAllianceDocument,
  createPublicDocument,
} from "~/models/document.server";
import { authenticator } from "~/services/auth.server";
import firebaseAdmin from "~/services/firebase.server";
import { getAuthClient } from "~/services/googleAuth.server";
import { sessionStorage } from "~/services/session.server";

enum SharingType {
  Public = "public",
  Specific = "specific",
  Alliance = "alliance",
}

export const loader: LoaderFunction = async ({ request }) => {
  const session = await sessionStorage.getSession(
    request.headers.get("cookie")
  );
  const authToken = session.get("authToken");

  if (!authToken) return redirect("/auth/refresh?redirect=/documentos/novo");

  return json({ token: authToken });
};

export const action: ActionFunction = async ({ request }) => {
  const session = await sessionStorage.getSession(
    request.headers.get("cookie")
  );
  const authToken = session.get("authToken");
  const user = await authenticator.isAuthenticated(request, {
    failureRedirect: "/",
  });

  const formData = await request.formData();
  const sharingType = formData.get("sharingType");
  const fileId = formData.get("fileId");
  const fileName = formData.get("fileName");

  invariant(typeof sharingType === "string", "sharingType is required");
  invariant(typeof fileName === "string", "fileName is required");
  const id = v4();

  if (!authToken) return redirect("/auth/refresh?redirect=/");
  await Promise.all([
    (async () => {
      switch (sharingType) {
        case SharingType.Public:
          await createPublicDocument({ fileId: id, name: fileName });
          break;
        case SharingType.Alliance:
          const userAlliance = await getAllianceByUser(user.id);
          invariant(userAlliance, "user is not in an alliance");
          await createAllianceDocument({
            allianceId: userAlliance.id,
            fileId: id,
            name: fileName,
          });
          break;
      }
    })(),
    (async () => {
      const googleAuth = getAuthClient(authToken);

      invariant(typeof authToken === "string");
      invariant(typeof fileId === "string");
      const writeStream = await firebaseAdmin
        .storage()
        .bucket()
        .file(`documents/${id}.html`)
        .createWriteStream();
      const readable = await drive.files.export(
        {
          fileId: fileId,
          mimeType: "text/html",
          auth: googleAuth,
        },
        { responseType: "stream" }
      );

      await new Promise((resolve, reject) => {
        readable.data
          .pipe(writeStream)
          .on("finish", resolve)
          .on("error", reject);
      });
    })(),
  ]);

  return redirect(`/documentos/${id}`);
};

export default function CreateDocument() {
  const { token } = useLoaderData();
  const [sharingType, setSharingType] = useState("specific");

  return (
    <Form
      method="post"
      className="flex flex-col max-w-screen-sm gap-4 p-4 mx-auto mt-4 border border-gray-300 rounded-lg"
    >
      <h2 className="mb-4 text-3xl text-center">Novo Documento</h2>
      <DriveInput authToken={token} />
      <FormControl fullWidth>
        <InputLabel id="select-label">Tipo de compartilhamento</InputLabel>
        <Select
          name="sharingType"
          labelId="select-label"
          id="select"
          value={sharingType}
          label="Tipo de compartilhamento"
          onChange={(e) => setSharingType(e.target.value)}
        >
          <MenuItem value={SharingType.Public}>Público</MenuItem>
          <MenuItem value={SharingType.Alliance}>Aliança</MenuItem>
          <MenuItem value={SharingType.Specific}>Nações Específicas</MenuItem>
        </Select>
      </FormControl>
      <button className="py-4 text-white bg-blue-500 rounded">
        Criar Documento
      </button>
    </Form>
  );
}
