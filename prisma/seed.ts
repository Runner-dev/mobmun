import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function seed() {
  const countries: {
    id: string;
    name: string;
    flag: string;
  }[] = [
    {
      name: "Principado da Albânia",
      id: "al",
      flag: "https://i.ytimg.com/vi/c8B-qcYsAUo/maxresdefault.jpg",
    },
    {
      name: "Império Alemão",
      id: "de",
      flag: "https://duckduckgo.com/i/0ea353e6.png",
    },
    {
      name: "Império Austro-Húngaro",
      id: "ah",
      flag: "https://duckduckgo.com/i/63aadde1.png",
    },
    {
      name: "Reino da Bélgica",
      id: "be",
      flag: "https://duckduckgo.com/i/cc2155a1.png",
    },
    {
      name: "República Federativa do Brasil",
      id: "br",
      flag: "https://external-content.duckduckgo.com/iu/?u=http%3A%2F%2Fwww.aimore.net%2Fband%2FBrasil.jpg&f=1&nofb=1",
    },
    {
      name: "Reino da Bulgária",
      id: "bg",
      flag: "https://duckduckgo.com/i/4044aad7.png",
    },
    {
      name: "República da China",
      id: "cn",
      flag: "https://duckduckgo.com/i/9cb44967.png",
    },
    {
      name: "Reino da Dinamarca",
      id: "dk",
      flag: "https://duckduckgo.com/i/f21dd54d.png",
    },
    {
      name: "Reino da Espanha",
      id: "es",
      flag: "https://duckduckgo.com/i/90126dfc.png",
    },
    {
      name: "Estados Unidos da América",
      id: "us",
      flag: "https://duckduckgo.com/i/65032114.png",
    },
    {
      name: "Império Etíope",
      id: "ie",
      flag: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/ff/Flag_of_Ethiopia_%281897%E2%80%931974%29.svg/250px-Flag_of_Ethiopia_%281897%E2%80%931974%29.svg.png",
    },
    {
      name: "República Francesa",
      id: "fr",
      flag: "https://duckduckgo.com/i/901a1c0a.png",
    },
    {
      name: "Reino da Grécia",
      id: "gr",
      flag: "https://duckduckgo.com/i/139a5148.png",
    },
    {
      name: "Império Turco Ottomano",
      id: "tr",
      flag: "https://duckduckgo.com/i/1a627317.png",
    },
    {
      name: "Império da Itália",
      id: "it",
      flag: "https://duckduckgo.com/i/930ece52.png",
    },
    {
      name: "Império do Japão",
      id: "jp",
      flag: "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fupload.wikimedia.org%2Fwikipedia%2Fcommons%2Fthumb%2F5%2F54%2FNaval_ensign_of_the_Empire_of_Japan.svg%2F1200px-Naval_ensign_of_the_Empire_of_Japan.svg.png&f=1&nofb=1",
    },
    {
      name: "Grão-Ducado de Luxemburgo",
      id: "lu",
      flag: "https://duckduckgo.com/i/cf2411e3.png",
    },
    {
      name: "Estados Unidos do México",
      id: "mx",
      flag: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/87/Bandera_de_M%C3%A9xico_%281880-1914%29.svg/2560px-Bandera_de_M%C3%A9xico_%281880-1914%29.svg.png",
    },
    {
      name: "Reino do Montenegro",
      id: "me",
      flag: "https://duckduckgo.com/i/2910d351.png",
    },
    {
      name: "Reino da Noruega",
      id: "no",
      flag: "https://duckduckgo.com/i/114c3666.png",
    },
    {
      name: "Reino dos Países Baixos",
      id: "nl",
      flag: "https://duckduckgo.com/i/719588b1.png",
    },
    {
      name: "Estado Sublime da Pérsia",
      id: "ps",
      flag: "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fi.pinimg.com%2Foriginals%2Fcc%2F53%2F09%2Fcc53092d156bd551b852e9a7af12e8e9.png&f=1&nofb=1",
    },
    {
      name: "República Portuguesa",
      id: "pt",
      flag: "https://duckduckgo.com/i/622366a1.png",
    },
    {
      name: "Império Britânico",
      id: "gb",
      flag: "https://duckduckgo.com/i/087f6699.png",
    },
    {
      name: "Império Russo",
      id: "ru",
      flag: "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fi.ytimg.com%2Fvi%2FYBFy5qavE2o%2Fmaxresdefault.jpg&f=1&nofb=1",
    },
    {
      name: "Reino da Romênia",
      id: "ro",
      flag: "https://duckduckgo.com/i/fec397b8.png",
    },
    {
      name: "Reino da Sérvia",
      id: "rs",
      flag: "https://duckduckgo.com/i/d445ea4b.png",
    },
    {
      name: "Confederação Suíça",
      id: "ch",
      flag: "https://duckduckgo.com/i/b8862186.png",
    },
    {
      name: "Reino da Suécia",
      id: "se",
      flag: "https://duckduckgo.com/i/760e54dd.png",
    },
  ];

  await prisma.country.deleteMany();

  await Promise.all(
    countries.map((country) => prisma.country.create({ data: country }))
  );

  await prisma.user.deleteMany();

  const countryUsers: {
    email: string;
    displayName: string;
    countryId: string;
  }[] = [
    {
      email: "victoria.somera@mobilevirtual.com.br",
      displayName: "Victoria Somera",
      countryId: "al",
    },
    {
      email: "aline.oliveira@mobilevirtual.com.br",
      displayName: "Alline Oliveira",
      countryId: "al",
    },
    {
      email: "miguel.albernaz@mobilevirtual.com.br",
      displayName: "Miguel Albernaz",
      countryId: "de",
    },
    {
      email: "pedro.paiva@mobilevirtual.com.br",
      displayName: "Pedro Paiva",
      countryId: "de",
    },
    {
      email: "eduardo.ffernandes@mobilevirtual.com.br",
      displayName: "Eduardo Fernandes",
      countryId: "ah",
    },
    {
      email: "eduardo.franco@mobilevirtual.com.br",
      displayName: "Eduardo Franco",
      countryId: "ah",
    },
    {
      email: "leticia.colauto@mobilevirtual.com.br",
      displayName: "Leticia Colauto",
      countryId: "be",
    },
    {
      email: "maria.maciel@mobilevirtual.com.br",
      displayName: "Maria Isabel Maciel",
      countryId: "be",
    },
    {
      email: "caroline.rferreira@mobilevirtual.com.br",
      displayName: "Caroline Rodolpho",
      countryId: "br",
    },
    {
      email: "lara.monteiro@mobilevirtual.com.br",
      displayName: "Lara Monteiro",
      countryId: "br",
    },
    {
      email: "ana.letaif@mobilevirtual.com.br",
      displayName: "Ana Beatriz Letaif",
      countryId: "bg",
    },
    {
      email: "beatriz.mello@mobilevirtual.com.br",
      displayName: "Beatriz Mello",
      countryId: "bg",
    },
    {
      email: "maria.nascimento@mobilevirtual.com.br",
      displayName: "Maria Luiza Nascimento",
      countryId: "cn",
    },
    {
      email: "leticia.lvasconcelos@mobilevirtual.com.br",
      displayName: "Leticia Vasconcelos",
      countryId: "cn",
    },
    {
      email: "catarina.junqueira@mobilevirtual.com.br",
      displayName: "Catarina Junqueira",
      countryId: "dk",
    },
    {
      email: "caio.duran@mobilevirtual.com.br",
      displayName: "Caio Duran",
      countryId: "dk",
    },
    {
      email: "sophia.amaral@mobilevirtual.com.br",
      displayName: "Sophia Amaral",
      countryId: "es",
    },
    {
      email: "luigi.esposito@mobilevirtual.com.br",
      displayName: "Luigi Esposito",
      countryId: "es",
    },
    {
      email: "maria.hasson@mobilevirtual.com.br",
      displayName: "Maria Eduarda Hasson",
      countryId: "us",
    },
    {
      email: "tomas.goncalves@mobilevirtual.com.br",
      displayName: "Tomás Gonçalves",
      countryId: "us",
    },
    {
      email: "henrique.oliveira@mobilevirtual.com.br",
      displayName: "Henrique Oliveira",
      countryId: "ie",
    },
    {
      email: "joao.pcferreira@mobilevirtual.com.br",
      displayName: "João Paulo Ferreira",
      countryId: "ie",
    },
    {
      email: "gabriela.pereira@mobilevirtual.com.br",
      displayName: "Gabriela Andreatta",
      countryId: "fr",
    },
    {
      email: "joao.tabith@mobilevirtual.com.br",
      displayName: "João Tabith",
      countryId: "fr",
    },
    {
      email: "bruno.zrferreira@mobilevirtual.com.br",
      displayName: "Bruno Ferreira",
      countryId: "gr",
    },
    {
      email: "joao.vpdfigueiredo@mobilevirtual.com.br",
      displayName: "João Vinicius Figueiredo",
      countryId: "gr",
    },
    {
      email: "antonio.cerqueira@mobilevirtual.com.br",
      displayName: "Antonio Cerqueira",
      countryId: "tr",
    },
    {
      email: "leonardo.zanetti@mobilevirtual.com.br",
      displayName: "Leonardo Zanetti",
      countryId: "tr",
    },
    {
      email: "luis.valente@mobilevirtual.com.br",
      displayName: "Luis Valente",
      countryId: "it",
    },
    {
      email: "fernanda.ortiz@mobilevirtual.com.br",
      displayName: "Fernanda Ortiz",
      countryId: "it",
    },
    {
      email: "lucca.foguel@mobilevirtual.com.br",
      displayName: "Lucca Foguel",
      countryId: "jp",
    },
    {
      email: "vinicius.sakima@mobilevirtual.com.br",
      displayName: "Vinícius Sakima",
      countryId: "jp",
    },
    {
      email: "carolina.boliveira@mobilevirtual.com.br",
      displayName: "Carolina Oliveira",
      countryId: "lu",
    },
    {
      email: "maria.soligo@mobilevirtual.com.br",
      displayName: "Maria Clara Soligo",
      countryId: "lu",
    },
    {
      email: "ana.santos@mobilevirtual.com.br",
      displayName: "Ana Carolina Santos",
      countryId: "mx",
    },
    {
      email: "regina.mello@mobilevirtual.com.br",
      displayName: "Regina Evrard de Mello",
      countryId: "mx",
    },
    {
      email: "ana.farinha@mobilevirtual.com.br",
      displayName: "Ana Farinha",
      countryId: "me",
    },
    {
      email: "ana.coelho@mobilevirtual.com.br",
      displayName: "Ana Theresa Coelho",
      countryId: "me",
    },
    {
      email: "bernardo.horta@mobilevirtual.com.br",
      displayName: "Bernardo Horta",
      countryId: "no",
    },
    {
      email: "fernando.perin@mobilevirtual.com.br",
      displayName: "Fernando Perin",
      countryId: "no",
    },
    {
      email: "bernardo.camargo@mobilevirtual.com.br",
      displayName: "Bernardo Camargo",
      countryId: "nl",
    },
    {
      email: "daniel.ramos@mobilevirtual.com.br",
      displayName: "Daniel Ramos",
      countryId: "nl",
    },
    {
      email: "olivia.souza@mobilevirtual.com.br",
      displayName: "Olivia Souza",
      countryId: "ps",
    },
    {
      email: "francisco.aranha@mobilevirtual.com.br",
      displayName: "Francisco Aranha",
      countryId: "ps",
    },
    {
      email: "bruna.ramos@mobilevirtual.com.br",
      displayName: "Bruna Ramos",
      countryId: "pt",
    },
    {
      email: "isabela.boselli@mobilevirtual.com.br",
      displayName: "Isabela Boselli",
      countryId: "pt",
    },
    {
      email: "rachel.almeida@mobilevirtual.com.br",
      displayName: "Rachel Almeida",
      countryId: "gb",
    },
    {
      email: "maria.victoria@mobilevirtual.com.br",
      displayName: "Maria Victoria Queiroz",
      countryId: "gb",
    },
    {
      email: "arthur.nogueira@mobilevirtual.com.br",
      displayName: "Arthur Nogueira",
      countryId: "ru",
    },
    {
      email: "gabriel.fernandes@mobilevirtual.com.br",
      displayName: "Gabriel Fernandes",
      countryId: "ru",
    },
    {
      email: "lucas.duran@mobilevirtual.com.br",
      displayName: "Lucas Duran",
      countryId: "ro",
    },
    {
      email: "fernando.granado@mobilevirtual.com.br",
      displayName: "Fernando Granado",
      countryId: "ro",
    },
    {
      email: "felipe.aisen@mobilevirtual.com.br",
      displayName: "Felipe Aisen",
      countryId: "rs",
    },
    {
      email: "julia.morais@mobilevirtual.com.br",
      displayName: "Julia Morais",
      countryId: "rs",
    },
    {
      email: "francisco.silva@mobilevirtual.com.br",
      displayName: "Francisco Silva",
      countryId: "ch",
    },
    {
      email: "isabella.guerra@mobilevirtual.com.br",
      displayName: "Isabella Guerra",
      countryId: "ch",
    },
    {
      email: "helena.carneiro@mobilevirtual.com.br",
      displayName: "Helena Carneiro",
      countryId: "se",
    },
    {
      email: "bruno.pozzobon@mobilevirtual.com.br",
      displayName: "Bruno Pozzobon",
      countryId: "se",
    },
  ];

  await Promise.all(
    countryUsers.map(({ email, displayName, countryId }) =>
      prisma.user.create({
        data: {
          email,
          displayName,
          initialCountryId: countryId,
        },
      })
    )
  );

  const representatives: {
    name: string;
    countryId: string;
  }[] = [
    {
      name: "Turhan Pasha Përmeti",
      countryId: "al",
    },
    {
      name: "Essad Pasha Toptani",
      countryId: "al",
    },
    {
      name: "Gottlieb von Jagow",
      countryId: "de",
    },
    {
      name: "Helmuth von Moltke",
      countryId: "de",
    },
    {
      name: "Leopold Bercthold",
      countryId: "ah",
    },
    {
      name: "Alexander von Krobatin",
      countryId: "ah",
    },
    {
      name: "Henri François",
      countryId: "be",
    },
    {
      name: "Rei Alberto I",
      countryId: "be",
    },
    {
      name: "Lauro Severiano Müller",
      countryId: "br",
    },
    {
      name: "Marechal José Caetano Faria",
      countryId: "br",
    },
    {
      name: "Vasil Radoslavov",
      countryId: "bg",
    },
    {
      name: "Ivan Fichev",
      countryId: "bg",
    },
    {
      name: "Lou Tseng-Tsiang",
      countryId: "cn",
    },
    {
      name: "Wang Shizhen",
      countryId: "cn",
    },
    {
      name: "Erik Scavenius",
      countryId: "dk",
    },
    {
      name: "Peter Rochegune Munch",
      countryId: "dk",
    },
    {
      name: "Salvador Bermúdez de Castro",
      countryId: "es",
    },
    {
      name: "Ramón Echagüe y Méndez Vigo",
      countryId: "es",
    },
    {
      name: "William Jennings Bryan",
      countryId: "us",
    },
    {
      name: "Lindley Miller Garrison",
      countryId: "us",
    },
    {
      name: "Beyene Yemer",
      countryId: "ie",
    },
    {
      name: "Habte Giygoris Dinagde",
      countryId: "ie",
    },
    {
      name: "René Viviani",
      countryId: "fr",
    },
    {
      name: "Adolphe Messimy",
      countryId: "fr",
    },
    {
      name: "Eleftherios Venizelos",
      countryId: "gr",
    },
    {
      name: "Rei Constantino I",
      countryId: "gr",
    },
    {
      name: "Salid Halim Pasha",
      countryId: "tr",
    },
    {
      name: "Enver Pasha",
      countryId: "tr",
    },
    {
      name: "Sydney Sonnino",
      countryId: "it",
    },
    {
      name: "Vittorio Italico Zupelli",
      countryId: "it",
    },
    {
      name: "Kato Takaaki",
      countryId: "jp",
    },
    {
      name: "O Imperador",
      countryId: "jp",
    },
    {
      name: "Paul Eyschen",
      countryId: "lu",
    },
    {
      name: "Grã-Duquesa Maria Adelaide",
      countryId: "lu",
    },
    {
      name: "Jesús Urueta y Siqueiros",
      countryId: "mx",
    },
    {
      name: "José Isabel Robles",
      countryId: "mx",
    },
    {
      name: "Janko Vukotić",
      countryId: "me",
    },
    {
      name: "Rei Nicolau I",
      countryId: "me",
    },
    {
      name: "Gunnar Knudsen",
      countryId: "no",
    },
    {
      name: "Jørgen Løvland",
      countryId: "no",
    },
    {
      name: "John Loudon",
      countryId: "nl",
    },
    {
      name: "Nicolaas Bosboom",
      countryId: "nl",
    },
    {
      name: "Hussein Kuli Khan Nawab",
      countryId: "ps",
    },
    {
      name: "Mostofi al-Malek",
      countryId: "ps",
    },
    {
      name: "Alfredo Augusto de Freire",
      countryId: "pt",
    },
    {
      name: "José Norton de Matos",
      countryId: "pt",
    },
    {
      name: "Visconde Edward Grey",
      countryId: "gb",
    },
    {
      name: "Conde Horatio Herbert Kitchener",
      countryId: "gb",
    },
    {
      name: "Sergey Sazonov",
      countryId: "ru",
    },
    {
      name: "Czar Nikolau II",
      countryId: "ru",
    },
    {
      name: "Emanuel Porumbaru",
      countryId: "ro",
    },
    {
      name: "Vintilă Ion Constantin Brătianu",
      countryId: "ro",
    },
    {
      name: "Nikola Pašić",
      countryId: "rs",
    },
    {
      name: "Radivoje Bosović",
      countryId: "rs",
    },
    {
      name: "Arthur Hoffman",
      countryId: "ch",
    },
    {
      name: "Conrad Ulrich Wille",
      countryId: "ch",
    },
    {
      name: "Knut Wallenberg",
      countryId: "se",
    },
    {
      name: "Emil Mörcke",
      countryId: "se",
    },
  ];

  await Promise.all(
    representatives.map(({ name, countryId }) =>
      prisma.countryRepresentative.create({ data: { name, countryId } })
    )
  );

  const newsUsers: {
    email: string;
    displayName: string;
  }[] = [
    {
      email: "hugo.santos@mobilevirtual.com.br",
      displayName: "Hugo Santos",
    },
    {
      email: "taly.valdman@mobilevirtual.com.br",
      displayName: "Taly Valdman",
    },
    {
      email: "laura.zagottis@mobilevirtual.com.br",
      displayName: "Laura Zagottis",
    },
    {
      email: "erika.abreu@mobilevirtual.com.br",
      displayName: "Erika Abreu",
    },
    {
      email: "daniela.silva@mobilevirtual.com.br",
      displayName: "Daniela Silva",
    },
    {
      email: "vitor.waimberg@mobilevirtual.com.br",
      displayName: "Vitor Waimberg",
    },
    {
      email: "julia.medeiros@mobilevirtual.com.br",
      displayName: "Julia Medeiros",
    },
    {
      email: "sophia.serra@mobilevirtual.com.br",
      displayName: "Sophia Serra",
    },
    {
      email: "graziela.freitas@mobilevirtual.com.br",
      displayName: "Graziela Freitas",
    },
    {
      email: "luana.bonini@mobilevirtual.com.br",
      displayName: "Luana Bonini",
    },
    {
      email: "maria.vallone@mobilevurtual.com.br",
      displayName: "Maria Vallone",
    },
    {
      email: "enzo.juquiram@mobilevirtual.com.br",
      displayName: "Enzo Juquiram",
    },
    {
      email: "julia.pinto@mobilevirtual.com.br",
      displayName: "Julia Pinto",
    },
    {
      email: "mirella.nascimento@mobilevirtual.com.br",
      displayName: "Mirella Nascimento",
    },
    {
      email: "marina.telo@mobilevirtual.com.br",
      displayName: "Marina Telo",
    },
    {
      email: "lucas.sousa@mobilevirtual.com.br",
      displayName: "Lucas Sousa",
    },
    {
      email: "sarah.macedo@mobilevirtual.com.br",
      displayName: "Sarah Macedo",
    },
    {
      email: "milena.goncalves@mobilevirtual.com.br",
      displayName: "Milena Gonçalves",
    },
    {
      email: "dora.esposito@mobilevirtual.com.br",
      displayName: "Dora Espósito",
    },
    {
      email: "barbara.sganga@mobilevirtual.com.br",
      displayName: "Barbara Sganga",
    },
  ];

  await Promise.all(
    newsUsers.map(({ email, displayName }) =>
      prisma.user.create({ data: { email, displayName, initialNews: true } })
    )
  );

  const mediatorUsers = [
    {
      email: "fernandozatta1@gmail.com",
      displayName: "Fernando Zatta",
    },
    {
      email: "gabrielvana2107@gmail.com",
      displayName: "Gabriel Vana",
    },
    {
      email: "maturco29@gmail.com",
      displayName: "Marcelo Turco",
    },
    {
      email: "moniquepreisemurer@gmail.com",
      displayName: "Monique Preisemurer",
    },
    {
      email: "andre.arana.deziderio@gmail.com",
      displayName: "André Deziderio",
    },
    {
      email: "guiguighefter@gmail.com",
      displayName: "Guilherme Ghefter",
    },
    // {
    //   email: "tomas.goncalves@mobilevirtual.com.br",
    //   displayName: "Tomás Gonçalves",
    // },
  ];

  await Promise.all(
    mediatorUsers.map(({ email, displayName }) =>
      prisma.user.create({ data: { email, displayName, mediator: true } })
    )
  );

  await prisma.newsOrg.deleteMany();

  const newsOrgs: { name: string; id: string }[] = [
    {
      name: "Daily Mail",
      id: "daily-mail",
    },
    {
      name: "Kölnische Zeitung",
      id: "kolnische-zeitung",
    },
  ];

  await Promise.all(
    newsOrgs.map(({ name, id }) =>
      prisma.newsOrg.create({ data: { name, id } })
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
