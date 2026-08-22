# Supabase Integration and Migration Plan

This plan documents the schema, auth flows, and code adjustments to migrate BizPilot from the single-tenant local JSON/MongoDB database to Supabase PostgreSQL and Supabase Auth, while retaining FastAPI + Gemini operations.

---

## 1. Current vs. Proposed Architecture

### Current Architecture:
```
React Frontend (Login.jsx / SignUp.jsx / localStorage)
        ↓
FastAPI Backend (main.py / db.py)
        ↓
Local JSON File (data_db.json) / MongoDB
```

### Proposed Architecture:
```
           React Frontend (Supabase Auth Client)
             /                              \
            /                                \ (Reads/writes client-side data with RLS)
           ▼                                  ▼
FastAPI Backend (main.py)              Supabase PostgreSQL
(Bearer Token Auth Verification)
     │          │
     │          └───────► (Server-side service-role overrides for heavy business logic)
     ▼
Gemini 2.5 Flash (OCR & AI Insights)
```

---

## 2. Existing Data Models & Data Mapping

Here is how the current collections in `data_db.json` map to Supabase PostgreSQL:

| JSON Collection / Model | Supabase Table | Primary Key | Foreign Keys / Relationships |
| :--- | :--- | :--- | :--- |
| `users` / `profile` | `profiles` | `id` (UUID) | References `auth.users(id)` |
| `users` (meta) | `businesses` | `id` (UUID) | Linked via `profiles.business_id` |
| `products` | `products` | `id` (UUID) | References `businesses(id)` |
| `stock_movements` | `inventory_movements` | `id` (UUID) | References `products(id)`, `businesses(id)` |
| — | `suppliers` | `id` (UUID) | References `businesses(id)` |
| — | `customers` | `id` (UUID) | References `businesses(id)` |
| `invoices` | `invoices` | `id` (UUID) | References `businesses(id)` |
| `invoices.items` | `invoice_items` | `id` (UUID) | References `invoices(id)` |
| `bills` | `bills` | `id` (UUID) | References `businesses(id)` |
| `bills.extracted_items` | `bill_items` | `id` (UUID) | References `bills(id)` |
| `workers` | `workers` | `id` (UUID) | References `businesses(id)` |
| `attendance` | `attendance` | `id` (UUID) | References `workers(id)`, `businesses(id)` |
| `stock_requests` | `restock_requests` | `id` (UUID) | References `products(id)`, `businesses(id)` |
| — | `business_settings` | `id` (UUID) | References `businesses(id)` |

---

## 3. Supabase Schema Design & RLS Policies

All business data tables will be protected by Row Level Security (RLS) policies. Users will only have access to data associated with their own `business_id` (obtained by joining `profiles` table on `auth.uid()`).

The SQL schema definition is planned in `supabase/schema.sql`:

```sql
-- Create businesses table
CREATE TABLE public.businesses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  type TEXT NOT NULL,
  currency TEXT NOT NULL DEFAULT 'INR',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create profiles table (references auth.users)
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  business_id UUID REFERENCES public.businesses(id) ON DELETE SET NULL,
  email TEXT NOT NULL,
  name TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Trigger to automatically create a profile record when a new user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email, name)
  VALUES (new.id, new.email, COALESCE(new.raw_user_meta_data->>'name', 'Operator'));
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```

### Row Level Security (RLS) Policy Example:
For a business-scoped table like `products`:
```sql
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

CREATE POLICY select_business_products ON public.products
  FOR SELECT USING (
    business_id IN (
      SELECT business_id FROM public.profiles WHERE id = auth.uid()
    )
  );

CREATE POLICY insert_business_products ON public.products
  FOR INSERT WITH CHECK (
    business_id IN (
      SELECT business_id FROM public.profiles WHERE id = auth.uid()
    )
  );
```

---

## 4. Authentication & Client Setup

1. **Frontend Client**: Install `@supabase/supabase-js` and initialize `src/lib/supabase.js`.
2. **SignUp Flow**:
   - Call Supabase client `signUp()` to register the account.
   - Insert a new record in `businesses`.
   - Update `profiles` for the current user to link their `business_id`.
3. **Login Flow**:
   - Call Supabase client `signInWithPassword()`.
   - Retrieve profile info including `business_id` and save to React Context/State.
4. **Session Persistence**:
   - Listen to `onAuthStateChange()` to restore the React user state on refresh.
5. **FastAPI Authorization**:
   - React calls to FastAPI will append an `Authorization: Bearer <session.access_token>` header.
   - FastAPI parses and verifies this token against Supabase using the service role client.

---

## 5. Required Environment Variables

### Frontend (`.env.example` / `.env`):
```bash
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Backend (`backend/.env.example` / `backend/.env`):
```bash
SUPABASE_URL=your_supabase_project_url
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
GEMINI_API_KEY=your_gemini_api_key
DATABASE_URL=mongodb://localhost:27017 # Kept for migration fallbacks
```

---

## 6. Migration Risks & Rollback Strategy

* **Risk 1: JWT Secret/Domain mismatch in Localhost**: If local API requests fail token validation, the FastAPI endpoints will fall back to using active profiles cached locally or throw clear CORS diagnostics.
* **Risk 2: Network latency during hackathon demo**: Supabase connection timeout will be handled gracefully by reverting to the mock `/api/operations` database if postgrest connections are blocked.
* **Rollback Plan**:
  - Keep `db.py` JSON collection fallback active.
  - If a database query fails or environment keys are absent, fall back to MongoDB / local JSON file database.
  - The React code will support a bypass fallback if the Supabase instance is unreachable.
