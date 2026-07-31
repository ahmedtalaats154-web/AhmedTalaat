import {
  createHmac,
  pbkdf2Sync,
  randomBytes,
  timingSafeEqual,
} from "node:crypto";

export const ADMIN_COOKIE = "play_edit_admin";
const SESSION_SECONDS = 60 * 60 * 24 * 14;

function parseCookies(header: string | null) {
  return Object.fromEntries(
    (header ?? "")
      .split(";")
      .map((part) => part.trim())
      .filter(Boolean)
      .map((part) => {
        const index = part.indexOf("=");
        return [part.slice(0, index), decodeURIComponent(part.slice(index + 1))];
      }),
  );
}

function sessionSecret() {
  return process.env.ADMIN_SESSION_SECRET ?? "";
}

export function verifyAdminPassword(password: string) {
  const encoded = process.env.ADMIN_PASSWORD_HASH;
  if (!encoded) return false;
  const [scheme, iterationsValue, saltHex, digestHex] = encoded.split("$");
  const iterations = Number(iterationsValue);
  if (scheme !== "pbkdf2" || !iterations || !saltHex || !digestHex) return false;
  const actual = pbkdf2Sync(password, Buffer.from(saltHex, "hex"), iterations, 32, "sha256");
  const expected = Buffer.from(digestHex, "hex");
  return actual.length === expected.length && timingSafeEqual(actual, expected);
}

export function createAdminSession() {
  const secret = sessionSecret();
  if (!secret) throw new Error("ADMIN_SESSION_SECRET is not configured");
  const expires = Math.floor(Date.now() / 1000) + SESSION_SECONDS;
  const payload = `${expires}.${randomBytes(12).toString("hex")}`;
  const signature = createHmac("sha256", secret).update(payload).digest("base64url");
  return `${payload}.${signature}`;
}

export function verifyAdminSession(token: string | undefined) {
  const secret = sessionSecret();
  if (!secret || !token) return false;
  const [expiresValue, nonce, signature] = token.split(".");
  const expires = Number(expiresValue);
  if (!expires || expires < Math.floor(Date.now() / 1000) || !nonce || !signature) return false;
  const payload = `${expiresValue}.${nonce}`;
  const expected = createHmac("sha256", secret).update(payload).digest("base64url");
  const actualBuffer = Buffer.from(signature);
  const expectedBuffer = Buffer.from(expected);
  return actualBuffer.length === expectedBuffer.length && timingSafeEqual(actualBuffer, expectedBuffer);
}

export function isAdminRequest(request: Request) {
  const cookies = parseCookies(request.headers.get("cookie"));
  return verifyAdminSession(cookies[ADMIN_COOKIE]);
}

export const adminCookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict" as const,
  path: "/",
  maxAge: SESSION_SECONDS,
};

