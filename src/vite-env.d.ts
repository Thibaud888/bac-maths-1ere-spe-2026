/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** `1` : charge le chapitre-témoin de terminale (tests/fixtures/terminale/), en développement seulement. */
  readonly VITE_TEMOIN?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
