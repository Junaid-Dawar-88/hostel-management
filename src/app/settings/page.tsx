import React from 'react'

const SettingsPage = () => {
  return (
    <div className="p-4 sm:p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Settings</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">Manage hostel preferences</p>
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 p-4 sm:p-6 space-y-4 w-full max-w-2xl">
        <div>
          <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">Hostel Name</label>
          <input
            type="text"
            defaultValue="Hostel Admin"
            className="w-full border rounded-lg px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">Warden Email</label>
          <input
            type="email"
            defaultValue="warden@hostel.local"
            className="w-full border rounded-lg px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <button className="w-full sm:w-auto bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
          Save Changes
        </button>
      </div>
    </div>
  )
}

export default SettingsPage
