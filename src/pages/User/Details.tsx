import React from "react"
import styled from "styled-components"
import useAsync from "../../util/useAsync"
import { getRobloxUser, getRobloxThumbnail, RobloxThumbnailType } from "@free-draw/moderation-client"
import API from "../../API"
import colors from "../../assets/colors"
import SpinnerComponent from "../../components/Spinner"

const DetailsElement = styled.div`
	width: 200px;
	display: flex;
	flex-direction: column;
	margin-right: 80px;
	align-items: center;
`

const DetailsAvatarContainerElement = styled.div`
	width: 200px;
	height: 200px;
	position: relative;
	display: flex;
	align-items: center;
	justify-content: center;
`

const DetailsAvatarElement = styled.img`
	width: 100%;
	height: 100%;
	border-radius: 50%;
`

const DetailsUsernameElement = styled.span`
	font-size: 24px;
	font-weight: 600;
	margin-top: 24px;
`

const DetailsProfileLinkElement = styled.a.attrs({
	target: "_blank",
})`
	font-size: 15px;
	font-weight: 400;
	color: ${colors.brand[600]};
	margin-top: 7px;
`

const DetailsComponent = ({ userId }: {
	userId: number,
}) => {
	const details = useAsync(getRobloxUser)(API, userId)
	const avatar = useAsync(getRobloxThumbnail, [ userId ])(API, {
		id: userId,
		type: RobloxThumbnailType.AVATAR_HEADSHOT,
		size: "420x420",
	})

	return (
		<DetailsElement>
			{
				details ? (
					<>
						<DetailsAvatarContainerElement>
							{
								avatar ? (
									<DetailsAvatarElement src={avatar} />
								) : <SpinnerComponent />
							}
						</DetailsAvatarContainerElement>
						<DetailsUsernameElement>{details.name}</DetailsUsernameElement>
						<DetailsProfileLinkElement href={`https://www.roblox.com/users/${userId}/profile`}>
							Go to Roblox profile
						</DetailsProfileLinkElement>
					</>
				) : <SpinnerComponent />
			}
		</DetailsElement>
	)
}

export default DetailsComponent

