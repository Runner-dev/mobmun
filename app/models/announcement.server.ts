import type { Announcement } from "@prisma/client";
import { prisma } from "~/services/db.server";

export type { Announcement } from "@prisma/client";

export async function getAnnouncementById(id: Announcement["id"]) {
  return prisma.announcement.findUnique({ where: { id } });
}

export async function getAnnouncements() {
  return prisma.announcement.findMany({
    orderBy: {
      fictionalDate: "desc",
    },
  });
}

export async function createAnnouncement({
  content,
  date,
  dateStr,
}: {
  content: string;
  date: Date;
  dateStr: string;
}) {
  return prisma.announcement.create({
    data: {
      content,
      fictionalDate: date,
      fictionalDateStr: dateStr,
    },
  });
}

export async function updateAnnouncement({
  content,
  date,
  dateStr,
  id,
}: {
  content: string;
  date: Date;
  dateStr: string;
  id: string;
}) {
  return prisma.announcement.update({
    where: { id },
    data: {
      content,
      fictionalDate: date,
      fictionalDateStr: dateStr,
    },
  });
}

export async function deleteAnnouncement(id: string) {
  return prisma.announcement.delete({ where: { id } });
}
