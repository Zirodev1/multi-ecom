"use server";

import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import { DEMO_MODE_COOKIE, DEMO_ROLE_COOKIE, DEMO_SESSION_COOKIE } from "@/lib/demo-mode";

export async function POST(request: Request) {
  const formData = await request.formData();
  const role = formData.get("role") as string;
  
  if (role !== "ADMIN" && role !== "SELLER") {
    return new Response("Invalid role", { status: 400 });
  }
  
  // Generate a session ID
  const sessionId = uuidv4();
  
  // Set cookies with 24-hour expiration
  const expires = new Date();
  expires.setHours(expires.getHours() + 24);
  
  // Create the redirect URL based on role
  const redirectURL = role === "ADMIN" ? "/dashboard/admin" : "/dashboard/seller";
  
  // Use NextResponse to create a redirect response with cookies
  const response = NextResponse.redirect(new URL(redirectURL, request.url));
  
  // Set cookies on the response
  response.cookies.set({
    name: DEMO_MODE_COOKIE,
    value: "true",
    path: "/",
    httpOnly: true,
    sameSite: "lax",
    expires
  });
  
  response.cookies.set({
    name: DEMO_SESSION_COOKIE,
    value: sessionId,
    path: "/",
    httpOnly: true,
    sameSite: "lax",
    expires
  });
  
  response.cookies.set({
    name: DEMO_ROLE_COOKIE,
    value: role,
    path: "/",
    httpOnly: true,
    sameSite: "lax",
    expires
  });
  
  return response;
} 