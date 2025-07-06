# 📊 Berkshire RAG Agent

A Retrieval-Augmented Generation (RAG) AI agent built with [Mastra](https://docs.mastra.ai), designed to analyze and answer questions from Berkshire Hathaway's shareholder letters using OpenAI's GPT models.

---

## 🚀 Features

- 🔍 **Semantic Search with PgVector**  
  Find relevant context from indexed shareholder letters using vector embeddings.

- 🧠 **GPT-4o Language Model Integration**  
  Uses OpenAI's GPT-4o for accurate and context-rich financial Q&A.

- 🗂️ **PDF Parsing & Chunking**  
  Automatically parses, chunks, and embeds shareholder letter PDFs.

- 💬 **Agent with Memory & RAG Tool**  
  Remembers previous messages and uses retrieved content from vector DB.

- 🔒 **Environment-Based Configuration**  
  All sensitive keys and DB URLs are stored securely via `.env`.

---

## 🏗️ Tech Stack

| Tool/Library      | Purpose                               |
|-------------------|----------------------------------------|
| **Mastra**        | AI agent framework                    |
| **OpenAI GPT-4o** | Language generation engine            |
| **PgVector + Postgres** | Vector similarity search         |
| **TypeScript**    | Type-safe backend logic               |
| **dotenv**        | Secure environment variable handling  |

---

## 📂 Project Structure

berkshire-rag/
├── scripts/
│ └── processDocs.ts # PDF load, chunk, embed & store
├── src/
│ └── agent.ts # Main AI agent definition
├── documents/ # Folder for Berkshire PDF letters
├── .env # Contains API key and DB URL (not committed)
├── .gitignore # Excludes node_modules, .env, etc.
├── package.json
└── README.md


---

## ⚙️ Setup Instructions

### 1. Clone the Repo

```bash
git clone https://github.com/sanapsagar2002/berkshire-rag.git
cd berkshire-rag

## 🛠️ Getting Started

---

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/sanapsagar2002/berkshire-rag.git
cd berkshire-rag


### 2. Install Dependencies
bash
npm install

### 3. Configure Environment Variables
Create a .env file in the root with:

OPENAI_API_KEY=sk-...your_openai_key...
DATABASE_URL=postgresql://postgres:yourpassword@localhost:5432/berkshire_rag_db

---

## 📥 Ingest PDFs into Vector DB
Put your shareholder letters in the documents/ folder (as .pdf).

Then run:

npx tsx scripts/processDocs.ts
This will:

Parse the PDFs
Chunk them
Embed with OpenAI
Store in PostgreSQL via PgVector

## 🤖 Run the Agent

import { berkshireAgent } from "./src/agent";

berkshireAgent.respond("What was Warren Buffett’s view in 2008?").then(console.log);

### 📌 Example Use Case

User: What was Berkshire’s cash position in 2020?

Agent:
"In 2020, we maintained a cash balance exceeding $130 billion..."
(Source: 2020 Shareholder Letter)

## 📚 Resources
Mastra Documentation

OpenAI GPT API

PgVector Extension

## 🛡️ License
MIT License © 2025 Sagar Sanap

