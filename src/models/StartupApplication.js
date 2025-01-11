// models/StartupApplication.js
import mongoose from "mongoose";

const applicationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  companyName: {
    type: String,
    required: true
  },
  industry: {
    type: String,
    required: true,
    enum: ['fintech', 'healthtech', 'edtech', 'ecommerce', 'saas', 'ai', 'cleantech', 'other']
  },
  website: {
    type: String
  },
  foundedDate: {
    type: Date,
    required: true
  },
  location: {
    type: String,
    required: true
  },
  teamSize: {
    type: Number,
    required: true,
    min: 1
  },
  pitch: {
    type: String,
    required: true
  },
  problem: {
    type: String,
    required: true
  },
  solution: {
    type: String,
    required: true
  },
  marketSize: {
    type: String,
    required: true
  },
  competition: {
    type: String,
    required: true
  },
  businessModel: {
    type: String,
    required: true
  },
  fundingStage: {
    type: String,
    required: true,
    enum: ['pre-seed', 'seed', 'series-a', 'series-b', 'series-c']
  },
  fundingNeeded: {
    type: Number,
    required: true
  },
  logo: {
    type: String
  },
  status: {
    type: String,
    required: true,
    enum: ['draft', 'submitted', 'under_review', 'approved', 'rejected', 'info_requested'],
    default: 'under_review'
  }
}, {
  timestamps: true
});

const StartupApplication = mongoose.model("StartupApplication", applicationSchema);
export default StartupApplication;