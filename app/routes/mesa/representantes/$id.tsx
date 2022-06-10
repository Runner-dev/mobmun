import type { Country, CountryRepresentative, User } from "@prisma/client";
import type { ActionFunction, LoaderFunction } from "remix";
import { Form, json, Link, redirect, useLoaderData } from "remix";
import invariant from "tiny-invariant";
import { StyledInput, StyledSelect } from "~/components/StyledInputs";
import { getCountries } from "~/models/country.server";
import {
  deleteRepresentative,
  getCountryRepresentativeById,
  updateRepresentative,
} from "~/models/representative.server";
import { getUsersWithoutRepresentatives } from "~/models/user.server";

import { mediatorGuard } from "~/services/auth.server";

type LoaderData = {
  countries: Country[];
  users: User[];
  representative: CountryRepresentative;
};

export const loader: LoaderFunction = async ({ request, params }) => {
  invariant(typeof params.id === "string");
  const representative = await getCountryRepresentativeById(params.id);
  if (!representative)
    return new Response("representative not found", { status: 404 });

  const countries = await getCountries();
  if (!countries) return new Response("countries not found", { status: 404 });

  const users = await getUsersWithoutRepresentatives();
  if (!users) return new Response("users not found", { status: 404 });

  return json<LoaderData>({
    countries,
    users: [representative.user, ...users],
    representative,
  });
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
    const userId = formData.get("userId");
    invariant(typeof userId === "string", "userId must be a string");
    const countryId = formData.get("countryId");
    invariant(typeof countryId === "string", "countryId must be a string");

    await updateRepresentative({
      id,
      name,
      userId,
      countryId,
    });

    return json({});
  } else if (action === "delete") {
    await deleteRepresentative(id);

    return redirect("/mesa/representantes");
  }
  return new Response("Invalid action", { status: 400 });
};

export default function NewAnnouncement() {
  const { representative, countries, users } = useLoaderData() as LoaderData;

  return (
    <div className="flex w-full max-w-[400px] flex-col gap-2">
      <Form method="post">
        <StyledInput
          label="Nome do Representante"
          placeholder="João Silva"
          name="name"
          defaultValue={representative.name}
        />

        <StyledSelect
          name="countryId"
          label="Nação"
          options={countries.map((country) => ({
            label: country.name,
            value: country.id,
          }))}
          defaultSelection={representative.countryId}
        />

        <StyledSelect
          name="userId"
          label="Usuário"
          options={
            users.length === 0
              ? [{ label: "Nenhum usuário sem representante", value: "noUser" }]
              : users.map((user) => ({
                  label: user.displayName,
                  value: user.id,
                }))
          }
          defaultSelection={representative.userId}
        />

        <div className="flex self-center gap-4 mt-2">
          <Link
            to="/mesa/representantes"
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
    </div>
  );
}
