import type { ComponentType } from 'react'
import { MapPinCheckIcon, FileChartPieIcon, ShieldCheckIcon } from 'lucide-react'

import logo from '@/assets/logo.png'
import map from '@/assets/login-map.png'
import pin from '@/assets/marker9.png'

export const withLayout = (WrappedComponent: ComponentType) => function AuthLayout() {
    return <div className="login-shell flex min-h-dvh items-center bg-[#f7f5f2] text-[#242326] tracking-normal">
        <div className="mx-auto w-full max-w-[500px] px-4 py-7 md:max-w-[1180px] md:px-5 lg:px-6 lg:pt-9 lg:pb-12 [@media(max-height:800px)]:py-4">
            <header className="mb-6 md:mb-7 [@media(max-height:800px)]:mb-4 [@media(max-height:800px)]:[@media(max-height:650px)]:mb-3">
                <a href="/" aria-label="Inicio — Inmodata" className="inline-block max-w-full rounded-md focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-[#aa3933]"><img src={logo} alt="Inmodata" className="h-auto w-[260px] max-w-full md:w-[300px] [@media(max-height:800px)]:w-[240px] [@media(max-height:800px)]:[@media(max-height:650px)]:w-[200px]" /></a>
            </header>

            <main className="grid grid-cols-1 gap-[18px] md:grid-cols-2 lg:gap-6" aria-label="Acceso a Inmodata">
                <aside className="login-benefits relative hidden min-w-0 flex-col gap-6 overflow-hidden rounded-[20px] border border-[#e8e1da] bg-white p-5 shadow-[0_10px_24px_-12px_#57403340] md:flex lg:p-6 [@media(max-height:800px)]:gap-4 [@media(max-height:800px)]:p-5">
                    <figure className="relative aspect-video w-full overflow-hidden rounded-xl [@media(max-height:800px)]:aspect-auto [@media(max-height:800px)]:h-[clamp(140px,calc(100dvh-460px),260px)]">
                        <img src={map} className="block size-full object-cover" alt="" aria-hidden="true" />
                        <span className="login-map-radius absolute top-1/2 left-1/2 aspect-square w-[41%] -translate-1/2 rounded-full border border-[#aa39339c] bg-transparent" aria-hidden="true" />
                        <img src={pin} className="login-map-pin absolute top-1/2 left-1/2 h-auto w-[30px] -translate-1/2" alt="" aria-hidden="true" />
                        <figcaption className="absolute right-2.5 bottom-2.5 max-w-[calc(100%-20px)] rounded-lg bg-[#ffffffed] px-2.5 py-1.5 text-[13px]">Tegucigalpa, Honduras</figcaption>
                    </figure>
                    <ul className="m-0 grid list-none gap-[18px] p-0 text-sm leading-[1.5] [&_li]:flex [&_li]:items-start [&_li]:gap-4 [&_svg]:mt-0.5 [&_svg]:size-7 [&_svg]:shrink-0 [&_svg]:text-[#aa3933] [&_li:nth-child(2)_svg]:text-[#d56a00] [&_li:nth-child(3)_svg]:text-[#b78555] [&_p]:text-base [&_p]:font-semibold [&_span]:text-[#69636a] [@media(max-height:800px)]:gap-3">
                        <li><MapPinCheckIcon aria-hidden="true" color="#707070" /><div><p>Avalúos inmobiliarios más ágiles.</p><span>Automatizamos el proceso para entregar avalúos a nuestros clientes en menor tiempo.</span></div></li>
                        <li><FileChartPieIcon aria-hidden="true" color="#707070" /><div><p>Información inmobiliaria más precisa.</p><span>Referencias y comparativos basados en investigaciones de mercado constantemente actualizadas.</span></div></li>
                        <li><ShieldCheckIcon aria-hidden="true" color="#707070" /><div><p>Seguridad y mejora continua.</p><span>Plataforma segura que evoluciona con sus sugerencias y solicitudes de desarrollo.</span></div></li>
                    </ul>
                    <footer className="mt-auto border-t border-[#e8e1da] pt-4 text-center text-[13px] text-[#69636a] [@media(max-height:800px)]:pt-3">© <time dateTime={String(new Date().getFullYear())}>{new Date().getFullYear()}</time> <strong>INMODATA</strong></footer>
                </aside>
                <section className="relative flex min-h-[490px] min-w-0 items-center overflow-hidden rounded-[20px] border border-[#e8e1da] bg-white px-6 pt-20 pb-10 shadow-[0_10px_24px_-12px_#57403340] md:min-h-0 md:pt-[72px] lg:px-9 lg:pb-[72px] [@media(max-height:800px)]:min-h-0 [@media(max-height:800px)]:py-10 [@media(max-height:800px)]:[@media(max-height:650px)]:py-6">
                    <div className="pointer-events-none absolute top-0 right-0 h-[100px] w-[160px] md:h-[130px] md:w-[210px] [@media(max-height:800px)]:h-20 [@media(max-height:800px)]:w-[140px] [@media(max-height:800px)]:[@media(max-height:650px)]:h-[55px] [@media(max-height:800px)]:[@media(max-height:650px)]:w-[100px]" aria-hidden="true">
                        <i className="absolute inset-0 bg-[#f2d2b7] [clip-path:polygon(0_0,100%_0,100%_100%,83%_62%,48%_23%)]" />
                        <i className="absolute inset-0 bg-[#aa3933] [clip-path:polygon(48%_0,100%_0,100%_61%,78%_29%)]" />
                        <i className="absolute inset-0 bg-[#d56a00] [clip-path:polygon(81%_32%,100%_65%,100%_100%)]" />
                    </div>
                    <div className="relative z-1 w-full min-w-0"><WrappedComponent /></div>
                </section>
            </main>
        </div>
    </div>
}
