"use client";
import DeleteButton from "@/components/DeleteButton";
import { User } from "better-auth";
import { Photo } from "../../../../../generated/prisma/client";
import React, { useTransition } from "react";
import clsx from "clsx";
import StarButoon from "@/components/StarButoon";
import { deleteImage, setMainImage } from "@/server/actions/members";

type Props = {
  photo: Photo;
  user: User;
};

export default function PhotoButtons({ photo, user }: Props) {
  const [isMainPending, startMainTransition] = useTransition();
  const [isDeletePending, startDeleteTransition] = useTransition();
  const canSetMain = photo.status === "approved";

  const onSetMain = (photo: Photo) => {
    if (!canSetMain) return;
    startMainTransition(() => {
      setMainImage(photo);
    });
  };

  const onDelete = (photo: Photo) => {
    startDeleteTransition(() => {
      deleteImage(photo);
    });
  };

  return (
    <>
      <div
        onClick={() => onSetMain(photo)}
        className={clsx("absolute top-3 left-3 z-50", {
          "opacity-50 cursor-not-allowed": !canSetMain,
        })}
      >
        <StarButoon
          selected={photo.url === user.image}
          loading={isMainPending}
        />
      </div>
      {photo.url !== user.image && (
        <div
          onClick={() => onDelete(photo)}
          className="absolute top-3 right-3 z-50"
        >
          <DeleteButton loading={isDeletePending} />
        </div>
      )}
    </>
  );
}
