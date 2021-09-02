import React from "react"
import ReactDOM from "react-dom"
import styled from "styled-components"

import TextButton from "/src/components/TextButton"

const DialogContainerElement = styled.div`
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

const DialogElement = styled.div`
	display: flex;
	flex-direction: column;
	padding: 20px 0;
	border-radius: 12px;
	background: white;
	width: 340px;
`

const DialogTitleElement = styled.span`
	font-size: 24px;
	font-weight: 700;
	margin: 0 25px;
`

const DialogDescriptionElement = styled.span`
	font-size: 15px;
	font-weight: 400;
	line-height: 20px;
	margin: 0 25px;

	${DialogTitleElement} + & {
		margin-top: 8px;
	}
`

const DialogEmbedElement = styled.div`
	margin: 20px 25px 0;
	z-index: 10;

	> * + * {
		margin-top: 10px;
	}
`

const DialogButtonsElement = styled.div`
	display: flex;
	flex-direction: row;
	justify-content: flex-end;
	margin: 0 20px;
	margin-top: 20px;

	> * + * {
		margin-left: 10px;
	}
`

function Dialog({ title, description, buttons, onCancel, children }) {
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
										<TextButton
											key={buttonData.id}
											text={buttonData.text}
											style={buttonData.style}
											variant={buttonData.variant}
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

export default Dialog