# Personal Knowledge Base

A full-stack knowledge management application built for the BSVS Full Stack Level 3 Project 4.

## Stack
- React.js
- Node.js
- Express.js
- MongoDB
- Authentication with JWT
- File Upload with Multer

## Features
- User registration and login
- Create, edit and delete notes
- Save useful links
- Upload documents
- Tags and categories
- Search and filtering
- Personal user-specific data

## Run locally

### Backend
```bash
cd backend
npm install
copy .env.example .env
npm run dev
```

Set `MONGO_URI` and `JWT_SECRET` in `.env`.

### Frontend
Open another terminal:
```bash
cd frontend
npm install
npm run dev
```

Open the Vite URL shown in the terminal.
