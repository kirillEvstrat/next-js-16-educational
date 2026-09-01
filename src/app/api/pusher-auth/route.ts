import { getCurrentUser } from "@/lib/auth";
import { pusherServer } from "@/lib/pusher";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();

    if (!user?.id || !user?.email) {
      return new Response("Unauthorized", { status: 401 });
    }

    const body = await request.formData();
    const socketId = body.get("socket_id") as string;
    const channelName = body.get("channel_name") as string;

    if (channelName.startsWith("presence-")) {
      const data = {
        user_id: user.id,
        user_info: {
          email: user.email,
          name: user.name,
        },
      };

      const authResponse = pusherServer.authorizeChannel(
        socketId,
        channelName,
        data,
      );

      return NextResponse.json(authResponse);
    }

    // private channel authentication, no data
    const authResponse = pusherServer.authorizeChannel(socketId, channelName);
    return NextResponse.json(authResponse);
  } catch {
    return new Response(
      "Something went wrong while authenticating with Pusher.",
      { status: 500 },
    );
  }
}
