import * as PIXI from "pixi.js"
import React from "react"
import ReactDOM from "react-dom"

import day from "dayjs"
import relativeTime from "dayjs/plugin/relativeTime"
day.extend(relativeTime)

import AppComponent from "./App"

ReactDOM.render(<AppComponent />, document.getElementById("app"))

if (window.__PIXI_INSPECTOR_GLOBAL_HOOK__) {
	window.__PIXI_INSPECTOR_GLOBAL_HOOK__.register({ PIXI })
}