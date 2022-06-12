import { Link, Outlet } from "remix";
import Navbar from "~/components/Navbar";

const routes = [
  {
    name: "Anúncios",
    path: "anuncios",
  },
  {
    name: "Usuários",
    path: "usuarios",
  },
  {
    name: "Alianças",
    path: "aliancas",
  },
  {
    name: "Países",
    path: "paises",
  },
  {
    name: "Representantes",
    path: "representantes",
  },
  {
    name: "Documentos",
    path: "documentos",
  },
];

export default function MesaDash() {
  return (
    <>
      <Navbar />
      <h1 className="p-4 text-3xl font-bold">Área da Mesa</h1>
      <div className="flex gap-8 px-4 mx-auto ">
        <div className="px-6 py-4 bg-gray-100">
          <h2 className="mb-2 text-xl font-semibold">Páginas</h2>
          <ul className="px-2 ml-2">
            {routes.map(({ name, path }) => (
              <li key={path} className="font-medium hover:text-blue-500">
                <Link to={`/mesa/${path}`}>{name}</Link>
              </li>
            ))}
          </ul>
        </div>
        <div className="flex-1">
          <Outlet />
        </div>
      </div>
    </>
  );
}
