import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import { ThemeProvider } from "react-bootstrap";

// React-Bootstrap required theme configuration
const theme = {
  breakpoints: ["xxxl", "xxl", "xl", "lg", "md", "sm", "xs", "xxs"],
  minBreakpoint: "xxs",
};

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>
);
