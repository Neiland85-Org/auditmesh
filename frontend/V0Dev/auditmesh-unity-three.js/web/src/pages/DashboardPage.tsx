import type React from "react"
import NetworkGraph from "../scenes/NetworkGraph"

const DashboardPage: React.FC = () => {
  return (
    <div className="dashboard-page">
      <div className="dashboard-header">
        <h1>Audit Dashboard</h1>
        <div className="dashboard-stats">
          <div className="stat-card">
            <h3>Active Audits</h3>
            <p className="stat-number">24</p>
          </div>
          <div className="stat-card">
            <h3>Completed</h3>
            <p className="stat-number">156</p>
          </div>
          <div className="stat-card">
            <h3>Pending Review</h3>
            <p className="stat-number">8</p>
          </div>
        </div>
      </div>

      <div className="dashboard-content">
        <section className="network-section">
          <h2>Audit Network</h2>
          <NetworkGraph />
        </section>

        <section className="recent-activity">
          <h2>Recent Activity</h2>
          <div className="activity-list">
            <div className="activity-item">
              <span className="activity-time">2 hours ago</span>
              <span className="activity-text">Audit #A-2024-001 completed</span>
            </div>
            <div className="activity-item">
              <span className="activity-time">4 hours ago</span>
              <span className="activity-text">New audit request submitted</span>
            </div>
            <div className="activity-item">
              <span className="activity-time">1 day ago</span>
              <span className="activity-text">Report generated for Q4 review</span>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}

export default DashboardPage
