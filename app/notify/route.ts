import { NextRequest, NextResponse } from "next/server";
import { cert, getApps, initializeApp } from "firebase-admin/app";
import { getMessaging } from "firebase-admin/messaging";

function getFirebaseAdminApp() {
  if (getApps().length > 0) {
    return getApps()[0];
  }

  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n");

  if (!projectId || !clientEmail || !privateKey) {
    throw new Error("Firebase Admin environment variables are missing.");
  }

  return initializeApp({
    credential: cert({
      projectId,
      clientEmail,
      privateKey
    })
  });
}

export async function POST(request: NextRequest) {
  try {
    const suppliedSecret = request.headers.get("x-notify-secret");
    const expectedSecret = process.env.NOTIFY_SECRET;

    if (!expectedSecret || suppliedSecret !== expectedSecret) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();

    const title = String(body.title || "").trim();
    const messageBody = String(body.body || "").trim();
    const contentType = String(body.contentType || "").trim().toLowerCase();
    const contentId = String(body.contentId || "").trim();

    if (!title || !messageBody) {
      return NextResponse.json(
        {
          success: false,
          error: "title and body are required"
        },
        { status: 400 }
      );
    }

    const allowedTypes = new Set([
      "",
      "chapter",
      "story",
      "prayer",
      "bible"
    ]);

    if (!allowedTypes.has(contentType)) {
      return NextResponse.json(
        {
          success: false,
          error: "contentType must be chapter, story, prayer, bible, or blank"
        },
        { status: 400 }
      );
    }

    getFirebaseAdminApp();

    const data: Record<string, string> = {
      title,
      body: messageBody
    };

    if (contentType) {
      data.content_type = contentType;
    }

    if (contentId) {
      data.content_id = contentId;
    }

    const messageId = await getMessaging().send({
      topic: "all_users",
      notification: {
        title,
        body: messageBody
      },
      data,
      android: {
        priority: "high",
        notification: {
          channelId: "bible_updates"
        }
      }
    });

    return NextResponse.json({
      success: true,
      messageId
    });
  } catch (error) {
    console.error("Notification send error:", error);

    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Unable to send notification"
      },
      { status: 500 }
    );
  }
}