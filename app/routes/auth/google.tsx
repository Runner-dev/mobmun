import type { ActionFunction, LoaderFunction } from "@remix-run/server-runtime";
import { redirect } from "@remix-run/server-runtime";
import { authenticator } from "~/services/auth.server";

export let loader: LoaderFunction = () => redirect("/");

export let action: ActionFunction = ({ request }) => {
  return authenticator.authenticate("google", request);
};
