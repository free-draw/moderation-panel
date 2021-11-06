import React from "react"
import styled from "styled-components"
import useAsync from "/src/util/useAsync"
import { getUser } from "@free-draw/moderation-client"
import Page from "/src/components/Page"
import Details from "./Details"
import Actions from "./Actions"
import API from "/src/API"

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

	const user = useAsync(getUser)(API, userId)

	return (
		<UserPageElement>
			<Details userId={userId} />
			<ContentElement>
				{user ? <Actions user={user} /> : null}
			</ContentElement>
		</UserPageElement>
	)
}

export default UserPage

export {
	UserPageElement,
	ContentElement,
}