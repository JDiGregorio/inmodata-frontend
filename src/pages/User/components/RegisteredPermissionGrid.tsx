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
        checked={selected.includes(name)} onCheckedChange={() => toggle(name)}
        className="h-4 w-4 p-2 rounded bg-gray-50 border-gray-300 cursor-pointer data-[state=checked]:border-red-700 data-[state=checked]:bg-red-700 data-[state=checked]:text-white data-[state=checked]:p-2" />
    if (loading) return <p role="status">Cargando permisos...</p>
    if (error) return <p role="alert">No se pudo cargar el catálogo de permisos.</p>
    return <div className="overflow-x-auto"><Table className="min-w-full">
        <TableHeader className="bg-gray-900"><TableRow>
            <TableHead scope="col" className="py-3.5 text-left text-sm font-semibold text-white sm:pl-6 pl-4 pr-3">Modelo</TableHead>
            {actions.map(action => <TableHead key={action} scope="col" className="py-3.5 text-sm font-semibold text-white px-3 text-center">{labels[action]}</TableHead>)}
        </TableRow></TableHeader>
        <TableBody className="bg-white border border-gray">{[...groups].map(([module, permissions]) => {
            const title = initialPermissions[module as keyof typeof initialPermissions]?.description ?? module
            return <TableRow key={module} className="bg-white"><TableCell className="py-3 px-6 text-left text-black font-medium">{title}</TableCell>{actions.map(action =>
                <TableCell key={action}><div className="flex justify-center items-center">{permissions.has(action)
                    ? checkbox(permissions.get(action)!, `${title}: ${labels[action]}`) : null}</div></TableCell>
            )}</TableRow>
        })}
        {others.map(name => <TableRow key={name} className="bg-white"><TableCell className="py-3 px-6 text-left text-black font-medium">{name}</TableCell>
            <TableCell colSpan={4}><div className="flex justify-center items-center">{checkbox(name, name)}</div></TableCell></TableRow>)}
        </TableBody>
    </Table></div>
}
