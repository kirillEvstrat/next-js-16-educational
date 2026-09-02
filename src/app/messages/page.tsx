import { getMessagesByContainer } from "@/server/actions/messages";
import { requireAuthUser } from "@/lib/auth";
import MessagesTable from "./MessagesTable";

export default async function page(props: PageProps<"/messages">) {
  const { container } = await props.searchParams;
  const activeContainer = container === "outbox" ? "outbox" : "inbox";
  const currentUser = await requireAuthUser();
  const { messages, nextCursor } =
    await getMessagesByContainer(activeContainer);
  return (
    <MessagesTable
      key={activeContainer}
      initialMessages={messages}
      initNextCursor={nextCursor}
      activeContainer={activeContainer}
      currentUserId={currentUser.id}
    />
  );
}
