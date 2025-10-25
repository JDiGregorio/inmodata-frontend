import React, { useEffect, useState } from 'react'
import { ApolloError } from '@apollo/client'

import Spinner from '@/components/layouts/Spinner'
import ListView from './ListView'

import { useDebounce } from '@/utils/useDebounce'

import { ModelDefinition, Header, DataRow } from './ListView.types'
import { PaginatorInfo } from '@/generated-types'

export interface HandleRefetchingProps {
    first: number;
    page: number;
    search?: string;
}

export interface SearchableTableProps<T> {
    model: ModelDefinition;
    title: string;
    canCreate: boolean;
    canEdit: boolean;
    headers: Header[];
    data: DataRow<T>[];
    loading: boolean;
    error: ApolloError | undefined;
    paginatorInfo: Pick<PaginatorInfo, 'currentPage' | 'lastPage' | 'total'> | undefined;
    refetch: (args: HandleRefetchingProps) => void;
}

export const SearchableTable = <T,> ({ model, title, canCreate, canEdit, headers, data, loading, error, paginatorInfo, refetch }: SearchableTableProps<T>): React.ReactElement => {
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

    return (
        <ListView<T>
            model={model}
            title={title}
            canCreate={canCreate}
            canEdit={canEdit}
            headers={headers}
            data={data}
            searchQuery={searchQuery}
            paginatorInfo={paginatorInfo} 
            handlePageChanged={handlePageChanged}
            setSearchQuery={handleSearchQueryChanged}
        />
    )
}