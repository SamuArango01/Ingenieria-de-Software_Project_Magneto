# Star Training Client 🌟

Cliente web para el proyecto Star Training - Una plataforma moderna de entrenamiento y gestión de usuarios.

## 🚀 Tecnologías

- **Next.js** - Framework de React para producción
- **Tailwind CSS** - Framework de CSS utilitario
- **shadcn/ui** - Componentes de UI reutilizables
- **Clerk** - Autenticación y gestión de usuarios
- **TypeScript** - Tipado estático para JavaScript

## 📋 Requisitos Previos

- Node.js 18+ 
- npm, pnpm o bun

## ⚙️ Configuración

### 1. Variables de Entorno

Crea un archivo `.env` en la raíz del proyecto con las siguientes variables:

```env
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=tu_publishable_key_aqui
CLERK_SECRET_KEY=tu_secret_key_aqui

# Clerk URLs
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/auth
NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL=/dashboard
NEXT_PUBLIC_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL=/setup-role
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/setup-role
NEXT_PUBLIC_CLERK_AFTER_SIGN_OUT_URL=/
```

> **Nota**: Reemplaza `tu_publishable_key_aqui` y `tu_secret_key_aqui` con tus credenciales reales de Clerk.

### 2. Instalación

Navega a la carpeta del cliente e instala las dependencias:

```bash
cd client
```

Usando npm:
```bash
npm install
```

Usando pnpm:
```bash
pnpm install
```

Usando bun:
```bash
bun install
```

### 3. Ejecutar en Desarrollo

Inicia el servidor de desarrollo:

```bash
npm run dev
```

o

```bash
pnpm dev
```

o

```bash
bun dev
```

El proyecto estará disponible en [http://localhost:3000](http://localhost:3000)

## 📁 Estructura del Proyecto

```
client/
├── src
│   ├── app
│   │   ├── (Dashboard)
│   │   ├── auth
│   │   ├── favicon.ico
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   └── setup-role
│   ├── components
│   │   └── ui
│   ├── features
│   │   ├── auth
│   │   └── landing
│   ├── lib
│   │   └── utils.ts
│   └── middleware.ts
├── tailwind.config.ts
└── tsconfig.json
```

## 🔐 Autenticación

El proyecto utiliza **Clerk** para la autenticación. Las rutas principales son:

- `/auth` - Página de inicio de sesión
- `/dashboard` - Panel principal (requiere autenticación)
- `/setup-role` - Configuración de rol de usuario

## 🎨 Componentes UI

Utiliza **shadcn/ui** para componentes consistentes y accesibles. Los componentes se encuentran en `src/components/ui/`.

## 📱 Responsive Design

El diseño está optimizado para todos los dispositivos usando **Tailwind CSS** con un enfoque mobile-first.

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/nueva-funcionalidad`)
3. Commit tus cambios (`git commit -m 'Agrega nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Abre un Pull Request a develop
