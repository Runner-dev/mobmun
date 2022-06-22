import type { Country, Signature } from "@prisma/client";
import { ActionFunction, LoaderFunction, redirect } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Form, Link, useLoaderData } from "@remix-run/react";
import invariant from "tiny-invariant";
import Navbar from "~/components/Navbar";
import { getCountryByUser } from "~/models/country.server";
import { deleteDocument, getDocumentById } from "~/models/document.server";
import { getDocumentSignatures } from "~/models/signature.server";
import { authenticator } from "~/services/auth.server";
import firebaseAdmin from "~/services/firebase.server";

type LoaderData = {
  name: string;
  documentUrl: string;
  signatures: Array<Signature & { country: Country }>;
  ableToSign: boolean;
  countryExists: boolean;
  ownDocument: boolean;
  documentStatus: number;
  comment?: string;
};

const classes = ["bg-orange-200", "bg-red-200", "bg-green-200"];
const statusTexts = ["Aguardando Aprovação", "Rejeitado", "Aprovado"];

export const loader: LoaderFunction = async ({ request, params }) => {
  const id = params.id;
  invariant(typeof id === "string", "id is required");

  const user = await authenticator.isAuthenticated(request);
  let userCountry: Country | null = null;
  if (user) {
    userCountry = await getCountryByUser(user.id);
  }

  const dbDocument = await getDocumentById(id);

  if (!dbDocument) throw new Response("Not found", { status: 404 });

  const signatures = await getDocumentSignatures(id);

  const bucket = firebaseAdmin.storage().bucket();
  const [documentUrl] = await bucket.file(`documents/${id}.html`).getSignedUrl({
    version: "v4",
    action: "read",
    expires: Date.now() + 1000 * 60 * 2, // 2 minutes
  });
  const countryExists = !!(user && userCountry);

  const ableToSign = !!(
    countryExists &&
    !signatures.some((signature) => signature.countryId === userCountry?.id)
  );
  const ownDocument = dbDocument.sharing.sharerId === userCountry?.id;

  const comment = dbDocument.mediatorComment;

  return json<LoaderData>({
    name: dbDocument?.name,
    documentUrl,
    signatures,
    ableToSign,
    countryExists,
    ownDocument,
    documentStatus: dbDocument.approvalStatus,
    comment: ownDocument ? comment : undefined,
  });
};

export const action: ActionFunction = async ({ params }) => {
  const id = params.id;
  invariant(typeof id === "string", "id is required");

  await deleteDocument(id);
  return redirect("/documentos");
};

export default function Document() {
  const {
    name,
    documentUrl,
    signatures,
    ableToSign,
    countryExists,
    ownDocument,
    documentStatus,
    comment,
  } = useLoaderData() as LoaderData;

  const alreadySigned = countryExists && !ableToSign;
  return (
    <div className="pb-20 bg-gray-100">
      <Navbar />
      <div className="fixed flex flex-wrap items-center justify-between w-full p-4 text-xl font-medium bg-gray-200">
        <h1>{name}</h1>
        {ownDocument && (
          <div className="flex gap-2">
            <Link
              to="update"
              className="p-2 text-lg text-white bg-orange-400 rounded-lg hover:bg-orange-500"
            >
              Atualizar o documento
            </Link>
            <Form method="post">
              <button
                onClick={(e) => {
                  if (!confirm("Deseja mesmo apagar esse documento?"))
                    e.preventDefault();
                }}
                className="flex items-center justify-center h-full text-white bg-red-500 rounded-lg aspect-square"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-8 h-8 "
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
          </div>
        )}
      </div>
      <div className="h-16"></div>
      {ownDocument && (
        <div className={`${classes[documentStatus + 1]} my-4 px-4 py-2`}>
          <div className="font-semibold">{statusTexts[documentStatus + 1]}</div>
          {comment && (
            <>
              <h3 className="mt-4 font-medium">Comentário da Mesa:</h3>
              <p>{comment}</p>
            </>
          )}
        </div>
      )}
      <iframe
        src={documentUrl}
        title={name}
        className="w-full max-w-screen-md min-h-screen mx-auto mt-4 mb-20 shadow-xl"
      />
      <div className="flex flex-col w-full max-w-screen-md gap-4 p-4 mx-auto mb-20 bg-white shadow-xl">
        <h2 className="text-3xl ">Signatários</h2>
        {signatures.length ? (
          <ul className="flex flex-col gap-2 text-xl font-medium">
            {signatures.map(({ id, country }) => (
              <li key={id} className="flex items-center gap-2">
                <img
                  src={country.flag}
                  alt={`Bandeira ${country.name}`}
                  className="object-cover w-8 h-8 border border-gray-100 rounded-full shadow"
                />
                {country.name}
              </li>
            ))}
          </ul>
        ) : (
          <div className="px-4 italic text-gray-600">Nenhum signatário</div>
        )}
        {countryExists && (
          <Form
            action="sign"
            method="post"
            onSubmit={(e) => {
              if (!confirm("Você tem certeza que deseja assinar o documento?"))
                e.preventDefault();
            }}
          >
            <button
              className={`w-full p-2 text-lg text-white ${
                alreadySigned ? "cursor-not-allowed bg-gray-300" : "bg-blue-400"
              }`}
              disabled={alreadySigned}
            >
              Assinar Documento
            </button>
          </Form>
        )}
      </div>
    </div>
  );
}
