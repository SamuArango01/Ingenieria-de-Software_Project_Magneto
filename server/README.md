# server

## Configuración del Entorno de Desarrollo

Este proyecto requiere una base de datos PostgreSQL para funcionar. Se proporciona una configuración de Docker Compose para facilitar el proceso.

### 1. Iniciar la Base de Datos

Asegúrate de tener Docker instalado y en ejecución, luego ejecuta el siguiente comando:

```bash
docker compose up
```

Esto iniciará un contenedor de PostgreSQL con la configuración necesaria. Los detalles de conexión se pueden encontrar en los archivos `docker-compose.yml` y `.env.example`.

### 2. Insertar el Usuario Simulado (Mock)

Actualmente, la aplicación está configurada con un usuario simulado para fines de desarrollo. Para que la aplicación funcione correctamente, este usuario debe existir en la base de datos.

Conéctate a la base de datos usando tu cliente preferido (e.g., DBeaver, pgAdmin) y ejecuta el siguiente comando SQL:

```sql
INSERT INTO "users" ("id", "email", "name")
VALUES ('user_mock_clerk_12345', 'mock.user@example.com', 'Mock User')
ON CONFLICT ("id") DO NOTHING;
```

Después de completar estos pasos, puedes proceder con la instalación de dependencias y la ejecución del servidor.

---

To install dependencies:

```bash
bun install
```

To run:

```bash
bun run index.ts
```

Environment Variables:

```bash
EMAIL_USER=tuemail@gmail.com
EMAIL_PASSWORD=tu_app_password_gmail

# Optional
EMAIL_FROM="Sistema de Entrevistas <tuemail@gmail.com>"
```

Gmail Setup:

Enable 2-Step Verification

Generate an App Password

Use the generated password in EMAIL_PASSWORD

This project was created using `bun init` in bun v1.2.0. [Bun](https://bun.sh) is a fast all-in-one JavaScript runtime.
