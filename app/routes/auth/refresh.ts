import { Response } from "@remix-run/node";
import type { LoaderFunction } from "@remix-run/server-runtime";
import { redirect } from "@remix-run/server-runtime";
import { getRefreshTokenByUserId } from "~/models/user.server";
import { authenticator } from "~/services/auth.server";
import { sessionStorage } from "~/services/session.server";
import { safeRedirect } from "~/utils";

export const loader: LoaderFunction = async ({ request }) => {
  const url = new URL(request.url);
  const redirectTo = url.searchParams.get("redirect") || "/";
  const session = await sessionStorage.getSession(
    request.headers.get("cookie")
  );
  let sessionData = session.get("authToken");

  if (sessionData && sessionData.token && sessionData.expiry - Date.now() > 0)
    return redirect(safeRedirect(redirectTo));

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

  if (!response || !response.access_token || !response.expires_in) {
    console.error("Google Acess token error");
    throw new Response("Error", { status: 500 });
  }

  const expiryDate = new Date();

  expiryDate.setSeconds(expiryDate.getSeconds() + response.expires_in);

  session.set("authToken", {
    token: response.access_token,
    expiry: expiryDate.getTime(),
  });

  return redirect(safeRedirect(redirectTo), {
    headers: {
      "Set-Cookie": await sessionStorage.commitSession(session),
    },
  });
};
