import { CloudClient } from "chromadb";

export const CHROMA_CLIENT = new CloudClient({
  apiKey: process.env.NEXT_PUBLIC_CHROMA_API_KEY,
  tenant: process.env.NEXT_PUBLIC_CHROMA_TENANT,
  database: process.env.NEXT_PUBLIC_CHROMA_DATABASE,
});