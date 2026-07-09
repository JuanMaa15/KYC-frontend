# Dependencias del proyecto

## Comandos de instalación

```bash
# Fase 1 - Scaffold base
npm create vite@latest . -- --template react-ts
npm install

# TailwindCSS v4 + Zod
npm install tailwindcss@latest @tailwindcss/vite@latest zod

# Testing
npm install -D vitest jsdom @testing-library/react @testing-library/jest-dom @testing-library/user-event

# ESLint (reemplaza oxlint que viene por defecto)
npm uninstall oxlint
npm install -D eslint @eslint/js typescript-eslint eslint-plugin-react-hooks eslint-plugin-react-refresh

# Husky + lint-staged + commitlint
npm install -D husky lint-staged @commitlint/cli @commitlint/config-conventional
npx husky init
```

## Dependencias de producción

| Dependencia | Versión | Propósito |
|---|---|---|
| `react` | ^19.2.7 | Librería UI |
| `react-dom` | ^19.2.7 | Renderizado DOM |
| `tailwindcss` | ^4.3.2 | Framework CSS utility-first (v4) |
| `@tailwindcss/vite` | ^4.3.2 | Plugin de TailwindCSS v4 para Vite |
| `zod` | ^4.4.3 | Validación de esquemas client-side |

## Dependencias de desarrollo

| Dependencia | Versión | Propósito |
|---|---|---|
| `typescript` | ~6.0.2 | Lenguaje y compilador TS |
| `vite` | ^8.1.1 | Bundler y dev server |
| `@vitejs/plugin-react` | ^6.0.3 | Plugin de React para Vite |
| `vitest` | ^4.1.10 | Test runner nativo de Vite |
| `jsdom` | ^29.1.1 | Entorno DOM simulado para tests |
| `@testing-library/react` | ^16.3.2 | Testing Library para React |
| `@testing-library/jest-dom` | ^6.9.1 | Matchers DOM para Jest/Vitest |
| `@testing-library/user-event` | ^14.6.1 | Simulación de eventos de usuario |
| `eslint` | ^10.6.0 | Linter |
| `@eslint/js` | ^10.0.1 | Config base de ESLint |
| `typescript-eslint` | ^8.63.0 | Parser y plugin de TS para ESLint |
| `eslint-plugin-react-hooks` | ^7.1.1 | Reglas de React Hooks |
| `eslint-plugin-react-refresh` | ^0.5.3 | Reglas de React Refresh |
| `husky` | ^9.1.7 | Hooks de git |
| `lint-staged` | ^17.0.8 | Ejecutar linters solo en staged |
| `@commitlint/cli` | ^21.2.1 | Validación de mensajes de commit |
| `@commitlint/config-conventional` | ^21.2.0 | Config convencional para commitlint |
| `@types/react` | ^19.2.17 | Tipos de React |
| `@types/react-dom` | ^19.2.3 | Tipos de ReactDOM |
| `@types/node` | ^24.13.2 | Tipos de Node.js |
