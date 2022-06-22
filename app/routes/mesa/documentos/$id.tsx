import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import type {
  Country,
  Document,
  Sharing,
  SharingCountry,
  Signature,
} from "@prisma/client";
import { Form, Link, useLoaderData } from "@remix-run/react";
import type { ActionFunction, LoaderFunction } from "@remix-run/server-runtime";
import { json, redirect } from "@remix-run/server-runtime";
import { useState } from "react";
import invariant from "tiny-invariant";
import SharingAutocomplete from "~/components/SharingAutocomplete";
import { StyledInput, StyledSelect } from "~/components/StyledInputs";
import { getCountries, getCountryById } from "~/models/country.server";
import {
  deleteDocument,
  getMediatorDocumentById,
  updateDocument,
} from "~/models/document.server";

import { mediatorGuard } from "~/services/auth.server";
import firebaseAdmin from "~/services/firebase.server";
import useUpdating from "~/useUpdating";

enum SharingType {
  Public = "public",
  Specific = "specific",
  Alliance = "alliance",
}

type LoaderData = {
  document: Document & {
    sharing: Sharing & {
      sharingCountry: (SharingCountry & {
        country: Country;
      })[];
    };
    signatures: (Signature & {
      country: Country;
    })[];
  };
  docUrl: string;
  countries: Country[];
};

export const loader: LoaderFunction = async ({ request, params }) => {
  invariant(typeof params.id === "string");
  const document = await getMediatorDocumentById(params.id);
  if (!document) return new Response("document not found", { status: 404 });

  const id = params.id;

  const bucket = firebaseAdmin.storage().bucket();
  const [documentUrl] = await bucket.file(`documents/${id}.html`).getSignedUrl({
    version: "v4",
    action: "read",
    expires: Date.now() + 1000 * 60 * 2, // 2 minutes
  });

  const countries = await getCountries();

  return json<LoaderData>({
    document,
    docUrl: documentUrl,
    countries,
  });
};

export const action: ActionFunction = async ({ request, params }) => {
  await mediatorGuard(request);

  const formData = await request.formData();
  const action = formData.get("_action");

  const id = params.id;
  invariant(typeof id === "string", "id must be a string");

  if (action === "update") {
    const name = formData.get("name");
    invariant(typeof name === "string", "name must be a string");

    const approvalStatus = formData.get("approvalStatus");
    invariant(
      typeof approvalStatus === "string",
      "approvalStatus must be a string"
    );

    const intApprovalStatus = parseInt(approvalStatus);
    invariant(!isNaN(intApprovalStatus), "approvalStatus must be a number");

    const sharerId = formData.get("sharerId");
    invariant(typeof sharerId === "string", "sharerId must be a string");

    const sharingType = formData.get("sharingType");
    invariant(typeof sharingType === "string", "sharingType must be a string");

    const isPublic = sharingType === SharingType.Public;
    let allianceId: string | null = null;
    if (sharingType === SharingType.Alliance) {
      const sharerCountry = await getCountryById(sharerId);
      allianceId = sharerCountry?.allianceId ?? null;
    }

    const sharingCountriesStr = formData.get("sharingCountries") ?? "";
    invariant(
      typeof sharingCountriesStr === "string",
      "sharingCountries must be a string"
    );
    const sharingCountries =
      sharingCountriesStr === "" ? [] : sharingCountriesStr.split(",");

    const comment = formData.get("comment");
    invariant(typeof comment === "string");

    await updateDocument({
      id,
      name,
      approvalStatus: intApprovalStatus,
      allianceId,
      sharingCountriesIds: sharingCountries.length > 0 ? sharingCountries : [],
      sharerId,
      isPublic,
      mediatorComment: comment,
    });

    return json({});
  } else if (action === "delete") {
    await deleteDocument(id);

    return redirect("/mesa/representantes");
  }
  return new Response("Invalid action", { status: 400 });
};

