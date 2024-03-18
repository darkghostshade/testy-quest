import { configureStore } from '@reduxjs/toolkit';
import userReducer from './userSlice'; // Assuming this is the correct path to your userSlice file

// Create your Redux store
const store = configureStore({
  reducer: {
    User: userReducer
    // Add more reducers here if needed
  }
});

export default store;