import type React from "react"
import AuditVisualization from "../scenes/AuditVisualization"

const HomePage: React.FC = () => {
  return (
    <div className="home-page">
      <section className="hero">
        <h1>Welcome to AuditMesh</h1>
        <p>Advanced audit management and visualization platform</p>
      </section>

      <section className="visualization">
        <h2>Audit Overview</h2>
        <AuditVisualization />
      </section>

      <section className="features">
        <div className="feature-grid">
          <div className="feature-card">
            <h3>Real-time Monitoring</h3>
            <p>Monitor your audit processes in real-time with advanced analytics</p>
          </div>
          <div className="feature-card">
            <h3>3D Visualization</h3>
            <p>Visualize complex audit data with interactive 3D representations</p>
          </div>
          <div className="feature-card">
            <h3>Comprehensive Reports</h3>
            <p>Generate detailed reports with actionable insights</p>
          </div>
        </div>
      </section>
    </div>
  )
}

export default HomePage
