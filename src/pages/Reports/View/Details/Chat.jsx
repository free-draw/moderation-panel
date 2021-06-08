import React from "react"

import makeClassName from "/src/util/makeClassName"

function ChatMessage(props) {
	return (
		<span className={makeClassName("chat-message", { target: props.isTarget })}>
			<em>{props.player.name}</em>: {props.message}
		</span>
	)
}

function Chat(props) {
	const { report, snapshot } = props

	return (
		<div className="chat">
			{
				snapshot.logs.map((logData, index) => {
					return (
						<ChatMessage
							key={index}
							isTarget={logData.player.id === report.target}
							player={logData.player}
							message={logData.message}
						/>
					)
				})
			}
		</div>
	)
}

export default Chat