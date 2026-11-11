import { InMemoryCache } from '@apollo/client'

export function createApolloCache() {
    return new InMemoryCache({
        typePolicies: {
            // Price and risk reuse a valuation ID but represent different measurements.
            ValuationHistoryPoint: { keyFields: false },
        },
    })
}
