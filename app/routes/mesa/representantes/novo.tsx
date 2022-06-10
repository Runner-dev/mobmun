import type { Country, User } from "@prisma/client";
import type { ActionFunction, LoaderFunction } from "remix";
import { redirect } from "remix";
import { Form, json, Link, useLoaderData } from "remix";
import invariant from "tiny-invariant";
import { StyledInput, StyledSelect } from "~/components/StyledInputs";
import { getCountries } from "~/models/country.server";
import { createRepresentative } from "~/models/representative.server";
import { getUsersWithoutRepresentatives } from "~/models/user.server";
import { mediatorGuard } from "~/services/auth.server";

type LoaderData = {
  countries: Country[];
  users: User[];
};

export const loader: LoaderFunction = async ({ request, params }) => {
  const countries = await getCountries();
  if (!countries) return new Response("countries not found", { status: 404 });

  const users = await getUsersWithoutRepresentatives();
  if (!users) return new Response("users not found", { status: 404 });

  return json<LoaderData>({ countries, users });
};

export const action: ActionFunction = async ({ request }) => {
  await mediatorGuard(request);

  const formData = await request.formData();
  const name = formData.get("name");
  const countryId = formData.get("countryId");
  const userId = formData.get("userId");
  invariant(typeof name === "string", "content must be a string");
  invariant(typeof countryId === "string", "countryId must be a string");
  invariant(typeof userId === "string", "userId must be a string");

  await createRepresentative({
    name,
    countryId,
    userId,
  });

  return redirect("/mesa/representantes");
};

export default function NewCountry() {
  const { countries, users } = useLoaderData() as LoaderData;

  return (
    <div className="w-full max-w-[400px]">
      <Form method="post" className="flex flex-col gap-2">
        <StyledInput
          label="Nome do Representante"
          placeholder="João Silva"
          name="name"
        />

        <StyledSelect
          name="countryId"
          label="Nação"
          options={countries.map((country) => ({
            label: country.name,
            value: country.id,
          }))}
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
        />

        <div className="flex self-center gap-4 mt-2">
          <Link
            to="/mesa/representantes"
            className="px-4 py-2 text-white bg-gray-500 rounded-lg"
          >
            Voltar
          </Link>
          <button className="px-4 py-2 text-white bg-green-500 rounded-lg">
            Criar
          </button>
        </div>
      </Form>
    </div>
  );
}
