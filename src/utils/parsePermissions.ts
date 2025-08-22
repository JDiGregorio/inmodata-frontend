type Permission = {
    description: string
    add: boolean
    delete: boolean
    edit: boolean
    view: boolean
}

export const parsePermissions = (permissions: {[key: string]: Permission}) => {
	const filteredPermissions = Object.fromEntries(
		Object.entries(permissions).filter(([, value]) => 
			value.add || value.delete || value.edit || value.view
		)
	)

	const transformedPermissions = Object.entries(filteredPermissions).map((permission) => {
		const tempPermissions = []
		const model = permission[0]

		if (permission[1].add) {
			tempPermissions.push(`add-${model}`)
		}

		if (permission[1].edit) {
			tempPermissions.push(`edit-${model}`)
		}

		if (permission[1].view) {
			tempPermissions.push(`view-${model}`)
		}

		if (permission[1].delete) {
			tempPermissions.push(`delete-${model}`)
		}

		return [tempPermissions]
	})
	
	return transformedPermissions.flat(2)
}