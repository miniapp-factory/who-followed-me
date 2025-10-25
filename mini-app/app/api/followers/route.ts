import { NextResponse } from "next/server";

interface Follower {
  username: string;
  pfp_url: string;
  timestamp: number;
}

interface FollowersResponse {
  followers: Follower[];
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const fid = url.searchParams.get("fid");

  if (!fid) {
    return NextResponse.json(
      { error: "Missing fid query parameter" },
      { status: 400 }
    );
  }

  const apiKey = process.env.NEYNAR_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "NEYNAR_API_KEY not set" },
      { status: 500 }
    );
  }

  const apiUrl = `https://api.neynar.com/v2/farcaster/user/followers?fid=${fid}&limit=5`;

  try {
    const res = await fetch(apiUrl, {
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
    });

    if (!res.ok) {
      const errorText = await res.text();
      return NextResponse.json(
        { error: `Neynar API error: ${errorText}` },
        { status: res.status }
      );
    }

    const data: FollowersResponse = await res.json();

    const followers = data.followers.map((f) => ({
      username: f.username,
      pfp_url: f.pfp_url,
      timestamp: f.timestamp,
    }));

    return NextResponse.json({ followers });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message ?? "Unknown error" },
      { status: 500 }
    );
  }
}
