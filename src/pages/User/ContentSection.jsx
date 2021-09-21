import React from "react"
import styled from "styled-components"

import IconButton from "/src/components/IconButton"
import TextButton from "/src/components/TextButton"
import Spinner from "/src/components/Spinner"

const ContentSectionStatusElement = styled.div`
	height: 80px;
	display: flex;
	flex-direction: row;
	align-items: center;
	justify-content: center;
`

const ContentSectionStatusEmptyElement = styled.span`
	color: rgba(0, 0, 0, 0.5);
	font-size: 16px;
	font-weight: 400;
`

function ContentSectionStatus({ status }) {
	switch (status) {
		case "LOADED":
			return null

		case "LOADING":
			return (
				<ContentSectionStatusElement>
					<Spinner />
				</ContentSectionStatusElement>
			)

		case "EMPTY":
			return (
				<ContentSectionStatusElement>
					<ContentSectionStatusEmptyElement>There's nothing here.</ContentSectionStatusEmptyElement>
				</ContentSectionStatusElement>
			)
	}
}

const ContentSectionElement = styled.div`
	display: flex;
	flex-direction: column;
`

const ContentSectionHeaderElement = styled.div`
	height: 32px;
	width: 100%;
	display: flex;
	flex-direction: row;
`

const ContentSectionHeaderTextElement = styled.span`
	font-size: 24px;
	font-weight: 600;
`

const ContentSectionHeaderSpacerElement = styled.div`
	flex-grow: 1;
`

const ContentSectionHeaderButtonsElement = styled.div`
	flex-direction: row;

	> * + * {
		margin-left: 8px;
	}
`

const ContentSectionContainerElement = styled.div`
	margin-top: 20px;
	display: flex;
	flex-direction: column;
`

const ContentSectionFooterElement = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	height: 80px;
`

function ContentSection({ name, buttons, status, children }) {
	const [ expanded, setExpanded ] = React.useState(false)

	return (
		<ContentSectionElement>
			<ContentSectionHeaderElement>
				<ContentSectionHeaderTextElement>{name}</ContentSectionHeaderTextElement>
				<ContentSectionHeaderSpacerElement />
				<ContentSectionHeaderButtonsElement>
					{buttons.map(buttonData => <IconButton key={buttonData.id} {...buttonData} />)}
				</ContentSectionHeaderButtonsElement>
			</ContentSectionHeaderElement>
			<ContentSectionContainerElement>
				{
					children && children.length > 0 ? (
						expanded ? children : children.slice(0, 3)
					) : <ContentSectionStatus status={status} />
				}
				{
					children && children.length > 3 ? (
						<ContentSectionFooterElement>
							<TextButton
								text={expanded ? "Show Less" : "Show More"}
								style="flat"
								onClick={() => setExpanded(!expanded)}
							/>
						</ContentSectionFooterElement>
					) : null
				}
			</ContentSectionContainerElement>
		</ContentSectionElement>
	)
}

export default ContentSection

export {
	ContentSectionStatusElement,
	ContentSectionStatusEmptyElement,

	ContentSectionElement,
	ContentSectionHeaderElement,
	ContentSectionHeaderTextElement,
	ContentSectionHeaderSpacerElement,
	ContentSectionHeaderButtonsElement,
	ContentSectionContainerElement,
	ContentSectionFooterElement,
}