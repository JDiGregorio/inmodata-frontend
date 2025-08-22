import { toast as notificacion } from 'sonner'
import { Toast } from '@/components/widgets/Toast/Toast'
import { ToastType } from '@/components/widgets/Toast/constants'

export const toast = {
    success: (message: string) => {
        notificacion.custom((t) => (
            <Toast message={message} onDismiss={() => notificacion.dismiss(t)} type={ToastType.Success} />
        ))
    },
    error: (message: string) => {
        notificacion.custom((t) => (
            <Toast message={message} onDismiss={() => notificacion.dismiss(t)} type={ToastType.Error} />
        ))
    },
    warning: (message: string) => {
        notificacion.custom((t) => (
            <Toast message={message} onDismiss={() => notificacion.dismiss(t)} type={ToastType.Warning} />
        ))
    },
    info: (message: string) => {
        notificacion.custom((t) => (
            <Toast message={message} onDismiss={() => notificacion.dismiss(t)} type={ToastType.Info} />
        ))
    }
}