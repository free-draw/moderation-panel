import * as PIXI from "pixi.js"
import React from "react"
import ReactDOM from "react-dom"

import day from "dayjs"
import relativeTime from "dayjs/plugin/relativeTime"
day.extend(relativeTime)

import App from "./App"

ReactDOM.render(<App />, document.getElementById("app"))

if (window.__PIXI_INSPECTOR_GLOBAL_HOOK__) {
	window.__PIXI_INSPECTOR_GLOBAL_HOOK__.register({ PIXI })
}