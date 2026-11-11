import { get } from 'lodash'

export const buildOptionsFromQueryResult = <TQuery, TUnidad>(queryResult: TQuery | undefined, path: string | []) => {
    const data: TUnidad[] | undefined = get(queryResult, path, undefined)

    const options =
        data?.map((item) => {
            return {
                ...item,
            }
        }) ?? []

    return options
}