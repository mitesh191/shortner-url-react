# 🚀 Project Setup & Installation Guide

This document explains how to set up and run the Laravel (Backend) and
React (Frontend) applications locally.

------------------------------------------------------------------------

# 📋 Prerequisites

## Backend

-   PHP \>= 8.2
-   Composer (latest)
-   MySQL / MariaDB

## Frontend

-   Node.js \>= 22 (Example used: 22.22.0)
-   npm (comes with Node)

------------------------------------------------------------------------

# 🧩 Backend Setup (Laravel 12)

## 1️⃣ Clone Repository

``` bash
git clone <repository-url>
cd <project-folder>
```

## 2️⃣ Install PHP Dependencies

``` bash
composer install
```

## 3️⃣ Environment Configuration

``` bash
cp .env.example .env
```

Update database settings in `.env`:

DB_DATABASE=url_shortener\
DB_USERNAME=your_username\
DB_PASSWORD=your_password

## 4️⃣ Create Database

Create a database named:

url_shortener

## 5️⃣ Run Database Migrations

``` bash
php artisan migrate
```

## 6️⃣ Seed Super Admin

``` bash
php artisan db:seed --class=SuperAdminSeeder
```

## 🔐 Default Credentials

Super Admin\
Email: superadmin@example.com\
Password: Developer@123

Client Admin Password: Admin@123\
Client Member Password: Member@123

## ▶️ Run Laravel Server

``` bash
php artisan serve --port=8081
```

Backend URL: http://localhost:8081

------------------------------------------------------------------------

# ⚛️ Frontend Setup (React)

## 1️⃣ Go to React Folder

``` bash
cd <react-folder-name>
```

## 2️⃣ Install Dependencies

``` bash
npm install
```

## 3️⃣ Configure Environment

VITE_API_URL=http://localhost:8081

## 4️⃣ Run React App

``` bash
npm run dev
```

Frontend URL: http://localhost:5173/

------------------------------------------------------------------------

# 🔄 Application Startup Flow

1.  Start Laravel backend\
2.  Start React frontend\
3.  Open browser → http://localhost:5173\
4.  Login with Super Admin credentials

------------------------------------------------------------------------

# 🛠 Troubleshooting

## Composer Issues

``` bash
composer clear-cache
composer install
```

## Migration Issues

``` bash
php artisan config:clear
php artisan migrate:fresh
```

## Port Already in Use

``` bash
php artisan serve --port=NEW_PORT
npm run dev -- --port NEW_PORT
```

------------------------------------------------------------------------

# ✅ Setup Complete

You have successfully installed dependencies, configured environment,
created database, ran migrations, seeded admin, and started backend &
frontend.
