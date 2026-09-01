"use client";
import React from "react";
import { Photo } from "../../generated/prisma/browser";
import { CldImage } from "next-cloudinary";
import Image from "next/image";

type Props = {
  photo: Photo;
};

export default function MemberImage({ photo }: Props) {
  return (
    <div>
      {photo.publicId ? (
        <CldImage
          alt="image"
          src={photo.publicId}
          width={300}
          height={300}
          crop="fill"
          gravity="face"
          className="rounded-xl"
        />
      ) : (
        <Image
          className="aspect-square object-cover relative rounded-2xl"
          src={photo.url}
          alt={photo.id}
          width={300}
          height={300}
          sizes="(max-width: 768px) 100vw, 33vw"
          unoptimized
          loading="eager"
        />
      )}
    </div>
  );
}
