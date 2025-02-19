import {
  faChartSimple,
  faHouse,
  faRightToBracket,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { NavLink } from "@/types/header";
import Link from "next/link";

// define preset set of navigation links
export const visitorLinks: NavLink[] = [
  { href: "/", label: "Home", icon: faHouse },
  { href: "/login", label: "Login", icon: faRightToBracket },
];

interface HeaderProps {
  navLinks: NavLink[];
}

export default function Header({ navLinks }: HeaderProps) {
  return (
    <header className="bg-primary p-4 m-3 rounded-lg flex items-center justify-between">
      <span className="flex gap-3">
        <FontAwesomeIcon
          icon={faChartSimple}
          size="2x"
          className="text-primary-foreground"
        />
        <h1 className="text-3xl font-black text-primary-foreground">mobVis</h1>
      </span>
      <div className="flex gap-8">
        {navLinks.map((link) => (
          <div
            key={link.label}
            className="text-xl flex flex-row gap-3 items-center font-extrabold text-primary-foreground transition hover:text-[#D1D1D1]"
          >
            <Link href={link.href}>
              <FontAwesomeIcon icon={link.icon} className="" />
            </Link>
            <Link href={link.href}>
              <span className="">{link.label}</span>
            </Link>
          </div>
        ))}
      </div>
    </header>
  );
}
