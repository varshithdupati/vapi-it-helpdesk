# Acme Voice IT Helpdesk

> **Enterprise IT Support Automation powered by [Vapi](https://vapi.ai)**

A production-ready demo showcasing how Vapi's voice AI can automate Tier-1 IT support. This project simulates **Acme Corp**, an enterprise with ~5,000 employees, demonstrating an end-to-end voice-to-ticket experience.

🔗 **Live Demo**: [https://varshithdupati.github.io/vapi-it-helpdesk](https://varshithdupati.github.io/vapi-it-helpdesk)  
🔗 **API**: [https://api.varshithdupati.com](https://api.varshithdupati.com/health)

---

## 🎯 Business Problem

Enterprise IT helpdesks face significant challenges:

| Challenge | Impact |
|-----------|--------|
| High call volume | Expensive 24/7 staffing |
| Repetitive Tier-1 questions | Agents doing low-value work |
| Multiple system lookups | Slow handle times |
| Inconsistent ticket quality | Delayed resolution |
| Long queue wait times | Lost employee productivity |

## ✨ Solution

A **Vapi-powered voice agent** that:

- ✅ Handles calls **24/7** without staffing costs
- ✅ **Authenticates employees** by ID
- ✅ **Looks up devices** via API
- ✅ **Creates IT tickets** automatically
- ✅ **Reads ticket numbers** back to employees
- ✅ **Escalates complex cases** to humans

---

## 🏗 Architecture

```
┌─────────────────┐      ┌─────────────────────────┐      ┌──────────────────┐
│                 │      │                         │      │                  │
│   Employee      │─────▶│    Vapi Voice Agent     │─────▶│  NestJS Backend  │
│   (Web/Phone)   │      │                         │      │                  │
│                 │◀─────│  • Speech-to-Text       │◀─────│  /api/employee   │
└─────────────────┘      │  • LLM Processing       │      │  /api/tickets    │
                         │  • Text-to-Speech       │      │  /health         │
                         │  • Tool Execution       │      │                  │
                         └─────────────────────────┘      └────────┬─────────┘
                                                                   │
                         ┌─────────────────────────┐               │
                         │   React Frontend        │               ▼
                         │   • Vapi Web SDK        │      ┌──────────────────┐
                         │   • Live Ticket Feed    │      │  SQLite + Prisma │
                         └─────────────────────────┘      └──────────────────┘
```

### Tech Stack

| Component | Technology |
|-----------|------------|
| Backend | NestJS + TypeScript + Prisma |
| Database | SQLite |
| Frontend | React + TypeScript + Vite |
| Voice AI | Vapi Web SDK |
| Hosting | AWS EC2 (backend) + GitHub Pages (frontend) |

---

## 🚀 Quick Start

### Prerequisites

- Node.js 20+
- npm

### Local Development

```bash
# Clone repository
git clone https://github.com/varshithdupati/vapi-it-helpdesk.git
cd vapi-it-helpdesk

# Setup backend
cd server
npm install
npx prisma generate
npx prisma migrate dev
npx prisma db seed
npm run start:dev

# Setup frontend (new terminal)
cd client
npm install
npm run dev
```

**Backend**: http://localhost:3001  
**Frontend**: http://localhost:5173

---

## 📡 API Reference

### Base URL

- **Production**: `https://api.varshithdupati.com`
- **Development**: `http://localhost:3001`

### Endpoints

#### `GET /health`

Health check endpoint.

```json
{ "status": "ok", "timestamp": "2025-12-08T..." }
```

#### `GET /api/employee/:id`

Retrieve employee information and devices.

```bash
curl https://api.varshithdupati.com/api/employee/12345
```

**Response (200)**:
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

#### `POST /api/tickets`

Create an IT support ticket.

```bash
curl -X POST https://api.varshithdupati.com/api/tickets \
  -H "Content-Type: application/json" \
  -d '{
    "employeeId": "12345",
    "deviceAssetTag": "L-9812",
    "issueSummary": "Laptop cannot connect to Wi-Fi"
  }'
```

**Response (201)**:
```json
{
  "ticketNumber": "IT-42",
  "employeeId": "12345",
  "deviceAssetTag": "L-9812",
  "issueSummary": "Laptop cannot connect to Wi-Fi",
  "status": "OPEN",
  "createdAt": "2025-12-08T10:30:00.000Z"
}
```

#### `GET /api/tickets`

List all tickets (most recent first).

---

## 🎙 Vapi Configuration

### 1. Create Assistant

In [Vapi Dashboard](https://dashboard.vapi.ai), create an assistant with this system prompt:

```
You are a friendly IT support agent for Acme Corp. Help employees with technical issues and create support tickets.

Process:
1. Greet the employee and ask for their employee ID
2. Use get_employee to look up their information
3. Confirm their identity and list their devices
4. Ask which device has the issue and gather details
5. Create a ticket using create_ticket
6. Read back the ticket number
7. Ask if there's anything else, then end politely

Guidelines:
- Be concise but friendly
- If employee ID not found, ask them to verify
- Always confirm the ticket number
```

### 2. Configure Tools

**Tool 1: get_employee**
| Setting | Value |
|---------|-------|
| Name | `get_employee` |
| Method | `GET` |
| URL | `https://api.varshithdupati.com/api/employee/{{employeeId}}` |

**Tool 2: create_ticket**
| Setting | Value |
|---------|-------|
| Name | `create_ticket` |
| Method | `POST` |
| URL | `https://api.varshithdupati.com/api/tickets` |
| Headers | `Content-Type: application/json` |
| Body | `{"employeeId":"{{employeeId}}","deviceAssetTag":"{{deviceAssetTag}}","issueSummary":"{{issueSummary}}"}` |

### 3. Configure Frontend

Set environment variables:

```bash
VITE_VAPI_PUBLIC_KEY=pk_your_key_here
VITE_VAPI_ASSISTANT_ID=your_assistant_id_here
VITE_API_BASE_URL=https://api.varshithdupati.com
```

---

## 👥 Test Data

| Name | Employee ID | Department | Devices |
|------|-------------|------------|---------|
| Alex Johnson | `12345` | Engineering | MacBook (L-9812), iPhone (P-4421) |
| Priya Patel | `67890` | Sales | Windows Laptop (L-7741) |
| Varshith Dupati | `54821` | Engineering | MacBook (L-3347), iPhone (P-8891) |
| Trish English | `38472` | Marketing | Windows Laptop (L-6629), iPad (T-2215) |
| Srikruth Reddy | `91563` | Product | MacBook (L-4458), Android Phone (P-7732) |

---

## 🌐 Deployment

### Backend (AWS EC2)

The backend is deployed to AWS EC2 with:
- Ubuntu 22.04
- Node.js 20
- PM2 process manager
- Nginx reverse proxy
- Let's Encrypt SSL

### Frontend (GitHub Pages)

The frontend is automatically deployed to GitHub Pages on push to `main`.

### CI/CD

GitHub Actions workflows handle automated deployments:
- `.github/workflows/deploy-backend.yml` - Backend to EC2
- `.github/workflows/deploy-frontend.yml` - Frontend to GitHub Pages

---

## 📁 Project Structure

```
vapi-it-helpdesk/
├── .github/workflows/       # CI/CD pipelines
├── client/                  # React frontend
│   ├── src/
│   │   ├── components/      # VapiButton component
│   │   ├── config/          # Vapi configuration
│   │   ├── App.tsx          # Main application
│   │   └── api.ts           # API client
│   └── package.json
├── server/                  # NestJS backend
│   ├── src/
│   │   ├── employee/        # Employee module
│   │   ├── ticket/          # Ticket module
│   │   ├── prisma/          # Database service
│   │   └── health/          # Health check
│   ├── prisma/              # Database schema & migrations
│   └── package.json
└── README.md
```

---

## 📄 License

MIT License

---

<p align="center">
  Built with ❤️ as a Forward Deployed Engineer demo for <a href="https://vapi.ai">Vapi</a>
</p>
