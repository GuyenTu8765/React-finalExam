import Api from "./Api";
import FormData from "form-data";

const url = "/files";

const uploadImage = (imageFile) => {
  const body = new FormData();
  body.append(`image`, imageFile);

  return Api.post(`${url}/image`, body);
};

const FileApi = {
  uploadImage,
};
export default FileApi;
