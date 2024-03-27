import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { ChakraProvider } from "@chakra-ui/react";
import { AuthProvider } from "./context/UserAuthContext";
import { BrowserRouter as Router } from "react-router-dom";
import { BoardProvider } from "./context/BoardContext";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <React.StrictMode>
    <ChakraProvider>
      <Router>
        <AuthProvider>
          <BoardProvider>
            <App />
          </BoardProvider>
        </AuthProvider>
      </Router>
    </ChakraProvider>
  </React.StrictMode>
);
