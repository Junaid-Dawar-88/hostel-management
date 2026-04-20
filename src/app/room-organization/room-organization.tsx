'use client'
import React, { useState } from 'react'
import { useRooms, useCreateRoom, useDeleteRoom, type RoomWithStudents, type StudentSummary } from '@/hooks/api/rooms'
import { useCreateStudent, useDeleteStudent } from '@/hooks/api/students'
import { roomCreateSchema } from '@/lib/schemas/room'
import { studentCreateSchema } from '@/lib/schemas/student'

const emptyStudent = {
  rollNo: '',
  name: '',
  fatherName: '',
  address: '',
  phone: '',
  guardPhone: '',
  cnic: '',
  feesPaid: false,
}

const RoomOrganization = () => {
  const { data: rooms = [], isLoading } = useRooms()
  const createRoom = useCreateRoom()
  const deleteRoom = useDeleteRoom()
  const createStudent = useCreateStudent()
  const deleteStudent = useDeleteStudent()

  const [open, setOpen] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [form, setForm] = useState({ number: '', floor: '', capacity: '2' })

  const [activeRoomId, setActiveRoomId] = useState<number | null>(null)
  const activeRoom = rooms.find((r) => r.id === activeRoomId) || null
  const [addOpen, setAddOpen] = useState(false)
  const [viewStudent, setViewStudent] = useState<StudentSummary | null>(null)
  const [studentForm, setStudentForm] = useState(emptyStudent)
  const [studentError, setStudentError] = useState<string | null>(null)

  const submitRoom = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    const parsed = roomCreateSchema.safeParse({
      number: form.number,
      floor: form.floor,
      capacity: form.capacity,
    })
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message || 'Invalid input')
      return
    }
    try {
      await createRoom.mutateAsync(parsed.data)
      setForm({ number: '', floor: '', capacity: '2' })
      setOpen(false)
    } catch (err) {
      setError((err as Error).message)
    }
  }

  const removeRoom = async (id: number) => {
    if (!confirm('Delete this room?')) return
    await deleteRoom.mutateAsync(id)
  }

  const closeRoom = () => {
    setActiveRoomId(null)
    setAddOpen(false)
    setViewStudent(null)
  }

  const addStudent = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!activeRoom) return
    setStudentError(null)
    const parsed = studentCreateSchema.safeParse({
      ...studentForm,
      roomId: activeRoom.id,
    })
    if (!parsed.success) {
      setStudentError(parsed.error.issues[0]?.message || 'Invalid input')
      return
    }
    try {
      await createStudent.mutateAsync(parsed.data)
      setStudentForm(emptyStudent)
      setAddOpen(false)
      closeRoom()
    } catch (err) {
      setStudentError((err as Error).message)
    }
  }

  const removeStudent = async (id: number) => {
    if (!confirm('Remove this student?')) return
    await deleteStudent.mutateAsync(id)
    closeRoom()
  }

  const initials = (name: string) =>
    name.split(' ').map((n) => n[0]).filter(Boolean).slice(0, 2).join('').toUpperCase()

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Rooms</h1>
          <p className="text-sm text-gray-500">
            {isLoading ? 'Loading…' : `${rooms.length} total`}
          </p>
        </div>
        <button
          onClick={() => setOpen(true)}
          className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-5 py-2 rounded-xl shadow hover:shadow-lg hover:from-blue-700 hover:to-indigo-700 transition"
        >
          + Create Room
        </button>
      </div>

      {isLoading ? (
        <div className="bg-white rounded-2xl p-10 text-center text-gray-400 shadow-sm border border-gray-100">
          Loading rooms…
        </div>
      ) : rooms.length === 0 ? (
        <div className="bg-white rounded-2xl p-10 text-center text-gray-500 shadow-sm border border-gray-100">
          No rooms yet. Click <span className="font-medium">Create Room</span> to add one.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {rooms.map((r) => {
            const occupancy = r.students.length
            const full = occupancy >= r.capacity
            return (
              <button
                key={r.id}
                onClick={() => setActiveRoomId(r.id)}
                className="text-left bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-md hover:border-blue-200 transition"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-gray-800">Room {r.number}</h3>
                    <p className="text-xs text-gray-500">
                      Floor {r.floor} • {r.capacity} Seater
                    </p>
                  </div>
                  <span
                    className={`text-xs px-2 py-1 rounded-full font-medium ${
                      full
                        ? 'bg-red-100 text-red-700'
                        : occupancy === 0
                          ? 'bg-gray-100 text-gray-600'
                          : 'bg-green-100 text-green-700'
                    }`}
                  >
                    {full ? 'Full' : occupancy === 0 ? 'Empty' : 'Available'}
                  </span>
                </div>
                <div className="mt-4 flex items-center justify-between">
                  <p className="text-sm text-gray-600">
                    Occupancy:{' '}
                    <span className="font-medium text-gray-800">
                      {occupancy}/{r.capacity}
                    </span>
                  </p>
                  <span
                    onClick={(e) => {
                      e.stopPropagation()
                      removeRoom(r.id)
                    }}
                    className="text-xs text-red-600 hover:underline cursor-pointer"
                  >
                    Delete
                  </span>
                </div>
              </button>
            )
          })}
        </div>
      )}

      {open && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-xl p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Create Room</h2>
            <form className="space-y-4" onSubmit={submitRoom}>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Room Number</label>
                <input
                  required
                  value={form.number}
                  onChange={(e) => setForm({ ...form, number: e.target.value })}
                  placeholder="e.g. 101"
                  className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Floor</label>
                <select
                  required
                  value={form.floor}
                  onChange={(e) => setForm({ ...form, floor: e.target.value })}
                  className="w-full border rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="" disabled>Select floor</option>
                  <option value="1">1st Floor</option>
                  <option value="2">2nd Floor</option>
                  <option value="3">3rd Floor</option>
                  <option value="4">4th Floor</option>
                  <option value="5">5th Floor</option>
                </select>
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Capacity</label>
                <select
                  required
                  value={form.capacity}
                  onChange={(e) => setForm({ ...form, capacity: e.target.value })}
                  className="w-full border rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="2">2 Seater</option>
                  <option value="3">3 Seater</option>
                  <option value="4">4 Seater</option>
                </select>
              </div>
              {error && <p className="text-sm text-red-600">{error}</p>}
              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="px-4 py-2 rounded-lg text-black bg-gray-200 hover:bg-gray-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={createRoom.isPending}
                  className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-60"
                >
                  {createRoom.isPending ? 'Saving...' : 'Save'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {activeRoom && !addOpen && !viewStudent && (
        <RoomModal
          room={activeRoom}
          onClose={closeRoom}
          onAdd={() => setAddOpen(true)}
          onView={setViewStudent}
          onRemoveStudent={removeStudent}
          initials={initials}
        />
      )}

      {activeRoom && addOpen && (
        <AddStudentModal
          room={activeRoom}
          form={studentForm}
          setForm={setStudentForm}
          onCancel={() => setAddOpen(false)}
          onSubmit={addStudent}
          error={studentError}
          saving={createStudent.isPending}
        />
      )}

      {viewStudent && (
        <ViewStudentModal
          student={viewStudent}
          onClose={() => setViewStudent(null)}
          initials={initials}
        />
      )}
    </div>
  )
}

