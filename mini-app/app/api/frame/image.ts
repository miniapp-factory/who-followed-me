import { NextResponse } from "next/server";
import { createCanvas, loadImage } from "canvas";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const fid = url.searchParams.get("fid") ?? "";

  // Create a simple canvas with placeholder text
  const width = 1200;
  const height = 1200;
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext("2d");

  // Background
  ctx.fillStyle = "#1e1e1e";
  ctx.fillRect(0, 0, width, height);

  // Title
  ctx.fillStyle = "#ffffff";
  ctx.font = "bold 80px Arial";
  ctx.textAlign = "center";
  ctx.fillText("Who Followed Me?", width / 2, 200);

  // Fetch followers to display avatars
  const origin = request.nextUrl.origin;
  const followersRes = await fetch(`${origin}/api/followers?fid=${fid}`);
  const followersData = await followersRes.json();
  const followers = followersData.followers ?? [];

  const avatarSize = 200;
  const spacing = 50;
  let x = (width - (followers.length * avatarSize + (followers.length - 1) * spacing)) / 2;
  const y = 300;

  for (const follower of followers) {
    try {
      const img = await loadImage(follower.pfp_url);
      ctx.drawImage(img, x, y, avatarSize, avatarSize);
    } catch {
      // If avatar fails to load, draw a placeholder circle
      ctx.fillStyle = "#555555";
      ctx.beginPath();
      ctx.arc(x + avatarSize / 2, y + avatarSize / 2, avatarSize / 2, 0, Math.PI * 2);
      ctx.fill();
    }
    x += avatarSize + spacing;
  }

  const buffer = canvas.toBuffer("image/png");
  return new NextResponse(buffer, {
    headers: {
      "Content-Type": "image/png",
    },
  });
}
