import { prisma } from "~/services/db.server";
export type { Document } from "@prisma/client";

export async function createSpecificDocument({
  sharedWith,
  name,
  fileId,
  countryId,
}: {
  sharedWith: string[];
  fileId: string;
  name: string;
  countryId: string;
}) {
  return prisma.document.create({
    data: {
      name,
      id: fileId,
      sharing: {
        create: {
          sharerId: countryId,
          sharingCountry: {
            create: sharedWith.map((country) => ({ countryId: country })),
          },
        },
      },
    },
  });
}

export async function createAllianceDocument({
  allianceId,
  name,
  fileId,
  countryId,
}: {
  allianceId: string;
  name: string;
  fileId: string;
  countryId: string;
}) {
  return prisma.document.create({
    data: {
      name,
      id: fileId,
      sharing: {
        create: {
          allianceId: allianceId,
          sharerId: countryId,
        },
      },
    },
  });
}

export async function createPublicDocument({
  name,
  fileId,
  countryId,
}: {
  name: string;
  fileId: string;
  countryId: string;
}) {
  return prisma.document.create({
    data: {
      id: fileId,
      name,
      sharing: {
        create: {
          sharerId: countryId,
          public: true,
        },
      },
    },
  });
}

export async function getPublicDocuments() {
  return prisma.document.findMany({
    select: { id: true, name: true },
    where: { sharing: { public: true } },
  });
}

export async function getDocuments(userId: string) {
  return prisma.document.findMany({
    select: { id: true, name: true },
    where: {
      sharing: {
        OR: [
          {
            sharingCountry: {
              some: { country: { representatives: { some: { userId } } } },
            },
          },
          {
            public: true,
          },
          {
            alliance: {
              countries: { some: { representatives: { some: { userId } } } },
            },
          },
          {
            public: false,
            allianceId: null,
            sharer: { representatives: { some: { userId } } },
          },
        ],
      },
    },
  });
}

export function getDocumentById(id: string) {
  return prisma.document.findUnique({
    where: { id },
  });
}

export function deleteDocument(id: string) {
  return prisma.document.delete({ where: { id } });
}
