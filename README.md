# ImmerCAT — Backend (Express API)

## Description

ImmerCAT is a real estate management tool designed for private agencies in Catalonia. This repository contains the **backend REST API** built with Node.js and Express.

The frontend repository can be found here: https://github.com/Jiems24/immercat-client

## How it works

ImmerCAT has two parts: a public area and a private admin panel.

### Public area
Any visitor can access the app and:
- Browse available properties
- Filter by operation type, property type and maximum price
- View the full detail of each property

### Private area (agents)
Agents log in with their credentials and get access to:
- **Dashboard** — summary of active properties, clients and owners with stats
- **Properties** — full CRUD, photo upload via Cloudinary, AI description generation with Mistral, and archive/restore
- **Clients** — full CRUD, demand tracking, visit notes linked to properties, and automatic property suggestions based on budget and demand
- **Owners** — full CRUD linked to their properties


---

## Instructions to run locally

### 1. Clone the repository
```bash
git clone https://github.com/Jiems24/immercat-server
cd immercat-server
```

### 2. Install dependencies
```bash
npm install
```

### 3. Environment variables

Create a `.env` file in the root of the project with the following variables:
PORT=5005
MONGODB_URI=        # MongoDB Atlas connection string (create account at mongodb.com)
TOKEN_SECRET=       # Any random string for JWT signing
CLOUDINARY_NAME=    # Cloudinary account name (create account at cloudinary.com)
CLOUDINARY_KEY=     # Cloudinary API key
CLOUDINARY_SECRET=  # Cloudinary API secret
MISTRAL_API_KEY=    # Mistral API key (create account at mistral.ai)
ORIGIN=             # Frontend URL (ex. http://localhost:5173)

### 4. Run the application
```bash
npm run dev
```

Server runs at `http://localhost:5005`

---

## Demo

- **API:** https://immercat-server.vercel.app
- **Frontend:** https://immercat.vercel.app

---

## API Endpoints

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/auth/signup` | Register new user |
| POST | `/auth/login` | Login and get JWT token |
| GET | `/auth/verify` | Verify active token |

### Properties (private)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/properties` | Paginated list of active properties |
| GET | `/api/properties/archived` | Paginated list of archived properties |
| GET | `/api/properties/:id` | Property detail |
| POST | `/api/properties` | Create property (with photos) |
| PUT | `/api/properties/:id` | Edit property |
| PUT | `/api/properties/:id/archive` | Archive property |
| DELETE | `/api/properties/:id` | Delete property permanently |

### Clients (private)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/clients` | Paginated list of active clients |
| GET | `/api/clients/archived` | Paginated list of archived clients |
| GET | `/api/clients/:id` | Client detail |
| POST | `/api/clients` | Create client |
| PUT | `/api/clients/:id` | Edit client |
| PUT | `/api/clients/:id/archive` | Archive client |
| DELETE | `/api/clients/:id` | Delete client permanently |

### Owners (private)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/owners` | Paginated list of active owners |
| GET | `/api/owners/archived` | Paginated list of archived owners |
| GET | `/api/owners/:id` | Owner detail |
| POST | `/api/owners` | Create owner |
| PUT | `/api/owners/:id` | Edit owner |
| PUT | `/api/owners/:id/archive` | Archive owner |
| DELETE | `/api/owners/:id` | Delete owner permanently |

### Public
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/public/properties` | Public listing with filters and pagination |
| GET | `/public/properties/:id` | Public property detail |

### Stats (private)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/stats` | Dashboard counters and breakdowns |

### AI (private)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/generate-description` | Generate property description with Mistral |

### Linked Notes (private)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/linked-notes/client/:id` | Visit notes for a client |
| GET | `/api/linked-notes/property/:id` | Visit notes for a property |
| POST | `/api/linked-notes` | Create visit note |

---

## Agradecimientos

Gracias a **Luis** y a **Ironhack Barcelona** por el bootcamp, el reto y la comunidad.

*Proyecto desarrollado como trabajo final del bootcamp de Web Development en Ironhack Barcelona — 2026*