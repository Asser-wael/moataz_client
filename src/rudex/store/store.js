import { configureStore } from "@reduxjs/toolkit";
import notification from "./notificationSlice";
import admin from "./adminSlice";
import auth from "./authSlice";
import cart from "./cartSlice";
import order from "./orderSlice";
import product from "./productSlice";
import profile from "./profileSlice";

export const store = configureStore({
  reducer: {
    notification,
    admin,
    auth,
    cart,
    order,
    product,
    profile,
  },
});