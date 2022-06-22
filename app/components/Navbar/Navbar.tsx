import { Form, Link, useLocation, useNavigate } from "@remix-run/react";
import { useContext, useEffect, useMemo, useState } from "react";
import { socketContext } from "~/sockets/context";
import { unreadMessagesContext } from "~/unreadMessagesContext";
import { useOptionalUser } from "~/utils";

type AttentionData = {
  unreadMessages: boolean;
};

type NavItem = {
  path: string;
  name: string;
  guard?: (user: ReturnType<typeof useOptionalUser>) => boolean;
  attentionDot?: (data: AttentionData) => boolean;
};

const navItems: NavItem[] = [
  {
    path: "/anuncios",
    name: "Anúncios",
  },
  {
    path: "/documentos",
    name: "Documentos",
  },
  {
    path: "/noticias",
    name: "Notícias",
  },
  {
    path: "/mensagens",
    name: "Mensagens",
    guard: (user) => !!user,
    attentionDot: ({ unreadMessages }) => unreadMessages,
  },
  {
    path: "/correio-elegante",
    name: "Correio Elegante",
  },
  { path: "/mesa", name: "Mesa", guard: (user) => user?.mediator || false },
];

const authButtonClasses = "border border-gray-200 rounded-sm mr-2";

export default function Navbar() {
  const user = useOptionalUser();

  const location = useLocation();

  const selectedItem = useMemo(
    () => navItems.findIndex(({ path }) => location.pathname.startsWith(path)),
    [location]
  );

  useEffect(() => {
    setNavVisible(false);
  }, [location.pathname]);

  const unreadMessages = useContext(unreadMessagesContext);

  const [navVisible, setNavVisible] = useState(true);

  return (
    <>
      <nav
        className={`fixed top-0 z-10 flex h-full w-full flex-col items-center justify-center gap-4 bg-blue-500 text-white  lg:left-0 lg:h-16 lg:flex-row lg:justify-between ${
          !navVisible ? "left-full" : "left-0"
        }`}
      >
        <ul className="flex flex-col lg:h-full lg:flex-row">
          {navItems.map(
            ({ path, name, guard, attentionDot }, index) =>
              (guard ? guard(user) : true) && (
                <li
                  key={path}
                  className={`flex justify-center align-middle hover:bg-blue-600 ${
                    selectedItem === index ? "bg-blue-400 " : ""
                  }`}
                >
                  <Link
                    to={path}
                    className={`relative overflow-visible px-6 py-4 text-lg lg:whitespace-nowrap ${
                      attentionDot && attentionDot({ unreadMessages })
                        ? "after:absolute after:top-3.5 after:right-4 after:h-2 after:w-2 after:rounded-full after:bg-red-500 after:content-['']"
                        : ""
                    }`}
                  >
                    {name}
                  </Link>
                </li>
              )
          )}
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
      <button
        type="button"
        className="fixed z-20 flex items-center justify-center w-10 h-10 bg-white border border-gray-200 right-2 top-2 lg:hidden"
        onClick={() => setNavVisible((current) => !current)}
      >
        {navVisible ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-6 h-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-5 h-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
              clipRule="evenodd"
            />
          </svg>
        )}
      </button>
      <div className="hidden h-16 lg:block" />
    </>
  );
}
