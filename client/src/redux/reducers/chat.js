import { createSlice } from "@reduxjs/toolkit";
import { getOrSaveLocalStorage } from "../../lib/features";
import { NEW_MASSAGE } from "../../constants/event";

const initialState = {
  notificationsCount: 0,
  newMessagesAlert: getOrSaveLocalStorage({ key: NEW_MASSAGE, get: true }) || [
    {
      chatId: "",
      count: 0,
    },
  ],
};

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    incrementNotificationsCount: (state) => {
      state.notificationsCount += 1;
    },
    resetNotificationsCount: (state) => {
      state.notificationsCount = 0;
    },
    setNewMessagesAlert: (state, { payload }) => {
      const index = state.newMessagesAlert.findIndex(
        (alert) => alert.chatId === payload.chatId
      );
      if (index !== -1) {
        state.newMessagesAlert[index].count += 1;
      } else {
        state.newMessagesAlert.push({
          chatId: payload.chatId,
          count: 1,
        });
      }
    },
    removeNewMessageAlert: (state, actions) => {
      state.newMessagesAlert = state.newMessagesAlert.filter((item) => {
        item.chatId !== actions.payload;
      });
    },
  },
});

export default chatSlice;

export const {
  incrementNotificationsCount,
  resetNotificationsCount,
  setNewMessagesAlert,
  removeNewMessageAlert,
} = chatSlice.actions;
