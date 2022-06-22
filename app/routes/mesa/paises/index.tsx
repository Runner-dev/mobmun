import type { Country } from "@prisma/client";
import { Link, useLoaderData } from "@remix-run/react";
import type { LoaderFunction } from "@remix-run/server-runtime";
import { json } from "@remix-run/server-runtime";
import { getCountries } from "~/models/country.server";

type LoaderData = {
  countries: Country[];
};

export const loader: LoaderFunction = async () => {
  const countries = await getCountries();

  return json<LoaderData>({ countries });
};

export default function MediatorAnnouncementsList() {
  const { countries } = useLoaderData() as LoaderData;
  return (
    <>
      <ul className="flex flex-col gap-2 px-2 ml-2">
        {countries.map((country) => (
          <li key={country.id} className="text-lg hover:text-blue-500">
            <Link to={country.id} className="flex items-center gap-2 ">
              <img
                src={country.flag}
                alt={`Bandeira ${country.name}`}
                className="object-cover w-8 h-8 border border-gray-100 rounded-full shadow"
              />
              {country.name}
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
