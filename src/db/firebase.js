import axios from "axios";

export const firebaseUpload = async (pl, projectName) => {
  try {
    for (const file in pl[projectName]) {
      if (Object.hasOwnProperty.call(pl, file)) {
        await axios.patch(
          `https://producdev-1277b-default-rtdb.firebaseio.com/users/${pl.id}/projects/${projectName}/${file}.json`,
          pl[projectName][file]
        );
      }
    }
  } catch (error) {
    console.log(error);
  }
};
