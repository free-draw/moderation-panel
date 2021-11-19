import React from "react"
import styled from "styled-components"
import useAsync from "../../util/useAsync"
import { getUser } from "@free-draw/moderation-client"
import Page from "../../components/Page"
import Details from "./Details"
import Actions from "./Actions"
import API from "../../API"
import { useRouteMatch } from "react-router"

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

function UserPage() {
	const { params } = useRouteMatch<{
		userId: string,
	}>("/user")!
	const userId = parseInt(params.userId)

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