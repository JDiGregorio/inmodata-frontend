'use client'
import * as React from 'react'
import { Dialog, DialogBackdrop, DialogPanel } from '@headlessui/react'

import { MapCanvas } from './DashboardMapView/MapCanvas'

export default function DashboardMapView() {
  const [expanded, setExpanded] = React.useState(false)

  return (
    <>
      <MapCanvas expanded={false} onToggleExpand={() => setExpanded(true)} />

      <Dialog open={expanded} onClose={setExpanded} className="relative z-50">
        <DialogBackdrop className="fixed inset-0 bg-black/90" />

        <div className="fixed inset-0 p-3 sm:p-6">
          <DialogPanel className="relative h-full w-full overflow-hidden rounded-2xl bg-white shadow-2xl">
            <MapCanvas expanded onToggleExpand={() => setExpanded(false)} />
          </DialogPanel>
        </div>
      </Dialog>
    </>
  )
}
