import React from "react"
import styled from "styled-components"
import Icon from "@mdi/react"
import { mdiPresentation, mdiServerNetwork, mdiLayers, mdiMessageText } from "@mdi/js"
import colors from "../../presets/colors"
import ServerTab from "./tabContents/Server"
import LogsTab from "./tabContents/Logs"
import { Snapshot, Report } from "@free-draw/moderation-client"

enum TabId {
	CANVAS = "CANVAS",
	SERVER = "SERVER",
	LAYERS = "LAYERS",
	LOGS = "LOGS",
}

type Tab = {
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
		component: ServerTab,
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
		component: LogsTab,
	},
] as Tab[]

const TabElement = styled.div<{
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

function Tab({ icon, isSelected, onClick }: {
	icon: string,
	isSelected: boolean,
	onClick: React.MouseEventHandler<HTMLDivElement>,
}) {
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

const TabsContainerElement = styled.div`
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

const TabsElement = styled.div`
	display: flex;
	flex-direction: column;
`

const TabContentsContainerElement = styled.div`
	margin-left: 20px;
`

const TabContentsElement = styled.div`
	border: 1px solid ${colors.border};
	border-radius: 12px;
	width: 350px;
	max-height: 100%;
	overflow: auto hidden;
	background: white;
	pointer-events: all;
`

function Tabs({ snapshot, report }: {
	snapshot: Snapshot,
	report?: Report,
}) {
	const [ currentTabId, setCurrentTabId ] = React.useState<TabId>(tabs[0].id)
	const currentTab = tabs.find(tab => tab.id == currentTabId)!

	return (
		<TabsContainerElement>
			<TabsElement>
				{
					tabs.map((tab) => {
						return (
							<Tab
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

export default Tabs

export {
	TabElement,

	TabsContainerElement,
	TabsElement,
	TabContentsContainerElement,
	TabContentsElement,
}