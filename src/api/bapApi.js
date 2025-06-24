// src/api/bapApi.js
import axios from 'axios';

const BASE_URL = 'http://192.168.29.243:5000/beckn'; // ✅ Your BAP server

export const searchStations = async (searchParams) => {
    const response = await axios.post(`${BASE_URL}/search`, searchParams);
    return response.data;
};

export const selectStation = async (selectionParams) => {
    const response = await axios.post(`${BASE_URL}/select`, selectionParams);
    return response.data;
};

export const initBooking = async (initParams) => {
    const response = await axios.post(`${BASE_URL}/init`, initParams);
    return response.data;
};

export const confirmBooking = async (confirmParams) => {
    const response = await axios.post(`${BASE_URL}/confirm`, confirmParams);
    return response.data;
};

export const fetchAllStations = async () => {
    const response = await axios.get(`${BASE_URL}/station/stationCall`);
    return response.data;
};

// 🛠️ Dummy Payment functions
export const initPayment = async (amount, orderId) => {
    const response = await axios.post(`${BASE_URL}/payment/init`, { amount, orderId });
    return response.data;
};

export const confirmPayment = async (orderId) => {
    const response = await axios.post(`${BASE_URL}/payment/confirm`, { orderId });
    return response.data;
};

// ✅ NEW: sendBill
export const sendBill = async (billData) => {
    const response = await axios.post(`${BASE_URL}/bill`, billData);
    return response.data;
};

export const confirmBill = async (billId) => {
    const response = await axios.post(`${BASE_URL}/confirmBill`, { billId });
    return response.data;
};

// ✅ NEW: Fetch transaction history
export const fetchTransactionHistory = async () => {
  const response = await axios.get(`${BASE_URL}/transactions`);
  return response.data;
};

//test

export const initiatePayment = async (bill) => {
  // bill: { amount, userId, stationId, pointNumber, typeName, startTime, endTime }
  const response = await axios.post(`${BASE_URL}/payment/initiate`, { bill });
  return response.data;
};

export const confirmPay = async (transactionId) => {
  const response = await axios.post(`${BASE_URL}/payment/confirm`, { transactionId });
  return response.data;
};