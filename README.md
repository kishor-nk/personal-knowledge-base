# 🧠 Knowledge Vault

> Your personal knowledge space for storing, organizing, searching, and managing notes, links, and documents.

**Knowledge Vault** is a full-stack Personal Knowledge Base application built for the **BSVS Career Launch Internship – Full Stack Level 3, Project 4**.

The application provides authenticated users with a centralized space to create, store, search, filter, organize, edit, and securely access their personal knowledge.

---

## 📌 Project Overview

Knowledge Vault is designed as a personal repository for different types of knowledge.

Users can store:

- 📝 Notes
- 🔗 Links
- 📄 Documents
- 🏷️ Tags
- 📂 Categories

The application provides tools for searching, filtering, sorting, editing, deleting, and organizing stored knowledge through a responsive web interface.

---

## ✨ Features

### 🔐 Authentication

- User registration
- User login
- JWT-based authentication
- Password hashing using `bcryptjs`
- Protected API routes
- Authentication state persistence
- Automatic session validation
- Logout functionality
- User ownership validation
- Protected user-specific data

---

### 📝 Knowledge Management

Knowledge Vault supports three main knowledge types.

#### 📝 Notes

Users can create notes for:

- Ideas
- Explanations
- Learning material
- Personal notes
- Important information
- General knowledge

Each note can contain:

- Title
- Content
- Category
- Tags

---

#### 🔗 Links

Users can save useful web resources.

Each link can contain:

- Title
- URL
- Category
- Tags

Links can be edited, viewed, searched, filtered, and deleted.

---

#### 📄 Documents

Users can upload and manage documents.

Each document can contain:

- Title
- File
- Description
- Category
- Tags

Users can:

- Upload documents
- View documents
- Replace existing documents
- Edit document information
- Delete documents

---

## 🔎 Search

Knowledge Vault provides database-level search functionality.

Search can find information across:

- Item titles
- Item content
- Categories
- Tags

The search functionality works together with the active filters.

### Search features

- Live search
- Search result count
- Clear search button
- `Esc` shortcut for clearing search
- Search across multiple knowledge fields

---

## 🎛️ Filtering

Knowledge can be filtered by:

- 📌 Type
- 📂 Category
- 🏷️ Tag

Filters can be combined with search.

Users can also clear all active filters at once.

The application displays the number of active filters and matching results.

---

## ↕️ Sorting

Knowledge items can be sorted using:

- 🆕 Newest
- 🕐 Oldest
- 🔤 A–Z
- 🔤 Z–A

Sorting works together with:

- Search
- Type filtering
- Category filtering
- Tag filtering

Creation dates are displayed on knowledge cards.

---

## 🖥️ Grid & List Views

Knowledge Vault supports two display modes.

### ▦ Grid View

Displays knowledge items as individual cards for visual browsing.

### ☰ List View

Displays knowledge items in a compact list layout for faster scanning.

The selected view works with search, filters, and sorting.

---

# 🏷️ Categories

The **Organize** page provides category management.

Users can:

- Create categories
- View categories
- View the number of items in each category
- Delete categories
- Click a category to filter the vault

### Category features

- Default `General` category
- Duplicate category protection
- Case-insensitive duplicate detection
- Category item counts
- Category-based filtering
- Responsive category management interface

Category names can also be selected as suggestions while creating or editing knowledge.

---

# 🏷️ Tags

Tags provide flexible organization of knowledge.

Users can:

- Add multiple tags
- Search/filter by tags
- View existing tags
- Quickly add existing tags
- Avoid duplicate tags

Multiple tags can be entered using commas.

Example:

```text
react, frontend, javascript, performance
```

---

# 💡 Category & Tag Suggestions

The Add/Edit Knowledge form provides suggestions based on existing knowledge stored in the vault.

## Category Suggestions

Users can:

- Select an existing category
- Type a new category
- Create categories without leaving the form

Existing categories are presented through an autocomplete-style suggestion list.

