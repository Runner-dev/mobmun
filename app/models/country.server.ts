import { prisma } from "../services/db.server";

export type { Country } from "@prisma/client";

export async function getCountries() {
  return prisma.country.findMany();
}

export async function getCountryById(id: string) {
  return prisma.country.findUnique({ where: { id } });
}

export async function getCountriesExceptOwn(userId: string) {
  return prisma.country.findMany({
    where: { representatives: { none: { userId } } },
  });
}

export async function getCountriesOutsideConversation(conversationId: string) {
  return prisma.country.findMany({
    where: { conversations: { none: { conversationId } } },
  });
}

export async function getCountriesOutsideAlliance(userId: string) {
  return prisma.country.findMany({
    where: {
      Alliance: {
        countries: { none: { representatives: { some: { userId } } } },
      },
    },
  });
}

export async function getCountryByUser(userId: string) {
  return prisma.country.findFirst({
    where: { representatives: { some: { userId } } },
  });
}

export async function updateCountry({
  id,
  name,
  flag,
  allianceId,
}: {
  id: string;
  name: string;
  flag: string;
  allianceId: string | null;
}) {
  return prisma.country.update({
    where: { id },
    data: { name, flag, allianceId },
  });
}

export async function deleteCountry(id: string) {
  return prisma.country.delete({ where: { id } });
}

export async function createCountry({
  name,
  flag,
  allianceId,
}: {
  name: string;
  flag: string;
  allianceId: string | null;
}) {
  return prisma.country.create({
    data: { name, flag, allianceId },
  });
}
