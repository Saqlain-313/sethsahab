const express = require("express");

const {
  createDeposit,
  getMyDeposits,
  onlinePayCallback,
  getMyTurnoverHistory,
  getAllDepositsForAdmin,
} = require("../controllers/depositecontroller");

const uploadDeposit = require("../middleware/depositUpload.js");
const authMiddleware = require("../middleware/authMiddleware");
const {
  requireVerifiedKYC,
} = require("../middleware/kycVerificationMiddleware");

const router = express.Router();

// =====================================================
// CREATE DEPOSIT
// POST /deposit
// =====================================================

router.post(
  "/deposit",
  authMiddleware,
  requireVerifiedKYC,
  uploadDeposit.fields([
    {
      name: "image",
      maxCount: 1,
    },
  ]),
  createDeposit
);

// =====================================================
// MY TURNOVER HISTORY
// GET /deposit/turnover
// =====================================================

router.get(
  "/deposit/turnover",
  authMiddleware,
  getMyTurnoverHistory
);

// =====================================================
// MY DEPOSIT HISTORY
// GET /deposit
// =====================================================

router.get(
  "/deposit",
  authMiddleware,
  getMyDeposits
);

// =====================================================
// ADMIN - GET ALL DEPOSITS
// GET /deposits
// =====================================================

router.get(
  "/deposits",
  authMiddleware,
  getAllDepositsForAdmin
);

// =====================================================
// QWACKPAY AUTOMATIC PAYMENT CALLBACK
// POST/GET/PUT/etc. /deposit/callback
//
// No authMiddleware here.
// QwackPay directly calls this endpoint.
// =====================================================

router.all(
  "/deposit/callback",
  onlinePayCallback
);

// =====================================================
// EXPORT ROUTER
// =====================================================

module.exports = router;