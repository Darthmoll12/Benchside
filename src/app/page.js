'use client'

import { supabase } from '@/lib/supabase'
import { useEffect, useState } from 'react'
import dayjs from 'dayjs'

import ChemicalForm from '@/components/ChemicalForm'
import ChemicalModal from '@/components/ChemicalModal'
import { getChemicalColumns } from '@/lib/tableColumns'

import { Button, Card, Table, Segmented, Form, Input} from 'antd'
import { AppstoreOutlined, UnorderedListOutlined } from '@ant-design/icons'

const  { TextArea } = Input



export default function Home() {
  const [chemicals, setChemicals] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingID, setEditingID] = useState(null)
  const [modalChemical, setModalChemical] = useState(null)
  const [form] = Form.useForm()
  const [viewMode, setViewMode] = useState('cards')

  // const renderWithDefault = (val) => val ?? "—"
  const columns = getChemicalColumns(startEdit, deleteChemical)




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
          
          {!showForm && (
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
              Add Chemical
            </Button>
          )}
        </div>
      </div>
  


    {showForm && (
      <ChemicalForm
        form={form}
        editingID={editingID}
        onFinish={editingID ? editChemicals : addChemical}
        onCancel={() => {
          setShowForm(false)
          setEditingID(null)
          form.resetFields()
        }}
      />
    )}

    
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
                        year: 'numeric'
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
                          year: 'numeric'
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

    <ChemicalModal
      chemical={modalChemical}
      onClose={() => setModalChemical(null)}
    />
  </div>
  )}

