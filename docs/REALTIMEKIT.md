# Cloudflare RealtimeKit

RealtimeKit is the dedicated realtime infrastructure for live inspections.

## Responsibilities

Meeting/session creation, participant tokens and roles, audio/video, screen sharing and realtime participant/session communication.

## Application responsibilities

The platform creates and authorises a realtime meeting as part of the deterministic inspection workflow, stores its identifier, associates the session with the inspection, records lifecycle events and continues evidence/findings/report processing outside RealtimeKit.

## Roles

- Inspector: host permissions, media and screen share.
- Customer: participant permissions, media without host controls.

## Current validation

The deployed backend successfully provisions the group-call-host and group-call-participant presets and successfully creates meetings and participant tokens for both roles.

## Boundary

Do not build a custom WebRTC/media engine when RealtimeKit provides the required capability.
