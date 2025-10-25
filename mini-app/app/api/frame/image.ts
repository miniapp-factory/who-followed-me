import { ImageResponse } from "@vercel/og";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const fid = url.searchParams.get("fid") ?? "";

  // Fetch followers to display avatars
  const origin = request.nextUrl.origin;
  const followersRes = await fetch(`${origin}/api/followers?fid=${fid}`);
  const followersData = await followersRes.json();
  const followers = followersData.followers ?? [];

  const width = 1200;
  const height = 1200;
  const avatarSize = 200;
  const spacing = 50;

  const component = (
    <div
      style={{
        width: `${width}px`,
        height: `${height}px`,
        backgroundColor: "#1e1e1e",
        color: "#ffffff",
        fontSize: "80px",
        fontWeight: "bold",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "flex-start",
        paddingTop: "200px",
      }}
    >
      <div>Who Followed Me?</div>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          gap: `${spacing}px`,
          marginTop: "50px",
        }}
      >
        {followers.map((f: any, i: number) => (
          <img
            key={i}
            src={f.pfp_url}
            width={avatarSize}
            height={avatarSize}
            style={{
              borderRadius: "50%",
              objectFit: "cover",
            }}
          />
        ))}
      </div>
    </div>
  );

  return new ImageResponse(component, {
    width,
    height,
  });
}
