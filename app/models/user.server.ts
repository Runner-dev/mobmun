import type { GoogleRefreshToken, User } from "@prisma/client";

import { prisma } from "~/services/db.server";

export type { User } from "@prisma/client";

export async function getUserById(id: User["id"]) {
  return prisma.user.findUnique({ where: { id } });
}

export async function getUserByEmail(email: User["email"]) {
  return prisma.user.findUnique({ where: { email } });
}

export async function getRefreshTokenByUserId(id: User["id"]) {
  return prisma.googleRefreshToken.findFirst({ where: { userId: id } });
}
export async function updateRefreshTokenByUserId(
  newToken: GoogleRefreshToken["refreshToken"],
  id: User["id"]
) {
  if (
    (await prisma.googleRefreshToken.count({ where: { userId: id } })) === 0
  ) {
    return prisma.googleRefreshToken.create({
      data: { refreshToken: newToken, userId: id },
    });
  } else {
    return prisma.googleRefreshToken.update({
      where: { userId: id },
      data: { refreshToken: newToken },
    });
  }
}

export async function createUser({
  email,
  displayName,
  refreshToken,
}: Pick<User, "email" | "displayName"> &
  Pick<GoogleRefreshToken, "refreshToken">) {
  return prisma.user.create({
    data: {
      email,
      displayName,
      googleRefreshToken: {
        create: {
          refreshToken,
        },
      },
    },
  });
}

export async function deleteUserByEmail(email: User["email"]) {
  return prisma.user.delete({ where: { email } });
}
