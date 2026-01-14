'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Button, Card, Modal} from 'antd'

export default function Home() {
  const [chemicals, setChemicals] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingID, setEditingID] = useState(null)
  const [expandedID, setExpandedID] = useState(null)
  const [formData, setFormData] = useState({
    chemical_name: '',
    cas_number: '',
    amount: '',
    unit: '',
    location: '',
    expiration_date: '',
    manufacturer_information: '',
    lot_number: '',
    notes: ''
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

  async function deleteChemical(chemicalId) {
    try {

      if (window.confirm('Are you sure you want to delete this chemical?')) {

      const { error } = await supabase
      .from('chemical')
      .delete()
      .eq('id', chemicalId)

      if (error) {
        console.error('Full error object:', error)
        console.error('Error message:', error.message)
        console.error('Error details:', error.details)
        console.error('Error hint:', error.hint)
        throw error
      } else {
        fetchChemicals()
      }
      }

    } catch (error) {
    console.error('Error deleting chemical:', error)
    alert('Error deleting chemical. Check console for details.')
    }

  }

  async function addChemical(e) {
    e.preventDefault()
  
    console.log('Form data being submitted:', formData)
  
    try {
      const dataToInsert = {
        user_id: null,
        chemical_name: formData.chemical_name,
        cas_number: formData.cas_number,
        amount: parseInt(formData.amount) || null,
        unit: formData.unit,
        location: formData.location,
        expiration_date: formData.expiration_date || null,
        manufacturer_information: formData.manufacturer_information,
        lot_number: formData.lot_number,
        notes: formData.notes
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
        chemical_name: '',
        cas_number: '',
        amount: '',
        unit: '',
        location: '',
        expiration_date: '',
        manufacturer_information: '',
        lot_number: '',
        notes: ''
      })
      setShowForm(false)
    
      // Refresh the list
      fetchChemicals()
    } catch (error) {
      console.error('Error adding chemical:', error)
      alert('Error adding chemical. Check console for details.')
    }
  }

  function startEdit(chemical) {
  setEditingID(chemical.id)
  setFormData({
    chemical_name: chemical.chemical_name || '',
    cas_number: chemical.cas_number || '',
    amount: chemical.amount || '',
    unit: chemical.unit || '',
    location: chemical.location || '',
    expiration_date: chemical.expiration_date || '',
    manufacturer_information: chemical.manufacturer_information || '',
    lot_number: chemical.lot_number || '',
    notes: chemical.notes || ''
  })

  setShowForm(true)

}


async function editChemicals(e) {
  e.preventDefault()

  try {
    const { error } = await supabase
      .from('chemical')
      .update({
        chemical_name: formData.chemical_name,
        cas_number: formData.cas_number,
        amount: formData.amount,
        unit: formData.unit,
        location: formData.location,
        expiration_date: formData.expiration_date,
        manufacturer_information: formData.manufacturer_information,
        lot_number: formData.lot_number,
        notes: formData.notes
      })
      .eq('id', editingID)
    
    if (error) {
        console.error('Full error object:', error)
        console.error('Error message:', error.message)
        console.error('Error details:', error.details)
        console.error('Error hint:', error.hint)
        throw error
      }

    setFormData({
      chemical_name: '',
      cas_number: '',
      amount: '',
      unit: '',
      location: '',
      expiration_date: '',
      manufacturer_information: '',
      lot_number: '',
      notes: ''
    })

    setEditingID(null)
    setShowForm(false)
    fetchChemicals()

    } catch (error) {
      console.error('Error updating chemical:', error)
      alert('Error updating chemical. Check console for details.')
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
      <Button 
        onClick={() => {
          setShowForm(!showForm)
          setEditingID(null)
          setFormData({
            chemical_name: '',
            cas_number: '',
            amount: '',
            unit: '',
            location: '',
            expiration_date: '',
            manufacturer_information: '',
            lot_number: '',
            notes: ''
          })
        }}
        type='primary'
      >
        {editingID ? 'Cancel Edit' : (showForm ? 'Cancel' : 'Add Chemical')}
      </Button>
    </div>
    
    {showForm && (
      <form onSubmit={editingID ? editChemicals : addChemical} className="bg-black-50 p-6 rounded mb-6">
        <div className="grid grid-cols-2 gap-4">
          <input
            type="text"
            name="chemical_name"
            placeholder="Chemical Name *"
            value={formData.chemical_name}
            onChange={handleInputChange}
            required
            className="border p-2 rounded"
          />
          <input
            type="text"
            name="cas_number"
            placeholder="CAS Number"
            value={formData.cas_number}
            onChange={handleInputChange}
            className="border p-2 rounded"
          />
          <input
            type="number"
            name="amount"
            placeholder="Amount"
            value={formData.amount}
            onChange={handleInputChange}
            className="border p-2 rounded"
          />
          <input
            type="text"
            name="unit"
            placeholder="Unit (g, mL, etc)"
            value={formData.unit}
            onChange={handleInputChange}
            className="border p-2 rounded"
          />
          <input
            type="text"
            name="location"
            placeholder="Location *"
            value={formData.location}
            onChange={handleInputChange}
            required
            className="border p-2 rounded"
          />
          <input
            type="date"
            name="expiration_date"
            placeholder="Expiration Date"
            value={formData.expiration_date}
            onChange={handleInputChange}
            className="border p-2 rounded"
          />
          <input
            type="text"
            name="manufacturer_information"
            placeholder="Manufacturer"
            value={formData.manufacturer_information}
            onChange={handleInputChange}
            className="border p-2 rounded"
          />
          <input
            type="text"
            name="lot_number"
            placeholder="Lot Number"
            value={formData.lot_number}
            onChange={handleInputChange}
            className="border p-2 rounded"
          />
          <textarea
            name="notes"
            placeholder="Notes"
            value={formData.notes}
            onChange={handleInputChange}
            className="border p-2 rounded col-span-2"
            rows="3"
          />
        </div>
        <Button
          type="primary"
          style={{backgroundColor: '#04AA6D', }}
          htmlType="submit"
        >
          Save Chemical
        </Button>
      </form>
    )}
    
    {chemicals.length === 0 ? (
      <p>No chemicals yet. Add some using the button above!</p>
    ) : (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {chemicals.map((chemical) => {

          const isExpanded = expandedID === chemical.id
        
          return (
            <div
              key={chemical.id} 
              onClick={() => setExpandedID(isExpanded ? null : chemical.id)} 
              className="border p-4 rounded"
            >

              <h2 className="text-xl font-semibold">{chemical.chemical_name}</h2>

              {isExpanded && (
                <>
                  <p className="text-gray-600">CAS: {chemical.cas_number}</p>
                  <p>Amount: {chemical.amount} {chemical.unit}</p>
                  <p>Location: {chemical.location}</p>
                  <p>Expires: {chemical.expiration_date}</p>
                  <p>Manufacturer: {chemical.manufacturer_information}</p>
                  <p>Lot Number: {chemical.lot_number}</p>
                  {chemical.notes && <p className="text-sm italic mt-2">{chemical.notes}</p>}
                  <button onClick={() => deleteChemical(chemical.id)}> 
                    Delete 
                  </button>
                  <Button 
                    onClick={() => startEdit(chemical)}
                    type="primary"
                  >
                    Edit
                  </Button>
                </>
              )}
            </div>
          )})}
      </div>
    )}
  </div>
      

)}
