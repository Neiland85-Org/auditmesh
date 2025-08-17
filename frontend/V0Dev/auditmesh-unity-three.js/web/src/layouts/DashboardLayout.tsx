import type React from "react"
import Header from "../components/Header"

interface DashboardLayoutProps {
  children: React.ReactNode
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  return (
    <div className="dashboard-layout">
      <Header title="AuditMesh Dashboard" />
      <div className="dashboard-container">
        <aside className="sidebar">
          <nav>
            <ul>
              <li>
                <a href="/dashboard">Overview</a>
              </li>
              <li>
                <a href="/dashboard/audits">Audits</a>
              </li>
              <li>
                <a href="/dashboard/reports">Reports</a>
              </li>
              <li>
                <a href="/dashboard/settings">Settings</a>
              </li>
            </ul>
          </nav>
        </aside>
        <main className="dashboard-main">{children}</main>
      </div>
    </div>
  )
}

export default DashboardLayout
