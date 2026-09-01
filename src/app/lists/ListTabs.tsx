"use client";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Spinner, Tabs } from "@heroui/react";
import { Member } from "../../../generated/prisma/browser";
import MemberCard from "../members/MemberCard";
import { useTransition } from "react";

type Props = {
  members: Member[];
  likeIds: string[];
};

const tabs = [
  { id: "target", label: "members I liked" },
  { id: "source", label: "members who liked me" },
  { id: "mutual", label: "Mutual" },
];

export const ListTabs = ({ members, likeIds }: Props) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentTab = searchParams.get("type") || "target";
  const [isPending, startTransition] = useTransition();

  const handleTabChange = (tabId: string) => {
    startTransition(() => {
      router.replace(`${pathname}?type=${tabId}`);
    });
  };

  return (
    <div className="flex flex-col mt-10 gap-5 w-full">
      <Tabs
        onSelectionChange={(id) => handleTabChange(String(id))}
        selectedKey={currentTab}
      >
        <div className="flex items-center">
          <Tabs.ListContainer className="flex">
            <Tabs.List aria-label="Options">
              {tabs.map((tab) => (
                <Tabs.Tab
                  key={tab.id}
                  id={tab.id}
                  className={`whitespace-nowrap ${currentTab === tab.id ? "text-white" : ""}`}
                >
                  <span className="whitespace-nowrap">{tab.label}</span>
                  <Tabs.Indicator className="bg-accent" />
                </Tabs.Tab>
              ))}
            </Tabs.List>
          </Tabs.ListContainer>
          {isPending && <Spinner className="ml-2" color="accent" size="md" />}
        </div>
        {tabs.map((tab) => (
          <Tabs.Panel key={tab.id} id={tab.id}>
            {members.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {members.map((member) => (
                  <MemberCard
                    key={member.id}
                    member={member}
                    likeIds={likeIds}
                  />
                ))}
              </div>
            ) : (
              <p>No members found.</p>
            )}
          </Tabs.Panel>
        ))}
      </Tabs>
    </div>
  );
};
