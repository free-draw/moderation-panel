import React from "react"

import { getRobloxThumbnail } from "/src/api/roblox"

import useAsync from "/src/util/useAsync"

import ViewerPositionalOverlay from "../ViewerPositionalOverlay"

import "./style.scss"

function ViewerPlayerBubble(props) {
	const { player, position } = props
	const avatar = useAsync(getRobloxThumbnail)("AvatarHeadShot", player.id, "100x100")

	return (
		<ViewerPositionalOverlay position={position} ignoreScale>
			<a
				className="viewer-player-bubble"
				href={`https://www.roblox.com/users/${player.id}/profile`}
				target="_blank"
			>
				<img className="viewer-player-bubble-avatar" src={avatar} />
				<span className="viewer-player-bubble-name">{player.name}</span>
			</a>
		</ViewerPositionalOverlay>
	)
}

function ViewerPlayerBubbles(props) {
	return (
		<div className="viewer-player-bubbles">
			{
				Object.values(props.players).map((player) => {
					return (
						<ViewerPlayerBubble
							key={player.id}
							player={player}
							position={player.position}
						/>
					)
				})
			}
		</div>
	)
}

export default ViewerPlayerBubbles