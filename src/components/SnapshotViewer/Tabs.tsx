import React from "react"
import styled from "styled-components"
import Icon from "@mdi/react"
import { mdiPresentation, mdiServerNetwork, mdiLayers, mdiMessageText } from "@mdi/js"
import colors from "../../assets/colors"
import ServerTabComponent from "./tabContents/Server"
import LogsTabComponent from "./tabContents/Logs"
import { Snapshot, Report } from "@free-draw/moderation-client"

export enum TabId {
	CANVAS = "CANVAS",
	SERVER = "SERVER",
	LAYERS = "LAYERS",
	LOGS = "LOGS",
}

export type Tab = {
	id: TabId,
	name: string,
	icon: string,
	component?: React.ComponentType<{
		snapshot: Snapshot,
		report?: Report,
	}>,
}

const tabs = [
	{
		id: TabId.CANVAS,
		name: "Canvas",
		icon: mdiPresentation,
	},

	{
		id: TabId.SERVER,
		name: "Server",
		icon: mdiServerNetwork,
		component: ServerTabComponent,
	},

	{
		id: TabId.LAYERS,
		name: "Layers",
		icon: mdiLayers,
	},

	{
		id: TabId.LOGS,
		name: "Logs",
		icon: mdiMessageText,
		component: LogsTabComponent,
	},
] as Tab[]

export const TabElement = styled.div<{
	isSelected: boolean,
}>`
	width: 56px;
	height: 56px;
	display: flex;
	align-items: center;
	justify-content: center;
	border-radius: 12px;
	cursor: pointer;
	pointer-events: all;

	border: ${props => props.isSelected ? "none" : `1px solid ${colors.border}`};
	background: ${props => props.isSelected ? colors.brand[600] : "white"};
	color: ${props => props.isSelected ? "white" : "black"};

	& + & {
		margin-top: 8px;
	}
`

const TabComponent = ({ icon, isSelected, onClick }: {
	icon: string,
	isSelected: boolean,
	onClick: React.MouseEventHandler<HTMLDivElement>,
}) => {
	return (
		<TabElement isSelected={isSelected} onClick={onClick}>
			<Icon
				path={icon}
				size={28/24}
				color="currentcolor"
			/>
		</TabElement>
	)
}

export const TabsContainerElement = styled.div`
	position: absolute;
	top: 0;
	left: 0;
	height: 100%;
	display: flex;
	flex-direction: row;
	padding: 20px;
	pointer-events: none;
	z-index: 10;
`

export const TabsElement = styled.div`
	display: flex;
	flex-direction: column;
`

export const TabContentsContainerElement = styled.div`
	margin-left: 20px;
`

export const TabContentsElement = styled.div`
	border: 1px solid ${colors.border};
	border-radius: 12px;
	width: 350px;
	max-height: 100%;
	overflow: auto hidden;
	background: white;
	pointer-events: all;
`

const TabsComponent = ({ snapshot, report }: {
	snapshot: Snapshot,
	report?: Report,
}) => {
	const [ currentTabId, setCurrentTabId ] = React.useState<TabId>(tabs[0].id)
	const currentTab = tabs.find(tab => tab.id == currentTabId)!

	return (
		<TabsContainerElement>
			<TabsElement>
				{
					tabs.map((tab) => {
						return (
							<TabComponent
								key={tab.id}
								isSelected={tab === currentTab}
								onClick={() => setCurrentTabId(tab.id)}
								{...tab}
							/>
						)
					})
				}
			</TabsElement>
			{
				currentTab.component ? (
					<TabContentsContainerElement>
						<TabContentsElement>
							<currentTab.component snapshot={snapshot} report={report} />
						</TabContentsElement>
					</TabContentsContainerElement>
				) : null
			}
		</TabsContainerElement>
	)
}

export default TabsComponent