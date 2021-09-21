import React from "react"
import styled from "styled-components"
import useAsync from "/src/util/useAsync"

import { getUser } from "/src/api/users"

import Page from "/src/components/Page"

import Details from "./Details"
import Actions from "./Actions"

const UserPageElement = styled(Page)`
	display: flex;
	flex-direction: row;
	justify-content: center;
	padding: 50px 0;
`

const ContentElement = styled.div`
	width: 650px;
	display: flex;
	flex-direction: column;
`

function UserPage({ match }) {
	const { userId } = match.params

	const user = useAsync(getUser)(userId)

	return (
		<UserPageElement>
			<Details userId={userId} />
			<ContentElement>
				<Actions user={user} />
			</ContentElement>
		</UserPageElement>
	)
}

export default UserPage

export {
	UserPageElement,
	ContentElement,
}