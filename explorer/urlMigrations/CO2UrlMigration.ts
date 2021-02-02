import { legacyToCurrentGrapherUrl } from "../../grapher/core/GrapherUrlMigrations"
import { Url } from "../../urls/Url"
import { UrlMigration } from "../../urls/UrlMigration"
import {
    decodeURIComponentOrUndefined,
    patchFromQueryParams,
    transformQueryParams,
} from "./ExplorerUrlMigrationUtils"

const co2QueryParamTransformMap: Record<
    string,
    {
        newName: string
        transformValue: (value: string | undefined) => string | undefined
    }
> = {
    [encodeURIComponent("Gas ")]: {
        newName: "Gas Radio",
        transformValue: decodeURIComponentOrUndefined,
    },
    [encodeURIComponent("Accounting ")]: {
        newName: "Accounting Radio",
        transformValue: decodeURIComponentOrUndefined,
    },
    [encodeURIComponent("Fuel ")]: {
        newName: "Fuel Dropdown",
        transformValue: decodeURIComponentOrUndefined,
    },
    [encodeURIComponent("Count ")]: {
        newName: "Count Dropdown",
        transformValue: decodeURIComponentOrUndefined,
    },
    [encodeURIComponent("Relative to world total ")]: {
        newName: "Relative to world total Checkbox",
        transformValue: (value) => (value ? "true" : "false"),
    },
}

export const co2UrlMigration: UrlMigration = (url: Url) => {
    // if there is no patch param, then it's an old URL
    if (!url.queryParams.patch) {
        url = legacyToCurrentGrapherUrl(url)
        const queryParams = transformQueryParams(
            url.queryParams,
            co2QueryParamTransformMap
        )
        return url.setQueryParams({
            patch: patchFromQueryParams(queryParams).uriEncodedString,
        })
    }
    return url
}
