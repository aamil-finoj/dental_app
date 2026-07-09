import { Redis } from "@upstash/redis";

// Vercel's Redis marketplace integration uses the legacy KV_REST_API_*
// names; support the standard UPSTASH_REDIS_REST_* names too in case the
// project is ever connected a different way.
const url = process.env.KV_REST_API_URL ?? process.env.UPSTASH_REDIS_REST_URL;
const token = process.env.KV_REST_API_TOKEN ?? process.env.UPSTASH_REDIS_REST_TOKEN;

export const redis = url && token ? new Redis({ url, token }) : null;
