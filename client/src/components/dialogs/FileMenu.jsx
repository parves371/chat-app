import { ListItemText, Menu, MenuItem, MenuList, Tooltip } from "@mui/material";
import React, { useRef } from "react";

import {
  AudioFile as AudioFileIcon,
  Image as ImageIcon,
  UploadFile as UploadFileIcon,
  VideoFile as VideoFileIcon,
} from "@mui/icons-material";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { setIsFileMenu, setUploadingLoader } from "../../redux/reducers/misc";
import { useSendAtTachmentsMutation } from "../../redux/api/api";

const FileMenu = ({ anchorEl, chatId }) => {
  const imageRef = useRef(null);
  const audioRef = useRef(null);
  const vedioRef = useRef(null);
  const fileRef = useRef(null);

  const { isFileMenu } = useSelector((state) => state.misc);
  const dispatch = useDispatch();

  const [sendAttachment] = useSendAtTachmentsMutation();

  const seletctImage = () => imageRef.current?.click();
  const seletctAudio = () => audioRef.current?.click();
  const seletctVedio = () => vedioRef.current?.click();
  const seletctFile = () => fileRef.current?.click();

  const handleClose = () => dispatch(setIsFileMenu(false));

  const fileChangeHandler = async (e, key) => {
    const filesArray = Array.from(e.target.files);
    if (filesArray.length <= 0) return;
    if (filesArray.length > 5)
      return toast.error(`You can upload only 5 ${key} at a time`);

    dispatch(setUploadingLoader(true));
    const toastId = toast.loading(`sending ${key}`);
    handleClose();

    try {
      // fetching files here
      const myFrom = new FormData();
      myFrom.append("chatId", chatId);
      filesArray.forEach((file) => myFrom.append("files", file));
      const res = await sendAttachment(myFrom);

      if (res.data)
        toast.success(`${key} uploaded successfully`, { id: toastId });
      else toast.error(`${key} upload failed`, { id: toastId });
    } catch (error) {
      toast.error(error.message, { id: toastId });
    } finally {
      dispatch(setUploadingLoader(false));
      toast.success(`${key} uploaded successfully`, { id: toastId });
    }
  };

  return (
    <Menu anchorEl={anchorEl} open={isFileMenu} onClose={handleClose}>
      <div style={{ width: "10rem" }}>
        <MenuList>
          <MenuItem onClick={seletctImage}>
            <Tooltip title="Upload Image">
              <ImageIcon />
            </Tooltip>
            <ListItemText style={{ marginLeft: "0.5rem" }}>Image</ListItemText>
            <input
              type="file"
              accept="image/png, image/jpeg, image/gif"
              style={{ display: "none" }}
              multiple
              onChange={(e) => fileChangeHandler(e, "images")}
              ref={imageRef}
            />
          </MenuItem>

          <MenuItem onClick={seletctAudio}>
            <Tooltip title="Audio">
              <AudioFileIcon />
            </Tooltip>
            <ListItemText style={{ marginLeft: "0.5rem" }}>Audio</ListItemText>
            <input
              type="file"
              accept="audio/mpeg, audio/wav"
              style={{ display: "none" }}
              multiple
              onChange={(e) => fileChangeHandler(e, "audios")}
              ref={audioRef}
            />
          </MenuItem>

          <MenuItem onClick={seletctVedio}>
            <Tooltip title="Vedio">
              <VideoFileIcon />
            </Tooltip>
            <ListItemText style={{ marginLeft: "0.5rem" }}>Vedio</ListItemText>
            <input
              type="file"
              accept="video/mp4, video/webm, video/ogg"
              style={{ display: "none" }}
              multiple
              onChange={(e) => fileChangeHandler(e, "vedios")}
              ref={vedioRef}
            />
          </MenuItem>

          <MenuItem onClick={seletctFile}>
            <Tooltip title="File">
              <UploadFileIcon />
            </Tooltip>
            <ListItemText style={{ marginLeft: "0.5rem" }}>File</ListItemText>
            <input
              type="file"
              accept="video/mp4, video/webm, video/ogg"
              style={{ display: "none" }}
              multiple
              onChange={(e) => fileChangeHandler(e, "files")}
              ref={fileRef}
            />
          </MenuItem>
        </MenuList>
      </div>
    </Menu>
  );
};

export default FileMenu;
