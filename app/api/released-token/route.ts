import { NextResponse } from "next/server";

// Mock user data - in a real app, get this from your auth session
const currentUser = {
  id: "user_12345",
  email: "john.doe@example.com",
  name: "John Doe",
  avatar: "https://ui-avatars.com/api/?name=John+Doe",
};

export async function POST() {
  try {
    const tokenResponse = await fetch(
      "https://accounts.releasedhub.com/auth/api/impersonation/token",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.RELEASED_SHARED_SECRET}`,
        },
        body: JSON.stringify({
          account_id: process.env.RELEASED_ACCOUNT_ID,
          user_id: currentUser.id,
          user_email: currentUser.email,
          profile: {
            name: currentUser.name,
            avatar_url: currentUser.avatar,
          },
        }),
      }
    );

    if (!tokenResponse.ok) {
      throw new Error(`API Error: ${tokenResponse.statusText}`);
    }

    const token = await tokenResponse.json();

    return NextResponse.json({ token });
  } catch (error) {
    console.error("Token generation failed:", error);
    return NextResponse.json(
      { error: "Failed to generate authentication token" },
      { status: 500 }
    );
  }
}
