# Basic Chat App

A simple React-based chat application with a Node.js/Express backend and OpenAI (or other LLM) integration.

## Features
- Modern chat UI with avatars, dark mode, and smooth scrolling
- Only the chat box scrolls, not the whole page
- Easy to swap out the backend LLM model

---

## Getting Started

### 1. Clone the Repository
```bash
git clone https://github.com/Prateek-Shetty/India-Accelerator-OpenXAI-2025.git
cd India-Accelerator-OpenXAI-2025/0001_BASIC-CHAT-APP
```

### 2. Install Dependencies
#### Frontend
```bash
cd frontend
npm install
```
#### Backend
```bash
cd ../backend
npm install
```

### 3. Start the App
#### Backend (default: http://localhost:5000)
```bash
nodemon server.js
```

#### Frontend (default: http://localhost:3000)
```bash
cd ../frontend
npm run dev
```

### Change the LLM Model (Backend)
1. Open `backend/server.js` (or the main backend file).
2. Find the section where the model is called (e.g., OpenAI, Ollama, etc.).
3. Change the model name or endpoint as needed. For example:
   ```js
   // Example for OpenAI
   const MODEL = "gpt-3.5-turbo"; // Change to your desired model
   // Example for Ollama
   const MODEL = "llama2"; // Change to your desired model
   ```
4. Restart the backend server after making changes.


### Change API Endpoint (Frontend)
- By default, the frontend sends messages to `http://localhost:5000/api/chat`.
- To change this, edit the `axios.post` URL in `frontend/src/components/ChatBox.jsx`.


## Screenshots

 # All the Screen Shorts of the project is kept in assets folder of the project root folder (0001_BASIC-CHAT-APP)