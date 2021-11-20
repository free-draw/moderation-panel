import React from "react"
import styled from "styled-components"
import Icon from "@mdi/react"
import { mdiCameraControl } from "@mdi/js"
import colors from "../../../assets/colors"
import { Report, Snapshot, SnapshotPlayer } from "@free-draw/moderation-client"

export const SectionElement = styled.div`
	display: flex;
	flex-direction: column;
`

export const SectionLabelElement = styled.span`
	font-size: 14px;
	font-weight: 700;
`

export const SectionContentsElement = styled.span`
	margin-top: 12px;
`

const SectionComponent = ({ label, children }: {
	label: string,
	children?: React.ReactNode,
}) => {
	return (
		<SectionElement>
			<SectionLabelElement>{label}</SectionLabelElement>
			<SectionContentsElement>{children}</SectionContentsElement>
		</SectionElement>
	)
}

export const PlayerElement = styled.a.attrs({
	target: "_blank",
})`
	display: flex;
	flex-direction: row;
	align-items: center;
	cursor: pointer;
	user-select: none;
	border-radius: 4px;
	height: 38px;
	padding: 0 10px 0 12px;

	:hover {
		background: rgba(0, 0, 0, 0.1);
	}
`

export const PlayerNameElement = styled.span<{
	isEmphasized?: boolean,
}>`
	font-size: 16px;
	font-weight: ${props => props.isEmphasized ? 700 : 400};
	color: ${props => props.isEmphasized ? colors.brand[600] : "black"};
`

export const PlayerBreadcrumbElement = styled.span`
	font-size: 12px;
	font-weight: 600;
	text-transform: uppercase;
	margin-left: 6px;
	color: white;
	border-radius: 3px;
	background: ${colors.brand[600]};
	padding: 2px 5px;
`

export const PlayerSpacerElement = styled.div`
	flex-grow: 1;
`

export const PlayerButtonsElement = styled.div`
	flex-direction: row;
`

export const PlayerButtonElement = styled.span`
	user-select: none;
	cursor: pointer;
	opacity: 0;

	${PlayerElement}:hover & {
		opacity: 0.5;
	}

	&:hover {
		opacity: 1 !important;
	}
`

const PlayerComponent = ({ player, breadcrumb, isEmphasized }: {
	player: SnapshotPlayer,
	breadcrumb?: string,
	isEmphasized?: boolean,
}) => {
	return (
		<PlayerElement href={`https://www.roblox.com/users/${player.id}/profile`}>
			<PlayerNameElement isEmphasized={isEmphasized}>{player.name}</PlayerNameElement>
			{ breadcrumb ? <PlayerBreadcrumbElement>{breadcrumb}</PlayerBreadcrumbElement> : null }
			<PlayerSpacerElement />
			<PlayerButtonsElement>
				<PlayerButtonElement
					onClick={(event) => {
						// TODO: Move camera to player (requires context)
						event.preventDefault()
					}}
				>
					<Icon
						path={mdiCameraControl}
						size={1}
						color="black"
					/>
				</PlayerButtonElement>
			</PlayerButtonsElement>
		</PlayerElement>
	)
}

export const ServerTabElement = styled.div`
	display: flex;
	flex-direction: column;
	padding: 20px;
`

const ServerTabComponent = ({ snapshot, report }: {
	snapshot: Snapshot,
	report: Report,
}) => {
	return (
		<ServerTabElement>
			<SectionComponent label="Players">
				{
					Object.values(snapshot.players).map((player) => {
						let breadcrumb

						if (report) {
							if (player.id === report.target.id) {
								breadcrumb = "Target"
							} else if (player.id === report.from.id) {
								breadcrumb = "Source"
							}
						}

						return <PlayerComponent
							key={player.id}
							player={player}
							breadcrumb={breadcrumb}
							isEmphasized={report ? report.target.id == player.id : false}
						/>
					})
				}
			</SectionComponent>
		</ServerTabElement>
	)
}

export default ServerTabComponent