import MemberImage from "@/components/MemberImage";
import { getCurrentUser } from "@/lib/auth";
import { getMemberPhotosById } from "@/server/actions/members";
import PhotoButtons from "./PhotoButtons";

export default async function PhotosPage(
  props: PageProps<"/members/[memberID]/photos">,
) {
  const { params } = props;
  const { memberID } = await params;
  const photos = await getMemberPhotosById(memberID);
  const currentUser = await getCurrentUser();
  const isOwner = currentUser?.id === memberID;

  return (
    <div className="grid grid-cols-5 gap-3 p-5">
      {photos?.map((photo) => (
        <div key={photo.id} className="relative">
          <MemberImage photo={photo} />
          {isOwner && <PhotoButtons photo={photo} user={currentUser} />}
        </div>
      ))}
    </div>
  );
}
