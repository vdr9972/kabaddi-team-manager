import { AccessToken } from "livekit-server-sdk";
import crypto from "crypto";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "POST only" });
  }

  try {
    const { room_name, role = "viewer", camera_no = "1" } = req.body || {};

    if (!room_name) {
      return res.status(400).json({ error: "Room name is required" });
    }

    const identity = crypto.randomUUID();

    const name =
      role === "camera"
        ? `Camera-${camera_no}-${identity.slice(0, 6)}`
        : `Viewer-${identity.slice(0, 6)}`;

    const token = new AccessToken(
      process.env.LIVEKIT_API_KEY,
      process.env.LIVEKIT_API_SECRET,
      {
        identity,
        name,
        ttl: "2h"
      }
    );

    token.addGrant({
      roomJoin: true,
      room: room_name,
      canPublish: role === "camera",
      canSubscribe: true,
      canPublishData: role === "camera"
    });

    const participantToken = await token.toJwt();

    return res.status(200).json({
      server_url: process.env.LIVEKIT_URL,
      participant_token: participantToken
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      error: "Token generation failed"
    });
  }
}
