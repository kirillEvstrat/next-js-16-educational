import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "members",
};

export default function MembersLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <div>{children}</div>;
}
