import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import api from '../../lib/api'
import toast from 'react-hot-toast'

const permissionGroups = [
  { group: 'Users', permissions: ['Create', 'Read', 'Update', 'Delete'] },
  { group: 'Roles', permissions: ['Create', 'Read', 'Update', 'Delete'] },
  { group: 'Communities', permissions: ['Create', 'Read', 'Update', 'Delete', 'Approve'] },
  { group: 'Members', permissions: ['Create', 'Read', 'Update', 'Delete'] },
  { group: 'Routes', permissions: ['Create', 'Read', 'Update', 'Delete'] },
  { group: 'Stops', permissions: ['Create', 'Read', 'Update', 'Delete'] },
  { group: 'Groups', permissions: ['Create', 'Read', 'Update', 'Delete'] },
  { group: 'Drivers', permissions: ['Create', 'Read', 'Update', 'Delete', 'Verify'] },
  { group: 'Vehicles', permissions: ['Create', 'Read', 'Update', 'Delete', 'Verify'] },
  { group: 'Bookings', permissions: ['Create', 'Read', 'Update', 'Delete', 'Cancel'] },
  { group: 'Trips', permissions: ['Create', 'Read', 'Update', 'Complete'] },
  { group: 'Payments', permissions: ['Create', 'Read', 'Update', 'Refund'] },
  { group: 'Notifications', permissions: ['Create', 'Read', 'Update', 'Delete', 'Send'] },
  { group: 'Ratings', permissions: ['Read', 'Delete'] },
  { group: 'Support', permissions: ['Create', 'Read', 'Update', 'Delete', 'Assign'] },
  { group: 'Audit', permissions: ['Read', 'Export'] },
  { group: 'Settings', permissions: ['Read', 'Update'] },
]

export default function RolesCreate() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [permissions, setPermissions] = useState<Record<string, Record<string, boolean>>>({})
  const [loading, setLoading] = useState(false)

  const togglePermission = (group: string, permission: string) => {
    setPermissions((prev) => ({
      ...prev,
      [group]: {
        ...(prev[group] || {}),
        [permission]: !(prev[group]?.[permission] ?? false),
      },
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) {
      toast.error('Role name is required')
      return
    }
    setLoading(true)
    try {
      const permissionList = Object.entries(permissions).flatMap(([group, perms]) =>
        Object.entries(perms).filter(([, granted]) => granted).map(([permission]) => ({
          permissionGroup: group,
          permissionName: permission,
          isGranted: true,
        }))
      )
      await api.post('/roles', { name, description, permissions: permissionList })
      toast.success('Role created successfully')
      navigate('/roles')
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to create role')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Create Role</h1>
        <p className="text-gray-500 mt-1">{t('roles.list')}</p>
      </div>
      <div className="card">
        <div className="card-body">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="label">Role Name *</label>
                <input type="text" className="input" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g., CommunityManager" required />
              </div>
              <div>
                <label className="label">Description</label>
                <input type="text" className="input" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Brief description" />
              </div>
            </div>

            <div>
              <label className="label">Permissions</label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                {permissionGroups.map(({ group, permissions: perms }) => (
                  <div key={group} className="border rounded-lg p-4">
                    <h4 className="font-medium text-gray-900 mb-2">{group}</h4>
                    <div className="space-y-2">
                      {perms.map((perm) => (
                        <label key={perm} className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={permissions[group]?.[perm] ?? false}
                            onChange={() => togglePermission(group, perm)}
                            className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                          />
                          <span className="text-sm text-gray-600">{perm}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-4 pt-4 border-t">
              <button type="submit" className="btn-primary" disabled={loading}>
                {loading ? 'Creating...' : t('roles.title')}
              </button>
              <button type="button" onClick={() => navigate('/roles')} className="btn-secondary">{t('common.cancel')}</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
