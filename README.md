# Pulse
**Continuous Growth Conversations**

A multi-tenant employee growth platform that enables managers to provide structured monthly coaching conversations while giving HR visibility into organizational progress.

---

## 🌿 Quick Demo

To evaluate the complete full-stack workflow immediately, follow these steps:

1. **Start the Stack:**
   ```bash
   docker compose up
   ```
2. **Access the App:**
   Open `http://localhost:5173` in your browser.
3. **Login as a Manager:**
   - **Email:** `priya@ashoka.com`
   - **Password:** `password123`
4. **Submit Feedback:**
   - You will see Priya's dashboard with 6 direct reports.
   - Click on **Rahul Verma** (currently in *Draft* status).
   - Rate the dimensions, write coaching feedback, and observe the **Feedback Quality Meter** update in real-time.
   - Click **Submit Conversation**.
5. **Observe HR Dashboards:**
   - Click the profile icon or switcher and change your active role to **HR**.
   - Navigate to **Overview** and observe that the company-wide **Completion Rate** has increased!
6. **Login as the Employee:**
   - Logout and log back in as `rahul@ashoka.com` (password: `password123`).
   - Go to **My Growth** and observe the newly submitted feedback and computed average scores immediately reflected on the growth charts.

---

## 🏗️ Architecture

```
                 +-----------------------------------------+
                 |              Browser Client             |
                 |      (React 18 + Vite SPA, Port 5173)   |
                 +-------------------+---------------------+
                                     |
                                     | JSON REST API Requests
                                     v
                 +-------------------+---------------------+
                 |             FastAPI Backend             |
                 |       (Python 3.11+, Port 8000)         |
                 +-------------------+---------------------+
                                     |
                                     | SQLAlchemy ORM
                                     v
                 +-------------------+---------------------+
                 |          SQLite Database file           |
                 |        (instance/pulse.db File)         |
                 +-----------------------------------------+
```

### Key Architectural Guidelines
- **Tenant Separation:** All database entries are mapped to a specific `company_id`. Strict filter checks prevent cross-company access.
- **Normalized Roles:** Users are mapped to roles via a many-to-many relationship table (`user_role`). A user can act as both an `employee` and `manager` or `hr` simultaneously.
- **Derived Metrics:** Dashboard indicators like completion rate, word count averages, and parameter scores are computed dynamically from real database records to ensure consistency.

---

## 📊 Database ER Diagram

```
 +------------------+           +------------------+
 |    companies     | 1       * |   departments    |
 |------------------|-----------|------------------|
 | id (PK)          |           | id (PK)          |
 | name             |           | company_id (FK)  |
 | theme            |           | name             |
 | logo             |           +--------+---------+
 | tagline          |                    | 1
 +--------+---------+                    |
          | 1                            |
          |                              | *
          |                            +----+-------------+
          |                            |      users       |
          |                            |------------------|
          |                            | id (PK)          |
          +--------------------------* | company_id (FK)  |
                                       | department_id(FK)|
 +------------------+                  | name             |
 |      roles       | 1                | title            |
 |------------------|                  | email            |
 | id (PK)          |                  | hashed_password  |
 | name             |                  | initials         |
 +--------+---------+                  | manager_id (FK)  |
          | 1                          | join_date        |
          |                            +--------+---------+
          | * (secondary)                       | 1 (employee/manager)
   +------+------+                              |
   |  user_role  |                              |
   +-------------+                              |
                                                | *
 +------------------+                  +--------+---------+
 |    parameters    | 1                |   evaluations    |
 |------------------|                  |------------------|
 | id (PK)          |                  | id (PK)          |
 | label            |                  | company_id (FK)  |
 | icon_name        |                  | employee_id (FK) |
 | tip              |                  | manager_id (FK)  |
 +--------+---------+                  | month            |
          | 1                          | year             |
          |                            | status (enum)    |
          | *                          | due_date         |
 +--------+---------+                  | overall_score    |
 | dimension_scores |                  +--------+---------+
 |------------------|                           | 1
 | id (PK)          |                           |
 | evaluation_id(FK)|* <------------------------+
 | parameter_id (FK)|
 | score            |
 | comment          |
 +------------------+
```

