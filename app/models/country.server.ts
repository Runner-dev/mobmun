import { prisma } from "../services/db.server";

export type { Country } from "@prisma/client";

export async function getCountries() {
  return prisma.country.findMany();
}

export async function getCountriesExceptOwn(userId: string) {
  return prisma.country.findMany({
    where: { representatives: { none: { userId } } },
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
