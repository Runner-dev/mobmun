import { json, Link, LoaderFunction, useLoaderData } from "remix";
import { getDocuments } from "~/models/document.server";
import { authenticator } from "~/services/auth.server";
import type { Document } from "~/models/document.server";

interface LoaderData {
  documents: { id: string; name: string }[];
}

export const loader: LoaderFunction = async ({ request }) => {
  const user = await authenticator.isAuthenticated(request, {
    failureRedirect: "/",
  });
  const documents = await getDocuments(user.id);

  return json<LoaderData>({ documents });
};

export default function DocumentsList() {
  const { documents } = useLoaderData() as LoaderData;

  return documents.length ? (
    documents.map((document) => (
      <div className="max-w-screen-md mx-auto mt-8" key={document.id}>
        <Link
          to={document.id}
          className="p-4 font-medium transition-colors border-2 border-gray-300 rounded-lg hover:bg-gray-200 focus:bg-gray-300"
        >
          {document.name}
        </Link>
      </div>
    ))
  ) : (
    <div className="flex flex-col items-center max-w-screen-md gap-2 mx-auto mt-8">
      <h2 className="text-center">Você não tem documentos</h2>
      <Link
        to="novo"
        className="p-2 text-center text-white bg-blue-500 rounded-lg w-max"
      >
        Crie um documento
      </Link>
    </div>
  );
}
