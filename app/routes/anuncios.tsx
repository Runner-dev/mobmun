import type { Announcement } from "~/models/announcement.server";
import { getAnnouncements } from "~/models/announcement.server";
import type { LoaderFunction } from "@remix-run/server-runtime";
import { json } from "@remix-run/server-runtime";
import Navbar from "~/components/Navbar";
import { useLoaderData } from "@remix-run/react";

type LoaderData = {
  announcements: Array<Announcement>;
};

export const loader: LoaderFunction = async ({ request }) => {
  const announcements = await getAnnouncements();
  return json<LoaderData>({ announcements });
};

export default function Announcements() {
  const { announcements } = useLoaderData() as LoaderData;
  return (
    <>
      <Navbar />
      <main className="flex-col bg-white sm:flex sm:items-center">
        <h1 className="my-8 text-4xl font-medium">Anúncios</h1>
        <ol>
          {announcements.map((announcement) => (
            <li key={announcement.id} className="text-2xl uppercase">
              {announcement.fictionalDateStr} -&nbsp;
              {announcement.content}
            </li>
          ))}
        </ol>
      </main>
    </>
  );
}
