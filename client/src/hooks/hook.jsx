import { useEffect, useState } from "react";
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

const useAsyncMutation = (mutationHook) => {
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState(null);

  const [mutation] = mutationHook();

  const executeMutation = async (toastMessage, ...args) => {
    setIsLoading(true);
    const toastId = toast.loading(toastMessage || "Updatting Data...");
    try {
      const res = await mutation(...args);
      if (res.data) {
        toast.success(res?.data?.message || "data updated successfully", {
          id: toastId,
        });
        setData(res.data);
      } else {
        toast.error(res?.error?.data?.message || "Something went wrong", {
          id: toastId,
        });
      }
    } catch (error) {
      console.log(error);
      toast.error(error?.data?.message || "something went wrong",{
        id: toastId,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return { executeMutation, isLoading, data };
};

export { useErrorHook, useAsyncMutation };
