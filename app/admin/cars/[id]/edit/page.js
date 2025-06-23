'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { Plus } from 'lucide-react'

const FUEL_TYPES = ['Petrol', 'Diesel', 'Electric', 'Hybrid', 'CNG']
const TRANSMISSIONS = ['Automatic', 'Manual']

export default function EditCarPage() {
  const router = useRouter()
  const { id } = useParams()
  const [form, setForm] = useState(null)
  const [loading, setLoading] = useState(true)

  console.log('Editing car with ID:', id);
  
  useEffect(() => {
    // Fetch car details
    const fetchCar = async () => {
      try {
        const res = await fetch(`/api/cars/${id}`)
        const data = await res.json()
        setForm(data)
      } catch (err) {
        console.error('Failed to fetch car:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchCar()
  }, [id])

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleImageChange = (index, value) => {
    const updated = [...form.images]
    updated[index] = value
    setForm((prev) => ({ ...prev, images: updated }))
  }

  const addImageField = () => {
    setForm((prev) => ({ ...prev, images: [...prev.images, ''] }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const res = await fetch(`/api/cars/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (res.ok) {
        router.push('/admin/cars')
      } else {
        alert('Update failed')
      }
    } catch (err) {
      console.error('Error updating car:', err)
    }
  }

  if (loading || !form) return <div className="p-10 text-gray-600">Loading...</div>

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4 md:px-10">
      <div className="max-w-5xl mx-auto bg-white shadow-md rounded-2xl p-8 md:p-10">
        <h1 className="text-3xl font-semibold text-gray-800 mb-2">✏️ Edit Car</h1>
        <form onSubmit={handleSubmit} className="space-y-10">
          {/* Fields same as add page */}
          <div className="grid md:grid-cols-3 gap-4">
            <input name="brand" value={form.brand} onChange={handleChange} className="input" required />
            <input name="model" value={form.model} onChange={handleChange} className="input" required />
            <input name="year" type="number" value={form.year} onChange={handleChange} className="input" required />
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            <input name="price" type="number" value={form.price} onChange={handleChange} className="input" required />
            <input name="mileage" type="number" value={form.mileage} onChange={handleChange} className="input" />
            <input name="color" value={form.color} onChange={handleChange} className="input" />
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <select name="fuelType" value={form.fuelType} onChange={handleChange} className="input" required>
              <option value="">Select Fuel</option>
              {FUEL_TYPES.map(f => <option key={f}>{f}</option>)}
            </select>
            <select name="transmission" value={form.transmission} onChange={handleChange} className="input" required>
              <option value="">Select Transmission</option>
              {TRANSMISSIONS.map(t => <option key={t}>{t}</option>)}
            </select>
          </div>

          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-200 rounded-lg"
            rows={4}
          />

          <div className="space-y-2">
            {form.images.map((img, index) => (
              <input
                key={index}
                value={img}
                onChange={(e) => handleImageChange(index, e.target.value)}
                className="input"
                placeholder="Image URL"
              />
            ))}
            <button type="button" onClick={addImageField} className="text-sm text-blue-600 hover:underline flex items-center gap-1">
              <Plus size={14} /> Add Image
            </button>
          </div>

          <button type="submit" className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg text-lg hover:bg-blue-700 transition">
            ✅ Save Changes
          </button>
        </form>
      </div>
    </div>
  )
}
