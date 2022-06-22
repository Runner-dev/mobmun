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
      <div className="flex h-screen w-full items-stretch lg:h-[calc(100vh-4rem)]">
        <ul className="flex w-[300px] flex-initial flex-col items-stretch overflow-y-auto border-r bg-gray-50 shadow-xl">
          {conversations.map((conversation) => (
            <li
              key={conversation.id}
              className="flex items-stretch border-b-2 border-gray-200 hover:bg-blue-100"
            >
              <Link
                to={conversation.id}
                className="flex w-full flex-1 items-center justify-between p-4"
              >
                <div>{conversation.name}</div>
                {unreadConversations.some((id) => conversation.id === id) && (
                  <div className="h-4 w-4 rounded-full bg-blue-500/60 text-right">
                    &nbsp;
                  </div>
                )}
              </Link>
            </li>
          ))}
          <Link
            to={"novaConversa"}
            className="fixed bottom-4 left-[calc(300px-4rem)] rounded-full bg-blue-500 p-2 text-white"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                clipRule="evenodd"
              />
            </svg>
          </Link>
        </ul>
        <div className="flex-1 bg-white">
          <Outlet />
        </div>
      </div>
    </>
  );
}
