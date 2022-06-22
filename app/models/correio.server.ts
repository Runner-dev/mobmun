import { prisma } from "~/services/db.server";

export function createCorreio(message: string) {
  return prisma.correiosElegantes.create({ data: { mensagem: message } });
}

export function getCorreios() {
  return prisma.correiosElegantes.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });
}
