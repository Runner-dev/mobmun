import type {
  LinksFunction,
  LoaderFunction,
  MetaFunction,
} from "@remix-run/node";
import { json } from "@remix-run/node";
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";
import { authenticator } from "./services/auth.server";
import { sessionStorage } from "./services/session.server";

import fontsStylesheetUrl from "./styles/font.css";
import tailwindStylesheetUrl from "./styles/tailwind.css";
import modalOverrideUrl from "./styles/modalOverride.css";

export const links: LinksFunction = () => {
  return [
    { rel: "stylesheet", href: fontsStylesheetUrl },
    { rel: "stylesheet", href: tailwindStylesheetUrl },
    { rel: "stylesheet", href: modalOverrideUrl },
  ];
};

export const meta: MetaFunction = () => ({
  charset: "utf-8",
  title: "Remix Notes",
  viewport: "width=device-width,initial-scale=1",
});

export const loader: LoaderFunction = async ({ request }) => {
  const user = await authenticator.isAuthenticated(request);
  return json({ user: user });
};

export default function App() {
  return (
    <html lang="en" className="h-full">
      <head>
        <Meta />
        <Links />
      </head>
      <body className="h-full">
        <Outlet />
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}
