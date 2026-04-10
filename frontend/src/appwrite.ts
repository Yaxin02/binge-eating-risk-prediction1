import { Client, Databases, Functions, ID } from "appwrite";

const client = new Client();

client
    .setEndpoint(
      import.meta.env.VITE_APPWRITE_ENDPOINT || "https://nyc.cloud.appwrite.io/v1"
    )
    .setProject(import.meta.env.VITE_APPWRITE_PROJECT_ID || "69d8f483003b02a74713");

export const databases = new Databases(client);
export const functions = new Functions(client);
export { ID };

export const APPWRITE_DATABASE_ID =
  import.meta.env.VITE_APPWRITE_DATABASE_ID || "binge_db";
export const APPWRITE_COLLECTION_ID =
  import.meta.env.VITE_APPWRITE_COLLECTION_ID || "patients";

/**
 * Build-time default (see vite.config — may still be "predict" if nothing else is set).
 * Prefer resolveAppwriteFunctionId() so `public/appwrite-overrides.json` can override at runtime.
 */
export const APPWRITE_FUNCTION_ID =
  import.meta.env.VITE_APPWRITE_FUNCTION_ID || "predict";

let functionIdPromise: Promise<string> | null = null;

function appwriteOverridesJsonUrl(): string {
  return new URL("appwrite-overrides.json", window.location.href).href;
}

/** Non-empty `functionId` in /appwrite-overrides.json wins; then Vite env; then "predict". */
export function resolveAppwriteFunctionId(): Promise<string> {
  if (!functionIdPromise) {
    functionIdPromise = (async () => {
      try {
        const res = await fetch(appwriteOverridesJsonUrl(), {
          cache: "no-store",
        });
        if (res.ok) {
          const data = (await res.json()) as { functionId?: unknown };
          const id = data.functionId;
          if (typeof id === "string" && id.trim().length > 0) {
            return id.trim();
          }
        }
      } catch {
        /* no file or offline */
      }
      const fromEnv = import.meta.env.VITE_APPWRITE_FUNCTION_ID;
      if (typeof fromEnv === "string" && fromEnv.length > 0) {
        return fromEnv;
      }
      return "predict";
    })();
  }
  return functionIdPromise;
}
