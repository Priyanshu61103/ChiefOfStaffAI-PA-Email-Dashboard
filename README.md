# ChiefOfStaff AI — Executive Email Triaging & PA Dashboard

> **An Autonomous Chief of Staff & Personal Assistant (PA) Dashboard built on the MERN stack with ultra-fast Groq AI Structured Outputs.**

Designed for high-leverage Founders, C-Suite Executives, and their Executive Assistants to conquer email overload, automate routine administrative triage, extract calendar deadlines, and enable 1-click executive decision approvals.

---

## 🌟 Key Highlights & System Architecture

```
                                      +---------------------------------------------+
                                      |            Groq Cloud Inference             |
                                      |   Primary:  openai/gpt-oss-120b             |
                                      |   Fallback: openai/gpt-oss-20b              |
                                      |   Strict Structured Outputs (JSON Schema)   |
                                      +----------------------+----------------------+
                                                             ^
                                                             | Live Triage & Drafting
                                                             v
+-------------------------------+             +---------------------------------------------+
|    React 18 + Vite Frontend   | <---------> |            Express + Node.js API            |
| - Executive Obsidian Palette  |  REST APIs  | - Automatic Database Seeding (18 Threads)   |
| - Assistant 3-Pane Dashboard  |             | - Mongoose Multi-Message Thread Modeling    |
| - CEO Executive Focus View    |             | - Confidence Guardrails (< 0.75 Override)   |
| - Live Email Simulator Modal  |             +----------------------+----------------------+
| - Dark/Light Theme Switching  |                                    |
+-------------------------------+                                    v
                                              +---------------------------------------------+
                                              |               MongoDB Atlas                 |
                                              | - Conversations, Messages, & Activity Logs  |
                                              +---------------------------------------------+
```

### 1. Dual Persona Experience
- **Assistant Dashboard (`AssistantDashboard.jsx`)**: Comprehensive 3-pane command center for the Executive Assistant (Priya Sharma). Features real-time KPI metrics, dynamic left-sidebar queues with reactive badge counts, live search, multi-source filters (Gmail & Outlook), message bubble history, editable reply composers, and audit trails.
- **Client Executive View (`ClientExecutiveView.jsx`)**: A calm, high-contrast decision portal for the CEO/Executive (Arjun Mehta). Filters out noise and focuses exclusively on items flagged as **"Client to Reply"**. Provides 1-click **"Approve & Send Draft"** and **"Request Changes from Assistant"**.

### 2. Live Groq AI Chief of Staff (`aiService.js`)
- **Strict Structured Outputs**: Utilizes Groq's JSON Schema enforcement (`type: "json_schema"`, `strict: true`, `additionalProperties: false`) to ensure deterministic responses.
- **Dual-Model Resiliency**: Executes calls against `openai/gpt-oss-120b` for deep strategic reasoning, with automated retry/fallback to `openai/gpt-oss-20b` on rate-limits (HTTP 429) or transient network exceptions.
- **Autonomous Responsibility Classification**:
  - `Assistant to Reply`: Routine logistics, calendar rescheduling, vendor follow-ups, and confirmations.
  - `Client to Reply`: High-stakes contracts, term sheets, compensation approvals, and personal notes.
  - `No Reply Needed`: Newsletters, receipts, billing statements, and resolved threads.
  - `Needs Review`: Ambiguous, disputed, or high-risk legal/security communications.
- **Confidence Score Guardrail**: Evaluates `confidenceScore` (0.0 to 1.0). If confidence falls below **0.75**, the classification is **strictly overridden to `"Needs Review"`**, preventing unchecked hallucinations on sensitive emails.
- **Deadlines & Key Dates Extraction**: Automatically isolates dates, meeting slots, and deadlines into discrete structured metadata (`extractedDates`).
- **Context-Aware Suggested Replies**: Pre-generates ready-to-dispatch executive responses aligned with conversation tone.

### 3. Executive Design System
- **Executive Obsidian Theme**: Deep executive canvas (`#090D16`), royal blue/indigo ambient glows, glassmorphic cards (`bg-white dark:bg-slate-900/90`), and crisp 1px borders (`border-slate-800/80`).
- **Micro-Indicators**: Glowing status dots and sleek color-coded pill tags for each classification state.
- **Instant Reactive State**: Completed threads immediately drop out of active queues and decrement KPI counters with zero UI latency.

---

## 📂 Project Structure

