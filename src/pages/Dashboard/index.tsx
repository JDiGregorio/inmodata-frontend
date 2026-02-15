import DashboardMapView from './components/DashboardMapView'

export default function Dashboard() {
	return (
		<div className="mx-auto w-full flex-grow overflow-y-hidden mb-6">
			<div className="inline-block min-w-full py-2 align-middle space-y-4">
				<div className="h-[70vh] w-full overflow-hidden rounded-2xl border border-gray-200">
					<DashboardMapView />
				</div>
			</div>
		</div>
	)
}
