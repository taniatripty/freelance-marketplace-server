import express from "express";
import { getClientDashboardStats, getFreelancerStats } from "./statistics.controller";


const router = express.Router();

router.get(
  "/freelancerstats/:sellerId",
  getFreelancerStats
);

router.get(
  "/clientstats/:buyerId",
  getClientDashboardStats
);


export const statisticsRoutes= router;