```
pa-email-dashboard/
├── client/                     # Vite + React Frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── AssistantDashboard.jsx   # 3-column PA inbox triage & reply approval
│   │   │   ├── ClientExecutiveView.jsx  # Minimalist CEO decision view
│   │   │   ├── ConversationDetail.jsx   # AI rationale, bubbles, & draft composer
│   │   │   ├── ConversationList.jsx     # Email thread queue & live highlight
│   │   │   ├── IncomingEmailModal.jsx   # Live incoming email simulator
│   │   │   ├── KPIStrip.jsx             # Real-time active task counters
│   │   │   ├── OnboardingModal.jsx      # 3-step OAuth & sync wizard
│   │   │   ├── Sidebar.jsx              # Navigation with live badge counts
│   │   │   ├── ThemeToggle.jsx          # Dark / Light theme switcher
│   │   │   └── Toast.jsx                # Auto-dismissing toast notifications
│   │   ├── hooks/
│   │   │   ├── useConversations.js      # REST API data fetching & mutation hooks
│   │   │   └── useDarkMode.js           # Persistent theme hook
│   │   ├── utils/
│   │   │   └── constants.js             # Styling tokens, date formatters, badges
│   │   ├── App.jsx                      # App root & state coordinator
│   │   └── index.css                    # Tailwind directives & obsidian glows
│   ├── .env                             # VITE_API_URL=http://localhost:5000
│   ├── tailwind.config.js               # darkMode: "class"
│   └── vite.config.js                   # React Vite configuration
│
└── server/                     # Express + Node.js Backend
    ├── models/
    │   └── Conversation.js              # Mongoose thread & activity schema
    ├── routes/
    │   ├── conversations.js             # Core REST API endpoints
    │   └── seed.js                      # Database reset endpoint
    ├── services/
    │   └── aiService.js                 # Groq SDK structured schema & fallback
    ├── seedData.js                      # 18 realistic executive seed threads
    ├── .env                             # PORT, MONGODB_URI, GROQ_API_KEY
    └── index.js                         # Server entrypoint & auto-seed runner
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** (v18 or v20+ recommended)
- **MongoDB Atlas** connection string (or local MongoDB)
- **Groq API Key** (from [console.groq.com](https://console.groq.com))

---

### Step 1: Backend Setup (`server/`)

1. Open a terminal and navigate to `server/`:
   ```bash
   cd server
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Ensure `server/.env` is configured with your credentials:
   ```env
   PORT=5000
   MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/pa-email-dashboard
   GROQ_API_KEY=gsk_your_groq_api_key_here
   ```

4. Start the backend:
   ```bash
   npm run dev
   ```
   *The server will connect to MongoDB, automatically detect if the database is empty, and seed the initial 18 realistic executive threads.*

---

### Step 2: Frontend Setup (`client/`)

1. Open a second terminal and navigate to `client/`:
   ```bash
   cd client
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Verify `client/.env`:
   ```env
   VITE_API_URL=http://localhost:5000
   ```

4. Start the Vite development server:
   ```bash
   npm run dev
   ```

5. Open your browser at `http://localhost:5173`.

---

## 📡 REST API Reference

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/health` | Health check endpoint returning `{ status: "ok" }` |
| `GET` | `/api/conversations` | Lists threads with optional filters (`classification`, `segment`, `status`, `accountSource`, `search`) |
| `GET` | `/api/conversations/stats` | Aggregates active inbox metrics excluding Completed/Archived |
| `PATCH` | `/api/conversations/:id` | Updates classification, segment, status, star, or appends a sent reply |
| `POST` | `/api/conversations/incoming` | Receives new or appended email thread, triggers live Groq triage, and saves document |
| `POST` | `/api/conversations/:id/regenerate-draft` | Re-invokes Groq to generate a fresh suggested reply draft |
| `POST` | `/api/conversations/ask` | Natural language Q&A against open inbox conversations |
| `POST` | `/api/seed/reset` | Resets the collection and re-inserts the 18 pre-populated seed conversations |

---

## 🧪 Testing the Live AI Simulator

1. In the top navbar, click **"Simulate Incoming Email"**.
2. Select one of the three quick-fill presets:
   - **Investor Term Sheet** -> Triages to **Client to Reply**
   - **Vendor Meeting** -> Triages to **Assistant to Reply**
   - **Ambiguous / Low Confidence** -> Triages to **Needs Review**
3. Click **"Run Live AI Triage & Add to Inbox"**.
4. The modal will call the backend, Groq will perform live structured triage, and the new thread will immediately appear at the top of your inbox with an animated glow highlight.

---

## 🛡️ License
Built for executive productivity and high-performance workflow automation. MIT License.
