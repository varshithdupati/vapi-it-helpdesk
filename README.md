# Acme Voice IT Helpdesk

> **Enterprise IT Support Automation powered by [Vapi](https://vapi.ai)**

A complete demo showcasing how Vapi's voice AI can automate Tier-1 IT support for a large enterprise. This project simulates **Acme Corp**, a company with ~5,000 employees, and demonstrates an end-to-end voice-to-ticket experience.

![Architecture](https://img.shields.io/badge/Stack-NestJS%20%2B%20React%20%2B%20Prisma-blue)
![Voice AI](https://img.shields.io/badge/Voice%20AI-Vapi-purple)
![Database](https://img.shields.io/badge/Database-SQLite-green)

---

## 📋 Table of Contents

- [Business Problem](#-business-problem)
- [Solution Overview](#-solution-overview)
- [Architecture](#-architecture)
- [Quick Start](#-quick-start)
- [API Reference](#-api-reference)
- [Vapi Integration](#-vapi-integration)
- [Demo Data](#-demo-data)
- [Deployment](#-deployment)

---

## 🔥 Business Problem

### Current State (Manual Process)

Large enterprises like Acme Corp have internal IT Helpdesks that employees call for technical issues:
- Laptop not connecting to Wi-Fi
- VPN not working
- Email locked out
- Software installation requests
- General device problems

**The current workflow:**
1. Employee calls the IT helpdesk number
2. A human IT agent answers and:
   - Asks for employee ID
   - Looks up the employee in internal systems
   - Finds their assigned devices
   - Asks questions to understand the issue
   - Manually creates an IT ticket (ServiceNow/Jira)
3. The ticket is routed to the appropriate team
4. Employee waits for resolution

### Pain Points

| Issue | Impact |
|-------|--------|
| High call volume | Expensive 24/7 staffing |
| Repetitive Tier-1 questions | Agents doing low-value work |
| "Swivel chair" between systems | Slow handle times |
| Inconsistent ticket quality | Delayed resolution |
| Long queue wait times | Lost employee productivity |

---

## ✨ Solution Overview

We built a **Vapi-powered voice IT helpdesk agent** that:

- ✅ Answers calls **24/7** without staffing costs
- ✅ **Authenticates employees** by employee ID
- ✅ **Looks up devices** assigned to the employee
- ✅ **Asks clarifying questions** about the issue
- ✅ **Automatically creates IT tickets** via API
- ✅ **Reads the ticket number** back to the employee
- ✅ **Escalates complex cases** to human agents

### Example Conversation

```
Agent: "Hi! Welcome to Acme IT Support. Can I have your employee ID please?"

User:  "My employee ID is 12345."

Agent: "Thanks Alex! I can see you're in Engineering and you have a MacBook 
        laptop and an iPhone. Which device are you having trouble with?"

User:  "My Mac laptop can't connect to the office Wi-Fi."

Agent: "I understand. When did this issue start, and have you tried 
        restarting your laptop?"

User:  "It started this morning. Yes, I've restarted but it still won't connect."

Agent: "Got it. I've created ticket IT-42 for your MacBook Wi-Fi connectivity 
        issue. Our network team will reach out within 4 hours. Is there 
        anything else I can help with?"

User:  "No, that's all. Thanks!"

Agent: "You're welcome, Alex! Have a great day."
```

---

## 🏗 Architecture

```
┌─────────────────┐      ┌─────────────────────────┐      ┌──────────────────┐
│                 │      │                         │      │                  │
│   Employee      │─────▶│    Vapi Voice Agent     │─────▶│  NestJS Backend  │
│   (Web/Phone)   │      │                         │      │   (server/)      │
│                 │◀─────│  • System Prompt        │◀─────│                  │
└─────────────────┘      │  • get_employee tool    │      │  /api/employee   │
                         │  • create_ticket tool   │      │  /api/tickets    │
                         │                         │      │  /health         │
                         └─────────────────────────┘      └────────┬─────────┘
                                                                   │
                         ┌─────────────────────────┐               │
                         │                         │               │
                         │   React Frontend        │               │
                         │   (client/)             │               ▼
                         │                         │      ┌──────────────────┐
                         │  • Landing page         │      │                  │
                         │  • Vapi Web SDK         │      │  SQLite + Prisma │
                         │  • Live ticket feed     │      │                  │
                         │                         │      │  • Employees     │
                         └─────────────────────────┘      │  • Devices       │
                                                          │  • Tickets       │
                                                          │                  │
                                                          └──────────────────┘
```

### Tech Stack

| Component | Technology |
|-----------|------------|
| **Backend API** | NestJS + TypeScript |
| **Database** | SQLite + Prisma ORM |
| **Frontend** | React + TypeScript + Vite |
| **Voice AI** | Vapi Web SDK (`@vapi-ai/web`) |

---

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- npm or yarn

### 1. Clone & Install

```bash
# Clone the repository
git clone https://github.com/your-org/vapi-it-helpdesk.git
cd vapi-it-helpdesk

# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

### 2. Setup Database

```bash
cd server

# Generate Prisma client
npx prisma generate

# Run migrations (creates SQLite database)
npx prisma migrate dev --name init

# Seed with demo data
npx prisma db seed
```

### 3. Start the Backend

```bash
cd server
npm run start:dev
```

The API will be running at `http://localhost:3001`

Verify with:
```bash
curl http://localhost:3001/health
# {"status":"ok","timestamp":"2025-12-08T..."}

curl http://localhost:3001/api/employee/12345
# {"id":"12345","name":"Alex Johnson","department":"Engineering","devices":[...]}
```

### 4. Start the Frontend

```bash
cd client
npm run dev
```

The frontend will be running at `http://localhost:5173`

---

## 📡 API Reference

### Base URL
- **Development:** `http://localhost:3001`
- **Production:** Your deployed server URL

### Endpoints

#### `GET /health`

Health check endpoint.

**Response:**
```json
{
  "status": "ok",
  "timestamp": "2025-12-08T10:30:00.000Z"
}
```

---

#### `GET /api/employee/:id`

Retrieve employee information and their assigned devices.

**Parameters:**
| Name | Type | Description |
|------|------|-------------|
| `id` | string | Employee ID (e.g., "12345") |

**Success Response (200):**
```json
{
  "id": "12345",
  "name": "Alex Johnson",
  "department": "Engineering",
  "devices": [
    { "type": "laptop", "assetTag": "L-9812", "os": "macOS 15" },
    { "type": "phone", "assetTag": "P-4421", "os": "iOS 18" }
  ]
}
```

**Error Response (404):**
```json
{
  "error": "Employee not found"
}
```

---

#### `POST /api/tickets`

Create a new IT support ticket.

**Request Body:**
```json
{
  "employeeId": "12345",
  "deviceAssetTag": "L-9812",
  "issueSummary": "Laptop cannot connect to office Wi-Fi; started today; restart already attempted."
}
```

**Success Response (201):**
```json
{
  "ticketNumber": "IT-42",
  "employeeId": "12345",
  "deviceAssetTag": "L-9812",
  "issueSummary": "Laptop cannot connect to office Wi-Fi; started today; restart already attempted.",
  "status": "OPEN",
  "createdAt": "2025-12-08T10:30:00.000Z"
}
```

**Error Responses:**

*Invalid employee (400):*
```json
{
  "error": "Invalid employee ID",
  "message": "Employee with ID 99999 not found"
}
```

*Invalid device (400):*
```json
{
  "error": "Invalid device",
  "message": "Device X-0000 is not assigned to employee 12345"
}
```

---

#### `GET /api/tickets`

List all tickets (most recent first).

**Response (200):**
```json
[
  {
    "ticketNumber": "IT-42",
    "employeeId": "12345",
    "deviceAssetTag": "L-9812",
    "issueSummary": "Laptop cannot connect to office Wi-Fi...",
    "status": "OPEN",
    "createdAt": "2025-12-08T10:30:00.000Z"
  }
]
```

---

## 🎙 Vapi Integration

### Step 1: Create a Vapi Assistant

1. Log in to your [Vapi Dashboard](https://dashboard.vapi.ai)
2. Create a new assistant named **"Acme IT Helpdesk"**
3. Configure the **System Prompt**:

```
You are a friendly and professional IT support agent for Acme Corp. Your job is to help employees with their technical issues and create IT support tickets.

## Your Process:

1. **Greet** the employee warmly
2. **Ask for their employee ID** to verify their identity
3. **Use the get_employee tool** to look up their information and devices
4. **Confirm their identity** by greeting them by name and mentioning their department
5. **Ask which device** they're having trouble with (reference their specific devices)
6. **Gather details** about the issue:
   - What is the problem?
   - When did it start?
   - Have they tried any troubleshooting steps?
7. **Create a ticket** using the create_ticket tool with:
   - Their employee ID
   - The device's asset tag
   - A clear summary of the issue including relevant details
8. **Read back the ticket number** (e.g., "I've created ticket IT-42 for you")
9. **Ask if there's anything else** you can help with
10. **End the call politely**

## Guidelines:
- Be concise but friendly
- If the employee ID is not found, politely ask them to verify it
- If they mention a device you don't see in their record, ask them to clarify
- For complex issues that require hands-on support, let them know a technician will follow up
- Always confirm the ticket number at the end
```

### Step 2: Create Vapi Tools

Create two tools in your Vapi assistant:

#### Tool 1: `get_employee`

| Field | Value |
|-------|-------|
| **Name** | `get_employee` |
| **Description** | Looks up an employee by their ID and returns their information including assigned devices |
| **Type** | HTTP Request |
| **Method** | GET |
| **URL** | `https://your-server-url.com/api/employee/{employeeId}` |

**Parameters:**
| Name | Type | Required | Description |
|------|------|----------|-------------|
| `employeeId` | string | Yes | The employee's ID number |

#### Tool 2: `create_ticket`

| Field | Value |
|-------|-------|
| **Name** | `create_ticket` |
| **Description** | Creates an IT support ticket for the employee's issue |
| **Type** | HTTP Request |
| **Method** | POST |
| **URL** | `https://your-server-url.com/api/tickets` |
| **Content-Type** | application/json |

**Request Body Schema:**
```json
{
  "employeeId": "{employeeId}",
  "deviceAssetTag": "{deviceAssetTag}",
  "issueSummary": "{issueSummary}"
}
```

**Parameters:**
| Name | Type | Required | Description |
|------|------|----------|-------------|
| `employeeId` | string | Yes | The employee's ID |
| `deviceAssetTag` | string | Yes | Asset tag of the affected device |
| `issueSummary` | string | Yes | Natural language description of the issue |

### Step 3: Configure the Frontend

The frontend uses the **Vapi Web SDK** (`@vapi-ai/web`) for voice interactions. Configure your credentials:

**Option A: Environment Variables (Recommended)**

Create a `.env` file in the `client/` directory:

```bash
# client/.env
VITE_VAPI_PUBLIC_KEY=your_vapi_public_key_here
VITE_VAPI_ASSISTANT_ID=your_assistant_id_here
VITE_API_BASE_URL=https://your-backend-url.com
```

**Option B: Direct Configuration**

Edit `client/src/config/vapi.ts` and replace the placeholder values:

```typescript
export const VAPI_PUBLIC_KEY = 'your_vapi_public_key_here';
export const VAPI_ASSISTANT_ID = 'your_assistant_id_here';
```

Get your credentials from the [Vapi Dashboard](https://dashboard.vapi.ai):
- **Public Key**: Dashboard → Account → API Keys
- **Assistant ID**: Dashboard → Assistants → Select your assistant

---

## 👥 Demo Data

The database is seeded with the following test employees:

### Employee 1: Alex Johnson

| Field | Value |
|-------|-------|
| **ID** | `12345` |
| **Name** | Alex Johnson |
| **Department** | Engineering |
| **Devices** | MacBook (L-9812, macOS 15), iPhone (P-4421, iOS 18) |

### Employee 2: Priya Patel

| Field | Value |
|-------|-------|
| **ID** | `67890` |
| **Name** | Priya Patel |
| **Department** | Sales |
| **Devices** | Laptop (L-7741, Windows 11) |

---

## 🌐 Deployment

This project includes GitHub Actions CI/CD for automated deployments.

### Option 1: GitHub Pages (Frontend) + AWS EC2 (Backend)

#### Backend on AWS EC2

1. **Launch EC2 Instance** (Ubuntu 22.04, t2.micro or larger)
   - Security Group: Allow ports 22, 80, 443, 3001

2. **Initial Server Setup:**
```bash
ssh -i your-key.pem ubuntu@your-ec2-ip

# Install Node.js 20
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Install PM2 and Nginx
sudo npm install -g pm2
sudo apt install -y nginx
```

3. **Configure Nginx** (`/etc/nginx/sites-available/api`):
```nginx
server {
    listen 80;
    server_name your-ec2-ip;
    
    location / {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

4. **Enable site:**
```bash
sudo ln -s /etc/nginx/sites-available/api /etc/nginx/sites-enabled/
sudo rm /etc/nginx/sites-enabled/default
sudo systemctl restart nginx
```

#### GitHub Actions CI/CD

The project includes two workflow files in `.github/workflows/`:
- `deploy-backend.yml` - Deploys backend to EC2 on push to `server/`
- `deploy-frontend.yml` - Deploys frontend to GitHub Pages on push to `client/`

**Required GitHub Secrets:**

| Secret | Description |
|--------|-------------|
| `EC2_HOST` | Your EC2 public IP or domain |
| `EC2_USER` | `ubuntu` |
| `EC2_SSH_KEY` | Contents of your `.pem` file |
| `VITE_VAPI_PUBLIC_KEY` | Your Vapi public key |
| `VITE_VAPI_ASSISTANT_ID` | Your Vapi assistant ID |
| `VITE_API_BASE_URL` | `http://your-ec2-ip` |

**Enable GitHub Pages:**
1. Go to repo Settings → Pages
2. Source: GitHub Actions

#### Frontend Configuration

Update `client/vite.config.ts` with your repo name:
```typescript
base: process.env.NODE_ENV === 'production' ? '/your-repo-name/' : '/',
```

### Option 2: Other Platforms

**Backend - Render / Railway / Fly.io:**
1. Connect GitHub repository
2. Build: `cd server && npm install && npx prisma generate && npx prisma migrate deploy && npm run build`
3. Start: `cd server && npm run start:prod`
4. Env: `DATABASE_URL=file:./prod.db`, `PORT=3001`

**Frontend - Vercel / Netlify:**
1. Connect GitHub repository
2. Root directory: `client`
3. Build: `npm run build`
4. Publish: `dist`
5. Env: `VITE_API_BASE_URL=https://your-backend-url`

**Docker:**
```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY server/ .
RUN npm install && npx prisma generate && npm run build
EXPOSE 3001
ENV DATABASE_URL="file:./prod.db"
CMD ["npm", "run", "start:prod"]
```

---

## 📁 Project Structure

```
vapi-it-helpdesk/
├── .github/
│   └── workflows/
│       ├── deploy-backend.yml   # CI/CD for EC2
│       └── deploy-frontend.yml  # CI/CD for GitHub Pages
│
├── client/                       # React frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── VapiButton.tsx   # Vapi voice call button
│   │   │   └── VapiButton.css
│   │   ├── config/
│   │   │   └── vapi.ts          # Vapi configuration
│   │   ├── App.tsx              # Main application
│   │   ├── api.ts               # API client
│   │   └── types.ts             # TypeScript types
│   ├── index.html
│   ├── package.json
│   └── vite.config.ts
│
├── server/                       # NestJS backend
│   ├── src/
│   │   ├── employee/            # Employee module
│   │   ├── ticket/              # Ticket module
│   │   ├── prisma/              # Prisma service
│   │   ├── health/              # Health check
│   │   └── main.ts
│   ├── prisma/
│   │   ├── schema.prisma        # Database schema
│   │   └── seed.ts              # Seed data
│   ├── ecosystem.config.js      # PM2 config
│   └── package.json
│
└── README.md
```

---

## 🤝 Contributing

This is a demo project for Vapi's Forward Deployed Engineering team. Feel free to fork and customize for your own use cases!

---

## 📄 License

MIT License - See LICENSE file for details.

---

<p align="center">
  Built with ❤️ for <a href="https://vapi.ai">Vapi</a>
</p>

