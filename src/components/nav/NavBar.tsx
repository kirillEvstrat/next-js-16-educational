import { buttonVariants } from "@heroui/styles";
import Link from "next/link";
import React from "react";
import { GiMatchTip } from "react-icons/gi";
import NavLink from "./NavLink";
import { getCurrentUser } from "@/lib/auth";
import { UserMenu } from "./UserMenu";

const navLinks = [
  { name: "Members", href: "/members" },
  { name: "Lists", href: "/lists" },
  { name: "Messages", href: "/messages" },

  // Add more links as needed
];

export default async function NavBar() {
  const user = await getCurrentUser();

  return (
    <header className="p-3 w-full fixed top-0 z-index-50 bg-gray-800 text-white">
      <div className="flex justify-between items-center px-1 gap-6">
        <Link
          href="/"
          className="font-bold text-lg hover:underline flex items-center"
        >
          <GiMatchTip size={40} />
          Home
        </Link>
        <div className="flex gap-4">
          {navLinks.map((link) => (
            <NavLink key={link.href} href={link.href} label={link.name} />
          ))}
        </div>
        <div className="flex items-center gap-2">
          {!!user ? (
            <UserMenu user={{ ...user, image: user.image ?? null }} />
          ) : (
            <>
              <Link
                href={"/login"}
                className={buttonVariants({ variant: "primary" })}
              >
                Login
              </Link>
              <Link
                href={"/register"}
                className={buttonVariants({ variant: "secondary" })}
              >
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
