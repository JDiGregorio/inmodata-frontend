import React, { useState } from 'react'
import { useNavigate } from 'react-router'

import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { toast } from '@/utils/toast'

import {
    useCreateInstitutionMutation
} from '@/generated-types'

export const GeneralInformationTab = (): React.ReactElement => {
	const [name, setName] = useState<string>("")

	const navigate = useNavigate()

    const [ createInstitution, result ] = useCreateInstitutionMutation({
        onError: () => {
            toast.error('Error al crear la institución.')
        }
    })

    const handleCreateInstitution = async () => {
        if (!name || name === "") {
            toast.warning('Necesita agregar el nombre de la institución!')
            return
        }


        const result = await createInstitution({
            variables: {
                input: {
                    name: name
                }
            }
        })

        if (result.data) {
            toast.success('Registro creado exitosamente!')

            const newInstitutionId = result.data.createInstitution.id

            navigate(`/instituciones/${newInstitutionId}/editar`, {
                replace: true
            })
        }
    }

	return (
		<div className="mx-auto max-w-3xl mt-6 px-4 py-5 rounded-lg bg-white shadow border mb-10">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="mx-auto max-w-2xl space-y-12">
                    <div className="space-y-6">
                        <div className="space-y-1">
                            <h2 className="text-base font-semibold leading-7 text-gray-900">
                                Información General
                            </h2>

                            <p className="text-sm leading-6 text-gray-600">
                                Editar información general de la institución.
                            </p>
                        </div>

                        <div className="space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="name" data-required="*">
                                    Nombre
                                </Label>

                                <Input
                                    type="text"
                                    id="name"
                                    name="name"
                                    value={name}
                                    placeholder="Nombre"
                                    onChange={({ target }) => setName(target.value)}
                                    autoComplete="off"
                                    className="placeholder:text-gray-300"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="mt-6 flex items-center justify-end gap-x-4">
                        <Button type="button" variant={'outline'} size={'default'} className={'w-auto px-4 cursor-pointer'} onClick={()=> {navigate('/instituciones')}}>
                            Cancelar
                        </Button>
                        
                        <Button type="button" variant={'default'} size={'default'} className={'w-auto px-4 cursor-pointer bg-green-700 hover:bg-green-900'} onClick={handleCreateInstitution} disabled={result.loading}>
                            Guardar
                        </Button>
                    </div>
                </div>
            </div>
        </div>
	)
}