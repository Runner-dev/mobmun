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

import tailwindStylesheetUrl from "./compiledStyles/tailwind.css";
import modalOverrideUrl from "./styles/modalOverride.css";
import { useEffect, useState } from "react";
import { Socket } from "socket.io-client";
import { DefaultEventsMap } from "socket.io/dist/typed-events";
import { connect } from "./sockets/client";
import { socketContext } from "./sockets/context";
import { useOptionalUser } from "./utils";

export const links: LinksFunction = () => {
  return [
    { rel: "stylesheet", href: tailwindStylesheetUrl },
    { rel: "stylesheet", href: modalOverrideUrl },
  ];
};

export const meta: MetaFunction = () => ({
  charset: "utf-8",
  title: "Remix Notes",
  viewport: "width=device-width,initial-scale=1",
});

export const loader: LoaderFunction = async ({ request, context }) => {
  const user = await authenticator.isAuthenticated(request);
  return json({ user: user });
};

export default function App() {
  const [socket, setSocket] =
    useState<Socket<DefaultEventsMap, DefaultEventsMap>>();

  const user = useOptionalUser();

  useEffect(() => {
    const connection = connect();
    setSocket(connection);
    return () => {
      connection.close();
    };
  }, []);

  useEffect(() => {
    console.log("sent");
    if (user) socket?.send("user", user.id);
    else socket?.send("noUser");
  }, [socket, user]);

  return (
    <html lang="en" className="h-full">
      <head>
        <Meta />
        <Links />
      </head>
      <body className="h-full">
        <socketContext.Provider value={socket}>
          <Outlet />
        </socketContext.Provider>
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}
