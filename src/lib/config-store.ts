import { createCipheriv, createDecipheriv, randomBytes } from "node:crypto";
import { list, put } from "@vercel/blob";
import seedConfig from "../data/seed-config.json";
import { mergeSiteConfig, type SiteConfig } from "./site-config";

const CONFIG_PATH = "site-control/config.enc.json";

type EncryptedConfig = {
  v: 1;
  iv: string;
  tag: string;
  data: string;
};

function encryptionKey() {
  const value = process.env.CONFIG_ENCRYPTION_KEY;
  if (!value) return null;
  const key = /^[a-f0-9]{64}$/i.test(value)
    ? Buffer.from(value, "hex")
    : Buffer.from(value, "base64");
  if (key.length !== 32) throw new Error("CONFIG_ENCRYPTION_KEY must contain 32 bytes");
  return key;
}

function encrypt(config: SiteConfig, key: Buffer): EncryptedConfig {
  const iv = randomBytes(12);
  const cipher = createCipheriv("aes-256-gcm", key, iv);
  const data = Buffer.concat([cipher.update(JSON.stringify(config), "utf8"), cipher.final()]);
  return {
    v: 1,
    iv: iv.toString("base64"),
    tag: cipher.getAuthTag().toString("base64"),
    data: data.toString("base64"),
  };
}

function decrypt(payload: EncryptedConfig, key: Buffer) {
  const decipher = createDecipheriv("aes-256-gcm", key, Buffer.from(payload.iv, "base64"));
  decipher.setAuthTag(Buffer.from(payload.tag, "base64"));
  return JSON.parse(
    Buffer.concat([
      decipher.update(Buffer.from(payload.data, "base64")),
      decipher.final(),
    ]).toString("utf8"),
  );
}

export function getSeedConfig() {
  return mergeSiteConfig(seedConfig);
}

export async function getStoredConfig() {
  const key = encryptionKey();
  if (!key || !process.env.BLOB_READ_WRITE_TOKEN) return getSeedConfig();
  const result = await list({ prefix: CONFIG_PATH, limit: 10 });
  const blob = result.blobs.find((item) => item.pathname === CONFIG_PATH);
  if (!blob) return getSeedConfig();
  const response = await fetch(blob.url, { cache: "no-store" });
  if (!response.ok) throw new Error("Could not read saved site configuration");
  const payload = (await response.json()) as EncryptedConfig;
  return mergeSiteConfig(decrypt(payload, key));
}

export async function saveStoredConfig(value: unknown) {
  const key = encryptionKey();
  if (!key) throw new Error("CONFIG_ENCRYPTION_KEY is not configured");
  const config = mergeSiteConfig(value);
  await put(CONFIG_PATH, JSON.stringify(encrypt(config, key)), {
    access: "public",
    addRandomSuffix: false,
    allowOverwrite: true,
    contentType: "application/json",
  });
  return config;
}

