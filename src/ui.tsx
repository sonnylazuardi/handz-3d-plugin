import * as React from "react";
import * as ReactDOM from "react-dom";
import Home from "./screens/home";

import "./ui.css";

declare function require(path: string): any;

let loaded = false;

const App = () => {
  const [currentPage, setCurrentPage] = React.useState("home");

  const renderPage = () => {
    switch (currentPage) {
      default:
      case "home":
        return <Home />;
    }
  };

  return renderPage();
};

const rootElement = document.getElementById("react-page");
ReactDOM.render(<App />, rootElement);
