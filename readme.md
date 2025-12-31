# AI Support Chat Agent

A mini AI-powered customer support chat application that simulates a real e-commerce support agent. Users can chat with an AI assistant, receive contextual answers based on store policies, and continue conversations across sessions.

### (REFER TO https://github.com/SamVerse/ai-chat-frontend)


## Tech Stack

#### Frontend

- Next.js

- Tailwind CSS

#### Backend
-  Node.js

- Express

- TypeScript


#### Data & Infra

- PostgreSQL (Drizzle ORM)

- Redis

- Google Gemini (LLM)

#### Deployment

- Backend: Render

- Frontend: Vercel


## Features

- Simple live chat interface

- Persistent conversations across page reloads

- Context-aware AI responses using conversation history

- FAQ/domain knowledge embedded in prompts

- Redis caching for recent messages

- Graceful handling of API, network, and LLM failures

## Architecture Overview

- Routes / Controllers handle HTTP requests and responses

- Services encapsulate business logic (conversation and message handling)

- Database Layer uses PostgreSQL via Drizzle ORM

- Cache Layer uses Redis to cache recent conversation messages

- LLM Layer integrates Gemini via a dedicated service wrapper

PostgreSQL is the source of truth. Redis is used only as a read-through cache and does not affect correctness.


## API Routes

****POST /chat/message****


Sends a user message to the backend and returns the AI agent’s reply.

***Request Body***

```
{
  "message": "string",
  "sessionId": "string (optional)"
}
```


***Response***

```
{
  "reply": "string",
  "sessionId": "string"
}
```

- Creates a new conversation if sessionId is not provided

- Persists both user and AI messages

- Uses recent conversation history for context



****GET /chat/history/:conversationId****


Fetches the message history for an existing conversation.

***Response***
```
[
  {
    "sender": "user | ai",
    "text": "string",
    "createdAt": "timestamp"
  }
]
```


- Used to restore chat history on page reload

- Results are cached in Redis for faster reads


## Data Model

### conversations

- id

- created_at

### messages

- id

- conversation_id

- sender (user | ai)

- text

- created_at

## LLM Integration

- Provider: Google Gemini

- Integrated via a single service wrapper

- Prompt includes store policies and recent conversation history

- Conversation history is capped to control token usage

- On LLM failures, a safe fallback response is returned

## Local Setup

### Prerequisites

- Node.js

- PostgreSQL

- Docker (for running Redis locally)

### Backend

1. Install dependencies:

    ```
    npm install
    ```

2. Create a PostgreSQL database named:

    ```
    ai_chat
    ```


3. Create a .env file in the backend root:

    ```
    DATABASE_URL=postgres://<username>:<password>@localhost:5432/ai_chat
    REDIS_URL=redis://localhost:6379
    GEMINI_API_KEY=your_gemini_api_key
    ```
    

4. Make sure Docker is running, then start Redis locally:

    ```
    docker run -d -p 6379:6379 redis
    ```


5. Run database migrations:

    ```
    npx drizzle-kit migrate
    ```


6. Start the backend server:

    ```
    npm run dev
    ```


The backend runs on http://localhost:4000.

### Frontend

1. Install dependencies:
    ```
    npm install
    ```

2. Create .env.local:

    ```
    NEXT_PUBLIC_API_BASE_URL=http://localhost:4000
    ```


3. Start the frontend:

    ```
    npm run dev
    ```

The frontend runs on http://localhost:3000.


## Deployment Notes

- Backend is deployed on Render with PostgreSQL and Redis provisioned via Render.

- Frontend is deployed on Vercel.

- The backend listens on the port provided by the hosting platform.

- Database migrations are applied manually to the production database.

On the Render free tier the backend may take some time to spin up.

## Trade-offs and Future Improvements

Although this implementation meets the basic requirements but still has some limitations and some things that can be improved like :-

- Simple prompt-based knowledge instead of retrieval from a vector DB (RAG approach)

- No authentication or user accounts 

- Limited LLM context window management

- No rate limiting or abuse prevention

#### Future improvements could include:
- Integrating a vector database for better knowledge retrieval

- Adding user authentication and profiles

- Better prompt engineering and context management

- Implementing rate limiting and security measures
