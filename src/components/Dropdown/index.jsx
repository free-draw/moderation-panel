import React from "react"
import Icon from "@mdi/react"

import Arrow from "./arrow.svg"

import "./style.scss"

function DropdownItem(props) {
	return (
		<div className={`dropdown-option ${props.primary ? "primary" : ""} ${props.current ? "current" : ""}`} onClick={props.onClick}>
			{
				props.icon ? (
					<Icon
						className="dropdown-icon"
						path={props.icon}
						color="black"
						size={1}
					/>
				) : null
			}
			<span className="dropdown-text">{props.text}</span>
		</div>
	)
}

function Dropdown(props) {
	const [ open, setOpen ] = React.useState(false)

	const currentOption = props.options.find(option => option.id === props.currentOption)

	return (
		<div className="dropdown-container">
			<div className={`dropdown ${open ? "open" : ""}`}>
				{
					open ? (
						<div className="dropdown-options">
							{
								props.options.map((option) => {
									return (
										<DropdownItem
											current={option === currentOption}
											onClick={(event) => {
												setOpen(false)
												props.onSelection(option.id)
												event.stopPropagation()
											}}
											{...option}
										/>
									)
								})
							}
						</div>
					) : (
						<DropdownItem
							primary
							onClick={(event) => {
								setOpen(true)
								event.stopPropagation()
							}}
							{...currentOption}
						/>
					)
				}
			</div>
			<Arrow className={`dropdown-arrow ${open ? "open" : ""}`} />
		</div>
	)
}

export default Dropdown