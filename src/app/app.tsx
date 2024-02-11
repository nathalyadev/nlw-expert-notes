import { Routes } from "./routes";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";

import "../../src/app/shared/global/index.css"

export function App() {
  return (
    <>
      <Routes />
      <ToastContainer
        position="top-right"
        draggable
        pauseOnHover
        theme="light"
      />
    </>
  );
}
