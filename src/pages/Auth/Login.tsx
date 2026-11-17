import { useState, useEffect } from 'react'
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
        const isRemembered = localStorage.getItem("isRemembered") === 'true'

        if (isRemembered) {
            const email = localStorage.getItem("email") ?? ""

            setEmail(email)
            setRemember(true)
        }
    }, [])

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
        <div className="space-y-10 [@media(max-height:650px)]:flex [@media(max-height:650px)]:flex-col [@media(max-height:650px)]:gap-5 [@media(max-height:650px)]:space-y-0">
            <div className="space-y-1">
                <h2 id="login-title" className="text-2xl lg:text-[28px] leading-[1.25] font-semibold tracking-normal text-[#242326]">
                    Bienvenido de nuevo
                </h2>

                <p className="text-base text-[#69636a]">
                    Inicia sesión en tu cuenta de Inmodata
                </p>
            </div>

            <div className="space-y-4">
                <form className="space-y-6" onSubmit={(event) => { event.preventDefault(); handleLogin() }} noValidate>
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
                                className="h-11 border-[#d3cbce] bg-white text-[#242326] shadow-none placeholder:text-[#69636a] focus-visible:border-[#aa3933] focus-visible:ring-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#aa393340]"
                                id="email"
                                value={email}
                                autoComplete="email"
                                placeholder="Correo electrónico"
                                required
                                spellCheck={false}
                                autoCapitalize="none"
                                enterKeyHint="next"
                                onChange={(e) => setEmail(e.target.value)}
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
                                    className="h-11 pr-20 border-[#d3cbce] bg-white text-[#242326] shadow-none placeholder:text-[#69636a] focus-visible:border-[#aa3933] focus-visible:ring-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#aa393340]"
                                    onChange={(e) => setPassword(e.target.value)}
                                />

                                <button type="button" className="absolute inset-y-0 right-0 rounded-md px-3 text-sm text-[#69636a] hover:text-zinc-900 focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-[#aa3933]" onClick={() => setShowPassword((v) => !v)} aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"} aria-pressed={showPassword}>
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
                                    className="size-5 p-2 rounded bg-white border-[#d3cbce] cursor-pointer data-[state=checked]:border-[#aa3933] data-[state=checked]:bg-[#aa3933] data-[state=checked]:text-white focus-visible:ring-0 focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-[#aa3933]"
                                />

                                <label htmlFor="remember-me" className="w-full ml-2 block text-sm text-gray-900">
                                    Recordar credenciales
                                </label>
                            </div>
                        </div>
                    </fieldset>

                    <Button type="submit" variant={"default"} disabled={loading} aria-busy={loading} aria-describedby="form-status" className="h-[46px] w-full rounded-lg cursor-pointer bg-[#aa3933] text-[17px] text-white hover:bg-[#922f2a] focus-visible:ring-0 focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-[#aa3933]">
                        {loading && <Loader2 aria-hidden="true" className="animate-spin -ml-0.5 mr-1.5 h-5 w-5" />}
                        {loading ? "Iniciando sesión" : "Iniciar sesión"}
                    </Button>
                </form>
            </div>
        </div>
    )
}

export default Login
