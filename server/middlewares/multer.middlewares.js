import multer from "multer";

const multerUppload = multer({
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
});

const singleAvatar = multerUppload.single("avatar");

export { singleAvatar };
