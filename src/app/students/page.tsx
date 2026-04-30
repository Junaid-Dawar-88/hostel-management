import { Suspense } from 'react'
import StudentsClient from './students-client'

const StudentsPage = () => {
  return (
    <Suspense>
      <StudentsClient />
    </Suspense>
  )
}

export default StudentsPage
