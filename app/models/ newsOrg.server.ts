import { prisma } from "~/services/db.server";

export async function getNewsOrgsExceptOwn(userId: string) {
  return prisma.newsOrg.findMany({
    where: {
      representatives: {
        none: { userId },
      },
    },
  });
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
