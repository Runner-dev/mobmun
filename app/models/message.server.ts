import type {
  Country,
  CountryRepresentative,
  Message,
  NewsOrgRepresentative,
} from "@prisma/client";
import { prisma } from "~/services/db.server";
import type { FormattedRepresentative } from "./representative.server";
import { formatRepresentative } from "./representative.server";

export function createMessage({
  text,
  conversationId,
  countryAuthorId,
  newsAuthorId,
}: {
  text: string;
  conversationId: string;
  countryAuthorId?: string;
  newsAuthorId?: string;
}) {
  return prisma.message.create({
    data: {
      text,
      conversationId,
      countryAuthorId,
      newsOrgAuthorId: newsAuthorId,
    },
  });
}

export function formatMessage(
  message: Message & {
    countryAuthor:
      | (CountryRepresentative & {
          country: Country;
        })
      | null;
    newsOrgAuthor:
      | (NewsOrgRepresentative & {
          newsOrg: { name: string };
          user: { displayName: string };
        })
      | null;
  }
) {
  return {
    ...message,
    author: formatRepresentative(message),
  };
}

export async function getMessageForSocket(messageId: string) {
  const result = await prisma.message.findUnique({
    where: {
      id: messageId,
    },
    include: {
      countryAuthor: { include: { country: true } },
      newsOrgAuthor: {
        include: {
          user: { select: { displayName: true } },
          newsOrg: { select: { name: true } },
        },
      },
    },
  });
  if (result) return formatMessage(result);
  return null;
}

export type FormattedMessage = {
  text: string;
  id: string;
  author: FormattedRepresentative;
  createdAt: Date;
};
