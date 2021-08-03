import React from "react"
import ReactDOM from "react-dom"

import TextButton from "/src/components/TextButton"

import "./style.scss"

function Dialog(props) {
	return ReactDOM.createPortal((
		<div
			className="dialog-container"
			onClick={(event) => {
				if (props.onCancel) {
					props.onCancel()
				}
				event.stopPropagation()
			}}
		>
			<div className="dialog" onClick={event => event.stopPropagation()}>
				{props.title ? <span className="dialog-title">{props.title}</span> : null}
				{props.description ? <span className="dialog-description">{props.description}</span> : null}
				{
					props.children ? (
						<div className="dialog-embed">
							{props.children}
						</div>
					) : null
				}
				{
					props.buttons ? (
						<div className="dialog-buttons">
							{
								props.buttons.map((buttonData) => {
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
						</div>
					) : null
				}
			</div>
		</div>
	), document.body)
}

export default Dialog