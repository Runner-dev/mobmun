import { useLoaderData } from "@remix-run/react";
import { authenticator } from "~/services/auth.server";
import type { User } from "~/models/user.server";
import Navbar from "~/components/Navbar";
import type { LoaderFunction } from "@remix-run/server-runtime";
import { json } from "@remix-run/server-runtime";

type LoaderData = { user: User };

export default function Index() {
  return (
    <>
      <Navbar />
      <main className="relative bg-white sm:flex sm:items-center sm:justify-center"></main>
    </>
  );
}
