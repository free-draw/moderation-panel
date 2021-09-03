import React from "react"
import styled from "styled-components"

import useAsync from "/src/util/useAsync"

import Maid from "/src/class/Maid"

import { getUser } from "/src/api/users"

import Page from "/src/components/Page"
import Spinner from "/src/components/Spinner"

import Action from "./Action"
import Details from "./Details"

const ContentSectionElement = styled.div`
	display: flex;
	flex-direction: column;
`

const ContentSectionHeaderElement = styled.span`
	font-size: 24px;
	font-weight: 600;
`

const ContentSectionContainerElement = styled.div`
	margin-top: 20px;
	display: flex;
	flex-direction: column;
`

function ContentSection({ name, loading, children }) {
	return (
		<ContentSectionElement>
			<ContentSectionHeaderElement>{name}</ContentSectionHeaderElement>
			<ContentSectionContainerElement>
				{loading ? <Spinner /> : children}
			</ContentSectionContainerElement>
		</ContentSectionElement>
	)
}

const UserPageElement = styled(Page)`
	display: flex;
	flex-direction: row;
	justify-content: center;
	padding: 50px 0;
`

const ContentElement = styled.div`
	width: 550px;
	display: flex;
	flex-direction: column;
`

function UserPage({ match }) {
	const { userId } = match.params

	const user = useAsync(getUser)(userId)

	const [ actions, setActions ] = React.useState(null)
	React.useEffect(() => {
		setActions(null)

		if (user) {
			function update() {
				setActions([].concat(user.actions, user.history))
			}

			const maid = new Maid()
			maid.listen(user, "actionCreate", update)
			maid.listen(user, "actionDelete", update)

			update()

			return () => maid.clean()
		}
	}, [ user ])

	let actionElements
	if (actions) {
		actionElements = [ ...actions ]
			.sort((B, A) => A.timestamp.getTime() - B.timestamp.getTime())
			.map(action => <Action key={action.id} action={action} />)
	}

	return (
		<UserPageElement>
			<Details userId={userId} />
			<ContentElement>
				<ContentSection name="Actions" loading={!actionElements}>
					{actionElements}
				</ContentSection>
			</ContentElement>
		</UserPageElement>
	)
}

export default UserPage

export {
	ContentSectionElement,
	ContentSectionHeaderElement,
	ContentSectionContainerElement,

	UserPageElement,
	ContentElement,
}