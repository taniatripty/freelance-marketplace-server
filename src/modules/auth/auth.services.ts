
import { getDB } from "../../confing/db";

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

export const getAllUsersService = async () => {
  const db = getDB();

  const users = await db
    .collection("users")
    .find({})
    .sort({
      createdAt: -1,
    })
    .toArray();

  return users;
};

export const updateUserRoleService = async (
  uid: string,
  role: string
) => {
  const db = getDB();

  return await db.collection("users").updateOne(
    { uid },
    {
      $set: {
        role,
        updatedAt: new Date(),
      },
    }
  );
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

export const updateProfileService = async (
  uid: string,
  payload: any
) => {
  const db = getDB();

  const userCollection = db.collection("users");

  const result = await userCollection.updateOne(
    { uid },
    {
      $set: {
        ...payload,
        updatedAt: new Date(),
      },
    }
  );

  return result;
};