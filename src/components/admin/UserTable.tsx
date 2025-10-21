"use client"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { UserForAdmin } from "@/types"
import { updateUserRole } from "@/app/actions/userActions"
import { toast } from "sonner"
import { useState } from "react"

export function UserTable({ users, currentUserId }: { users: UserForAdmin[], currentUserId: string }) {
  const [roles, setRoles] = useState<Record<string, string>>({})

  const handleRoleChange = (userId: string, role: string) => {
    setRoles(prev => ({ ...prev, [userId]: role }))
  }

  const handleSaveRole = async (userId: string) => {
    const newRole = roles[userId]
    if (!newRole) return

    const result = await updateUserRole(userId, newRole as 'user' | 'admin')
    if (result.success) {
      toast.success("User role updated successfully")
    } else {
      toast.error(result.error)
    }
  }

  return (
    <div className="rounded-sm border-2 border-foreground neo-shadow">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Email</TableHead>
            <TableHead>Role</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.id}>
              <TableCell className="font-medium">{user.email}</TableCell>
              <TableCell>
                <Select
                  defaultValue={user.role ?? 'user'}
                  onValueChange={(value) => handleRoleChange(user.id, value)}
                  disabled={user.id === currentUserId}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="user">User</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                  </SelectContent>
                </Select>
              </TableCell>
              <TableCell className="text-right">
                <Button
                  onClick={() => handleSaveRole(user.id)}
                  disabled={!roles[user.id] || roles[user.id] === user.role || user.id === currentUserId}
                >
                  Save
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}