const RoomModal = ({
  room,
  onClose,
  onAdd,
  onView,
  onRemoveStudent,
  initials,
}: {
  room: RoomWithStudents
  onClose: () => void
  onAdd: () => void
  onView: (s: StudentSummary) => void
  onRemoveStudent: (id: number) => void
  initials: (name: string) => string
}) => (
  <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50 p-4">
    <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6 flex items-start justify-between">
        <div>
          <h2 className="text-2xl font-bold">Room {room.number}</h2>
          <p className="text-sm text-blue-100 mt-1">
            Floor {room.floor} • {room.capacity} Seater • {room.students.length}/{room.capacity} occupied
          </p>
        </div>
        <button onClick={onClose} className="text-white/80 hover:text-white text-3xl leading-none">×</button>
      </div>

      <div className="p-6 space-y-3 overflow-y-auto">
        {Array.from({ length: room.capacity }).map((_, i) => {
          const s = room.students[i]
          return (
            <div
              key={i}
              className={`rounded-2xl border p-4 transition ${
                s ? 'bg-gradient-to-br from-gray-50 to-white border-gray-200 hover:shadow-md' : 'bg-white border-dashed border-gray-300'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {s ? (
                    <div className="w-11 h-11 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-white flex items-center justify-center font-semibold">
                      {initials(s.name)}
                    </div>
                  ) : (
                    <div className="w-11 h-11 rounded-full bg-gray-100 text-gray-400 flex items-center justify-center text-lg">
                      {i + 1}
                    </div>
                  )}
                  <div>
                    {s ? (
                      <>
                        <p className="font-semibold text-gray-800">{s.name}</p>
                        <p className="text-xs text-gray-500">
                          Roll #{s.rollNo}
                          {s.fatherName ? ` • S/O ${s.fatherName}` : ''}
                        </p>
                      </>
                    ) : (
                      <>
                        <p className="font-medium text-gray-500">Bed {i + 1}</p>
                        <p className="text-xs text-gray-400">Empty</p>
                      </>
                    )}
                  </div>
                </div>
                {s && (
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full ${
                        s.feesPaid ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                      }`}
                    >
                      {s.feesPaid ? 'Paid' : 'Pending'}
                    </span>
                    <button onClick={() => onView(s)} className="text-xs text-blue-600 hover:underline">View</button>
                    <button onClick={() => onRemoveStudent(s.id)} className="text-xs text-red-600 hover:underline">Remove</button>
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>

      <div className="p-6 border-t bg-gray-50">
        {room.students.length >= room.capacity ? (
          <p className="text-sm text-center text-red-600 bg-red-50 rounded-lg py-3 border border-red-100">
            🚫 This room is full ({room.capacity}/{room.capacity}).
          </p>
        ) : (
          <button
            onClick={onAdd}
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-xl hover:shadow-lg hover:from-blue-700 hover:to-indigo-700 transition font-medium"
          >
            + Add Student to This Room
          </button>
        )}
      </div>
    </div>
  </div>
)

const AddStudentModal = ({
  room,
  form,
  setForm,
  onCancel,
  onSubmit,
  error,
  saving,
}: {
  room: RoomWithStudents
  form: typeof emptyStudent
  setForm: (f: typeof emptyStudent) => void
  onCancel: () => void
  onSubmit: (e: React.FormEvent) => void
  error: string | null
  saving: boolean
}) => (
  <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50 p-4">
    <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden max-h-[92vh] flex flex-col">
      <div className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white p-6 flex items-start justify-between">
        <div>
          <h2 className="text-2xl font-bold">Add Student</h2>
          <p className="text-sm text-emerald-100 mt-1">
            Room {room.number} • Bed {room.students.length + 1} of {room.capacity}
          </p>
        </div>
        <button onClick={onCancel} className="text-white/80 hover:text-white text-3xl leading-none">×</button>
      </div>

      <form onSubmit={onSubmit} className="p-6 space-y-5 overflow-y-auto">
        <div>
          <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
            <span className="w-1 h-4 bg-blue-600 rounded" />
            Personal Info
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Roll No" required value={form.rollNo} onChange={(v) => setForm({ ...form, rollNo: v })} placeholder="e.g. 2024-CS-101" />
            <Field label="Student Name" required value={form.name} onChange={(v) => setForm({ ...form, name: v })} placeholder="Full name" />
            <Field label="Father Name" value={form.fatherName} onChange={(v) => setForm({ ...form, fatherName: v })} placeholder="Father's full name" />
            <Field label="CNIC Number" value={form.cnic} onChange={(v) => setForm({ ...form, cnic: v })} placeholder="xxxxx-xxxxxxx-x" />
          </div>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
            <span className="w-1 h-4 bg-blue-600 rounded" />
            Contact
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Contact Number" value={form.phone} onChange={(v) => setForm({ ...form, phone: v })} placeholder="03xx-xxxxxxx" />
            <Field label="Guardian Number" value={form.guardPhone} onChange={(v) => setForm({ ...form, guardPhone: v })} placeholder="03xx-xxxxxxx" />
            <div className="sm:col-span-2">
              <label className="block text-sm text-gray-600 mb-1">Address</label>
              <textarea
                rows={2}
                value={form.address}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
                placeholder="Home address"
                className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              />
            </div>
          </div>
        </div>

        <label className="flex items-center gap-3 bg-gray-50 rounded-lg p-3 cursor-pointer">
          <input
            type="checkbox"
            checked={form.feesPaid}
            onChange={(e) => setForm({ ...form, feesPaid: e.target.checked })}
            className="w-4 h-4"
          />
          <span className="text-sm text-gray-700">Fees paid</span>
        </label>

        {error && (
          <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2">{error}</p>
        )}

        <div className="flex justify-end gap-3 pt-2 border-t">
          <button type="button" onClick={onCancel} className="px-5 py-2 rounded-lg text-gray-700 bg-gray-200 hover:bg-gray-300">Cancel</button>
          <button
            type="submit"
            disabled={saving}
            className="px-5 py-2 rounded-lg bg-gradient-to-r from-emerald-600 to-teal-600 text-white hover:shadow-lg disabled:opacity-60"
          >
            {saving ? 'Saving...' : 'Save Student'}
          </button>
        </div>
      </form>
    </div>
  </div>
)

const ViewStudentModal = ({
  student,
  onClose,
  initials,
}: {
  student: StudentSummary
  onClose: () => void
  initials: (name: string) => string
}) => (
  <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-[60] p-4">
    <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden">
      <div className="bg-gradient-to-br from-indigo-600 via-blue-600 to-cyan-600 text-white p-6 text-center">
        <div className="w-20 h-20 mx-auto rounded-full bg-white/20 backdrop-blur flex items-center justify-center text-2xl font-bold mb-3">
          {initials(student.name)}
        </div>
        <h2 className="text-2xl font-bold">{student.name}</h2>
        <p className="text-sm text-blue-100">Roll #{student.rollNo}</p>
        <span className={`inline-block mt-2 text-xs px-3 py-1 rounded-full ${student.feesPaid ? 'bg-green-500/30 text-white' : 'bg-amber-400/30 text-white'}`}>
          Fees: {student.feesPaid ? 'Paid' : 'Pending'}
        </span>
      </div>
      <div className="p-6 space-y-3">
        <InfoRow label="Father Name" value={student.fatherName} />
        <InfoRow label="CNIC" value={student.cnic} />
        <InfoRow label="Contact" value={student.phone} />
        <InfoRow label="Guardian" value={student.guardPhone} />
        <InfoRow label="Address" value={student.address} />
      </div>
      <div className="p-4 border-t flex justify-end">
        <button onClick={onClose} className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-700">Close</button>
      </div>
    </div>
  </div>
)

const Field = ({
  label,
  value,
  onChange,
  placeholder,
  required,
}: {
  label: string
  value: string
  onChange: (v: string) => void
  placeholder?: string
  required?: boolean
}) => (
  <div>
    <label className="block text-sm text-gray-600 mb-1">
      {label}
      {required && <span className="text-red-500 ml-0.5">*</span>}
    </label>
    <input
      required={required}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
  </div>
)

const InfoRow = ({ label, value }: { label: string; value: string | null }) => (
  <div className="flex justify-between items-start gap-4 py-2 border-b last:border-0">
    <span className="text-sm text-gray-500">{label}</span>
    <span className="text-sm font-medium text-gray-800 text-right">{value || '—'}</span>
  </div>
)

export default RoomOrganization
