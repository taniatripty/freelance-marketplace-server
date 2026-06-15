

import { MongoClient, Db } from "mongodb";

const uri = process.env.MONGO_URI as string;

if (!uri) {
  throw new Error("MONGO_URI is missing in .env file");
}

//const client = new MongoClient(uri);
const client = new MongoClient(uri, {
  serverSelectionTimeoutMS: 5000,
  family: 4
});

let db: Db;

export const connectDB = async () => {
  try {
    await client.connect();

    db = client.db("freelanceDB");

    await db.command({ ping: 1 });

    console.log("✅ MongoDB Connected Successfully");

    return db;
  } catch (error) {
    console.error("❌ MongoDB Connection Failed:", error);
    process.exit(1);
  }
};

// getter (safe access anywhere)
export const getDB = () => {
  if (!db) {
    throw new Error("DB not initialized. Call connectDB first.");
  }
  return db;
};