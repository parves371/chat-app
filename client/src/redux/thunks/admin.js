import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { server } from "../../constants/config";

const adminLogin = createAsyncThunk("admin/login", async (secretkey) => {
  try {
    const config = {
      withCredentials: true,
      Headers: {
        "contant-type": "application/json",
      },
    };

    const { data } = await axios.post(
      `${server}/api/v1/admin/verify`,
      { secretkey },
      config
    );
    return data?.message;
  } catch (error) {
    throw error?.response?.data?.message;
  }
});

export { adminLogin };
