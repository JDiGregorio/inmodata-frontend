import { ComponentType } from 'react'
import { MapPinHouseIcon, ShieldCheckIcon, HandshakeIcon } from 'lucide-react'
import moment from 'moment'

import logo from '@/assets/logo.png'
import banner from '@/assets/banner.png'

export const withLayout = (WrappedComponent: ComponentType) => {
    return () => {
        return (
            <div className="min-h-dvh flex items-center bg-gradient-to-b from-white to-zinc-50 text-zinc-900">
                <div className="mx-auto max-w-6xl px-4 py-10 space-y-3">
                    <header className="mb-4">
                        <div className="w-full max-w-sm lg:w-96">
                            <a href="/" aria-label="Inicio — Inmodata" className="inline-flex items-center">
                                <img src={logo} className="h-18 w-auto" alt="Inmodata" />
                            </a>
                        </div>
                    </header>

                    <main className="grid gap-6 md:grid-cols-2" aria-labelledby="page-title">
                        <aside className="hidden md:block p-6 lg:p-8 space-y-8 bg-white rounded-2xl shadow-xl border border-zinc-200" aria-labelledby="benefits-title" aria-describedby="benefits-desc">
                            <h1 id="page-title" className="sr-only">
                                Acceder a Inmodata
                            </h1>

                            <figure className="space-y-3">
                                <img src={banner} className="max-h-63 w-full rounded-lg object-cover" alt="" role="img" aria-hidden="true" />
                            </figure>

                            <ul className="space-y-4 text-sm">
                                <li className="flex items-start gap-3">
                                    <span aria-hidden="true" className="mt-0.5">
                                        <MapPinHouseIcon size={24} color="#7C0A02" />
                                    </span>

                                    <div>
                                        <p className="font-semibold">
                                            Georreferenciación de precisión
                                        </p>

                                        <p className="opacity-80">
                                            Alinee sus activos con la realidad del terreno con precisión.
                                        </p>
                                    </div>
                                </li>

                                <li className="flex items-start gap-3">
                                    <span aria-hidden="true" className="mt-0.5">
                                        <ShieldCheckIcon size={24} color="#708238" />
                                    </span>

                                    <div>
                                        <p className="font-semibold">
                                            Seguridad de nivel empresarial
                                        </p>

                                        <p className="opacity-80">
                                            Acceso cifrado y controles de auditoría integrados.
                                        </p>
                                    </div>
                                </li>

                                <li className="flex items-start gap-3">
                                    <span aria-hidden="true" className="mt-0.5">
                                        <HandshakeIcon size={24} color="#707070" />
                                    </span>

                                    <div>
                                        <p className="font-semibold">
                                            Evaluaciones perspicaces
                                        </p>
                                        <p className="opacity-80">
                                            Convierta los datos espaciales en claridad financiera.
                                        </p>
                                    </div>
                                </li>
                            </ul>

                            <footer className="flex justify-center text-xs text-gray-400 items-center gap-1">
                                <span>
                                    © <time dateTime={moment().format('YYYY')}>{moment().format('Y')}</time>
                                </span>

                                <span className="font-semibold">
                                    INMODATA
                                </span>
                            </footer>
                        </aside>

                        <section className="p-6 lg:p-8 flex items-center bg-white rounded-2xl shadow-xl border border-zinc-200" aria-labelledby="login-title">
                            <div className="w-full">
                                <WrappedComponent />
                            </div>
                        </section>
                    </main>
                </div>
            </div>
        )
    }
}