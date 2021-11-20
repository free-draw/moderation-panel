import React from "react"
import styled from "styled-components"
import useAsync from "../../util/useAsync"
import { getRobloxUser, getRobloxThumbnail, RobloxThumbnailType, Report } from "@free-draw/moderation-client"
import API from "../../API"

const DetailsUserElement = styled.a.attrs({
	target: "_blank",
})`
	display: flex;
	flex-direction: row;
`

const DetailsUserAvatarElement = styled.img`
	width: 48px;
	height: 48px;
	border-radius: 50%;
`

const DetailsUserTextElement = styled.div`
	margin-left: 14px;
	display: flex;
	flex-direction: column;
`

const DetailsUserLabelElement = styled.span`
	margin-bottom: 3px;
	color: rgba(0, 0, 0, 0.8);
	font-size: 15px;
	font-weight: 300;
	text-transform: lowercase;
`

const DetailsUserNameElement = styled.span`
	font-size: 18px;
	font-weight: 400;
`

const UserComponent = ({ id }: {
	id: number,
}) => {
	const user = useAsync(getRobloxUser)(API, id)
	const avatar = useAsync(getRobloxThumbnail, [ id ])(API, {
		id,
		type: RobloxThumbnailType.AVATAR_HEADSHOT,
		size: "100x100",
	})

	return (
		<DetailsUserElement href={`https://www.roblox.com/users/${id}/profile`}>
			<DetailsUserAvatarElement src={avatar ?? ""} />
			<DetailsUserTextElement>
				<DetailsUserLabelElement>From</DetailsUserLabelElement>
				<DetailsUserNameElement>{user ? user.name : null}</DetailsUserNameElement>
			</DetailsUserTextElement>
		</DetailsUserElement>
	)
}

const DetailsElement = styled.div`
	position: absolute;
	left: 30px;
	bottom: 30px;
	display: flex;
	flex-direction: column;
	pointer-events: none;

	> * {
		pointer-events: all;
	}
`

const NotesElement = styled.p`
	font-size: 18px;
	font-weight: 300;
	font-style: italic;
	margin: 0;
	margin-bottom: 20px;
	max-width: 300px;
`

const DetailsComponent = ({ report }: {
	report: Report,
}) => {
	return (
		<DetailsElement>
			<NotesElement>{`"${report.notes}"`}</NotesElement>
			<UserComponent id={report.from.id} />
		</DetailsElement>
	)
}

export default DetailsComponent