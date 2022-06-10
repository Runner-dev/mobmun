import type { LoaderFunction } from "remix";
import { json, Outlet } from "remix";
import { mediatorGuard } from "~/services/auth.server";

export const loader: LoaderFunction = async ({ request }) => {
  await mediatorGuard(request);
  return json({});
};

export default function MediatorAnnouncements() {
  return (
    <div className="flex flex-col items-start gap-2 px-6 py-4 bg-gray-100">
      <h2 className="text-2xl font-bold ">Anúncios</h2>
      <Outlet />
    </div>
  );
}
