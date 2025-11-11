import React from 'react'
import axios, { AxiosError } from 'axios'
import { CloudUploadIcon, Trash2Icon, PauseIcon, PlayIcon } from 'lucide-react'

type UploadStatus = 'idle' | 'ready' | 'uploading' | 'paused' | 'done' | 'error'

interface ExcelImportUploaderProps {
    onUploaded?: (response: any) => void;
    onError?: (error: AxiosError | Error) => void;
}

const BASE_URL = import.meta.env.APP_BASE_URL

export const ExcelImportUploader = ({ onUploaded, onError }: ExcelImportUploaderProps): React.ReactElement => {
    const [file, setFile] = React.useState<File | null>(null)
    const [status, setStatus] = React.useState<UploadStatus>('idle')
    const [progress, setProgress] = React.useState(0)
    const [speed, setSpeed] = React.useState<number | null>(null)
    const [errorMsg, setErrorMsg] = React.useState<string | null>(null)

    const controllerRef = React.useRef<AbortController | null>(null)
    const startTimeRef = React.useRef<number | null>(null)

    const reset = () => {
        controllerRef.current?.abort()
        controllerRef.current = null
        setFile(null)
        setStatus('idle')
        setProgress(0)
        setSpeed(null)
        setErrorMsg(null)
        startTimeRef.current = null
    }

    const formatSize = (bytes: number): string => {
        if (!bytes) return '0 B'
        const units = ['B', 'KB', 'MB', 'GB']
        let i = 0
        let value = bytes

        while (value >= 1024 && i < units.length - 1) {
            value = value / 1024
            i++
        }

        return `${value.toFixed(1)} ${units[i]}`
    }

    const validateFile = (file: File): string | null => {
        const ext = file.name.split('.').pop()?.toLowerCase()

        if (!ext || !['xls', 'xlsx'].includes(ext)) {
            return 'Solo se permiten archivos .xls o .xlsx.'
        }

        return null
    }

    const handleSelectFile = (e: React.ChangeEvent<HTMLInputElement>) => {
        const f = e.target.files?.[0]
        if (!f) return

        const err = validateFile(f)

        if (err) {
            setErrorMsg(err)
            e.target.value = ''
            return
        }

        setErrorMsg(null)
        setFile(f)
        setStatus('ready')
        setProgress(0)
        setSpeed(null)
    }

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault()
        e.stopPropagation()

        const f = e.dataTransfer.files?.[0]
        if (!f) return

        const err = validateFile(f)
        
        if (err) {
            setErrorMsg(err)
            return
        }

        setErrorMsg(null)
        setFile(f)
        setStatus('ready')
        setProgress(0)
        setSpeed(null)
    }

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault()
        e.stopPropagation()
    }

    const startUpload = async () => {
        if (!file || status === 'uploading') return

        setErrorMsg(null)
        setStatus('uploading')
        setProgress(0)
        setSpeed(null)

        const controller = new AbortController()
        controllerRef.current = controller
        startTimeRef.current = performance.now()

        try {
            const formData = new FormData()
            formData.append('file', file)

            const response = await axios.post(`${BASE_URL}/api/properties/import`, formData, {
                signal: controller.signal,
                withCredentials: true,
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
                onUploadProgress: (event) => {
                    if (!event.total) return

                    const percent = Math.round((event.loaded / event.total) * 100)
                    setProgress(percent)

                    const now = performance.now()
                    const start = startTimeRef.current ?? now
                    const elapsedSeconds = (now - start) / 1000

                    if (elapsedSeconds > 0) {
                        const mb = event.loaded / (1024 * 1024)
                        const mbps = mb / elapsedSeconds
                        setSpeed(mbps)
                    }
                },
            })

            setStatus('done')
            setSpeed(null)

            if (onUploaded) {
                reset()
                onUploaded(response.data)
            }
        } catch (err: any) {
            if (axios.isCancel(err)) {
                if (status !== 'paused') {
                    setStatus('paused')
                }
                return
            }

            console.error('Upload error', err)
            setStatus('error')
            setErrorMsg('Ocurrió un error al subir el archivo.')
            if (onError) onError(err)
        } finally {
            controllerRef.current = null
            startTimeRef.current = null
        }
    }

    const pauseUpload = () => {
        if (status === 'uploading' && controllerRef.current) {
            controllerRef.current.abort()
            setStatus('paused')
        }
    }

    const resumeUpload = () => {
        if (!file) return
        startUpload()
    }

    const removeFile = () => {
        reset()
    }

    const showDropzone = !file || status === 'idle'

    const statusLabel = (() => {
        if (!file) return ''
        switch (status) {
            case 'ready':
                return 'Listo para subir'
            case 'uploading':
                return `Subiendo${progress > 0 ? ` ${progress}%` : '...'}`

            case 'paused':
                return 'Pausado'
            case 'done':
                return 'Completado'
            case 'error':
                return 'Error al subir'
            default:
                return ''
        }
    })()

    return (
        <div className="space-y-4">
            {file && (
                <div className="w-full rounded-md border border-gray-200 bg-white px-3 py-3 shadow-sm">
                    <div className="flex items-start gap-2">
                        <div className="flex-1">
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium text-gray-700 truncate">
                                    {file.name}
                                </span>

                                <span className="text-xs text-gray-400 ml-2 whitespace-nowrap">
                                    {status === 'uploading' && speed ? `${speed.toFixed(1)} MB/s` : formatSize(file.size)}
                                </span>
                            </div>

                            <div className="mt-2 h-2 overflow-hidden rounded-full bg-gray-200">
                                <div className={`h-full rounded-full ${status === 'done' ? 'bg-emerald-500' : status === 'error' ? 'bg-red-500' : 'bg-blue-500'}`} style={{ width: `${Math.max(progress, status === 'done' ? 100 : 0)}%` }} />
                            </div>

                            <p className={'mt-1 text-xs ' + (status === 'error' ? 'text-red-500' : status === 'done' ? 'text-emerald-600' : status === 'paused' ? 'text-blue-500' : 'text-gray-500')}>
                                {statusLabel}
                            </p>

                            {errorMsg && (
                                <p className="mt-1 text-xs text-red-500">
                                    {errorMsg}
                                </p>
                            )}
                        </div>

                        <div className="flex flex-col items-center gap-1 ml-2">
                            {status === 'uploading' && (
                                <button type="button" onClick={pauseUpload} className="inline-flex items-center justify-center rounded-full bg-gray-100 p-1.5 text-gray-600 hover:bg-gray-200" title="Pausar subida">
                                    <PauseIcon className="h-4 w-4" />
                                </button>
                            )}

                            {(status === 'paused' || status === 'error') && (
                                <button type="button" onClick={resumeUpload} className="inline-flex items-center justify-center rounded-full bg-blue-50 p-1.5 text-blue-600 hover:bg-blue-100" title="Reanudar subida">
                                    <PlayIcon className="h-4 w-4" />
                                </button>
                            )}

                            <button type="button" onClick={removeFile} className="inline-flex items-center justify-center rounded-full bg-red-50 p-1.5 text-red-500 hover:bg-red-100 cursor-pointer" title="Eliminar archivo">
                                <Trash2Icon className="h-4 w-4" />
                            </button>
                        </div>
                    </div>

                    {status === 'ready' && (
                        <div className="mt-3 flex justify-end">
                            <button type="button" onClick={startUpload} className="rounded-md bg-blue-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-blue-700 cursor-pointer">
                                Procesar Inmuebles
                            </button>
                        </div>
                    )}
                </div>
            )}

            {showDropzone && (
                <div className="flex flex-col items-center justify-center rounded-lg border-4 border-dashed border-gray-200 px-4 py-10 text-center" onDrop={handleDrop} onDragOver={handleDragOver}>
                    <CloudUploadIcon size={60} className="text-gray-300" />

                    <p className="mt-4 text-xl font-medium text-gray-800">
                        Arrastra tu archivo aquí
                    </p>

                    <label className="mt-3 inline-flex cursor-pointer items-center rounded-full border bg-white px-4 py-1 text-sm font-normal text-blue-500 shadow-sm hover:bg-blue-50">
                        <input className="hidden" type="file" name="file" accept=".xls,.xlsx" onChange={handleSelectFile} />
                        Seleccionar Archivo
                    </label>

                    <p className="mt-2 text-xs text-gray-400">
                        Solo se permite un archivo .xls o .xlsx a la vez.
                    </p>

                    {errorMsg && (
                        <p className="mt-1 text-xs text-red-500">
                            {errorMsg}
                        </p>
                    )}
                </div>
            )}
        </div>
    )
}
