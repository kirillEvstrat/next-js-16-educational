"use client";

import React, { useTransition } from "react";
import { Photo } from "../../../../generated/prisma/browser";
import MemberImage from "@/components/MemberImage";
import { Button } from "@heroui/react";
import { approvePhoto, rejectPhoto } from "@/server/actions/admin";

type Ptrops = {
  photo: Photo;
};

export default function ModerationCard({ photo }: Ptrops) {
  const [isApprovePending, startApproveTransition] = useTransition();
  const [isRejectPending, startRejectTransition] = useTransition();

  return (
    <div>
      <MemberImage photo={photo} />
      <div className="flex gap-2 w-full mt-3">
        <Button
          className="flex-1"
          isPending={isApprovePending}
          onClick={() =>
            startApproveTransition(() => {
              approvePhoto(photo.id);
            })
          }
        >
          {isApprovePending && "Approving... "}
          Approve
        </Button>
        <Button
          className="flex-1"
          isPending={isRejectPending}
          onClick={() =>
            startRejectTransition(() => {
              rejectPhoto(photo.id);
            })
          }
          variant="danger"
        >
          {isRejectPending && "Rejecting... "}
          Reject
        </Button>
      </div>
    </div>
  );
}
