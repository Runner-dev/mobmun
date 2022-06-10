import { Conversation } from "@prisma/client";
import { useContext, useEffect, useState } from "react";
import {
  json,
  Link,
  LoaderFunction,
  Outlet,
  useLoaderData,
  useParams,
} from "remix";
import Navbar from "~/components/Navbar";
import { getAllConversationsForUser } from "~/models/conversation.server";
import { authenticator } from "~/services/auth.server";
import { socketContext } from "~/sockets/context";
import { useUser } from "~/utils";

type LoaderData = {
  conversations: Conversation[];
};

export const loader: LoaderFunction = async ({ request }) => {
  const user = await authenticator.isAuthenticated(request, {
    failureRedirect: "/",
  });
  const conversations = await getAllConversationsForUser(user.id);
  return json<LoaderData>({ conversations });
};

export default function Mensagens() {
  const { conversations } = useLoaderData() as LoaderData;
  const [unreadConversations, setUnreadConversations] = useState<string[]>([]);

  const params = useParams();
  const currentConversation = params.id || "";

  const socket = useContext(socketContext);

  useEffect(() => {
    if (unreadConversations.some((id) => currentConversation === id)) {
      setUnreadConversations(
        unreadConversations.filter((id) => id !== currentConversation)
      );
    }
  }, [currentConversation, unreadConversations]);

  useEffect(() => {
    if (socket) {
      const listener = (conversationId: string) => {
        if (conversationId !== currentConversation)
          setUnreadConversations((prev) => [...prev, conversationId]);
      };
      socket.on("message", listener);

      return () => socket.off("message", listener);
    }

    return () => {};
  }, [currentConversation, socket]);

  return (
    <>
      <Navbar />
      <div className="flex h-[calc(100vh-4rem)] w-full items-stretch">
        <ul className="flex w-[300px] flex-initial flex-col items-stretch border-r bg-gray-50 shadow-xl">
          {conversations.map((conversation) => (
            <li
              key={conversation.id}
              className="flex items-stretch border-b-2 border-gray-200 hover:bg-blue-100"
            >
              <Link
                to={conversation.id}
                className="flex items-center justify-between flex-1 w-full p-4"
              >
                <div>{conversation.name}</div>
                {unreadConversations.some((id) => conversation.id === id) && (
                  <div className="w-4 h-4 text-right rounded-full bg-blue-500/60">
                    &nbsp;
                  </div>
                )}
              </Link>
            </li>
          ))}
        </ul>
        <div className="flex-1 bg-white">
          <Outlet />
        </div>
      </div>
    </>
  );
}
