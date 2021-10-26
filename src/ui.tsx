import * as React from "react";
import * as ReactDOM from "react-dom";
import Home from "./screens/home";
import { useWindowResize } from "./utils/useWindowResize";

import "./ui.css";

declare function require(path: string): any;

let loaded = false;

const App = () => {
  const [currentPage, setCurrentPage] = React.useState("home");

  function onWindowResize(windowSize: { width: number; height: number }) {
    parent.postMessage(
      {
        pluginMessage: {
          type: "window-resize",
          data: { width: windowSize.width, height: windowSize.height },
        },
      },
      "*"
    );
  }
  useWindowResize(onWindowResize, {
    minWidth: 120,
    minHeight: 120,
    maxWidth: 1024,
    maxHeight: 1024,
  });

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
