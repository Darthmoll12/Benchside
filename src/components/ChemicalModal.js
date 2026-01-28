'use client'

import { Modal } from 'antd'
import { GHS_PICTOGRAMS } from '@/lib/constants'
import dayjs from 'dayjs'

export default function ChemicalModal({ chemical, onClose}) {
    return (
        <Modal
            open={chemical !== null}
            onCancel={onClose}
            footer={null}
            width={600}
        >
            {chemical && (
                <div className="space-y-4">
                    <div>
                        <h2 className="text-xl font-semibold">
                            {chemical.chemical_name}
                        </h2>
                        <p className="text-sm text-gray-500">
                            CAS: {chemical.cas_number || '—'}
                        </p>
                    </div>

                    {chemical.physical_state && (
                        <div>
                            <p className="text-gray-500 text-sm">Physical State</p>
                            <p className="font-medium capitalize">
                                {chemical.physical_state}
                            </p>
                        </div>
                    )}

                    <div className="grid grid-cols-2 gap-x-6 gap-y-3 text-sm">
                        <div>
                            <p className="text-gray-500">Container Size</p>
                            <p className="font-medium">
                                {chemical.container_size}{chemical.unit}
                            </p>
                        </div>

                        {chemical.concentration && chemical.concentration_unit && (
                            <div>
                                <p className="text-gray-500 text-sm">Concentration</p>
                                <p className="font-medium">
                                    {chemical.concentration}{chemical.concentration_unit}
                                </p>
                            </div>
                        )}

                        <div>
                            <p className="text-gray-500">Percent Full</p>
                            <p className="font-medium">
                                {chemical.percent_full ?? '—'}%
                            </p>
                        </div>

                        <div>
                            <p className="text-gray-500">Location</p>
                            <p className="font-medium">
                                {chemical.location}
                            </p>
                        </div>

                        <div>
                            <p className="text-gray-500">Expiration Date</p>
                            <p className="font-medium">
                                {chemical.expiration_date
                                    ? dayjs(chemical.expiration_date).format("MMM D, YYYY") : '—'}
                            </p>
                        </div>

                        <div>
                            <p className="text-gray-500">Manufacturer</p>
                            <p className="font-medium">
                                {chemical.manufacturer_information || '—'}
                            </p>
                        </div>

                        <div>
                            <p className="text-gray-500">Lot Number</p>
                            <p className="font-medium">
                                {chemical.lot_number || '—'}
                            </p>
                        </div>
                    </div>

                    {Array.isArray(chemical.ghs_pictograms) &&
                        chemical.ghs_pictograms?.length > 0 && (
                            <div>
                                <p className="text-gray-500 text-sm mb-2">GHS Pictograms</p>
                                <div className="flex gap-3">
                                    {chemical.ghs_pictograms.map((value) => {
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

                    {chemical.notes && (
                        <div className="pt-3 border-t">
                            <p className="text-sm text-gray-500 mb-1">Notes</p>
                            <p className="text-sm italic text-gray-700">
                                {chemical.notes}
                            </p>
                        </div>
                    )}
                </div>
            )}
        </Modal>
    )
}