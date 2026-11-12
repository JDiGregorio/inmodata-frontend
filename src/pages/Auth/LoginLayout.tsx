import type { ComponentType } from 'react'
import { MapPinCheckIcon, FileChartPieIcon, ShieldCheckIcon } from 'lucide-react'

import logo from '@/assets/logo.png'
import map from '@/assets/login-map.png'
import pin from '@/assets/marker9.png'

import './login.css'

export const withLoginLayout = (Form: ComponentType) => function LoginLayout() {
    return <div className="login-shell">
        <div className="login-container">
            <header className="login-header">
                <a href="/" aria-label="Inicio — Inmodata"><img src={logo} alt="Inmodata" /></a>
            </header>
            
            <main className="login-columns" aria-labelledby="login-title">
                <aside className="login-card login-benefits">
                    <figure className="login-map">
                        <img src={map} className="login-map-background" alt="" aria-hidden="true" />
                        <span className="login-map-radius" aria-hidden="true" />
                        <img src={pin} className="login-map-pin" alt="" aria-hidden="true" />
                        <figcaption>Tegucigalpa, Honduras</figcaption>
                    </figure>
                    <ul className="login-benefit-list">
                        <li><MapPinCheckIcon aria-hidden="true" color="#707070" /><div><p>Avalúos inmobiliarios más ágiles.</p><span>Automatizamos el proceso para entregar avalúos a nuestros clientes en menor tiempo.</span></div></li>
                        <li><FileChartPieIcon aria-hidden="true" color="#707070" /><div><p>Información inmobiliaria más precisa.</p><span>Referencias y comparativos basados en investigaciones de mercado constantemente actualizadas.</span></div></li>
                        <li><ShieldCheckIcon aria-hidden="true" color="#707070" /><div><p>Seguridad y mejora continua.</p><span>Plataforma segura que evoluciona con sus sugerencias y solicitudes de desarrollo.</span></div></li>
                    </ul>
                    <footer>© <time dateTime={String(new Date().getFullYear())}>{new Date().getFullYear()}</time> <strong>INMODATA</strong></footer>
                </aside>
                <section className="login-card login-form-card" aria-labelledby="login-title">
                    <div className="login-brand-corner" aria-hidden="true"><i /><i /><i /></div>
                    <div className="login-form-content"><Form /></div>
                </section>
            </main>
        </div>
    </div>
}
