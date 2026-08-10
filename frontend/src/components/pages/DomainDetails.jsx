import React, { useState, useEffect } from "react";
import {
  FiX,
  FiEye,
  FiEyeOff,
  FiCopy,
  FiCheck,
  FiShield,
  FiKey,
  FiLock,
} from "react-icons/fi";
import "./DomainDetails.css";
import axios from "axios";

function DomainDetails({ isOpen, onClose, domain }) {
  const [credentials, setCredentials] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [showSecrets, setShowSecrets] = useState({
    registrarPass: false,
    apiSecretKey: false,
  });
  const [copiedField, setCopiedField] = useState(null);

  useEffect(() => {
    if (isOpen && domain?.id) {
      fetchDomainCredentials(domain.id);
    } else {
      setCredentials(null);
      setError(null);
    }
  }, [isOpen, domain]);

  const fetchDomainCredentials = async (domainId) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(
        `http://localhost:8000/domain/api/${domainId}/credentials/`,
      );
      setCredentials(response.data);
    } catch (err) {
      setError("No saved credentials found for this domain.");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen || !domain) return null;

  const toggleVisibility = (field) => {
    setShowSecrets((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const handleCopy = (text, fieldName) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    setTimeout(() => setCopiedField(null), 2000);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="vault-modal-container"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="vault-modal-header">
          <div className="vault-title-group">
            <span className="vault-icon">
              <FiShield />
            </span>
            <div>
              <h3>{domain.domain_name || domain.name}</h3>
              <p className="vault-subtitle">
                Domain Credentials & Secret Vault
              </p>
            </div>
          </div>
          <button
            className="close-modal-btn"
            onClick={onClose}
            aria-label="Close modal"
          >
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
              <p className="strip-val">{domain.expiry_date || domain.expiry}</p>
            </div>
            <div>
              <span className="strip-label">Status</span>
              <span
                className={`status-pill ${(domain.status || "ACTIVE").toLowerCase().replace(/\s+/g, "-")}`}
              >
                {domain.status || "Active"}
              </span>
            </div>
          </div>

          {loading ? (
            <div className="vault-loading">Loading credentials...</div>
          ) : error ? (
            <div className="vault-empty-state">
              <p>{error}</p>
            </div>
          ) : (
            <>
              <div className="vault-section">
                <div className="section-title">
                  <FiLock /> Registrar Account Details
                </div>

                <div className="vault-field-group">
                  <label>Registrar Username / Email</label>
                  <div className="field-input-box">
                    <input
                      type="text"
                      value={credentials?.registrar_username || "Not set"}
                      readOnly
                    />
                    <button
                      className="copy-btn"
                      onClick={() =>
                        handleCopy(
                          credentials?.registrar_username,
                          "registrarUser",
                        )
                      }
                      title="Copy Username"
                    >
                      {copiedField === "registrarUser" ? (
                        <FiCheck className="icon-success" />
                      ) : (
                        <FiCopy />
                      )}
                    </button>
                  </div>
                </div>

                <div className="vault-field-group">
                  <label>Registrar Password</label>
                  <div className="field-input-box">
                    <input
                      type={showSecrets.registrarPass ? "text" : "password"}
                      value={credentials?.registrar_password || ""}
                      placeholder={
                        credentials?.registrar_password ? "" : "Not set"
                      }
                      readOnly
                    />
                    <button
                      className="toggle-btn"
                      onClick={() => toggleVisibility("registrarPass")}
                      title="Toggle Password"
                    >
                      {showSecrets.registrarPass ? <FiEyeOff /> : <FiEye />}
                    </button>
                    <button
                      className="copy-btn"
                      onClick={() =>
                        handleCopy(
                          credentials?.registrar_password,
                          "registrarPass",
                        )
                      }
                      title="Copy Password"
                    >
                      {copiedField === "registrarPass" ? (
                        <FiCheck className="icon-success" />
                      ) : (
                        <FiCopy />
                      )}
                    </button>
                  </div>
                </div>
              </div>

              <div className="vault-section">
                <div className="section-title">
                  <FiKey /> API Keys & Secrets
                </div>

                <div className="vault-field-group">
                  <label>API Secret Key</label>
                  <div className="field-input-box">
                    <input
                      type={showSecrets.apiSecretKey ? "text" : "password"}
                      value={credentials?.api_secret_key || ""}
                      placeholder={credentials?.api_secret_key ? "" : "Not set"}
                      readOnly
                    />
                    <button
                      className="toggle-btn"
                      onClick={() => toggleVisibility("apiSecretKey")}
                      title="Toggle Key"
                    >
                      {showSecrets.apiSecretKey ? <FiEyeOff /> : <FiEye />}
                    </button>
                    <button
                      className="copy-btn"
                      onClick={() =>
                        handleCopy(credentials?.api_secret_key, "apiSecretKey")
                      }
                      title="Copy Key"
                    >
                      {copiedField === "apiSecretKey" ? (
                        <FiCheck className="icon-success" />
                      ) : (
                        <FiCopy />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        <div className="vault-modal-footer">
          <button className="close-vault-btn" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export default DomainDetails;
