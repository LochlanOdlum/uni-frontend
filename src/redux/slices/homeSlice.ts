import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface HomeState {
  selectedHomeId: number | null; 
}

const initialState: HomeState = {
  selectedHomeId: null,
};

const homeSlice = createSlice({
  name: 'home',  
  initialState,
  reducers: {
    setHomeId: (state, action: PayloadAction<number | null>) => {
      state.selectedHomeId = action.payload;
    },
    clearHomeId: (state) => {
      state.selectedHomeId = null;
    },
  },
});

export const { setHomeId, clearHomeId } = homeSlice.actions;

export default homeSlice.reducer;
