// import { getDB } from "../../confing/db";

import { getDB } from "../../confing/db";


// const userCollection = getDB().collection("users");

// export const registerUserIntoDB = async (user: any) => {
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
  const db=getDB();
  const userCollection = db.collection("users"); // ✅ move here

  const existingUser = await userCollection.findOne({
    email: user.email,
  });

  if (existingUser) {
    throw new Error("User already exists");
  }

  const result = await userCollection.insertOne(user);
  return result;
};