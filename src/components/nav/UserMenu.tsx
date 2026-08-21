"use client";
import { Avatar, Dropdown, Label } from "@heroui/react";
import { User } from "../../../generated/prisma/client";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";

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
        <Dropdown.Menu onAction={(key) => console.log(`Selected: ${key}`)}>
          <Dropdown.Item id="edit-profile" textValue="Edit profile">
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
        </Dropdown.Menu>
      </Dropdown.Popover>
    </Dropdown>
  );
};
