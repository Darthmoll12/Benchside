'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function Home() {
  const [chemicals, setChemicals] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    Chemical_Name: '',
    CAS_Number: '',
    Amount: '',
    Unit: '',
    Location: '',
    Expiration_date: '',
    Manufacturer_Information: '',
    Lot_Number: '',
    Notes: ''
  })

  useEffect(() => {
    fetchChemicals()
  }, [])

  async function fetchChemicals() {
    try {
      const { data, error } = await supabase
        .from('chemical')
        .select('*')
        .order('created_at', { ascending: false })
      
      if (error) throw error
      setChemicals(data || [])
    } catch (error) {
      console.error('Error fetching chemicals:', error)
    } finally {
      setLoading(false)
    }
  }

  async function addChemical(e) {
    e.preventDefault()
  
    console.log('Form data being submitted:', formData)
  
    try {
      const dataToInsert = {
        user_id: null,
        Chemical_Name: formData.Chemical_Name,
        CAS_Number: formData.CAS_Number,
        Amount: parseInt(formData.Amount) || null,
        Unit: formData.Unit,
        Location: formData.Location,
        Expiration_date: formData.Expiration_date || null,
        Manufacturer_Information: formData.Manufacturer_Information,
        Lot_Number: formData.Lot_Number,
        Notes: formData.Notes
      }
    
      console.log('Data being inserted:', dataToInsert)
    
      const { data, error } = await supabase
        .from('chemical')
        .insert([dataToInsert])
        .select()
      
      console.log('Supabase response:', { data, error })
      
      if (error) {
        console.error('Full error object:', error)
        console.error('Error message:', error.message)
        console.error('Error details:', error.details)
        console.error('Error hint:', error.hint)
        throw error
      }
      
      console.log('Successfully inserted:', data)
    
      // Clear form and hide it
      setFormData({
        Chemical_Name: '',
        CAS_Number: '',
        Amount: '',
        Unit: '',
        Location: '',
        Expiration_date: '',
        Manufacturer_Information: '',
        Lot_Number: '',
        Notes: ''
      })
      setShowForm(false)
    
      // Refresh the list
      fetchChemicals()
    } catch (error) {
      console.error('Error adding chemical:', error)
      alert('Error adding chemical. Check console for details.')
    }
  }

  function handleInputChange(e) {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  if (loading) {
    return <div className="p-8">Loading...</div>
  }

  return (
  <div className="p-8">
    <div className="flex justify-between items-center mb-6">
      <h1 className="text-3xl font-bold">Chemical Inventory</h1>
      <button 
        onClick={() => setShowForm(!showForm)}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        {showForm ? 'Cancel' : 'Add Chemical'}
      </button>
    </div>
    
    {showForm && (
      <form onSubmit={addChemical} className="bg-black-50 p-6 rounded mb-6">
        <div className="grid grid-cols-2 gap-4">
          <input
            type="text"
            name="chemical_name"
            placeholder="Chemical Name *"
            value={formData.Chemical_name}
            onChange={handleInputChange}
            required
            className="border p-2 rounded"
          />
          <input
            type="text"
            name="cas_number"
            placeholder="CAS Number"
            value={formData.CAS_Number}
            onChange={handleInputChange}
            className="border p-2 rounded"
          />
          <input
            type="number"
            name="amount"
            placeholder="Amount"
            value={formData.Amount}
            onChange={handleInputChange}
            className="border p-2 rounded"
          />
          <input
            type="text"
            name="unit"
            placeholder="Unit (g, mL, etc)"
            value={formData.Unit}
            onChange={handleInputChange}
            className="border p-2 rounded"
          />
          <input
            type="text"
            name="location"
            placeholder="Location *"
            value={formData.Location}
            onChange={handleInputChange}
            required
            className="border p-2 rounded"
          />
          <input
            type="date"
            name="expiration_date"
            placeholder="Expiration Date"
            value={formData.Expiration_date}
            onChange={handleInputChange}
            className="border p-2 rounded"
          />
          <input
            type="text"
            name="manufacturer_information"
            placeholder="Manufacturer"
            value={formData.Manufacturer_Information}
            onChange={handleInputChange}
            className="border p-2 rounded"
          />
          <input
            type="text"
            name="lot_number"
            placeholder="Lot Number"
            value={formData.Lot_number}
            onChange={handleInputChange}
            className="border p-2 rounded"
          />
          <textarea
            name="notes"
            placeholder="Notes"
            value={formData.Notes}
            onChange={handleInputChange}
            className="border p-2 rounded col-span-2"
            rows="3"
          />
        </div>
        <button 
          type="submit"
          className="mt-4 bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600"
        >
          Save Chemical
        </button>
      </form>
    )}
    
    {chemicals.length === 0 ? (
      <p>No chemicals yet. Add some using the button above!</p>
    ) : (
      <div className="space-y-4">
        {chemicals.map((chemical) => (
          <div key={chemical.id} className="border p-4 rounded">
            <h2 className="text-xl font-semibold">{chemical.chemical_name}</h2>
            <p className="text-gray-600">CAS: {chemical.cas_number}</p>
            <p>Amount: {chemical.amount} {chemical.unit}</p>
            <p>Location: {chemical.location}</p>
            <p>Expires: {chemical.expiration_date}</p>
            <p>Manufacturer: {chemical.manufacturer_information}</p>
            <p>Lot Number: {chemical.lot_number}</p>
            {chemical.notes && <p className="text-sm italic mt-2">{chemical.notes}</p>}
          </div>
        ))}
      </div>
    )}
  </div>
)
}
