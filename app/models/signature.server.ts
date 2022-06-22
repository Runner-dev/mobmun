import { prisma } from "~/services/db.server";

export function getDocumentSignatures(documentId: string) {
  return prisma.signature.findMany({
    where: {
      documentId,
    },
    include: {
      country: true,
    },
    orderBy: {
      createdAt: "asc",
    },
  });
}

export function createSignature({
  countryId,
  documentId,
}: {
  countryId: string;
  documentId: string;
}) {
  return prisma.signature.create({
    data: {
      countryId,
      documentId,
    },
  });
}

export function deleteSignature(id: string) {
  return prisma.signature.delete({
    where: { id },
    select: { documentId: true },
  });
}
