import React from "react";
import { requireAdminUser } from "@/lib/auth";
import { getPendingPhotos } from "@/server/actions/admin";
import ModerationCard from "./ModerationCard";

export default async function AdminPhotosPage() {
  await requireAdminUser();
  const photos = await getPendingPhotos();
  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Pending Photos</h2>
      {photos.length === 0 && <p>No pending photos.</p>}
      <div className="grid grid-cols-6 gap-3">
        {photos.map((photo) => (
          <ModerationCard key={photo.id} photo={photo} />
        ))}
      </div>
    </div>
  );
}
