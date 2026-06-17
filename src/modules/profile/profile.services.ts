import { getDB } from "../../confing/db";

export const becomeFreelancerService = async (payload: any) => {
  const db = getDB();

  const usersCollection = db.collection("users");
  const freelancerCollection = db.collection("freelancer");

  const {
    userId,
    title,
    bio,
    skills,
    languages,
    experience,
    hourlyRate,
    portfolio,
  } = payload;

  // 1. Check user exists in USERS collection
  const user = await usersCollection.findOne({ uid: userId });

  if (!user) {
    throw new Error("User not found");
  }

  // 2. Check already freelancer or not (optional but recommended)
  const existingFreelancer = await freelancerCollection.findOne({
    userId,
  });

  if (existingFreelancer) {
    throw new Error("Already a freelancer");
  }

  // 3. Update user role in USERS collection
  await usersCollection.updateOne(
    { uid: userId },
    {
      $set: {
        role: "freelancer",
      },
    }
  );

  // 4. Insert freelancer profile in freelancer collection
  const result = await freelancerCollection.insertOne({
    userId,
    title,
    bio,
    skills,
    languages,
    experience,
    hourlyRate,
    portfolio,
    createdAt: new Date(),
  });

  return result;
};