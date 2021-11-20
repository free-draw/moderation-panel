import styled from "styled-components"
import colors from "../assets/colors"

const TextBoxElement = styled.input.attrs({
	type: "text",
})`
	background: white;
	color: black;
	font-size: 16px;
	font-weight: 400;
	height: 42px;
	width: 100%;
	padding-left: 12px;
	border: 1px solid ${colors.border};
	border-radius: 8px;

	&:placeholder {
		color: rgba(0, 0, 0, 0.5);
	}

	&:focus-visible {
		border: 1px solid ${colors.brand};
		outline: none;
	}
`

export default TextBoxElement