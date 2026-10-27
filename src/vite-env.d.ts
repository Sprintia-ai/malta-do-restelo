/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL?: string;
  readonly VITE_SUPABASE_ANON_KEY?: string;
  /** Lovable's name for the same anon key; used as a fallback. */
  readonly VITE_SUPABASE_PUBLISHABLE_KEY?: string;
  readonly VITE_SUPABASE_PHOTO_BUCKET?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
