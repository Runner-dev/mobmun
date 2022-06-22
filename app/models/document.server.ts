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
    where: { sharing: { public: true }, approvalStatus: 1 },
  });
}

export async function getDocuments(userId: string) {
  return prisma.document.findMany({
    select: { id: true, name: true },
    where: {
      OR: [
        {
          approvalStatus: 1,
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
                  countries: {
                    some: { representatives: { some: { userId } } },
                  },
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
        {
          approvalStatus: 0,
          sharing: {
            sharer: { representatives: { some: { userId } } },
          },
        },
        {
          approvalStatus: -1,
          sharing: {
            sharer: { representatives: { some: { userId } } },
          },
        },
      ],
    },
  });
}

export async function getMediatorDocuments() {
  return prisma.document.findMany({ orderBy: { approvalStatus: "asc" } });
}

export function getDocumentById(id: string) {
  return prisma.document.findUnique({
    where: { id },
    include: { sharing: true },
  });
}

export function getMediatorDocumentById(id: string) {
  return prisma.document.findUnique({
    where: { id },
    include: {
      sharing: { include: { sharingCountry: { include: { country: true } } } },
      signatures: { include: { country: true } },
    },
  });
}

export function deleteDocument(id: string) {
  return prisma.document.delete({ where: { id } });
}

export async function updateDocumentApprovalStatus({
  id,
  approvalStatus,
}: {
  id: string;
  approvalStatus: number;
}) {
  return prisma.document.update({ where: { id }, data: { approvalStatus } });
}

export async function updateDocument({
  id,
  name,
  approvalStatus,
  allianceId,
  sharingCountriesIds,
  isPublic,
  sharerId,
  mediatorComment,
}: {
  id: string;
  name: string;
  approvalStatus: number;
  allianceId: string | null;
  sharingCountriesIds: string[];
  isPublic: boolean;
  sharerId: string;
  mediatorComment: string;
}) {
  const currentSharing = await prisma.sharing.findFirst({
    where: { document: { id } },
  });
  return prisma.document.update({
    where: { id },

    data: {
      name,
      approvalStatus,
      mediatorComment,
      sharing: {
        update: {
          allianceId,
          public: isPublic,
          sharerId,
          sharingCountry: {
            deleteMany: {
              countryId: { notIn: sharingCountriesIds },
            },
            connectOrCreate: sharingCountriesIds.map((country) => ({
              where: {
                countryId_sharingId: {
                  countryId: country,
                  sharingId: currentSharing?.id || "",
                },
              },
              create: {
                countryId: country,
              },
            })),
          },
        },
      },
    },
  });
}
