

import { getDB } from "../../confing/db";




// export const registerUserIntoDB = async (user: any) => {
  
//   // ✅ move here
//   const db=getDB();
//  const userCollection = db.collection("users");

//   const existingUser = await userCollection.findOne({
//     email: user.email,
//   });

//   if (existingUser) {
//     throw new Error("User already exists");
//   }

//   const result = await userCollection.insertOne(user);
//   return result;
// };


export const registerUserIntoDB = async (user: any) => {
  const db = getDB();
  const userCollection = db.collection("users");

  const existingUser = await userCollection.findOne({
    email: user.email,
  });

  // User already exists → return existing user
  if (existingUser) {
    return existingUser;
  }

  const newUser = {
    uid: user.uid,
    name: user.name,
    email: user.email,
    role: user.role || "client",
    photoURL: user.photoURL || "",
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  await userCollection.insertOne(newUser);

  return newUser;
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