import { Authenticator } from "remix-auth";
import type { User } from "~/models/user.server";
import { updateRefreshTokenByUserId } from "~/models/user.server";
import { createUser, getUserByEmail } from "~/models/user.server";
import { sessionStorage } from "~/services/session.server";
import { GoogleStrategy } from "remix-auth-google";
import invariant from "tiny-invariant";
import { redirect } from "@remix-run/server-runtime";

export let authenticator = new Authenticator<User>(sessionStorage);

invariant(process.env.OAUTH_CLIENT_ID, "OAUTH_CLIENT_ID must be set");
invariant(process.env.OAUTH_CLIENT_SECRET, "OAUTH_CLIENT_SECRET must be set");
invariant(process.env.CALLBACK_HOST, "CALLBACK_HOST must be set");

let googleStrategy = new GoogleStrategy<User>(
  {
    clientID: process.env.OAUTH_CLIENT_ID,
    clientSecret: process.env.OAUTH_CLIENT_SECRET,
    callbackURL: `${process.env.CALLBACK_HOST}/auth/google/callback`,
    accessType: "offline",
    prompt: "consent",
    scope:
      "https://www.googleapis.com/auth/drive.file  https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile",
  },
  async ({ accessToken, refreshToken, extraParams, profile }) => {
    const { value: email } = profile.emails[0];
    const { displayName } = profile;
    let user = await getUserByEmail(email);
    if (!user) user = await createUser({ email, refreshToken, displayName });
    else await updateRefreshTokenByUserId(refreshToken, user.id);
    return user;
  }
);

authenticator.use(googleStrategy);

export async function mediatorGuard(
  request: Request,
  failureUrl: string = "/"
) {
  const user = authenticator.isAuthenticated(request, {
    failureRedirect: failureUrl,
  });
  if (!user) throw redirect(failureUrl);
  if (!(await user).mediator) throw redirect(failureUrl);
  return user;
}
