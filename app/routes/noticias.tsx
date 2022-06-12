import { Link } from "@remix-run/react";
import Navbar from "~/components/Navbar";

const imageClasses = "h-32";
const linkClasses =
  "flex flex-col items-center content-between gap-8 px-8 py-12 text-xl bg-white shadow-lg flex-grow ";

export default function Noticias() {
  return (
    <>
      <Navbar />
      <main className="h-[calc(100vh-4rem)] flex-col bg-gray-100 sm:flex sm:items-center">
        <h1 className="my-8 text-5xl font-medium">Notícias</h1>
        <div className="flex items-center justify-around w-full max-w-screen-md gap-16 p-8 ">
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
