import {
  applyMiddleware,
  compose,
  legacy_createStore as createStore,
} from "redux";
import { persistStore, persistReducer } from "redux-persist";
// import localStorage from "redux-persist/lib/storage";
import sessionStorage from "redux-persist/es/storage/session";
import thunk from "redux-thunk";
import logger from "redux-logger";
import rootReducers from "./root-reducer";

const middlewares = [thunk];

const persistConfig = {
  key: "root",
  storage: sessionStorage,
  whitelist: ["auth", "user",], // only keys defined in rootReducer will be persisted
};

if (process.env.NODE_ENV === "development") {
  middlewares.push(logger);
}

const middleware = applyMiddleware(...middlewares);

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const persistedReducer = persistReducer(persistConfig, rootReducers);

export const store = createStore(
  persistedReducer,
  composeEnhancers(middleware)
);

export const persistor = persistStore(store);
