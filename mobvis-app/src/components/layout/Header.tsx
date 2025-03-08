import {
  faHospitalUser,
  faHouse,
  faRightToBracket,
  faUsers,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { NavLink } from "@/types/header";
import Link from "next/link";
import { getServerSession } from "next-auth";
import LogoutBtn from "./logout-btn";
import Logo from "./logo";

// define preset set of navigation links
const visitorLinks: NavLink[] = [
  { href: "/", label: "Home", icon: faHouse },
  { href: "/login", label: "Login", icon: faRightToBracket },
];

const loggedInLinks: NavLink[] = [
  { href: "/population-insights", label: "Population Insights", icon: faUsers },
  { href: "/my-patients", label: "My Patients", icon: faHospitalUser },
];

export default async function Header() {
  const session = await getServerSession();

  const navLinks = session ? loggedInLinks : visitorLinks;

  return (
    <header className="bg-background-dark py-4 px-6 m-3 rounded-lg flex items-center justify-between text-foreground-dark">
      <Logo size="2x" textSize="3xl" />
      <div className="flex gap-8">
        {navLinks.map((link) => (
          <div
            key={link.label}
            className="text-lg flex flex-row gap-3 items-center font-extrabold transition hover:text-[#D1D1D1]"
          >
            <Link href={link.href}>
              <FontAwesomeIcon icon={link.icon} />
            </Link>
            <Link href={link.href}>
              <span className="">{link.label}</span>
            </Link>
          </div>
        ))}
        {session && (
          <>
            <LogoutBtn />
            <span className="text-md mt-[2px]">{session.user?.email}</span>
          </>
        )}
      </div>
    </header>
  );
}
