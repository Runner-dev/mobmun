import { Alliance, Country } from "@prisma/client";
import type { ActionFunction, LoaderFunction } from "remix";
import { Form, json, Link, redirect, useLoaderData } from "remix";
import invariant from "tiny-invariant";
import { StyledInput, StyledSelect } from "~/components/StyledInputs";
import { getAlliances } from "~/models/alliance.server";
import {
  deleteCountry,
  getCountries,
  getCountryById,
  updateCountry,
} from "~/models/country.server";

import { mediatorGuard } from "~/services/auth.server";
import { getDateFromInternationalString } from "~/utils";

type LoaderData = {
  country: Country;
  alliances: Alliance[];
};

export const loader: LoaderFunction = async ({ request, params }) => {
  await mediatorGuard(request);

  invariant(typeof params.id === "string");
  const alliances = await getAlliances();
  if (!alliances) return new Response("alliances not found", { status: 404 });
  const country = await getCountryById(params.id);
  if (!country) return new Response("country not found", { status: 404 });

  return json<LoaderData>({ alliances, country });
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
    const flag = formData.get("flag");
    invariant(typeof flag === "string", "flag must be a string");
    const allianceId = formData.get("allianceId");
    invariant(typeof allianceId === "string", "allianceId must be a string");

    await updateCountry(
      allianceId === "noAlliance"
        ? {
            id,
            name,
            flag,
            allianceId: null,
          }
        : { id, name, flag, allianceId }
    );
    return json({});
  } else if (action === "delete") {
    await deleteCountry(id);
    return redirect("/mesa/paises");
  }
  return new Response("Invalid action", { status: 400 });
};

export default function NewAnnouncement() {
  const { alliances, country } = useLoaderData() as LoaderData;

  return (
    <div className="flex w-full max-w-[400px] flex-col gap-2">
      <Form method="post">
        <StyledInput
          label="Nome"
          placeholder="Brasil"
          defaultValue={country.name}
          name="name"
        />
        <StyledInput
          label="Link Foto Bandeira"
          placeholder="http://exemplo.com/imagem.png"
          defaultValue={country.flag}
          name="flag"
        />
        <StyledSelect
          name="allianceId"
          label="Aliança"
          options={[
            { label: "Sem Aliança", value: "noAlliance" },
            ...alliances.map((alliance) => ({
              label: alliance.name,
              value: alliance.id,
            })),
          ]}
          defaultSelection={country.allianceId || "noAlliance"}
        />

        <div className="flex self-center gap-4 mt-2">
          <Link
            to="/mesa/paises"
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
    </div>
  );
}
