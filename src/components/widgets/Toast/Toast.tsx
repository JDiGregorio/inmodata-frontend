import React from 'react'
import { CheckCircleIcon, ExclamationTriangleIcon, XMarkIcon } from '@heroicons/react/20/solid'
import { ToastType, styles } from './constants'

interface ToastProps {
    message: string
    onDismiss: () => void
    type: ToastType
}

export const Toast = ({ message, onDismiss, type }: ToastProps): React.ReactElement => {
    const style = styles[type]

    return (
        <div className={`rounded-md p-4 shadow-md ${style.background}`}>
            <div className="flex">
                <div className="flex-shrink-0">
                    {type === ToastType.Warning ? (
                        <ExclamationTriangleIcon aria-hidden="true" className={`h-5 w-5 ${style.iconColor}`} />
                    ) : (
                        <CheckCircleIcon aria-hidden="true" className={`h-5 w-5 ${style.iconColor}`} />
                    )}
                </div>

                <div className="ml-3">
                    <p className={`text-sm font-medium ${style.fontColor}`}>{message}</p>
                </div>

                <div className="ml-auto pl-3">
                    <div className="-mx-1.5 -my-1.5">
                        <button
                            type="button"
                            className={`inline-flex rounded-md ${style.background} p-1.5 ${style.iconColor} ${style.dismissBgColor} focus:outline-none focus:ring-2 ${style.dismissFocusRing} focus:ring-offset-2 ${style.dismissFocusRingOffset}`}
                            onClick={onDismiss}
                        >
                            <span className="sr-only">Dismiss</span>
                            <XMarkIcon aria-hidden="true" className="h-5 w-5" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}