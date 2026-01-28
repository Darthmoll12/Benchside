'use client'

import { Form, Input, Button, Select, InputNumber, DatePicker } from 'antd'
import { ExperimentOutlined } from '@ant-design/icons'
import { GHS_PICTOGRAMS } from '@/lib/constants'
const  { TextArea } = Input

export default function ChemicalForm({ form, editingID, onFinish, onCancel}) {
    return (
        <Form
        form={form}
        onFinish={onFinish}
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
              <Select.Option value="gas">Gas</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item
            label="GHS Pictogram"
            name="ghs_pictograms"
            tooltip="GHS pictogram can often be found somewhere on the chemical container's label"
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
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                <Button 
                  onClick={onCancel}
                  danger
                >
                  Cancel
                </Button>
                <Button
                  type="primary"
                  htmlType="submit"
                  className="w-full sm:w-auto"
                >
                  {editingID ? 'Update Chemical' : 'Save Chemical'}
                </Button>
            </div>
        </Form.Item>
      </Form>
    )
}
