import React from 'react'
import axios from 'axios'

import { downloadBlob, getFilenameFromDisposition } from '@/lib/utils'

const BASE_URL = import.meta.env.APP_BASE_URL

export function useDownloadTemplate() {
    const abortRef = React.useRef<AbortController | null>(null)
    const [loading, setLoading] = React.useState(false)
    const [progress, setProgress] = React.useState<number | null>(null)

    const download = React.useCallback(async () => {
        if (loading) return

        setLoading(true)
        setProgress(0)
        abortRef.current?.abort()
        const controller = new AbortController()
        abortRef.current = controller

        try {
            const res = await axios.get(`${BASE_URL}/api/properties/export`, {
                responseType: 'blob',
                signal: controller.signal,
                onDownloadProgress: (e) => {
                    if (e.total) setProgress(Math.round((e.loaded * 100) / e.total))
                }
            })

            const filename =
                getFilenameFromDisposition(res.headers['content-disposition']) ||
                'formato_inmuebles.xlsx'

            downloadBlob(res.data, filename)
        } catch (err: any) {
            if (err.name === 'CanceledError' || err.code === 'ERR_CANCELED') {
            } else if (err.response?.status === 401) {
                console.error('No autenticado')
            } else if (err.response?.status === 403) {
                console.error('Sin permisos')
            } else {
                console.error('Error al descargar la plantilla', err)
            }
        } finally {
            setLoading(false)
            setProgress(null)
        }
    }, [loading])

    React.useEffect(() => {
        return () => abortRef.current?.abort()
    }, [])

    return { download, loading, progress }
}
