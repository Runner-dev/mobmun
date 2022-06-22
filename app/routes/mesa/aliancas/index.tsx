import type { Alliance } from "@prisma/client";
import { Link, useLoaderData } from "@remix-run/react";
import type { LoaderFunction } from "@remix-run/server-runtime";
import { json } from "@remix-run/server-runtime";
import { getAlliances } from "~/models/alliance.server";

type LoaderData = {
  alliances: Alliance[];
};

export const loader: LoaderFunction = async () => {
  const alliances = await getAlliances();

  return json<LoaderData>({ alliances });
};

export default function MediatorAnnouncementsList() {
  const { alliances } = useLoaderData() as LoaderData;
  return (
    <>
      <ul className="px-2 ml-2 list-disc">
        {alliances.map((alliance) => (
          <li key={alliance.id} className="text-lg hover:text-blue-500">
            <Link to={alliance.id}>{alliance.name}</Link>
          </li>
        ))}
      </ul>
      <Link to="nova" className="px-4 py-2 text-white bg-green-500 rounded-lg">
        Nova
      </Link>
    </>
  );
}
