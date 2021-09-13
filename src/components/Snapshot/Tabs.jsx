import React from "react"
import styled from "styled-components"
import Icon from "@mdi/react"
import { mdiPresentation, mdiServerNetwork, mdiLayers, mdiMessageText } from "@mdi/js"

import colors from "/src/presets/colors"

import ServerTab from "./tabContents/Server"
import LogsTab from "./tabContents/Logs"

const tabs = [
	{
		id: "canvas",
		name: "Canvas",
		icon: mdiPresentation,
	},
	{
		id: "server",
		name: "Server",
		icon: mdiServerNetwork,
		component: ServerTab,
	},
	{
		id: "layers",
		name: "Layers",
		icon: mdiLayers,
	},
	{
		id: "logs",
		name: "Logs",
		icon: mdiMessageText,
		component: LogsTab,
	},
]

const TabElement = styled.div`
	width: 56px;
	height: 56px;
	display: flex;
	align-items: center;
	justify-content: center;
	border-radius: 12px;
	cursor: pointer;
	pointer-events: all;

	border: ${props => props.active ? "none" : `1px solid ${colors.border}`};
	background: ${props => props.active ? colors.brand[600] : "white"};
	color: ${props => props.active ? "white" : "black"};

	& + & {
		margin-top: 8px;
	}
`

function Tab({ icon, active, onClick }) {
	return (
		<TabElement active={active} onClick={onClick}>
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

function Tabs({ snapshot, report }) {
	const [ currentTabId, setCurrentTabId ] = React.useState(tabs[0].id)
	const currentTab = tabs.find(tab => tab.id == currentTabId)

	return (
		<TabsContainerElement>
			<TabsElement>
				{
					tabs.map((tab) => {
						return (
							<Tab
								key={tab.id}
								active={tab === currentTab}
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