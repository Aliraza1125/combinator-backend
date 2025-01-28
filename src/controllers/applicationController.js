    // controllers/applicationController.js
    import StartupApplication from '../models/StartupApplication.js';
    import EHttpStatusCode from "../enums/HttpStatusCode.js";

    const applicationController = {
    createApplication: async (req, res) => {
        try {
        const userId = req.user._id;
        const applicationData = { ...req.body, userId };

        const application = new StartupApplication(applicationData);
        await application.save();

        return res.status(EHttpStatusCode.CREATED).json({
            message: "Application created successfully",
            application
        });
        } catch (error) {
        console.error("Create application error:", error);
        return res.status(EHttpStatusCode.INTERNAL_SERVER)
            .json({ message: "Failed to create application" });
        }
    },

    updateApplication: async (req, res) => {
        try {
        const { id } = req.params;
        const userId = req.user._id;

        const application = await StartupApplication.findOneAndUpdate(
            { _id: id, userId },
            req.body,
            { new: true }
        );

        if (!application) {
            return res.status(EHttpStatusCode.NOT_FOUND)
            .json({ message: "Application not found" });
        }

        return res.status(EHttpStatusCode.SUCCESS).json({
            message: "Application updated successfully",
            application
        });
        } catch (error) {
        console.error("Update application error:", error);
        return res.status(EHttpStatusCode.INTERNAL_SERVER)
            .json({ message: "Failed to update application" });
        }
    },

    getApplications: async (req, res) => {
        try {
          const { _id: userId, isAdmin } = req.user;
          
          let applications;
          if (isAdmin) {
            // Admin gets all applications
            applications = await StartupApplication.find()
              .sort({ createdAt: -1 })
              .populate('userId', 'name email');
          } else {
            // Regular users get only their applications
            // applications = await StartupApplication.find({ userId })
            //   .sort({ createdAt: -1 });
            applications = await StartupApplication.find()
            .sort({ createdAt: -1 })
            .populate('userId', 'name email');
          }
      
          return res.status(EHttpStatusCode.SUCCESS).json({ applications });
        } catch (error) {
          console.error("Get applications error:", error);
          return res.status(EHttpStatusCode.INTERNAL_SERVER)
            .json({ message: "Failed to retrieve applications" });
        }
      },
      getAllApplications: async (req, res) => {
        try {
          const { isAdmin } = req.user;
      
          if (!isAdmin) {
            return res.status(EHttpStatusCode.UNAUTHORIZED)
              .json({ message: "Only admins can access all applications" });
          }
      
          const applications = await StartupApplication.find()
            .sort({ createdAt: -1 })
            .populate('userId', 'name email'); // Include user details if needed
      
          return res.status(EHttpStatusCode.SUCCESS).json({ applications });
        } catch (error) {
          console.error("Get all applications error:", error);
          return res.status(EHttpStatusCode.INTERNAL_SERVER)
            .json({ message: "Failed to retrieve applications" });
        }
      },

      incrementViews: async (req, res) => {
        try {
          const { id } = req.params;
          const userId = req.user?._id; // User ID if logged in, undefined if not
    
          const application = await StartupApplication.findById(id);
    
          if (!application) {
            return res.status(EHttpStatusCode.NOT_FOUND)
              .json({ message: "Application not found" });
          }
    
          // Initialize views object if it doesn't exist
          if (!application.views) {
            application.views = {
              total: 0,
              uniqueUsers: [],
              history: []
            };
          }
    
          // Always increment total views
          application.views.total += 1;
    
          // If user is logged in, track unique views
          if (userId) {
            // Check if this user has viewed before
            const hasViewed = application.views.uniqueUsers.includes(userId);
            
            if (!hasViewed) {
              // Add to unique users list
              application.views.uniqueUsers.push(userId);
            }
    
            // Add to view history
            application.views.history.push({
              userId,
              timestamp: new Date()
            });
          }
    
          await application.save();
    
          return res.status(EHttpStatusCode.SUCCESS).json({
            message: "View counted successfully",
            views: {
              total: application.views.total,
              unique: application.views.uniqueUsers.length
            }
          });
        } catch (error) {
          console.error("Increment views error:", error);
          return res.status(EHttpStatusCode.INTERNAL_SERVER)
            .json({ message: "Failed to increment views" });
        }
      },
    
      getApplicationById: async (req, res) => {
        try {
          const { id } = req.params;
          const application = await StartupApplication.findById(id)
            .populate('userId', 'name email')
            .populate('views.uniqueUsers', 'name email');
    
          if (!application) {
            return res.status(EHttpStatusCode.NOT_FOUND)
              .json({ message: "Application not found" });
          }
    
          return res.status(EHttpStatusCode.SUCCESS).json({ 
            application: {
              ...application.toObject(),
              views: {
                total: application.views?.total || 0,
                unique: application.views?.uniqueUsers?.length || 0
              }
            }
          });
        } catch (error) {
          console.error("Get application error:", error);
          return res.status(EHttpStatusCode.INTERNAL_SERVER)
            .json({ message: "Failed to retrieve application" });
        }
      },


    deleteApplication: async (req, res) => {
        try {
        const { id } = req.params;
        const userId = req.user.id;

        const application = await StartupApplication.findOneAndDelete({ _id: id, userId });

        if (!application) {
            return res.status(EHttpStatusCode.NOT_FOUND)
            .json({ message: "Application not found" });
        }

        return res.status(EHttpStatusCode.SUCCESS)
            .json({ message: "Application deleted successfully" });
        } catch (error) {
        console.error("Delete application error:", error);
        return res.status(EHttpStatusCode.INTERNAL_SERVER)
            .json({ message: "Failed to delete application" });
        }
    },

  

  // Add method for updating application status
  updateApplicationStatus: async (req, res) => {
    try {
      const { id } = req.params;
      const { status } = req.body;
      const { isAdmin } = req.user;

      if (!isAdmin) {
        return res.status(EHttpStatusCode.UNAUTHORIZED)
          .json({ message: "Only admins can update application status" });
      }

      const application = await StartupApplication.findByIdAndUpdate(
        id,
        { status },
        { new: true }
      );

      if (!application) {
        return res.status(EHttpStatusCode.NOT_FOUND)
          .json({ message: "Application not found" });
      }

      return res.status(EHttpStatusCode.SUCCESS).json({
        message: "Application status updated successfully",
        application
      });
    } catch (error) {
      console.error("Update status error:", error);
      return res.status(EHttpStatusCode.INTERNAL_SERVER)
        .json({ message: "Failed to update application status" });
    }
  },
    };

    export default applicationController;