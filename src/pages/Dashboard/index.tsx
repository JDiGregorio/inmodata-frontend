import DashboardMapView from './components/DashboardMapView'

export default function Dashboard() {
	return (
		<div className="mx-auto w-full flex-grow overflow-y-hidden">
			<div className="inline-block min-w-full align-middle space-y-4">
				<div className="h-[calc(100dvh-4rem)] min-h-[70vh] w-full overflow-hidden border border-gray-200">
					<DashboardMapView />
				</div>
			</div>
		</div>
	)
}
