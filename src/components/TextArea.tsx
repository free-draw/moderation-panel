import styled from "styled-components"
import colors from "../assets/colors"

const TextAreaElement = styled.textarea`
	position: relative;
	background: white;
	color: black;
	font-size: 16px;
	font-weight: 400;
	width: 100%;
	padding: 12px;
	border: 1px solid ${colors.border};
	border-radius: 8px;
	resize: none;

	&:placeholder {
		color: rgba(0, 0, 0, 0.5);
	}

	&:focus-visible {
		border: 1px solid ${colors.brand};
		outline: none;
	}
`

export default TextAreaElement