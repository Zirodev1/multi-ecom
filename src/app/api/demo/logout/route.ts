"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { DEMO_MODE_COOKIE, DEMO_ROLE_COOKIE, DEMO_SESSION_COOKIE } from "@/lib/demo-mode";

export async function POST() {
  // Clear all demo cookies
  const cookieStore = cookies();
  
  cookieStore.delete(DEMO_MODE_COOKIE);
  cookieStore.delete(DEMO_SESSION_COOKIE);
  cookieStore.delete(DEMO_ROLE_COOKIE);
  
  // Redirect to home page
  redirect("/");
} 