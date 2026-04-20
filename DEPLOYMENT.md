# Deployment Guide

## Architecture

- Frontend: Vite/React static site
- Backend: Spring Boot app
- Database: MySQL
- Upload storage: local disk at `backend/uploads`

## Important production notes

- Frontend API URLs are now controlled by Vite env vars.
- Backend CORS origins are now controlled by `app.cors.allowed-origins`.
- Uploaded images persist across backend restarts on the same server because files are stored on disk.
- If you redeploy to a new server or use ephemeral hosting, move uploads to Cloudinary, S3, or another object store.

## 1. Database deployment

Create a MySQL database named `foodapp`.

Create a user and grant access:

```sql
CREATE DATABASE foodapp;
CREATE USER 'foodapp_user'@'%' IDENTIFIED BY 'change_this_password';
GRANT ALL PRIVILEGES ON foodapp.* TO 'foodapp_user'@'%';
FLUSH PRIVILEGES;
```

## 2. Backend deployment

Set these environment variables on the backend host:

```bash
DB_URL=jdbc:mysql://YOUR_DB_HOST:3306/foodapp
DB_USERNAME=foodapp_user
DB_PASSWORD=change_this_password
APP_CORS_ALLOWED_ORIGINS=https://your-frontend-domain.com
```

Optional:

```bash
SERVER_PORT=8080
```

Build and run:

```bash
mvn clean package
java -jar target/backend-0.0.1-SNAPSHOT.jar
```

The backend serves uploaded files from:

- `/uploads/**`

Keep the `uploads` folder on persistent disk in production.

## 3. Frontend deployment

Create a `.env` file in `Frontend/` based on `.env.example`:

```bash
VITE_API_BASE_URL=https://your-backend-domain.com/api
VITE_SERVER_BASE_URL=https://your-backend-domain.com
```

Build:

```bash
npm install
npm run build
```

Deploy the generated `Frontend/dist` folder to any static host.

## 4. Recommended simple hosting split

- Frontend: Vercel or Netlify
- Backend: Render, Railway, or an Ubuntu VPS
- Database: Railway MySQL, Neon is not MySQL, PlanetScale, Aiven, or a VPS MySQL server

## 5. Example production flow

- Frontend deployed at `https://quickbytes-frontend.vercel.app`
- Backend deployed at `https://quickbytes-api.onrender.com`
- MySQL hosted remotely

Use:

```bash
VITE_API_BASE_URL=https://quickbytes-api.onrender.com/api
VITE_SERVER_BASE_URL=https://quickbytes-api.onrender.com
APP_CORS_ALLOWED_ORIGINS=https://quickbytes-frontend.vercel.app
```

## 6. One caution

If your backend platform wipes local disk on restart/redeploy, uploaded images will be lost even though the database row still exists. In that case, switch image storage to Cloudinary or S3.
