/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_ALGOLIA_APP_ID: string;
  readonly VITE_SEARCH_API_KEY: string;
  readonly VITE_SEARCH_INDEX: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
