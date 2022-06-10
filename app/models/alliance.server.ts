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

export async function createAlliance({ name }: { name: string }) {
  return prisma.alliance.create({ data: { name } });
}

export async function getAlliances() {
  return prisma.alliance.findMany({});
}

export async function getAllianceById(id: string) {
  return prisma.alliance.findFirst({
    where: { id },
    include: { countries: true },
  });
}

export async function updateAlliance({
  name,
  id,
}: {
  name: string;
  id: string;
}) {
  return prisma.alliance.update({
    where: { id },
    data: { name },
  });
}

export async function deleteAlliance(id: string) {
  return prisma.alliance.delete({
    where: { id },
  });
}
