import axios from "axios";

const instance = axios.create({
  baseURL: "producdev-1277b.firebaseapp.com",
});

export default instance;
