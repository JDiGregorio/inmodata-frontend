export type ToastType = 'success' | 'info' | 'warning' | 'error';

export const ToastType = {
    Success: 'success' as ToastType,
    Info: 'info' as ToastType,
    Warning: 'warning' as ToastType,
    Error: 'error' as ToastType
}

export const styles = {
    success: {
        background: 'bg-green-50',
        iconColor: 'text-green-600',
        fontColor: 'text-green-800',
        dismissBgColor: 'hover:bg-green-200',
        dismissFocusRing: 'focus:ring-green-600',
        dismissFocusRingOffset: 'focus:ring-offset-green-100'
    },
    error: {
        background: 'bg-red-50',
        iconColor: 'text-red-600',
        fontColor: 'text-red-800',
        dismissBgColor: 'hover:bg-red-200',
        dismissFocusRing: 'focus:ring-red-600',
        dismissFocusRingOffset: 'focus:ring-offset-red-100'
    },
    warning: {
        background: 'bg-yellow-50',
        iconColor: 'text-yellow-600',
        fontColor: 'text-yellow-800',
        dismissBgColor: 'hover:bg-yellow-200',
        dismissFocusRing: 'focus:ring-yellow-600',
        dismissFocusRingOffset: 'focus:ring-offset-yellow-100'
    },
    info: {
        background: 'bg-blue-50',
        iconColor: 'text-blue-600',
        fontColor: 'text-blue-800',
        dismissBgColor: 'hover:bg-blue-200',
        dismissFocusRing: 'focus:ring-blue-600',
        dismissFocusRingOffset: 'focus:ring-offset-blue-100'
    }
}