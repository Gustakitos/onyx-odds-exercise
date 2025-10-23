# Sports Prediction Platform

[![Node.js](https://img.shields.io/badge/Node.js-22.13.1-green.svg)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue.svg)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-14.x-black.svg)](https://nextjs.org/)
[![Express](https://img.shields.io/badge/Express-4.x-lightgrey.svg)](https://expressjs.com/)

A full-stack sports prediction platform that allows users to view and filter sports matches, teams, and sports data. Built with modern web technologies including Next.js, Express.js, TypeScript, and SQLite.

## 🚀 Features

- **Match Management**: View, filter, and search sports matches
- **Team Information**: Browse teams and their associated matches
- **Sports Categories**: Organize matches by different sports
- **Date Filtering**: Filter matches by date ranges (Today, This Week, This Month)
- **Real-time Data**: Live match status updates
- **Responsive Design**: Mobile-friendly interface
- **RESTful API**: Well-documented backend API
- **Type Safety**: Full TypeScript implementation

## 🛠 Technologies Used

### Frontend

- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS** - Utility-first CSS framework

### Backend

- **Node.js 22.13.1** - JavaScript runtime
- **Express.js** - Web application framework
- **TypeScript** - Type-safe JavaScript
- **SQLite** - Lightweight database
- **Jest** - Testing framework

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js**: Version 22.13.1 (specified in `.nvmrc`)
- **npm**: Version 11.x or higher (comes with Node.js)
- **Git**: For cloning the repository

### Optional but Recommended

- **nvm** (Node Version Manager) - For managing Node.js versions
- **VS Code** - Recommended IDE with TypeScript support

## 🔧 Installation

### 1. Clone the Repository

```bash
git clone <repository-url>
cd sports-prediction
```

### 2. Set Node.js Version (if using nvm)

```bash
nvm use
```

### 3. Install Backend Dependencies

```bash
cd backend
npm install
```

### 4. Install Frontend Dependencies

```bash
cd ../frontend
npm install
```

### 5. Environment Configuration

#### Backend Configuration

Copy the environment template and configure:

```bash
cd backend
cp .env.example .env
```

Edit `.env` with your configuration:

```env
PORT=3001
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
JWT_SECRET=your-super-secret-jwt-key-here
JWT_EXPIRE=7d
# DB_PATH automatically set to ./data/sports_prediction.db
```

#### Frontend Configuration

Copy the environment template and configure:

```bash
cd frontend
cp .env.example .env.local
```

Edit `.env.local` with your configuration:

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:3001
NODE_ENV=development
```

## 🚀 Running the Project

### Development Mode

#### Start Backend Server

```bash
cd backend
npm run dev
```

The backend will start on `http://localhost:3001`

#### Start Frontend Server

```bash
cd frontend
npm run dev
```

The frontend will start on `http://localhost:3000`

### Production Mode

#### Build and Start Backend

```bash
cd backend
npm run build
npm start
```

#### Build and Start Frontend

```bash
cd frontend
npm run build
npm start
```

## 📚 API Documentation

Base URL: `http://localhost:3001/api/v1`

You can import the postman collection `Sports-Prediction-API.postman_collection.json` to your postman app to test the API.

## 🧪 Testing

### Backend Testing

The backend uses Jest for testing with comprehensive test coverage.

#### Run All Tests

```bash
cd backend
npm test
```

#### Run Tests in Watch Mode

```bash
npm run test:watch
```

#### Test Structure

- **Unit Tests**: Located in `tests/unit/`
- **Integration Tests**: Located in `tests/integration/`
- **Test Configuration**: `jest.config.js`

## 🐛 Troubleshooting

### Common Issues

#### Port Already in Use

If you encounter port conflicts:

```bash
# Kill process on port 3001 (backend)
lsof -ti:3001 | xargs kill -9

# Kill process on port 3000 (frontend)
lsof -ti:3000 | xargs kill -9
```

#### Node.js Version Issues

Ensure you're using the correct Node.js version:

```bash
node --version  # Should be 22.13.1
nvm use         # If using nvm
```

#### Database Issues

If you encounter database errors:

1. Check if the `backend/data/` directory exists
2. Ensure proper file permissions
3. Delete and recreate the database if corrupted:
   ```bash
   cd backend
   rm -rf data/
   npm run dev  # Will recreate the database
   ```

#### Environment Variables

Verify your environment files:

- Backend: Check `.env` file exists and has correct values
- Frontend: Check `.env.local` file exists and `NEXT_PUBLIC_API_BASE_URL` is set

#### CORS Issues

If you encounter CORS errors:

1. Verify `FRONTEND_URL` in backend `.env` matches your frontend URL
2. Check that both servers are running
3. Clear browser cache and cookies

#### Browser Developer Tools

- Open Network tab to monitor API requests
- Check Console for JavaScript errors
- Verify API responses in Network tab
