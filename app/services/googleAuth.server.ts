import { google } from "googleapis";

export function getAuthClient(accessToken: string) {
  const client = new google.auth.OAuth2();
  client.setCredentials({ access_token: accessToken });
  return client;
}
