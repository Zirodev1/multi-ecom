// Constants for demo mode that are safe to use on client-side
export const DEMO_SESSION_COOKIE = "demo_session_id";
export const DEMO_MODE_COOKIE = "demo_mode";
export const DEMO_ROLE_COOKIE = "demo_role";
export const DEMO_STORE_URL = "demo-store";

export type DemoRole = "ADMIN" | "SELLER" | null;

/**
 * Helper function to check if a user is in demo mode on the client-side
 */
export function getClientDemoMode(): boolean {
  try {
    if (typeof document === 'undefined') return false;
    const cookieString = document.cookie || '';
    const cookies = cookieString.split('; ');
    const demoModeCookie = cookies.find(c => c.startsWith(`${DEMO_MODE_COOKIE}=`));
    return demoModeCookie?.split('=')[1] === 'true';
  } catch (error) {
    console.error("Error checking demo mode:", error);
    return false;
  }
}

/**
 * Helper function to get the demo role on the client-side
 */
export function getClientDemoRole(): DemoRole {
  try {
    if (typeof document === 'undefined') return null;
    const cookieString = document.cookie || '';
    const cookies = cookieString.split('; ');
    const roleCookie = cookies.find(c => c.startsWith(`${DEMO_ROLE_COOKIE}=`));
    const roleValue = roleCookie?.split('=')[1];
    
    if (roleValue === "ADMIN" || roleValue === "SELLER") {
      return roleValue;
    }
    return null;
  } catch (error) {
    console.error("Error getting demo role:", error);
    return null;
  }
} 