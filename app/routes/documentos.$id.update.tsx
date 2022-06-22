import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Form, useLoaderData } from "@remix-run/react";
import invariant from "tiny-invariant";
import DriveInput from "~/components/DriveInput";
import Navbar from "~/components/Navbar";
import {
  getDocumentById,
  updateDocumentApprovalStatus,
} from "~/models/document.server";
import drive from "~/services/drive.server";
import firebaseAdmin from "~/services/firebase.server";
import { getAuthClient } from "~/services/googleAuth.server";
import { sessionStorage } from "~/services/session.server";

type LoaderData = {
  name: string;
  authToken: string;
};

export const loader: LoaderFunction = async ({ request, params }) => {
  const id = params.id;
  invariant(typeof id === "string", "id is required");

  const session = await sessionStorage.getSession(
    request.headers.get("cookie")
  );
  const sessionData = session.get("authToken");
  if (!sessionData)
    return redirect(`/auth/refresh?redirect=/documentos/${id}/update`);

  const { token, expiry } = sessionData;

  if (!token || expiry - Date.now() < 0)
    return redirect(`/auth/refresh?redirect=/documentos/${id}/update`);

  const dbDocument = await getDocumentById(id);

  if (!dbDocument) throw new Response("Not found", { status: 404 });

  return json<LoaderData>({
    name: dbDocument?.name,
    authToken: token,
  });
};

export const action: ActionFunction = async ({ request, params }) => {
  const id = params.id;
  invariant(typeof id === "string", "id is required");

  const session = await sessionStorage.getSession(
    request.headers.get("cookie")
  );
  const { token } = session.get("authToken");

  await updateDocumentApprovalStatus({ id, approvalStatus: -1 });

  const formData = await request.formData();
  const fileId = formData.get("fileId");

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
    readable.data.pipe(writeStream).on("finish", resolve).on("error", reject);
  });

  return redirect(`/documentos/${id}`);
};

export default function UpdateDocument() {
  const { name, authToken } = useLoaderData() as LoaderData;

  return (
    <div className="h-screen pb-20 bg-gray-100">
      <Navbar />
      <div className="fixed flex flex-wrap items-center justify-between w-full p-4 text-xl font-medium bg-gray-200">
        <h1>{name}</h1>
      </div>
      <div className="h-16"></div>
      <Form
        method="post"
        className="flex flex-col w-full max-w-screen-md gap-4 p-4 mx-auto mt-4 mb-20 bg-white shadow-xl"
      >
        <h2 className="text-3xl ">Atualizar o documento</h2>
        <div className="p-2 text-red-500 bg-red-100 border border-red-300 rounded">
          Alerta: A atualização do documento acarretará em uma necessidade de
          nova análise pela mesa
        </div>
        <DriveInput authToken={authToken} noName />
        <button className="w-full p-2 text-white bg-red-500 rounded">
          Atualizar
        </button>
      </Form>
    </div>
  );
}
