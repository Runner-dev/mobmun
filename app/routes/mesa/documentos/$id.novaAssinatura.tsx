import { Form, Link, useLoaderData } from "@remix-run/react";
import type { ActionFunction, LoaderFunction } from "@remix-run/server-runtime";
import { json, redirect } from "@remix-run/server-runtime";
import invariant from "tiny-invariant";
import { StyledSelect } from "~/components/StyledInputs";
import type { Country } from "~/models/country.server";
import { getCountries } from "~/models/country.server";
import { createSignature } from "~/models/signature.server";
import { mediatorGuard } from "~/services/auth.server";

type LoaderData = {
  countries: Country[];
};

export const loader: LoaderFunction = async ({ request, params }) => {
  const countries = await getCountries();
  return json<LoaderData>({ countries });
};

export const action: ActionFunction = async ({ request, params }) => {
  await mediatorGuard(request);

  const formData = await request.formData();
  const countryId = formData.get("countryId");
  const documentId = params.id;
  invariant(typeof countryId === "string", "countryId must be a string");
  invariant(typeof documentId === "string", "documentId must be a string");

  await createSignature({ countryId, documentId });

  return redirect(`/mesa/documentos/${documentId}`);
};

export default function MediatorNewSignature() {
  const { countries } = useLoaderData() as LoaderData;
  return (
    <Form method="post" className="flex w-full max-w-[400px] flex-col gap-2">
      <StyledSelect
        name="countryId"
        label="País Signatário"
        options={countries.map((country) => ({
          label: country.name,
          value: country.id,
        }))}
      />
      <div className="flex self-center gap-4 mt-2">
        <Link to="./.." className="px-4 py-2 text-white bg-gray-500 rounded-lg">
          Cancelar
        </Link>
        <button className="px-4 py-2 text-white bg-green-500 rounded-lg">
          Criar
        </button>
      </div>
    </Form>
  );
}
