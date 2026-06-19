import { getDB } from "../../confing/db";


export const createGigService = async (payload: any) => {
  const db = getDB();
  const gigCollection = db.collection("gigs");

  const {
    sellerId,
    name,
    email,
    title,
    description,
    categoryId,
    price,
    deliveryDays,
    revisions,
    images,
  } = payload;

  const gig = {
    sellerId,
    name,
    email,
    title,
    description,
    categoryId,
    price: Number(price),
    deliveryDays: Number(deliveryDays),
    revisions: Number(revisions),
    images: images || [],
    status: "active",
    rating: 0,
    totalSales: 0,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const result = await gigCollection.insertOne(gig);

  return {
    _id: result.insertedId,
    ...gig,
  };
};