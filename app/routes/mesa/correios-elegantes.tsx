import type { CorreiosElegantes } from "@prisma/client";
import { useLoaderData } from "@remix-run/react";
import type { LoaderFunction } from "@remix-run/server-runtime";
import { json } from "@remix-run/server-runtime";
import { getCorreios } from "~/models/correio.server";
import { mediatorGuard } from "~/services/auth.server";

type LoaderData = {
  correios: CorreiosElegantes[];
};

export const loader: LoaderFunction = async ({ request }) => {
  await mediatorGuard(request);
  const correios = await getCorreios();
  return json<LoaderData>({ correios });
};

export default function MediatorAlliances() {
  const { correios } = useLoaderData() as LoaderData;
  return (
    <div className="flex flex-col items-start gap-2 px-6 py-4 bg-gray-100">
      <h2 className="text-2xl font-bold ">Correios Elegantes</h2>
      <ul className="px-2 ml-2 list-disc">
        {correios.map((correio) => (
          <li key={correio.id} className="text-lg">
            {correio.mensagem}
          </li>
        ))}
      </ul>
    </div>
  );
}
