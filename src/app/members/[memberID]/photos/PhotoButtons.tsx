"use client";
import DeleteButton from "@/components/DeleteButton";
import { User } from "better-auth";
import { Photo } from "../../../../../generated/prisma/client";
import React, { useTransition } from "react";
import StarButoon from "@/components/StarButoon";
import { deleteImage, setMainImage } from "@/server/actions/members";

type Props = {
  photo: Photo;
  user: User;
};

export default function PhotoButtons({ photo, user }: Props) {
  const [isMainPending, startMainTransition] = useTransition();
  const [isDeletePending, startDeleteTransition] = useTransition();

  const onSetMain = (photo: Photo) => {
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
        className="absolute top-3 left-3 z-50"
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
