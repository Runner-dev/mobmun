import { prisma } from "~/services/db.server";

export async function getAllianceByUser(userId: string) {
  return prisma.alliance.findFirst({
    where: {
      countries: {
        some: { representatives: { some: { userId } } },
      },
    },
  });
}
