import React from "react"
import styled from "styled-components"

import useAsync from "/src/util/useAsync"

import { getRobloxUser, getRobloxThumbnail } from "/src/api/roblox"

import colors from "/src/presets/colors"

import Spinner from "/src/components/Spinner"

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

function Details({ userId }) {
	const details = useAsync(getRobloxUser)(userId)
	const avatar = useAsync(getRobloxThumbnail)("AvatarHeadShot", userId, "420x420")

	return (
		<DetailsElement loading={!details}>
			{
				details ? (
					<>
						<DetailsAvatarContainerElement>
							{
								avatar ? (
									<DetailsAvatarElement src={avatar} />
								) : <Spinner />
							}
						</DetailsAvatarContainerElement>
						<DetailsUsernameElement>{details.name}</DetailsUsernameElement>
						<DetailsProfileLinkElement href={`https://www.roblox.com/users/${userId}/profile`}>
							Go to Roblox profile
						</DetailsProfileLinkElement>
					</>
				) : <Spinner />
			}
		</DetailsElement>
	)
}

export default Details

