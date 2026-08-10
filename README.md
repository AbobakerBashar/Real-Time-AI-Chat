# 🤖 Real-Time AI Chat

A modern **real-time AI chat application** built with **Next.js and TypeScript**, featuring real-time conversations, AI-powered responses, smooth animations, and a responsive user interface.

The application uses **Supabase** for authentication, database, and real-time functionality, **Google Gemini** for AI-powered conversations, **Motion** for animations, and **shadcn/ui** for reusable UI components.

## ✨ Features

- 🤖 **AI-Powered Chat** — Have conversations with an AI assistant powered by Google Gemini.
- ⚡ **Real-Time Messaging** — Messages and chat data update in real time.
- 🔐 **Authentication** — Secure user authentication using Supabase.
- 💬 **Chat Management** — Create and manage multiple conversations.
- 🗂️ **Chat History** — View and access previous conversations.
- 🎨 **Modern UI** — Clean interface built with shadcn/ui.
- ✨ **Smooth Animations** — Interactive animations and transitions using Motion.
- 📱 **Responsive Design** — Works across desktop, tablet, and mobile devices.
- 🌙 **Dark Mode** — Supports light and dark themes.
- 🔄 **Real-Time Synchronization** — Automatically reflects database changes without manually refreshing the page.
- ⚡ **Type Safety** — Developed with TypeScript for a safer and maintainable codebase.
- 🧩 **Reusable Components** — Modular components for scalable development.

## 🛠️ Technologies

- **Next.js** — React framework for the application.
- **TypeScript** — Static typing and type safety.
- **Supabase** — Authentication, database, and real-time functionality.
- **Google Gemini** — AI-powered chat responses.
- **Motion** — Animations and interactive transitions.
- **shadcn/ui** — Reusable and accessible UI components.
- **Tailwind CSS** — Utility-first CSS framework.
- **React** — Component-based UI development.

## 🏗️ Application Architecture

```text
                         ┌──────────────────┐
                         │      User        │
                         └────────┬─────────┘
                                  │
                                  ▼
                         ┌──────────────────┐
                         │    Next.js UI    │
                         │ TypeScript + UI  │
                         └────────┬─────────┘
                                  │
                    ┌─────────────┴─────────────┐
                    │                           │
                    ▼                           ▼
           ┌─────────────────┐         ┌─────────────────┐
           │    Supabase     │         │  Gemini API     │
           │ Auth + Database │         │   AI Responses  │
           │  + Realtime     │         └─────────────────┘
           └─────────────────┘
                    │
                    ▼
             Real-Time Updates
```

## 🔐 Authentication & Database

Supabase is used to handle:

- User authentication
- User sessions
- Chat data
- Conversation history
- Real-time database updates

## 🤖 AI Integration

The application uses **Google Gemini** to generate AI responses.

The Gemini API key is kept on the server and should never be exposed to the browser.

The server handles AI requests and returns the generated responses to the chat interface.

## ⚡ Real-Time Functionality

Supabase Realtime allows the application to listen for database changes and update the interface automatically.

This provides a responsive chat experience without requiring users to manually refresh the page.

## 🎨 UI & Animations

The interface is built using **shadcn/ui** and **Tailwind CSS**, providing reusable and accessible components.

**Motion** is used for:

- Page transitions
- Chat message animations
- Hover effects
- Component entrance animations
- Interactive UI feedback

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/AbobakerBashar/Real-Time-AI-Chat
cd <project-folder>
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env` file:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

SERVER_ROLE_KEY=your_supabase_service_role_key
GEMINI_API_KEY=your_gemini_api_key
```

### 4. Start the development server

```bash
npm run dev
```

Open the application at:

```text
http://localhost:3000
```

## 🔑 Environment Variables

| Variable                        | Purpose                               | Client/Server   |
| ------------------------------- | ------------------------------------- | --------------- |
| `NEXT_PUBLIC_SUPABASE_URL`      | Supabase project URL                  | Client          |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase public anonymous key         | Client          |
| `SERVER_ROLE_KEY`               | Supabase server-side service role key | **Server only** |
| `GEMINI_API_KEY`                | Google Gemini API key                 | **Server only** |

> ⚠️ **Security:** Never expose `SERVER_ROLE_KEY` or `GEMINI_API_KEY` to the client and never commit them to GitHub. Keep them in environment variables and server-side code.

## 📁 Project Highlights

### Authentication

Users can securely register and sign in using Supabase authentication.

### Chat Dashboard

Authenticated users can access their conversations through a dedicated chat dashboard.

### Real-Time Conversations

Messages and conversation updates are synchronized through Supabase Realtime.

### AI Responses

User prompts are sent to the server, where Gemini generates the AI response.

### Chat History

Conversations are stored and can be accessed again from the user's chat history.

## 🎯 Project Goals

This project demonstrates practical experience with:

- AI-powered web applications
- Real-time applications
- Next.js and TypeScript
- Supabase authentication and database
- Supabase Realtime
- Google Gemini API integration
- Secure server-side API handling
- Modern UI development
- Responsive design
- Animation and interaction design

## 📌 Future Improvements

- Streaming AI responses
- Voice conversations
- File and image uploads
- Message editing and regeneration
- Conversation search
- Chat sharing
- AI model selection
- Usage tracking
- Improved chat organization

## 👨‍💻 Author

**Abobaker Yagoub Bashar**

Web developer focused on building modern, scalable, and user-friendly web applications.
