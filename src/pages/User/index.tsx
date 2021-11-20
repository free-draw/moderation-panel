import React from "react"
import styled from "styled-components"
import useAsync from "../../util/useAsync"
import { getUser } from "@free-draw/moderation-client"
import DetailsComponent from "./Details"
import ActionsComponent from "./Actions"
import API from "../../API"
import { useRouteMatch } from "react-router"

export const UserPageElement = styled.div`
	display: flex;
	flex-direction: row;
	justify-content: center;
	padding: 50px 0;
`

export const ContentElement = styled.div`
	width: 650px;
	display: flex;
	flex-direction: column;
`

const UserPageComponent = () => {
	const { params } = useRouteMatch<{
		userId: string,
	}>("/users/:userId")!
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