import Link from "next/link";
import React from "react";

export default function MembersPage() {
  return (
    <div>
      <h3 className="text-2xl">header</h3>
      <Link href={"/"}>go back home</Link>
    </div>
  );
}
