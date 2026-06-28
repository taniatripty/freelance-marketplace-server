import { ObjectId } from "mongodb";
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
    name,
    email,
  } = payload;

  // ---------------- VALIDATION ----------------
  if (!userId || !title || !bio) {
    throw new Error("Missing required fields");
  }

  // ---------------- CHECK USER ----------------
  const user = await usersCollection.findOne({ uid: userId });

  if (!user) {
    throw new Error("User not found");
  }

  // ---------------- CHECK EXISTING FREELANCER ----------------
  const existingFreelancer = await freelancerCollection.findOne({
    userId,
  });

  if (existingFreelancer) {
    throw new Error("Already a freelancer");
  }

  // ---------------- UPDATE ROLE ----------------
  const updateResult = await usersCollection.updateOne(
    { uid: userId },
    {
      $set: {
        role: "freelancer",
        updatedAt: new Date(),
      },
    }
  );

  if (updateResult.modifiedCount === 0) {
    throw new Error("Failed to update user role");
  }

  // ---------------- CREATE FREELANCER ----------------
  const freelancerDoc = {
    userId,
    name: name || user.name || "",
    email: email || user.email || "",
    title,
    bio,
    skills: skills || [],
    languages: languages || [],
    experience: experience || "",
    hourlyRate: hourlyRate || 0,
    portfolio: portfolio || [],
    rating: 0,
    totalJobs: 0,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const result = await freelancerCollection.insertOne(freelancerDoc);

  // ---------------- RETURN CLEAN RESPONSE ----------------
  return {
    insertedId: result.insertedId,
    ...freelancerDoc,
  };
};
export const getAllFreelancersService = async () => {
  const db = getDB();

  const freelancerCollection =
    db.collection("freelancer");

  const freelancers = await freelancerCollection
    .find({})
    .toArray();

  return freelancers;
};

export const getSingleFreelancerService = async (
  id: string
) => {
  const db = getDB();

  const freelancerCollection =
    db.collection("freelancer");

  return await freelancerCollection.findOne({
    _id: new ObjectId(id),
  });
};




