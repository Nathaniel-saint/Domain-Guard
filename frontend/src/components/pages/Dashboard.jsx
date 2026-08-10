import React, { useState, useEffect } from 'react'
import { CiSearch, CiFilter } from 'react-icons/ci'
import { FiGlobe, FiClock, FiAlertTriangle, FiPlus, FiDownload, FiChevronLeft, FiChevronRight } from 'react-icons/fi'
import './Dashboard.css'
import AddDomain from './AddDomain'
import DomainDetails from './DomainDetails'
import axios from 'axios'

function Dashboard() {
  const [searchTerm, setSearchTerm] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedDomain, setSelectedDomain] = useState(null)
  
  const [domains, setDomains] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 5

  useEffect(() => {
    fetchDomains()
  }, [])

  const fetchDomains = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await axios.get('http://localhost:8000/domain/api/')
      setDomains(response.data)
    } catch (err) {
      setError('Failed to fetch domain portfolio from server.')
    } finally {
      setLoading(false)
    }
  }

  const filteredDomains = domains.filter((item) => {
    const name = item.domain_name || item.name || ''
    const registrar = item.registrar || ''
    return (
      name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      registrar.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })

  const totalPages = Math.ceil(filteredDomains.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentDomains = filteredDomains.slice(startIndex, endIndex)

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page)
    }
  }

  const handleAddDomainSubmit = (newDomain) => {
    setDomains((prev) => [newDomain, ...prev])
  }

  return (
    <div className="dash-container">
      <header className="dash-header">
        <div>
          <h2>Dashboard</h2>
          <p className="breadcrumb">Home / Dashboard</p>
        </div>
        <button className="add-btn" onClick={() => setIsModalOpen(true)}>
          <FiPlus /> Add New Domain
        </button>
      </header>

      <section className="metrics-grid">
        <div className="metric-card">
          <div className="metric-header">
            <span className="metric-title">Total Domains</span>
            <span className="metric-icon primary-icon"><FiGlobe /></span>
          </div>
          <h3 className="metric-value">{domains.length}</h3>
          <span className="metric-sub text-positive">+5 this month</span>
        </div>

        <div className="metric-card">
          <div className="metric-header">
            <span className="metric-title">Expiring Soon (30 days)</span>
            <span className="metric-icon warning-icon"><FiClock /></span>
          </div>
          <h3 className="metric-value">
            {domains.filter(d => (d.status || 'ACTIVE') === 'EXPIRING_SOON' || d.status === 'Expiring Soon').length}
          </h3>
          <span className="metric-sub text-warning">Action required</span>
        </div>

        <div className="metric-card">
          <div className="metric-header">
            <span className="metric-title">Expired</span>
            <span className="metric-icon danger-icon"><FiAlertTriangle /></span>
          </div>
          <h3 className="metric-value">
            {domains.filter(d => (d.status || 'ACTIVE') === 'EXPIRED' || d.status === 'Expired').length}
          </h3>
          <span className="metric-sub text-danger">Action required</span>
        </div>
      </section>

      <section className="table-container">
        <div className="table-header">
          <h3>Domain Portfolio</h3>
          <div className="table-actions">
            <div className="search-box">
              <CiSearch className="search-icon" />
              <input type="text" placeholder="Search domains..." value={searchTerm} onChange={(e) => {setSearchTerm(e.target.value), setCurrentPage(1) }} />
            </div>
            <button className="secondary-btn"><CiFilter /> Status</button>
            <button className="secondary-btn"><CiFilter /> Registrar</button>
            <button className="secondary-btn"><FiDownload /> Export CSV</button>
          </div>
        </div>

        <div className="table-wrapper">
          <table className="domain-table">
            <thead>
              <tr>
                <th><input type="checkbox" /></th>
                <th>Domain Name</th>
                <th>Registrar</th>
                <th>Expiry Date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="6" className="no-data">Loading domain portfolio...</td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan="6" className="no-data">{error}</td>
                </tr>
              ) : currentDomains.length > 0 ? (
                currentDomains.map((item) => {
                  const statusDisplay = item.status || 'ACTIVE'
                  return (
                    <tr key={item.id}>
                      <td><input type="checkbox" /></td>
                      <td className="domain-name">{item.domain_name || item.name}</td>
                      <td>{item.registrar}</td>
                      <td>{item.expiry_date || item.expiry}</td>
                      <td>
                        <span className={`status-pill ${statusDisplay.toLowerCase().replace(/_/g, '-')}`}>
                          {statusDisplay.replace(/_/g, ' ')}
                        </span>
                      </td>
                      <td>
                        <button className="manage-btn" onClick={() => setSelectedDomain(item)}>
                          Manage
                        </button>
                      </td>
                    </tr>
                  )
                })
              ) : (
                <tr>
                  <td colSpan="6" className="no-data">No domains found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="pagination-wrapper">
          <span className="pagination-info">
            Showing {filteredDomains.length > 0 ? startIndex + 1 : 0} to{' '}
            {Math.min(endIndex, filteredDomains.length)} of {filteredDomains.length} results
          </span>

          <div className="pagination-controls">
            <button 
              className="page-nav-btn" 
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              <FiChevronLeft /> Previous
            </button>

            {Array.from({ length: totalPages }, (_, idx) => idx + 1).map((page) => (
              <button
                key={page}
                className={`page-num-btn ${currentPage === page ? 'active' : ''}`}
                onClick={() => handlePageChange(page)}
              >
                {page}
              </button>
            ))}

            <button 
              className="page-nav-btn" 
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages || totalPages === 0}
            >
              Next <FiChevronRight />
            </button>
          </div>
        </div>
      </section>

      <AddDomain 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        onAddDomain={handleAddDomainSubmit}
      />

      <DomainDetails 
        isOpen={!!selectedDomain} 
        onClose={() => setSelectedDomain(null)} 
        domain={selectedDomain}
      />
    </div>
  )
}

export default Dashboard