---

## Tag Suggestions

Users can:

- Enter tags manually
- Select existing tags
- Quickly add tags using suggestion buttons
- Add multiple tags
- Avoid duplicate tags

Selected tags are visually indicated.

---

# 📄 Document Upload

Knowledge Vault supports document uploads using **Multer**.

## Upload protections

- Maximum file size: **10 MB**
- File type allowlist
- Invalid file types are rejected
- Oversized files are rejected

---

## 🔄 Document Replacement

When editing a document:

1. A new document can be selected.
2. The database record is updated first.
3. The previous file is removed after a successful update.
4. If no replacement file is selected, the existing document remains unchanged.

This prevents the existing document from being lost when an edit does not include a replacement.

---

## 🗑️ Document Cleanup

When a document knowledge item is deleted:

- The database record is deleted.
- The corresponding physical upload is also removed.

This prevents unnecessary files from remaining in the upload directory.

---

# 🔒 Document Security

Uploaded documents are protected and are not exposed through a public static directory.

Access requires:

- Authentication
- A valid JWT
- Ownership verification

Users cannot directly access another user's protected documents.

The backend also validates ownership when accessing individual knowledge items.

---

# 📊 Dashboard

The dashboard provides an overview of the user's knowledge collection.

It includes:

- Knowledge statistics
- Search
- Filters
- Sorting
- Grid/List views
- Add Knowledge
- Organize
- Logout

The dashboard also provides loading and empty states to make the application easier to use.

---

# 🗂️ Organize Page

The Organize page provides a dedicated place for managing the knowledge structure.

It contains:

### Categories

- Category list
- Item counts
- Category creation
- Category deletion
- Category filtering

### Tags

- Existing tag list
- Tag-based filtering
- Quick access to tagged knowledge

The interface includes custom confirmation behavior for destructive category actions.

---

# ✏️ Add & Edit Knowledge

The Add/Edit Knowledge form provides a structured experience for creating and updating knowledge.

## Form fields

Depending on the selected type, users can provide:

- Title
- Type
- Category
- Tags
- Note content
- Document description
- Link URL
- Document file

---

## 📝 Type-specific behavior

### Note

Displays a note content field.

### Link

Displays a URL field.

### Document

Displays:

- Document description
- File upload control

The form adapts automatically when the knowledge type changes.

---

# 🧭 Navigation

The application provides navigation between:

- Knowledge Vault
- Add Knowledge
- Edit Knowledge
- Organize
- Login
- Register

Authenticated routes are protected from unauthenticated access.

---

# 🎨 User Interface

Knowledge Vault uses a modern dark-themed interface.

## UI features

- Modern dark theme
- Responsive design
- Mobile-friendly layouts
- Interactive cards
- Polished buttons
- Loading states
- Empty states
- Error states
- Custom delete confirmation
- Responsive forms
- Accessible labels
- Keyboard-friendly controls
- Visible focus states
- Hover interactions
- Reduced-motion support
- Mobile responsive breakpoints

---

# 📱 Responsive Design

The application is designed to work across different screen sizes.

Responsive behavior includes:

- Mobile-friendly navigation
- Responsive forms
- Responsive item cards
- Responsive grid layouts
- Mobile-friendly category management
- Flexible buttons and controls
- Responsive search and filtering controls

---

# 🛡️ Security

The application includes several security measures.

### Authentication

- JWT authentication
- Password hashing
- Protected routes
- Session validation

### Authorization

- User ownership checks
- Protected individual item access
- Protected document access
- Cross-user access prevention

### File Upload Security

- File type allowlist
- Maximum 10 MB file size
- Rejection of unsupported files
- Protected uploaded documents

### Configuration Security

Sensitive configuration is stored using environment variables.

The actual `.env` file is excluded from Git.

---

# 🛠️ Technology Stack

## Frontend

- **React.js**
- **React Router**
- **Vite**
- **Axios**
- **CSS**

## Backend