export default function Announcement() {
  const { document, docUrl, countries } = useLoaderData() as LoaderData;
  const [currentApprovalValue, setCurrentApprovalValue] = useState(
    document.approvalStatus.toString()
  );

  const [sharingType, setSharingType] = useState(
    document.sharing.public
      ? SharingType.Public
      : document.sharing.allianceId
      ? SharingType.Alliance
      : SharingType.Specific
  );

  useUpdating();

  return (
    <div className="w-full max-w-[600px]">
      <Form method="post" className="flex flex-col gap-4" id="mainForm">
        <StyledInput
          name={"name"}
          label={"Nome do Documento"}
          placeholder={"Tratado de Tordesilhas"}
          defaultValue={document.name}
        />

        <iframe
          src={docUrl}
          title={document.name}
          className="mx-auto h-[calc(100vh-4rem)] max-h-screen w-full max-w-screen-md overflow-y-auto shadow-xl"
        />

        <StyledSelect
          options={[
            {
              value: "-1",
              label: "Aguardando Aprovação",
            },
            { value: "0", label: "Rejeitado" },
            { value: "1", label: "Aprovado" },
          ]}
          name={"approvalStatus"}
          label={"Aprovação"}
          defaultSelection={document.approvalStatus.toString()}
          onChange={setCurrentApprovalValue}
          className={`p-2 ${
            currentApprovalValue === "-1"
              ? "bg-orange-200"
              : currentApprovalValue === "0"
              ? "bg-red-200"
              : "bg-green-200"
          }`}
        />

        <textarea
          name="comment"
          className="min-h-[2em] w-full p-2"
          placeholder="Comentário"
          defaultValue={document.mediatorComment}
        />

        <div className="flex flex-col items-start gap-4 p-2 bg-gray-100">
          <span className="ml-1 text-sm font-bold">Compartilhamento</span>

          <StyledSelect
            name="sharerId"
            label="Dono do Doc"
            defaultSelection={document.sharing.sharerId ?? undefined}
            options={countries.map((country) => ({
              label: country.name,
              value: country.id,
            }))}
          />

          <FormControl fullWidth>
            <InputLabel id="select-label">Tipo de compartilhamento</InputLabel>
            <Select
              name="sharingType"
              labelId="select-label"
              id="select"
              value={sharingType}
              label="Tipo de compartilhamento"
              onChange={(e) => setSharingType(e.target.value as SharingType)}
            >
              <MenuItem value={SharingType.Public}>Público</MenuItem>
              <MenuItem value={SharingType.Alliance}>Aliança</MenuItem>
              <MenuItem value={SharingType.Specific}>
                Nações Específicas
              </MenuItem>
            </Select>
          </FormControl>
          {sharingType !== SharingType.Public && (
            <SharingAutocomplete
              countries={countries}
              extra={sharingType === SharingType.Alliance}
              defaultValue={document.sharing.sharingCountry.map(
                ({ country }) => country
              )}
            />
          )}
        </div>
      </Form>

      <div className="flex self-center gap-4 mt-2">
        <Link
          to="/mesa/representantes"
          className="px-4 py-2 text-white bg-gray-500 rounded-lg"
        >
          Voltar
        </Link>
        <button
          name="_action"
          value="delete"
          className="px-4 py-2 text-white bg-red-500 rounded-lg"
          form={"mainForm"}
          onClick={(e) => {
            if (!confirm("Deseja mesmo apagar esse documento?"))
              e.preventDefault();
          }}
        >
          Apagar
        </button>
        <button
          name="_action"
          value="update"
          form={"mainForm"}
          className="px-4 py-2 text-white bg-orange-500 rounded-lg"
        >
          Atualizar
        </button>
      </div>
      <div className="flex flex-col items-start gap-4 p-2 bg-gray-100">
        <span className="ml-1 text-sm font-bold">Assinaturas</span>
        <ul>
          {document.signatures.map(({ id, country }) => (
            <li key={id}>
              <Form
                method="post"
                className="flex items-center gap-2"
                action={`/mesa/assinaturas/${id}/apagar`}
              >
                <img
                  src={country.flag}
                  alt={`Bandeira ${country.name}`}
                  className="object-cover w-8 h-8 border border-gray-100 rounded-full shadow"
                />
                {country.name}
                <button
                  type="submit"
                  onClick={(e) => {
                    if (!confirm("Deseja mesmo remover essa assinatura?"))
                      e.preventDefault();
                  }}
                  className="p-2 transition rounded-full hover:bg-red-200 hover:text-red-500"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-5 h-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </Form>
            </li>
          ))}
        </ul>
        <Link
          to="novaAssinatura"
          className="p-2 text-white bg-green-500 rounded-lg"
        >
          Nova
        </Link>
      </div>
    </div>
  );
}
