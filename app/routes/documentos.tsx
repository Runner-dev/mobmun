import { Link, Outlet } from "@remix-run/react";
import Navbar from "~/components/Navbar";
import { authenticator } from "~/services/auth.server";

export default function Documentos() {
  return (
    <>
      <Navbar />
      <h1 className="flex-wrap w-full p-4 text-xl font-medium bg-gray-200">
        Documentos
      </h1>
      <Outlet />
    </>
  );
}