- **Node.js**
- **Express.js**
- **JWT**
- **bcryptjs**
- **Multer**
- **mysql2**

## Database

- **MariaDB / MySQL**

## Development Tools

- **XAMPP**
- **Git**
- **GitHub**

---

# ⚠️ Database Note

The official BSVS Project 4 technology stack specifies **MongoDB**.

During development, the project was implemented using **MariaDB/MySQL** as the database layer.

The application functionality required by the project has been implemented using the SQL database.

The project does not modify or depend on unrelated databases.

---

# 📁 Project Structure

```text
personal-knowledge-base/
│
├── backend/
│   │
│   ├── config/
│   │   └── db.js
│   │
│   ├── middleware/
│   │   ├── authMiddleware.js
│   │   └── upload.js
│   │
│   ├── models/
│   │   ├── Category.js
│   │   ├── Item.js
│   │   └── User.js
│   │
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── categoryRoutes.js
│   │   └── itemRoutes.js
│   │
│   ├── uploads/
│   │
│   ├── .env
│   ├── .env.example
│   ├── package.json
│   └── server.js
│
├── frontend/
│   │
│   ├── src/
│   │   ├── context/
│   │   │   └── AuthContext.jsx
│   │   │
│   │   ├── App.jsx
│   │   ├── api.js
│   │   ├── main.jsx
│   │   └── styles.css
│   │
│   ├── package.json
│   └── vite.config.js
│
├── .gitignore
└── README.md
```

---

# ⚙️ Requirements

Install the following before running the project:

- **Node.js**
- **npm**
- **XAMPP**
- **MariaDB / MySQL**
- **Git**

---

# 🗄️ Database Setup

Start the MySQL/MariaDB service using XAMPP.

Create the project database:

```sql
CREATE DATABASE knowledge_base;
```

The application uses environment variables for database configuration.

Example:

```env
PORT=5000

DB_HOST=localhost
DB_PORT=3307
DB_USER=root
DB_PASSWORD=
DB_NAME=knowledge_base

JWT_SECRET=your_secret_key
```

> Replace `your_secret_key` with a secure secret when configuring the application.

> Do not commit the real `.env` file to GitHub.

---

# 🚀 Installation

## 1. Clone the repository

```bash
git clone https://github.com/kishor-nk/personal-knowledge-base.git
```

## 2. Enter the project directory

```bash
cd personal-knowledge-base
```

---

# 📦 Backend Setup

Enter the backend directory:

```bash
cd backend
```

Install dependencies:

```bash
npm install
```

Configure your local `.env` file using `.env.example` as a reference.

Start the backend:

```bash
npm run dev
```

The backend runs on:

```text
http://localhost:5000
```

---

# 💻 Frontend Setup

Open another terminal.

From the project root:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Start the frontend development server:

```bash
npm run dev
```

The frontend runs on:

```text
http://localhost:5173
```

Open the displayed frontend URL in your browser.

---

# 🔑 Authentication Flow

```text
User
  │
  ▼
Register / Login
  │
  ▼
Backend validates credentials
  │
  ▼
JWT generated
  │
  ▼
Frontend stores authentication session
  │
  ▼
Protected API requests include JWT
  │
  ▼
Backend validates JWT
  │
  ▼
Ownership is verified
  │
  ▼
User accesses personal knowledge
```

Passwords are hashed before being stored.

---

# 🔄 Knowledge Management Flow

```text
Create Knowledge
       │
       ▼
   Select Type
       │
 ┌─────┼──────────┐
 ▼     ▼          ▼
Note  Link    Document
 │     │          │
 └─────┼──────────┘
       ▼
Category + Tags
       │
       ▼
Save Knowledge
       │
       ▼
 Knowledge Vault
       │
 ┌─────┼──────────────┐
 ▼     ▼              ▼
Search Filter        Sort
 │     │              │
 └─────┼──────────────┘
       ▼
View / Edit / Delete
```

---

# 🔌 API Overview

## Authentication

