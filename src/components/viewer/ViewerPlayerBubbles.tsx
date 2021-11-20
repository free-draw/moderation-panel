import React from "react"
import styled from "styled-components"
import { getRobloxThumbnail, RobloxThumbnailType, Snapshot, SnapshotPlayer, Vector2 } from "@free-draw/moderation-client"
import API from "../../API"
import useAsync from "../../util/useAsync"
import ViewerPositionalOverlayComponent from "./ViewerPositionalOverlay"

const size = 64

export const ViewerPlayerBubbleElement = styled.a.attrs({
	target: "_blank",
})`
	width: 64px;
	display: flex;
	flex-direction: column;
	align-items: center;
	transform: translate(-${size / 2}px, -${size / 2}px);
	user-select: none;
	pointer-events: none;
`

export const ViewerPlayerBubbleAvatarElement = styled.img`
	width: ${size};
	height: ${size};
	border-radius: 50%;
	background: white;
	box-shadow: 0 10px 20px rgba(0, 0, 0, 18%);
	pointer-events: all;
`

export const ViewerPlayerBubbleNameElement = styled.span`
	color: black;
	font-size: 16px;
	font-weight: 700;
	margin-top: 12px;
`

const ViewerPlayerBubbleComponent = ({ player, position }: {
	player: SnapshotPlayer,
	position: Vector2,
}) => {
	const avatar = useAsync(getRobloxThumbnail, [ player.id ])(API, {
		id: player.id,
		type: RobloxThumbnailType.AVATAR_HEADSHOT,
		size: "100x100",
	})

	return (
		<ViewerPositionalOverlayComponent position={position} ignoreScale>
			<ViewerPlayerBubbleElement href={`https://www.roblox.com/users/${player.id}/profile`}>
				<ViewerPlayerBubbleAvatarElement src={avatar ?? ""} />
				<ViewerPlayerBubbleNameElement>{player.name}</ViewerPlayerBubbleNameElement>
			</ViewerPlayerBubbleElement>
		</ViewerPositionalOverlayComponent>
	)
}

export const ViewerPlayerBubblesElement = styled.div``

const ViewerPlayerBubblesComponent = ({ players }: {
	players: Snapshot["players"],
}) => {
	return (
		<ViewerPlayerBubblesElement>
			{
				Object.values(players).map((player) => {
					return (
						<ViewerPlayerBubbleComponent
							key={player.id}
							player={player}
							position={player.position}
						/>
					)
				})
			}
		</ViewerPlayerBubblesElement>
	)
}

export default ViewerPlayerBubblesComponent