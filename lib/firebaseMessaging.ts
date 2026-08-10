import { createSign } from "crypto";

type TopicNotification = {
  title: string;
  body: string;
  data: Record<string, string>;
};

function requiredEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

function base64Url(value: string | Buffer): string {
  return Buffer.from(value)
    .toString("base64")
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");
}

async function getAccessToken(): Promise<string> {
  const clientEmail = requiredEnv("FIREBASE_CLIENT_EMAIL");
  const privateKey = requiredEnv("FIREBASE_PRIVATE_KEY").replace(/\\n/g, "\n");

  const now = Math.floor(Date.now() / 1000);

  const header = base64Url(
    JSON.stringify({
      alg: "RS256",
      typ: "JWT",
    })
  );

  const claims = base64Url(
    JSON.stringify({
      iss: clientEmail,
      scope: "https://www.googleapis.com/auth/firebase.messaging",
      aud: "https://oauth2.googleapis.com/token",
      iat: now,
      exp: now + 3600,
    })
  );

  const unsignedToken = `${header}.${claims}`;

  const signer = createSign("RSA-SHA256");
  signer.update(unsignedToken);
  signer.end();

  const signature = signer.sign(privateKey);
  const assertion = `${unsignedToken}.${base64Url(signature)}`;

  const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion,
    }),
    cache: "no-store",
  });

  if (!tokenResponse.ok) {
    const details = await tokenResponse.text();
    throw new Error(`Unable to obtain Firebase access token: ${details}`);
  }

  const tokenJson = (await tokenResponse.json()) as {
    access_token?: string;
  };

  if (!tokenJson.access_token) {
    throw new Error("Firebase access token was not returned.");
  }

  return tokenJson.access_token;
}

export async function sendToAllUsers(
  notification: TopicNotification
): Promise<string> {
  const projectId = requiredEnv("FIREBASE_PROJECT_ID");
  const accessToken = await getAccessToken();

  const response = await fetch(
    `https://fcm.googleapis.com/v1/projects/${projectId}/messages:send`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: {
          topic: "all_users",
          notification: {
            title: notification.title,
            body: notification.body,
          },
          data: notification.data,
          android: {
            priority: "HIGH",
            notification: {
              channel_id: "bible_updates",
            },
          },
        },
      }),
      cache: "no-store",
    }
  );

  if (!response.ok) {
    const details = await response.text();
    throw new Error(`Firebase notification failed: ${details}`);
  }

  const result = (await response.json()) as {
    name?: string;
  };

  return result.name || "sent";
}
