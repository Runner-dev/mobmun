import { Link } from "@remix-run/react";
import Navbar from "~/components/Navbar";

const imageClasses = "h-32";
const linkClasses =
  "flex flex-col items-center content-between gap-8 px-8 py-12 text-xl bg-white shadow-lg flex-grow ";

export default function Noticias() {
  return (
    <>
      <Navbar />
      <main className="h-screen flex-col bg-gray-100 px-2 sm:flex sm:h-[calc(100vh-4rem)] sm:items-center">
        <h1 className="py-8 text-5xl font-medium">Notícias</h1>
        <div className="flex flex-col items-center justify-around w-full max-w-screen-sm gap-16 p-4 aspect-square sm:flex-row sm:p-8 ">
          <Link to="daily-mail" className={linkClasses}>
            <img
              src={`/images/daily-mail/square.jpg`}
              alt="Daily Mail Logo"
              className={imageClasses}
            />
            Daily Mail
          </Link>
          <Link to="kolnische-zeitung" className={linkClasses}>
            <img
              src={`/images/kolnische-zeitung/square.jpg`}
              alt="Kölnische Zeitung Logo"
              className={imageClasses}
            />
            Kölnische Zeitung
          </Link>
        </div>
      </main>
    </>
  );
}
