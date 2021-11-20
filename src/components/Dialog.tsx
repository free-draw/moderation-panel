import React from "react"
import ReactDOM from "react-dom"
import styled from "styled-components"
import TextButtonComponent, { TextButtonOptions } from "./TextButton"

export const DialogContainerElement = styled.div`
	position: fixed;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	display: flex;
	align-items: center;
	justify-content: center;
	background: rgba(0, 0, 0, 0.5);
	z-index: 100;
`

export const DialogElement = styled.div`
	display: flex;
	flex-direction: column;
	padding: 20px 0;
	border-radius: 12px;
	background: white;
	width: 340px;
`

export const DialogTitleElement = styled.span`
	font-size: 24px;
	font-weight: 700;
	margin: 0 25px;
`

export const DialogDescriptionElement = styled.span`
	font-size: 15px;
	font-weight: 400;
	line-height: 20px;
	margin: 0 25px;

	${DialogTitleElement} + & {
		margin-top: 8px;
	}
`

export const DialogEmbedElement = styled.div`
	margin: 20px 25px 0;
	z-index: 10;

	> * + * {
		margin-top: 10px;
	}
`

export const DialogButtonsElement = styled.div`
	display: flex;
	flex-direction: row;
	justify-content: flex-end;
	margin: 0 20px;
	margin-top: 20px;

	> * + * {
		margin-left: 10px;
	}
`

const DialogComponent = ({ title, description, buttons, onCancel, children }: {
	title?: string,
	description?: string,
	buttons?: (TextButtonOptions & { id: string })[],
	onCancel?: () => void,
	children?: React.ReactNode[],
}) => {
	return ReactDOM.createPortal((
		<DialogContainerElement
			onClick={(event) => {
				if (onCancel) {
					onCancel()
				}
				event.stopPropagation()
			}}
		>
			<DialogElement onClick={event => event.stopPropagation()}>
				{title ? <DialogTitleElement>{title}</DialogTitleElement> : null}
				{description ? <DialogDescriptionElement>{description}</DialogDescriptionElement> : null}
				{
					children ? (
						<DialogEmbedElement>
							{children}
						</DialogEmbedElement>
					) : null
				}
				{
					buttons ? (
						<DialogButtonsElement>
							{
								buttons.map((buttonData) => {
									return (
										<TextButtonComponent
											key={buttonData.id}
											text={buttonData.text}
											style={buttonData.style}
											onClick={buttonData.onClick}
										/>
									)
								})
							}
						</DialogButtonsElement>
					) : null
				}
			</DialogElement>
		</DialogContainerElement>
	), document.body)
}

export default DialogComponent