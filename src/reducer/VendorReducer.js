export const initialState = null;

export const vendorReducer = (state, action) => {
  if (action.type == "VENDOR") {
    return action.payload;
  } else if (action.type == "CLEAR") {
    return initialState;
  } else {
    return state;
  }
};
