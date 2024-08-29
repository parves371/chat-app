import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  notificationsCount: 0,
  newMessagesAlert: [],
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
