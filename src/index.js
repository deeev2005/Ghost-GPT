import React from "react";
import ReactDOM from "react-dom/client";
import { ChakraProvider } from "@chakra-ui/react";
import { GoogleOAuthProvider } from "@react-oauth/google";
import App from "./App";

const root = ReactDOM.createRoot(document.getElementById("root"));
const clientId = "645075112827-g40btbra6o45hu9ajolfslsc0mjlcc9l.apps.googleusercontent.com"; // Replace with your actual client ID

root.render(
  <GoogleOAuthProvider clientId={clientId}>
    <ChakraProvider>
      <App />
    </ChakraProvider>
  </GoogleOAuthProvider>
);
