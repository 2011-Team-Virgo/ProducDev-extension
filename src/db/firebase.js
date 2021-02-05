import axios from "axios";

export const firebaseUpload = async (obj) => {
  try {
    await axios.post("/api", obj);
  } catch (error) {
    console.log(error);
  }
};
