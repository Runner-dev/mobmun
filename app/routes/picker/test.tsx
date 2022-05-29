import { Form, useLoaderData } from "@remix-run/react";
import useDrivePicker from "react-google-drive-picker";
import type { ActionFunction, LoaderFunction } from "@remix-run/server-runtime";
import { json, redirect } from "@remix-run/server-runtime";
import { oauthClientId, pickerApiKey } from "~/bowserConstants";
import { sessionStorage } from "~/services/session.server";
import { useMemo } from "react";
import Navbar from "~/components/Navbar";
import drive from "~/services/drive.server";
import invariant from "tiny-invariant";
import { getAuthClient } from "~/services/googleAuth.server";
import firebaseAdmin from "~/services/firebase.server";

export const loader: LoaderFunction = async ({ request }) => {
  const session = await sessionStorage.getSession(
    request.headers.get("cookie")
  );
  const authToken = session.get("authToken");

  if (!authToken) return redirect("/auth/refresh?redirect=/picker/test");

  return json({ token: authToken });
};

export const action: ActionFunction = async ({ request }) => {
  const formdata = await request.formData();
  const fileId = formdata.get("fileId");

  invariant(typeof fileId === "string");

  const session = await sessionStorage.getSession(
    request.headers.get("cookie")
  );
  const authToken = session.get("authToken");

  const googleAuth = getAuthClient(authToken);

  invariant(typeof authToken === "string");
  try {
    const writeStream = await firebaseAdmin
      .storage()
      .bucket()
      .file(`${fileId}.html`)
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
      readable.data.pipe(writeStream).on("finish", resolve).on("error", reject);
    });
  } catch (err: any) {
    console.error(err.errors);
  }

  return json({ worked: true });
};

export default function Test() {
  const [openPicker, data] = useDrivePicker();
  const fileId = useMemo(() => data?.docs[0]?.id, [data]) || "";
  const { token } = useLoaderData();

  const handleOpenPicker = () => {
    openPicker({
      clientId: oauthClientId,
      developerKey: pickerApiKey,
      viewId: "DOCUMENTS",
      locale: "pt-BR",
      token,
      showUploadView: true,
      showUploadFolders: true,
      supportDrives: true,
    });
  };

  return (
    <>
      <Navbar />
      <Form method="post" className="flex flex-col gap-3">
        <button onClick={handleOpenPicker} type="button">
          Open Picker
        </button>
        <input type="hidden" name="fileId" value={fileId} required />
        <button type="submit">Send File</button>
      </Form>
    </>
  );
}
