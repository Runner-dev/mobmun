import { json, LoaderFunction, useLoaderData, useParams } from "remix";
import invariant from "tiny-invariant";
import Navbar from "~/components/Navbar";
import { getDocumentById } from "~/models/document.server";
import firebaseAdmin from "~/services/firebase.server";

export const loader: LoaderFunction = async ({ request, params }) => {
  const id = params.id;
  invariant(typeof id === "string", "id is required");

  const dbDocument = await getDocumentById(id);

  const bucket = firebaseAdmin.storage().bucket();
  const [documentUrl] = await bucket.file(`documents/${id}.html`).getSignedUrl({
    version: "v4",
    action: "read",
    expires: Date.now() + 1000 * 60 * 2, // 2 minutes
  });

  return json({ name: dbDocument?.name, documentUrl });
};
export default function Document() {
  const { name, documentUrl } = useLoaderData();
  console.log(documentUrl);
  return (
    <div className="bg-gray-100">
      <Navbar />
      <h1 className="fixed flex-wrap w-full p-4 text-xl font-medium bg-gray-200">
        {name}
      </h1>
      <iframe
        src={documentUrl}
        title={name}
        className="w-full max-w-screen-md min-h-screen mx-auto my-20 shadow-xl"
      />
      <div>Signatários</div>
    </div>
  );
}
