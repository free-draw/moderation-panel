import React from "react"
import styled from "styled-components"
import Dropdown from "/src/components/Dropdown"

const OptionsGroupElement = styled.div`
	display: flex;
	flex-direction: column;

	& + & {
		margin-top: 20px;
	}
`

const OptionsGroupLabelElement = styled.span`
	font-size: 14px;
	font-weight: 700;
	letter-spacing: 3px;
	text-transform: uppercase;
`

const OptionsGroupContentsElement = styled.div`
	margin-top: 12px;
`

function OptionsGroup({ name, children }) {
	return (
		<OptionsGroupElement>
			<OptionsGroupLabelElement>{name}</OptionsGroupLabelElement>
			<OptionsGroupContentsElement>{children}</OptionsGroupContentsElement>
		</OptionsGroupElement>
	)
}

const OptionsElement = styled.div`
	width: 280px;
	padding: 20px;
	display: flex;
	flex-direction: column;
	background: #f4f4f4;
	border-radius: 12px;
	margin-right: 20px;
`

function Options({ sort, setSort, filter, setFilter }) {
	return (
		<OptionsElement>
			<OptionsGroup name="Sort">
				<Dropdown
					options={[
						{ id: "timeDescending", name: "Newest" },
						{ id: "timeAscending", name: "Oldest" },
					]}
					currentOptionId={sort}
					onSelection={setSort}
				/>
			</OptionsGroup>
			<OptionsGroup name="Filter">
				<Dropdown
					options={[
						{ id: null, name: "All" },

						{ id: "CREATE_ACTION", name: "Create Action" },
						{ id: "DISCARD_ACTION_BY_ID", name: "Discard Action (by ID)" },
						{ id: "DISCARD_ACTION_BY_TYPE", name: "Discard Action (by type)" },

						{ id: "CREATE_MODERATOR", name: "Create Moderator" },
						{ id: "DELETE_MODERATOR", name: "Delete Moderator" },
						{ id: "CREATE_MODERATOR_ACCOUNT", name: "Create Moderator Account" },
						{ id: "DELETE_MODERATOR_ACCOUNT", name: "Delete Moderator Account" },
						{ id: "UPDATE_MODERATOR", name: "Update Moderator" },

						{ id: "ACCEPT_REPORT", name: "Accept Report" },
						{ id: "DECLINE_REPORT", name: "Decline Report" },
					]}
					currentOptionId={filter}
					onSelection={setFilter}
				/>
			</OptionsGroup>
		</OptionsElement>
	)
}

export default Options

export {
	OptionsGroupElement,
	OptionsGroupLabelElement,
	OptionsGroupContentsElement,

	OptionsElement,
}