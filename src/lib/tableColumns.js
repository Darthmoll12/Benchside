import { Button } from 'antd'
import { GHS_PICTOGRAMS } from './constants'
import dayjs from 'dayjs'


export const getChemicalColumns = ({ startEdit, deleteChemical}) => [
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

        if (!list || list.length === 0) {
          return <span>—</span>
        }

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
      sorter: (a, b) => a.percent_full - b.percent_full,
      render: (val) => val ?? "—"
    },
     {
      title: "Concentration",
      dataIndex: "concentration",
      key: "concentration",
      width: 100,
      sorter: (a, b) => a.concentration - b.concentration,
      render: (val) => val ?? "—"
    },
    {
      title: "Concentration Units",
      dataIndex: "concentration_unit",
      key: "concentration_unit",
      render: (val) => val ?? "—"
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
      },
      render: (val) => val ?? "—"
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