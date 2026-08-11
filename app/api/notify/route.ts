import { NextRequest, NextResponse } from "next/server";
import { cert, getApps, initializeApp } from "firebase-admin/app";
import { getMessaging } from "firebase-admin/messaging";

function getFirebaseAdminApp() {
  if (getApps().length > 0) {
    return getApps()[0];
  }

  const projectId = process.env.FIREBASE_PROJECT_ID?.trim();
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL?.trim();

  const privateKey = process.env.FIREBASE_PRIVATE_KEY
    ?.replace(/\\n/g, "\n")
    .trim();

  if (!projectId || !clientEmail || !privateKey) {
    throw new Error(
      "Firebase Admin environment variables are missing."
    );
  }

  return initializeApp({
    credential: cert({
      projectId,
      clientEmail,
      privateKey,
    }),
  });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const suppliedSecret = String(
      request.headers.get("x-notify-secret") ||
        body.secret ||
        ""
    ).trim();

    const expectedSecret = String(
      process.env.NOTIFY_SECRET || ""
    ).trim();

    if (!expectedSecret) {
      return NextResponse.json(
        {
          success: false,
          error: "NOTIFY_SECRET is missing in Vercel.",
        },
        { status: 500 }
      );
    }

    if (
      !suppliedSecret ||
      suppliedSecret !== expectedSecret
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Notification secret does not match NOTIFY_SECRET in Vercel.",
        },
        { status: 401 }
      );
    }

    const title = String(body.title || "").trim();

    const messageBody = String(
      body.body || ""
    ).trim();

    const contentType = String(
      body.contentType || ""
    )
      .trim()
      .toLowerCase();

    const contentId = String(
      body.contentId || ""
    ).trim();

    if (!title || !messageBody) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Notification title and message are required.",
        },
        { status: 400 }
      );
    }

    getFirebaseAdminApp();

    const data: Record<string, string> = {
      title,
      body: messageBody,
    };

    if (contentType) {
      data.content_type = contentType;
    }

    if (contentId) {
      data.content_id = contentId;
    }

    const messageId =
      await getMessaging().send({
        topic: "all_users",

        notification: {
          title,
          body: messageBody,
        },

        data,

        android: {
          priority: "high",

          notification: {
            channelId: "bible_updates",
          },
        },
      });

    return NextResponse.json({
      success: true,
      message: "Notification sent successfully.",
      messageId,
    });
  } catch (error) {
    console.error(
      "Notification send error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Unable to send notification.",
      },
      { status: 500 }
    );
  }
}