import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from './Firebase/FirebaseConfig';
import Cookies from 'js-cookie';

// Action to handle user login
export const LoginUser = createAsyncThunk(
  'user/loginUser',
  async ({ email, password }, thunkAPI) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const token = await userCredential.user.getIdToken();
      Cookies.set('firebaseToken', token); // Set Firebase token in cookie
      return userCredential.user;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

// Action to handle user logout
export const Logout = () => dispatch => {
  Cookies.remove('firebaseToken'); // Remove Firebase token from cookie
  dispatch(userLoggedOut());
};

const userSlice = createSlice({
  name: 'user',
  initialState: {
    loggedIn: false,
    email: '',
    firebaseToken: Cookies.get('firebaseToken') || null, // Initialize with token from cookie
    error: null,
  },
  reducers: {
    userLoggedOut: (state) => {
      state.loggedIn = false;
      state.email = '';
      state.firebaseToken = null;
    }
  },
  extraReducers: (builder) => {
    builder.addCase(LoginUser.fulfilled, (state, action) => {
      state.loggedIn = true;
      state.email = action.payload.email;
      state.error = null;
    });
    builder.addCase(LoginUser.rejected, (state, action) => {
      state.loggedIn = false;
      state.error = action.payload;
    });
  },
});

export const { userLoggedOut } = userSlice.actions;

export default userSlice.reducer;
