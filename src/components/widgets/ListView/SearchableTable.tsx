import React, { useEffect, useState } from "react"

import ListView, { ModelDefinition } from "./ListView"
import Spinner from "@/components/layouts/Spinner"

import { useDebounce } from "@/utils/useDebounce"
import { ApolloError } from "@apollo/client"

import { PaginatorInfo } from "@/generated-types"

export interface HandleRefetchingProps {
    first: number
    page: number
    search?: string
}

export interface SearchableTableProps {
    title: string
    canCreate: boolean
    canEdit: boolean
    headers: string[]
    model: ModelDefinition
    loading: boolean
    error: ApolloError | undefined
    data: string[][]
    paginatorInfo: Pick<PaginatorInfo, 'currentPage' | 'lastPage' | 'total'> | undefined
    refetch: (args: HandleRefetchingProps) => void
}

export const SearchableTable = ({ title, canCreate, canEdit, headers, model, loading, error, data, paginatorInfo, refetch }: SearchableTableProps): React.ReactElement => {
    const [searchQuery, setSearchQuery] = useState("")
    const debouncedSearchTerm = useDebounce(searchQuery, 500)
    const [currentPage, setCurrentPage] = useState(1)

    useEffect(() => {

        const refetchArgs = {
            first: 10,
            page: debouncedSearchTerm.length > 0 ? 1 : currentPage,
            search: debouncedSearchTerm
        }

        refetch(refetchArgs)

    }, [refetch, debouncedSearchTerm, currentPage])

    const handlePageChanged = (newPage: number) => {
        setCurrentPage(newPage)
    }

    const handleSearchQueryChanged = (query: string): void => {
        setSearchQuery(query)
    }

    if (loading) {
        return <Spinner />
    }

    if (error) {
        return <>Oops, algo salio mal.</>
    }

    if (!paginatorInfo || !data) {
        return <></>
    } 

    return <ListView
        title={title}
        canCreate={canCreate}
        canEdit={canEdit}
        paginatorInfo={paginatorInfo} 
        headers={headers} 
        data={data}
        model={model}
        handlePageChanged={handlePageChanged}
        searchQuery={searchQuery}
        setSearchQuery={handleSearchQueryChanged}
    />
}