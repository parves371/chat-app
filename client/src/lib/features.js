import moment from "moment";

const fileFormat = (url = "") => {
  const ext = url.split(".").pop();
  if (ext === "jpg" || ext === "jpeg" || ext === "png" || ext === "gif") {
    return "image";
  } else if (ext === "mp4" || ext === "webm" || ext === "ogg") {
    return "video";
  } else if (ext === "mp3" || ext === "wav") {
    return "audio";
  } else if (ext === "pdf") {
    return "pdf";
  } else {
    return "file";
  }
};

const fileTransform = (url = "", width = 100) => {
  // const newUlr = url.replace("upload", `upload/dpr_auto/w_${width}`);
  // if (typeof url !== "string") {
  //   console.log("URL is not a string:", url);
  // }
  return url;
};

const getLast7Days = () => {
  const currentDate = moment();

  const last7Days = [];
  for (let i = 0; i < 7; i++) {
    const dayDate = currentDate.clone().subtract(i, "days");
    const day = dayDate.format("dddd");
    last7Days.unshift(day);
  }
  return last7Days;
};

function getOrSaveLocalStorage({ key, value, get = false }) {
  if (get) {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  } else {
    localStorage.setItem(key, JSON.stringify(value));
  }
}

export { fileFormat, fileTransform, getLast7Days, getOrSaveLocalStorage };
