import type { Alliance } from "@prisma/client";
import { ActionFunction, LoaderFunction, redirect } from "remix";
import { Form, json, Link, useLoaderData } from "remix";
import invariant from "tiny-invariant";
import { StyledInput, StyledSelect } from "~/components/StyledInputs";
import { getAlliances } from "~/models/alliance.server";
import { createCountry } from "~/models/country.server";
import { mediatorGuard } from "~/services/auth.server";

type LoaderData = {
  alliances: Alliance[];
};

export const loader: LoaderFunction = async ({ request, params }) => {
  const alliances = await getAlliances();
  if (!alliances) return new Response("alliances not found", { status: 404 });

  return json<LoaderData>({ alliances });
};

export const action: ActionFunction = async ({ request }) => {
  await mediatorGuard(request);

  const formData = await request.formData();
  const name = formData.get("name");
  const flag = formData.get("flag");
  const allianceId = formData.get("allianceId");
  invariant(typeof name === "string", "content must be a string");
  invariant(typeof flag === "string", "flag must be a string");
  invariant(typeof allianceId === "string", "allianceId must be a string");

  await createCountry({
    name,
    flag,
    allianceId: allianceId === "noAlliance" ? null : allianceId,
  });
  return redirect("/mesa/paises");
};

export default function NewCountry() {
  const { alliances } = useLoaderData() as LoaderData;

  return (
    <div className="flex w-full max-w-[400px] flex-col gap-2">
      <Form method="post">
        <StyledInput label="Nome" placeholder="Brasil" name="name" />
        <StyledInput
          label="Link Foto Bandeira"
          placeholder="http://exemplo.com/imagem.png"
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
          defaultSelection={"noAlliance"}
        />

        <div className="flex self-center gap-4 mt-2">
          <Link
            to="/mesa/paises"
            className="px-4 py-2 text-white bg-gray-500 rounded-lg"
          >
            Voltar
          </Link>
          <button className="px-4 py-2 text-white bg-green-500 rounded-lg">
            Criar
          </button>
        </div>
      </Form>
      <hr className="w-full h-1 bg-gray-300" />
    </div>
  );
}
