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

const fileTransform = (url = "", width = 100) => url;
export { fileFormat, fileTransform };
