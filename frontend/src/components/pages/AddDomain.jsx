import React, { useState } from 'react'
import { FiX } from 'react-icons/fi'
import './AddDomain.css'

function AddDomain({ isOpen, onClose, onAddDomain }) {
  const [formData, setFormData] = useState({
    domainName: '',
    registrar: '',
    expiryDate: '',
    notes: ''
  })

  if (!isOpen) return null

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onAddDomain(formData)
    setFormData({ domainName: '', registrar: '', expiryDate: '', notes: '' })
    onClose()
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Add New Domain</h3>
          <button className="close-modal-btn" onClick={onClose}>
            <FiX />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label>Domain Name *</label>
            <input
              type="text"
              name="domainName"
              placeholder="e.g. mycompany.com"
              value={formData.domainName}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Registrar *</label>
            <input
              type="text"
              name="registrar"
              placeholder="e.g. GoDaddy, Namecheap"
              value={formData.registrar}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Expiry Date *</label>
            <input
              type="date"
              name="expiryDate"
              value={formData.expiryDate}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Notes / Tags (Optional)</label>
            <textarea
              name="notes"
              placeholder="e.g. Primary production server domain"
              rows="3"
              value={formData.notes}
              onChange={handleChange}
            />
          </div>

          <div className="modal-actions">
            <button type="button" className="cancel-btn" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="submit-domain-btn">
              Add Domain
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AddDomain