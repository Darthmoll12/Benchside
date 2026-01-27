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

  const GHS_PICTOGRAMS = [
  { value: 'flame', label: 'Flammable', icon: '/ghs/flame.png' },
  { value: 'corrosion', label: 'Corrosive', icon: '/ghs/corrosion.png' },
  { value: 'skull', label: 'Acute Toxicity', icon: '/ghs/skull.png' },
  { value: 'health', label: 'Health Hazard', icon: '/ghs/health.png' },
  { value: 'exclamation', label: 'Irritant', icon: '/ghs/exclamation.png' },
  { value: 'environment', label: 'Environmental Hazard', icon: '/ghs/environment.png' },
  { value: 'gas', label: 'Gas Under Pressure', icon: '/ghs/gas.png' },
  { value: 'oxidizer', label: 'Oxidizer', icon: '/ghs/oxidizer.png' }
]




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
          physical_state: values.physical_state,
          concentration: values.concentration,
          concentration_unit: values.concentration_unit,
          ghs_pictograms: values.ghs_pictograms || [],
          container_size: values.container_size || null,
          unit: values.unit,
          percent_full: values.percent_full || null,
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
      cas_number: chemical.cas_number || null,
      physical_state: chemical.physical_state || '',
      concentration: chemical.concentration || null,
      concentration_unit: chemical.concentration_unit || '',
      ghs_pictograms: chemical.ghs_pictograms,
      container_size: chemical.container_size || null,
      unit: chemical.unit || '',
      percent_full: chemical.percent_full || null,
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
          physical_state: values.physical_state,
          concentration: values.concentration,
          concentration_unit: values.concentration_unit,
          ghs_pictograms: values.ghs_pictograms || [],
          container_size: values.container_size || null,
          unit: values.unit,
          percent_full: values.percent_full || null,
          location: values.location,
          expiration_date: values.expiration_date ? dayjs(values.expiration_date).format('MMM, D, YYYY') : null,
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
      title: "Physical State",
      dataIndex: "physical_state",
      key: "physical_state",
    },
    {
      title: "GHS Pictogram",
      dataIndex: "ghs_pictograms",
      key: "ghs_pictograms",
      title: 'Pictograms',
      render: (ghs_pictograms) => {
        const list = Array.isArray(ghs_pictograms) ? ghs_pictograms : [];

        return (
          <div style={{ display: 'flex', gap: '4px' }}>
            {list.slice(0, 3).map((value) => {
              const pictogram = GHS_PICTOGRAMS.find(p => p.value === value);
              return pictogram ? (
                <img
                  className="w-10 h-10"
                  key={value}
                  src={pictogram.icon}
                  alt={pictogram.label}
                  style={{ width: '20px', height: '20px' }}
                />
              ) : null;
            })}
            {list.length > 3 && (
              <span style={{ fontSize: '11px', color: '#999' }}>
                +{list.length - 3}
              </span>
            )}
          </div>
        );
      }
    },
    {
      title: "Container Size",
      dataIndex: "container_size",
      key: "container_size",
      sorter: (a, b) => a.container_size - b.container_size
    },
    {
      title: "Unit",
      dataIndex: "unit",
      key: "unit"
    },
    {
      title: "Percent Full",
      dataIndex: "percent_full",
      key: "percent_full",
      sorter: (a, b) => a.percent_full - b.percent_full
    },
     {
      title: "Concentration",
      dataIndex: "concentration",
      key: "concentration",
      width: 100,
      sorter: (a, b) => a.concentration - b.concentration
    },
    {
      title: "Concentration Units",
      dataIndex: "concentration_unit",
      key: "concentration_unit",
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
            rules={[{ required: true, message: "Please enter a CAS Number"}]}
            hasFeedback
          >
            <Input
              placeholder="Enter your chemical's CAS number if applicable"
              style={{ borderColor: '#6d7ec2' }}
            />
          </Form.Item>

          <Form.Item
            label="Physical State"
            name="physical_state"
            tooltip="The state of matter of the chemical"
            rules={[{ required: true, message: "Please enter a state of matter"}]}
            hasFeedback
          >
            <Select
              placeholder="Enter the chemical's physical state"
              style={{ borderColor: '#6d7ec2' }}
            >
              <Select.Option value="solid">Solid</Select.Option>
              <Select.Option value="liquid">Liquid</Select.Option>
              <Select.Option value="gas">gas</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item
            label="GHS Pictogram"
            name="ghs_pictograms"
            tootltip="GHS pictogram can often be found somewhere on the chemical container's label"
            hasFeedback
          >
            <Select
              mode="multiple"
              placeholder="Select applicable hazards"
              style={{ borderColor: '#6d7ec2' }}
              options={GHS_PICTOGRAMS.map(opt => ({
                value: opt.value,
                label: (
                  <div className="flex items-center gap-2">
                    <img src={opt.icon} alt={opt.label} className="w-5 h-5" />
                    <span>{opt.label}</span>
                  </div>
                )
              }))}
            />
          </Form.Item>

          <Form.Item
            label="Container Size"
            name="container_size"
            tooltip="Numerical quantity of chemical as labeled on the bottle/container (without units)"
            rules={[{ required: true, message: "Please enter a container size" }]}
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
            label="Percent Full"
            name="percent_full"
            hasFeedback
          >
            <InputNumber
              placeholder="Enter a number (without % sign)"
              min={0}
              step={1}
              style={{
                width: '100%',
                borderColor: '#6d7ec2'
              }}
            />
          </Form.Item>

          <Form.Item
            label="Concentration"
            name="concentration"
            tooltip="If in aqueous solution, enter the concentration as displayed on the container"
            hasFeedback
          >
            <InputNumber
              placeholder="Enter a number"
              min={0}
              step={1}
              style={{
                width: '100%',
                borderColor: '#6d7ec2'
              }}
            />
          </Form.Item>

          <Form.Item
            shouldUpdate={(prev, curr) =>
              prev.concentration !== curr.concentration
            }
          >
            {({ getFieldValue }) =>
              getFieldValue('concentration') ? (
                <Form.Item
                  label="Concentration Unit"
                  name="concentration_unit"
                  rules={[{ required: true, message: 'Select a unit' }]}
                >
                  <Select
                    placeholder="Select a unit (M, g/mL, etc.)"
                    style={{ borderColor: '#6d7ec2' }}
                  >
                    <Select.Option value="M">M (Molar)</Select.Option>
                    <Select.Option value="mM">mM (millimolar)</Select.Option>
                    <Select.Option value="μM">μM (micromolar)</Select.Option>
                    <Select.Option value="g/mL">g/mL (grams per milliliters)</Select.Option>
                    <Select.Option value="mg/ml">mg/ml (milligrams per millilters)</Select.Option>
                    <Select.Option value="%w/w">% w/w (mass solute/total mass of solution)</Select.Option>
                    <Select.Option value="%v/v">% v/v (volume solute/total volume of solution)</Select.Option>
                    <Select.Option value="ppm">ppm (parts per million)</Select.Option>
                    <Select.Option value="ppb">ppb (parts per billion)</Select.Option>
                  </Select>
                </Form.Item>
              ) : null
            }
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
            rules={[{ required: true, message: "Please enter Manufacturer Information"}]}
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
      <div style={{overflowX: "auto", width: "100%"}}>
        <Table
          dataSource={chemicals}
          columns={columns}
          rowKey="id"
          pagination={{ pageSize: 10 }}
          expandable={{
            expandedRowRender: (record) => (
              <div style={{ 
                padding: '16px 24px',
                background: 'linear-gradient(135deg, #f9f5fa 0%, #f0f2f8 100%)',
                borderRadius: '8px',
                margin: '8px 0'
              }}>
                <div style={{ 
                  display: 'grid', 
                  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                  gap: '16px',
                  marginBottom: record.notes ? '16px' : '0'
                }}>
                  {record.lot_number && (
                    <div>
                      <p style={{ 
                        fontSize: '12px', 
                        color: '#6d7ec2', 
                        fontWeight: '600',
                        marginBottom: '4px',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px'
                      }}>
                        Lot Number
                      </p>
                      <p style={{ margin: 0, color: '#333' }}>
                        {record.lot_number}
                      </p>
                    </div>
                  )}
                  
                  
                  <div>
                    <p style={{ 
                      fontSize: '12px', 
                      color: '#6d7ec2', 
                      fontWeight: '600',
                      marginBottom: '4px',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px'
                    }}>
                      Created
                    </p>
                    <p style={{ margin: 0, color: '#333' }}>
                      {new Date(record.created_at).toLocaleDateString('en-US', { 
                        month: 'short', 
                        day: 'numeric', 
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                  
                  {record.updated_at ? 
                    <div>
                      <p style={{ 
                        fontSize: '12px', 
                        color: '#6d7ec2', 
                        fontWeight: '600',
                        marginBottom: '4px',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px'
                      }}>
                        Last Updated
                      </p>
                      <p style={{ margin: 0, color: '#333' }}>
                        {new Date(record.updated_at).toLocaleDateString('en-US', { 
                          month: 'short', 
                          day: 'numeric', 
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div> : 
                    <div>
                      <p style={{ 
                        fontSize: '12px', 
                        color: '#6d7ec2', 
                        fontWeight: '600',
                        marginBottom: '4px',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px'
                      }}>
                        Last Updated
                      </p>
                      <p style={{ margin: 0, color: '#333' }}>
                        {"—"}
                      </p>
                    </div>
                  }
                </div>

                <div style={{ 
                  display: 'grid', 
                  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                  gap: '16px',
                  marginBottom: record.notes ? '16px' : '0'
                }}>
                  {record.notes && (
                    <div style={{ 
                      paddingTop: '16px',
                      borderTop: '1px solid rgba(109, 126, 194, 0.2)'
                    }}>
                      <p style={{ 
                        fontSize: '12px', 
                        color: '#6d7ec2', 
                        fontWeight: '600',
                        marginBottom: '6px',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px'
                      }}>
                        Notes
                      </p>
                      <p style={{ 
                        margin: 0, 
                        color: '#555',
                        fontStyle: 'italic',
                        lineHeight: '1.5'
                      }}>
                        {record.notes}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ),
            rowExpandable: (record) => record.notes || record.lot_number || record.created_at || record.updated_at,
          }}
          size="small"
        />
      </div>
    )}

    <Modal
      open={modalChemical !== null}
      onCancel={() => setModalChemical(null)}
      footer={null}
      width={600}
    >
      {modalChemical && (
        <div className="space-y-4">
          <div>
            <h2 className="text-xl font-semibold">
              {modalChemical.chemical_name}
            </h2>
            <p className="text-sm text-gray-500">
              CAS: {modalChemical.cas_number || '—'}
            </p>
          </div>

          {modalChemical.physical_state && (
            <div>
              <p className="text-gray-500 text-sm">Physical State</p>
              <p className="font-medium capitalize">
                {modalChemical.physical_state}
              </p>
            </div>
          )}

          <div className="grid grid-cols-2 gap-x-6 gap-y-3 text-sm">
            <div>
              <p className="text-gray-500">Container Size</p>
              <p className="font-medium">
                {modalChemical.container_size}{modalChemical.unit}
              </p>
            </div>

            {modalChemical.concentration && modalChemical.concentration_unit && (
              <div>
                <p className="text-gray-500 text-sm">Concentration</p>
                <p className="font-medium">
                  {modalChemical.concentration}{modalChemical.concentration_unit}
                </p>
              </div>
            )}

            <div>
              <p className="text-gray-500">Percent Full</p>
              <p className="font-medium">
                {modalChemical.percent_full ?? '—'}%
              </p>
            </div>

            <div>
              <p className="text-gray-500">Location</p>
              <p className="font-medium">
                {modalChemical.location}
              </p>
            </div>

            <div>
              <p className="text-gray-500">Expiration Date</p>
              <p className="font-medium">
                {modalChemical.expiration_date
                  ? dayjs(modalChemical.expiration_date).format("MMM, D, YYYY") : '—'}
              </p>
            </div>

            <div>
              <p className="text-gray-500">Manufacturer</p>
              <p className="font-medium">
                {modalChemical.manufacturer_information || '—'}
              </p>
            </div>

            <div>
              <p className="text-gray-500">Lot Number</p>
              <p className="font-medium">
                {modalChemical.lot_number || '—'}
              </p>
            </div>
          </div>

          {Array.isArray(modalChemical.ghs_pictograms) &&
            modalChemical.ghs_pictograms?.length > 0 && (
              <div>
                <p className="text-gray-500 text-sm mb-2">GHS Pictograms</p>
                <div className="flex gap-3">
                  {modalChemical.ghs_pictograms.map((value) => {
                    const pictogram = GHS_PICTOGRAMS.find(p => p.value === value)
                    return pictogram ? (
                      <img
                        key={pictogram.icon}
                        src={pictogram.icon}
                        alt={pictogram.label}
                        title={pictogram.label}
                        className="w-10 h-10"
                      />
                    ) : null
                  })}
                </div>
              </div>
            )}

          {modalChemical.notes && (
            <div className="pt-3 border-t">
              <p className="text-sm text-gray-500 mb-1">Notes</p>
              <p className="text-sm italic text-gray-700">
                {modalChemical.notes}
              </p>
            </div>
          )}
        </div>
      )}
    </Modal>
  </div>
  )}

