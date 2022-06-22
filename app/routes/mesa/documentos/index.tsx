import type { Document } from "@prisma/client";
import { Link, useLoaderData } from "@remix-run/react";
import type { LoaderFunction } from "@remix-run/server-runtime";
import { json } from "@remix-run/server-runtime";
import { getMediatorDocuments } from "~/models/document.server";

type LoaderData = {
  documents: Document[];
};

export const loader: LoaderFunction = async () => {
  const documents = await getMediatorDocuments();

  return json<LoaderData>({ documents });
};

export default function MediatorDocumentsList() {
  const { documents } = useLoaderData() as LoaderData;
  const approvalStatusClass = (status: number) => {
    return ["text-orange-500", "text-red-600", "text-green-500"][status + 1];
  };
  return (
    <>
      <ul className="px-2 ml-2 list-disc">
        {documents.map((document) => {
          return (
            <li
              key={document.id}
              className={`text-lg font-semibold hover:text-blue-500 ${approvalStatusClass(
                document.approvalStatus
              )}`}
            >
              <Link to={document.id}>{document.name}</Link>
            </li>
          );
        })}
      </ul>
    </>
  );
}
