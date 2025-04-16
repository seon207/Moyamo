interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string
  readonly MODE: string;
  readonly VITE_USE_MOCK_DATA: string;
  readonly VITE_SERVER_STATIC_WS_URL: string;
  readonly VITE_SERVER_DYNAMIC_WS_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv
  glob: (
    pattern: string, 
    options?: { 
      eager?: boolean;
      as?: string;
    }
  ) => Record<string, any>;
}
