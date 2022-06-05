import type { LoaderFunction } from "remix";
import { json, Link, useLoaderData } from "remix";
import { getDocuments, getPublicDocuments } from "~/models/document.server";
import { authenticator } from "~/services/auth.server";

interface LoaderData {
  documents: { id: string; name: string }[];
  authenticated: boolean;
}

export const loader: LoaderFunction = async ({ request }) => {
  const user = await authenticator.isAuthenticated(request);
  const documents = user
    ? await getDocuments(user.id)
    : await getPublicDocuments();

  return json<LoaderData>({ documents, authenticated: !!user });
};

export default function DocumentsList() {
  const { documents, authenticated } = useLoaderData() as LoaderData;

  return documents.length ? (
    <>
      <div className="grid max-w-screen-md grid-cols-5 gap-4 mx-auto mt-8">
        {documents.map((document) => (
          <Link
            key={document.id}
            to={document.id}
            className="px-4 py-2 font-medium transition-colors border-2 border-gray-300 rounded-lg overflow-clip overflow-ellipsis hover:bg-gray-200 focus:bg-gray-300"
          >
            {document.name}
          </Link>
        ))}
      </div>
      {authenticated && (
        <Link
          to="novo"
          className="fixed bottom-4 right-4 aspect-square h-12 w-12 rounded-full bg-blue-500 text-center text-4xl leading-[2.75rem] text-white shadow-md transition-colors hover:bg-blue-600 focus:shadow-2xl"
        >
          +
        </Link>
      )}
    </>
  ) : (
    <div className="flex flex-col items-center max-w-screen-md gap-2 mx-auto mt-8">
      <h2 className="text-center">Você não tem documentos</h2>
      {authenticated && (
        <Link
          to="novo"
          className="p-2 text-center text-white bg-blue-500 rounded-lg w-max"
        >
          Crie um documento
        </Link>
      )}
    </div>
  );
}
