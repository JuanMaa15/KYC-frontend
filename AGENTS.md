# KYC — Frontend
Interfaz web del proyecto de validación de identidad (KYC)

## Stack
- Lenguaje: TypeScript estricto
- Framework: React 19 + Vite
- Estilos: TailwindCSS (dark mode con estrategia `class`)
- Tests: Vitest + React Testing Library
- Deploy: Cloudflare Pages
- Validaciones: zod (mismas reglas de campos que el backend)
- Linter: eslint

## Comandos
- `npm run dev` — arranca el servidor de desarrollo (Vite)
- `npm run build` — build de producción (tsc + vite build)
- `npm run preview` — sirve el build localmente para verificarlo
- `npm run test` — ejecuta los tests (deben pasar antes de cada commit)
- `npm run lint` — revisa el código con eslint

## Estructura del proyecto
- `src/components/` — Componentes de UI genéricos y reutilizables (Button,
  Input, FileUpload, Spinner, StatusBadge). Sin lógica de negocio: reciben
  props y renderizan.
- `src/pages/` — Una carpeta por pantalla. Cada página agrupa su componente
  principal, sus sub-componentes propios y su hook de lógica:
  - `kyc-wizard/` — wizard de 4 pasos + useKycWizard (estado del flujo)
  - `status/` — pantalla de estado + usePolling
- `src/hooks/` — Solo hooks compartidos entre varias páginas
- `src/services/` — Cliente API centralizado (api.ts): ÚNICO lugar que hace
  fetch; conoce la base URL, el envelope de respuesta y los errores
- `src/types/` — Tipos compartidos (Verification, ApiResponse)
- `src/config/` — Constantes y variables de entorno (VITE_API_URL)
- `test/` — Pruebas unitarias y de componentes
- `husky/` — Validar commit antes de subir: tests en verde y mensaje con
  estructura type(category): mensaje
- `github/` — Workflows CI: lint, typecheck, tests y build
- `docs/` — Documentación y evidencias del proyecto

## Convenciones
- Variables, funciones y hooks con camelCase (nombreVariable, useNombreHook)
- Componentes y tipos con PascalCase (MiComponente, Verification)
- Flujo de dependencias: componente -> hook -> services/api. Los componentes
  NO hacen fetch directo; la lógica vive en hooks; api.ts habla con el backend
- Entradas del usuario se validan con zod ANTES de enviar al backend
- El cliente API tipa las respuestas con el envelope del backend:
  { status: 'success' | 'error', message: string, data?: T, code: number }
- Variables de entorno solo vía `import.meta.env.VITE_*` (nunca process.env)
- Ramas git: main (producción), develop (desarrollo), feature/ (nuevas
  funcionalidades), fix/ (corrección de bugs)
- Estructura commits: type(category): mensaje — "type": chore (configuración),
  feat (nuevo), refactor (refactorización), fix (arreglo bug)

## No hagas
- No instalar dependencias sin avisar
- No descargar dependencias deprecadas
- No usar `any` en TypeScript sin justificarlo
- No hagas los commits sin yo antes confirmar qué mensaje contienen
- No hardcodear la URL del backend: siempre VITE_API_URL
- No crear carpetas vacías ni agregar store/context/router sin necesidad
  justificada: el estado del flujo vive en el hook de su página
- No guardar datos personales (nombre, email, documento) en
  localStorage/sessionStorage — el estado del wizard vive en memoria (React)

## Flujo de trabajo
- Antes de una tarea no trivial, propón un plan y espera mi OK
- Una tarea a la vez; al terminar, dime qué cambiaste para que lo revise
- Si no estás seguro al 80%, pregunta. No inventes

## Documentación
Arquitectura estándar React por tipo (components/pages/hooks/services),
con separación estricta: presentación (componentes) / lógica (hooks) /
datos (services). Código limpio: SOLID, DRY, YAGNI, KISS.

API que se consume (backend Hono en Cloudflare Workers):
- POST /api/v1/verifications — multipart/form-data con: name, email,
  documentNumber, documentImage (File), selfieImage (File)
- GET /api/v1/verifications/:id — devuelve la verificación con su estado
  (el backend resuelve solo el veredicto ~10s después de creada)

Flujo del cliente (wizard, página kyc-wizard):
1. Datos (nombre, email, número de documento — validados con zod)
2. Foto documento (upload con preview; JPEG/PNG, máx 10 MB)
3. Selfie (upload con preview; mismas restricciones)
4. Enviar y revisar → pasa a la pantalla de estado

Pantalla de estado (página status):
- Tras el POST exitoso, polling de GET /verifications/:id cada 3s
- Mientras status === "pending": spinner "Verificando tu identidad..."
- Cuando cambie: mostrar Aprobado ✅ o Rechazado ❌ y detener el polling
- Límite de intentos (~15): si se supera, mostrar mensaje de demora
- El polling SIEMPRE se limpia al desmontar el componente (cleanup)

UX/UI:
- Estados de carga y error visibles en cada paso
- El wizard no permite avanzar con el paso actual inválido
- Responsive (mobile first) y dark mode (bonus)
- Drag & drop en los uploads (bonus)


Notas sobre las adaptaciones que hice (los puntos donde el front difiere del back y conviene tenerlos claros):

1. **`createdAt`/`updatedAt` son `string`, no `Date`** — en JSON las fechas viajan como strings ISO; tiparlas como `Date` en el front es un error clásico.
2. **`urlDocumentImage` como `string | null`** y con la aclaración de que es una *key* de R2, no una URL renderizable — para que nadie intente hacer `<img src={...}>` con eso.
3. **Regla de no guardar PII en localStorage** — es el equivalente frontend de tu regla de logs sin PII en el back; mismo criterio de "seguridad básica" y queda muy bien ante el evaluador.
4. **Prohibido hardcodear la URL del API** — todo por `VITE_API_URL`, que además vas a necesitar distinta en local (`http://localhost:8787`) y producción (tu URL de workers.dev).
5. El **flujo de polling completo** quedó especificado en la sección de documentación, con las tres reglas que suman puntos: cleanup, límite de intentos y estados visibles.