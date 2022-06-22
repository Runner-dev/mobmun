import { FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import drive from "~/services/drive.server";
import { useState } from "react";
import invariant from "tiny-invariant";
import { v4 } from "uuid";
import DriveInput from "~/components/DriveInput";
import { getAllianceByUser } from "~/models/alliance.server";
import {
  createAllianceDocument,
  createPublicDocument,
  createSpecificDocument,
} from "~/models/document.server";
import { authenticator } from "~/services/auth.server";
import firebaseAdmin from "~/services/firebase.server";
import { getAuthClient } from "~/services/googleAuth.server";
import { sessionStorage } from "~/services/session.server";
import type { Country } from "~/models/country.server";
import {
  getCountriesExceptOwn,
  getCountriesOutsideAlliance,
  getCountryByUser,
} from "~/models/country.server";
import SharingAutocomplete from "~/components/SharingAutocomplete";
import type { ActionFunction, LoaderFunction } from "@remix-run/server-runtime";
import { json, redirect } from "@remix-run/server-runtime";
import { Form, useLoaderData, useTransition } from "@remix-run/react";
enum SharingType {
  Public = "public",
  Specific = "specific",
  Alliance = "alliance",
}

type LoaderData = {
  token: string;
  countries: Country[];
  notInAlliance: Country[];
};

export const loader: LoaderFunction = async ({ request }) => {
  const session = await sessionStorage.getSession(
    request.headers.get("cookie")
  );
  const sessionData = session.get("authToken");
  const user = await authenticator.isAuthenticated(request, {
    failureRedirect: "/",
  });

  if (!sessionData) return redirect("/auth/refresh?redirect=/documentos/novo");

  const { token, expiry } = sessionData;

  if (!token || expiry - Date.now() < 0)
    return redirect("/auth/refresh?redirect=/documentos/novo");

  const countries = await getCountriesExceptOwn(user.id);
  const notInAlliance = await getCountriesOutsideAlliance(user.id);

  return json<LoaderData>({ token, countries, notInAlliance });
};

export const action: ActionFunction = async ({ request }) => {
  const session = await sessionStorage.getSession(
    request.headers.get("cookie")
  );
  const { token } = session.get("authToken");
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

  if (!token) return redirect("/auth/refresh?redirect=/");
  await Promise.all([
    (async () => {
      const userCountry = await getCountryByUser(user.id);
      invariant(userCountry, "user is not in a country");
      switch (sharingType) {
        case SharingType.Public:
          await createPublicDocument({
            fileId: id,
            name: fileName,
            countryId: userCountry.id,
          });
          break;
        case SharingType.Alliance:
          const userAlliance = await getAllianceByUser(user.id);
          invariant(userAlliance, "user is not in an alliance");
          await createAllianceDocument({
            allianceId: userAlliance.id,
            fileId: id,
            name: fileName,
            countryId: userCountry.id,
          });
          break;
        case SharingType.Specific:
          const chosenCountries = formData.get("sharingCountries");
          invariant(
            typeof chosenCountries === "string",
            "chosenCountries is required"
          );
          const chosenCountriesArray =
            chosenCountries !== "" ? chosenCountries.split(",") : [];
          await createSpecificDocument({
            sharedWith: chosenCountriesArray,
            fileId: id,
            name: fileName,
            countryId: userCountry.id,
          });
          break;
      }
    })(),
    (async () => {
      const googleAuth = getAuthClient(token);

      invariant(typeof fileId === "string", "fileId is required");
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
  ]).catch(async (err) => {
    throw err;
  });

  return redirect(`/documentos/${id}`);
};

export default function CreateDocument() {
  const { token, countries, notInAlliance } = useLoaderData() as LoaderData;
  const transition = useTransition();

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
      {sharingType !== SharingType.Public && (
        <SharingAutocomplete
          countries={
            sharingType === SharingType.Alliance ? notInAlliance : countries
          }
          extra={sharingType === SharingType.Alliance}
        />
      )}
      <button
        disabled={transition.state === "submitting"}
        className="py-4 text-white bg-blue-500 rounded"
      >
        {transition.state === "submitting" ? "Criando ..." : "Criar Documento"}
      </button>
    </Form>
  );
}
