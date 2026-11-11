import type { ComponentType } from 'react'
import { MapPinHouseIcon, ShieldCheckIcon, HandshakeIcon } from 'lucide-react'
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
                        <li><MapPinHouseIcon aria-hidden="true" /><div><p>Georreferenciación de precisión</p><span>Alinee sus activos con la realidad del terreno con precisión.</span></div></li>
                        <li><ShieldCheckIcon aria-hidden="true" /><div><p>Seguridad de nivel empresarial</p><span>Acceso cifrado y controles de auditoría integrados.</span></div></li>
                        <li><HandshakeIcon aria-hidden="true" /><div><p>Evaluaciones perspicaces</p><span>Convierta los datos espaciales en claridad financiera.</span></div></li>
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
