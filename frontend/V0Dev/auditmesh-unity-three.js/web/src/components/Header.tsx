import type React from "react"

interface HeaderProps {
  title?: string
}

const Header: React.FC<HeaderProps> = ({ title = "AuditMesh" }) => {
  return (
    <header className="header">
      <div className="header-content">
        <h1>{title}</h1>
        <nav>
          <a href="/">Home</a>
          <a href="/dashboard">Dashboard</a>
        </nav>
      </div>
    </header>
  )
}

export default Header
