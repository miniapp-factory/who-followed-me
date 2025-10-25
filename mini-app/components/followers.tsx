"use client";

import { useEffect, useState } from "react";
import { useMiniAppContext } from "@/components/context/miniapp-provider";
import type { MiniAppSDK } from "@farcaster/miniapp-sdk";

interface Follower {
  username: string;
  avatarUrl?: string;
}

export function Followers() {
  const { sdk } = useMiniAppContext();
  const [followers, setFollowers] = useState<Follower[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchFollowers() {
      if (!sdk) return;
      try {
        // Assuming the SDK provides a method to fetch followers.
        // Replace `getFollowers` with the actual method name if different.
        const data = await (sdk as MiniAppSDK).getFollowers({ limit: 10 });
        setFollowers(data as Follower[]);
      } catch (e) {
        console.error("Failed to fetch followers:", e);
      } finally {
        setLoading(false);
      }
    }
    fetchFollowers();
  }, [sdk]);

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-12 w-full bg-muted rounded-md animate-pulse" />
        ))}
      </div>
    );
  }

  if (!followers.length) {
    return <p>No followers found.</p>;
  }

  return (
    <div className="space-y-4">
      {followers.map((follower, i) => (
        <div key={i} className="flex items-center gap-4 p-4 border rounded-md">
          {follower.avatarUrl ? (
            <img
              src={follower.avatarUrl}
              alt={follower.username}
              className="size-10 rounded-full"
            />
          ) : (
            <div className="size-10 rounded-full bg-muted flex items-center justify-center">
              {follower.username?.[0]?.toUpperCase() ?? "U"}
            </div>
          )}
          <span className="font-medium">{follower.username}</span>
        </div>
      ))}
    </div>
  );
}
