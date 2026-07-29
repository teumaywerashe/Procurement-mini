import { configureStore, combineReducers } from "@reduxjs/toolkit";
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import storage from "redux-persist/lib/storage";
import { baseApi } from "./api/baseApi";
import { authReducer } from "./auth/authSlice";

const authPersistConfig = {
  key: "auth",
  storage,
};

// Redux Persist saves Redux state so it survives a page refresh
// with out persist, the user would be logged out on page refresh
// but with persist, the user will remain logged in until they log out or the token expires

const rootReducer = combineReducers({
  auth: persistReducer(authPersistConfig, authReducer),
  [baseApi.reducerPath]: baseApi.reducer,
});

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }).concat(baseApi.middleware),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
