import { ActionFunction, redirect } from "@remix-run/server-runtime";
import { authenticator } from "~/services/auth.server";

export const action: ActionFunction = async ({ request }) => {
  return authenticator.logout(request, { redirectTo: "/" });
};

export const loader = () => redirect("/");
