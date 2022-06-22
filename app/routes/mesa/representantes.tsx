import { Outlet } from "@remix-run/react";
import type { LoaderFunction } from "@remix-run/server-runtime";
import { json } from "@remix-run/server-runtime";
import { mediatorGuard } from "~/services/auth.server";

export const loader: LoaderFunction = async ({ request }) => {
  await mediatorGuard(request);
  return json({});
};

export default function MediatorRepresentatives() {
  return (
    <div className="flex flex-col items-start gap-2 px-6 py-4 bg-gray-100">
      <h2 className="text-2xl font-bold ">Representantes</h2>
      <Outlet />
    </div>
  );
}
