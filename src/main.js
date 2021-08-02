import * as PIXI from "pixi.js"
import React from "react"
import ReactDOM from "react-dom"

import { useReduceMotion } from "react-reduce-motion"
import { Globals } from "react-spring"

import App from "./App"

import "./style/base.scss"

ReactDOM.render(<App />, document.getElementById("app"))

Globals.assign({
	skipAnimation: useReduceMotion(),
})

if (window.__PIXI_INSPECTOR_GLOBAL_HOOK__) {
	window.__PIXI_INSPECTOR_GLOBAL_HOOK__.register({ PIXI })
}