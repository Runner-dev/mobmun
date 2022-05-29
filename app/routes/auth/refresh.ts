import { Response } from "@remix-run/node";
import type { LoaderFunction } from "@remix-run/server-runtime";
import { redirect } from "@remix-run/server-runtime";
import { getRefreshTokenByUserId } from "~/models/user.server";
import { authenticator } from "~/services/auth.server";
import { sessionStorage } from "~/services/session.server";
import { safeRedirect } from "~/utils";

export const loader: LoaderFunction = async ({ request }) => {
  const url = new URL(request.url);
  const redirectTo = url.searchParams.get("redirectTo") || "/";
  const session = await sessionStorage.getSession(
    request.headers.get("cookie")
  );
  let authToken = session.get("authToken");
  if (authToken) return redirect(safeRedirect(redirectTo));

  const currentUser = await authenticator.isAuthenticated(request, {
    failureRedirect: "/auth/google",
  });

  const refreshToken = await getRefreshTokenByUserId(currentUser.id);

  if (!refreshToken) throw new Response("No refresh token", { status: 404 });

  const result = await fetch("https://www.googleapis.com/oauth2/v4/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      client_id: process.env.OAUTH_CLIENT_ID,
      client_secret: process.env.OAUTH_CLIENT_SECRET,
      refreshToken: refreshToken.refreshToken,
      grant_type: "refresh_token",
    }),
  });
  const response = await result.json();

  if (!response || !response.access_token) {
    console.error("Google Acess token error");
    throw new Response("Error", { status: 500 });
  }

  session.set("authToken", response.access_token);

  return redirect(safeRedirect(redirectTo), {
    headers: {
      "Set-Cookie": await sessionStorage.commitSession(session),
    },
  });
};