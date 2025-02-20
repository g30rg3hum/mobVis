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

interface Props {
  navLinks: NavLink[];
}

export default function Header({ navLinks }: Props) {
  return (
    <header className="bg-background-dark py-4 px-6 m-3 rounded-lg flex items-center justify-between text-foreground-dark">
      <span className="flex gap-3">
        <FontAwesomeIcon icon={faChartSimple} size="2x" />
        <h1 className="text-3xl font-black">mobVis</h1>
      </span>
      <div className="flex gap-8">
        {navLinks.map((link) => (
          <div
            key={link.label}
            className="text-lg flex flex-row gap-3 items-center font-extrabold transition hover:text-[#D1D1D1]"
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
