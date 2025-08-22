import { useState } from 'react'
import { Link } from 'react-router'
import { Loader2 } from 'lucide-react'
import axios from 'axios'

import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { toast } from '@/utils/toast'

const BASE_URL = import.meta.env.APP_BASE_URL

const ForgotPassword = () => {
	const [email, setEmail] = useState<string>("")
    const [loading, setLoading] = useState<boolean>(false)
    
    const handlePressEnter = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            handleSubmit(event)
        }
    }

	const handleSubmit = async (event: React.FormEvent<HTMLFormElement> | React.KeyboardEvent<HTMLInputElement>) => {
        event.preventDefault()
        setLoading(true)

        try {
            const response = await axios.post(`${BASE_URL}/forgot-password`, {
                email
            })

            toast.success(response.data.status)

            setLoading(false)
        } catch (error) {
            setLoading(false)

            if (axios.isAxiosError(error)) {
                toast.error(error.response?.data.message)
            } else {
                toast.error("Error desconocido, contactese con el administrador del sistema.")
            }
        }
	}

	return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid w-full max-w-sm items-center gap-1.5">
                <Label htmlFor="email">
                    Correo electrónico
                </Label>

                <Input
                    type="email"
                    id="email"
                    value={email}
                    autoComplete="email"
                    placeholder="Correo electrónico"
                    required
                    onChange={(e) => setEmail(e.target.value)}
                    onKeyDown={handlePressEnter}
                />

                <p className="text-xs font-medium text-gray-400">
                    Le enviaremos un correo electrónico que le permitirá restablecer su contraseña.
                </p>
            </div>

            <hr className="my-8 dark:border-gray-600" />

            <div className="flex justify-end">
                <Link to="/" className="text-sm leading-6 font-semibold text-orange-600 hover:text-orange-500">
                    Regresar al inicio de sesión
                </Link>
            </div>

            <div>
                <Button type="submit" variant={"default"} disabled={loading}>
                    {loading && (
                        <Loader2 aria-hidden="true" className="animate-spin -ml-0.5 mr-1.5 h-5 w-5" />
                    )}
                    Enviar correo electrónico
                </Button>
            </div>
        </form>
	)
}

export default ForgotPassword