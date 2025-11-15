import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    name: v.string(),
    email: v.string(),
    imageUrl: v.optional(v.string()),
    userName: v.optional(v.string()), // Unique UserName for public
    tokenIdentifier: v.string(), //Unique identification for clerk

    //TimeStamps
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_token", ["tokenIdentifier"])
    .index("by_email", ["email"]) //Email lookups
    .index("by_username", ["userName"]) // Username lookups for Public
    .searchIndex("search_name", { searchField: "name" })
    .searchIndex("search_email", { searchField: "email" }),
});
