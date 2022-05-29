import { Link } from "@remix-run/react";
import Navbar from "~/components/Navbar";

const imageClasses = "w-32";
const linkClasses =
  "flex flex-col items-center content-between gap-8 px-8 py-12 text-xl bg-gray-200 shadow-lg flex-grow";

export default function Noticias() {
  return (
    <>
      <Navbar />
      <main className="flex-col bg-white sm:flex sm:items-center">
        <h1 className="my-8 text-5xl font-medium">Notícias</h1>
        <div className="flex items-center justify-around w-full max-w-screen-md gap-16 p-8 ">
          <Link to="new-york-times" className={linkClasses}>
            <img
              src="https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2F1000marcas.net%2Fwp-content%2Fuploads%2F2021%2F04%2FSymbol-New-York-Times-1280x1653.png&f=1&nofb=1"
              alt="New York Times Logo"
              className={imageClasses}
            />
            New York Times
          </Link>
          <Link to="new-york-times" className={linkClasses}>
            <img
              src="https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2F1000marcas.net%2Fwp-content%2Fuploads%2F2021%2F04%2FSymbol-New-York-Times-1280x1653.png&f=1&nofb=1"
              alt="New York Times Logo"
              className={imageClasses}
            />
            New York Times
          </Link>
        </div>
      </main>
    </>
  );
}
