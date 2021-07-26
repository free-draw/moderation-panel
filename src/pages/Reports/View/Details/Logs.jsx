import React from "react"

import makeClassName from "/src/util/makeClassName"

function BaseMessage(props) {
	const report = props.report

	let className = "base-message"
	className = makeClassName(className, { target: props.player.id === report.target })
	className = makeClassName(className, [ props.type ])

	return (
		<span className={className}>
			{props.children}
		</span>
	)
}

function ChatMessage(props) {
	return (
		<BaseMessage type="chat" {...props}>
			<em>{props.player.name}</em>: {props.message.content}
		</BaseMessage>
	)
}

function EventMessage(props) {
	return (
		<BaseMessage type="event" {...props}>
			{props.children}
		</BaseMessage>
	)
}

function Logs(props) {
	const { report, snapshot } = props

	return (
		<div className="logs">
			{
				snapshot.logs.map(({ player, type, data }, index) => {
					switch (type) {
						case "JOIN":
						case "LEAVE":
							return (
								<EventMessage 
									key={index}
									player={player}
									report={report}
								>
									{player.name} {type === "JOIN" ? "joined" : "left"}
								</EventMessage>
							)
						case "CHAT":
							return (
								<ChatMessage
									key={index}
									player={player}
									message={data}
									report={report}
								/>
							)
					}
				})
			}
		</div>
	)
}

export default Logs