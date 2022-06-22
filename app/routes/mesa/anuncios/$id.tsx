import { Form, Link, useLoaderData } from "@remix-run/react";
import {
  ActionFunction,
  json,
  LoaderFunction,
  redirect,
} from "@remix-run/server-runtime";
import invariant from "tiny-invariant";
import type { Announcement } from "~/models/announcement.server";
import {
  deleteAnnouncement,
  updateAnnouncement,
} from "~/models/announcement.server";
import { getAnnouncementById } from "~/models/announcement.server";
import { mediatorGuard } from "~/services/auth.server";
import useUpdating from "~/useUpdating";
import { getDateFromInternationalString } from "~/utils";

type LoaderData = {
  announcement: Announcement;
};

export const loader: LoaderFunction = async ({ request, params }) => {
  await mediatorGuard(request);

  invariant(typeof params.id === "string");
  const announcement = await getAnnouncementById(params.id);
  if (!announcement)
    return new Response("Announcement not found", { status: 404 });

  return json<LoaderData>({ announcement });
};

export const action: ActionFunction = async ({ request }) => {
  await mediatorGuard(request);

  const formData = await request.formData();
  const action = formData.get("_action");

  if (action === "update") {
    const content = formData.get("content");
    const dateStr = formData.get("date");
    const id = formData.get("id");
    invariant(typeof content === "string", "content must be a string");
    invariant(typeof dateStr === "string", "date must be a string");
    invariant(typeof id === "string", "id must be a string");

    const date = getDateFromInternationalString(dateStr);
    if (!date) return new Response("Invalid date", { status: 400 });
    await updateAnnouncement({ id, content, date, dateStr });
    return json({});
  } else if (action === "delete") {
    const id = formData.get("id");
    invariant(typeof id === "string", "id must be a string");
    await deleteAnnouncement(id);
    return redirect("/mesa/anuncios");
  }
  return new Response("Invalid action", { status: 400 });
};

export default function NewAnnouncement() {
  const { announcement } = useLoaderData() as LoaderData;

  useUpdating();

  return (
    <Form method="post" className="flex w-full max-w-[400px] flex-col gap-2">
      <input type="hidden" name="id" value={announcement.id} />
      <label className="flex flex-col">
        <span className="ml-1 text-sm font-bold">Anúncio:</span>
        <input
          type="text"
          name="content"
          placeholder="Exército invade..."
          defaultValue={announcement.content}
          className="w-full p-1 bg-white border rounded-lg"
        />
      </label>

      <label className="flex flex-col">
        <span className="ml-1 text-sm font-bold">Data:</span>
        <input
          type="text"
          name="date"
          placeholder="DD/MM/AAAA"
          defaultValue={announcement.fictionalDateStr}
          className="p-1 bg-white border rounded-lg"
        />
      </label>
      <div className="flex self-center gap-4 mt-2">
        <Link
          to="/mesa/anuncios"
          className="px-4 py-2 text-white bg-gray-500 rounded-lg"
        >
          Cancelar
        </Link>
        <button
          name="_action"
          value="delete"
          className="px-4 py-2 text-white bg-red-500 rounded-lg"
          onClick={(e) => {
            if (!confirm("Deseja mesmo apagar esse anúncio?"))
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
  );
}
