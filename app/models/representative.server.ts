import { prisma } from "~/services/db.server";
import type {
  Country,
  CountryRepresentative,
  NewsOrgRepresentative,
} from "@prisma/client";
import { newsOrgImages } from "~/bowserConstants";

export async function getRepresentativeByUserId(userId: string) {
  const [country, news] = await Promise.all([
    prisma.countryRepresentative.findFirst({ where: { userId } }),
    prisma.newsOrgRepresentative.findFirst({ where: { userId } }),
  ]);

  if (country) return country;
  if (news) return news;
  return null;
}
export async function getRepresentativeByUserIdWithOrg(userId: string) {
  const [country, news] = await Promise.all([
    prisma.countryRepresentative.findFirst({
      where: { userId },
      include: { country: true },
    }),
    prisma.newsOrgRepresentative.findFirst({
      where: { userId },
      include: {
        newsOrg: { select: { name: true } },
        user: { select: { displayName: true } },
      },
    }),
  ]);

  if (country) return country;
  if (news) return news;
  return null;
}

export function isNewsRepresentative(obj: any): obj is NewsOrgRepresentative {
  return obj && typeof obj.newsOrgId !== "undefined";
}

export function isCountryRepresentative(
  obj: any
): obj is CountryRepresentative {
  return obj && typeof obj.countryId !== "undefined";
}

export function getAvailableRepresentatives(countryId: string) {
  return prisma.countryRepresentative.findMany({
    where: { countryId, userId: null },
  });
}

export function formatRepresentative(rep: {
  countryAuthor:
    | (CountryRepresentative & {
        country: Country;
      })
    | null;
  newsOrgAuthor:
    | (NewsOrgRepresentative & {
        newsOrg: { name: string };
        user: { displayName: string };
      })
    | null;
}) {
  return {
    name: rep.countryAuthor?.name || rep.newsOrgAuthor?.user.displayName || "",
    imageSrc:
      rep.countryAuthor?.country.flag ||
      (!!rep.newsOrgAuthor && rep.newsOrgAuthor.newsOrgId
        ? newsOrgImages[
            rep.newsOrgAuthor!.newsOrgId as keyof typeof newsOrgImages
          ]
        : ""),
    imageAlt: rep.countryAuthor
      ? `Bandeira ${rep.countryAuthor.country.name}`
      : `Logo ${rep.newsOrgAuthor?.newsOrg.name}`,
  };
}

export type FormattedRepresentative = {
  name: string;
  imageAlt: string;
  imageSrc: string;
};

export function getCountryRepresentatives() {
  return prisma.countryRepresentative.findMany({
    include: { country: true },
    orderBy: {
      countryId: "asc",
    },
  });
}

export function getCountryRepresentativeById(id: string) {
  return prisma.countryRepresentative.findUnique({
    include: { user: true },
    where: { id },
  });
}

export function updateRepresentative({
  name,
  userId,
  countryId,
  id,
}: {
  name?: string;
  userId?: string | null;
  countryId?: string;
  id: string;
}) {
  return prisma.countryRepresentative.update({
    where: { id },
    data: {
      name,
      userId,
      countryId,
    },
  });
}

export function updateNewsRepresentative({
  id,
  newsOrgId,
}: {
  id: string;
  newsOrgId: string;
}) {
  return prisma.newsOrgRepresentative.update({
    where: { id },
    data: {
      newsOrgId,
    },
  });
}

export function deleteRepresentative(id: string) {
  return prisma.countryRepresentative.delete({
    where: { id },
  });
}

export function createRepresentative({
  name,
  userId,
  countryId,
}: {
  name: string;
  userId: string;
  countryId: string;
}) {
  return prisma.countryRepresentative.create({
    data: {
      name,
      userId,
      countryId,
    },
  });
}

export function createNewsRepresentative({
  newsOrgId,
  userId,
}: {
  newsOrgId: string;
  userId: string;
}) {
  return prisma.newsOrgRepresentative.create({
    data: {
      newsOrgId,
      userId,
    },
  });
}
