import React from 'react'
import { XCircleIcon } from '@heroicons/react/20/solid'

import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'

import { Profile } from './ProfileDrawer'

interface ProfileForm {
	profile: Profile
	pwdHasError: boolean
	unmatching: boolean
	handleUpdateUser: (mutation: Partial<Profile>) => void
}

export const ProfileForm = ({ profile, pwdHasError, unmatching, handleUpdateUser }: ProfileForm): React.ReactElement => {
	return (
		<form className="space-y-12">
			<div className="space-y-6">
				<div>
					<span className="font-normal text-sm text-gray-700">
						A continuación puedes actualizar tu información personal y de acceso.
					</span>
				</div>

				<div className="space-y-2">
					<Label htmlFor="name" data-required="*">
						Nombre
					</Label>

					<Input
						type="text"
						id="name"
						name="name"
						value={profile.name || ""}
						onChange={(e) => handleUpdateUser({ name: e.target.value })}
						autoComplete="name"
					/>
				</div>
			</div>

			<div className="space-y-6">
				<div className="relative space-y-2">
					<div aria-hidden="true" className="absolute inset-0 flex items-center">
						<div className="w-full border-t border-gray-300" />
					</div>
					
					<div className="relative flex justify-start">
						<span className="bg-gray-50 pr-3 text-base font-semibold leading-6 text-gray-900">
							Actualizar Contraseña
						</span>
					</div>
				</div>

				<div className="space-y-6">
					<div className="space-y-2">
						<Label htmlFor="password" data-required="*">
							Contraseña
						</Label>

						<Input
							type="password"
							id="password"
							value={profile.password}
							placeholder="Contraseña"
							onChange={(e) => handleUpdateUser({ password: e.target.value })}
							autoComplete="new-password"
						/>
					</div>

					<div className="space-y-2">
						<Label htmlFor="confirm-password" data-required="*">
							Confirmar contraseña
						</Label>

						<Input
							type="password"
							id="confirm-password"
							placeholder="Confirmar contraseña"
							value={profile.confirmPassword}
							onChange={(e) => handleUpdateUser({ confirmPassword: e.target.value })}
							autoComplete="new-password"
							required={profile.password !== ""}
						/>
					</div>

					{pwdHasError && (
						<div className="mt-6 sm:col-span-4 rounded-md bg-red-50 p-4">
							<div className="flex">
								<div className="flex-shrink-0">
									<XCircleIcon aria-hidden="true" className="h-5 w-5 text-red-400" />
								</div>

								<div className="ml-3">
									<h3 className="text-sm font-medium text-red-800">
										Por favor verifíque los siguientes requerimientos:
									</h3>

									<div className="mt-2 text-sm text-red-700">
										<ul role="list" className="list-disc space-y-1 pl-5">
											{unmatching ? (
												<li>Ambas contraseñas deben coincidir.</li>
											) : (
												<>
													<li>Su contraseña debe contener al menos 8 carácteres.</li>
													<li>Su contraseña debe contener al menos una letra minúscula.</li>
													<li>Su contraseña debe contener al menos una letra mayúscula.</li>
													<li>Su contraseña debe contener al menos un número.</li>
													<li>Su contraseña debe contener al menos un carácter especial (@$!%*?&).</li>
												</>
											)}
										</ul>
									</div>
								</div>
							</div>
						</div>
					)}
				</div>
			</div>
		</form>
	)
}