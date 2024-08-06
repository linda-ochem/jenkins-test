import { combineReducers } from "redux";
import paginationReducer from "./pagination/paginations.reducer";
import authReducer from "./auth/auth.reducer";
import customerReducer from "./customers/customers.reducer";
import adminReducer from "./admin/admin.reducer";

const rootReducers = combineReducers({
  auth: authReducer,
  pagination: paginationReducer,
  customers: customerReducer,
  admin: adminReducer,
});

export default rootReducers;
