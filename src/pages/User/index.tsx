import React from "react"
import styled from "styled-components"
import useAsync from "../../util/useAsync"
import { getUser } from "@free-draw/moderation-client"
import PageComponent from "../../components/Page"
import DetailsComponent from "./Details"
import ActionsComponent from "./Actions"
import API from "../../API"
import { useRouteMatch } from "react-router"

const UserPageElement = styled(PageComponent)`
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

function UserPageComponent() {
	const { params } = useRouteMatch<{
		userId: string,
	}>("/user")!
	const userId = parseInt(params.userId)

	const user = useAsync(getUser)(API, userId)

	return (
		<UserPageElement>
			<DetailsComponent userId={userId} />
			<ContentElement>
				{user ? <ActionsComponent user={user} /> : null}
			</ContentElement>
		</UserPageElement>
	)
}

export default UserPageComponent

export {
	UserPageElement,
	ContentElement,
}