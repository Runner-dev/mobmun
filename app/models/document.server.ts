import { prisma } from "~/services/db.server";
export type { Document } from "@prisma/client";

export async function createSpecificDocument({
  sharedWith,
  name,
  fileId,
}: {
  sharedWith: string[];
  fileId: string;
  name: string;
}) {
  return prisma.document.create({
    data: {
      name,
      id: fileId,
      sharing: {
        create: {
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
}: {
  allianceId: string;
  name: string;
  fileId: string;
}) {
  return prisma.document.create({
    data: {
      name,
      id: fileId,
      sharing: {
        create: {
          allianceId,
        },
      },
    },
  });
}

export async function createPublicDocument({
  name,
  fileId,
}: {
  name: string;
  fileId: string;
}) {
  console.log(name);
  return prisma.document.create({
    data: {
      id: fileId,
      name,
      sharing: {
        create: {
          public: true,
        },
      },
    },
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
        ],
      },
    },
  });
}

export function getDocumentById(id: string) {
  return prisma.document.findUnique({ where: { id } });
}
