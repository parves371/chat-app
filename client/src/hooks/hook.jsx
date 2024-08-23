import { useEffect } from "react";
import toast from "react-hot-toast";

const useErrorHook = (errors = []) => {
  useEffect(() => {
    errors.forEach(({ isError, error, fallback }) => {
      if (isError) {
        if (fallback) fallback();
        else toast.error(error?.data?.message || "something went wrong");
      }
    });
  }, [errors]);
};

export { useErrorHook };
