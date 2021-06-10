import React from "react"

import { getRobloxThumbnail } from "/src/api/roblox"

import makeClassName from "/src/util/makeClassName"
import useAsync from "/src/util/useAsync"

function Player(props) {
	return (
		<a
			className={makeClassName("player", { target: props.isTarget })}
			href={`https://www.roblox.com/users/${props.id}/profile`}
			target="_blank"
		>
			<span className="player-name">{props.name}</span>
		</a>
	)
}

function ImportantPlayer(props) {
	const avatar = useAsync(getRobloxThumbnail)("AvatarHeadShot", props.id, "100x100")

	return (
		<a
			className="important-player"
			href={`https://www.roblox.com/users/${props.id}/profile`}
			target="_blank"
		>
			<img className="important-player-avatar" src={avatar} />
			<div className="important-player-details">
				<span className="important-player-label">{props.label}</span>
				<span className="important-player-name">{props.name}</span>
			</div>
		</a>
	)
}

function InfoSection(props) {
	return (
		<div className="info-section">
			<span className="info-section-header">{props.header}</span>
			<div className={makeClassName("info-section-contents", [ props.id ])}>
				{props.children}
			</div>
		</div>
	)
}

function Info(props) {
	const { report, snapshot } = props

	return (
		<div className="info">
			<ImportantPlayer label="From" {...snapshot.players[report.from]}/>
			<ImportantPlayer label="Target" {...snapshot.players[report.target]}/>
			<InfoSection id="notes" header="Notes">
				{snapshot.notes ?? <em>No notes specified</em>}
			</InfoSection>
			<InfoSection id="players" header="Players">
				{
					Object.values(snapshot.players).map((player) => {
						return (
							<Player
								key={player.id}
								isTarget={player.id === report.target}
								{...player}
							/>
						)
					})
				}
			</InfoSection>
		</div>
	)
}

export default Info