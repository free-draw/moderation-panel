import * as PIXI from "pixi.js"
import React from "react"
import ReactDOM from "react-dom"

import App from "./App"

import "./style/base.scss"

ReactDOM.render(<App />, document.getElementById("app"))

if (window.__PIXI_INSPECTOR_GLOBAL_HOOK__) {
	window.__PIXI_INSPECTOR_GLOBAL_HOOK__.register({ PIXI })
}