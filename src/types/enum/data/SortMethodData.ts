import SortMethod from "../SortMethod"
import { GetLogsOptions, SortDirection } from "@free-draw/moderation-client"

export const SortMethodOptions = {
	[SortMethod.TIME_ASCENDING]: { direction: SortDirection.DESCENDING },
	[SortMethod.TIME_DESCENDING]: { direction: SortDirection.ASCENDING },
} as Record<SortMethod, GetLogsOptions>