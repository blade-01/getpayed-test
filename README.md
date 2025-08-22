# React Analytics Dashboard & Reporting Assessment

A dashboard and reporting system built with **React + TypeScript + Vite**, using **TanStack Query** for data fetching, **TanStack Table** for orders, and **Recharts** for data visualization. Filters and pagination are synchronized with the URL so state persists across refreshes and can be shared easily.

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ (tested on Node 20+)
- Yarn package manager

### Install dependencies
```bash
yarn
```

### Run the mock API (json-server)
```bash
yarn json:server
```
_This serves the API at http://localhost:4000 using db.json._

### Run the app
```bash
yarn dev
```
The app runs at http://localhost:5173 by default.

### Run tests
```bash
yarn test
```

## ⚙️ Configuration

Environment variables are defined in .env:

```VITE_APP_API_BASE_URL=xxxxx-xxxx-xxxxx```


## 🏗 Architecture Choices
- Vite + React + TypeScript for fast development and type safety.
- PrimeReact for ready-made UI component.
- TanStack Query to handle server state, caching, and async loading states.
- TanStack Table for sorting, pagination, and column definitions.
- Recharts for charts, with ARIA labels for accessibility.
- json-server simulates the backend; supports filtering with _gte / _lte.
- React Router v6 to handle routing and sync filters with useSearchParams.
- Custom hook (useUrlQuery) keeps filters and pagination in sync with the URL.


## 📊 Features

### Dashboard
- KPI overview cards: Revenue, Orders, Active Customers.
- Line chart of revenue over time.
- Date range picker:
- Presets: 7d, 30d, 90d
- Custom: pick from and to dates.
- Export to CSV and Export to PDF (chart + KPIs).

### Orders
- Paginated, sortable table with columns:
- Date, Order ID, Customer, Amount, Status, Category, Channel.
- Status displayed as badges with color coding.
- Channels displayed with icons (web, mobile, store).
- Supports:
- Pagination
- Sorting
- Filtering by category and date range
- Export filtered data to CSV.

## 📤 Exports
- CSV Export: current filtered rows, ISO-formatted dates, plain numbers for amounts (Excel auto-detects currency).
- PDF Export: snapshot of KPI cards and charts using html-to-image + jsPDF. Styles adjusted to avoid unsupported CSS (e.g., oklch colors).

## 🧪 Testing
- Jest + React Testing Library
- MSW (Mock Service Worker) for mocking API calls.
- Test setup located in tests/setup.ts with mock server in tests/testServer.ts.

## Example tests:
- Dashboard renders KPIs correctly with mock data.
- Orders table handles sorting, pagination, and empty states.


## 🔍 Accessibility
- Charts wrapped in <div role="img" aria-label="...">
- Tooltip and interactive elements labeled for screen readers.
- Table headers focusable and keyboard-operable for sorting.


## 📌 Trade-offs & Future Improvements
- Data source: json-server is limited. A real backend would aggregate KPIs instead of summing in the frontend.
- UI library: Currently basic Tailwind UI and PrimeReact (for dropdown). Could adopt Mantine or shadcn/ui for richer date pickers.
- Performance: Table works fine for demo scale; could add virtualization for 1k+ rows.
- Testing coverage: Basic tests exist, but more complex scenarios (CSV/PDF export) could be covered.
- Timezone handling: Dates currently stored as YYYY-MM-DD strings, no UTC normalization.

### 🐞 Known Limitations
- Date filtering depends on json-server’s _gte / _lte. Behavior may differ by version (tested on json-server@0.17.x).
- Custom date ranges require valid from/to. Empty fields may result in no matches.
- Exported CSV doesn’t apply Excel-native currency formatting (shows plain numbers without currency code).

## 📸 Screenshots
<image src='./src/assets/scr-1.png'/>
<image src='./src/assets/scr-2.png'/>

## 🔗 Loom Link
[Link]('')

## 📂 Deliverables
- ✅ Repo with instructions to run locally (README.md).
- ✅ Mock API with json-server (db.json).
- ✅ Short write-up of architecture, trade-offs, limitations (above).
- ✅ Optional: Screenshots / Loom GIF.# getpayed-test
