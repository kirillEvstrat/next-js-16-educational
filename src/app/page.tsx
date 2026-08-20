import { Button, Link } from "@heroui/react";
import { FaRegSmile } from "react-icons/fa";

export default function Home() {
  return (
    <div>
      <h1 className="text-3xl text-red-200">Header</h1>
      <Link className={"rounded-2xl"} href={"/members"}>
        <FaRegSmile />
        <Button>go to members section</Button>
      </Link>
    </div>
  );
}
