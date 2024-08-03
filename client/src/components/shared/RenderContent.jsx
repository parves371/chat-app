import React from "react";
import { fileTransform } from "../../lib/features";
import { FileOpen as FileOpenIcon } from "@mui/icons-material";

const RenderContent = (file, url) => {
  console.log(file, url);
  switch (file) {
    case "image":
      return (
        <img
          src={fileTransform(url)}
          alt="image"
          width="200px"
          height="150px"
          style={{ objectFit: "contain" }}
        />
      );
    case "video":
      return <video src={url} controls preload="none" width="200px" />;
    case "audio":
      return <audio src={url} controls preload="none" />;
    default:
      return <FileOpenIcon />;
  }
};

export default RenderContent;
