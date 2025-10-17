import { ComponentType } from 'react'
import moment from 'moment'

import logo from '@/assets/logo.png'
import banner from '@/assets/banner.png'

export const withLayout = (WrappedComponent: ComponentType) => {
    return () => {
        return (
            <div className="min-h-screen bg-gradient-to-b from-white to-zinc-50 text-zinc-900">
                <div className="mx-auto max-w-6xl px-4 py-10 space-y-3">
                    <header className="mb-8 flex items-center gap-3">
                        <div className="w-full max-w-sm lg:w-96">
                            <div className="flex justify-left items-center">
                                <img src={logo} className="h-18 w-auto" alt="Logo Inmodata" />
                            </div>
                        </div>
                    </header>

                    {/* Layout responsive: izquierda info, derecha login */}
                    <div className="grid gap-6 lg:grid-cols-2">
                        <section className="rounded-2xl border border-zinc-200 bg-white p-6 lg:p-8 shadow-xl space-y-8">                            
                            <img src={banner} className="max-h-63 w-full rounded-lg mb-6 object-cover" alt="Banner" />

                            <div className="space-y-4 text-sm">
                                <div className="flex items-start gap-2">
                                    <span className="text-lg">📍</span>
                                    <div>
                                        <p className="font-semibold">
                                            Georreferenciación de precisión
                                        </p>
                                        <p className="opacity-80">
                                            Alinee sus activos con la realidad del terreno con precisión.
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-2">
                                    <span className="text-lg">🔒</span>
                                    <div>
                                        <p className="font-semibold">
                                            Seguridad de nivel empresarial
                                        </p>
                                        <p className="opacity-80">
                                            Acceso cifrado y controles de auditoría integrados.
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-2">
                                    <span className="text-lg">💡</span>
                                    <div>
                                        <p className="font-semibold">
                                            Evaluaciones perspicaces
                                        </p>
                                        <p className="opacity-80">
                                            Convierta los datos espaciales en claridad financiera.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-center text-xs text-gray-400 space-x-1 items-center">
                                <span className="font-normal">
                                    © {moment().format("Y")}
                                </span>
                                <span className="font-semibold">
                                    - INMODATA
                                </span>
                            </div>
                        </section>

                        <section className="rounded-2xl border border-zinc-200 bg-white p-6 lg:p-8 shadow-xl flex items-center">
                            <div className="w-full">
                                <WrappedComponent />
                            </div>
                        </section>
                    </div>
                </div>
            </div>
        )
    }
}