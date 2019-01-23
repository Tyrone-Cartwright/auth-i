import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import axios from "axios";
import { BrowserRouter as Router } from "react-router-dom";

axios.defaults.withCredentials = true;

ReactDOM.render(
  <Router>
    <App />
  </Router>,
  document.getElementById("root")
);
