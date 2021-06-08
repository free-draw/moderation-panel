import React from "react"
import Icon from "@mdi/react"
import { mdiDraw, mdiInformationVariant, mdiMessageText } from "@mdi/js"

import makeClassName from "/src/util/makeClassName"

import Chat from "./Chat"
import Info from "./Info"

import "./style.scss"

const tabs = [
	{
		id: "canvas",
		icon: mdiDraw,
	},
	{
		id: "info",
		icon: mdiInformationVariant,
		component: Info,
	},
	{
		id: "chat",
		icon: mdiMessageText,
		component: Chat,
	},
]

function DetailsButton(props) {
	return (
		<div className={makeClassName("details-button", { active: props.active })} onClick={props.onClick}>
			<Icon path={props.icon} size={32 / 24} color={props.active ? "white" : "black"} />
		</div>
	)
}

function Details(props) {
	const [ currentTabId, setCurrentTabId ] = React.useState(tabs[0].id)
	const currentTab = tabs.find(tab => tab.id === currentTabId)

	return (
		<div className={makeClassName("details", { active: !!currentTab.component })}>
			<div className="details-buttons">
				{
					tabs.map((tab) => {
						return (
							<DetailsButton
								key={tab.id}
								icon={tab.icon}
								active={currentTabId === tab.id}
								onClick={() => setCurrentTabId(tab.id)}
							/>
						)
					})
				}
			</div>

			{
				currentTab.component ? <div className="details-container">
					<currentTab.component {...props} />
				</div> : null
			}
		</div>
	)
}

export default Details