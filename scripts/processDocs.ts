import 'dotenv/config';
import { MDocument } from "@mastra/rag";
import { PgVector } from "@mastra/pg";
import { openai } from "@ai-sdk/openai";
import { embedMany } from "ai";
import * as fs from "node:fs/promises";
import * as path from "node:path";
import pdfParse from "pdf-parse";

async function main() {
  console.log("🚀 Starting document processing pipeline...");

  if (!process.env.OPENAI_API_KEY) {
    throw new Error("OPENAI_API_KEY environment variable is not set. Please set it in your .env file.");
  }
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL environment variable is not set. Please set it in your .env file.");
  }

  const documentsPath = path.join(process.cwd(), "documents");
  let pdfFiles: string[] = [];
  try {
    pdfFiles = await fs.readdir(documentsPath);
  } catch (err: any) {
    if (err.code === 'ENOENT') {
      console.error(`❌ Error: 'documents/' directory not found at ${documentsPath}. Please create it and add your PDF files.`);
    } else {
      console.error(`❌ Error reading 'documents/' directory:`, err);
    }
    process.exit(1); 
  }


  const rawDocs: { text: string; filename: string }[] = [];

  console.log(`🔍 Found ${pdfFiles.length} files in 'documents/' folder. Processing PDFs...`);

  for (const file of pdfFiles) {
    if (file.toLowerCase().endsWith(".pdf")) { 
      const filePath = path.join(documentsPath, file);
      try {
        const dataBuffer = await fs.readFile(filePath);
        const data = await pdfParse(dataBuffer);

        // --- Robust PDF Parsing Check: THIS IS HERE ---
        if (data && data.text && data.text.trim().length > 0) {
          rawDocs.push({ text: data.text, filename: file });
          console.log(`✅ Parsed PDF: ${file}`);
        } else {
          console.warn(`⚠️ Warning: PDF ${file} parsed but no readable text found. Skipping.`);
        }
        // ---------------------------------------------
      } catch (error) {
        console.error(`❌ Error parsing PDF ${file}:`, error);
      }
    } else {
      console.log(`ℹ️ Skipping non-PDF file: ${file}`);
    }
  }

  if (rawDocs.length === 0) {
    console.warn("⚠️ No valid PDF documents with extractable text were found. Exiting.");
    return; 
  }

  // --- MDocument creation using MDocument.fromText() static method ---
  const mDocs = rawDocs.map(doc => {
    // Adding an extra defensive check, though the filter above should prevent this
    if (!doc || !doc.text) {
        console.error(`❗ Encountered a malformed raw document during MDocument creation. Skipping. Doc:`, doc);
        return null; // Return null for invalid documents
    }
    // Use the static fromText method to create an MDocument from a single string
    return MDocument.fromText(doc.text, { filename: doc.filename });
  }).filter(doc => doc !== null) as MDocument[]; // Filter out any nulls
  // ------------------------------------------------------------------

  console.log(`✅ Loaded ${mDocs.length} PDFs (as MDocument instances).`);

  if (mDocs.length === 0) {
    console.warn("⚠️ No valid MDocument instances created after parsing and filtering. Exiting.");
    return;
  }

  const chunks: MDocument[] = [];
  for (const doc of mDocs) {
    try {
      const docChunks = await doc.chunk({ size: 512, overlap: 50 });
      chunks.push(...docChunks);
    } catch (chunkError) {
      console.error(`❌ Error chunking document from ${doc.metadata?.filename || 'unknown file'}:`, chunkError);
    }
  }
  console.log(`✅ Chunked into ${chunks.length} segments.`);

  if (chunks.length === 0) {
    console.warn("⚠️ No chunks were generated from the documents. Exiting.");
    return;
  }

console.log("DEBUG: Value of process.env.DATABASE_URL:", process.env.DATABASE_URL); 

const dbConnectionString = process.env.DATABASE_URL?.trim();

if (!dbConnectionString) {
  throw new Error("DATABASE_URL is empty after trimming. Please check your .env file.");
}

const pgVector = new PgVector(dbConnectionString); 

await pgVector.createIndex("documents", 1536);


  // Step 1: Generate embeddings for the chunks
  const { embeddings } = await embedMany({
    values: chunks.map(chunk => chunk.text),
    model: openai.embeddings("text-embedding-3-small"),
  });
  console.log(`✅ Generated ${embeddings.length} embeddings.`);

  // Step 2: Prepare documents for upsert: each chunk's text and metadata
  const documentsToUpsert = embeddings.map((embedding, i) => ({
    vector: embedding,
    metadata: {
      ...chunks[i].metadata,
      content: chunks[i].text,
    },
  }));

  // Store embeddings in PgVector
  await pgVector.upsert({
    indexName: "documents",
    documents: documentsToUpsert,
  });

  console.log("✅ Documents embedded & stored in pgvector!");
}

main().catch(err => console.error("❌ Error:", err));