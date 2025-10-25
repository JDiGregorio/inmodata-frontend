import React, { useState, useEffect } from 'react'
import { Loader2 } from 'lucide-react'

import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

import { useLogin } from '@/hooks/useLogin'

const Login = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [remember, setRemember] = useState(false)
    
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
                <form className="space-y-6">   
                    <div className="space-y-6">
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
                                onChange={(e) => setEmail(e.target.value)}
                                onKeyDown={handlePressEnter}
                            />
                        </div>

                        <div className="grid w-full items-center gap-1.5">
                            <Label htmlFor="password">
                                Contraseña
                            </Label>

                            <Input
                                type="password"
                                id="password"
                                value={password}
                                autoComplete="current-password"
                                placeholder="Contraseña"
                                required
                                onChange={(e) => setPassword(e.target.value)}
                                onKeyDown={handlePressEnter}
                            />
                        </div>

                        <div className="w-full flex items-center justify-between">
                            <div className="w-full flex items-center">
                                <input
                                    type="checkbox"
                                    id="remember-me"
                                    name="remember-me"
                                    checked={remember}
                                    onChange={({ target }) => setRemember(target.checked)}
                                    className="h-4 w-4 rounded cursor-pointer border-gray-300 text-gray-400 hover:text-gray-500 focus:ring-0"
                                />

                                <label htmlFor="remember-me" className="w-full ml-2 block text-sm text-gray-900">
                                    Recordar credenciales
                                </label>
                            </div>
                        </div>
                    </div>
            
                    <Button  type="button" variant={"default"} onClick={handleLogin} disabled={loading} className="w-full cursor-pointer">
                        {loading && <Loader2 aria-hidden="true" className="animate-spin -ml-0.5 mr-1.5 h-5 w-5" />}
                        {loading ? "Iniciando sesión" : "Iniciar sesión"}
                    </Button>
                </form>

                {/*<div className="flex justify-center items-center">
                    <p className="text-xs text-zinc-500">
                        Al continuar, acepta nuestros <a href="#" className="underline decoration-zinc-300 underline-offset-2 hover:decoration-zinc-400">Terminos</a> & <a href="#" className="underline decoration-zinc-300 underline-offset-2 hover:decoration-zinc-400">Política de Privacidad.</a>.
                    </p>
                </div>*/}
            </div>
        </div>
    )
}

export default Login