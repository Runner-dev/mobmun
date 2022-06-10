import type { ActionFunction, LoaderFunction } from "remix";
import { Form, json, useLoaderData, useParams, useTransition } from "remix";
import invariant from "tiny-invariant";
import { getConversationByIdWithMessages } from "~/models/conversation.server";
import type { Conversation as ConversationType, Message } from "@prisma/client";
import { authenticator } from "~/services/auth.server";
import type { FormattedRepresentative } from "~/models/representative.server";
import {
  getRepresentativeByUserId,
  getRepresentativeByUserIdWithOrg,
  isNewsRepresentative,
} from "~/models/representative.server";
import type { FormattedMessage } from "~/models/message.server";
import { createMessage, formatMessage } from "~/models/message.server";
import { useContext, useEffect, useRef, useState } from "react";
import { socketContext } from "~/sockets/context";
import { sendMessageToUsers } from "~/services/socket.server";
import { v4 } from "uuid";
import { newsOrgImages } from "~/bowserConstants";

type LoaderData = {
  conversationData: ConversationType & {
    messages: FormattedMessage[];
  };
  representativeData: FormattedRepresentative;
};

export const loader: LoaderFunction = async ({ params, request }) => {
  const id = params.id;
  invariant(typeof id === "string");

  const user = await authenticator.isAuthenticated(request, {
    failureRedirect: "/",
  });

  const conversationData = await getConversationByIdWithMessages(id);

  if (!conversationData)
    throw new Response("Conversa não encontrada", { status: 404 });

  const formattedMessages: (Message & {
    author: { name: string; imageAlt: string; imageSrc: string };
  })[] = conversationData.messages.map(formatMessage);

  const userRep = await getRepresentativeByUserIdWithOrg(user.id);
  if (!userRep) throw new Response("Rep not found", { status: 404 });
  const formattedRep: FormattedRepresentative = isNewsRepresentative(userRep)
    ? {
        name: userRep.user.displayName,
        imageSrc:
          newsOrgImages[userRep.newsOrgId as keyof typeof newsOrgImages],
        imageAlt: `Logo ${userRep.newsOrg.name}`,
      }
    : {
        name: userRep.name,
        imageSrc: userRep.country.flag,
        imageAlt: `Bandeira ${userRep.country.name}`,
      };

  if (!userRep) throw new Error("No Representative");

  return json<LoaderData>({
    conversationData: { ...conversationData, messages: formattedMessages },
    representativeData: formattedRep,
  });
};

export const action: ActionFunction = async ({ params, request }) => {
  const id = params.id;
  invariant(typeof id === "string");

  const formData = await request.formData();
  const message = formData.get("message");
  invariant(typeof message === "string");

  const user = await authenticator.isAuthenticated(request, {
    failureRedirect: "/",
  });

  const representative = await getRepresentativeByUserId(user.id);

  if (!representative)
    throw new Response("Representante não encontrado", { status: 404 });

  // const messageOptions = isNewsRepresentative(representative) ?

  const dbMessage = await createMessage({
    conversationId: id,
    text: message,
    countryAuthorId: isNewsRepresentative(representative)
      ? undefined
      : representative.id,
    newsAuthorId: isNewsRepresentative(representative)
      ? representative.id
      : undefined,
  });

  await sendMessageToUsers({
    messageId: dbMessage.id,
    senderId: user.id,
    conversationId: id,
  });

  return json({});
};

export default function Conversation() {
  const { conversationData, representativeData } =
    useLoaderData() as LoaderData;
  const { id } = useParams();

  const [messages, setMessages] = useState(conversationData.messages);

  const formRef = useRef<HTMLFormElement>(null);

  const transition = useTransition();
  const isSending = transition.state === "submitting";

  const socket = useContext(socketContext);

  useEffect(() => {
    if (socket) {
      const listener = (conversationId: string, message: any) => {
        if (conversationId === id)
          setMessages((oldMessages) => [...oldMessages, message]);
      };
      socket.on("message", listener);

      return () => socket.off("message", listener);
    }

    return () => {};
  }, [id, socket]);

  useEffect(() => {
    if (!isSending) {
      formRef.current?.reset();
    } else {
      const formData = transition.submission.formData;
      const text = formData.get("message");
      if (typeof text !== "string") return;
      setMessages((oldMessages) => [
        ...oldMessages,
        { text, id: v4(), author: representativeData },
      ]);
    }
  }, [isSending, representativeData, transition?.submission?.formData]);

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center h-12 p-2 text-xl border-b bg-blue-300/40">
        {conversationData.name}
      </div>
      <div className="h-full overflow-y-auto">
        {messages.map((message) => (
          <div key={message.id} className="flex items-start gap-4 p-4">
            <img
              className="object-cover h-10 rounded-full shadow-lg aspect-square shrink"
              src={message.author.imageSrc}
              alt={message.author.imageAlt}
            />
            <div className="flex flex-col items-start">
              <div className="text-sm font-semibold text-gray-700">
                {message.author.name}
              </div>
              <div>{message.text}</div>
            </div>
          </div>
        ))}
      </div>
      <div className="bg-blue-300/40">
        <Form
          method="post"
          className="flex justify-center max-w-screen-md gap-2 p-2 mx-auto h-14"
          ref={formRef}
        >
          <input
            type="text"
            name="message"
            className="flex-1 p-2 rounded-md "
            placeholder="Digite Sua Mensagem..."
            autoFocus
          />
          <button className="flex items-center justify-center w-10 h-10 text-white bg-blue-500 rounded-full">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-6 h-6"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
            </svg>
          </button>
        </Form>
      </div>
    </div>
  );
}
