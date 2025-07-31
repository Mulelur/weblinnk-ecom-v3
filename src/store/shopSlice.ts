import { type PayloadAction, createSlice } from "@reduxjs/toolkit";

export interface Shop {
  id: string;
  banner: string;
  bio: string;
  category: string;
  description: string;
  email: string;
  logo: string;
  name: string;
  phoneNumber: string;
  thumbnail: string;
  url: string;
  userId: string;
}

interface ShopState {
  shop: Shop | null;
}

const initialState: ShopState = {
  shop: null,
};

const shopSlice = createSlice({
  name: "shop",
  initialState,
  reducers: {
    setSelectedShop(state, action: PayloadAction<Shop>) {
      state.shop = action.payload;
    },
    clearSelectedShop(state) {
      state.shop = null;
    },
  },
});

export const { setSelectedShop, clearSelectedShop } = shopSlice.actions;
export default shopSlice.reducer;
