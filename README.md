## CRM Setup Guide

### Prerequisites
- Node.js 18+
- A MongoDB connection string

### Environment
Create `.env.local` with:

```
MONGODB_URI=your_connection_string
JWT_SECRET=your_secret
```

See `ENV.EXAMPLE.txt` for a template.

### Install & Run
```
npm install
npm run dev
```

Open http://localhost:3000.

### APIs
- `GET/POST /api/customers`, `GET/PUT/DELETE /api/customers/[id]`
- `GET/POST /api/products`, `GET/PUT/DELETE /api/products/[id]`
- `GET/POST /api/opportunities`, `GET/PUT/DELETE /api/opportunities/[id]`
- `GET/POST /api/activities`, `GET/PUT/DELETE /api/activities/[id]`
- `GET /api/orders` (pagination, populate), `POST/PUT/DELETE /api/orders`
- `GET /api/dashboard` (KPIs)

Protected routes use JWT in `Authorization: Bearer <token>` and role checks via `withRole`.

### Testing
```
npm test
```

