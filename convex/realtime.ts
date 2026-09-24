import { action, mutation, query } from "./_generated/server"
import { v } from "convex/values"

const API_BASE = "https://api.cloudflare.com/client/v4"

async function cloudflare(path: string, init?: RequestInit) {
  const accountId = process.env.CLOUDFLARE_ACCOUNT_ID
  const appId = process.env.CLOUDFLARE_REALTIME_APP_ID
  const apiToken = process.env.CLOUDFLARE_API_TOKEN
  if (!accountId || !appId || !apiToken) {
    throw new Error("Cloudflare RealtimeKit backend configuration is incomplete. Set CLOUDFLARE_ACCOUNT_ID, CLOUDFLARE_REALTIME_APP_ID and CLOUDFLARE_API_TOKEN.")
  }
  const response = await fetch(
    `${API_BASE}/accounts/${accountId}/realtime/kit/${appId}${path}`,
    {
      ...init,
      headers: {
        Authorization: `Bearer ${apiToken}`,
        "Content-Type": "application/json",
        ...(init?.headers ?? {}),
      },
    },
  )
  const data = await response.json()
  if (!response.ok || !data?.success) {
    const message = data?.errors?.map((e: any) => e.message).join("; ") || data?.errorDescription || data?.message || JSON.stringify(data) || "Cloudflare RealtimeKit request failed"
    throw new Error(message)
  }
  return data
}

export const createMeeting = action({
  args: { title: v.string() },
  handler: async (_ctx, args) => {
    const data = await cloudflare("/meetings", {
      method: "POST",
      body: JSON.stringify({ title: args.title }),
    })
    return { meetingId: data.data.id }
  },
})

export const createParticipantToken = action({
  args: {
    meetingId: v.string(),
    participantId: v.string(),
    name: v.string(),
    role: v.union(v.literal("inspector"), v.literal("customer")),
  },
  handler: async (_ctx, args) => {
    const preset = args.role === "inspector"
      ? (process.env.CLOUDFLARE_INSPECTOR_PRESET || "group-call-host")
      : (process.env.CLOUDFLARE_CUSTOMER_PRESET || "group-call-participant")

    const data = await cloudflare(`/meetings/${args.meetingId}/participants`, {
      method: "POST",
      body: JSON.stringify({
        name: args.name,
        preset_name: preset,
        custom_participant_id: args.participantId,
      }),
    })

    return {
      meetingId: args.meetingId,
      participantId: data.data.id,
      authToken: data.data.token,
      preset,
    }
  },
})


/** @deprecated Kept temporarily for Convex contract compatibility with previously published clients. */
export const createSession = action({
  args: { correlationId: v.optional(v.string()) },
  handler: async (_ctx, args) => {
    const appId = process.env.CLOUDFLARE_REALTIME_APP_ID
    const token = process.env.CLOUDFLARE_API_TOKEN
    if (!appId || !token) throw new Error("Cloudflare Realtime is not configured")
    const suffix = args.correlationId ? `?correlationId=${encodeURIComponent(args.correlationId)}` : ""
    const res = await fetch(`https://rtc.live.cloudflare.com/v1/apps/${appId}/sessions/new${suffix}`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify({}),
    })
    const data = await res.json()
    if (!res.ok) throw new Error(data?.errorDescription ?? data?.error?.message ?? "Cloudflare session creation failed")
    return data
  },
})

/** @deprecated Kept temporarily for Convex contract compatibility with previously published clients. */
export const tracks = action({
  args: {
    sessionId: v.string(),
    sessionDescription: v.optional(v.object({ type: v.string(), sdp: v.string() })),
    tracks: v.array(v.object({
      location: v.union(v.literal("local"), v.literal("remote")),
      mid: v.optional(v.string()),
      trackName: v.optional(v.string()),
      sessionId: v.optional(v.string()),
    })),
  },
  handler: async (_ctx, args) => {
    const appId = process.env.CLOUDFLARE_REALTIME_APP_ID
    const token = process.env.CLOUDFLARE_API_TOKEN
    if (!appId || !token) throw new Error("Cloudflare Realtime is not configured")
    const res = await fetch(`https://rtc.live.cloudflare.com/v1/apps/${appId}/sessions/${args.sessionId}/tracks/new`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify({ sessionDescription: args.sessionDescription, tracks: args.tracks }),
    })
    const data = await res.json()
    if (!res.ok) throw new Error(data?.errorDescription ?? "Cloudflare track operation failed")
    return data
  },
})

/** @deprecated Kept temporarily for Convex contract compatibility with previously published clients. */
export const renegotiate = action({
  args: { sessionId: v.string(), sessionDescription: v.object({ type: v.string(), sdp: v.string() }) },
  handler: async (_ctx, args) => {
    const appId = process.env.CLOUDFLARE_REALTIME_APP_ID
    const token = process.env.CLOUDFLARE_API_TOKEN
    if (!appId || !token) throw new Error("Cloudflare Realtime is not configured")
    const res = await fetch(`https://rtc.live.cloudflare.com/v1/apps/${appId}/sessions/${args.sessionId}/renegotiate`, {
      method: "PUT",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify({ sessionDescription: args.sessionDescription }),
    })
    const data = await res.json()
    if (!res.ok) throw new Error(data?.errorDescription ?? "Cloudflare renegotiation failed")
    return data
  },
})

export const ensurePresets = action({
  args: {},
  handler: async () => {
    const existing = await cloudflare("/presets", { method: "GET" })
    const names = new Set((existing.data ?? []).map((p: any) => p.name))
    const make = async (name: string, host: boolean) => {
      if (names.has(name)) return
      await cloudflare("/presets", {
        method: "POST",
        body: JSON.stringify({
          name,
          config: {
            max_screenshare_count: host ? 1 : 0,
            max_video_streams: { desktop: 4, mobile: 2 },
            media: {
              screenshare: { frame_rate: 15, quality: "hd" },
              video: { frame_rate: 30, quality: "hd" },
            },
            view_type: "GROUP_CALL",
          },
          permissions: {
            accept_waiting_requests: host,
            can_accept_production_requests: host,
            can_change_participant_permissions: host,
            can_edit_display_name: true,
            can_livestream: false,
            can_record: false,
            can_spotlight: host,
            chat: { private: { can_receive: true, can_send: true, files: false, text: true }, public: { can_send: true, files: false, text: true } },
            disable_participant_audio: false,
            disable_participant_screensharing: !host,
            disable_participant_video: false,
            kick_participant: host,
            media: {
              audio: { can_produce: "ALLOWED" },
              screenshare: { can_produce: host ? "ALLOWED" : "NOT_ALLOWED" },
              video: { can_produce: "ALLOWED" },
            },
            pin_participant: host,
            recorder_type: "NONE",
            show_participant_list: true,
            waiting_room_type: "SKIP",
          },
        }),
      })
    }
    await make("group-call-host", true)
    await make("group-call-participant", false)
    return { ok: true, presets: ["group-call-host", "group-call-participant"] }
  },
})
