import React, { Suspense } from "react";
import { Card, Separator } from "@heroui/react";
import MessagesNav from "./MessagesNav";
import MessagesTitle from "./MessagesTitle";

export default async function MessagesLayout(props: LayoutProps<"/messages">) {
  return (
    <div className="grid h-[80vh] grid-cols-12 gap-5">
      <div className="col-span-3">
        <Card className="mt-10 h-[80vh] w-full overflow-hidden">
          <Card.Header>
            <h2 className="text-2xl font-bold text-accent">Messages</h2>
          </Card.Header>
          <Separator />
          <Card.Content className="p-0">
            <Suspense fallback={null}>
              <MessagesNav />
            </Suspense>
          </Card.Content>
        </Card>
      </div>

      <div className="col-span-9 min-h-0">
        <Card className="mt-10 flex h-[80vh] w-full flex-col overflow-hidden">
          <Card.Header className="shrink-0">
            <Suspense fallback={null}>
              <MessagesTitle />
            </Suspense>
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
