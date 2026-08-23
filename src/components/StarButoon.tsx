import React from "react";
import { AiFillStar, AiOutlineStar } from "react-icons/ai";
import { PiSpinner } from "react-icons/pi";

type Props = {
  selected: boolean;
  loading: boolean;
};

export default function StarButoon({ selected, loading }: Props) {
  return (
    <div className="relative hover:opacity-70 transition cursor-pointer">
      {!loading ? (
        <>
          <AiOutlineStar size={32} className="fill-white absolute" />
          <AiFillStar
            size={32}
            className={selected ? "fill-amber-200" : "fill-gray-200"}
          />
        </>
      ) : (
        <PiSpinner size={32} className="animate-spin" />
      )}
    </div>
  );
}
