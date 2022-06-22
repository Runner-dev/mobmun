import type { Country, CountryRepresentative } from "@prisma/client";
import { useLoaderData, Link } from "@remix-run/react";
import type { LoaderFunction } from "@remix-run/server-runtime";
import { json } from "@remix-run/server-runtime";
import { getCountryRepresentatives } from "~/models/representative.server";

type LoaderData = {
  representatives: (CountryRepresentative & {
    country: Country;
  })[];
};

export const loader: LoaderFunction = async () => {
  const representatives = await getCountryRepresentatives();

  return json<LoaderData>({ representatives });
};

export default function MediatorAnnouncementsList() {
  const { representatives } = useLoaderData() as LoaderData;
  return (
    <>
      <ul className="px-2 ml-2">
        {representatives.map(({ id, country, name }) => (
          <li key={id} className="text-lg hover:text-blue-500">
            <Link to={id} className="flex items-center gap-2 ">
              <img
                src={country.flag}
                alt={`Bandeira ${country.name}`}
                className="object-cover w-8 h-8 border border-gray-100 rounded-full shadow"
              />
              {name}
            </Link>
          </li>
        ))}
      </ul>
      <Link to="novo" className="px-4 py-2 text-white bg-green-500 rounded-lg">
        Novo
      </Link>
    </>
  );
}
