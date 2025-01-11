// routes/application.js
import { Router } from "express";
import applicationController from "../controllers/applicationController.js";
import authMiddleware from "../midlewares/authenticate.js";

const applicationRouter = Router();

// Apply auth middleware to all routes
applicationRouter.use(authMiddleware);

// Regular application routes
applicationRouter.post("/", applicationController.createApplication);
applicationRouter.get("/", applicationController.getApplications);
applicationRouter.get("/:id", applicationController.getApplicationById);
applicationRouter.put("/:id", applicationController.updateApplication);
applicationRouter.delete("/:id", applicationController.deleteApplication);

// Admin-specific routes
applicationRouter.patch("/:id/status", applicationController.updateApplicationStatus);
applicationRouter.get("/admin/all", applicationController.getAllApplications); // Optional: separate admin endpoint

// Add middleware to check admin status for specific routes
const checkAdmin = (req, res, next) => {
  if (!req.user.isAdmin) {
    return res.status(EHttpStatusCode.UNAUTHORIZED)
      .json({ message: "Admin access required" });
  }
  next();
};

// Apply admin check to admin-specific routes
applicationRouter.use("/admin/*", checkAdmin);

export default applicationRouter;