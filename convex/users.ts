import { getAuthUserId } from "@convex-dev/auth/server"
import { mutation, query } from "./_generated/server"
import { v } from "convex/values"

export const current = query({args:{},handler:async(ctx)=>{
  const id=await getAuthUserId(ctx); if(!id) return null
  return await ctx.db.get(id)
}})
export const updateProfile = mutation({
  args:{name:v.string(),phone:v.optional(v.string())},
  handler:async(ctx,args)=>{const id=await getAuthUserId(ctx);if(!id)throw new Error("Not authenticated");await ctx.db.patch(id,{name:args.name,phone:args.phone})}
})
