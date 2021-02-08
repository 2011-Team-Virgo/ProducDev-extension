import axios from "axios";

export const firebaseUpload = async (pl, projectName) => {
  try {
    for (const file in pl[projectName]) {
      if (pl[projectName].hasOwnProperty(file)) {
        const urlSafe = file.replace(/\//g, "-").slice(0, file.length - 3);
        await axios.patch(
          `https://producdev-1277b-default-rtdb.firebaseio.com/users/${pl.id}/projects/${projectName}/-src-components-NavBar.json`,
          pl[projectName][file]
        );
      }
    }
  } catch (error) {
    console.log(error);
  }
};
