'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Button, Card, Modal, Form, Input, InputNumber, DatePicker} from 'antd'
import dayjs from 'dayjs'
const  { TextArea } = Input

export default function Home() {
  const [chemicals, setChemicals] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingID, setEditingID] = useState(null)
  const [modalChemical, setModalChemical] = useState(null)
  const [form] = Form.useForm()


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

  async function addChemical(values) {
  
    try {
      const { data, error } = await supabase
        .from('chemical')
        .insert([{
          user_id: null,
          chemical_name: values.chemical_name,
          cas_number: values.cas_number,
          amount: values.amount,
          unit: values.unit,
          location: values.location,
          expiration_date: values.expiration_date,
          manufacturer_information: values.manufacturer_information,
          lot_number: values.lot_number,
          notes: values.notes
        }])
      
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
      form.resetFields()
      setShowForm(false)
      //Refresh the list
      fetchChemicals()
    
    } catch (error) {
      console.error('Error adding chemical:', error)
      alert('Error adding chemical. Check console for details.')
    }
  }

  function startEdit(chemical) {
    setEditingID(chemical.id)
    form.setFieldsValue({
      chemical_name: chemical.chemical_name || '',
      cas_number: chemical.cas_number || '',
      amount: chemical.amount || '',
      unit: chemical.unit || '',
      location: chemical.location || '',
      expiration_date: chemical.expiration_date ? dayjs(chemical.expiration_date) : null,
      manufacturer_information: chemical.manufacturer_information || '',
      lot_number: chemical.lot_number || '',
      notes: chemical.notes || ''
    })

    setShowForm(true)

  }


  async function editChemicals(values) {

    try {
      const { error } = await supabase
        .from('chemical')
        .update({
          chemical_name: values.chemical_name,
          cas_number: values.cas_number,
          amount: values.amount,
          unit: values.unit,
          location: values.location,
          expiration_date: values.expiration_date ? values.expiration_date.format('YYYY-MM-DD') : null,
          manufacturer_information: values.manufacturer_information,
          lot_number: values.lot_number,
          notes: values.notes
        })
        .eq('id', editingID)
      
      if (error) {
          console.error('Full error object:', error)
          console.error('Error message:', error.message)
          console.error('Error details:', error.details)
          console.error('Error hint:', error.hint)
          throw error
        }


      setEditingID(null)
      setShowForm(false)
      fetchChemicals()

      } catch (error) {
        console.error('Error updating chemical:', error)
        alert('Error updating chemical. Check console for details.')
      }
    }


  if (loading) {
    return <div className="p-8">Loading...</div>
  }

  return (
  <div 
    className="p-8 min-h-screen"
    style={{
      background: 'linear-gradient(135deg, #d4b3db 0%, #b8c2df 100%)'
    }}>
    <div className="flex justify-between items-center mb-6">
      <h1 className="text-3xl font-bold">Chemical Inventory</h1>
      <Button 
        onClick={() => {
          setShowForm(!showForm)
          setEditingID(null)
          form.setFieldsValue({
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
      <Form 
        form = {form}
        onFinish = {editingID ? editChemicals : addChemical}
        layout="vertical"
        className="bg-white p-6 rounded mb-6 shadow-md"
      >
        <div className="grid grid-cols-2 gap-4">
          <Form.Item 
            label="Chemical Name" 
            name="chemical_name"
            rules={[{ required: true, message: 'Please enter a chemical name' }]}
          >
            <Input placeholder="Enter a name for your chemical" />
          </Form.Item>

          <Form.Item 
            label="CAS Number" 
            name="cas_number"
          >
            <Input placeholder="Enter your chemical's CAS number if applicable" />
          </Form.Item>

          <Form.Item 
            label="Amount" 
            name="amount"
          >
            <InputNumber placeholder="Select an amount" />
          </Form.Item>

          <Form.Item 
            label="Unit" 
            name="unit"
          >
            <Input placeholder="Enter a unit (g, mL, etc)" />
          </Form.Item>

          <Form.Item 
            label="Location" 
            name="location"
            rules={[{ required: true, message: 'Please enter a location' }]}
          >
            <Input placeholder="Enter chemical's storage location" />
          </Form.Item>

          <Form.Item 
            label="Expiration Date" 
            name="expiration_date"
          >
            <DatePicker/>
          </Form.Item>

          <Form.Item 
            label="Manufacturer" 
            name="manufacturer_information"
          >
            <Input placeholder="Enter your chemical's manufacturer" />
          </Form.Item>

          <Form.Item 
            label="Lot Number" 
            name="lot_number"
          >
            <Input placeholder="Enter lot number if applicable" />
          </Form.Item>

          <Form.Item 
            label="Notes" 
            name="notes"
            className="col-span-2"
          >
            <TextArea rows={3} placeholder="Enter any additional notes here" />
          </Form.Item>
        </div>

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
          >
            {editingID ? 'Update Chemical' : 'Save Chemical'}
          </Button>
        </Form.Item>
      </Form>
    )}
    
    {chemicals.length === 0 ? (
      <p>No chemicals yet. Add some using the button above!</p>
    ) : (
      <>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {chemicals.map((chemical) => {
          return (
            <Card
              key={chemical.id}
              title={chemical.chemical_name}
              size="small"
              onClick={() => setModalChemical(chemical)} 
              className="cursor-pointer hover:shadow-lg transition-shadow"
              extra={
                <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
                  <Button
                    type="primary"
                    size="small"
                    onClick={() => startEdit(chemical)}
                  >
                    Edit
                  </Button>
                  
                  <Button
                    danger
                    size="small"
                    onClick={() => deleteChemical(chemical.id)}
                  >
                    Delete
                  </Button>
                </div>
              }
            >
              <p className="text-gray-500">Location: {chemical.location}</p>
            </Card>
          )
        })}
      </div>

      <Modal
      title={modalChemical?.chemical_name}
      open={modalChemical !== null}
      onCancel={() => setModalChemical(null)}
      footer={null}
      width={600}
      >
        {modalChemical && (
          <div>
            <h2>{modalChemical.chemical_name}</h2>
            <p className="text-gray-600">CAS: {modalChemical.cas_number}</p>
            <p>Amount: {modalChemical.amount} {modalChemical.unit}</p>
            <p>Location: {modalChemical.location}</p>
            <p>Expires: {modalChemical.expiration_date}</p>
            <p>Manufacturer: {modalChemical.manufacturer_information}</p>
            <p>Lot Number: {modalChemical.lot_number}</p>
            {modalChemical.notes && <p className="text-sm italic mt-2">{modalChemical.notes}</p>}
          </div>
        )}
      </Modal>
    </>
  )}
  </div>
)}
