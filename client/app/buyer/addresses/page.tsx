'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/shared/Badge'
import { Plus, Edit2, Trash2, MapPin } from 'lucide-react'

export default function BuyerAddresses() {
  const [addresses, setAddresses] = useState([
    {
      id: 1,
      name: 'Head Office',
      type: 'Billing',
      address: '123 Business Ave, Suite 100',
      city: 'New York',
      state: 'NY',
      zipcode: '10001',
      country: 'United States',
      phone: '+1 (212) 555-0100',
      isDefault: true,
    },
    {
      id: 2,
      name: 'Warehouse',
      type: 'Shipping',
      address: '456 Industrial Blvd',
      city: 'Newark',
      state: 'NJ',
      zipcode: '07102',
      country: 'United States',
      phone: '+1 (973) 555-0200',
      isDefault: false,
    },
    {
      id: 3,
      name: 'Branch Office',
      type: 'Shipping',
      address: '789 Commerce Street',
      city: 'Boston',
      state: 'MA',
      zipcode: '02101',
      country: 'United States',
      phone: '+1 (617) 555-0300',
      isDefault: false,
    },
  ])

  const handleAddAddress = () => {
    alert('Add New Address\n\nOpening form to add a new shipping or billing address.')
  }

  const handleEditAddress = (id: number) => {
    const address = addresses.find((a) => a.id === id)
    alert(`Edit Address: ${address?.name}\n\nOpening edit form for this address.`)
  }

  const handleDeleteAddress = (id: number) => {
    if (window.confirm('Delete this address?')) {
      setAddresses(addresses.filter((a) => a.id !== id))
      alert('Address deleted successfully')
    }
  }

  const handleSetDefault = (id: number) => {
    setAddresses(
      addresses.map((a) => ({
        ...a,
        isDefault: a.id === id,
      }))
    )
    alert('Default address updated')
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Shipping Addresses</h1>
          <p className="text-slate-600 mt-1">Manage your delivery and billing addresses</p>
        </div>
        <button
          onClick={handleAddAddress}
          className="flex items-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium"
        >
          <Plus className="w-5 h-5" />
          Add Address
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {addresses.map((address) => (
          <Card key={address.id} className="p-6 relative">
            {address.isDefault && (
              <div className="absolute top-4 right-4">
                <Badge variant="success">Default</Badge>
              </div>
            )}

            <div className="flex items-start gap-3 mb-4 pt-6">
              <MapPin className="w-5 h-5 text-purple-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-slate-900">{address.name}</h3>
                <p className="text-sm text-slate-600">{address.type}</p>
              </div>
            </div>

            <div className="space-y-2 mb-6">
              <p className="text-slate-900">{address.address}</p>
              <p className="text-slate-900">
                {address.city}, {address.state} {address.zipcode}
              </p>
              <p className="text-slate-900">{address.country}</p>
              <p className="text-slate-600">{address.phone}</p>
            </div>

            <div className="flex gap-2 pt-4 border-t border-slate-200">
              <button
                onClick={() => handleEditAddress(address.id)}
                className="flex-1 px-3 py-2 border border-slate-300 rounded-lg hover:bg-slate-100 transition-colors text-sm font-medium flex items-center justify-center gap-2"
              >
                <Edit2 className="w-4 h-4" />
                Edit
              </button>
              <button
                onClick={() => handleDeleteAddress(address.id)}
                className="flex-1 px-3 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors text-sm font-medium flex items-center justify-center gap-2"
              >
                <Trash2 className="w-4 h-4" />
                Delete
              </button>
              {!address.isDefault && (
                <button
                  onClick={() => handleSetDefault(address.id)}
                  className="flex-1 px-3 py-2 bg-purple-100 text-purple-600 rounded-lg hover:bg-purple-200 transition-colors text-sm font-medium"
                >
                  Set Default
                </button>
              )}
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
