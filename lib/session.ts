import "server-only";
import { SignJWT, jwtVerify } from "jose";
import { cookies, headers } from "next/headers";

const COOKIE_NAME = "admin_session";
const EXPIRES_IN = 7 * 24 * 60 * 60 * 1000; // 7 days

function getSecret(): Uint8Array {
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!secret) throw new Error("ADMIN_SESSION_SECRET is not set");
  return new TextEncoder().encode(secret);
}

async function shouldUseSecureCookies(): Promise<boolean> {
  const headerStore = await headers();
  const forwardedProto = headerStore.get("x-forwarded-proto");
  if (forwardedProto) {
    return forwardedProto.split(",")[0]?.trim() === "https";
  }

  const origin = headerStore.get("origin");
  if (origin) {
    return origin.startsWith("https://");
  }

  const referer = headerStore.get("referer");
  if (referer) {
    return referer.startsWith("https://");
  }

  return false;
}

export interface SessionPayload {
  adminId: string;
  exp?: number;
  [key: string]: unknown;
}

export async function encrypt(payload: SessionPayload): Promise<string> {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(getSecret());
}

export async function decrypt(token: string | undefined): Promise<SessionPayload | null> {
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, getSecret(), {
      algorithms: ["HS256"],
    });
    return payload as unknown as SessionPayload;
  } catch {
    return null;
  }
}

export async function createSession(adminId: string): Promise<void> {
  const token = await encrypt({ adminId });
  const cookieStore = await cookies();
  const secure = await shouldUseSecureCookies();
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure,
    sameSite: "lax",
    maxAge: EXPIRES_IN / 1000,
    path: "/",
  });
}

export async function deleteSession(): Promise<void> {
  const cookieStore = await cookies();
  const secure = await shouldUseSecureCookies();
  cookieStore.set(COOKIE_NAME, "", {
    httpOnly: true,
    secure,
    sameSite: "lax",
    expires: new Date(0),
    path: "/",
  });
}
