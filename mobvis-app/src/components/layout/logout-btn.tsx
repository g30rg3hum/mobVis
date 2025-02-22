"use client";

import { faRightFromBracket } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { signOut } from "next-auth/react";

export default function LogoutBtn() {
  return (
    <div className="text-lg flex flex-row gap-3 items-center font-extrabold transition hover:text-[#D1D1D1]">
      <FontAwesomeIcon
        icon={faRightFromBracket}
        onClick={() => {
          signOut();
        }}
        className="hover:cursor-pointer"
      />
      <button
        onClick={() => {
          signOut();
        }}
      >
        Logout
      </button>
    </div>
  );
}
