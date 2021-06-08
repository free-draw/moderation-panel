import React from "react"
import Icon from "@mdi/react"

import makeClassName from "/src/util/makeClassName"

import Arrow from "./arrow.svg"

import "./style.scss"

function DropdownItem(props) {
	return (
		<div
			className={makeClassName("dropdown-option", {
				primary: props.isPrimary,
				placeholder: props.isPlaceholder,
				current: props.isCurrent,
			})}
			onClick={props.onClick}
		>
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
			<span className="dropdown-name">{props.name}</span>
		</div>
	)
}

function Dropdown(props) {
	const [ open, setOpen ] = React.useState(false)

	const currentOption = props.options.find(option => option.id === props.currentOption)

	return (
		<div className="dropdown-container">
			<div className={makeClassName("dropdown", { open })}>
				{
					open ? (
						<div className="dropdown-options">
							{
								props.options.map((option) => {
									return (
										<DropdownItem
											isCurrent={option === currentOption}
											key={option.id}
											name={option.name}
											onClick={(event) => {
												setOpen(false)
												props.onSelection(option.id)
												event.stopPropagation()
											}}
										/>
									)
								})
							}
						</div>
					) : (
						<DropdownItem
							isPrimary
							isPlaceholder={!currentOption}
							name={currentOption ? currentOption.name : props.placeholder}
							onClick={(event) => {
								setOpen(true)
								event.stopPropagation()
							}}
						/>
					)
				}
			</div>
			<Arrow className={`dropdown-arrow ${open ? "open" : ""}`} />
		</div>
	)
}

export default Dropdown