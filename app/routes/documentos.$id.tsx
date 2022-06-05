import { Country, Signature } from "@prisma/client";
import { Response } from "@remix-run/node";
import { Form, LoaderFunction } from "remix";
import { json, useLoaderData, useParams } from "remix";
import invariant from "tiny-invariant";
import Navbar from "~/components/Navbar";
import { getCountryByUser } from "~/models/country.server";
import { getDocumentById } from "~/models/document.server";
import { getDocumentSignatures } from "~/models/signatures.server";
import { authenticator } from "~/services/auth.server";
import firebaseAdmin from "~/services/firebase.server";

type LoaderData = {
  name: string;
  documentUrl: string;
  signatures: Array<Signature & { country: Country }>;
  ableToSign: boolean;
};

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

  console.log(
    signatures.some((signature) => signature.countryId === userCountry?.id)
  );

  const ableToSign = !!(
    user &&
    userCountry &&
    !signatures.some((signature) => signature.countryId === userCountry?.id)
  );

  return json<LoaderData>({
    name: dbDocument?.name,
    documentUrl,
    signatures,
    ableToSign,
  });
};
export default function Document() {
  const { name, documentUrl, signatures, ableToSign } =
    useLoaderData() as LoaderData;
  return (
    <div className="pb-20 bg-gray-100">
      <Navbar />
      <h1 className="fixed flex-wrap w-full p-4 text-xl font-medium bg-gray-200">
        {name}
      </h1>
      <iframe
        src={documentUrl}
        title={name}
        className="w-full max-w-screen-md min-h-screen mx-auto my-20 shadow-xl"
      />
      <div className="flex flex-col w-full max-w-screen-md gap-4 p-4 mx-auto my-20 bg-white shadow-xl">
        <h2 className="text-3xl ">Signatários</h2>
        {signatures.length ? (
          <ul>
            {signatures.map(({ id, country }) => (
              <li key={id}>{country.name}</li>
            ))}
          </ul>
        ) : (
          <div className="px-4 italic text-gray-600">Nenhum signatário</div>
        )}
        {ableToSign && (
          <Form
            action="sign"
            method="post"
            onSubmit={(e) => {
              if (!confirm("Você tem certeza que deseja assinar o documento?"))
                e.preventDefault();
            }}
          >
            <button className="w-full p-2 text-lg text-white bg-blue-400">
              Assinar Documento
            </button>
          </Form>
        )}
      </div>
    </div>
  );
}
