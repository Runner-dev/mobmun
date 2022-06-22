import type { LoaderFunction } from "@remix-run/server-runtime";
import { authenticator } from "~/services/auth.server";

export let loader: LoaderFunction = async ({ request }) => {
  await authenticator.authenticate("google", request, {
    failureRedirect: "/",
    successRedirect: "/auth/define-representative",
  });
};
