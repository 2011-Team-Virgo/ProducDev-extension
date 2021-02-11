import axios from "axios";

const SET_DATA = "SET_DATA";
const CREATE_DATA = "CREATE_DATA";

const _setData = (data) => ({ type: SET_DATA, data });

export const fetchData = () => {
  return async (dispatch) => {
    try {
      const data = (await axios.get("/api")).data;
      dispatch(_setData(data));
    } catch (error) {
      console.error(error);
    }
  };
};

const _createData = (data) => ({ type: CREATE_DATA, data });

export const createData = (obj) => {
  console.log("thunk\n", obj);
};

export default function dataReducer(state = {}, action) {
  switch (action.type) {
    case SET_DATA:
      return action.data;
    case CREATE_DATA:
      return [...state, action.data];
    default:
      return state;
  }
}
