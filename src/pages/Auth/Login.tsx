import React, { useState, useEffect } from 'react'
import { Loader2 } from 'lucide-react'

import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import { Button } from '@/components/ui/button'

import { useLogin } from '@/hooks/useLogin'

const Login = () => {
    const [email, setEmail] = useState<string>('')
    const [password, setPassword] = useState<string>('')
    const [showPassword, setShowPassword] = useState<boolean>(false)
    const [remember, setRemember] = useState<boolean>(false)

    const { authenticate, loading } = useLogin()

    useEffect(() => {
        const isRemembered = !!localStorage.getItem("isRemembered")

        if (isRemembered) {
            const email = localStorage.getItem("email") ?? ""

            setEmail(email)
            setRemember(true)
        }
    }, [])

    const handlePressEnter = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            handleLogin()
        }
    }

    const handleLogin = () => {
        if (remember) {
            localStorage.setItem("isRemembered", "true")
            localStorage.setItem("email", email)
        } else {
            localStorage.setItem("isRemembered", "false")
            localStorage.removeItem("email")
        }

        authenticate({
            email: email,
            password: password
        })
    }

    return (
        <div className="space-y-10">
            <div className="space-y-1">
                <h2 id="login-title" className="text-2xl font-semibold tracking-tight">
                    Bienvenido de nuevo
                </h2>

                <p className="text-sm text-zinc-500">
                    Inicia sesión en tu cuenta de Inmodata
                </p>
            </div>

            <div className="space-y-4">
                <form className="space-y-6" onSubmit={handleLogin} noValidate>
                    <fieldset className="space-y-6">
                        <legend className="sr-only">
                            Credenciales
                        </legend>

                        <div className="grid w-full items-center gap-1.5">
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
                                spellCheck={false}
                                autoCapitalize="none"
                                enterKeyHint="next"
                                onChange={(e) => setEmail(e.target.value)}
                                onKeyDown={handlePressEnter}
                            />
                        </div>

                        <div className="grid w-full items-center gap-1.5">
                            <Label htmlFor="password">
                                Contraseña
                            </Label>

                            <div className="relative">
                                <Input
                                    type={showPassword ? "text" : "password"}
                                    id="password"
                                    value={password}
                                    autoComplete="current-password"
                                    placeholder="Contraseña"
                                    required
                                    enterKeyHint="go"
                                    className="pr-12"
                                    onChange={(e) => setPassword(e.target.value)}
                                    onKeyDown={handlePressEnter}
                                />

                                <button type="button" className="absolute inset-y-0 right-0 px-3 text-sm text-gray-400 hover:text-zinc-900 focus:outline-none"  onClick={() => setShowPassword((v) => !v)} aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"} aria-pressed={showPassword}>
                                    {showPassword ? "Ocultar" : "Mostrar"}
                                </button>
                            </div>
                        </div>

                        <div className="w-full flex items-center justify-between">
                            <div className="w-full flex items-center">
                                <Checkbox
                                    id="remember-me"
                                    name="remember-me"
                                    checked={remember}
                                    onCheckedChange={(checked) => setRemember(checked === true)}
                                    className="h-4 w-4 p-2 rounded bg-gray-100 border-gray-300 cursor-pointer data-[state=checked]:border-red-700 data-[state=checked]:bg-red-700 data-[state=checked]:text-white data-[state=checked]:p-2"
                                />

                                <label htmlFor="remember-me" className="w-full ml-2 block text-sm text-gray-900">
                                    Recordar credenciales
                                </label>
                            </div>
                        </div>
                    </fieldset>

                    <Button type="button" variant={"default"} onClick={handleLogin} disabled={loading} aria-busy={loading} aria-describedby="form-status" className="w-full cursor-pointer bg-red-700 hover:bg-red-800">
                        {loading && <Loader2 aria-hidden="true" className="animate-spin -ml-0.5 mr-1.5 h-5 w-5" />}
                        {loading ? "Iniciando sesión" : "Iniciar sesión"}
                    </Button>
                </form>
            </div>
        </div>
    )
}

export default Login