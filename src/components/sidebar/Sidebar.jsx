import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./Sidebar.css";
import HomeIcon from "@mui/icons-material/Home";
import PublicIcon from "@mui/icons-material/Public";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="sidebar-container">
      <button className="toggle-btn" onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? <CloseIcon /> : <MenuIcon />}
      </button>

      <div className={`sidebar ${isOpen ? "open" : "closed"}`}>
        <Link to="/"><HomeIcon /> Home</Link>
        <Link to="/countries"><PublicIcon /> Countries</Link>
      </div>
    </div>
  );
}