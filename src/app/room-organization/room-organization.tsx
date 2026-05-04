'use client'
import React, { useEffect, useMemo, useRef, useState } from 'react'
import Image from 'next/image'
import { useSearchParams } from 'next/navigation'
import { Search } from 'lucide-react'
import { useForm, Controller, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { MoreVertical, Pencil, Trash2, Upload, X } from 'lucide-react'
import {
  useRooms,
  useCreateRoom,
  useUpdateRoom,
  useDeleteRoom,
  type StudentSummary,
} from '@/hooks/api/rooms'
import {
  useCreateStudent,
  useUpdateStudent,
  useDeleteStudent,
  useUploadImage,
} from '@/hooks/api/students'
import { roomCreateSchema, type RoomCreateInput } from '@/lib/schemas/room'
import {
  studentCreateSchema,
  computeFeeStatus,
  type StudentCreateInput,
} from '@/lib/schemas/student'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

const emptyStudent: StudentCreateInput = {
  rollNo: '',
  name: '',
  fatherName: '',
  address: '',
  phone: '',
  guardPhone: '',
  cnic: '',
  imageUrl: '',
  feeTotal: null,
  feePaid: 0,
}

const feeBadge = (status: ReturnType<typeof computeFeeStatus>) => {
  if (status === 'paid') return { label: 'Paid', variant: 'default' as const }
  if (status === 'partial') return { label: 'Partial', variant: 'secondary' as const }
  return { label: 'Unpaid', variant: 'destructive' as const }
}

type DeleteTarget =
  | { kind: 'room'; id: number; label: string }
  | { kind: 'student'; id: number; label: string }
  | null

type RoomFilter = 'all' | 'available' | 'full' | 'empty'

const RoomOrganization = () => {
  const sp = useSearchParams()
  const urlFilter = (sp.get('filter') as RoomFilter | null) || 'all'
  const { data: rooms = [], isLoading } = useRooms()
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState<RoomFilter>(urlFilter)

  const filteredRooms = useMemo(() => {
    const q = query.trim().toLowerCase()
    return rooms.filter((r) => {
      const occ = r.students.length
      const full = occ >= r.capacity
      const empty = occ === 0
      if (filter === 'full' && !full) return false
      if (filter === 'empty' && !empty) return false
      if (filter === 'available' && full) return false
      if (!q) return true
      if (r.number.toLowerCase().includes(q)) return true
      return r.students.some(
        (s) =>
          s.name.toLowerCase().includes(q) ||
          s.rollNo.toLowerCase().includes(q) ||
          (s.fatherName?.toLowerCase().includes(q) ?? false),
      )
    })
  }, [rooms, query, filter])

  const createRoom = useCreateRoom()
  const updateRoom = useUpdateRoom()
  const deleteRoom = useDeleteRoom()
  const createStudent = useCreateStudent()
  const updateStudent = useUpdateStudent()
  const deleteStudent = useDeleteStudent()
  const uploadImage = useUploadImage()

  const [roomDialog, setRoomDialog] = useState<
    | { mode: 'create' }
    | { mode: 'edit'; id: number }
    | null
  >(null)
  const [activeRoomId, setActiveRoomId] = useState<number | null>(null)
  const activeRoom = rooms.find((r) => r.id === activeRoomId) || null
  const [studentDialog, setStudentDialog] = useState<
    | { mode: 'create' }
    | { mode: 'edit'; student: StudentSummary }
    | null
  >(null)
  const [viewStudent, setViewStudent] = useState<StudentSummary | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<DeleteTarget>(null)

  const roomForm = useForm<RoomCreateInput>({
    resolver: zodResolver(roomCreateSchema),
    defaultValues: { number: '', floor: 1, capacity: 2 },
  })

  const studentForm = useForm<StudentCreateInput>({
    resolver: zodResolver(studentCreateSchema),
    defaultValues: emptyStudent,
  })

  const fileRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (!roomDialog) return
    if (roomDialog.mode === 'create') {
      roomForm.reset({ number: '', floor: 1, capacity: 2 })
    } else {
      const r = rooms.find((x) => x.id === roomDialog.id)
      if (r) roomForm.reset({ number: r.number, floor: r.floor, capacity: r.capacity })
    }
  }, [roomDialog, rooms, roomForm])

  useEffect(() => {
    if (!studentDialog) return
    if (studentDialog.mode === 'create') {
      studentForm.reset(emptyStudent)
    } else {
      const s = studentDialog.student
      studentForm.reset({
        rollNo: s.rollNo,
        name: s.name,
        fatherName: s.fatherName || '',
        address: s.address || '',
        phone: s.phone || '',
        guardPhone: s.guardPhone || '',
        cnic: s.cnic || '',
        imageUrl: s.imageUrl || '',
        feeTotal: s.feeTotal ?? null,
        feePaid: s.feePaid ?? 0,
      })
    }
  }, [studentDialog, studentForm])

  const onSubmitRoom = async (values: RoomCreateInput) => {
    try {
      if (roomDialog?.mode === 'edit') {
        await updateRoom.mutateAsync({ id: roomDialog.id, data: values })
        toast.success(`Room ${values.number} updated`)
      } else {
        await createRoom.mutateAsync(values)
        toast.success(`Room ${values.number} created`)
      }
      setRoomDialog(null)
    } catch (err) {
      toast.error((err as Error).message)
    }
  }

  const onSubmitStudent = async (values: StudentCreateInput) => {
    try {
      if (studentDialog?.mode === 'edit') {
        await updateStudent.mutateAsync({ id: studentDialog.student.id, data: values })
        toast.success(`${values.name} updated`)
      } else if (activeRoom) {
        await createStudent.mutateAsync({ ...values, roomId: activeRoom.id })
        toast.success(`${values.name} added to Room ${activeRoom.number}`)
      }
      setStudentDialog(null)
    } catch (err) {
      toast.error((err as Error).message)
    }
  }

  const handleImagePick = async (file: File) => {
    try {
      const url = await uploadImage.mutateAsync(file)
      studentForm.setValue('imageUrl', url, { shouldDirty: true })
      toast.success('Image uploaded')
    } catch (err) {
      toast.error((err as Error).message)
    }
  }

  const confirmDelete = async () => {
    if (!deleteTarget) return
    try {
      if (deleteTarget.kind === 'room') {
        await deleteRoom.mutateAsync(deleteTarget.id)
        toast.success('Room deleted')
        if (activeRoomId === deleteTarget.id) setActiveRoomId(null)
      } else {
        await deleteStudent.mutateAsync(deleteTarget.id)
        toast.success('Student removed')
        setViewStudent(null)
      }
    } catch (err) {
      toast.error((err as Error).message)
    } finally {
      setDeleteTarget(null)
    }
  }

  const initials = (name: string) =>
    name.split(' ').map((n) => n[0]).filter(Boolean).slice(0, 2).join('').toUpperCase()


  return (
    <div>
      {/* ── Page header ── */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">Rooms</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
            {isLoading ? 'Loading…' : `${filteredRooms.length} of ${rooms.length} rooms`}
          </p>
        </div>
        <Button
          onClick={() => setRoomDialog({ mode: 'create' })}
          className="bg-blue-600 hover:bg-blue-700 text-white shadow-md"
        >
          + Create Room
        </Button>
      </div>

      {/* ── Filter + Search ── */}
      <div className="flex flex-wrap items-center gap-3 mb-7">
        <div className="flex rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 p-1 gap-0.5">
          {(['all', 'available', 'full', 'empty'] as RoomFilter[]).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-1.5 text-xs rounded-md capitalize font-medium transition-all ${
                filter === f
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
        <div className="relative flex-1 min-w-48">
          <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search room or student…"
            className="pl-9"
          />
        </div>
      </div>

      {/* ── States ── */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-24">
          <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mb-3" />
          <p className="text-sm text-gray-400">Loading rooms…</p>
        </div>
      ) : rooms.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="w-16 h-16 rounded-2xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-4 text-3xl">🏠</div>
          <p className="text-gray-700 dark:text-gray-300 font-semibold">No rooms yet</p>
          <p className="text-sm text-gray-400 mt-1">Click <span className="text-blue-600 font-medium">+ Create Room</span> to get started.</p>
        </div>
      ) : filteredRooms.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="w-16 h-16 rounded-2xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-4">
            <Search className="w-7 h-7 text-gray-400" />
          </div>
          <p className="text-gray-700 dark:text-gray-300 font-semibold">No rooms match</p>
          <p className="text-sm text-gray-400 mt-1">Try adjusting your filters or search term.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {filteredRooms.map((r) => {
            const occ = r.students.length
            const full = occ >= r.capacity
            const empty = occ === 0

            const cardGradient = full
              ? 'linear-gradient(135deg, #ef4444 0%, #e11d48 100%)'
              : empty
                ? 'linear-gradient(135deg, #94a3b8 0%, #64748b 100%)'
                : 'linear-gradient(135deg, #3b82f6 0%, #4f46e5 100%)'

            const avatarGradient = full
              ? 'linear-gradient(135deg, #f87171, #fb7185)'
              : 'linear-gradient(135deg, #60a5fa, #818cf8)'

            return (
              <div
                key={r.id}
                onClick={() => setActiveRoomId(r.id)}
                className="cursor-pointer rounded-2xl overflow-hidden bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200"
              >
                {/* Coloured top */}
                <div style={{ background: cardGradient }} className="p-4 text-white">
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-[9px] font-bold uppercase tracking-widest" style={{ color: 'rgba(255,255,255,0.6)' }}>
                      Floor {r.floor}
                    </p>
                    <span
                      className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full"
                      style={{ background: 'rgba(255,255,255,0.22)' }}
                    >
                      {full ? 'Full' : empty ? 'Empty' : 'Available'}
                    </span>
                  </div>
                  <h2 className="text-2xl font-extrabold leading-none">{r.number}</h2>
                  <div className="mt-3 space-y-1">
                    <div className="flex gap-1">
                      {Array.from({ length: r.capacity }).map((_, i) => (
                        <div
                          key={i}
                          className="h-1 flex-1 rounded-full"
                          style={{ background: i < occ ? 'rgba(255,255,255,0.95)' : 'rgba(255,255,255,0.25)' }}
                        />
                      ))}
                    </div>
                    <p className="text-[10px]" style={{ color: 'rgba(255,255,255,0.7)' }}>
                      {occ}/{r.capacity} beds
                    </p>
                  </div>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between px-3 py-2.5 bg-white dark:bg-gray-900">
                  {empty ? (
                    <span className="text-xs text-gray-400 italic">No students</span>
                  ) : (
                    <div className="flex items-center gap-1.5">
                      <div className="flex -space-x-1.5">
                        {r.students.slice(0, 3).map((s, idx) => (
                          <div
                            key={s.id}
                            style={{ background: avatarGradient, zIndex: 3 - idx }}
                            className="relative w-6 h-6 rounded-full text-white text-[9px] font-bold flex items-center justify-center border-2 border-white dark:border-gray-900"
                          >
                            {initials(s.name)}
                          </div>
                        ))}
                      </div>
                      {r.students.length > 3 && (
                        <span className="text-xs text-gray-400 font-medium">+{r.students.length - 3}</span>
                      )}
                    </div>
                  )}
                  <div onClick={(e) => e.stopPropagation()}>
                    <DropdownMenu>
                      <DropdownMenuTrigger className="inline-flex items-center justify-center h-7 w-7 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                        <MoreVertical className="h-4 w-4 text-gray-400" />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => setRoomDialog({ mode: 'edit', id: r.id })}>
                          <Pencil className="mr-2 h-4 w-4" /> Edit
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          variant="destructive"
                          onClick={() => setDeleteTarget({ kind: 'room', id: r.id, label: `Room ${r.number}` })}
                        >
                          <Trash2 className="mr-2 h-4 w-4" /> Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Room Create/Edit Dialog */}
      <Dialog open={!!roomDialog} onOpenChange={(o) => !o && setRoomDialog(null)}>
        <DialogContent className="w-[95vw] max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {roomDialog?.mode === 'edit' ? 'Edit Room' : 'Create Room'}
            </DialogTitle>
            <DialogDescription>
              {roomDialog?.mode === 'edit'
                ? 'Update room details.'
                : 'Add a new room with floor and capacity.'}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={roomForm.handleSubmit(onSubmitRoom)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="number">Room Number</Label>
              <Input id="number" placeholder="e.g. 101" {...roomForm.register('number')} />
              {roomForm.formState.errors.number && (
                <p className="text-xs text-red-600">{roomForm.formState.errors.number.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label>Floor</Label>
              <Controller
                control={roomForm.control}
                name="floor"
                render={({ field }) => (
                  <Select
                    value={field.value ? String(field.value) : ''}
                    onValueChange={(v) => field.onChange(Number(v))}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select floor" />
                    </SelectTrigger>
                    <SelectContent>
                      {[1, 2, 3, 4, 5].map((f) => (
                        <SelectItem key={f} value={String(f)}>
                          Floor {f}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
            <div className="space-y-2">
              <Label>Capacity</Label>
              <Controller
                control={roomForm.control}
                name="capacity"
                render={({ field }) => (
                  <Select
                    value={field.value ? String(field.value) : ''}
                    onValueChange={(v) => field.onChange(Number(v))}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select capacity" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="2">2 Seater</SelectItem>
                      <SelectItem value="3">3 Seater</SelectItem>
                      <SelectItem value="4">4 Seater</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setRoomDialog(null)}>
                Cancel
              </Button>
              <Button type="submit" disabled={createRoom.isPending || updateRoom.isPending}>
                {createRoom.isPending || updateRoom.isPending ? 'Saving…' : 'Save'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Room Details Dialog */}
      <Dialog
        open={!!activeRoom && !studentDialog && !viewStudent}
        onOpenChange={(o) => !o && setActiveRoomId(null)}
      >
        {activeRoom && (
          <DialogContent className="w-[95vw] max-w-2xl p-0 overflow-hidden">
            <div className="bg-linear-to-r from-blue-600 to-indigo-600 text-white p-6">
              <DialogHeader>
                <DialogTitle className="text-white text-2xl">Room {activeRoom.number}</DialogTitle>
                <DialogDescription className="text-blue-100">
                  Floor {activeRoom.floor} • {activeRoom.capacity} Seater •{' '}
                  {activeRoom.students.length}/{activeRoom.capacity} occupied
                </DialogDescription>
              </DialogHeader>
            </div>

            <div className="p-6 space-y-3 max-h-[50vh] overflow-y-auto">
              {Array.from({ length: activeRoom.capacity }).map((_, i) => {
                const s = activeRoom.students[i]
                return (
                  <Card key={i} className={s ? '' : 'border-dashed bg-muted/30'}>
                    <CardContent className="flex items-center justify-between p-4">
                      <button
                        type="button"
                        onClick={() => s && setViewStudent(s)}
                        className="flex items-center gap-3 text-left flex-1"
                        disabled={!s}
                      >
                        {s ? (
                          s.imageUrl ? (
                            <Image
                              src={s.imageUrl}
                              alt={s.name}
                              width={44}
                              height={44}
                              className="w-11 h-11 rounded-full object-cover"
                            />
                          ) : (
                            <div className="w-11 h-11 rounded-full bg-linear-to-br from-blue-500 to-indigo-600 text-white flex items-center justify-center font-semibold">
                              {initials(s.name)}
                            </div>
                          )
                        ) : (
                          <div className="w-11 h-11 rounded-full bg-muted text-muted-foreground flex items-center justify-center">
                            {i + 1}
                          </div>
                        )}
                        <div>
                          {s ? (
                            <>
                              <p className="font-semibold">{s.name}</p>
                              <p className="text-xs text-muted-foreground">
                                Roll #{s.rollNo}
                                {s.fatherName ? ` • S/O ${s.fatherName}` : ''}
                              </p>
                              {s.feeTotal ? (
                                <p className="text-xs mt-0.5">
                                  <span className="text-muted-foreground">Remaining: </span>
                                  <span
                                    className={
                                      s.feePaid >= s.feeTotal
                                        ? 'text-emerald-600 font-medium'
                                        : 'text-red-600 font-medium'
                                    }
                                  >
                                    {Math.max(s.feeTotal - s.feePaid, 0)}
                                  </span>
                                </p>
                              ) : null}
                            </>
                          ) : (
                            <>
                              <p className="font-medium text-muted-foreground">Bed {i + 1}</p>
                              <p className="text-xs text-muted-foreground">Empty</p>
                            </>
                          )}
                        </div>
                      </button>
                      {s && (() => {
                        const fb = feeBadge(computeFeeStatus(s.feePaid, s.feeTotal))
                        return (
                        <div className="flex items-center gap-2">
                          <Badge variant={fb.variant}>{fb.label}</Badge>
                          <DropdownMenu>
                            <DropdownMenuTrigger className="inline-flex items-center justify-center h-8 w-8 rounded-md hover:bg-accent">
                              <MoreVertical className="h-4 w-4" />
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => setViewStudent(s)}>
                                View
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => setStudentDialog({ mode: 'edit', student: s })}
                              >
                                <Pencil className="mr-2 h-4 w-4" /> Edit
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                className="text-red-600 focus:text-red-600"
                                onClick={() =>
                                  setDeleteTarget({
                                    kind: 'student',
                                    id: s.id,
                                    label: s.name,
                                  })
                                }
                              >
                                <Trash2 className="mr-2 h-4 w-4" /> Remove
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                        )
                      })()}
                    </CardContent>
                  </Card>
                )
              })}
            </div>

            <div className="p-6 border-t bg-muted/30">
              {activeRoom.students.length >= activeRoom.capacity ? (
                <p className="text-sm text-center text-red-600 bg-red-50 dark:bg-red-950/30 rounded-lg py-3 border border-red-100 dark:border-red-900">
                  🚫 This room is full ({activeRoom.capacity}/{activeRoom.capacity}).
                </p>
              ) : (
                <Button onClick={() => setStudentDialog({ mode: 'create' })} className="w-full" size="lg">
                  + Add Student to This Room
                </Button>
              )}
            </div>
          </DialogContent>
        )}
      </Dialog>

      {/* Student Create/Edit Dialog */}
      <Dialog open={!!studentDialog} onOpenChange={(o) => !o && setStudentDialog(null)}>
        {studentDialog && (
          <DialogContent
            showCloseButton={false}
            className="p-0 overflow-hidden"
            style={{ width: '92vw', maxWidth: 860 }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', maxHeight: '90vh' }}>

              {/* ── Header ── */}
              <div style={{
                background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
                padding: '18px 24px',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                flexShrink: 0,
              }}>
                <div>
                  <h2 style={{ color: '#fff', fontSize: 17, fontWeight: 700, margin: 0, letterSpacing: '-0.02em' }}>
                    {studentDialog.mode === 'edit' ? 'Edit Student' : 'Add New Student'}
                  </h2>
                  <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 12, margin: '3px 0 0' }}>
                    {studentDialog.mode === 'edit'
                      ? `Editing — ${studentDialog.student.name}`
                      : activeRoom
                        ? `Room ${activeRoom.number} · Bed ${activeRoom.students.length + 1} of ${activeRoom.capacity}`
                        : 'Fill in student details'}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setStudentDialog(null)}
                  style={{
                    background: 'rgba(255,255,255,0.15)', border: 'none', borderRadius: 8,
                    width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center',
                    cursor: 'pointer', color: '#fff',
                  }}
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* ── Scrollable body ── */}
              <form
                id="student-form"
                onSubmit={studentForm.handleSubmit(onSubmitStudent)}
                style={{ flex: '1 1 auto', minHeight: 0, overflowY: 'auto', background: '#F9FAFB' }}
              >
                {/* Photo + identity strip */}
                <Controller
                  control={studentForm.control}
                  name="imageUrl"
                  render={({ field }) => (
                    <div style={{
                      display: 'flex', alignItems: 'center', gap: 16,
                      padding: '16px 24px', background: '#fff',
                      borderBottom: '1px solid #E5E7EB',
                    }}>
                      <div style={{ position: 'relative', flexShrink: 0 }}>
                        {field.value ? (
                          <Image
                            src={field.value} alt="Student"
                            width={60} height={60}
                            style={{ width: 60, height: 60, borderRadius: '50%', objectFit: 'cover', border: '3px solid #D1FAE5' }}
                          />
                        ) : (
                          <div style={{
                            width: 60, height: 60, borderRadius: '50%',
                            background: 'linear-gradient(135deg, #D1FAE5, #A7F3D0)',
                            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                            color: '#059669',
                          }}>
                            <Upload style={{ width: 20, height: 20 }} />
                          </div>
                        )}
                        {field.value && (
                          <button
                            type="button"
                            onClick={() => field.onChange('')}
                            style={{
                              position: 'absolute', top: -2, right: -2,
                              background: '#EF4444', color: '#fff', border: 'none',
                              borderRadius: '50%', width: 18, height: 18,
                              display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
                            }}
                          >
                            <X style={{ width: 10, height: 10 }} />
                          </button>
                        )}
                      </div>
                      <div>
                        <p style={{ fontSize: 13, fontWeight: 600, color: '#111827', margin: '0 0 2px' }}>Profile Photo</p>
                        <p style={{ fontSize: 11, color: '#9CA3AF', margin: '0 0 8px' }}>PNG or JPG · max 5 MB</p>
                        <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }}
                          onChange={(e) => { const f = e.target.files?.[0]; if (f) handleImagePick(f); e.target.value = '' }}
                        />
                        <button
                          type="button"
                          onClick={() => fileRef.current?.click()}
                          disabled={uploadImage.isPending}
                          style={{
                            padding: '5px 12px', fontSize: 12, fontWeight: 500,
                            border: '1px solid #D1D5DB', borderRadius: 6,
                            background: '#fff', cursor: 'pointer', color: '#374151',
                            display: 'inline-flex', alignItems: 'center', gap: 6,
                          }}
                        >
                          <Upload style={{ width: 12, height: 12 }} />
                          {uploadImage.isPending ? 'Uploading…' : field.value ? 'Change Photo' : 'Upload Photo'}
                        </button>
                      </div>
                    </div>
                  )}
                />

                {/* ── Sections ── */}
                <div style={{ padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: 20 }}>

                  {/* Section: Academic */}
                  <SectionCard title="Academic Information" icon="🎓">
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '14px 18px' }}>
                      <SField label="Roll No" required error={studentForm.formState.errors.rollNo?.message}>
                        <SInput placeholder="2024-CS-101" {...studentForm.register('rollNo')} />
                      </SField>
                      <SField label="Full Name" required error={studentForm.formState.errors.name?.message}>
                        <SInput placeholder="Student name" {...studentForm.register('name')} />
                      </SField>
                      <SField label="Father's Name">
                        <SInput placeholder="Father's full name" {...studentForm.register('fatherName')} />
                      </SField>
                      <SField label="CNIC">
                        <SInput placeholder="xxxxx-xxxxxxx-x" {...studentForm.register('cnic')} />
                      </SField>
                      <SField label="Course">
                        <SInput placeholder="BS Computer Science" {...studentForm.register('course')} />
                      </SField>
                    </div>
                  </SectionCard>

                  {/* Section: Contact */}
                  <SectionCard title="Contact Details" icon="📱">
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '14px 18px' }}>
                      <SField label="Phone">
                        <SInput placeholder="03xx-xxxxxxx" {...studentForm.register('phone')} />
                      </SField>
                      <SField label="Guardian Phone">
                        <SInput placeholder="03xx-xxxxxxx" {...studentForm.register('guardPhone')} />
                      </SField>
                      <SField label="Email">
                        <SInput type="email" placeholder="email@example.com" {...studentForm.register('email')} />
                      </SField>
                      <div style={{ gridColumn: 'span 3' }}>
                        <SField label="Home Address">
                          <textarea
                            rows={2}
                            placeholder="Full home address"
                            {...studentForm.register('address')}
                            style={{
                              width: '100%', padding: '9px 12px', borderRadius: 8,
                              border: '1px solid #E5E7EB', fontSize: 13, color: '#111827',
                              outline: 'none', resize: 'none', boxSizing: 'border-box',
                              fontFamily: 'inherit', background: '#fff',
                            }}
                            onFocus={e => (e.target.style.borderColor = '#059669')}
                            onBlur={e => (e.target.style.borderColor = '#E5E7EB')}
                          />
                        </SField>
                      </div>
                    </div>
                  </SectionCard>

                  {/* Section: Fees */}
                  <SectionCard title="Fee Information" icon="💰">
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '14px 18px' }}>
                      <SField label="Total Fee (PKR)">
                        <Controller
                          control={studentForm.control}
                          name="feeTotal"
                          render={({ field }) => (
                            <SInput
                              type="number" min={0} placeholder="e.g. 20000"
                              value={field.value ?? ''}
                              onChange={(e) => { const v = e.target.value; field.onChange(v === '' ? null : Number(v)) }}
                            />
                          )}
                        />
                      </SField>
                      <SField label="Amount Paid (PKR)">
                        <Controller
                          control={studentForm.control}
                          name="feePaid"
                          render={({ field }) => (
                            <SInput
                              type="number" min={0} placeholder="0"
                              value={field.value ?? 0}
                              onChange={(e) => field.onChange(Number(e.target.value || 0))}
                            />
                          )}
                        />
                      </SField>
                      <div style={{ display: 'flex', alignItems: 'flex-end' }}>
                        <FeeStatusPreview form={studentForm} />
                      </div>
                    </div>
                  </SectionCard>

                </div>
              </form>

              {/* ── Footer ── */}
              <div style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '14px 24px', borderTop: '1px solid #E5E7EB',
                background: '#fff', flexShrink: 0,
              }}>
                <p style={{ fontSize: 12, color: '#9CA3AF', margin: 0 }}>
                  <span style={{ color: '#EF4444' }}>*</span> Required fields
                </p>
                <div style={{ display: 'flex', gap: 10 }}>
                  <button
                    type="button"
                    onClick={() => setStudentDialog(null)}
                    style={{
                      padding: '9px 18px', borderRadius: 8, border: '1px solid #E5E7EB',
                      background: '#fff', cursor: 'pointer', fontSize: 14, fontWeight: 500, color: '#374151',
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    form="student-form"
                    disabled={createStudent.isPending || updateStudent.isPending}
                    style={{
                      padding: '9px 24px', borderRadius: 8, border: 'none',
                      background: createStudent.isPending || updateStudent.isPending ? '#6B7280' : '#059669',
                      cursor: createStudent.isPending || updateStudent.isPending ? 'not-allowed' : 'pointer',
                      fontSize: 14, fontWeight: 600, color: '#fff',
                      display: 'flex', alignItems: 'center', gap: 7,
                    }}
                  >
                    {createStudent.isPending || updateStudent.isPending ? (
                      <>
                        <span style={{ width: 14, height: 14, border: '2px solid rgba(255,255,255,0.4)', borderTopColor: '#fff', borderRadius: '50%', display: 'inline-block', animation: 'spin 0.7s linear infinite' }} />
                        Saving…
                      </>
                    ) : (
                      <>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                        {studentDialog.mode === 'edit' ? 'Update Student' : 'Save Student'}
                      </>
                    )}
                  </button>
                </div>
              </div>

            </div>
          </DialogContent>
        )}
      </Dialog>

      {/* View Student Dialog */}
      <Dialog open={!!viewStudent} onOpenChange={(o) => !o && setViewStudent(null)}>
        {viewStudent && (
          <DialogContent className="w-[95vw] max-w-lg p-0 overflow-hidden">
            <div className="bg-linear-to-br from-indigo-600 via-blue-600 to-cyan-600 text-white p-6 text-center">
              {viewStudent.imageUrl ? (
                <Image
                  src={viewStudent.imageUrl}
                  alt={viewStudent.name}
                  width={80}
                  height={80}
                  className="w-20 h-20 mx-auto rounded-full object-cover border-4 border-white/30 mb-3"
                />
              ) : (
                <div className="w-20 h-20 mx-auto rounded-full bg-white/20 flex items-center justify-center text-2xl font-bold mb-3">
                  {initials(viewStudent.name)}
                </div>
              )}
              <DialogHeader>
                <DialogTitle className="text-white text-2xl">{viewStudent.name}</DialogTitle>
                <DialogDescription className="text-blue-100">
                  Roll #{viewStudent.rollNo}
                </DialogDescription>
              </DialogHeader>
              {(() => {
                const fb = feeBadge(
                  computeFeeStatus(viewStudent.feePaid, viewStudent.feeTotal),
                )
                return (
                  <Badge className="mt-2" variant={fb.variant}>
                    Fees: {fb.label}
                  </Badge>
                )
              })()}
            </div>
            <div className="p-6 space-y-1">
              <InfoRow label="Father Name" value={viewStudent.fatherName} />
              <InfoRow label="CNIC" value={viewStudent.cnic} />
              <InfoRow label="Contact" value={viewStudent.phone} />
              <InfoRow
                label="Fees"
                value={
                  viewStudent.feeTotal
                    ? `${viewStudent.feePaid} / ${viewStudent.feeTotal}`
                    : viewStudent.feePaid
                      ? String(viewStudent.feePaid)
                      : null
                }
              />
              {viewStudent.feeTotal ? (
                <InfoRow
                  label="Remaining"
                  value={String(Math.max(viewStudent.feeTotal - viewStudent.feePaid, 0))}
                />
              ) : null}
              <InfoRow label="Guardian" value={viewStudent.guardPhone} />
              <InfoRow label="Address" value={viewStudent.address} />
            </div>
            <DialogFooter className="p-4 border-t gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  setStudentDialog({ mode: 'edit', student: viewStudent })
                  setViewStudent(null)
                }}
              >
                <Pencil className="mr-2 h-4 w-4" /> Edit
              </Button>
              <Button
                variant="destructive"
                onClick={() =>
                  setDeleteTarget({ kind: 'student', id: viewStudent.id, label: viewStudent.name })
                }
              >
                <Trash2 className="mr-2 h-4 w-4" /> Delete
              </Button>
              <Button onClick={() => setViewStudent(null)}>Close</Button>
            </DialogFooter>
          </DialogContent>
        )}
      </Dialog>

      {/* Delete confirmation */}
      <AlertDialog open={!!deleteTarget} onOpenChange={(o) => !o && setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete{' '}
              <span className="font-semibold text-foreground">
                {deleteTarget?.label}
              </span>
              . This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

const SectionCard = ({ title, icon, children }: { title: string; icon: string; children: React.ReactNode }) => (
  <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #E5E7EB', overflow: 'hidden' }}>
    <div style={{
      display: 'flex', alignItems: 'center', gap: 8,
      padding: '12px 18px', borderBottom: '1px solid #F3F4F6',
      background: '#F9FAFB',
    }}>
      <span style={{ fontSize: 15 }}>{icon}</span>
      <span style={{ fontSize: 13, fontWeight: 600, color: '#374151' }}>{title}</span>
    </div>
    <div style={{ padding: '16px 18px' }}>{children}</div>
  </div>
)

const SField = ({ label, required, error, children }: { label: string; required?: boolean; error?: string; children: React.ReactNode }) => (
  <div>
    <label style={{ display: 'block', fontSize: 12, fontWeight: 500, color: '#6B7280', marginBottom: 5, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
      {label}{required && <span style={{ color: '#EF4444', marginLeft: 2 }}>*</span>}
    </label>
    {children}
    {error && <p style={{ fontSize: 11, color: '#DC2626', marginTop: 4 }}>{error}</p>}
  </div>
)

const SInput = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  (props, ref) => (
    <input
      ref={ref}
      {...props}
      style={{
        width: '100%', padding: '9px 12px', borderRadius: 8,
        border: '1px solid #E5E7EB', fontSize: 13, color: '#111827',
        outline: 'none', background: '#fff', boxSizing: 'border-box',
        ...(props.style || {}),
      }}
      onFocus={e => { e.target.style.borderColor = '#059669'; props.onFocus?.(e) }}
      onBlur={e => { e.target.style.borderColor = '#E5E7EB'; props.onBlur?.(e) }}
    />
  )
)
SInput.displayName = 'SInput'

const FeeStatusPreview = ({
  form,
}: {
  form: ReturnType<typeof useForm<StudentCreateInput>>
}) => {
  const feeTotal = useWatch({ control: form.control, name: 'feeTotal' })
  const feePaid = useWatch({ control: form.control, name: 'feePaid' })
  const status = computeFeeStatus(Number(feePaid) || 0, feeTotal ?? null)
  const total = Number(feeTotal) || 0
  const paid = Number(feePaid) || 0
  const remaining = Math.max(total - paid, 0)
  const color = status === 'paid' ? '#059669' : status === 'partial' ? '#D97706' : '#DC2626'
  const bg = status === 'paid' ? '#D1FAE5' : status === 'partial' ? '#FEF3C7' : '#FEE2E2'
  const label = status === 'paid' ? 'Fully Paid' : status === 'partial' ? 'Partial' : 'Unpaid'
  return (
    <div style={{
      width: '100%', padding: '10px 14px', borderRadius: 8,
      background: bg, border: `1px solid ${color}22`,
      display: 'flex', flexDirection: 'column', gap: 2,
    }}>
      <span style={{ fontSize: 11, color, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
        {label}
      </span>
      {total > 0 && (
        <span style={{ fontSize: 12, color }}>
          Remaining: <strong>{remaining.toLocaleString()}</strong>
        </span>
      )}
    </div>
  )
}

const InfoRow = ({ label, value }: { label: string; value: string | null }) => (
  <div className="flex justify-between items-start gap-4 py-2 border-b last:border-0">
    <span className="text-sm text-muted-foreground">{label}</span>
    <span className="text-sm font-medium text-right">{value || '—'}</span>
  </div>
)

export default RoomOrganization
