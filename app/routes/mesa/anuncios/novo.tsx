import { ActionFunction, Form, Link, redirect } from "remix";
import invariant from "tiny-invariant";
import { createAnnouncement } from "~/models/announcement.server";
import { mediatorGuard } from "~/services/auth.server";
import { getDateFromInternationalString } from "~/utils";

export const action: ActionFunction = async ({ request }) => {
  await mediatorGuard(request);

  const formData = await request.formData();
  const content = formData.get("content");
  const dateStr = formData.get("date");
  invariant(typeof content === "string", "content must be a string");
  invariant(typeof dateStr === "string", "date must be a string");
  const date = getDateFromInternationalString(dateStr);
  if (!date) return new Response("Invalid date", { status: 400 });
  await createAnnouncement({ content, date, dateStr });
  return redirect("/mesa/anuncios");
};

export default function NewAnnouncement() {
  return (
    <Form method="post" className="flex w-full max-w-[400px] flex-col gap-2">
      <label className="flex flex-col">
        <span className="ml-1 text-sm font-bold">Anúncio:</span>
        <input
          type="text"
          name="content"
          placeholder="Exército invade..."
          className="w-full p-1 bg-white border rounded-lg"
        />
      </label>

      <label className="flex flex-col">
        <span className="ml-1 text-sm font-bold">Data:</span>
        <input
          type="text"
          name="date"
          placeholder="DD/MM/AAAA"
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
        <button className="px-4 py-2 text-white bg-green-500 rounded-lg">
          Criar
        </button>
      </div>
    </Form>
  );
}
