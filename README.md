#Berkshire Hathaway RAG System
This project implements the data ingestion pipeline for a Retrieval-Augmented Generation (RAG) system, designed to make Berkshire Hathaway annual reports searchable and answerable by a Large Language Model (LLM). The goal is to provide accurate and context-aware responses by leveraging the specific knowledge contained within these financial documents.

🌟 Features
PDF Document Parsing: Extracts raw text content from PDF annual reports.

Intelligent Document Chunking: Breaks down large documents into smaller, semantically meaningful segments, optimized for LLM context windows and retrieval accuracy.

Text Embedding: Converts text chunks into high-dimensional numerical vectors (embeddings) using OpenAI's text-embedding-3-small model, capturing their semantic meaning.

Vector Database Storage: Stores these embeddings and their associated metadata (like original filename and text content) in a PostgreSQL database utilizing the pgvector extension for efficient similarity search.

Environment Variable Management: Securely handles API keys and database credentials using .env files.

🚀 Why RAG?
Traditional Large Language Models (LLMs) have knowledge cutoffs and can sometimes "hallucinate" (generate incorrect or made-up information). RAG addresses these limitations by:

Retrieval: Fetching relevant, up-to-date, and factual information from a specific knowledge base (in this case, Berkshire Hathaway annual reports).

Augmentation: Providing this retrieved information as context to the LLM.

Generation: Allowing the LLM to generate more accurate, grounded, and verifiable answers based on the provided context, significantly reducing hallucinations and improving response quality.

This project builds the foundational knowledge base, enabling future query capabilities.

🛠️ Technologies Used
Node.js (runtime environment)

TypeScript (language)

@mastra/rag: For document structuring and advanced chunking.

@mastra/pg: For seamless integration with PostgreSQL and pgvector.

@ai-sdk/openai & ai: For interacting with OpenAI's embedding models.

pdf-parse: For extracting text from PDF documents.

dotenv: For managing environment variables.

tsx: For running TypeScript files directly without a separate compilation step.

PostgreSQL with pgvector extension: The vector database for storing embeddings.

📂 Project Structure
berkshire-rag/
├── documents/                  # Place your Berkshire Hathaway annual report PDFs here
├── scripts/
│   └── processDocs.ts          # Main script for parsing, chunking, embedding, and storing documents
├── .env.example                # Example .env file (DO NOT COMMIT YOUR ACTUAL .env)
├── .gitignore                  # Specifies files/folders to ignore in Git (e.g., node_modules, .env)
├── package.json                # Project dependencies and scripts
├── tsconfig.json               # TypeScript configuration
└── README.md                   # This file

⚙️ Setup
Prerequisites
Before you begin, ensure you have the following installed:

Node.js (v20.9.0 or higher recommended)

npm (Node Package Manager, comes with Node.js)

Git

PostgreSQL Database:

Install PostgreSQL.

Crucially, enable the pgvector extension in your database. You'll typically need to connect to your database and run CREATE EXTENSION vector; once.

OpenAI API Key: Obtain one from the OpenAI Platform.

1. Clone the Repository
git clone https://github.com/your-github-username/berkshire-rag.git
cd berkshire-rag

(Replace https://github.com/your-github-username/berkshire-rag.git with your actual repository URL after you publish it.)

2. Install Dependencies
npm install

3. Configure Environment Variables
Create a file named .env in the root of your project (berkshire-rag/.env). This file will store your sensitive credentials.

# .env file
OPENAI_API_KEY=sk-YOUR_OPENAI_API_KEY_HERE
DATABASE_URL=postgresql://YOUR_USERNAME:YOUR_PASSWORD@localhost:5432/YOUR_DATABASE_NAME

Replace sk-YOUR_OPENAI_API_KEY_HERE with your actual OpenAI API key.

Replace YOUR_USERNAME, YOUR_PASSWORD, and YOUR_DATABASE_NAME with your PostgreSQL credentials and the name of the database where you enabled pgvector. A common default for YOUR_DATABASE_NAME might be mastra or postgres.

Important: Ensure your .env file is correctly formatted with no extra spaces around the = signs or values.

4. Place Your Documents
Put all your Berkshire Hathaway annual report PDF files into the documents/ folder.

🚀 Usage
This script is designed to be run once (or whenever you add/update documents) to populate your vector database.

To run the document processing pipeline:

npx tsx scripts/processDocs.ts

The script will:

Scan the documents/ folder for PDFs.

Parse text from each PDF.

Chunk the text into smaller segments.

Generate embeddings for each chunk using OpenAI.

Store these embeddings and associated text/metadata in your configured PostgreSQL database.

You will see console logs indicating the progress and any warnings or errors encountered during the process.

⏭️ Next Steps (Future Enhancements)
This project currently focuses on data ingestion. To build a complete RAG system, you would typically:

Develop a Query API/Service: Create an endpoint that receives user questions.

Embed User Queries: Convert the user's question into an embedding.

Perform Similarity Search: Query the PostgreSQL database (using pgvector) to find the most relevant document chunks based on the query embedding.

Augment LLM Prompt: Construct a prompt for an LLM (e.g., GPT-4) that includes the user's question and the retrieved document chunks as context.

Generate Response: Have the LLM generate an answer based on the augmented prompt.

Build a User Interface: Create a web or command-line interface for users to interact with the RAG system.

📄 License
This project is open-source and available under the MIT License.
