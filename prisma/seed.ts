import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function seed() {
  // cleanup the existing database
  await prisma.user.deleteMany();
  await prisma.announcement.deleteMany();
  await prisma.article.deleteMany();
  await prisma.country.deleteMany();
  await prisma.alliance.deleteMany();
  await prisma.googleRefreshToken.deleteMany();
  await prisma.representative.deleteMany();

  // Announcements

  const announcements: Array<{
    content: string;
    fictionalDate: Date;
  }> = [
    {
      content: "São Paulo é capturada por inconfidentes",
      fictionalDate: new Date("1932-02-17"),
    },
  ];

  await Promise.all(
    announcements.map((announcement) =>
      prisma.announcement.create({ data: announcement })
    )
  );

  // Country

  const countries: Array<{ name: string; flag: string; id: string }> = [
    { name: "Brasil", flag: "https://flagcdn.com/h40/br.png", id: "br" },
    {
      name: "Estados Unidos",
      flag: "https://flagcdn.com/h40/us.png",
      id: "us",
    },
    { name: "Canada", flag: "https://flagcdn.com/h40/ca.png", id: "ca" },
    { name: "China", flag: "https://flagcdn.com/h40/cn.png", id: "cn" },
  ];

  await Promise.all(
    countries.map((country) => prisma.country.create({ data: country }))
  );

  // Users + Representatives

  const users: Array<{
    id: string;
    email: string;
    displayName: string;
    representativeName: string;
    countryId: string;
  }> = [
    {
      id: "tg",
      email: "me@tomasgoncalves.me",
      displayName: "Tomás Gonçalves",
      representativeName: "Abullah Gonçalves",
      countryId: "br",
    },
    {
      id: "test2",
      email: "test@tomasgoncalves.me",
      displayName: "Teste 2",
      representativeName: "Test Rep",
      countryId: "us",
    },
  ];

  const createdUsers = await Promise.all(
    users.map(({ email, id, displayName, representativeName, countryId }) =>
      prisma.user.create({
        data: {
          id,
          email,
          displayName,
          representative: {
            create: {
              name: representativeName,
              country: { connect: { id: countryId } },
            },
          },
        },
      })
    )
  );

  //Alliances

  const alliances = [
    { name: "Norte", members: ["ca", "us"] },
    { name: "Sul", members: ["br", "cn"] },
  ];

  await Promise.all(
    alliances.map(({ name, members }) =>
      prisma.alliance.create({
        data: { name, countries: { connect: members.map((id) => ({ id })) } },
      })
    )
  );

  console.log(`Database has been seeded. 🌱`);
}

seed()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
