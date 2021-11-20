import React from "react"
import styled from "styled-components"
import Icon from "@mdi/react"
import colors from "../assets/colors"
import Arrow from "../assets/arrow.svg"

const height = 42

export const DropdownItemElement = styled.div<{
	isPrimary?: boolean,
	isPlaceholder?: boolean,
}>`
	display: flex;
	flex-direction: row;
	align-items: center;
	width: 100%;
	height: ${height}px;
	cursor: pointer;
	border-radius: 8px;

	${props => props.isPlaceholder ? "color: rgba(0, 0, 0, 0.5)" : null};
	${props => !props.isPrimary ? "&:hover { background: rgba(0, 0, 0, 0.1) }" : null};

	svg {
		margin-left: 8px;
	}
`

export const DropdownItemNameElement = styled.span`
	margin-left: 12px;
	font-size: 16px;
	font-weight: 400;
`

const DropdownItemComponent = ({ isPrimary, name, icon, isPlaceholder, onClick }: {
	isPrimary?: boolean,
	name: string,
	icon?: string,
	isPlaceholder?: boolean,
	onClick: React.MouseEventHandler<HTMLDivElement>,
}) => {
	return (
		<DropdownItemElement
			isPrimary={isPrimary}
			isPlaceholder={isPlaceholder}
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

export const DropdownContainerElement = styled.div<{
	zIndex: number,
}>`
	width: 100%;
	height: ${height}px;
	position: relative;
	z-index: ${props => props.zIndex};
`

export const DropdownElement = styled.div`
	display: flex;
	flex-direction: column;
	width: 100%;
	border: 1px solid ${colors.border};
	border-radius: 8px;
	background: white;
`

export const DropdownArrowElement = styled(Arrow)<{
	isOpen: boolean,
}>`
	position: absolute;
	right: 18px;
	top: calc(50% - (12px / 2));
	width: 6px;
	height: 12px;
	pointer-events: none;
	color: #9f9f9f;

	${props => props.isOpen ? "transform: rotate(90deg)" : null};
`

export const DropdownOptionsElement = styled.div``

export type DropdownOption = {
	id: any,
	name: string,
}

const DropdownComponent = ({ options, currentOptionId, placeholder, index, onSelection }: {
	options: DropdownOption[],
	currentOptionId: any,
	placeholder: string,
	index?: number,
	onSelection: (id: any) => void,
}) => {
	const [ open, setOpen ] = React.useState<boolean>(false)

	const currentOption = options.find(option => option.id === currentOptionId)

	return (
		<DropdownContainerElement zIndex={index ? 100 - index : 0}>
			<DropdownElement>
				{
					open ? (
						<DropdownOptionsElement>
							{
								options.map((option) => {
									return (
										<DropdownItemComponent
											key={option.id}
											name={option.name}
											onClick={(event) => {
												setOpen(false)
												onSelection(option.id)
												event.stopPropagation()
											}}
										/>
									)
								})
							}
						</DropdownOptionsElement>
					) : (
						<DropdownItemComponent
							isPrimary
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
			<DropdownArrowElement isOpen={open} />
		</DropdownContainerElement>
	)
}

export default DropdownComponent