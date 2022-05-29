import { Form, Link, useLocation, useMatches } from "@remix-run/react";
import { useMemo } from "react";
import { useOptionalUser } from "~/utils";

const navItems = [
  ["/anuncios", "Anúncios"],
  ["/documentos", "Documentos"],
  ["/noticias", "Notícias"],
  ["/mensagens", "Mensagens"],
  ["/espionagem", "Espionagem"],
  ["/mapas", "Mapas"],
];

const authButtonClasses = "border border-gray-200 rounded-sm mr-2";

export default function Navbar() {
  const user = useOptionalUser();

  const location = useLocation();

  const selectedItem = useMemo(
    () => navItems.findIndex(([path]) => location.pathname.startsWith(path)),
    [location]
  );

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-10 flex items-center justify-between h-16 text-white bg-blue-500">
        <ul className="flex h-full al">
          {navItems.map(([href, label], index) => (
            <li
              key={href}
              className={`flex justify-center align-middle hover:bg-blue-600 ${
                selectedItem === index ? "bg-blue-400 " : ""
              }`}
            >
              <Link to={href} className="px-6 py-4 text-lg ">
                {label}
              </Link>
            </li>
          ))}
        </ul>
        {user ? (
          <Form
            action="/auth/logout"
            method="post"
            className={
              authButtonClasses +
              " transition hover:border-red-500 hover:bg-red-500"
            }
          >
            <button type="submit" className="px-8 py-2">
              Sair
            </button>
          </Form>
        ) : (
          <Form
            action="/auth/google"
            method="post"
            className={
              authButtonClasses +
              " transition hover:border-emerald-500 hover:bg-emerald-500"
            }
          >
            <button type="submit" className="px-6 py-2">
              Entrar
            </button>
          </Form>
        )}
      </nav>
      <div className="h-16" />
    </>
  );
}
