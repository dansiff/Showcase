// app/api/creator/content/create/route.ts
// API route to create new posts

import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const supabase = await createSupabaseServerClient();
    const {
      data: { user: authUser },
    } = await supabase.auth.getUser();

    if (!authUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get user from database
    const user = await prisma.user.findUnique({
      where: { email: authUser.email! },
      include: {
        creator: true,
      },
    });

    if (!user?.creator) {
      return NextResponse.json(
        { error: "Only creators can create posts" },
        { status: 403 }
      );
    }

    // Parse request body
    const body = await request.json();
    const { title, content, imageUrl, videoUrl, isPremium, isPublished } = body;

    // Validate required fields
    if (!content || content.trim() === "") {
      return NextResponse.json(
        { error: "Content is required" },
        { status: 400 }
      );
    }

    // Create the post
    const post = await prisma.post.create({
      data: {
        authorId: user.id,
        title: title || null,
        content: content.trim(),
        imageUrl: imageUrl || null,
        videoUrl: videoUrl || null,
        isPremium: isPremium || false,
        isPublished: isPublished !== undefined ? isPublished : true,
      },
    });

    return NextResponse.json({
      success: true,
      post,
      message: "Post created successfully",
    });
  } catch (error) {
    console.error("[CONTENT_CREATE]", error);
    return NextResponse.json(
      { error: "Failed to create post" },
      { status: 500 }
    );
  }
}
