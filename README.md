Here’s a **ready-to-paste `README.md`** file for your GitHub repository — complete, professional, and optimized for recruiters, developers, and your Loom walkthrough video.
It explains your **Schedula Backend**, all **deployed Render API endpoints**, and includes a section for your **Loom demo** link.

---

```markdown
# 🩺 Schedula — Smart Appointment & Healthcare Backend API

A fully deployed RESTful backend built for **Schedula**, a healthcare scheduling platform connecting **patients** and **doctors** through secure authentication, real-time OTP verification, and support ticket management.  
This backend is deployed on **Render** with **PostgreSQL**, **JWT Authentication**, and **Google OAuth** integration.

---

## 🌐 Base URL
```

[https://schedula-db-varun-patil.onrender.com](https://schedula-db-varun-patil.onrender.com)

````

All endpoints are live and ready for testing via **cURL**, **Postman**, or **frontend integration**.

---

## 🚀 Features
- ✅ JWT Authentication & Role Management (Doctor/Patient)
- 🌍 Google OAuth 2.0 Integration
- 🧑‍⚕️ Doctor Verification with OTP & Availability Scheduling
- 🧍‍♂️ Patient Profile Management
- 🧾 Support Ticket System
- 🧪 Public Render Deployment for Live Testing

---

## 📘 API ENDPOINTS OVERVIEW

### 1️⃣ Health & Status
| Method | Endpoint | Description | Auth |
|--------|-----------|-------------|------|
| GET | `/api/v1/auth/health` | Server uptime and DB status | ❌ |

---

### 2️⃣ Authentication
| Method | Endpoint | Description | Auth |
|--------|-----------|-------------|------|
| POST | `/api/v1/auth/signup` | Register with email or mobile | ❌ |
| POST | `/api/v1/auth/signin` | Login with JWT token | ❌ |
| POST | `/api/v1/auth/signout` | Logout and invalidate token | ✅ |
| PUT | `/api/v1/auth/role` | Update user role (doctor/patient) | ✅ |
| GET | `/api/v1/auth/role` | Get user role | ✅ |

---

### 3️⃣ Google OAuth
| Method | Endpoint | Description | Auth |
|--------|-----------|-------------|------|
| GET | `/api/v1/auth/google` | Google OAuth (default patient) | ❌ |
| GET | `/api/v1/auth/google/patient` | Google OAuth (patient role) | ❌ |
| GET | `/api/v1/auth/google/doctor` | Google OAuth (doctor role) | ❌ |
| GET | `/api/v1/auth/google/callback` | OAuth callback | ❌ |

---

### 4️⃣ Doctor Endpoints
| Method | Endpoint | Description | Auth |
|--------|-----------|-------------|------|
| POST | `/api/v1/doctors/profile` | Create/update doctor profile | ✅ |
| GET | `/api/v1/doctors/profile` | Get doctor profile | ✅ |
| POST | `/api/v1/doctors/generate-otp` | Generate verification OTP | ✅ |
| POST | `/api/v1/doctors/verify-otp` | Verify OTP | ✅ |
| POST | `/api/v1/doctors/availability` | Set consultation schedule | ✅ |
| GET | `/api/v1/doctors/availability` | Get availability slots | ✅ |

---

### 5️⃣ Patient Endpoints
| Method | Endpoint | Description | Auth |
|--------|-----------|-------------|------|
| POST | `/api/v1/patients/profile` | Create/update patient profile | ✅ |
| GET | `/api/v1/patients/profile` | Get patient profile | ✅ |

---

### 6️⃣ Support Endpoints
| Method | Endpoint | Description | Auth |
|--------|-----------|-------------|------|
| POST | `/api/v1/support/tickets` | Create support ticket | ✅ |
| GET | `/api/v1/support/tickets` | Get all support tickets | ✅ |
| GET | `/api/v1/support/tickets/:id` | Get specific ticket | ✅ |

---

## 🧪 Example API Calls (Try Directly)

### Health Check
```bash
curl https://schedula-db-varun-patil.onrender.com/api/v1/auth/health
````

### Signup

```bash
curl -X POST https://schedula-db-varun-patil.onrender.com/api/v1/auth/signup \
-H "Content-Type: application/json" \
-d '{
  "name": "Dr. John Smith",
  "mobile_number": "1234567890",
  "password": "password123",
  "email": "doctor@test.com",
  "role": "doctor"
}'
```

### Signin

```bash
curl -X POST https://schedula-db-varun-patil.onrender.com/api/v1/auth/signin \
-H "Content-Type: application/json" \
-d '{
  "mobile_number": "1234567890",
  "password": "password123"
}'
```

### Create Doctor Profile

```bash
curl -X POST https://schedula-db-varun-patil.onrender.com/api/v1/doctors/profile \
-H "Authorization: Bearer YOUR_JWT_TOKEN" \
-H "Content-Type: application/json" \
-d '{
  "specialization": "Neurology",
  "qualification": "MBBS, MD",
  "experience": 5,
  "clinic_address": "456 Brain Center",
  "bio": "Experienced neurologist",
  "consultation_fee": 600
}'
```

### Generate OTP

```bash
curl -X POST https://schedula-db-varun-patil.onrender.com/api/v1/doctors/generate-otp \
-H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Verify OTP

