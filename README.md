# Kabaddi Tournament Live — 4 Camera WebRTC

This project uses a static HTML frontend plus a Vercel serverless token endpoint and LiveKit Cloud/SFU.

## Setup
1. Create a LiveKit Cloud project.
2. Copy the LiveKit WebSocket URL, API key and API secret.
3. Deploy this folder to Vercel.
4. In Vercel Project Settings → Environment Variables add:
   - LIVEKIT_URL = your LiveKit server URL (wss://...)
   - LIVEKIT_API_KEY = your API key
   - LIVEKIT_API_SECRET = your API secret
5. Redeploy.
6. Open the website on 4 phones. Use the same room name:
   - Phone 1: Camera 1
   - Phone 2: Camera 2
   - Phone 3: Camera 3
   - Phone 4: Camera 4
7. On viewer phones select Viewer and use the same room name.

## Security
The API secret is only used by `/api/token.js` on the server. Never paste it into `index.html`.
For a public tournament, add admin authentication and rate limiting to the token endpoint.

## Notes
Camera and microphone access requires HTTPS. Vercel provides HTTPS.
The LiveKit Cloud free allowance is usage-limited; check the current LiveKit pricing/quotas before the event.
