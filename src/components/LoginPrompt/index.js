import React from "react"

import Logo from "/src/assets/logo.svg"

import makeClassName from "/src/util/makeClassName"

import "./style.scss"

function LoginProvider(props) {
	return (
		<a
			className={makeClassName("login-provider", [ props.id ])}
			href={`/api/auth/redirect/${props.id}`}
		>
			<span className="login-provider-text">
				Log in with <em>{props.name}</em>
			</span>
		</a>
	)
}

function LoginPrompt() {
	return (
		<div className="login-prompt-container">
			<Logo className="logo" />
			<div className="login-prompt">
				<span className="login-prompt-header">You aren't logged in.</span>
				<div className="login-providers">
					<LoginProvider id="discord" name="Discord" />
				</div>
			</div>
		</div>
	)
}

export default LoginPrompt