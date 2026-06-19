// import { getDB } from "../../confing/db";

import { getDB } from "../../confing/db";


// export const createCategoryService = async (
//   payload: {
//     name: string;
//     icon: string;
//   }
// ) => {
//   const db = getDB();

//   const categoryCollection =
//     db.collection("categories");

//   const category = {
//     ...payload,
//     createdAt: new Date(),
//     updatedAt: new Date(),
//   };

//   const result =
//     await categoryCollection.insertOne(category);

//   return result;
// };



export const createCategoryService = async (payload: any) => {
  const db = getDB();
  const categoryCollection = db.collection("categories");

  const result = await categoryCollection.insertOne({
    name: payload.name,
    icon: payload.icon,
    createdAt: new Date(),
  });

  return result;
};



export const getAllCategoriesService = async () => {
  const db = getDB();
  const categoryCollection = db.collection("categories");

  const categories = await categoryCollection
    .find({})
    .sort({ createdAt: -1 })
    .toArray();

  return categories;
};