---

## 🛠️ Technology Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 18, Vite |
| **Routing** | React Router v6 |
| **Styling** | Vanilla CSS (CSS variables, custom utility tokens) |
| **Charts** | Recharts (Apple-style gradient Area and Line charts) |
| **Icons** | Lucide React |
| **Backend** | FastAPI (Python 3.11) |
| **Database ORM** | SQLAlchemy (SQLite) |
| **Auth** | JWT Token authentication (using `python-jose`) |
| **Virtualization** | Docker, Docker Compose |

---

## 💻 Setup & Installation

### Option 1 — Using Docker (Recommended)

1. Ensure Docker Desktop is running on your machine.
2. Build and launch the containers:
   ```bash
   docker compose up --build
   ```
3. The app is available at:
   - **Frontend:** `http://localhost:5173`
   - **Backend API Docs:** `http://localhost:8000/docs`

### Option 2 — Manual Setup

#### 1. Backend Setup
```bash
cd backend
python -m venv venv
# Activate virtual environment
venv\Scripts\activate      # Windows
source venv/bin/activate   # macOS/Linux

pip install -r requirements.txt
cp .env.example .env
python -m app.seed.seed_data
uvicorn app.main:app --reload --port 8000
```

#### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

---

## 🔑 Seed Credentials

All accounts use the password: `password123`

### Ashoka Textiles (Hierarchical Setup)
*Structure: COO (Aman) → Rohan → Priya → 6 Direct Reports*

| Role | Name | Email | Direct Reports |
|---|---|---|---|
| **COO** | Aman Verma | `coo@ashoka.com` | Rohan Menon |
| **Manager** | Rohan Menon | `rohan@ashoka.com` | Priya Sharma |
| **Manager / HR** | Priya Sharma | `priya@ashoka.com` | 6 employees (Sneha, Rahul, Arjun, Kavita, Sampath, Ananya) |
| **Employee / Lead** | Sneha Iyer | `sneha@ashoka.com` | - |
| **Employee** | Rahul Verma | `rahul@ashoka.com` | - |
| **Employee** | Arjun Mehta | `arjun@ashoka.com` | - |
| **Employee / Lead** | Kavita Singh | `kavita@ashoka.com` | - |
| **Employee** | Sampath Kumar | `sampath@ashoka.com` | - |
| **Employee** | Ananya Rao | `ananya@ashoka.com` | - |

---

### Bright Path Consulting (Flat Setup)
*Structure: Founder (Vivek) → 8 Direct Reports*

| Role | Name | Email | Direct Reports |
|---|---|---|---|
| **Founder / HR** | Vivek Nair | `founder@brightpath.com` | 8 employees |
| **Employee** | Divya Krishnan | `divya@brightpath.com` | - |
| **Employee** | Amit Patel | `amit@brightpath.com` | - |
| **Employee** | Neha Sen | `neha@brightpath.com` | - |
| **Employee** | Rajesh Kumar | `rajesh@brightpath.com` | - |
| **Employee** | Shreya Ghoshal | `shreya@brightpath.com` | - |
| **Employee** | Vikram Seth | `vikram@brightpath.com` | - |
| **Employee** | Pooja Hegde | `pooja@brightpath.com` | - |
| **Employee** | Karan Johar | `karan@brightpath.com` | - |

---

## 📡 API Documentation

For the complete schema specifications, error codes, request payloads, and response JSON formats, refer to [API.md](./API.md).

---

## 🔮 Future Roadmap

1. **Alembic Database Migrations:** Integrate Alembic fully for clean, versioned database schema migration pathways.
2. **Audit Logs Table:** Add an audit logging table to track when feedback is modified, finalized, or when user roles are swapped.
3. **Custom Evaluation Parameters:** Allow HR administrators to configure custom evaluation questions/dimensions per department.
4. **Push Notifications:** Introduce real-time WebSocket notifications when an evaluation is submitted or locked.
