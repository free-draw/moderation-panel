import React from "react"

function ChatMessage(props) {
	return (
		<span className={`chat-message ${props.isTarget ? "target" : ""}`}>
			<em>{props.player.name}</em>: {props.message}
		</span>
	)
}

function Chat(props) {
	const { report, snapshot } = props

	return (
		<div className="chat">
			{
				snapshot.logs.map((logData) => {
					return (
						<ChatMessage
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