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
      <div className="flex flex-wrap justify-between items-center gap-3 mb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Rooms</h1>
          <p className="text-sm text-muted-foreground">
            {isLoading
              ? 'Loading…'
              : `${filteredRooms.length} of ${rooms.length} shown`}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          <div className="flex rounded-lg border p-0.5 bg-background overflow-x-auto">
            {(['all', 'available', 'full', 'empty'] as RoomFilter[]).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3 py-1.5 text-xs rounded-md capitalize transition whitespace-nowrap ${
                  filter === f
                    ? 'bg-blue-600 text-white shadow'
                    : 'text-muted-foreground hover:bg-accent'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
          <div className="relative flex-1 sm:flex-none min-w-0">
            <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search room or student…"
              className="pl-9 w-full sm:w-64"
            />
          </div>
          <Button onClick={() => setRoomDialog({ mode: 'create' })} className="whitespace-nowrap">+ Create Room</Button>
        </div>
      </div>

      {isLoading ? (
        <Card>
          <CardContent className="p-10 text-center text-muted-foreground">Loading rooms…</CardContent>
        </Card>
      ) : rooms.length === 0 ? (
        <Card>
          <CardContent className="p-10 text-center text-muted-foreground">
            No rooms yet. Click <span className="font-medium">Create Room</span> to add one.
          </CardContent>
        </Card>
      ) : filteredRooms.length === 0 ? (
        <Card>
          <CardContent className="p-10 text-center text-muted-foreground">
            No rooms match your filters.
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredRooms.map((r) => {
            const occupancy = r.students.length
            const full = occupancy >= r.capacity
            return (
              <Card
                key={r.id}
                onClick={() => setActiveRoomId(r.id)}
                className="cursor-pointer hover:border-blue-300 hover:shadow-md transition relative"
              >
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">Room {r.number}</CardTitle>
                      <p className="text-xs text-muted-foreground mt-1">
                        Floor {r.floor} • {r.capacity} Seater
                      </p>
                    </div>
                    <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                      <Badge variant={full ? 'destructive' : occupancy === 0 ? 'secondary' : 'default'}>
                        {full ? 'Full' : occupancy === 0 ? 'Empty' : 'Available'}
                      </Badge>
                      <DropdownMenu>
                        <DropdownMenuTrigger className="inline-flex items-center justify-center h-8 w-8 rounded-md hover:bg-accent">
                          <MoreVertical className="h-4 w-4" />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => setRoomDialog({ mode: 'edit', id: r.id })}>
                            <Pencil className="mr-2 h-4 w-4" /> Edit
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            className="text-red-600 focus:text-red-600"
                            onClick={() =>
                              setDeleteTarget({ kind: 'room', id: r.id, label: `Room ${r.number}` })
                            }
                          >
                            <Trash2 className="mr-2 h-4 w-4" /> Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Occupancy:{' '}
                    <span className="font-medium text-foreground">
                      {occupancy}/{r.capacity}
                    </span>
                  </p>
                </CardContent>
              </Card>
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
          <DialogContent className="w-[95vw] max-w-4xl sm:max-w-4xl p-0 overflow-hidden">
            <div className="bg-linear-to-r from-emerald-600 to-teal-600 text-white p-6">
              <DialogHeader>
                <DialogTitle className="text-white text-2xl">
                  {studentDialog.mode === 'edit' ? 'Edit Student' : 'Add Student'}
                </DialogTitle>
                <DialogDescription className="text-emerald-100">
                  {studentDialog.mode === 'edit'
                    ? `Update ${studentDialog.student.name}'s details`
                    : activeRoom
                      ? `Room ${activeRoom.number} • Bed ${activeRoom.students.length + 1} of ${activeRoom.capacity}`
                      : ''}
                </DialogDescription>
              </DialogHeader>
            </div>

            <form
              onSubmit={studentForm.handleSubmit(onSubmitStudent)}
              className="p-6 space-y-5 max-h-[70vh] overflow-y-auto"
            >
              {/* Image picker */}
              <Controller
                control={studentForm.control}
                name="imageUrl"
                render={({ field }) => (
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      {field.value ? (
                        <Image
                          src={field.value}
                          alt="Student"
                          width={80}
                          height={80}
                          className="w-20 h-20 rounded-full object-cover border-2 border-white shadow"
                        />
                      ) : (
                        <div className="w-20 h-20 rounded-full bg-muted text-muted-foreground flex items-center justify-center text-xs">
                          No photo
                        </div>
                      )}
                      {field.value && (
                        <button
                          type="button"
                          onClick={() => field.onChange('')}
                          className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center shadow"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      )}
                    </div>
                    <div>
                      <input
                        ref={fileRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const f = e.target.files?.[0]
                          if (f) handleImagePick(f)
                          e.target.value = ''
                        }}
                      />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => fileRef.current?.click()}
                        disabled={uploadImage.isPending}
                      >
                        <Upload className="mr-2 h-4 w-4" />
                        {uploadImage.isPending ? 'Uploading…' : field.value ? 'Change Photo' : 'Upload Photo'}
                      </Button>
                      <p className="text-xs text-muted-foreground mt-1">PNG/JPG, max 5MB</p>
                    </div>
                  </div>
                )}
              />

              <div>
                <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                  <span className="w-1 h-4 bg-blue-600 rounded" />
                  Personal Info
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormField label="Roll No" required error={studentForm.formState.errors.rollNo?.message}>
                    <Input placeholder="e.g. 2024-CS-101" {...studentForm.register('rollNo')} />
                  </FormField>
                  <FormField label="Student Name" required error={studentForm.formState.errors.name?.message}>
                    <Input placeholder="Full name" {...studentForm.register('name')} />
                  </FormField>
                  <FormField label="Father Name">
                    <Input placeholder="Father's full name" {...studentForm.register('fatherName')} />
                  </FormField>
                  <FormField label="CNIC Number">
                    <Input placeholder="xxxxx-xxxxxxx-x" {...studentForm.register('cnic')} />
                  </FormField>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                  <span className="w-1 h-4 bg-blue-600 rounded" />
                  Contact
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormField label="Contact Number">
                    <Input placeholder="03xx-xxxxxxx" {...studentForm.register('phone')} />
                  </FormField>
                  <FormField label="Guardian Number">
                    <Input placeholder="03xx-xxxxxxx" {...studentForm.register('guardPhone')} />
                  </FormField>
                  <div className="sm:col-span-2">
                    <Label>Address</Label>
                    <Textarea
                      rows={2}
                      placeholder="Home address"
                      className="mt-2"
                      {...studentForm.register('address')}
                    />
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                  <span className="w-1 h-4 bg-blue-600 rounded" />
                  Fees
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormField label="Total Fee">
                    <Controller
                      control={studentForm.control}
                      name="feeTotal"
                      render={({ field }) => (
                        <Input
                          type="number"
                          min={0}
                          step="0.01"
                          placeholder="e.g. 20000"
                          value={field.value ?? ''}
                          onChange={(e) => {
                            const v = e.target.value
                            field.onChange(v === '' ? null : Number(v))
                          }}
                        />
                      )}
                    />
                  </FormField>
                  <FormField label="Amount Paid">
                    <Controller
                      control={studentForm.control}
                      name="feePaid"
                      render={({ field }) => (
                        <Input
                          type="number"
                          min={0}
                          step="0.01"
                          placeholder="0"
                          value={field.value ?? 0}
                          onChange={(e) => field.onChange(Number(e.target.value || 0))}
                        />
                      )}
                    />
                  </FormField>
                </div>
                <FeeStatusPreview form={studentForm} />
              </div>

              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setStudentDialog(null)}>
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={createStudent.isPending || updateStudent.isPending}
                  className="bg-linear-to-r from-emerald-600 to-teal-600"
                >
                  {createStudent.isPending || updateStudent.isPending
                    ? 'Saving…'
                    : studentDialog.mode === 'edit'
                      ? 'Update Student'
                      : 'Save Student'}
                </Button>
              </DialogFooter>
            </form>
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

const FormField = ({
  label,
  required,
  error,
  children,
}: {
  label: string
  required?: boolean
  error?: string
  children: React.ReactNode
}) => (
  <div className="space-y-2">
    <Label>
      {label}
      {required && <span className="text-red-500 ml-0.5">*</span>}
    </Label>
    {children}
    {error && <p className="text-xs text-red-600">{error}</p>}
  </div>
)

const FeeStatusPreview = ({
  form,
}: {
  form: ReturnType<typeof useForm<StudentCreateInput>>
}) => {
  const feeTotal = useWatch({ control: form.control, name: 'feeTotal' })
  const feePaid = useWatch({ control: form.control, name: 'feePaid' })
  const status = computeFeeStatus(Number(feePaid) || 0, feeTotal ?? null)
  const fb = feeBadge(status)
  const total = Number(feeTotal) || 0
  const paid = Number(feePaid) || 0
  const remaining = Math.max(total - paid, 0)
  return (
    <div className="mt-3 flex items-center gap-3 text-sm bg-muted/30 rounded-lg px-3 py-2">
      <span className="text-muted-foreground">Status:</span>
      <Badge variant={fb.variant}>{fb.label}</Badge>
      {total > 0 && (
        <span className="text-muted-foreground ml-auto">
          Remaining: <span className="font-medium text-foreground">{remaining}</span>
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
