import React, { useState } from 'react'
import { FiAlertTriangle, FiClock, FiCheckCircle, FiX, FiCheck } from 'react-icons/fi'
import './Notifications.css'

function Notification() {
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: 'danger',
      title: 'Domain Expired',
      time: '10 mins ago',
      message: 'Domain example-ventures.com has EXPIRED. Renew now to avoid loss of service.',
      actionText: 'Renew Now',
      group: 'Today'
    },
    {
      id: 2,
      type: 'warning',
      title: 'Expiring Soon',
      time: 'Yesterday, 4:30 PM',
      message: 'Domain myportfolio.io expires in 15 days.',
      actionText: 'Manage',
      group: 'Yesterday'
    },
    {
      id: 3,
      type: 'success',
      title: 'Renewal Successful',
      time: 'Oct 12, 2026',
      message: 'Domain techsolutions.net successfully renewed for 2 years.',
      actionText: 'View Details',
      group: 'Earlier'
    }
  ])

  const handleDismiss = (id) => {
    setNotifications(notifications.filter(item => item.id !== id))
  }

  const handleMarkAllRead = () => {
    // Logic for marking all as read
  }

  return (
    <div className="notif-container">
      {/* Page Header */}
      <header className="notif-header">
        <div>
          <h2>Notifications</h2>
          <p className="breadcrumb">Home / Notifications</p>
        </div>
        <button className="mark-read-btn" onClick={handleMarkAllRead}>
          <FiCheck /> Mark all as read
        </button>
      </header>

      <div className="notif-list">
        {['Today', 'Yesterday', 'Earlier'].map((group) => {
          const groupItems = notifications.filter(item => item.group === group)
          if (groupItems.length === 0) return null

          return (
            <div key={group} className="notif-group">
              <h3 className="group-title">{group}</h3>
              <div className="cards-wrapper">
                {groupItems.map((item) => (
                  <div key={item.id} className={`notif-card ${item.type}`}>
                    <div className="notif-icon-wrapper">
                      {item.type === 'danger' && <FiAlertTriangle className="icon-danger" />}
                      {item.type === 'warning' && <FiClock className="icon-warning" />}
                      {item.type === 'success' && <FiCheckCircle className="icon-success" />}
                    </div>

                    <div className="notif-content">
                      <div className="notif-top">
                        <span className="notif-card-title">{item.title}</span>
                        <span className="notif-time">{item.time}</span>
                      </div>
                      <p className="notif-message">{item.message}</p>
                      {item.actionText && (
                        <button className="notif-action-btn">{item.actionText}</button>
                      )}
                    </div>

                    <button 
                      className="close-btn" 
                      onClick={() => handleDismiss(item.id)}
                      aria-label="Dismiss notification"
                    >
                      <FiX />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default Notification