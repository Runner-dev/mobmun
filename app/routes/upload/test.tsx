import { Form } from "@remix-run/react";
import type { ActionFunction } from "@remix-run/server-runtime";
import { json } from "@remix-run/server-runtime";
import { getDocuments } from "~/models/document.server";

export const action: ActionFunction = async ({ request }) => {
  const documents = await getDocuments("test2");
  return json({ ok: true });
};

export default function UploadTest() {
  return (
    <Form method="post" encType="multipart/form-data">
      <button type="submit">Send</button>
    </Form>
  );
}
