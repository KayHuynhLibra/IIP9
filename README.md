# Budget Tracking Application (IP9)

A full-stack web application for tracking personal budgets and transactions, built with React, Node.js, and MongoDB.

## Project Structure

```
IP9/
├── Frontend/           # React frontend application
├── Backend/           # Node.js/Express backend server
├── scripts/           # Utility scripts for data seeding
├── Documents/         # Project documentation
└── docker-compose.yml # Docker configuration
```

## Features

- User authentication (login/register)
- Transaction management (add, delete, view)
- Budget tracking and management
- Category-based expense tracking
- Visual statistics and charts
- Responsive design

## Tech Stack

### Frontend
- React.js
- Tailwind CSS
- Chart.js for visualizations
- Axios for API calls

### Backend
- Node.js
- Express.js
- MongoDB
- JWT for authentication
- Mongoose for database operations

## Setup Instructions

1. Clone the repository
2. Install dependencies:
   ```bash
   # Install backend dependencies
   cd Backend
   npm install

   # Install frontend dependencies
   cd ../Frontend
   npm install
   ```

3. Set up environment variables:
   - Create `.env` files in both Frontend and Backend directories
   - Copy from `.env.example` files

4. Start MongoDB:
   ```bash
   # Using Docker
   docker-compose up -d
   ```

5. Run the application:
   ```bash
   # Start backend (from Backend directory)
   npm run dev

   # Start frontend (from Frontend directory)
   npm run dev
   ```

## API Endpoints

### Authentication
- POST /api/auth/register - Register new user
- POST /api/auth/login - User login

### Transactions
- GET /api/transactions - Get all transactions
- POST /api/transactions - Add new transaction
- DELETE /api/transactions/:id - Delete transaction

### Budgets
- GET /api/budgets - Get all budgets
- POST /api/budgets - Add new budget
- PUT /api/budgets/:id - Update budget
- DELETE /api/budgets/:id - Delete budget

## Data Models

### User
- email
- password (hashed)
- name

### Transaction
- amount
- type (income/expense)
- date
- description
- category
- budget (optional)
- user (reference)

### Budget
- category
- amount
- spent
- startDate
- endDate
- user (reference)

## Development Notes

- Use `npm run dev` to start development servers
- Frontend runs on port 3000
- Backend runs on port 5000
- MongoDB runs on port 27017

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request

## License

This project is licensed under the MIT License.
