import { gql, useQuery } from '@apollo/client'
import { Checkbox } from '@/components/ui/checkbox'
import { Table, TableBody, TableHead, TableHeader, TableRow, TableCell } from '@/components/ui/table'
import { initialPermissions } from '@/utils/permissions'

export const PERMISSION_CATALOG = gql`query PermissionCatalog { permissionCatalog }`
const actions = ['view', 'add', 'edit', 'delete'] as const
const labels = { view: 'Ver', add: 'Crear', edit: 'Editar', delete: 'Eliminar' }

export function RegisteredPermissionGrid({ selected, onChange, onReady }: {
    selected: string[]
    onChange: (names: string[]) => void
    onReady: (ready: boolean) => void
}) {
    const { data, loading, error } = useQuery<{ permissionCatalog: string[] }>(PERMISSION_CATALOG, {
        fetchPolicy: 'network-only', errorPolicy: 'none',
        onCompleted: () => onReady(true), onError: () => onReady(false),
    })
    const names = [...new Set([...(data?.permissionCatalog ?? []), ...selected])]
    const groups = new Map<string, Map<string, string>>()
    const others: string[] = []
    for (const name of names) {
        const match = /^(view|add|edit|delete)-(.+)$/.exec(name)
        if (!match) { others.push(name); continue }
        if (!groups.has(match[2])) groups.set(match[2], new Map())
        groups.get(match[2])!.set(match[1], name)
    }
    const toggle = (name: string) => onChange(selected.includes(name) ? selected.filter(item => item !== name) : [...selected, name])
    const checkbox = (name: string, label: string) => <Checkbox aria-label={label}
        checked={selected.includes(name)} onCheckedChange={() => toggle(name)} />
    if (loading) return <p role="status">Cargando permisos...</p>
    if (error) return <p role="alert">No se pudo cargar el catálogo de permisos.</p>
    return <div className="overflow-x-auto"><Table className="min-w-full">
        <TableHeader className="bg-gray-900"><TableRow>
            <TableHead className="px-1 text-xs sm:text-sm text-white">Módulo</TableHead>
            {actions.map(action => <TableHead key={action} className="px-1 text-xs sm:text-sm text-center text-white">{labels[action]}</TableHead>)}
        </TableRow></TableHeader>
        <TableBody>{[...groups].map(([module, permissions]) => {
            const title = initialPermissions[module as keyof typeof initialPermissions]?.description ?? module
            return <TableRow key={module}><TableCell className="px-1 max-w-32 whitespace-normal break-words">{title}</TableCell>{actions.map(action =>
                <TableCell key={action} className="px-1 text-center">{permissions.has(action)
                    ? checkbox(permissions.get(action)!, `${title}: ${labels[action]}`) : null}</TableCell>
            )}</TableRow>
        })}
        {others.map(name => <TableRow key={name}><TableCell>{name}</TableCell>
            <TableCell colSpan={4}>{checkbox(name, name)}</TableCell></TableRow>)}
        </TableBody>
    </Table></div>
}
