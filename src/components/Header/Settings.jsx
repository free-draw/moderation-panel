import React from "react"
import styled from "styled-components"
import Icon from "@mdi/react"
import { mdiCog } from "@mdi/js"
import { useSpring, animated } from "react-spring"

import colors from "/src/presets/colors"

const SettingsContainerElement = styled.div`
	position: relative;
`

const SettingsIconElement = styled(Icon).attrs({
	path: mdiCog,
	size: 1,
})`
	cursor: pointer;
`

const SettingsElement = styled(animated.div)`
	position: absolute;
	top: calc(100% + 20px);
	right: 0;
	background: white;
	border-radius: 12px;
	border: 1px solid ${colors.border};
	padding: 16px;
	max-width: 300px;
	z-index: 1000;
	user-select: none;
	cursor: default;
`

const SettingsNoticeElement = styled.span`
	display: inline-block;
	font-size: 16px;
	font-weight: 400;
	white-space: nowrap;
`

function Settings() {
	const [ open, setOpen ] = React.useState(false)

	const { offset, opacity } = useSpring({
		to: {
			offset: open ? 0 : -10,
			opacity: open ? 1 : 0,
		},
		config: {
			frequency: 1/6,
			damping: 0.7,
		},
	})

	return (
		<SettingsContainerElement>
			<SettingsIconElement onClick={() => setOpen(!open)} />
			<SettingsElement
				style={{
					transform: offset.to(value => `translate(0px, ${value}px)`),
					opacity: opacity,
					display: opacity.to(value => value > 0.025 ? "flex" : "none"),
				}}
			>
				<SettingsNoticeElement>There's nothing here yet!</SettingsNoticeElement>
			</SettingsElement>
		</SettingsContainerElement>
	)
}

export default Settings

export {
	SettingsContainerElement,
	SettingsIconElement,
	SettingsElement,
	SettingsNoticeElement,
}