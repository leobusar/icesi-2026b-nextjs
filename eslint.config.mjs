import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import boundaries from "eslint-plugin-boundaries";

// Tipos de elemento: uno por carpeta de capa, por feature. Son explícitos
// (no genéricos con "capture") a propósito: así cada regla se puede leer
// y explicar en clase sin conocer la sintaxis de captura del plugin.
const elements = [
  // rentals
  { type: "rentals-domain", pattern: "src/features/rentals/domain/**" },
  { type: "rentals-application", pattern: "src/features/rentals/application/**" },
  { type: "rentals-infrastructure", pattern: "src/features/rentals/infrastructure/**" },
  { type: "rentals-presentation", pattern: "src/features/rentals/presentation/**" },
  { type: "rentals-di", pattern: "src/features/rentals/di/**" },
  { type: "rentals-testing", pattern: "src/features/rentals/testing/**" },
  { type: "rentals-index", pattern: "src/features/rentals/index.ts", partialMatch: false },
  // vehicles
  { type: "vehicles-domain", pattern: "src/features/vehicles/domain/**" },
  { type: "vehicles-application", pattern: "src/features/vehicles/application/**" },
  { type: "vehicles-infrastructure", pattern: "src/features/vehicles/infrastructure/**" },
  { type: "vehicles-presentation", pattern: "src/features/vehicles/presentation/**" },
  { type: "vehicles-di", pattern: "src/features/vehicles/di/**" },
  { type: "vehicles-testing", pattern: "src/features/vehicles/testing/**" },
  { type: "vehicles-index", pattern: "src/features/vehicles/index.ts", partialMatch: false },
  // auth (todavía sin domain/presentation propios)
  { type: "auth-application", pattern: "src/features/auth/application/**" },
  { type: "auth-infrastructure", pattern: "src/features/auth/infrastructure/**" },
  { type: "auth-di", pattern: "src/features/auth/di/**" },
  // shared
  { type: "shared-domain", pattern: "src/shared/domain/**" },
  { type: "shared-application", pattern: "src/shared/application/**" },
  { type: "shared-infrastructure", pattern: "src/shared/infrastructure/**" },
  { type: "shared-ui", pattern: "src/shared/ui/**" },
  { type: "shared-di", pattern: "src/shared/di/**" },
  // Next.js (composición: páginas y layout) y lo que todavía no se migró.
  { type: "app", pattern: "src/app/**" },
  { type: "legacy", pattern: "src/components/**" },
];

const allow = (types) => ({ to: { element: { types: { anyOf: types } } } });
const allowOne = (type) => ({ to: { element: { type } } });

const policies = [
  // rentals: domain no depende de nada propio del proyecto salvo shared/domain.
  { from: { element: { type: "rentals-domain" } }, allow: allowOne("shared-domain") },
  {
    from: { element: { type: "rentals-application" } },
    allow: allow(["rentals-domain", "rentals-testing", "shared-domain", "shared-application"]),
  },
  {
    from: { element: { type: "rentals-infrastructure" } },
    allow: allow([
      "rentals-domain",
      "rentals-application",
      "shared-domain",
      "shared-application",
      "shared-infrastructure",
    ]),
  },
  {
    from: { element: { type: "rentals-presentation" } },
    allow: allow([
      "rentals-domain",
      "rentals-application",
      "rentals-testing",
      "shared-domain",
      "shared-application",
      "shared-ui",
    ]),
  },
  {
    from: { element: { type: "rentals-di" } },
    allow: allow([
      "rentals-domain",
      "rentals-application",
      "rentals-infrastructure",
      "rentals-presentation",
      "shared-domain",
      "shared-infrastructure",
      "shared-di",
    ]),
  },
  {
    from: { element: { type: "rentals-testing" } },
    allow: allow(["rentals-domain", "rentals-application", "shared-domain"]),
  },
  { from: { element: { type: "rentals-index" } }, allow: allow(["rentals-presentation", "rentals-di"]) },

  // vehicles: misma forma que rentals.
  { from: { element: { type: "vehicles-domain" } }, allow: allowOne("shared-domain") },
  {
    from: { element: { type: "vehicles-application" } },
    allow: allow(["vehicles-domain", "vehicles-testing", "shared-domain", "shared-application"]),
  },
  {
    from: { element: { type: "vehicles-infrastructure" } },
    allow: allow([
      "vehicles-domain",
      "vehicles-application",
      "shared-domain",
      "shared-application",
      "shared-infrastructure",
    ]),
  },
  {
    from: { element: { type: "vehicles-presentation" } },
    allow: allow([
      "vehicles-domain",
      "vehicles-application",
      "vehicles-testing",
      "shared-domain",
      "shared-application",
      "shared-ui",
    ]),
  },
  {
    from: { element: { type: "vehicles-di" } },
    allow: allow([
      "vehicles-domain",
      "vehicles-application",
      "vehicles-infrastructure",
      "vehicles-presentation",
      "shared-domain",
      "shared-infrastructure",
      "shared-di",
    ]),
  },
  {
    from: { element: { type: "vehicles-testing" } },
    allow: allow(["vehicles-domain", "vehicles-application", "shared-domain"]),
  },
  { from: { element: { type: "vehicles-index" } }, allow: allow(["vehicles-presentation", "vehicles-di"]) },

  // auth: solo aplicación, infraestructura y di (la pantalla de login sigue legada).
  { from: { element: { type: "auth-infrastructure" } }, allow: allowOne("auth-application") },
  { from: { element: { type: "auth-di" } }, allow: allow(["auth-application", "auth-infrastructure"]) },

  // shared: infraestructura compartida solo depende de su propia aplicación;
  // su contenedor de DI es el único que puede alcanzar el de auth.
  {
    from: { element: { type: "shared-infrastructure" } },
    allow: allow(["shared-domain", "shared-application"]),
  },
  { from: { element: { type: "shared-ui" } }, allow: allowOne("shared-domain") },
  {
    from: { element: { type: "shared-di" } },
    allow: allow(["shared-domain", "shared-infrastructure", "auth-di"]),
  },

  // app/: la página compone features a través de su índice público, nunca
  // de sus capas internas. "legacy" sigue permitido mientras VehicleList.tsx
  // y el login no se migran (clase 6 no los toca).
  {
    from: { element: { type: "app" } },
    allow: allow(["rentals-index", "vehicles-index", "shared-domain", "legacy"]),
  },
];

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
  {
    files: ["src/**/*.{ts,tsx}"],
    plugins: { boundaries },
    settings: {
      "boundaries/elements": elements,
    },
    rules: {
      "boundaries/dependencies": ["error", { default: "disallow", policies }],
    },
  },
]);

export default eslintConfig;
