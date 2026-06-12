# UML Diagrams — Virtual Campus

---

## 1. Use Case Diagram

```mermaid
graph TB
    subgraph "Virtual Campus System"
        UC1[Register Account]
        UC2[Login]
        UC3[Forgot/Reset Password]
        UC4[View Dashboard]
        UC5[Search & Filter Courses]
        UC6[View Course Details]
        UC7[Enroll in Course]
        UC8[Unenroll from Course]
        UC9[Create Meeting]
        UC10[Join Meeting via Code]
        UC11[View Active Meetings]
        UC12[Manage Mic/Cam in Meeting]
        UC13[View Schedule]
        UC14[View Grades & Transcript]
        UC15[Check-in Attendance]
        UC16[Check-out Attendance]
        UC17[Export Attendance Report]
        UC18[View Notifications]
        UC19[Manage Profile]
        UC20[Change Language]
        UC21[Toggle Dark Mode]
    end

    User((User / Mahasiswa / Dosen)) --> UC1
    User --> UC2
    User --> UC3
    User --> UC4
    User --> UC5
    User --> UC6
    User --> UC7
    User --> UC8
    User --> UC9
    User --> UC10
    User --> UC11
    User --> UC12
    User --> UC13
    User --> UC14
    User --> UC15
    User --> UC16
    User --> UC17
    User --> UC18
    User --> UC19
    User --> UC20
    User --> UC21
```

---

## 2. Entity Relationship Diagram (Database)

```mermaid
erDiagram
    users ||--o{ enrollments : "has"
    users ||--o{ meetings : "hosts"
    courses ||--o{ enrollments : "has"
    users {
        int id PK
        varchar name
        varchar email UK
        varchar password
        varchar avatar
        varchar reset_token
        datetime reset_token_expires
        datetime created_at
        datetime updated_at
    }
    courses {
        int id PK
        varchar title
        varchar icon
        varchar instructor
        int participants
        varchar duration
        varchar room
        text description
        enum status
        varchar schedule
        datetime created_at
        datetime updated_at
    }
    enrollments {
        int id PK
        int user_id FK
        int course_id FK
        enum role
        datetime joined_at
    }
    meetings {
        int id PK
        varchar code UK
        varchar title
        int host_id FK
        enum status
        datetime created_at
        datetime ended_at
    }
```

---

## 3. System Architecture / Component Diagram

```mermaid
graph TB
    subgraph "Frontend (Browser)"
        HTML[index.html]
        CSS[style.css]
        JS[script.js]
        LANG[lang/*.json]
        subgraph "JS Modules"
            AUTH[auth logic<br/>login/register]
            UI[screen navigation<br/>dashboard/detail]
            MEDIA[media devices<br/>mic/cam]
            MEET[WebRTC<br/>meeting room]
            NOTIF[notifications]
            ABSEN[attendance]
            SCHED[schedule]
            GRADE[grades]
            I18N[i18n translations]
            DARK[dark mode]
        end
    end

    subgraph "Backend (Node.js + Express)"
        API[HTTP API<br/>port 3001]
        SOCKET[Socket.IO<br/>WebRTC Signaling]
        subgraph "Routes"
            R_AUTH[/api/auth]
            R_COURSES[/api/courses]
            R_ENROLL[/api/enrollments]
            R_MEET[/api/meetings]
        end
        subgraph "Controllers"
            C_AUTH[authController]
            C_COURSE[courseController]
            C_ENROLL[enrollmentController]
            C_MEET[meetingController]
        end
        subgraph "Middleware"
            M_AUTH[auth.js<br/>JWT verification]
            M_ERR[errorHandler.js]
        end
        DB_CONFIG[database.js<br/>MySQL pool]
    end

    subgraph "Database (MySQL/MariaDB)"
        DB[(virtual_campus)]
        USERS[users]
        COURSES[courses]
        ENROLLMENTS[enrollments]
        MEETINGS[meetings]
    end

    HTML --> CSS
    HTML --> JS
    JS --> API
    JS --> SOCKET
    JS --> AUTH
    JS --> UI
    JS --> MEDIA
    JS --> MEET
    JS --> NOTIF
    JS --> ABSEN
    JS --> SCHED
    JS --> GRADE
    JS --> I18N
    JS --> DARK

    API --> R_AUTH
    API --> R_COURSES
    API --> R_ENROLL
    API --> R_MEET
    API --> M_ERR

    R_AUTH --> C_AUTH
    R_COURSES --> C_COURSE
    R_ENROLL --> C_ENROLL
    R_MEET --> C_MEET

    R_AUTH --> M_AUTH
    R_COURSES --> M_AUTH
    R_ENROLL --> M_AUTH
    R_MEET --> M_AUTH

    C_AUTH --> DB_CONFIG
    C_COURSE --> DB_CONFIG
    C_ENROLL --> DB_CONFIG
    C_MEET --> DB_CONFIG

    DB_CONFIG --> DB
    DB --> USERS
    DB --> COURSES
    DB --> ENROLLMENTS
    DB --> MEETINGS
```

