# KYC — Identity Verification Platform

Plataforma de verificación de identidad (KYC) con wizard de 4 pasos y polling de resultados.

## Stack

| Tecnología | Versión |
|---|---|
| TypeScript | 5.7+ (strict) |
| React | 19 |
| Vite | 8 |
| TailwindCSS | 4 (dark mode con estrategia `class`) |
| Vitest | 4 + React Testing Library |
| Zod | validaciones compartidas |
| ESLint | con oxlint |
| Husky | pre-commit hooks |
| Commitlint | conventional commits |
| Cloudflare Pages | deploy |

## Requisitos

- Node.js >= 20
- npm >= 10

## Instalación

```bash
npm install
```

## Desarrollo

```bash
npm run dev
```

Servidor de desarrollo en `http://localhost:5173`.

## Comandos

| Comando | Descripción |
|---|---|
| `npm run dev` | Servidor de desarrollo (Vite) |
| `npm run build` | Build de producción (`tsc -b && vite build`) |
| `npm run preview` | Sirve el build localmente |
| `npm test` | Ejecuta tests con Vitest |
| `npm run lint` | ESLint |

## Variables de entorno

```env
VITE_API_URL=http://localhost:8787
```

Solo `VITE_*` vía `import.meta.env`. Nunca `process.env`.

## Arquitectura

Separación estricta en tres capas:

```
Componente (presentación) → Hook (lógica) → API (datos)
```

- **Componentes** en `src/components/` reciben props y renderizan. Sin lógica de negocio.
- **Hooks** en `src/hooks/` y dentro de cada página encapsulan estado y efectos.
- **API** en `src/services/api.ts` es el único lugar que hace fetch. Conoce la URL base, el envelope de respuesta y los errores.

### Flujo

1. El wizard de 4 pasos recolecta datos personales + fotos (documento y selfie).
2. Al enviar, `api.createVerification()` hace un POST multipart.
3. Se redirige a la pantalla de estado, que hace polling GET cada 3s hasta que el status cambia de `pending`.
4. Límite de ~15 intentos (~45s). Si se supera, muestra mensaje de demora.

## Estructura del proyecto

```
src/
├── components/       # UI genéricos (Button, Input, FileUpload, Spinner, StatusBadge)
├── pages/
│   ├── kyc-wizard/   # Wizard de 4 pasos + hook useKycWizard
│   │   ├── KycWizardPage.tsx
│   │   ├── WizardProgress.tsx
│   │   ├── StepPersonalData.tsx
│   │   ├── StepDocumentPhoto.tsx
│   │   ├── StepSelfie.tsx
│   │   ├── StepReview.tsx
│   │   └── useKycWizard.ts
│   └── status/       # Pantalla de estado + hook usePolling
│       └── StatusPage.tsx
├── hooks/            # Hooks compartidos
│   └── usePolling.ts
├── services/         # Cliente API
│   └── api.ts
├── types/            # Tipos compartidos
│   └── index.ts
├── config/           # Constantes y entorno
│   └── index.ts
├── App.tsx
├── main.tsx
└── index.css

test/                 # Tests unitarios (Vitest)
├── components/
├── pages/
│   ├── kyc-wizard/
│   └── status/
├── services/
└── hooks/
```

## Ejecución con Docker (opcional)

```bash
# Construir la imagen
docker build -t kyc-frontend .

# Iniciar el contenedor
docker run --name kyc-interfaz -p 80:80 kyc-frontend
```
Levanta el frontend en `http://localhost:80`

Detener y limpiar:

```bash
docker stop kyc-interfaz && docker rm kyc-interfaz
```

## API (backend)

| Método | Ruta | Descripción |
|---|---|---|
| POST | `/api/v1/verifications` | Crea verificación (multipart: name, email, documentNumber, documentImage, selfieImage) |
| GET | `/api/v1/verifications/:id` | Obtiene estado de la verificación |

Respuesta envelope:

```json
{
  "status": "success" | "error",
  "message": "...",
  "data": { ... },
  "code": 200
}
```

## Convenciones

- **Commits**: `type(category): mensaje` — `feat`, `fix`, `refactor`, `chore`
- **Nombres**: camelCase (variables/hooks), PascalCase (componentes/tipos)
- **Ramas**: `main`, `develop`, `feature/*`, `fix/*`
- **No guardar PII** en localStorage/sessionStorage (estado en memoria React)
- **No hardcodear URL del API** — siempre `VITE_API_URL`
- **Validaciones** con zod antes de enviar al backend
