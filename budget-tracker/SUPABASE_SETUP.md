# Budget Tracker - Supabase Setup Guide

## 📋 Table of Contents
1. [Supabase Table Schema](#supabase-table-schema)
2. [Environment Setup](#environment-setup)
3. [Testing the Integration](#testing-the-integration)
4. [Features](#features)

---

## 🗄️ Supabase Table Schema

### Table Name: `budget_entries`

Create this table in your Supabase dashboard with the following columns:

| Column Name | Data Type | Constraints | Default | Description |
|-------------|-----------|-------------|---------|-------------|
| `id` | `uuid` | Primary Key | `gen_random_uuid()` | Unique identifier |
| `type` | `text` | NOT NULL, CHECK | - | Either 'income' or 'expense' |
| `amount` | `numeric` | NOT NULL, CHECK | - | Transaction amount (must be > 0) |
| `description` | `text` | NOT NULL | - | Description of the transaction |
| `category` | `text` | NOT NULL | - | Category (e.g., Salary, Food, etc.) |
| `date_created` | `timestamptz` | NOT NULL | `now()` | Timestamp when entry was created |

### SQL Script to Create Table

Run this SQL in your Supabase SQL Editor:

```sql
-- Create the budget_entries table
CREATE TABLE budget_entries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  type text NOT NULL CHECK (type IN ('income', 'expense')),
  amount numeric NOT NULL CHECK (amount > 0),
  description text NOT NULL,
  category text NOT NULL,
  date_created timestamptz NOT NULL DEFAULT now()
);

-- Enable Row Level Security (RLS)
ALTER TABLE budget_entries ENABLE ROW LEVEL SECURITY;

-- Create a policy to allow all operations (for development)
-- NOTE: In production, you should restrict this based on user authentication
CREATE POLICY "Enable all access for budget_entries" ON budget_entries
  FOR ALL USING (true);

-- Optional: Create an index on date_created for faster queries
CREATE INDEX idx_budget_entries_date_created ON budget_entries(date_created DESC);

-- Optional: Create an index on type for faster filtering
CREATE INDEX idx_budget_entries_type ON budget_entries(type);
```

### Sample Data (Optional)

If you want to insert some test data:

```sql
INSERT INTO budget_entries (type, amount, description, category) VALUES
  ('income', 5000, 'Monthly Salary', 'Salary'),
  ('income', 500, 'Freelance Project', 'Freelance'),
  ('expense', 1200, 'Rent Payment', 'Housing'),
  ('expense', 350, 'Groceries', 'Food'),
  ('expense', 80, 'Internet Bill', 'Utilities'),
  ('expense', 150, 'Coffee and Snacks', 'Food');
```

---

## ⚙️ Environment Setup

### Step 1: Get Your Supabase Credentials

1. Go to your Supabase project dashboard
2. Click on **Settings** (gear icon in the sidebar)
3. Click on **API** in the settings menu
4. Copy the following values:
   - **Project URL** (under "Project URL")
   - **anon/public key** (under "Project API keys")

### Step 2: Create Environment File

1. In your project root, create a file named `.env`
2. Add your Supabase credentials:

```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

**Important:** Replace the placeholder values with your actual Supabase credentials!

### Step 3: Add .env to .gitignore

Make sure your `.env` file is in `.gitignore` to keep your credentials secure:

```
# .gitignore
.env
```

---

## 🧪 Testing the Integration

### 1. Start the Development Server

```bash
npm run dev
```

### 2. Test the Features

1. **View Entries**: Navigate to the home page to see all entries
2. **Filter by Type**: Click "Income" or "Expenses" to filter
3. **Add Entry**: Click "Add Entry" and submit the form
4. **Check Supabase**: Verify the data appears in your Supabase table

### 3. Troubleshooting

If you see a warning message:
- ✅ **Check your `.env` file** - Make sure it exists and has the correct values
- ✅ **Restart the dev server** - After creating `.env`, restart with `npm run dev`
- ✅ **Check Supabase RLS policies** - Make sure the policy allows access
- ✅ **Check browser console** - Look for any error messages

---

## ✨ Features Implemented

### Backend Integration
- ✅ **Supabase Client** - Configured in `src/supabaseClient.js`
- ✅ **Budget Service** - All CRUD operations in `src/services/budgetService.js`
- ✅ **Async Data Fetching** - Loads entries from Supabase on app start
- ✅ **Real-time Updates** - Refreshes data after adding entries
- ✅ **Error Handling** - Graceful fallback with sample data
- ✅ **Loading States** - Shows spinners during data operations

### Service Functions Available

```javascript
import { 
  getAllEntries,      // Fetch all entries
  getIncomeEntries,   // Fetch only income
  getExpenseEntries,  // Fetch only expenses
  addEntry,           // Add new entry
  deleteEntry,        // Delete entry by ID
  updateEntry,        // Update entry by ID
  getSummary          // Get income/expense summary
} from './services/budgetService';
```

### Database Operations
- ✅ **CREATE** - Add new income/expense entries
- ✅ **READ** - Fetch all entries, filter by type
- ✅ **UPDATE** - Update existing entries (service ready)
- ✅ **DELETE** - Delete entries (service ready)

---

## 🚀 Next Steps

### Recommended Enhancements

1. **Add Delete Functionality** - Add delete buttons to entries
2. **Add Edit Functionality** - Allow editing existing entries
3. **User Authentication** - Add Supabase Auth for multi-user support
4. **Real-time Subscriptions** - Use Supabase real-time to auto-update
5. **Date Filtering** - Filter entries by date range
6. **Export Data** - Export to CSV or PDF
7. **Charts & Analytics** - Add visual charts for spending patterns

### Security Improvements

For production, update your RLS policy to restrict access:

```sql
-- Remove the permissive policy
DROP POLICY "Enable all access for budget_entries" ON budget_entries;

-- Add user-specific policies (requires authentication)
CREATE POLICY "Users can view their own entries" ON budget_entries
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own entries" ON budget_entries
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own entries" ON budget_entries
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own entries" ON budget_entries
  FOR DELETE USING (auth.uid() = user_id);
```

---

## 📝 Notes

- The app will show sample data if Supabase connection fails
- All database operations include error handling
- The `date_created` field is automatically set by Supabase
- Amounts are stored as `numeric` for precision with financial data

---

**Happy budgeting! 💰**
