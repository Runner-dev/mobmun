import { Form, Link } from "@remix-run/react";
import { ActionFunction, redirect } from "@remix-run/server-runtime";
import invariant from "tiny-invariant";
import { createUserByMediator } from "~/models/user.server";
import { mediatorGuard } from "~/services/auth.server";

export const action: ActionFunction = async ({ request }) => {
  await mediatorGuard(request);

  const formData = await request.formData();
  const name = formData.get("name");
  const email = formData.get("email");
  invariant(typeof name === "string", "content must be a string");
  invariant(typeof email === "string", "date must be a string");

  await createUserByMediator({ displayName: name, email });
  return redirect("/mesa/usuarios");
};

export default function NewUser() {
  return (
    <Form method="post" className="flex w-full max-w-[400px] flex-col gap-2">
      <label className="flex flex-col">
        <span className="p-1 ml-1 text-sm font-bold">Nome:</span>
        <input
          type="text"
          name="name"
          autoComplete="off"
          placeholder="João da Silva"
          className="w-full p-1 bg-white border rounded-lg"
        />
      </label>

      <label className="flex flex-col">
        <span className="p-1 ml-1 text-sm font-bold">Email:</span>
        <input
          type="email"
          name="email"
          placeholder="exemplo@exemplo.com"
          autoComplete="off"
          className="p-1 bg-white border rounded-lg"
        />
      </label>
      <div className="flex self-center gap-4 mt-2">
        <Link
          to="/mesa/anuncios"
          className="px-4 py-2 text-white bg-gray-500 rounded-lg"
        >
          Cancelar
        </Link>
        <button className="px-4 py-2 text-white bg-green-500 rounded-lg">
          Criar
        </button>
      </div>
    </Form>
  );
}
