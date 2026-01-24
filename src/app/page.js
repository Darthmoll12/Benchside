'use client'

import { Button, Card, Modal, Form, Input, InputNumber, DatePicker, Select, Table, Segmented} from 'antd'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { ExperimentOutlined } from '@ant-design/icons'
import { AppstoreOutlined, UnorderedListOutlined } from '@ant-design/icons'
import dayjs from 'dayjs'
const  { TextArea } = Input

export default function Home() {
  const [chemicals, setChemicals] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingID, setEditingID] = useState(null)
  const [modalChemical, setModalChemical] = useState(null)
  const [form] = Form.useForm()
  const [viewMode, setViewMode] = useState('cards')


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
          amount: values.amount || null,
          unit: values.unit,
          location: values.location,
          expiration_date: values.expiration_date || null,
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
          amount: values.amount || null,
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

  
  const columns = [
    {
      title: "Chemical Name",
      dataIndex: "chemical_name",
      key: "chemical_name",
      sorter: (a, b) => a.chemical_name.localeCompare(b.chemical_name)
    },
    {
      title: "CAS Number",
      dataIndex: "cas_number",
      key: "cas_number",
      sorter: (a, b) => a.cas_number.localeCompare(b.cas_number)
    },
    {
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
      sorter: (a, b) => a.amount - b.amount
    },
    {
      title: "Unit",
      dataIndex: "unit",
      key: "unit"
    },
    {
      title: "Location",
      dataIndex: "location",
      key: "location",
      sorter: (a, b) => a.location.localeCompare(b.location)
    },
    {
      title: "Expiration Date",
      dataIndex: "expiration_date",
      key: "expiration_date",
      sorter: (a, b) => {
        if (!a.expiration_date) return 1  // Put nulls at the end
        if (!b.expiration_date) return -1
        return a.expiration_date.localeCompare(b.expiration_date)
      }
    },
    {
      title: "Manufacturer",
      dataIndex: "manufacturer_information",
      key: "manufacturer_information",
      sorter: (a, b) => a.manufacturer_information.localeCompare(b.manufacturer_information)
    },
    {
      title: "Lot Number",
      dataIndex: "lot_number",
      key: "lot_number",
      sorter: (a, b) => a.lot_number.localeCompare(b.lot_number)
    },
    {
      title: "Notes",
      dataIndex: "notes",
      key: "notes",
    },
    {
      title: "Actions",
      key: "actions",
      render: (text, record) => (
        <div style={{ display: 'flex', gap: '8px' }}>
        <Button 
        type="primary" 
        size="small"
        onClick={() => startEdit(record)}
        >
        Edit
        </Button>
        <Button 
        danger 
        size="small"
        onClick={() => deleteChemical(record.id)}
        >
        Delete
        </Button>
        </div>
      )
    }
  ]


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

        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <Segmented
            value={viewMode}
            onChange={setViewMode}
            options={[
              { label: 'Cards', value: 'cards', icon: <AppstoreOutlined /> },
              { label: 'Table', value: 'table', icon: <UnorderedListOutlined /> },
            ]}
          />
          
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
      </div>
  


    {showForm && (
      <Form
        form={form}
        onFinish={editingID ? editChemicals : addChemical}
        layout="vertical"
        style={{
          backgroundColor: '#ffffff',
          boxShadow: '0 10px 40px rgba(109, 126, 194, 0.2)',
          padding: '40px',
          borderRadius: '12px',
          marginBottom: '48px'
        }}
      >
        <div className="grid grid-cols-2 gap-4">
          <Form.Item
            label="Chemical Name"
            name="chemical_name"
            hasFeedback
            rules={[{ required: true, message: 'Please enter a chemical name' }]}
          >
            <Input
              placeholder="e.g., Sodium Chloride"
              style={{ borderColor: '#6d7ec2' }}
              prefix={<ExperimentOutlined />}
            />
          </Form.Item>

          <Form.Item
            label="CAS Number"
            name="cas_number"
            tooltip="Chemical Abstracts Service registry number (e.g., 64-17-5)"
            hasFeedback
          >
            <Input
              placeholder="Enter your chemical's CAS number if applicable"
              style={{ borderColor: '#6d7ec2' }}
            />
          </Form.Item>

          <Form.Item
            label="Amount"
            name="amount"
            tooltip="Numerical quantity of chemical (without units)"
            rules={[{ required: true, message: "Please enter an amount" }]}
            hasFeedback
          >
            <InputNumber
              placeholder="Enter a quantity"
              min={0.0}
              step={0.1}
              style={{
                width: '100%',
                borderColor: '#6d7ec2'
              }}
            />
          </Form.Item>

          <Form.Item
            label="Unit"
            name="unit"
            rules={[{ required: true, message: "Please enter an unit" }]}
            hasFeedback
          >
            <Select
              placeholder="Select a unit (g, mL, etc)"
              style={{ borderColor: '#6d7ec2' }}
            >
              <Select.Option value="g">g (grams)</Select.Option>
              <Select.Option value="mg">mg (milligrams)</Select.Option>
              <Select.Option value="mL">mL (milliliters)</Select.Option>
              <Select.Option value="L">L (liters)</Select.Option>
              <Select.Option value="mol">mol (moles)</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item
            label="Location"
            name="location"
            rules={[{ required: true, message: 'Please enter a location' }]}
            tooltip="Physical storage location (cabinet, shelf, room number)"
            hasFeedback
          >
            <Input
              placeholder="Enter room number"
              style={{ borderColor: '#6d7ec2' }}
            />
          </Form.Item>

          <Form.Item
            label="Expiration Date"
            name="expiration_date"
            tooltip="Date when the chemical expires or should be disposed of"
            hasFeedback
          >
            <DatePicker
              style={{
                width: '100%',
                borderColor: '#6d7ec2'
              }}
            />
          </Form.Item>

          <Form.Item
            label="Manufacturer"
            name="manufacturer_information"
            tooltip="Company that produced or supplied this chemical"
            hasFeedback
          >
            <Input
              placeholder="Enter your chemical's manufacturer"
              style={{ borderColor: '#6d7ec2' }}
            />
          </Form.Item>

          <Form.Item
            label="Lot Number"
            name="lot_number"
            tooltip="Batch or lot number from the manufacturer for quality tracking"
            hasFeedback
          >
            <Input
              placeholder="Enter lot number if applicable"
              style={{ borderColor: '#6d7ec2' }}
            />
          </Form.Item>

          <Form.Item
            label="Notes"
            name="notes"
            className="col-span-2"
            tooltip="Additional information such as hazards, storage conditions, or special handling requirements"
            hasFeedback
          >
            <TextArea
              rows={3}
              placeholder="Enter any additional notes"
              style={{ borderColor: '#6d7ec2' }}
            />
          </Form.Item>
        </div>

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            className="w-full sm:w-auto"
          >
            {editingID ? 'Update Chemical' : 'Save Chemical'}
          </Button>
        </Form.Item>
      </Form>
    )
    }
    
    {chemicals.length === 0 ? (
      <p>No chemicals yet. Add some using the button above!</p>
    ) : viewMode === "cards" ? (
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
      </>
    ) : (
      <Table
        dataSource={chemicals}
        columns={columns}
        rowKey="id"
        pagination={{ pageSize: 10 }}
        onRow={(record) => ({
          onClick: () => setModalChemical(record),
          style: { cursor: 'pointer' }
        })}
      />
    )}

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
  </div>
  )}
