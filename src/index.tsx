/* @refresh reload */
import { render } from "solid-js/web";
import "./index.css";
import "./styles/hijri-countdown.css";

import App from "./App.tsx";

const root = document.getElementById("root");

render(() => <App />, root!);
