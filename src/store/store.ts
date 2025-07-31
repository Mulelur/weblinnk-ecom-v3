import { configureStore } from "@reduxjs/toolkit";

import productReducer from "./productSlice";
import shopReducer from "./shopSlice";

export const store = configureStore({
  reducer: {
    product: productReducer,
    shop: shopReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
