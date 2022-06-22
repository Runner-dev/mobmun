import type {
  Country,
  CountryRepresentative,
  NewsOrg,
  NewsOrgRepresentative,
} from "@prisma/client";
import { Form, Link, useLoaderData } from "@remix-run/react";
import type { ActionFunction, LoaderFunction } from "@remix-run/server-runtime";
import { json, redirect } from "@remix-run/server-runtime";
import invariant from "tiny-invariant";
import { StyledCheckbox, StyledInput } from "~/components/StyledInputs";
import type { User } from "~/models/user.server";
import { deleteUser, updateUser } from "~/models/user.server";
import { getUserByIdWithIncludes } from "~/models/user.server";
import { mediatorGuard } from "~/services/auth.server";
import useUpdating from "~/useUpdating";

type LoaderData = {
  user:
    | User & {
        countryRepresentative:
          | (CountryRepresentative & {
              country: Country;
            })
          | null;
        newsRepresentative:
          | (NewsOrgRepresentative & {
              newsOrg: NewsOrg;
            })
          | null;
      };
};

export const action: ActionFunction = async ({ request, params }) => {
  await mediatorGuard(request);

  const formData = await request.formData();
  const action = formData.get("_action");

  if (action === "update") {
    const id = params.id;
    invariant(typeof id === "string", "id must be a string");

    const name = formData.get("name");
    const email = formData.get("email");
    const mediator = formData.get("mediator");

    invariant(typeof name === "string", "name must be a string");
    invariant(typeof email === "string", "email must be a string");
    invariant(typeof mediator !== "undefined", "mediator must be a defined");

    await updateUser({ id, displayName: name, email, mediator: !!mediator });
    return json({ success: true });
  } else if (action === "delete") {
    const id = params.id;
    invariant(typeof id === "string", "id must be a string");
    await deleteUser(id);
    return redirect("/mesa/usuarios");
  }
  return new Response("Invalid action", { status: 400 });
};

export const loader: LoaderFunction = async ({ request, params }) => {
  await mediatorGuard(request);

  invariant(typeof params.id === "string");
  const user = await getUserByIdWithIncludes(params.id);
  if (!user) return new Response("User not found", { status: 404 });

  return json<LoaderData>({ user });
};

export default function MediatorUser() {
  const { user } = useLoaderData() as LoaderData;

  useUpdating();

  return (
    <Form method="post" className="flex w-full max-w-[400px] flex-col gap-2">
      <input type="hidden" name="id" value={user.id} />
      <StyledInput
        name="name"
        defaultValue={user.displayName}
        placeholder="João da Silva"
        label="Nome"
      />

      <StyledInput
        name="email"
        defaultValue={user.email}
        placeholder="exemplo@exemplo.com"
        label="E-mail"
      />
      <StyledCheckbox
        name="mediator"
        defaultChecked={user.mediator}
        label="Mesa"
      />
      <hr className="w-full h-1 bg-gray-300" />
      <h3 className="text-xl text-gray-500">
        Não Editáveis (Edite pela página de representantes)
      </h3>
      {user.countryRepresentative && (
        <div>
          <h4 className="text-lg">País</h4>
          <p>Nome: {user.countryRepresentative.country.name}</p>
          <p>Representante: {user.countryRepresentative.name}</p>
        </div>
      )}
      {user.newsRepresentative && (
        <div>
          <h4 className="text-lg">Imprensa</h4>
          <p>Nome: {user.newsRepresentative?.newsOrg.name}</p>
        </div>
      )}
      <div className="flex self-center gap-4 mt-2">
        <Link
          to="/mesa/usuarios"
          className="px-4 py-2 text-white bg-gray-500 rounded-lg"
        >
          Voltar
        </Link>
        <button
          name="_action"
          value="delete"
          className="px-4 py-2 text-white bg-red-500 rounded-lg"
          onClick={(e) => {
            if (!confirm("Deseja mesmo apagar esse anúncio?"))
              e.preventDefault();
          }}
        >
          Apagar
        </button>
        <button
          name="_action"
          value="update"
          className="px-4 py-2 text-white bg-orange-500 rounded-lg"
        >
          Atualizar
        </button>
      </div>
    </Form>
  );
}
