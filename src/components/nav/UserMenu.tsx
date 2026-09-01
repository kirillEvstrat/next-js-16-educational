"use client";
import { Avatar, Dropdown, Label, Separator } from "@heroui/react";
import { User } from "../../../generated/prisma/browser";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import Link from "next/link";
import { ComponentProps } from "react";

type Props = {
  user: User;
};

export const UserMenu = ({ user }: Props) => {
  const router = useRouter();

  const signOut = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push("/");
          router.refresh();
        },
      },
    });
  };
  return (
    <Dropdown>
      <Dropdown.Trigger>
        <Avatar>
          <Avatar.Image
            alt={user.name}
            src={user.image ?? "/images/user.png"}
          />
          <Avatar.Fallback>{user.name.at(0)}</Avatar.Fallback>
        </Avatar>
      </Dropdown.Trigger>
      <Dropdown.Popover>
        <Dropdown.Menu
          onAction={(key) => console.log(`Selected: ${key}`)}
          disabledKeys={["signed-in-as"]}
        >
          <Dropdown.Section>
            <Dropdown.Item id={"signed-in-as"}>
              Signed in as {user.name}
            </Dropdown.Item>
          </Dropdown.Section>
          <Separator className="my-1" />
          <Dropdown.Section>
            <Dropdown.Item
              id="edit-profile"
              textValue="Edit profile"
              render={(props) => (
                <Link {...(props as ComponentProps<typeof Link>)}>
                  Edit profile
                </Link>
              )}
              href={`/members/${user.id}`}
            >
              <Label>Edit profile</Label>
            </Dropdown.Item>
            <Dropdown.Item
              id="logout"
              textValue="Logout"
              variant="danger"
              onClick={signOut}
            >
              <Label>Logout</Label>
            </Dropdown.Item>
          </Dropdown.Section>
        </Dropdown.Menu>
      </Dropdown.Popover>
    </Dropdown>
  );
};
