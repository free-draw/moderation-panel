import React from "react"
import styled from "styled-components"
import Icon from "@mdi/react"

import colors from "/src/presets/colors"

import Arrow from "/src/assets/arrow.svg"

const height = 42

const DropdownItemElement = styled.div`
	display: flex;
	flex-direction: row;
	align-items: center;
	width: 100%;
	height: ${height}px;
	cursor: pointer;
	border-radius: 8px;

	${props => props.placeholder ? "color: rgba(0, 0, 0, 0.5)" : null};
	${props => !props.primary ? "&:hover { background: rgba(0, 0, 0, 0.1) }" : null};

	svg {
		margin-left: 8px;
	}
`

const DropdownItemNameElement = styled.span`
	margin-left: 12px;
	font-size: 16px;
	font-weight: 400;
`

function DropdownItem({ primary, name, icon, onClick }) {
	return (
		<DropdownItemElement
			primary={primary}
			onClick={onClick}
		>
			{
				icon ? (
					<Icon
						path={icon}
						color="black"
						size={1}
					/>
				) : null
			}
			<DropdownItemNameElement>{name}</DropdownItemNameElement>
		</DropdownItemElement>
	)
}

const DropdownContainerElement = styled.div`
	width: 100%;
	height: ${height}px;
	position: relative;
	z-index: ${props => props.zIndex};
`

const DropdownElement = styled.div`
	display: flex;
	flex-direction: column;
	width: 100%;
	border: 1px solid ${colors.border};
	border-radius: 8px;
	background: white;
`

const DropdownArrowElement = styled(Arrow)`
	position: absolute;
	right: 18px;
	top: calc(50% - (12px / 2));
	width: 6px;
	height: 12px;
	pointer-events: none;
	color: #9f9f9f;

	${props => props.open ? "transform: rotate(90deg)" : null};
`

const DropdownOptionsElement = styled.div``

function Dropdown({ options, currentOptionId, placeholder, index, onSelection }) {
	const [ open, setOpen ] = React.useState(false)

	const currentOption = options.find(option => option.id === currentOptionId)

	return (
		<DropdownContainerElement zIndex={-index}>
			<DropdownElement>
				{
					open ? (
						<DropdownOptionsElement>
							{
								options.map((option) => {
									return (
										<DropdownItem
											isCurrent={option === currentOption}
											key={option.id}
											name={option.name}
											onClick={(event) => {
												setOpen(false)
												event.stopPropagation()
												onSelection(option.id)
											}}
										/>
									)
								})
							}
						</DropdownOptionsElement>
					) : (
						<DropdownItem
							primary
							isPlaceholder={!currentOption}
							name={currentOption ? currentOption.name : placeholder}
							onClick={(event) => {
								setOpen(true)
								event.stopPropagation()
							}}
						/>
					)
				}
			</DropdownElement>
			<DropdownArrowElement open={open} />
		</DropdownContainerElement>
	)
}

export default Dropdown