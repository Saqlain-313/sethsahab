import React, { useEffect, useRef, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import {
  addUserLotteryEntry,
  selectLotteryPurchaseLoading,
  selectLotteryError,
} from "../reducer/slice/createLotteryConfigSlice";

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const purchaseLoading = useSelector(selectLotteryPurchaseLoading);
  const lotteryError = useSelector(selectLotteryError);

  // ==========================================================
  // PREVENT DUPLICATE API CALL
  // ==========================================================

  const entryCalledRef = useRef(false);
  const redirectCalledRef = useRef(false);

  // ==========================================================
  // REDIRECT COUNTDOWN
  // ==========================================================

  const [redirectSeconds, setRedirectSeconds] = useState(3);
  const [entrySuccess, setEntrySuccess] = useState(false);

  // ==========================================================
  // URL PARAMETERS
  // ==========================================================

  const urlOrderId = searchParams.get("order_id") || "";
  const urlAmount = searchParams.get("amount") || "";
  const urlNumber = searchParams.get("number") || "";
  const urlStatus = searchParams.get("status") || "";

  // ==========================================================
  // LOCAL STORAGE FALLBACK
  // ==========================================================

  const getPendingPayment = () => {
    try {
      const saved = localStorage.getItem("pendingLotteryPayment");

      if (!saved) {
        return {};
      }

      const parsed = JSON.parse(saved);

      return parsed || {};
    } catch (error) {
      console.error(
        "Failed to read pending payment:",
        error
      );

      return {};
    }
  };

  const pendingPayment = getPendingPayment();

  // ==========================================================
  // FINAL PAYMENT DETAILS
  // ==========================================================

  const orderId =
    urlOrderId ||
    pendingPayment.orderId ||
    pendingPayment.merchant_order_id ||
    "";

  const amount =
    urlAmount ||
    pendingPayment.amount ||
    "";

  const number =
    urlNumber ||
    pendingPayment.number ||
    "";

  const status = String(
    urlStatus ||
      pendingPayment.status ||
      ""
  ).toLowerCase();

  // ==========================================================
  // ADD LOTTERY ENTRY
  // ==========================================================

  useEffect(() => {
    // Payment successful nahi hai
    if (status !== "success") {
      return;
    }

    // Number missing
    if (!number) {
      console.error(
        "Lottery number missing:",
        {
          orderId,
          amount,
          number,
          status,
        }
      );

      return;
    }

    // Amount missing
    if (!amount) {
      console.error(
        "Payment amount missing:",
        {
          orderId,
          amount,
          number,
          status,
        }
      );

      return;
    }

    // Duplicate API call prevent
    if (entryCalledRef.current) {
      return;
    }

    entryCalledRef.current = true;

    console.log(
      "===================================="
    );

    console.log(
      "PAYMENT SUCCESS PAGE"
    );

    console.log(
      "ORDER ID:",
      orderId
    );

    console.log(
      "AMOUNT:",
      amount
    );

    console.log(
      "NUMBER:",
      number
    );

    console.log(
      "STATUS:",
      status
    );

    console.log(
      "ADDING LOTTERY ENTRY..."
    );

    console.log(
      "===================================="
    );

    dispatch(
      addUserLotteryEntry({
        number: String(number),
        amount: Number(amount),
      })
    )
      .unwrap()
      .then((response) => {
        console.log(
          "Lottery entry added successfully:",
          response
        );

        setEntrySuccess(true);

        // Payment details ab pending nahi hain
        localStorage.removeItem(
          "pendingLotteryPayment"
        );
      })
      .catch((error) => {
        console.error(
          "Failed to add lottery entry:",
          error
        );

        entryCalledRef.current = false;

        setEntrySuccess(false);
      });
  }, [
    status,
    number,
    amount,
    orderId,
    dispatch,
  ]);

  // ==========================================================
  // REDIRECT TO HOME
  // ==========================================================

  useEffect(() => {
    if (!entrySuccess) {
      return;
    }

    if (redirectCalledRef.current) {
      return;
    }

    redirectCalledRef.current = true;

    setRedirectSeconds(3);

    const interval = setInterval(() => {
      setRedirectSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(interval);

          return 0;
        }

        return prev - 1;
      });
    }, 1000);

    const timeout = setTimeout(() => {
      console.log(
        "Redirecting to home..."
      );

      navigate("/", {
        replace: true,
      });
    }, 3000);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [
    entrySuccess,
    navigate,
  ]);

  // ==========================================================
  // GO HOME
  // ==========================================================

  const handleGoHome = () => {
    localStorage.removeItem(
      "pendingLotteryPayment"
    );

    navigate("/", {
      replace: true,
    });
  };

  // ==========================================================
  // PAYMENT FAILED / INVALID STATUS
  // ==========================================================

  if (status !== "success") {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4 py-6">

        <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-6 text-center">

          {/* ICON */}

          <div className="w-20 h-20 mx-auto mb-5 rounded-full bg-red-100 flex items-center justify-center">

            <span className="text-5xl text-red-600">
              ✕
            </span>

          </div>

          {/* TITLE */}

          <h1 className="text-2xl font-bold text-gray-800">
            Payment Failed
          </h1>

          <p className="text-gray-500 mt-2">
            Your payment was not successful.
          </p>

          {/* DETAILS */}

          <div className="mt-6 bg-gray-50 rounded-xl p-4 text-left space-y-4">

            {/* AMOUNT */}

            <div className="flex justify-between gap-4">

              <span className="text-gray-500">
                Amount
              </span>

              <span className="font-bold text-gray-800">
                ₹{amount || "0"}
              </span>

            </div>

            {/* NUMBER */}

            <div className="flex justify-between gap-4">

              <span className="text-gray-500">
                Lottery Number
              </span>

              <span className="font-bold text-gray-800">
                {number || "-"}
              </span>

            </div>

            {/* ORDER */}

            <div className="flex justify-between gap-4">

              <span className="text-gray-500">
                Order ID
              </span>

              <span className="font-semibold text-gray-800 text-sm break-all text-right">
                {orderId || "-"}
              </span>

            </div>

            {/* STATUS */}

            <div className="flex justify-between gap-4">

              <span className="text-gray-500">
                Status
              </span>

              <span className="font-bold text-red-600 uppercase">
                {status || "FAILED"}
              </span>

            </div>

          </div>

          {/* HOME */}

          <button
            onClick={handleGoHome}
            className="w-full mt-6 bg-green-600 hover:bg-green-700 active:bg-green-800 text-white py-3 rounded-xl font-semibold transition"
          >
            Go to Home
          </button>

        </div>

      </div>
    );
  }

  // ==========================================================
  // PAYMENT SUCCESS
  // ==========================================================

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4 py-6">

      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-6 text-center">

        {/* SUCCESS ICON */}

        <div className="w-20 h-20 mx-auto mb-5 rounded-full bg-green-100 flex items-center justify-center">

          <span className="text-5xl text-green-600">
            ✓
          </span>

        </div>

        {/* TITLE */}

        <h1 className="text-2xl font-bold text-gray-800">
          Payment Successful
        </h1>

        <p className="text-gray-500 mt-2">
          Your payment has been successfully verified.
        </p>

        {/* ==================================================
            ADDING ENTRY
        ================================================== */}

        {purchaseLoading && (
          <div className="mt-5 bg-blue-50 text-blue-600 rounded-xl p-4">

            <div className="flex items-center justify-center gap-3">

              <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />

              <span className="font-medium">
                Adding your lottery entry...
              </span>

            </div>

          </div>
        )}

        {/* ==================================================
            ENTRY ERROR
        ================================================== */}

        {!purchaseLoading && lotteryError && (
          <div className="mt-5 bg-red-50 text-red-600 rounded-xl p-4">

            <div className="font-bold">
              Lottery Entry Failed
            </div>

            <div className="text-sm mt-1">
              {lotteryError}
            </div>

          </div>
        )}

        {/* ==================================================
            ENTRY SUCCESS
        ================================================== */}

        {!purchaseLoading &&
          !lotteryError &&
          entrySuccess && (
            <div className="mt-5 bg-green-50 text-green-600 rounded-xl p-4">

              <div className="font-bold">
                Lottery Entry Added Successfully
              </div>

              <div className="text-sm mt-1">
                Redirecting to Home in{" "}
                <span className="font-bold">
                  {redirectSeconds}
                </span>{" "}
                seconds...
              </div>

            </div>
          )}

        {/* ==================================================
            PAYMENT DETAILS
        ================================================== */}

        <div className="mt-6 bg-gray-50 rounded-xl p-4 text-left space-y-4">

          {/* AMOUNT */}

          <div className="flex justify-between items-center gap-4">

            <span className="text-gray-500">
              Amount
            </span>

            <span className="font-bold text-gray-800 text-lg">
              ₹{amount || "0"}
            </span>

          </div>

          {/* NUMBER */}

          <div className="flex justify-between items-center gap-4">

            <span className="text-gray-500">
              Lottery Number
            </span>

            <span className="font-bold text-gray-800 text-lg tracking-wider">
              {number || "-"}
            </span>

          </div>

          {/* ORDER ID */}

          <div className="flex justify-between gap-4">

            <span className="text-gray-500">
              Order ID
            </span>

            <span className="font-semibold text-gray-800 text-sm break-all text-right">
              {orderId || "-"}
            </span>

          </div>

          {/* PAYMENT STATUS */}

          <div className="flex justify-between items-center gap-4">

            <span className="text-gray-500">
              Payment Status
            </span>

            <span className="font-bold text-green-600">
              SUCCESS
            </span>

          </div>

          {/* LOTTERY STATUS */}

          <div className="flex justify-between items-center gap-4">

            <span className="text-gray-500">
              Lottery Status
            </span>

            <span
              className={`font-bold ${
                entrySuccess
                  ? "text-green-600"
                  : purchaseLoading
                  ? "text-blue-600"
                  : "text-gray-500"
              }`}
            >
              {entrySuccess
                ? "ADDED"
                : purchaseLoading
                ? "PROCESSING"
                : "PENDING"}
            </span>

          </div>

        </div>

        {/* ==================================================
            GO HOME
        ================================================== */}

        <button
          onClick={handleGoHome}
          className="w-full mt-6 bg-green-600 hover:bg-green-700 active:bg-green-800 text-white py-3 rounded-xl font-semibold transition"
        >
          Go to Home
        </button>

      </div>

    </div>
  );
};

export default PaymentSuccess;