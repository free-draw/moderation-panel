import React from "react"
import styled from "styled-components"
import IconButtonComponent, { IconButtonOptions } from "../../components/IconButton"
import TextButtonComponent from "../../components/TextButton"
import SpinnerComponent from "../../components/Spinner"
import ButtonStyle from "../../types/enum/ButtonStyle"

export enum ContentSectionStatus {
	LOADED = "LOADED",
	LOADING = "LOADING",
	EMPTY = "EMPTY",
}

export const ContentSectionStatusElement = styled.div`
	height: 80px;
	display: flex;
	flex-direction: row;
	align-items: center;
	justify-content: center;
`

export const ContentSectionStatusEmptyElement = styled.span`
	color: rgba(0, 0, 0, 0.5);
	font-size: 16px;
	font-weight: 400;
`

const ContentSectionStatusComponent = ({ status }: {
	status: ContentSectionStatus,
}) => {
	switch (status) {
		case ContentSectionStatus.LOADED:
			return null

		case ContentSectionStatus.LOADING:
			return (
				<ContentSectionStatusElement>
					<SpinnerComponent />
				</ContentSectionStatusElement>
			)

		case ContentSectionStatus.EMPTY:
			return (
				<ContentSectionStatusElement>
					<ContentSectionStatusEmptyElement>There's nothing here.</ContentSectionStatusEmptyElement>
				</ContentSectionStatusElement>
			)
	}
}

export const ContentSectionElement = styled.div`
	display: flex;
	flex-direction: column;
`

export const ContentSectionHeaderElement = styled.div`
	height: 32px;
	width: 100%;
	display: flex;
	flex-direction: row;
`

export const ContentSectionHeaderTextElement = styled.span`
	font-size: 24px;
	font-weight: 600;
`

export const ContentSectionHeaderSpacerElement = styled.div`
	flex-grow: 1;
`

export const ContentSectionHeaderButtonsElement = styled.div`
	flex-direction: row;

	> * + * {
		margin-left: 8px;
	}
`

export const ContentSectionContainerElement = styled.div`
	margin-top: 20px;
	display: flex;
	flex-direction: column;
`

export const ContentSectionFooterElement = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	height: 80px;
`

const ContentSectionComponent = ({ name, buttons, status, children }: {
	name: string,
	buttons: (IconButtonOptions & { id: string })[],
	status: ContentSectionStatus,
	children?: React.ReactNode[],
}) => {
	const [ expanded, setExpanded ] = React.useState<boolean>(false)

	return (
		<ContentSectionElement>
			<ContentSectionHeaderElement>
				<ContentSectionHeaderTextElement>{name}</ContentSectionHeaderTextElement>
				<ContentSectionHeaderSpacerElement />
				<ContentSectionHeaderButtonsElement>
					{buttons.map(buttonData => <IconButtonComponent key={buttonData.id} {...buttonData} />)}
				</ContentSectionHeaderButtonsElement>
			</ContentSectionHeaderElement>
			<ContentSectionContainerElement>
				{
					children && children.length > 0 ? (
						expanded ? children : children.slice(0, 3)
					) : <ContentSectionStatusComponent status={status} />
				}
				{
					children && children.length > 3 ? (
						<ContentSectionFooterElement>
							<TextButtonComponent
								text={expanded ? "Show Less" : "Show More"}
								style={ButtonStyle.FLAT}
								onClick={() => setExpanded(!expanded)}
							/>
						</ContentSectionFooterElement>
					) : null
				}
			</ContentSectionContainerElement>
		</ContentSectionElement>
	)
}

export default ContentSectionComponent