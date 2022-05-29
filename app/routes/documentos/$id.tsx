import { json, LoaderFunction, useLoaderData, useParams } from "remix";
import invariant from "tiny-invariant";
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
  const { id, documentUrl } = useLoaderData();
  console.log(documentUrl);
  return <iframe src={documentUrl} />;
}
