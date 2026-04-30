'use client'
import React, { useEffect, useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { MoreVertical, Pencil, Trash2 } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

import {
  useMenu,
  useCreateMenuItem,
  useUpdateMenuItem,
  useDeleteMenuItem,
  type MenuItem,
} from '@/hooks/api/menu'
import { menuItemCreateSchema, DAYS, MEALS, type MenuItemCreateInput } from '@/lib/schemas/menu'

const mealColor: Record<string, string> = {
  Breakfast: 'bg-amber-100 text-amber-700 dark:bg-amber-950/50 dark:text-amber-300',
  Lunch: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300',
  Dinner: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-950/50 dark:text-indigo-300',
}

const mealIcon: Record<string, string> = {
  Breakfast: '☀️',
  Lunch: '🍱',
  Dinner: '🌙',
}

const MenuPage = () => {
  const { data: items = [], isLoading } = useMenu()
  const createItem = useCreateMenuItem()
  const updateItem = useUpdateMenuItem()
  const deleteItem = useDeleteMenuItem()

  const [dialog, setDialog] = useState<
    | { mode: 'create'; day?: string; meal?: string }
    | { mode: 'edit'; item: MenuItem }
    | null
  >(null)
  const [deleteTarget, setDeleteTarget] = useState<MenuItem | null>(null)

  const form = useForm<MenuItemCreateInput>({
    resolver: zodResolver(menuItemCreateSchema),
    defaultValues: { day: 'Monday', meal: 'Breakfast', items: '' },
  })

  useEffect(() => {
    if (!dialog) return
    if (dialog.mode === 'create') {
      form.reset({
        day: (dialog.day as (typeof DAYS)[number]) || 'Monday',
        meal: (dialog.meal as (typeof MEALS)[number]) || 'Breakfast',
        items: '',
      })
    } else {
      form.reset({
        day: dialog.item.day as (typeof DAYS)[number],
        meal: dialog.item.meal as (typeof MEALS)[number],
        items: dialog.item.items,
      })
    }
  }, [dialog, form])

  const onSubmit = async (values: MenuItemCreateInput) => {
    try {
      if (dialog?.mode === 'edit') {
        await updateItem.mutateAsync({ id: dialog.item.id, data: values })
        toast.success('Menu updated')
      } else {
        await createItem.mutateAsync(values)
        toast.success('Menu added')
      }
      setDialog(null)
    } catch (err) {
      toast.error((err as Error).message)
    }
  }

  const confirmDelete = async () => {
    if (!deleteTarget) return
    try {
      await deleteItem.mutateAsync(deleteTarget.id)
      toast.success('Menu deleted')
    } catch (err) {
      toast.error((err as Error).message)
    } finally {
      setDeleteTarget(null)
    }
  }

  const byDay = (day: string, meal: string) =>
    items.find((i) => i.day === day && i.meal === meal)

  return (
    <div className="p-4 sm:p-6 space-y-6">
      <div className="flex flex-wrap justify-between items-center gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Food Menu</h1>
          <p className="text-sm text-muted-foreground">Weekly meal plan</p>
        </div>
        <Button onClick={() => setDialog({ mode: 'create' })}>+ Add Menu</Button>
      </div>

      {isLoading ? (
        <Card>
          <CardContent className="p-10 text-center text-muted-foreground">Loading menu…</CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {DAYS.map((day) => (
            <Card key={day} className="overflow-hidden">
              <CardHeader className="bg-linear-to-r from-blue-600 to-indigo-600 text-white">
                <CardTitle className="text-white">{day}</CardTitle>
              </CardHeader>
              <CardContent className="p-4 space-y-3">
                {MEALS.map((meal) => {
                  const item = byDay(day, meal)
                  return (
                    <div
                      key={meal}
                      className="rounded-lg border p-3 hover:shadow-sm transition"
                    >
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <Badge className={mealColor[meal]}>
                          <span className="mr-1">{mealIcon[meal]}</span>
                          {meal}
                        </Badge>
                        {item ? (
                          <DropdownMenu>
                            <DropdownMenuTrigger className="inline-flex items-center justify-center h-7 w-7 rounded-md hover:bg-accent">
                              <MoreVertical className="h-4 w-4" />
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => setDialog({ mode: 'edit', item })}>
                                <Pencil className="mr-2 h-4 w-4" /> Edit
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                className="text-red-600 focus:text-red-600"
                                onClick={() => setDeleteTarget(item)}
                              >
                                <Trash2 className="mr-2 h-4 w-4" /> Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        ) : (
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-7 text-xs"
                            onClick={() => setDialog({ mode: 'create', day, meal })}
                          >
                            + Add
                          </Button>
                        )}
                      </div>
                      {item ? (
                        <p className="text-sm text-foreground whitespace-pre-line">{item.items}</p>
                      ) : (
                        <p className="text-xs text-muted-foreground italic">Not set</p>
                      )}
                    </div>
                  )
                })}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={!!dialog} onOpenChange={(o) => !o && setDialog(null)}>
        <DialogContent className="w-[95vw] max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {dialog?.mode === 'edit' ? 'Edit Menu' : 'Add Menu'}
            </DialogTitle>
            <DialogDescription>Set the items for a specific day and meal.</DialogDescription>
          </DialogHeader>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Day</Label>
                <Controller
                  control={form.control}
                  name="day"
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {DAYS.map((d) => (
                          <SelectItem key={d} value={d}>
                            {d}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>
              <div className="space-y-2">
                <Label>Meal</Label>
                <Controller
                  control={form.control}
                  name="meal"
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {MEALS.map((m) => (
                          <SelectItem key={m} value={m}>
                            {m}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="items">Items</Label>
              <Textarea
                id="items"
                rows={4}
                placeholder="e.g. Paratha, Omelette, Tea"
                {...form.register('items')}
              />
              {form.formState.errors.items && (
                <p className="text-xs text-red-600">{form.formState.errors.items.message}</p>
              )}
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setDialog(null)}>
                Cancel
              </Button>
              <Button type="submit" disabled={createItem.isPending || updateItem.isPending}>
                {createItem.isPending || updateItem.isPending ? 'Saving…' : 'Save'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deleteTarget} onOpenChange={(o) => !o && setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete menu item?</AlertDialogTitle>
            <AlertDialogDescription>
              This will remove the {deleteTarget?.meal} menu for {deleteTarget?.day}. This cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-red-600 hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

export default MenuPage
