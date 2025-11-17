import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { api } from "./_generated/api";

export const getUserDraft = query({
  handler: async (ctx) => {
    const authenticatedUser = await ctx.runQuery(api.users.getCurrentUser);

    if (!authenticatedUser) {
      throw new Error("User not authenticated.");
    }

    // --- FIX: Use an index for an efficient lookup ---
    //
    // The .filter() you used before was an ERROR. It scans the entire
    // "posts" table, which is very slow.
    //
    // .withIndex() uses an index to find the exact post instantly,
    // which is the correct and high-performance way.
    const draft = await ctx.db
      .query("posts")
      .withIndex("by_author_status", (q) =>
        q.eq("authorId", authenticatedUser._id).eq("status", "draft")
      )
      .unique();

    return draft;
  },
});

// Create a new post, with special logic to update an existing draft
// if one already exists.
export const createPost = mutation({
  args: {
    title: v.string(),
    content: v.string(),
    status: v.union(v.literal("draft"), v.literal("published")),
    tags: v.optional(v.array(v.string())),
    category: v.optional(v.string()),
    featuredImage: v.optional(v.string()),
    scheduledAt: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    // 1. Get Authenticated User
    const authenticatedUser = await ctx.runQuery(api.users.getCurrentUser);

    // --- FIX: Add authentication check ---
    if (!authenticatedUser) {
      throw new Error("User not authenticated.");
    }

    // 2. Check for an existing draft by this user
    // Note: For this to be fast, add an index in your schema:
    // .index("by_author_status", ["authorId", "status"])
    const existingDraft = await ctx.db
      .query("posts")
      .withIndex("by_author_status", (q) =>
        q.eq("authorId", authenticatedUser._id).eq("status", "draft")
      )
      .unique();

    const now = Date.now();

    // --- IMPROVED LOGIC ---

    // 3. If a draft already exists, update it instead of creating a new one.
    if (existingDraft) {
      // Create an 'updates' object with all fields from args
      const updates = {
        ...args, // Spreads title, content, status, tags, etc.
        updatedAt: now,
      };

      // Handle the specific case of publishing the draft
      if (args.status === "published" && existingDraft.status === "draft") {
        updates.publishedAt = now;
      }

      // Patch the existing draft
      await ctx.db.patch(existingDraft._id, updates);

      // --- FIX: Return after patching to prevent creating a new post ---
      return existingDraft._id;
    }

    // 4. If no draft exists, create a new post.
    const postId = await ctx.db.insert("posts", {
      // Use spread to set all fields from args
      ...args,

      // Set server-controlled fields
      authorId: authenticatedUser._id,
      createdAt: now,
      updatedAt: now,
      publishedAt: args.status === "published" ? now : undefined,

      // Set default values for optional fields if needed
      tags: args.tags || [],

      // Set initial counts
      viewCount: 0,
      likeCount: 0,
    });

    return postId;
  },
});

// Update an existing post
export const updatePost = mutation({
  // --- BETTER ARGS ---
  // All fields except 'id' should be optional for a patch operation.
  // This allows the client to send *only* the fields they want to change.
  args: {
    id: v.id("posts"),
    title: v.optional(v.string()),
    content: v.optional(v.string()),
    status: v.optional(v.union(v.literal("draft"), v.literal("published"))),

    // Content Metadata
    tags: v.optional(v.array(v.string())),
    category: v.optional(v.string()),
    featuredImage: v.optional(v.string()),

    // Timestamps
    scheduledAt: v.optional(v.number()),
  },

  handler: async (ctx, args) => {
    // 1. Get Authenticated User
    const authenticatedUser = await ctx.runQuery(api.users.getCurrentUser);

    if (!authenticatedUser) {
      throw new Error("User not authenticated.");
    }

    // 2. Get the Post
    // --- FIX: Use args.id, not args._id ---
    const post = await ctx.db.get(args.id);

    if (!post) {
      throw new Error("Post not found.");
    }

    // 3. Authorization
    if (post.authorId !== authenticatedUser._id) {
      throw new Error("User is not authorized to update this post.");
    }

    // --- SIMPLIFIED UPDATE LOGIC ---

    // 4. Separate the ID from the rest of the update fields
    const { id, ...updates } = args;
    const now = Date.now();

    // 5. Always set the updatedAt timestamp
    // 'updates' now contains only the fields the client sent (e.g., { title: "New Title" })
    updates.updatedAt = now;

    // 6. Handle special logic for publishing
    // We only set publishedAt if the status is *changing* from "draft" to "published"
    if (updates.status === "published" && post.status === "draft") {
      updates.publishedAt = now;
    }

    // 7. Patch the document
    // Convex's patch() will automatically and efficiently update only the
    // fields provided in the 'updates' object. No more manual 'if' checks!
    await ctx.db.patch(id, updates);

    // 8. Return a success confirmation
    return { success: true, postId: id };
  },
});
