import type { LoaderFunction } from "remix";
import { json, Link, useLoaderData } from "remix";
import type { Announcement } from "~/models/announcement.server";
import { getAnnouncements } from "~/models/announcement.server";

type LoaderData = {
  announcements: Announcement[];
};

export const loader: LoaderFunction = async () => {
  const announcements = await getAnnouncements();

  return json<LoaderData>({ announcements });
};

export default function MediatorAnnouncementsList() {
  const { announcements } = useLoaderData() as LoaderData;
  return (
    <>
      <ul className="px-2 ml-2 list-disc">
        {announcements.map((announcement) => (
          <li
            key={announcement.id}
            className="text-lg uppercase hover:text-blue-500"
          >
            <Link to={announcement.id}>
              {announcement.fictionalDateStr} -&nbsp;
              {announcement.content}
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
