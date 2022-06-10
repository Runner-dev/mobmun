import { Alliance } from "@prisma/client";
import type { LoaderFunction } from "remix";
import { json, Link, useLoaderData } from "remix";
import { getAllianceByUser, getAlliances } from "~/models/alliance.server";
import type { Announcement } from "~/models/announcement.server";
import { getAnnouncements } from "~/models/announcement.server";

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
