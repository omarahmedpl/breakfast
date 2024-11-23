import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import "react-toastify/dist/ReactToastify.css";
import "primereact/resources/themes/lara-light-cyan/theme.css";
import { PrimeReactProvider } from "primereact/api";
import { ToastContainer } from "react-toastify";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <PrimeReactProvider>
      <App />
      <ToastContainer
               className="px-5 sm:px-0"

        position="bottom-center"
        hideProgressBar={true}
        draggable={true}
      />
    </PrimeReactProvider>
  </StrictMode>
);