```text
POST /api/auth/register
POST /api/auth/login
GET  /api/auth/me
```

---

## Knowledge Items

```text
GET    /api/items
GET    /api/items/:id
POST   /api/items
PUT    /api/items/:id
DELETE /api/items/:id
```

---

## Categories

```text
GET    /api/categories
POST   /api/categories
DELETE /api/categories/:id
```

---

# 🧪 Testing

The application was tested across the major application workflows.

## Authentication Testing

- User registration
- User login
- Invalid authentication
- Protected routes
- Session restoration
- Logout
- Unauthorized API requests

---

## Knowledge Testing

- Create note
- Create link
- Upload document
- View knowledge
- Edit knowledge
- Delete knowledge
- Replace documents
- Preserve documents when no replacement is selected

---

## Search & Filtering Testing

- Title search
- Content search
- Category search
- Tag search
- Type filtering
- Category filtering
- Tag filtering
- Combined filtering
- Clear filters

---

## Organization Testing

- Create category
- Delete category
- Category item counts
- Category filtering
- Tag filtering
- Existing category suggestions
- Existing tag suggestions
- Duplicate tag protection

---

## File Upload Testing

- Valid file upload
- Unsupported file rejection
- Files larger than 10 MB rejected
- Document replacement
- Document preservation
- Document cleanup after deletion

---

## Security Testing

- Unauthorized access rejection
- Cross-user item access prevention
- Protected document access
- Query-token document access
- Ownership verification
- Invalid upload rejection
- File size restriction

---

# 🏗️ Production Build

To create a production build:

```bash
cd frontend
npm run build
```

The production build is generated in:

```text
frontend/dist/
```

The production build has been successfully verified using Vite.

---

# 🔐 Git & Environment Safety

The repository uses `.gitignore` to prevent sensitive or generated files from being committed.

Ignored files include:

```text
node_modules/
.env
.env.local
*.env
backend/uploads/
frontend/dist/
.vite/
logs
```

Sensitive database credentials and JWT secrets should remain in the local `.env` file.

---

# 🌐 GitHub Repository

The source code is available on GitHub:

**Repository:**

https://github.com/kishor-nk/personal-knowledge-base

---

# 🎓 BSVS Internship Project

**Program:** BSVS Career Launch Internship

**Track:** Full Stack – Level 3

**Project:** Project 4 – Personal Knowledge Base

The assigned project requires a full-stack repository for:

- Notes
- Documents
- Links
- Tags
- Categories
- Search
- Filtering
- Editing
- Organization

Knowledge Vault implements these core requirements along with:

- Authentication
- File upload
- File security
- Sorting
- Grid/List views
- Category management
- Tag suggestions
- Responsive UI
- Additional security and usability improvements

---

# 📋 Requirement Checklist

| Requirement | Implementation |
|---|---|
| Full-stack application | ✅ |
| Notes | ✅ |
| Documents | ✅ |
| Links | ✅ |
| Tags | ✅ |
| Categories | ✅ |
| Search | ✅ |
| Filtering | ✅ |
| Editing | ✅ |
| Organization | ✅ |
| Authentication | ✅ |
| File Upload | ✅ |
| Responsive UI | ✅ |
| Document Security | ✅ |

---

# 🚀 Future Improvements

The current implementation satisfies the core project requirements.

Possible future enhancements include:

- ⭐ Favorite/pinned knowledge
- 📌 Custom collections
- 🔗 Related knowledge items
- 📤 Knowledge export/import
- ☁️ Cloud document storage
- 🔍 Advanced search operators
- 📊 Additional analytics
- 🌐 Deployment to a production hosting platform

These are optional enhancements and are not required for the current internship project.

---

# 👨‍💻 Author

## Kishor N K

GitHub:

https://github.com/kishor-nk

---

# 📄 License

This project was created for educational and internship purposes.

---

## ⭐ Acknowledgement

**Knowledge Vault — your personal knowledge space. 🧠🚀**