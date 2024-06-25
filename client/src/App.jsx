import React, { lazy } from "react";

import { BrowserRouter, Route, Routes } from "react-router-dom";

const Home = lazy(() => import("./pages/Home"));
const Login = lazy(() => import("./pages/Login"));
const Groups = lazy(() => import("./pages/Groups"));
const Chat = lazy(() => import("./pages/chat"));

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/chat:chatId" element={<Chat />} />
        <Route path="/login" element={<Login />} />
        <Route path="/groups" element={<Groups />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
