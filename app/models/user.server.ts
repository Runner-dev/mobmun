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

export async function getUsers() {
  return prisma.user.findMany();
}

export async function getUsersWithoutRepresentatives() {
  return prisma.user.findMany({
    where: {
      countryRepresentative: { is: null },
    },
  });
}

export async function createUserByMediator({
  email,
  displayName,
}: {
  email: string;
  displayName: string;
}) {
  return prisma.user.create({
    data: {
      email,
      displayName,
    },
  });
}

export async function getUserByIdWithIncludes(id: User["id"]) {
  return prisma.user.findUnique({
    where: { id },
    include: {
      countryRepresentative: {
        include: {
          country: true,
        },
      },
      newsRepresentative: { include: { newsOrg: true } },
    },
  });
}

export async function updateUser({
  id,
  displayName,
  email,
  mediator,
}: {
  id: string;
  displayName: string;
  email: string;
  mediator: boolean;
}) {
  return prisma.user.update({
    where: { id },
    data: {
      displayName,
      email,
      mediator,
    },
  });
}

export async function deleteUser(id: string) {
  return prisma.user.delete({ where: { id } });
}
