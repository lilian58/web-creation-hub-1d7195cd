import mongoose from "mongoose";

export const connectDB = async () => {
  const uri = process.env.MONGO_URI;
  if (!uri) throw new Error("MONGO_URI manquant dans .env");
  mongoose.set("strictQuery", true);
  const conn = await mongoose.connect(uri, { autoIndex: true });
  console.log(`✅ MongoDB connecté: ${conn.connection.host}/${conn.connection.name}`);
  return conn;
};
