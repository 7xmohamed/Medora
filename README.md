# Medora - Healthcare Booking Platform

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Laravel](https://img.shields.io/badge/Laravel-12.x-red.svg)](https://laravel.com)
[![React](https://img.shields.io/badge/React-19.x-blue.svg)](https://reactjs.org)

Medora is a modern and responsive healthcare platform built using **Laravel (API)** and **React (frontend)**. It enables patients to easily find and book appointments with nearby doctors, offering a smooth and accessible user experience on all devices.

## 📸 Demo

![Medora Demo](/imgs/medora.png "Medora Website Demo")

## ✨ Features

- **User-friendly appointment booking** - Easy to navigate interface for finding and scheduling medical appointments
- **Doctor search and filtering** - Find healthcare professionals by specialty, location, and availability
- **Responsive design** - Seamless experience across desktop, tablet, and mobile devices
- **Secure authentication** - Protected user accounts and medical information
- **Real-time notifications** - Appointment reminders and booking confirmations
- **Admin dashboard** - Comprehensive management system for healthcare providers

## 🔧 Tech Stack

- **Backend:** Laravel 12.x (PHP 8.x)
- **Frontend:** React 19.x with modern JavaScript
- **Database:** MySQL
- **Authentication:** Laravel Sanctum
- **Styling:** Tailwind CSS
- **API:** RESTful API architecture

## 📦 Prerequisites

Before you begin, make sure you have the following installed:

- [Node.js](https://nodejs.org/) (v20 or higher)
- [Composer](https://getcomposer.org/)
- https://git-scm.com/downloads
- [PHP](https://www.php.net/) (v8.0 or higher)
- https://www.mysql.com/ or another database system

## 🚀 Installation

### 1. Clone the repository

```bash
git clone https://github.com/7xmohamed/Medora.git
cd Medora
```

### 2. Backend Setup (Laravel API)

```bash
composer update
```

Set up environment variables:

```bash
cp .env.example .env
```

Generate application key:

```bash
php artisan key:generate
```

Configure your database in the `.env` file:

```
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=medora
DB_USERNAME=root
DB_PASSWORD=your_password
```

Run database migrations and seeders:

```bash
php artisan migrate --seed
```

Start the Laravel development server:

```bash
php artisan serve
```

The API will be available at http://localhost:8000

### 3. Frontend Setup (React)

Navigate to the frontend directory:

```bash
cd /frontend
```

Install Node.js dependencies:

```bash
npm install
```

Set up environment variables:

```bash
cp .env.example .env
```

Configure your API URL in the `.env` file:

```
REACT_APP_API_URL=http://localhost:8000/api
```

Start the React development server:

```bash
npm start
```

The frontend will be available at http://localhost:3000

## 🔍 Project Structure

```
Medora/
├── backend             # Laravel-based backend application
│   ├── app               # Core application logic (controllers, models, etc.)
│   ├── bootstrap           # Bootstrapping scripts (e.g., app.php)
│   ├── config              # Configuration files for services and settings
│   ├── database            # Database-related files (migrations, seeders, factories)
│   ├── public              # Publicly accessible files (e.g., index.php, assets)
│   ├── resources           # Blade views, uncompiled assets (Sass, JS, etc.)
│   ├── routes              # API and web route definitions
│   ├── storage             # Generated files, logs, cached views, session data
│   ├── tests               # Unit and feature tests for backend logic
│   └── vendor              # Composer dependencies (Laravel framework, third-party packages)
│
├── frontend            # React-based (or similar) frontend application
│   ├── public            # Static assets (images, icons, robots.txt, etc.)
│   └── src               # Source code for the frontend
│       ├── components      # Reusable UI components
│       ├── contexts        # React Context API providers for state management
│       ├── data            # Mock data or static JSON/data files
│       ├── layouts         # Layout wrappers (e.g., headers, footers)
│       ├── lib             # Utility functions or libraries
│       ├── pages           # Page-level components (organized by role or section)
│       ├── routes          # Routing configuration for frontend navigation
│       ├── services        # API calls to communicate with the backend
│       ├── styles          # Global CSS/SCSS styling
│       └── utils           # Helper functions and shared tools
│
└── imgs                # Miscellaneous images used for demos, documentation, or references    
```

## 👥 User Types

1. **Patients**
   
   - Browse doctors and specialties
   - Book and manage appointments
   - View medical history
   - Receive notifications

2. **Doctors**
   
   - Manage schedule and availability
   - View upcoming appointments
   - Access patient medical records

3. **Administrators**
   
   - Manage users and permissions
   - View analytics and system usage
   - Configure system settings
   - Oversee all platform activities

## 🔧 Troubleshooting

### Common Issues:

1. **CORS errors**: Ensure your Laravel CORS configuration is set up properly in `config/cors.php`:
   
   ```php
   'paths' => ['api/*'],
   'allowed_origins' => ['http://localhost:3000'],
   ```

2. **Database connection issues**: Verify your database credentials and ensure the database exists.

3. **Node modules issues**: If you encounter errors with Node modules, try:
   
   ```bash
   rm -rf node_modules
   npm cache clean --force
   npm install
   ```

4. **Composer dependency conflicts**: Try:
   
   ```bash
   composer update --ignore-platform-reqs
   ```

## 🔄 API Endpoints

### Authentication

| Method | Endpoint        | Description            |
| ------ | --------------- | ---------------------- |
| POST   | `/api/register` | Register a new user    |
| POST   | `/api/login`    | User login             |
| POST   | `/api/logout`   | User logout            |
| GET    | `/api/user`     | Get authenticated user |

### Admin Endpoints

| Method | Endpoint                           | Description                       |
| ------ | ---------------------------------- | --------------------------------- |
| GET    | `/api/admin/dashboard`             | Get dashboard statistics          |
| GET    | `/api/admin/doctors`               | Get all doctors                   |
| DELETE | `/api/admin/doctors/{id}`          | Delete a doctor                   |
| PATCH  | `/api/admin/doctors/{id}/verify`   | Update doctor verification status |
| GET    | `/api/admin/users`                 | Get all users                     |
| GET    | `/api/admin/users/{id}`            | Get user details                  |
| PUT    | `/api/admin/users/{id}`            | Update user                       |
| DELETE | `/api/admin/users/{id}`            | Delete user                       |
| GET    | `/api/admin/monthly-users`         | Get monthly user statistics       |
| GET    | `/api/admin/reservation-stats`     | Get reservation statistics        |
| GET    | `/api/admin/contact-messages`      | Get contact messages              |
| DELETE | `/api/admin/contact-messages/{id}` | Delete contact message            |
| GET    | `/api/admin/doctor-specialties`    | Get doctor specialties            |

### Doctor Endpoints

| Method | Endpoint                            | Description               |
| ------ | ----------------------------------- | ------------------------- |
| GET    | `/api/doctor/dashboard`             | Doctor dashboard stats    |
| GET    | `/api/doctor/profile`               | Get doctor profile        |
| POST   | `/api/doctor/profile/update`        | Update doctor profile     |
| POST   | `/api/doctor/profile/picture`       | Update profile picture    |
| GET    | `/api/doctor/appointments`          | Get all appointments      |
| GET    | `/api/doctor/availabilities`        | Get doctor availabilities |
| POST   | `/api/doctor/availabilities`        | Create availability slot  |
| DELETE | `/api/doctor/availabilities/{id}`   | Delete availability slot  |
| POST   | `/api/doctor/prescription`          | Upload prescription       |
| DELETE | `/api/doctor/prescription/{id}`     | Delete prescription       |
| POST   | `/api/doctor/doctor-report`         | Upload doctor report      |
| DELETE | `/api/doctor/doctor-report/{id}`    | Delete doctor report      |
| POST   | `/api/doctor/analysis-request`      | Upload analysis request   |
| DELETE | `/api/doctor/analysis-request/{id}` | Delete analysis request   |
| GET    | `/api/doctor/getAppointments/{id}`  | Get specific appointment  |

### Patient Endpoints

| Method | Endpoint                                      | Description                   |
| ------ | --------------------------------------------- | ----------------------------- |
| GET    | `/api/patient/profile`                        | Get patient profile           |
| POST   | `/api/patient/profile/update`                 | Update patient profile        |
| POST   | `/api/patient/profile/picture`                | Update profile picture        |
| GET    | `/api/patient/analytics`                      | Get patient analytics         |
| POST   | `/api/patient/reservations`                   | Create reservation            |
| GET    | `/api/patient/getpatientreservations`         | Get patient reservations      |
| GET    | `/api/patient/reservations/{id}`              | Get reservation by ID         |
| POST   | `/api/patient/cancelReservation/{id}`         | Cancel reservation            |
| GET    | `/api/patient/reservations/booked-slots/{id}` | Get booked slots for a doctor |
| POST   | `/api/patient/upload-lab-result`              | Upload lab result             |
| DELETE | `/api/patient/delete-lab-result/{id}`         | Delete lab result             |
| GET    | `/api/patient/doctorsbyid/{id}`               | Get doctor by ID              |
| GET    | `/api/patient/getAppointments/{id}`           | Get appointment details       |
| GET    | `/api/patient/getDoctorReservations/{id}`     | Get doctor reservations       |

### Public Endpoints

| Method | Endpoint                                 | Description               |
| ------ | ---------------------------------------- | ------------------------- |
| GET    | `/api/doctors/public/{id}`               | Get doctor public profile |
| GET    | `/api/doctors/nearby`                    | Get nearby doctors        |
| GET    | `/api/doctors/location/{country}/{city}` | Get doctors by location   |
| POST   | `/api/contact`                           | Send contact message      |
| GET    | `/api/reservationreports/{id}`           | Get reservation reports   |
| POST   | `/api/list-lab-results`                  | List lab results          |
| GET    | `/api/role`                              | Get user role             |

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit your changes: `git commit -m 'Add some feature'`
4. Push to the branch: `git push origin feature-name`
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👨‍💻 Authors

- **Mohamed** – *Core Development & Project Setup* – [7xmohamed](https://github.com/7xmohamed)  
- **Anass** – *Development Support & Collaboration* – [AnassA7](https://github.com/AnassA7)

## 🙏 Support

For support, email 7xmohamed.salah@medora.com or open an issue on the GitHub repository.