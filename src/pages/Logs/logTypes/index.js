import CreateActionLog from "./CreateActionLog"
import DiscardActionLog from "./DiscardActionLog"

import CreateModeratorLog from "./CreateModeratorLog"
import DeleteModeratorLog from "./DeleteModeratorLog"
import CreateModeratorAccountLog from "./CreateModeratorAccountLog"
import DeleteModeratorAccountLog from "./DeleteModeratorAccountLog"
import UpdateModeratorLog from "./UpdateModeratorLog"

import AcceptReportLog from "./AcceptReportLog"
import DeclineReportLog from "./DeclineReportLog"

export default {
	CREATE_ACTION: CreateActionLog,
	DISCARD_ACTION_BY_TYPE: DiscardActionLog,
	DISCARD_ACTION_BY_ID: DiscardActionLog,

	CREATE_MODERATOR: CreateModeratorLog,
	DELETE_MODERATOR: DeleteModeratorLog,
	CREATE_MODERATOR_ACCOUNT: CreateModeratorAccountLog,
	DELETE_MODERATOR_ACCOUNT: DeleteModeratorAccountLog,
	UPDATE_MODERATOR: UpdateModeratorLog,

	ACCEPT_REPORT: AcceptReportLog,
	DECLINE_REPORT: DeclineReportLog,
}