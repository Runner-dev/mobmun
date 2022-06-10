import { Alliance, Country } from "@prisma/client";
import type { ActionFunction, LoaderFunction } from "remix";
import { Form, json, Link, redirect, useLoaderData } from "remix";
import invariant from "tiny-invariant";
import { StyledInput } from "~/components/StyledInputs";
import {
  deleteAlliance,
  getAllianceById,
  updateAlliance,
} from "~/models/alliance.server";
import { mediatorGuard } from "~/services/auth.server";

type LoaderData = {
  alliance: Alliance & {
    countries: Country[];
  };
};

export const loader: LoaderFunction = async ({ request, params }) => {
  await mediatorGuard(request);

  invariant(typeof params.id === "string");
  const alliance = await getAllianceById(params.id);
  if (!alliance) return new Response("alliance not found", { status: 404 });

  return json<LoaderData>({ alliance });
};

export const action: ActionFunction = async ({ request, params }) => {
  await mediatorGuard(request);

  const formData = await request.formData();
  const action = formData.get("_action");

  const id = params.id;
  invariant(typeof id === "string", "id must be a string");

  if (action === "update") {
    const name = formData.get("name");
    invariant(typeof name === "string", "name must be a string");

    await updateAlliance({ id, name });
    return json({});
  } else if (action === "delete") {
    await deleteAlliance(id);
    return redirect("/mesa/aliancas");
  }
  return new Response("Invalid action", { status: 400 });
};

export default function NewAnnouncement() {
  const { alliance } = useLoaderData() as LoaderData;

  return (
    <div className="flex w-full max-w-[400px] flex-col gap-2">
      <Form method="post">
        <StyledInput
          label="Nome"
          placeholder="OTAN"
          defaultValue={alliance.name}
          name="name"
        />
        <div className="flex self-center gap-4 mt-2">
          <Link
            to="/mesa/aliancas"
            className="px-4 py-2 text-white bg-gray-500 rounded-lg"
          >
            Voltar
          </Link>
          <button
            name="_action"
            value="delete"
            className="px-4 py-2 text-white bg-red-500 rounded-lg"
            onClick={(e) => {
              if (!confirm("Deseja mesmo apagar essa aliança?"))
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
      <hr className="w-full h-1 bg-gray-300" />
      <div>
        <h3 className="text-xl font-semibold">Países</h3>
        <ul>
          {alliance.countries.map((country) => (
            <li key={country.id} className="transition hover:text-blue-500">
              <Link to={`/mesa/paises/${country.id}`}>{country.name}</Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
