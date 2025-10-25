import { NextResponse } from "next/server";

export async function POST(request: Request) {
  // Parse the frame request body
  const body = await request.json();
  const fid = body?.fid;

  if (!fid) {
    return NextResponse.json(
      { error: "Missing fid in frame request" },
      { status: 400 }
    );
  }

  // Fetch followers from our internal API route
  const origin = request.nextUrl.origin;
  const followersRes = await fetch(`${origin}/api/followers?fid=${fid}`);
  const followersData = await followersRes.json();

  const followers = followersData.followers ?? [];

  // Build the frame response
  const frameResponse = {
    "fc:frame": "vNext",
    "image": {
      url: `${origin}/api/frame/image?fid=${fid}`,
      aspect_ratio: "1:1",
    },
    "text": "Who Followed Me?",
    "buttons": [
      {
        label: "🔄 Refresh",
        action: "POST",
        target: "/api/frame",
      },
    ],
    "post_url": "/api/frame",
    "state": {
      fid,
    },
  };

  return NextResponse.json(frameResponse);
}
