# 🎯 **COMPLETE API ENDPOINTS LIST - SCHEDULA BACKEND**

## 🌐 **Base URL**
```
https://schedula-db-varun-patil.onrender.com
```

## 📋 **ALL AVAILABLE ENDPOINTS**

### **1. HEALTH & STATUS**
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `GET` | `/api/v1/auth/health` | Health check & server status | ❌ |

### **2. AUTHENTICATION ENDPOINTS**
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `POST` | `/api/v1/auth/signup` | User registration (email/mobile) | ❌ |
| `POST` | `/api/v1/auth/signin` | User login with JWT token | ❌ |
| `POST` | `/api/v1/auth/signout` | Secure logout with token invalidation | ✅ |
| `PUT` | `/api/v1/auth/role` | Update user role (Patient/Doctor) | ✅ |
| `GET` | `/api/v1/auth/role` | Get current user's role | ✅ |

### **3. GOOGLE OAUTH ENDPOINTS**
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `GET` | `/api/v1/auth/google` | Initiate Google OAuth (default Patient) | ❌ |
| `GET` | `/api/v1/auth/google/patient` | Google OAuth with Patient role | ❌ |
| `GET` | `/api/v1/auth/google/doctor` | Google OAuth with Doctor role | ❌ |
| `GET` | `/api/v1/auth/google/callback` | OAuth callback handler | ❌ |

### **4. DOCTOR ENDPOINTS**
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `POST` | `/api/v1/doctors/profile` | Create/update doctor profile | ✅ |
| `GET` | `/api/v1/doctors/profile` | Get doctor profile with availability | ✅ |
| `POST` | `/api/v1/doctors/generate-otp` | Generate 6-digit verification OTP | ✅ |
| `POST` | `/api/v1/doctors/verify-otp` | Verify doctor using OTP | ✅ |
| `POST` | `/api/v1/doctors/availability` | Set consultation hours & availability | ✅ |
| `GET` | `/api/v1/doctors/availability` | Get all availability slots | ✅ |

### **5. PATIENT ENDPOINTS**
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `POST` | `/api/v1/patients/profile` | Create/update patient profile | ✅ |
| `GET` | `/api/v1/patients/profile` | Get patient profile | ✅ |

### **6. SUPPORT ENDPOINTS**
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `POST` | `/api/v1/support/tickets` | Create support ticket | ✅ |
| `GET` | `/api/v1/support/tickets` | Get user's support tickets | ✅ |
| `GET` | `/api/v1/support/tickets/:id` | Get specific ticket details | ✅ |

---

## 🧪 **COMPLETE TESTING SCRIPT**

### **1. Health Check**
```bash
curl https://schedula-db-varun-patil.onrender.com/api/v1/auth/health
```

### **2. Authentication Flow**
```bash
# User Registration
curl -X POST https://schedula-db-varun-patil.onrender.com/api/v1/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test.user@email.com",
    "mobile_number": "1234567890",
    "password": "password123",
    "role": "patient"
  }'

# User Login
curl -X POST https://schedula-db-varun-patil.onrender.com/api/v1/auth/signin \
  -H "Content-Type: application/json" \
  -d '{
    "mobile_number": "1234567890",
    "password": "password123"
  }'
```

### **3. Doctor Onboarding Flow**
```bash
# Create Doctor Profile
curl -X POST https://schedula-db-varun-patil.onrender.com/api/v1/doctors/profile \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "specialization": "Cardiology",
    "qualification": "MBBS, MD",
    "experience": 5,
    "clinic_address": "123 Medical Center",
    "bio": "Experienced cardiologist",
    "consultation_fee": 500
  }'

# Generate OTP
curl -X POST https://schedula-db-varun-patil.onrender.com/api/v1/doctors/generate-otp \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"

# Verify OTP (use OTP from previous response)
curl -X POST https://schedula-db-varun-patil.onrender.com/api/v1/doctors/verify-otp \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"otp": "123456"}'

# Set Availability
curl -X POST https://schedula-db-varun-patil.onrender.com/api/v1/doctors/availability \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "day": "Monday",
    "start_time": "09:00",
    "end_time": "17:00",
    "max_patients": 15
  }'

# Get Doctor Profile
curl -X GET https://schedula-db-varun-patil.onrender.com/api/v1/doctors/profile \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### **4. Patient Flow**
```bash
# Create Patient Profile
curl -X POST https://schedula-db-varun-patil.onrender.com/api/v1/patients/profile \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "John",
    "lastName": "Patient",
    "dateOfBirth": "1990-01-01",
    "gender": "MALE",
    "address": "123 Patient Street"
  }'

# Get Patient Profile
curl -X GET https://schedula-db-varun-patil.onrender.com/api/v1/patients/profile \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### **5. Support System**
```bash
# Create Support Ticket
curl -X POST https://schedula-db-varun-patil.onrender.com/api/v1/support/tickets \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "subject": "Login Issue",
    "description": "Unable to login to my account",
    "priority": "MEDIUM"
  }'

# Get Support Tickets
curl -X GET https://schedula-db-varun-patil.onrender.com/api/v1/support/tickets \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### **6. Role Management**
```bash
# Get User Role
curl -X GET https://schedula-db-varun-patil.onrender.com/api/v1/auth/role \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"

# Update User Role
curl -X PUT https://schedula-db-varun-patil.onrender.com/api/v1/auth/role \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"role": "doctor"}'
```

---

## 🎯 **TESTING CHECKLIST**

### **✅ AUTHENTICATION & USERS**
- [ ] User registration (email/mobile)
- [ ] User login with JWT
- [ ] Secure logout
- [ ] Role management
- [ ] Google OAuth flow

### **✅ DOCTOR FEATURES**
- [ ] Doctor profile creation
- [ ] OTP generation
- [ ] Doctor verification
- [ ] Availability management
- [ ] Profile retrieval

### **✅ PATIENT FEATURES**
- [ ] Patient profile creation
- [ ] Profile retrieval
- [ ] Support ticket system

### **✅ SYSTEM HEALTH**
- [ ] Database connections
- [ ] JWT token validation
- [ ] Error handling
- [ ] CORS configuration

---

## 📊 **EXPECTED RESPONSES**

### **Successful Registration:**
```json
{
  "message": "User registered successfully",
  "user": {
    "user_id": 1,
    "name": "Test User",
    "email": "test@email.com",
    "role": "patient"
  }
}
```

### **Successful Login:**
```json
{
  "access_token": "eyJhbGci...",
  "user": {
    "user_id": 1,
    "name": "Test User",
    "role": "patient"
  }
}
```

### **Doctor Profile:**
```json
{
  "doctor_id": 1,
  "specialization": "Cardiology",
  "experience": 5,
  "is_verified": true,
  "user": {
    "user_id": 1,
    "name": "Dr. Test User"
  }
}
```

---

## 🚀 **READY FOR COMPREHENSIVE TESTING!**

**All 18+ endpoints are now documented and ready for testing on your live deployment!** 

You can systematically test each endpoint category and verify the complete Schedula backend functionality. 🎉

**Base URL:** `https://schedula-db-varun-patil.onrender.com`

Let me know when you want to start the comprehensive testing! 🧪
