import React, { useState } from 'react'
import { FiX, FiEye, FiEyeOff, FiCopy, FiCheck, FiShield, FiKey, FiLock } from 'react-icons/fi'
import './DomainDetails.css'

function DomainDetails({ isOpen, onClose, domain }) {
  const [showSecrets, setShowSecrets] = useState({
    registrarPass: false,
    dnsApiKey: false,
    sslPrivateKey: false,
  })
  const [copiedField, setCopiedField] = useState(null)

  if (!isOpen || !domain) return null

  const toggleVisibility = (field) => {
    setShowSecrets((prev) => ({ ...prev, [field]: !prev[field] }))
  }

  const handleCopy = (text, fieldName) => {
    navigator.clipboard.writeText(text)
    setCopiedField(fieldName)
    setTimeout(() => setCopiedField(null), 2000)
  }

  const secrets = {
    registrarUser: `admin@${domain.name}`,
    registrarPass: 'P@ssw0rd_D0ma1n_2026!',
    dnsApiKey: 'sk_live_99f82a1b4c6e8d0e12345678',
    sslPrivateKey: '-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQC...\n-----END PRIVATE KEY-----'
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="vault-modal-container" onClick={(e) => e.stopPropagation()}>
        <div className="vault-modal-header">
          <div className="vault-title-group">
            <span className="vault-icon"><FiShield /></span>
            <div>
              <h3>{domain.name}</h3>
              <p className="vault-subtitle">Domain Credentials & Secret Vault</p>
            </div>
          </div>
          <button className="close-modal-btn" onClick={onClose} aria-label="Close modal">
            <FiX />
          </button>
        </div>

        <div className="vault-body">
          <div className="vault-info-strip">
            <div>
              <span className="strip-label">Registrar</span>
              <p className="strip-val">{domain.registrar}</p>
            </div>
            <div>
              <span className="strip-label">Expiry Date</span>
              <p className="strip-val">{domain.expiry}</p>
            </div>
            <div>
              <span className="strip-label">Status</span>
              <span className={`status-pill ${domain.status.toLowerCase().replace(/\s+/g, '-')}`}>
                {domain.status}
              </span>
            </div>
          </div>

          <div className="vault-section">
            <div className="section-title">
              <FiLock /> Registrar Account Details
            </div>
            
            <div className="vault-field-group">
              <label>Registrar Username / Email</label>
              <div className="field-input-box">
                <input type="text" value={secrets.registrarUser} readOnly />
                <button 
                  className="copy-btn" 
                  onClick={() => handleCopy(secrets.registrarUser, 'registrarUser')}
                  title="Copy Username"
                >
                  {copiedField === 'registrarUser' ? <FiCheck className="icon-success" /> : <FiCopy />}
                </button>
              </div>
            </div>

            <div className="vault-field-group">
              <label>Registrar Password</label>
              <div className="field-input-box">
                <input 
                  type={showSecrets.registrarPass ? 'text' : 'password'} 
                  value={secrets.registrarPass} 
                  readOnly 
                />
                <button 
                  className="toggle-btn" 
                  onClick={() => toggleVisibility('registrarPass')}
                  title="Toggle Password"
                >
                  {showSecrets.registrarPass ? <FiEyeOff /> : <FiEye />}
                </button>
                <button 
                  className="copy-btn" 
                  onClick={() => handleCopy(secrets.registrarPass, 'registrarPass')}
                  title="Copy Password"
                >
                  {copiedField === 'registrarPass' ? <FiCheck className="icon-success" /> : <FiCopy />}
                </button>
              </div>
            </div>
          </div>

          <div className="vault-section">
            <div className="section-title">
              <FiKey /> API Keys & SSL Tokens
            </div>

            <div className="vault-field-group">
              <label>DNS API Secret Key</label>
              <div className="field-input-box">
                <input 
                  type={showSecrets.dnsApiKey ? 'text' : 'password'} 
                  value={secrets.dnsApiKey} 
                  readOnly 
                />
                <button 
                  className="toggle-btn" 
                  onClick={() => toggleVisibility('dnsApiKey')}
                  title="Toggle API Key"
                >
                  {showSecrets.dnsApiKey ? <FiEyeOff /> : <FiEye />}
                </button>
                <button 
                  className="copy-btn" 
                  onClick={() => handleCopy(secrets.dnsApiKey, 'dnsApiKey')}
                  title="Copy API Key"
                >
                  {copiedField === 'dnsApiKey' ? <FiCheck className="icon-success" /> : <FiCopy />}
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="vault-modal-footer">
          <button className="close-vault-btn" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  )
}

export default DomainDetails