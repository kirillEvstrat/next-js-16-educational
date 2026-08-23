import React from "react";
import { AiFillDelete, AiOutlineDelete } from "react-icons/ai";
import { PiSpinner } from "react-icons/pi";

type Props = {
  loading: boolean;
};

export default function DeleteButton({ loading }: Props) {
  return (
    <div className="relative hover:opacity-70 transition cursor-pointer">
      {!loading ? (
        <>
          <AiOutlineDelete size={32} className="fill-white absolute" />
          <AiFillDelete size={32} className="fill-red-500" />
        </>
      ) : (
        <PiSpinner size={32} className="animate-spin" />
      )}
    </div>
  );
}
