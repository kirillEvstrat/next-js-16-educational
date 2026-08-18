import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "members",
};

export default function MembersLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="p-3 border-2 border-red-200">
      <h2>members section</h2>
      {children}
    </div>
  );
}
