import type { Article } from "@prisma/client";
import { prisma } from "~/services/db.server";

export type { Article } from "@prisma/client";

export async function getArticlesByNewsOrg(newsOrg: string) {
  return prisma.article.findMany({
    where: { newsOrg },
    select: { slug: true, author: true, title: true },
  });
}

export async function getArticleBySlug(slug: string) {
  return prisma.article.findUnique({
    where: { slug },
  });
}

export async function createArticle(
  article: Pick<Article, "author" | "content" | "newsOrg" | "slug" | "title">
) {
  return prisma.article.create({ data: article });
}

export async function updateArticle(
  article: Pick<
    Article,
    "slug" | "author" | "content" | "newsOrg" | "slug" | "title"
  >
) {
  return prisma.article.update({
    data: article,
    where: { slug: article.slug },
  });
}
