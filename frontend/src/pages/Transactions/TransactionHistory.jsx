import React, { useState, useEffect } from "react";
import Loader from "../../components/Loader";
import orderApi from "../../service/api/orderApi";

const TransactionHistory = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleViewHistoryPayment = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await orderApi.getHistoryPayment();
      if (res.redirectUrl) {
        window.location.href = res.redirectUrl;
      }
    } catch (err) {
      setError("Failed to fetch payment history. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleViewHistoryPayment();
  }, []);

  return (
    <div className="w-full h-full">
      {loading ? (
        <Loader />
      ) : error ? (
        <div className="text-red-500 text-center">
          <div>{error}</div>
          <button
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
            onClick={() => (window.location.href = "/")}
          >
            Quay về trang chủ
          </button>
        </div>
      ) : (
        <div>
          <p className="text-center text-gray-700">
            Redirecting to payment history...
          </p>
        </div>
      )}
    </div>
  );
};

export default TransactionHistory;
