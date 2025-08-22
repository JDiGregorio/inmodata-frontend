import { useState } from 'react'
import { useParams, useSearchParams, useNavigate } from 'react-router'
import { XCircleIcon } from '@heroicons/react/20/solid'
import { Loader2 } from 'lucide-react'
import axios from 'axios'

import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { toast } from '@/utils/toast'

const BASE_URL = import.meta.env.APP_BASE_URL

const ResetPassword = () => {
	const [password, setPassword] = useState<string>("")
	const [confirmPassword, setConfirmPassword] = useState<string>("")
    const [passwdHasError, setPasswordHasError] = useState<boolean>(false)
    const [unmatchingPasswords, setUnmatchingPasswords] = useState<boolean>(false)
    const [loading, setLoading] = useState<boolean>(false)

    const [searchParams] = useSearchParams()
    const { token } = useParams()
    const navigate = useNavigate()

    const handlePressEnter = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            handleSubmit(event)
        }
    }

	const handleSubmit = async (event: React.FormEvent<HTMLFormElement> | React.KeyboardEvent<HTMLInputElement>) => {
        event.preventDefault()
        setLoading(true)

        if ((password.length > 0 && confirmPassword.length === 0) || (password.length === 0 && confirmPassword.length > 0)) {
            setPasswordHasError(true)
            setLoading(false)
            return
        }

        if (password.length !== 0 && confirmPassword.length !== 0) {
            if (!validatePassword()) {
                setLoading(false)
                return
            }
        }

        const email = searchParams.get("email")

        try {
            const response = await axios.post(`${BASE_URL}/reset-password`, {
                token,
                email,
                password,
                password_confirmation: confirmPassword
            })

            toast.success(response.data.status)

            setLoading(false)

            navigate("/login", {
                replace: true
            })
        } catch (error) {
            setLoading(false)

            if (axios.isAxiosError(error)) {
                toast.error(error.response?.data.message)
            } else {
                toast.error("Error desconocido, contactese con el administrador del sistema.")
            }
        }
	}

    const validatePassword = () => {
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
        setUnmatchingPasswords(false)
        setPasswordHasError(false)

        if (password !== confirmPassword) {
            setPasswordHasError(true)
            setUnmatchingPasswords(true)
            return false
        }

        const isValid = passwordRegex.test(password)

        if (!isValid) {
            setPasswordHasError(true)
        }

        return isValid
    }

	return (
		<form onSubmit={handleSubmit} className="space-y-6">
			<div className="grid w-full max-w-sm items-center gap-1.5">
                <Label htmlFor="password">
                    Contraseña
                </Label>

                <Input
                    type="password"
                    id="password"
                    value={password}
                    autoComplete="new-password"
                    placeholder="Contraseña"
                    required
                    onChange={(e) => setPassword(e.target.value)}
                    onKeyDown={handlePressEnter}
                />
            </div>

			<div className="grid w-full max-w-sm items-center gap-1.5">
                <Label htmlFor="confirmPassword">
                    Confirmación de Contraseña
                </Label>

                <Input
                    type="password"
                    id="confirmPassword"
                    value={confirmPassword}
                    autoComplete="new-password"
                    placeholder="Confirmar contraseña"
                    required
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    onKeyDown={handlePressEnter}
                />
            </div>

            {passwdHasError && (
                <div className="sm:col-span-4 rounded-md bg-red-50 p-4">
                    <div className="flex">
                        <div className="flex-shrink-0">
                            <XCircleIcon aria-hidden="true" className="h-5 w-5 text-red-400" />
                        </div>
                        <div className="ml-3">
                            <h3 className="text-sm font-medium text-red-800">
                                Por favor verifíque los siguientes requerimientos:
                            </h3>

                            <div className="mt-2 text-sm text-red-700">
                                <ul role="list" className="list-disc space-y-1 pl-5">
                                    {unmatchingPasswords ? (
                                        <li>Ambas contraseñas deben coincidir.</li>
                                    ) : (
                                        <>
                                            <li>Su contraseña debe contener al menos 8 carácteres.</li>
                                            <li>Su contraseña debe contener al menos una letra minúscula.</li>
                                            <li>Su contraseña debe contener al menos una letra mayúscula.</li>
                                            <li>Su contraseña debe contener al menos un número.</li>
                                            <li>Su contraseña debe contener al menos un carácter especial (@$!%*?&).</li>
                                        </>
                                    )}
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            )}

			<hr className="my-8 dark:border-gray-600" />

			<div>
                <Button type="submit" variant={"default"} disabled={loading}>
                    {loading && (
                        <Loader2 aria-hidden="true" className="animate-spin -ml-0.5 mr-1.5 h-5 w-5" />
                    )}

                    Restablecer contraseña
                </Button>
            </div>
		</form>
	)
}

export default ResetPassword