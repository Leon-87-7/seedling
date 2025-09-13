const SectorDropdown = ({ 
  selectedSector, 
  sectors, 
  dropdownOpen, 
  setDropdownOpen, 
  onSectorChange 
}) => {
  const sectorDisplayName = selectedSector.charAt(0).toUpperCase() + selectedSector.slice(1);

  return (
    <section className="sector-selection">
      <div className="dropdown-container">
        <button
          className="dropdown-trigger"
          onClick={() => setDropdownOpen(!dropdownOpen)}
        >
          <span>{sectorDisplayName}</span>
          <span className="stock-count">
            ({sectors[selectedSector].length} stocks)
          </span>
          <svg
            className={`dropdown-arrow ${dropdownOpen ? 'open' : ''}`}
            width="20"
            height="20"
            viewBox="0 0 20 20"
          >
            <path
              d="M6 8l4 4 4-4"
              stroke="currentColor"
              strokeWidth="2"
              fill="none"
            />
          </svg>
        </button>
        {dropdownOpen && (
          <div className="dropdown-menu">
            {Object.keys(sectors).map((sector) => (
              <button
                key={sector}
                className={`dropdown-item ${selectedSector === sector ? 'active' : ''}`}
                onClick={() => onSectorChange(sector)}
              >
                <span>
                  {sector.charAt(0).toUpperCase() + sector.slice(1)}
                </span>
                <span className="stock-count">
                  ({sectors[sector].length} stocks)
                </span>
              </button>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default SectorDropdown;