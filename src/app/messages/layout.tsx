import React from "react";
import { Card, Separator } from "@heroui/react";
import MessagesNav from "./MessagesNav";
import MessagesTitle from "./MessagesTitle";
import { getMessageContainerCounts } from "@/server/actions/messages";

export default async function MessagesLayout(props: LayoutProps<"/messages">) {
  const counts = await getMessageContainerCounts();

  return (
    <div className="grid h-[80vh] grid-cols-12 gap-5">
      <div className="col-span-3">
        <Card className="mt-10 h-[80vh] w-full overflow-hidden">
          <Card.Header>
            <h2 className="text-2xl font-bold text-accent">Messages</h2>
          </Card.Header>
          <Separator />
          <Card.Content className="p-0">
            <MessagesNav counts={counts} />
          </Card.Content>
        </Card>
      </div>

      <div className="col-span-9 min-h-0">
        <Card className="mt-10 flex h-[80vh] w-full flex-col overflow-hidden">
          <Card.Header className="shrink-0">
            <MessagesTitle />
          </Card.Header>
          <Separator className="shrink-0" />
          <Card.Content className="flex-1 min-h-0 overflow-hidden p-0">
            {props.children}
          </Card.Content>
        </Card>
      </div>
    </div>
  );
}
