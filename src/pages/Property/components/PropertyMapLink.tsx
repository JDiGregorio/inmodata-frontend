import { Link } from 'react-router'
import { MapPinnedIcon } from 'lucide-react'
import { buildMapViewFocusHref } from '../utils/mapViewLink'
import { isValidLatLng } from '@/lib/utils'

export function PropertyMapLink({ property }: { property: Parameters<typeof buildMapViewFocusHref>[0] }) {
    const className = 'inline-flex items-center gap-2 rounded-md border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50'
    const content = <><MapPinnedIcon size={16} />Ver en mapa</>
    if (!isValidLatLng(property.latitude, property.longitude)) {
        return <button type="button" disabled className={`${className} cursor-not-allowed opacity-50`}>{content}</button>
    }
    return <Link
        to={buildMapViewFocusHref(property)}
        target="_blank"
        rel="noopener noreferrer"
        className={className}
    >
        {content}
    </Link>
}
