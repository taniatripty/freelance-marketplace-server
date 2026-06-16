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

export const loginUserFromDB = async (
  email: string,
  password: string
) => {
  const db = getDB();

  const userCollection =
    db.collection("users");

  const user =
    await userCollection.findOne({
      email,
    });

  if (!user) {
    throw new Error("User not found");
  }

  if (user.password !== password) {
    throw new Error("Invalid password");
  }

  return user;
};