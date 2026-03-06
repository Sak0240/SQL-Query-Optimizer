import React from "react";
import { Bell, CircleUserRound, Settings } from "lucide-react";

function Navbar({ activePage, onNavigate }) {
  return (
    <div className="nav-row">
      <div className="brand-pill">Query Analyzer</div>

      <div className="nav-cluster">
        <div className="nav-links">
          <button
            type="button"
            className={`nav-link ${activePage === "dashboard" ? "active" : ""}`}
            onClick={() => onNavigate("dashboard")}
          >
            Dashboard
          </button>
          <button
            type="button"
            className={`nav-link ${activePage === "analytics" ? "active" : ""}`}
            onClick={() => onNavigate("analytics")}
          >
            Analytics
          </button>
        </div>

        <div className="nav-actions">
          <button type="button" className="icon-btn" aria-label="Settings">
            <Settings size={16} />
          </button>
          <button type="button" className="icon-btn" aria-label="Notifications">
            <Bell size={16} />
          </button>
          <button type="button" className="icon-btn" aria-label="Profile">
            <CircleUserRound size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}

export default Navbar;
