import { prisma } from "~/services/db.server";

export function getAllConversationsForUser(userId: string) {
  return prisma.conversation.findMany({
    where: {
      OR: [
        {
          countryMembers: {
            some: { country: { representatives: { some: { userId } } } },
          },
        },
        {
          newsOrgMembers: {
            some: { newsOrg: { representatives: { some: { userId } } } },
          },
        },
      ],
    },
  });
}

export function getConversationByIdWithMessages(conversationId: string) {
  return prisma.conversation.findUnique({
    where: {
      id: conversationId,
    },
    include: {
      messages: {
        include: {
          countryAuthor: { include: { country: true } },
          newsOrgAuthor: {
            include: {
              user: { select: { displayName: true } },
              newsOrg: { select: { name: true } },
            },
          },
        },
      },
    },
  });
}

export async function getConversationMembersWithUsers(conversationId: string) {
  const [countryMembers, newsMembers] = await Promise.all([
    prisma.conversationCountryMember.findMany({
      where: { conversationId },
      include: {
        country: { include: { representatives: { select: { userId: true } } } },
      },
    }),
    prisma.conversationNewsOrgMember.findMany({
      where: { conversationId },
      include: {
        newsOrg: { include: { representatives: { select: { userId: true } } } },
      },
    }),
  ]);

  return { countryMembers, newsMembers };
}

export async function createConversation({
  name,
  countries,
  newsOrgs,
}: {
  name: string;
  countries: string[];
  newsOrgs: string[];
}) {
  return prisma.conversation.create({
    data: {
      name,
      countryMembers: {
        create: countries.map((country) => ({ countryId: country })),
      },
      newsOrgMembers: {
        create: newsOrgs.map((newsOrg) => ({ newsOrgId: newsOrg })),
      },
    },
  });
}
