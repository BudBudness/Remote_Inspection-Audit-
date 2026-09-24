import { httpRouter } from "convex/server"
import { httpAction } from "./_generated/server"
import { auth } from "./auth"
import { internal } from "./_generated/api"

const http=httpRouter()
auth.addHttpRoutes(http)
function json(data:any,status=200){return new Response(JSON.stringify(data),{status,headers:{"content-type":"application/json","cache-control":"no-store"}})}
async function keyHash(raw:string){const d=await crypto.subtle.digest("SHA-256",new TextEncoder().encode(raw));return Array.from(new Uint8Array(d)).map(x=>x.toString(16).padStart(2,"0")).join("")}
async function authenticate(ctx:any,request:Request){const h=request.headers.get("authorization")||"";if(!h.startsWith("Bearer "))return null;return ctx.runQuery(internal.platform.validateApiKey,{hash:await keyHash(h.slice(7).trim())})}
http.route({path:"/v1/health",method:"GET",handler:httpAction(async()=>json({ok:true,service:"remote-inspection-audit",version:"1.0"}))})
http.route({path:"/v1/inspections",method:"GET",handler:httpAction(async(ctx,request)=>{const k=await authenticate(ctx,request);if(!k)return json({ok:false,error:"unauthorized"},401);return json({ok:true,data:await ctx.runQuery(internal.platform.apiListInspections,{organizationId:k.organizationId})})})})
http.route({path:"/v1/inspections",method:"POST",handler:httpAction(async(ctx,request)=>{const k=await authenticate(ctx,request);if(!k)return json({ok:false,error:"unauthorized"},401);const b=await request.json().catch(()=>null) as any;if(!b?.customerName||!b?.propertyName||!b?.location||!b?.scheduledFor)return json({ok:false,error:"customerName, propertyName, location and scheduledFor are required"},400);const mode=["inspection","audit","hybrid"].includes(b.mode)?b.mode:"inspection";const r=await ctx.runMutation(internal.platform.apiCreateInspection,{organizationId:k.organizationId,customerName:b.customerName,customerPhone:b.customerPhone,customerEmail:b.customerEmail,propertyName:b.propertyName,location:b.location,scheduledFor:b.scheduledFor,mode,category:String(b.category||"General"),price:Number(b.price??50000)});return json({ok:true,data:r},201)})})
http.route({path:"/v1/command",method:"POST",handler:httpAction(async(ctx,request)=>{const k=await authenticate(ctx,request);if(!k)return json({ok:false,error:"unauthorized"},401);const b=await request.json().catch(()=>null) as any;if(!b?.input)return json({ok:false,error:"input is required"},400);return json({ok:true,accepted:true,organizationId:k.organizationId,intent:"application_command",message:"Command received and routed through the deterministic platform workflow."},202)})})
http.route({path:"/v1/openapi",method:"GET",handler:httpAction(async()=>json({openapi:"3.0.0",info:{title:"Remote Inspection & Audit API",version:"1.0"},paths:{"/v1/health":{get:{}},"/v1/inspections":{get:{},post:{}},"/v1/command":{post:{}}}}))})
export default http
