# Room Expense Management App

A complete MERN web application to manage shared room expenses for two roommates: Ganesh and Aditya.

## Tech Stack

- Frontend: React (hooks + functional components), Tailwind CSS, Axios, React Router
- Backend: Node.js, Express, MongoDB, Mongoose
- Authentication: Session-based simple login (select user)

## Features

- Pre-seeded users: Ganesh and Aditya
- Login by selecting a user (no signup)
- Add expense with title, amount, paid by, split type, and date
- Equal split calculation between roommates
- Dashboard analytics:
  - Total expenses
  - Total spent by Ganesh
  - Total spent by Aditya
  - Final settlement (who owes whom)
  - Monthly summary chart
- Expense list page with filters:
  - By user
  - By date
- Delete expense

## Project Structure

```text
.
├── backend
│   ├── .env.example
│   ├── package.json
│   └── src
│       ├── app.js
│       ├── server.js
│       ├── config
│       │   └── db.js
│       ├── controllers
│       │   ├── authController.js
│       │   ├── expenseController.js
│       │   ├── summaryController.js
│       │   └── userController.js
│       ├── models
│       │   ├── Expense.js
│       │   └── User.js
│       ├── routes
│       │   ├── authRoutes.js
│       │   ├── expenseRoutes.js
│       │   ├── summaryRoutes.js
│       │   └── userRoutes.js
│       ├── scripts
│       │   └── seedUsers.js
│       └── services
│           └── summaryService.js
├── frontend
│   ├── .env.example
│   ├── package.json
│   ├── vite.config.js
│   └── src
│       ├── App.jsx
│       ├── index.css
│       ├── main.jsx
│       ├── components
│       │   ├── AppLayout.jsx
│       │   ├── BalanceBanner.jsx
│       │   ├── ExpenseTable.jsx
│       │   ├── MonthlyChart.jsx
│       │   └── StatCard.jsx
│       ├── context
│       │   └── AuthContext.jsx
│       ├── pages
│       │   ├── AddExpensePage.jsx
│       │   ├── DashboardPage.jsx
│       │   ├── ExpenseListPage.jsx
│       │   ├── LoginPage.jsx
│       │   └── NotFoundPage.jsx
│       ├── services
│       │   └── api.js
│       └── utils
│           └── formatters.js
├── .gitignore
└── README.md
```

## API Endpoints

### Users

- `GET /users`

### Auth

- `POST /auth/login`
- `POST /auth/logout`
- `GET /auth/me`

### Expenses

- `POST /expenses`
- `GET /expenses`
- `DELETE /expenses/:id`

Filters on `GET /expenses`:

- `paidBy=<userId>`
- `date=YYYY-MM-DD`
- `dateFrom=YYYY-MM-DD`
- `dateTo=YYYY-MM-DD`

### Analytics

- `GET /summary`

## Database Schema

### User

- `name`

### Expense

- `title`
- `amount`
- `paidBy` (User reference)
- `splitBetween` (array of User references)
- `splitType` (equal)
- `date`

## Setup Instructions

1. Clone the repository and move into the project directory.
2. Configure backend environment:

	```bash
	cd backend
	cp .env.example .env
	```

3. Configure frontend environment:

	```bash
	cd ../frontend
	cp .env.example .env
	```

4. Start MongoDB locally and make sure this connection URL is reachable:

	```text
	mongodb://127.0.0.1:27017/room_expense_db
	```

5. Seed users (Ganesh, Aditya):

	```bash
	cd ../backend
	npm run seed
	```

6. Run backend:

	```bash
	npm run dev
	```

7. Run frontend in a new terminal:

	```bash
	cd ../frontend
	npm run dev
	```

8. Open frontend:

	```text
	http://localhost:5173
	```

## Balance Logic

The app computes settlement based on net contribution:

- `netBalance = paid - shouldPay`
- Positive `netBalance` means user should receive money
- Negative `netBalance` means user owes money

Example:

- Ganesh paid 1000
- Aditya paid 500
- Total = 1500, each share = 750
- Ganesh net = +250, Aditya net = -250
- Final: Aditya owes Ganesh 250
