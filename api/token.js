import { AccessToken } from "livekit-server-sdk";
import crypto from "crypto";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "POST only" });
  }

  try {
    const {
      room_name,
      camera_no = "1",
      role = "viewer"
    } = req.body || {};

    if (!room_name) {
      return res.status(400).json({
        error: "Room name is required"
      });
    }

    const identity = crypto.randomUUID();

    const isCamera = role === "camera";
    const isAdmin = role === "admin";

    const token = new AccessToken(
      process.env.LIVEKIT_API_KEY,
      process.env.LIVEKIT_API_SECRET,
      {
        identity,
        name: isCamera
          ? `Camera ${camera_no}`
          : isAdmin
            ? "Admin"
            : "Viewer",
        ttl: "2h"
      }
    );

    token.addGrant({
      roomJoin: true,
      room: room_name,

      canSubscribe: true,

      canPublish: isCamera,

      canPublishData: isCamera || isAdmin,

      canPublishSources: isCamera
        ? ["camera", "microphone"]
        : []
    });

    const participantToken = await token.toJwt();

    return res.status(200).json({
      serverUrl: process.env.LIVEKIT_URL,
      participantToken
    });

  } catch (error) {
    console.error("TOKEN ERROR:", error);

    return res.status(500).json({
      error: "Token generation failed",
      details: error.message
    });
  }
}
