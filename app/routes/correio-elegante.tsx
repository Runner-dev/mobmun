import { Form } from "@remix-run/react";
import type { ActionFunction } from "remix";
import { redirect } from "remix";
import invariant from "tiny-invariant";
import Navbar from "~/components/Navbar";
import { createCorreio } from "~/models/correio.server";

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const message = formData.get("message");
  invariant(typeof message === "string");
  await createCorreio(message);
  return redirect("/");
};

export default function CorreioElegante() {
  return (
    <>
      <Navbar />
      <Form
        method="post"
        className="mx-auto mt-20 mb-20 flex w-full max-w-screen-md flex-col gap-4 bg-gray-50 p-4 shadow-xl lg:mt-8"
      >
        <h2 className="text-3xl ">Correio Elegante</h2>
        <textarea
          name="message"
          className="min-h-[2em] w-full rounded border border-gray-200 p-2"
          placeholder="Mensagem"
        />
        <div className="rounded border border-orange-300 bg-orange-100 p-2 text-orange-500">
          É essencial o respeito a todos nos correios elegantes. Mensagens
          desrespeitosas não serão lidas
        </div>
        <button className="w-full rounded bg-green-600 p-2 text-white">
          Enviar Correio Elegante
        </button>
      </Form>
    </>
  );
}