---

## 4. Sequence Diagrams

### 4.1 Authentication Flow (Register)

```mermaid
sequenceDiagram
    actor User
    participant Frontend as Frontend (script.js)
    participant API as Backend API
    participant DB as MySQL Database

    User->>Frontend: Fill register form (name, email, password)
    Frontend->>Frontend: Validate input (min 6 char password)
    Frontend->>API: POST /api/auth/register {name, email, password}
    API->>DB: SELECT id FROM users WHERE email = ?
    DB-->>API: (no existing user)
    API->>API: bcrypt.hash(password, 10)
    API->>DB: INSERT INTO users (name, email, password)
    DB-->>API: lastInsertRowid
    API->>API: jwt.sign({id, email, name})
    API-->>Frontend: 201 {token, user}
    Frontend->>Frontend: Save token to localStorage
    Frontend->>Frontend: updateUserDisplay()
    Frontend->>API: GET /api/courses
    API-->>Frontend: {courses[...]}
    Frontend->>Frontend: renderCourses()
    Frontend->>Frontend: show('dashboard')
    Frontend-->>User: Display dashboard
```

### 4.2 Login Flow

```mermaid
sequenceDiagram
    actor User
    participant Frontend
    participant API
    participant DB

    User->>Frontend: Fill login form (email, password)
    Frontend->>API: POST /api/auth/login {email, password}
    API->>DB: SELECT * FROM users WHERE email = ?
    DB-->>API: user data (hashed password)
    API->>API: bcrypt.compare(password, user.password)
    alt valid credentials
        API->>API: jwt.sign({id, email, name})
        API-->>Frontend: 200 {token, user}
        Frontend->>Frontend: Save token, updateUserDisplay()
        Frontend->>API: GET /api/courses
        API-->>Frontend: {courses[...]}
        Frontend->>Frontend: renderCourses(), show('dashboard')
    else invalid credentials
        API-->>Frontend: 401 {error: "Email atau password salah"}
        Frontend-->>User: Show error message
    end
```

### 4.3 Course Enrollment Flow

```mermaid
sequenceDiagram
    actor User
    participant Frontend
    participant API
    participant DB

    User->>Frontend: Click "Join" on a course
    Frontend->>API: POST /api/enrollments/courses/:courseId (with JWT)
    API->>API: auth middleware - verify JWT token
    API->>DB: SELECT * FROM courses WHERE id = ?
    DB-->>API: course data
    API->>DB: SELECT id FROM enrollments WHERE user_id=? AND course_id=?
    alt already enrolled
        DB-->>API: existing enrollment
        API-->>Frontend: 409 {error: "Sudah terdaftar"}
    else not enrolled
        DB-->>API: no enrollment
        API->>DB: INSERT INTO enrollments (user_id, course_id)
        API->>DB: UPDATE courses SET participants = participants + 1
        DB-->>API: success
        API-->>Frontend: 201 {enrollment}
        Frontend-->>User: Success toast
    end
```

### 4.4 Meeting Creation & Join Flow

```mermaid
sequenceDiagram
    actor User
    participant Frontend
    participant API
    participant DB
    participant Socket as Socket.IO
    participant Peer as WebRTC Peer

    User->>Frontend: Click "Buat Meeting Baru"
    Frontend->>Frontend: ShowModal() - enter title
    User->>Frontend: Submit meeting title
    Frontend->>API: POST /api/meetings {title} (with JWT)
    API->>DB: Generate unique code, INSERT INTO meetings
    DB-->>API: meeting data
    API-->>Frontend: 201 {meeting}
    Frontend->>Frontend: show('meetingRoom')
    Frontend->>Frontend: startLocalMedia() (getUserMedia)
    Frontend->>Socket: connect with JWT auth
    Frontend->>Socket: emit('join-room', {roomId: meeting-{id}})
    Socket->>Socket: Verify JWT, add to room
    Socket-->>Frontend: emit('room-joined', {roomId, participants})
    Frontend->>Frontend: createPeerConnection (for each existing peer)

    Note over Frontend,Peer: WebRTC handshake via Socket.IO signaling
    Frontend->>Socket: emit('offer', {to, offer})
    Socket-->>Peer: emit('offer', {from, offer})
    Peer->>Peer: setRemoteDescription, createAnswer
    Peer->>Socket: emit('answer', {to, answer})
    Socket-->>Frontend: emit('answer', {from, answer})
    Frontend->>Frontend: setRemoteDescription
    Frontend->>Socket: emit('ice-candidate', {to, candidate})
    Socket-->>Peer: emit('ice-candidate', {from, candidate})
    Peer->>Peer: addIceCandidate

    alt user leaves
        User->>Frontend: Click "Akhiri Meeting"
        Frontend->>API: POST /api/meetings/:id/end
        Frontend->>Socket: emit('leave-room', {roomId})
        Frontend->>Frontend: Close all peer connections
        Frontend->>Frontend: stopLocalMedia()
        Frontend->>Frontend: show('meetingLobby')
    end
```

