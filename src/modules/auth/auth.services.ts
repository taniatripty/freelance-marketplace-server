

import { getDB } from "../../confing/db";




export const registerUserIntoDB = async (user: any) => {
  
  // ✅ move here
  const db=getDB();
 const userCollection = db.collection("users");

  const existingUser = await userCollection.findOne({
    email: user.email,
  });

  if (existingUser) {
    throw new Error("User already exists");
  }

  const result = await userCollection.insertOne(user);
  return result;
};


export const loginUserFromDB = async (email: string) => {
  const db=getDB();
 const userCollection = db.collection("users");

  const user = await userCollection.findOne({ email });

  if (!user) {
    throw new Error("User not found");
  }

  return user;
};

export const getUserByUidService = async (
  uid: string
) => {
  const db = getDB();

  const user = await db
    .collection("users")
    .findOne({ uid });

  if (!user) {
    throw new Error("User not found");
  }

  return user;
};