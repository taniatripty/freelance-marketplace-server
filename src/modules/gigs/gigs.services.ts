import { ObjectId } from "mongodb";
import { getDB } from "../../confing/db";


export const createGigService = async (payload: any) => {
  const db = getDB();
  const gigCollection = db.collection("gigs");

  const {
    sellerId,
    name,
    email,
    title,
    shortDescription,
    description,
    categoryId,
    price,
    tags,
    features,
    deliveryDays,
    revisions,
    images,
    totalSales
  } = payload;

  const gig = {
    sellerId,
    name,
    email,
    title,
    shortDescription,
    description,
    categoryId,
    price: Number(price),
    deliveryDays: Number(deliveryDays),
    revisions: Number(revisions),
    images: images || [],
    status: "active",
    rating: 0,
    tags,
    features,
    totalSales,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const result = await gigCollection.insertOne(gig);

  return {
    _id: result.insertedId,
    ...gig,
  };
};


export const getAllGigsService = async (query: any) => {
  const db = getDB();
  const gigCollection = db.collection("gigs");

  const {
    categoryId,
    sellerId,
    minPrice,
    maxPrice,
    search,
  } = query;

  // ---------------- FILTER BUILD ----------------
  const filter: any = {};

  if (categoryId) {
    filter.categoryId = categoryId;
  }

  if (sellerId) {
    filter.sellerId = sellerId;
  }

  if (minPrice || maxPrice) {
    filter.price = {};
    if (minPrice) filter.price.$gte = Number(minPrice);
    if (maxPrice) filter.price.$lte = Number(maxPrice);
  }

  if (search) {
    filter.title = {
      $regex: search,
      $options: "i",
    };
  }

  // ---------------- FETCH ----------------
  const gigs = await gigCollection
    .find(filter)
    .sort({ createdAt: -1 }) // latest first
    .toArray();

  return gigs;
};

export const getSingleGigService = async (id: string) => {
  const db = getDB();

  return await db.collection("gigs").findOne({
    _id: new ObjectId(id),
  });
};