import { type Result, err, ok } from "@/domain/errors/result";

const SUPABASE_URL_KEY = "EXPO_PUBLIC_SUPABASE_URL";
const SUPABASE_ANON_KEY = "EXPO_PUBLIC_SUPABASE_ANON_KEY";

export type SupabaseConfig = Readonly<{
  url: string;
  anonKey: string;
}>;

export type SupabaseConfigError = Readonly<{
  code: "missing_supabase_config";
  message: string;
}>;

export function readSupabaseConfig(): Result<SupabaseConfig, SupabaseConfigError> {
  const url = process.env[SUPABASE_URL_KEY];
  const anonKey = process.env[SUPABASE_ANON_KEY];

  if (!url || !anonKey) {
    return err({
      code: "missing_supabase_config",
      message: "Renseignez EXPO_PUBLIC_SUPABASE_URL et EXPO_PUBLIC_SUPABASE_ANON_KEY."
    });
  }

  return ok({ url, anonKey });
}
