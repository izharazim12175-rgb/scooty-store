import { createSlice } from "@reduxjs/toolkit";
import { readDemoData } from "../../app/demoPersistence.js";

export const orderStatuses = [
  "Order Placed",
  "Processing",
  "Shipped",
  "Out for Delivery",
  "Delivered",
  "Cancelled",
];

export const demoInitialOrders = [
  {
    id: "ORD-1001",
    customer: {
      fullName: "Marcus Vance",
      email: "marcus.vance@example.com",
      phone: "+1 (555) 234-5678",
      address: "742 Evergreen Terrace",
      city: "Springfield",
      postalCode: "97477",
    },
    items: [
      {
        id: 1,
        title: "M365 Electric Scooter",
        price: 349,
        quantity: 1,
        thumbnail: "/images/xiaomi-m365.jpg",
      },
    ],
    total: 349,
    status: "Delivered",
    orderDate: "2026-10-24T14:30:00.000Z",
  },
  {
    id: "ORD-1002",
    customer: {
      fullName: "Sophia Chen",
      email: "sophia.chen@example.com",
      phone: "+1 (555) 345-6789",
      address: "120 Market Street, Apt 4B",
      city: "San Francisco",
      postalCode: "94105",
    },
    items: [
      {
        id: 4,
        title: "S1 Pro",
        price: 1599,
        quantity: 1,
        thumbnail: "/images/ola-s1-pro.jpg",
      },
    ],
    total: 1599,
    status: "Shipped",
    orderDate: "2026-10-27T09:15:00.000Z",
  },
  {
    id: "ORD-1003",
    customer: {
      fullName: "Liam O'Connor",
      email: "liam.oc@example.com",
      phone: "+1 (555) 456-7890",
      address: "88 Pine Street",
      city: "Seattle",
      postalCode: "98101",
    },
    items: [
      {
        id: 3,
        title: "EM1 e",
        price: 2999,
        quantity: 1,
        thumbnail: "/images/honda-em1.jpg",
      },
      {
        id: 1,
        title: "M365 Electric Scooter",
        price: 349,
        quantity: 1,
        thumbnail: "/images/xiaomi-m365.jpg",
      },
    ],
    total: 3348,
    status: "Processing",
    orderDate: "2026-10-29T16:45:00.000Z",
  },
  {
    id: "ORD-1004",
    customer: {
      fullName: "Elena Rostova",
      email: "elena.r@example.com",
      phone: "+1 (555) 567-8901",
      address: "550 5th Avenue",
      city: "New York",
      postalCode: "10036",
    },
    items: [
      {
        id: 2,
        title: "CE 02",
        price: 7599,
        quantity: 1,
        thumbnail: "/images/bmw-ce-02.jpg",
      },
    ],
    total: 7599,
    status: "Order Placed",
    orderDate: "2026-10-31T11:20:00.000Z",
  },
  {
    id: "ORD-1005",
    customer: {
      fullName: "Marcus Vance",
      email: "marcus.vance@example.com",
      phone: "+1 (555) 234-5678",
      address: "742 Evergreen Terrace",
      city: "Springfield",
      postalCode: "97477",
    },
    items: [
      {
        id: 5,
        title: "BeRider Electric Scooter",
        price: 1199,
        quantity: 1,
        thumbnail: "/images/berider-electric-scooter.jpg",
      },
    ],
    total: 1199,
    status: "Cancelled",
    orderDate: "2026-10-21T08:00:00.000Z",
  },
];

const savedOrders = readDemoData("scootstore-orders", null);
const initialOrders =
  Array.isArray(savedOrders) && savedOrders.length > 0
    ? savedOrders
    : demoInitialOrders;

const ordersSlice = createSlice({
  name: "orders",
  initialState: initialOrders,
  reducers: {
    addOrder: (state, action) => {
      if (!state.some((order) => order.id === action.payload.id)) {
        state.unshift(action.payload);
      }
    },
    updateOrderStatus: (state, action) => {
      const { id, status } = action.payload;
      if (!orderStatuses.includes(status)) return;
      const order = state.find((item) => item.id === id);
      if (order) order.status = status;
    },
    deleteOrder: (state, action) => {
      return state.filter((item) => item.id !== action.payload);
    },
  },
});

export const { addOrder, updateOrderStatus, deleteOrder } = ordersSlice.actions;
export default ordersSlice.reducer;
