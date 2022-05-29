import type { Announcement } from "@prisma/client";
import { prisma } from "~/services/db.server";

export type { Announcement } from "@prisma/client";

export async function getAnnouncementById(id: Announcement["id"]) {
  return prisma.announcement.findUnique({ where: { id } });
}

export async function getAnnouncements() {
  return prisma.announcement.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });
}
