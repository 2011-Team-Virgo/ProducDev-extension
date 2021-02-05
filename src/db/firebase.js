import axios from "axios";

export const firebaseUpload = async (obj) => {
  try {
    const { id } = obj;
    await axios.put(
      `https://producdev-1277b-default-rtdb.firebaseio.com/users/${id}.json`,
      obj
    );
  } catch (error) {
    console.log(error);
  }
};
