import React from "react"
import styled from "styled-components"
import ButtonStyle from "../enum/ButtonStyle"
import colors from "../presets/colors"

const TextButtonElement = styled.span.attrs({
	role: "button",
})`
	position: relative;
	padding: 0 18px;
	height: 34px;
	cursor: pointer;
	border-radius: 8px;
	font-size: 16px;
	font-weight: 400;
	display: flex;
	flex-direction: row;
	align-items: center;
	user-select: none;
`

const FlatTextButtonElement = styled(TextButtonElement)`
	color: black;

	&:hover {
		background: rgba(0, 0, 0, 0.1);
	}
`

const BorderedTextButtonElement = styled(FlatTextButtonElement)`
	border: 1px solid colors.$border;
`

const FilledTextButtonElement = styled(TextButtonElement)`
	color: white;
	background: ${colors.brand[600]};
	font-weight: 500;

	&:hover {
		background: ${colors.brand[700]};
	}
`

function getButtonElement(style?: ButtonStyle) {
	switch (style) {
		case ButtonStyle.FLAT:
			return FlatTextButtonElement
		case ButtonStyle.BORDERED:
			return BorderedTextButtonElement
		case ButtonStyle.FILLED:
			return FilledTextButtonElement
	}

	return FlatTextButtonElement
}

type TextButtonOptions = {
	text: string,
	style?: ButtonStyle,
	onClick: React.MouseEventHandler<HTMLSpanElement>,
}

function TextButton({ text, style, onClick }: TextButtonOptions) {
	const ButtonElement = getButtonElement(style)
	return (
		<ButtonElement
			onClick={(event) => {
				event.stopPropagation()
				return onClick(event)
			}}
		>
			{text}
		</ButtonElement>
	)
}

export default TextButton

export {
	TextButtonOptions,

	TextButtonElement,

	FlatTextButtonElement,
	BorderedTextButtonElement,
	FilledTextButtonElement,
}