const Header = () => {
  return (
    <header className="professional-header">
      <div className="header-content">
        <div className="logo-section">
          <div className="logo">
            <svg
              width="32"
              height="32"
              viewBox="0 0 32 32"
              fill="none"
            >
              <rect
                width="32"
                height="32"
                rx="8"
                fill="#667eea"
              />
              <path
                d="M8 24V12l4-4h8l4 4v12"
                stroke="white"
                strokeWidth="2"
                fill="none"
              />
              <path
                d="M12 16h8M12 20h8"
                stroke="white"
                strokeWidth="2"
              />
            </svg>
            <span>Seedling 🌱</span>
          </div>
        </div>
        <nav className="header-nav">
          <button className="nav-btn">Sign In</button>
          <button className="nav-btn primary">Sign Up</button>
        </nav>
      </div>
    </header>
  );
};

export default Header;