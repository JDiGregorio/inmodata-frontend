import { useEffect, useState } from 'react'
import { useApolloClient } from '@apollo/client'
import { PreAppraisalCalculationInput, PreviewPreAppraisalDocument, PreviewPreAppraisalQuery } from '@/generated-types'

export function useCurrentPreAppraisalPreview(input: PreAppraisalCalculationInput | null) {
    const client = useApolloClient()
    const [revision, setRevision] = useState(0)
    const [result, setResult] = useState<{ key: string; data?: PreviewPreAppraisalQuery; error?: Error }>()
    const serialized = JSON.stringify(input)
    const key = `${revision}:${serialized}`
    useEffect(() => {
        let active = true
        if (serialized === 'null') return
        const timer = setTimeout(() => {
            void client.query<PreviewPreAppraisalQuery>({
                query: PreviewPreAppraisalDocument,
                variables: { input: JSON.parse(serialized) },
                fetchPolicy: 'no-cache', errorPolicy: 'none',
            }).then(({ data }) => {
                if (active) setResult({ key, data })
            }).catch((error: Error) => {
                if (active) setResult({ key, error })
            })
        }, 650)
        return () => { active = false; clearTimeout(timer) }
    }, [client, serialized, key])
    // Hide the previous response immediately, including the debounce interval.
    const current = result?.key === key ? result : undefined
    return { data: current?.data, error: current?.error, loading: input !== null && !current,
        recalculate: () => setRevision(value => value + 1) }
}
