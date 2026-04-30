import { Suspense } from 'react'
import RoomOrganization from '@/app/room-organization/room-organization'

const RoomsPage = () => {
  return (
    <div className="p-4 sm:p-6">
      <Suspense>
        <RoomOrganization />
      </Suspense>
    </div>
  )
}

export default RoomsPage