### 4.5 Attendance Flow (Check-in / Check-out)

```mermaid
sequenceDiagram
    actor User
    participant Frontend

    User->>Frontend: Navigate to Absensi screen
    Frontend->>Frontend: getAbsensiData() from localStorage
    alt has active session
        Frontend->>Frontend: Display "Sedang check-in" + timer
    else no active session
        Frontend->>Frontend: Display "Belum check-in"
    end

    User->>Frontend: Click "Check In"
    Frontend->>Frontend: Create record {id, date, checkin: now, checkout: null}
    Frontend->>Frontend: saveAbsensiData() to localStorage
    Frontend->>Frontend: updateAbsensiDisplay(), start timer
    Frontend-->>User: Toast "Check-in berhasil"

    Note over User,Frontend: ... time passes ...

    User->>Frontend: Click "Check Out"
    Frontend->>Frontend: Find active session, update checkout timestamp
    Frontend->>Frontend: saveAbsensiData() to localStorage
    Frontend->>Frontend: Calculate total hours, update stats
    Frontend-->>User: Toast "Check-out berhasil. Total: Xj Ym"

    User->>Frontend: Click "Export Laporan"
    Frontend->>Frontend: Generate CSV from all records
    Frontend->>Frontend: Trigger file download
    Frontend-->>User: CSV file downloaded
```

---

## 5. Navigation / Screen Flow (Frontend)

```mermaid
graph TD
    START([App Load]) --> CHECK{Logged In?}
    CHECK -->|No| LOGIN[loginScreen]
    CHECK -->|Yes| DASH[dashboard]

    LOGIN -->|Register link| REG[registerScreen]
    LOGIN -->|Forgot password| FORGOT[forgotPassword]
    FORGOT -->|Submit| RESET[resetPassword]
    RESET -->|Success| LOGIN

    REG -->|Login link| LOGIN

    DASH -->|Class card click| DETAIL[detail]
    DASH -->|Meeting FAB| LOBBY[meetingLobby]
    DASH -->|Attendance card| ABSEN[absensi]
    DASH -->|Schedule card| SCHED[schedule]
    DASH -->|Grades card| GRADE[gradesScreen]

    LOBBY -->|Create meeting| ROOM[meetingRoom]
    LOBBY -->|Join by code| ROOM
    LOBBY -->|Click active meeting| ROOM

    DETAIL -->|Join now| PREJOIN[prejoin]
    PREJOIN -->|Gabung| ROOM

    ROOM -->|Leave/End| LOBBY

    ABSEN -->|Back| DASH
    SCHED -->|Back| DASHwa
    GRADE -->|Back| DASH
```

---

## 6. Frontend Module Structure

```mermaid
graph LR
    subgraph "script.js - IIFE"
        STATE[auth state<br/>authToken, authUser]
        NAV[navigation<br/>show(), history]

        subgraph "API Layer"
            API[api() helper]
            AUTH_FN[handleLogin<br/>handleRegister]
            CRUD[loadDashboard<br/>createMeeting<br/>getMeetingByCode]
        end

        subgraph "UI Components"
            RENDER[renderCourses<br/>populateDetail]
            MODAL[showModal<br/>hideModal]
            TOAST[toast]
            SKELETON[showSkeleton<br/>hideSkeleton]
        end

        subgraph "Features"
            MEDIA[startMic/stopMic<br/>startCam/stopCam]
            MEET[enterMeetingRoom<br/>leaveMeeting<br/>WebRTC logic]
            NOTIF[notifications panel<br/>mock data]
            ABSENSI[checkin/checkout<br/>localStorage]
            SCHEDULE[scheduleData<br/>renderSchedule]
            GRADES[gradesData<br/>renderGrades]
        end

        subgraph "Utilities"
            I18N[t() translations<br/>updateI18n]
            CLOCK[tickClock]
            SEARCH[search + filter chips]
            DARK[dark mode toggle]
        end
    end
```
