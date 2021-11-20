import React from "react"
import styled from "styled-components"
import Dropdown from "../../components/Dropdown"
import { LogType } from "@free-draw/moderation-client"
import SortMethod from "../../types/enum/SortMethod"

export const OptionsGroupElement = styled.div`
	display: flex;
	flex-direction: column;

	& + & {
		margin-top: 20px;
	}
`

export const OptionsGroupLabelElement = styled.span`
	font-size: 14px;
	font-weight: 700;
	letter-spacing: 3px;
	text-transform: uppercase;
`

export const OptionsGroupContentsElement = styled.div`
	margin-top: 12px;
`

const OptionsGroupComponent = ({ name, children }: {
	name: React.ReactNode,
	children?: React.ReactNode,
}) => {
	return (
		<OptionsGroupElement>
			<OptionsGroupLabelElement>{name}</OptionsGroupLabelElement>
			<OptionsGroupContentsElement>{children}</OptionsGroupContentsElement>
		</OptionsGroupElement>
	)
}

export const OptionsElement = styled.div`
	width: 280px;
	padding: 20px;
	display: flex;
	flex-direction: column;
	background: #f4f4f4;
	border-radius: 12px;
	margin-right: 20px;
`

const OptionsComponent = ({ sort, setSort, filter, setFilter }: {
	sort: SortMethod,
	setSort: (sort: SortMethod) => void,
	filter: LogType | null,
	setFilter: (filter: LogType) => void,
}) => {
	return (
		<OptionsElement>
			<OptionsGroupComponent name="Sort">
				<Dropdown
					options={[
						{ id: "timeDescending", name: "Newest" },
						{ id: "timeAscending", name: "Oldest" },
					]}
					placeholder="Sort"
					currentOptionId={sort}
					onSelection={setSort}
				/>
			</OptionsGroupComponent>
			<OptionsGroupComponent name="Filter">
				<Dropdown
					options={[
						{ id: null, name: "All" },

						{ id: "CREATE_ACTION", name: "Create Action" },
						{ id: "DELETE_ACTION", name: "Delete Action" },
						{ id: "DELETE_ACTIONS_BULK", name: "Delete Actions Bulk" },

						{ id: "CREATE_MODERATOR", name: "Create Moderator" },
						{ id: "DELETE_MODERATOR", name: "Delete Moderator" },
						{ id: "LINK_MODERATOR_ACCOUNT", name: "Link Moderator Account" },
						{ id: "UNLINK_MODERATOR_ACCOUNT", name: "Unlink Moderator Account" },
						{ id: "UPDATE_MODERATOR", name: "Update Moderator" },

						{ id: "ACCEPT_REPORT", name: "Accept Report" },
						{ id: "DECLINE_REPORT", name: "Decline Report" },
					]}
					placeholder="Filter"
					currentOptionId={filter}
					onSelection={setFilter}
				/>
			</OptionsGroupComponent>
		</OptionsElement>
	)
}

export default OptionsComponent