```bash
curl -X POST https://schedula-db-varun-patil.onrender.com/api/v1/doctors/verify-otp \
-H "Authorization: Bearer YOUR_JWT_TOKEN" \
-H "Content-Type: application/json" \
-d '{"otp": "123456"}'
```

### Set Availability

```bash
curl -X POST https://schedula-db-varun-patil.onrender.com/api/v1/doctors/availability \
-H "Authorization: Bearer YOUR_JWT_TOKEN" \
-H "Content-Type: application/json" \
-d '{
  "day": "Monday",
  "start_time": "09:00",
  "end_time": "17:00",
  "max_patients": 15
}'
```

### Create Patient Profile

```bash
curl -X POST https://schedula-db-varun-patil.onrender.com/api/v1/patients/profile \
-H "Authorization: Bearer YOUR_JWT_TOKEN" \
-H "Content-Type: application/json" \
-d '{
  "name": "Varun Patil",
  "age": 21,
  "sex": "male",
  "weight": 72
}'
```

### Create Support Ticket

```bash
curl -X POST https://schedula-db-varun-patil.onrender.com/api/v1/support/tickets \
-H "Authorization: Bearer YOUR_JWT_TOKEN" \
-H "Content-Type: application/json" \
-d '{
  "subject": "Login Issue",
  "description": "Unable to login to my account"
}'
```

---

## 🧾 Expected Responses

**Registration**

```json
{
  "message": "User registered successfully",
  "user": {
    "user_id": 1,
    "name": "Test User",
    "role": "patient"
  }
}
```

**Login**

```json
{
  "access_token": "eyJhbGci...",
  "user": {
    "user_id": 1,
    "name": "Test User",
    "role": "doctor"
  }
}
```

**Doctor Profile**

```json
{
  "doctor_id": 1,
  "specialization": "Cardiology",
  "experience": 5,
  "is_verified": true
}
```

---

## 🧩 Tech Stack

| Layer      | Tech               |
| ---------- | ------------------ |
| Backend    | Node.js + Express  |
| Database   | PostgreSQL         |
| Auth       | JWT + Google OAuth |
| Deployment | Render             |
| Testing    | Postman / cURL     |
| Language   | JavaScript (ES6)   |

---

## 🧠 Project Structure

```
Schedula-Backend/
├── src/
│   ├── auth/
│   ├── doctors/
│   ├── patients/
│   ├── support/
│   ├── config/
│   ├── utils/
│   └── server.js
├── package.json
├── README.md
└── .env (for Render)
```

---

## 🎥 Loom Video Demonstration

📹 **Watch Full API Demo** — Signup, Login, Doctor Verification, and Support Flow:
👉 [https://www.loom.com/share/YOUR-LOOM-VIDEO-LINK](https://www.loom.com/share/YOUR-LOOM-VIDEO-LINK)

---

## 🧭 How to Test

1. Open **Postman** or use **curl** commands above.
2. Run `/health` to check server live status.
3. Test `/signup` → `/signin` → `/doctors/profile` → `/support/tickets`.
4. Verify token-based auth works for all secured routes.
5. Record your tests using Loom and share your link in README.

---

## 🪪 Author

**Varun Patil**
📧 [varunpatil.dev@example.com](mailto:varunpatil.dev@example.com)
🚀 Backend Developer | Java + Node.js | AI & Scalable Systems

---

### 📜 License

MIT © 2025 Varun Patil

```

---

✅ **Next steps for you:**
1. Replace `YOUR_JWT_TOKEN` with a real token from `/signin`.  
2. Replace the placeholder Loom URL with your actual video link after recording the live Render test.  
3. Commit this file as `README.md` in your GitHub root — it’s ready for public showcase and portfolio use.  

Would you like me to generate a **Postman Collection JSON file** (`Schedula Render.postman_collection.json`) that includes all these endpoints preconfigured for import?
```
