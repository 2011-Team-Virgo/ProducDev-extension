import axios from "axios";

export const firebaseUpload = async (obj) => {
  try {
    const { id } = obj;
    const { projectName } = obj;
    const { file } = obj;
    const { data } = obj;
    await axios.patch(
      `https://producdev-1277b-default-rtdb.firebaseio.com/users/${id}/projects/${projectName}/${file}.json`,
      data
    );
  } catch (error) {
    console.log(error);
  }
};
