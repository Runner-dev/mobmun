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
  useLocation,
} from "@remix-run/react";
import { authenticator } from "./services/auth.server";
import { Toaster } from "react-hot-toast";

import tailwindStylesheetUrl from "./compiledStyles/tailwind.css";
import modalOverrideUrl from "./styles/modalOverride.css";
import { useEffect, useState } from "react";
import type { Socket } from "socket.io-client";
import type { DefaultEventsMap } from "socket.io/dist/typed-events";
import { connect } from "./sockets/client";
import { socketContext } from "./sockets/context";
import { useOptionalUser } from "./utils";
import { unreadMessagesContext } from "./unreadMessagesContext";

export const links: LinksFunction = () => {
  return [
    { rel: "stylesheet", href: tailwindStylesheetUrl },
    { rel: "stylesheet", href: modalOverrideUrl },
  ];
};

export const meta: MetaFunction = () => ({
  charset: "utf-8",
  title: "Site do MobMun",
  viewport: "width=device-width,initial-scale=1",
});

export const loader: LoaderFunction = async ({ request, context }) => {
  const user = await authenticator.isAuthenticated(request);
  return json({ user: user });
};

export default function App() {
  const [socket, setSocket] =
    useState<Socket<DefaultEventsMap, DefaultEventsMap>>();

  const location = useLocation();

  const [unreadMessages, setUnreadMessages] = useState(false);

  useEffect(() => {
    if (socket) {
      const listener = (conversationId: string, message: any) => {
        if (!location.pathname.includes("mensagens")) {
          setUnreadMessages(true);
        }
      };
      socket.on("message", listener);

      return () => socket.off("message", listener);
    }

    return () => {};
  }, [location.pathname, socket]);

  useEffect(() => {
    if (location.pathname.includes("mensagens") && unreadMessages) {
      setUnreadMessages(false);
    }
  }, [location.pathname, unreadMessages]);

  const user = useOptionalUser();

  useEffect(() => {
    const connection = connect();
    setSocket(connection);
    return () => {
      connection.close();
    };
  }, []);

  useEffect(() => {
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
        <Toaster />
        <socketContext.Provider value={socket}>
          <unreadMessagesContext.Provider value={unreadMessages}>
            <Outlet />
          </unreadMessagesContext.Provider>
        </socketContext.Provider>
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}
