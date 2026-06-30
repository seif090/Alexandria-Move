import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import api from '../../lib/api'
import toast from 'react-hot-toast'
import { Save, RotateCcw } from 'lucide-react'

export default function Settings() {
  const { t } = useTranslation()
  const [settings, setSettings] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => { loadSettings() }, [])

  const loadSettings = async () => {
    try {
      const response = await api.get('/settings')
      let items = response.data || []
      if (items.length === 0) {
        await api.post('/settings/seed')
        const retry = await api.get('/settings')
        items = retry.data || []
      }
      const map: Record<string, string> = {}
      items.forEach((s: any) => { map[s.key] = s.value })
      setSettings(map)
    } catch {
      toast.error('Failed to load settings')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (key: string, value: string) => {
    setSettings((prev) => ({ ...prev, [key]: value }))
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      const settingsArray = Object.entries(settings).map(([key, value]) => ({ key, value }))
      await api.put('/settings', { settings: settingsArray })
      toast.success('Settings saved successfully')
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to save settings')
    } finally {
      setSaving(false)
    }
  }

  const handleReset = async () => {
    if (!confirm('Reset all settings to defaults?')) return
    try {
      await api.post('/settings/reset')
      toast.success('Settings reset')
      loadSettings()
    } catch {
      toast.error('Failed to reset')
    }
  }

  if (loading) return <div className="flex items-center justify-center h-64"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div></div>

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{t('settings.title')}</h1>
          <p className="text-gray-500 mt-1">{t('settings.general')}</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={handleReset} className="btn-secondary">
            <RotateCcw className="h-4 w-4 mr-2" />
            Reset
          </button>
          <button onClick={handleSave} className="btn-primary" disabled={saving}>
            <Save className="h-4 w-4 mr-2" />
            {saving ? 'Saving...' : t('settings.saveSettings')}
          </button>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <h3 className="text-lg font-semibold text-gray-900">{t('settings.general')}</h3>
        </div>
        <div className="card-body space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="label">{t('settings.appName')}</label>
              <input type="text" className="input" value={settings['PlatformName'] || ''} onChange={(e) => handleChange('PlatformName', e.target.value)} />
            </div>
            <div>
              <label className="label">Support Email</label>
              <input type="email" className="input" value={settings['SupportEmail'] || ''} onChange={(e) => handleChange('SupportEmail', e.target.value)} />
            </div>
            <div>
              <label className="label">{t('common.phone')}</label>
              <input type="tel" className="input" value={settings['SupportPhone'] || ''} onChange={(e) => handleChange('SupportPhone', e.target.value)} />
            </div>
            <div>
              <label className="label">{t('common.amount')}</label>
              <select className="input" value={settings['DefaultCurrency'] || 'USD'} onChange={(e) => handleChange('DefaultCurrency', e.target.value)}>
                <option value="USD">USD ($)</option>
                <option value="EUR">EUR (€)</option>
                <option value="EGP">EGP (£)</option>
                <option value="SAR">SAR (﷼)</option>
              </select>
            </div>
            <div>
              <label className="label">Time Zone</label>
              <select className="input" value={settings['TimeZone'] || 'UTC'} onChange={(e) => handleChange('TimeZone', e.target.value)}>
                <option value="UTC">UTC</option>
                <option value="America/New_York">Eastern (US)</option>
                <option value="Africa/Cairo">Cairo (Egypt)</option>
                <option value="Asia/Riyadh">Riyadh (Saudi Arabia)</option>
              </select>
            </div>
            <div>
              <label className="label">Date Format</label>
              <select className="input" value={settings['DateFormat'] || 'MM/DD/YYYY'} onChange={(e) => handleChange('DateFormat', e.target.value)}>
                <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                <option value="YYYY-MM-DD">YYYY-MM-DD</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="card mt-6">
        <div className="card-header">
          <h3 className="text-lg font-semibold text-gray-900">{t('settings.security')}</h3>
        </div>
        <div className="card-body space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="label">Password Min Length</label>
              <input type="number" className="input" value={settings['PasswordMinLength'] || '8'} onChange={(e) => handleChange('PasswordMinLength', e.target.value)} />
            </div>
            <div>
              <label className="label">Max Login Attempts</label>
              <input type="number" className="input" value={settings['MaxLoginAttempts'] || '5'} onChange={(e) => handleChange('MaxLoginAttempts', e.target.value)} />
            </div>
            <div>
              <label className="label">Session Timeout (minutes)</label>
              <input type="number" className="input" value={settings['SessionTimeoutMinutes'] || '60'} onChange={(e) => handleChange('SessionTimeoutMinutes', e.target.value)} />
            </div>
            <div>
              <label className="label">Require Email Verification</label>
              <select className="input" value={settings['RequireEmailVerification'] || 'true'} onChange={(e) => handleChange('RequireEmailVerification', e.target.value)}>
                <option value="true">Yes</option>
                <option value="false">No</option>
              </select>
            </div>
            <div>
              <label className="label">Enable Two-Factor Auth</label>
              <select className="input" value={settings['EnableTwoFactor'] || 'false'} onChange={(e) => handleChange('EnableTwoFactor', e.target.value)}>
                <option value="true">Enabled</option>
                <option value="false">Disabled</option>
              </select>
            </div>
            <div>
              <label className="label">JWT Expiry (hours)</label>
              <input type="number" className="input" value={settings['JwtExpiryHours'] || '24'} onChange={(e) => handleChange('JwtExpiryHours', e.target.value)} />
            </div>
          </div>
        </div>
      </div>

      <div className="card mt-6">
        <div className="card-header">
          <h3 className="text-lg font-semibold text-gray-900">{t('settings.general')}</h3>
        </div>
        <div className="card-body space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="label">Max Booking Advance (days)</label>
              <input type="number" className="input" value={settings['MaxBookingAdvanceDays'] || '30'} onChange={(e) => handleChange('MaxBookingAdvanceDays', e.target.value)} />
            </div>
            <div>
              <label className="label">Cancellation Fee (%)</label>
              <input type="number" className="input" value={settings['CancellationFeePercent'] || '10'} onChange={(e) => handleChange('CancellationFeePercent', e.target.value)} min={0} max={100} />
            </div>
            <div>
              <label className="label">Driver Commission (%)</label>
              <input type="number" className="input" value={settings['DriverCommissionPercent'] || '15'} onChange={(e) => handleChange('DriverCommissionPercent', e.target.value)} min={0} max={100} />
            </div>
            <div>
              <label className="label">Max Passengers Per Booking</label>
              <input type="number" className="input" value={settings['MaxPassengersPerBooking'] || '5'} onChange={(e) => handleChange('MaxPassengersPerBooking', e.target.value)} />
            </div>
            <div>
              <label className="label">Enable Public Registration</label>
              <select className="input" value={settings['EnablePublicRegistration'] || 'true'} onChange={(e) => handleChange('EnablePublicRegistration', e.target.value)}>
                <option value="true">Enabled</option>
                <option value="false">Disabled</option>
              </select>
            </div>
            <div>
              <label className="label">Auto-Approve Communities</label>
              <select className="input" value={settings['AutoApproveCommunities'] || 'false'} onChange={(e) => handleChange('AutoApproveCommunities', e.target.value)}>
                <option value="true">Enabled</option>
                <option value="false">Disabled</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

