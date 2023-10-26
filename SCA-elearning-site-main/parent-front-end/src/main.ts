//  react imports
import React from "react";
import ReactDom from "react-dom";

//  css imports
import "normalize.css";
import "./css/main.css";
import "../../staff-front-end/src/css/navbar.css";
import "../../staff-front-end/src/css/loginSection.css";
import "./css/newsSection.css";
import "./css/newsCard.css";
import "./css/footer.css";

//  component imports
import Base from "./components/base";

ReactDom.render(React.createElement(Base), document.getElementById("root"));
