import { NextRequest, NextResponse } from "next/server";
import { sendToAllUsers } from "@/lib/firebaseMessaging";

type NotificationKind = "chapter" | "story" | "prayer";

type NotificationRequest = {
  title: string;
  body: string;
  contentType: NotificationKind;
  contentKey: string;
};

function authorized(request: NextRequest): boolean {
  const expected = process.env.NOTIFICATION_ADMIN_SECRET;
  const supplied = request.headers.get("x-admin-secret");

  return Boolean(expected && supplied && supplied === expected);
}

export async function POST(request: NextRequest) {
  if (!authorized(request)) {
    return NextResponse.json(
      { success: false, message: "Unauthorized" },
      { status: 401 }
    );
  }

  let payload: NotificationRequest;

  try {
    payload = (await request.json()) as NotificationRequest;
  } catch {
    return NextResponse.json(
      { success: false, message: "Invalid JSON body" },
      { status: 400 }
    );
  }

  const { title, body, contentType, contentKey } = payload;

  if (!title || !body || !contentType || !contentKey) {
    return NextResponse.json(
      {
        success: false,
        message: "title, body, contentType and contentKey are required",
      },
      { status: 400 }
    );
  }

  if (!["chapter", "story", "prayer"].includes(contentType)) {
    return NextResponse.json(
      { success: false, message: "Unsupported contentType" },
      { status: 400 }
    );
  }

  const messageId = await sendToAllUsers({
    title,
    body,
    data: {
      title,
      body,
      content_type: contentType,
      content_key: contentKey,
    },
  });

  return NextResponse.json({
    success: true,
    messageId,
    target: "all_users",
  });
}
