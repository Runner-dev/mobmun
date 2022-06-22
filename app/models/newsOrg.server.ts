import { prisma } from "~/services/db.server";

export async function getNewsOrgOutsideConversation(conversationId: string) {
  return prisma.newsOrg.findMany({
    where: {
      conversationNewsOrgMembers: {
        none: {
          conversationId,
        },
      },
    },
  });
}

export async function getNewsOrgsExceptOwn(userId: string) {
  return prisma.newsOrg.findMany({
    where: {
      representatives: {
        none: {
          userId,
        },
      },
    },
  });
}

export async function getNewsOrgs() {
  return prisma.newsOrg.findMany();
}

export async function getNewsOrgByUser(userId: string) {
  return prisma.newsOrg.findFirst({
    where: {
      representatives: {
        some: { userId },
      },
    },
  });
}
