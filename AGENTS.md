# Parisgame - Paris Time Machine

An educational city-building simulation MVP built with React, Three.js (via @react-three/fiber), TypeScript, and Vite.

## Cursor Cloud specific instructions

### Services

| Service | Command | Port | Notes |
|---------|---------|------|-------|
| Vite dev server | `npm run dev` | 5173 | Main (and only) service; use `-- --host 0.0.0.0` for network access |

### Development commands

- **Dev server**: `npm run dev` (Vite with HMR)
- **Type-check**: `npx tsc --noEmit`
- **Build**: `npm run build` (runs `tsc -b && vite build`)
- **Preview prod build**: `npm run preview`

### Key notes

- No dedicated lint script is configured; use `npx tsc --noEmit` for static analysis.
- No test framework is set up; there are no automated tests.
- The project uses `package-lock.json` (npm), not pnpm or yarn.
- Node.js 22+ is required (the environment has it pre-installed via nvm).
- The build produces a single large JS chunk (~1.2 MB) due to Three.js; this is expected for development.
- The app renders a 3D isometric grid using `@react-three/fiber` and `@react-three/drei`; state is managed with Zustand.
