import { useState, useMemo } from "react";

const NFTFilterPanel = ({ nfts, onFilterChange }) => {
  const [activeFilters, setActiveFilters] = useState({});
  const [expandedSections, setExpandedSections] = useState({});
  const [sortBy, setSortBy] = useState("INSCRIPTION NO.");

  // Calculate trait counts
  const traitCounts = useMemo(() => {
    const counts = {};

    nfts.forEach((nft) => {
      nft.attributes?.forEach((attr) => {
        const key = `${attr.trait_type}:${attr.value}`;
        counts[key] = (counts[key] || 0) + 1;
      });
    });

    // Group by trait type
    const grouped = {};
    Object.entries(counts).forEach(([key, count]) => {
      const [traitType, traitValue] = key.split(":");
      if (!grouped[traitType]) {
        grouped[traitType] = [];
      }
      grouped[traitType].push({ value: traitValue, count });
    });

    // Sort by count descending
    Object.keys(grouped).forEach((traitType) => {
      grouped[traitType].sort((a, b) => b.count - a.count);
    });

    return grouped;
  }, [nfts]);

  const toggleFilter = (traitType, traitValue) => {
    setActiveFilters((prev) => {
      const newFilters = { ...prev };

      if (!newFilters[traitType]) {
        newFilters[traitType] = [];
      }

      const index = newFilters[traitType].indexOf(traitValue);
      if (index > -1) {
        newFilters[traitType].splice(index, 1);
        if (newFilters[traitType].length === 0) {
          delete newFilters[traitType];
        }
      } else {
        newFilters[traitType].push(traitValue);
      }

      onFilterChange(newFilters);
      return newFilters;
    });
  };

  const clearFilters = () => {
    setActiveFilters({});
    onFilterChange({});
  };

  const toggleSection = (traitType) => {
    setExpandedSections((prev) => ({
      ...prev,
      [traitType]: !prev[traitType],
    }));
  };

  const hasActiveFilters = Object.keys(activeFilters).length > 0;
  const activeFilterCount = Object.values(activeFilters).reduce(
    (sum, arr) => sum + arr.length,
    0
  );

  return (
    <div className="bg-black border-r border-gray-700 p-4 w-80 overflow-y-auto sticky top-0 h-screen">
      {/* Sort By Section */}
      <div className="mb-6">
        <div className="font-mono text-sm font-bold text-white mb-3 uppercase tracking-wider">
          SORT BY &gt;
        </div>
        <div
          className={`flex items-center justify-between p-2 mb-1 bg-gray-800 border border-gray-700 cursor-pointer transition-all hover:bg-gray-700 hover:border-orange-500 font-mono text-xs ${
            sortBy === "RARITY"
              ? "bg-orange-500 text-white border-orange-500"
              : "text-gray-300"
          }`}
          onClick={() => setSortBy("RARITY")}
        >
          <span>RARITY</span>
          <span className="text-gray-400 text-xs">↑↓</span>
        </div>
        <div
          className={`flex items-center justify-between p-2 mb-1 bg-gray-800 border border-gray-700 cursor-pointer transition-all hover:bg-gray-700 hover:border-orange-500 font-mono text-xs ${
            sortBy === "INSCRIPTION NO."
              ? "bg-orange-500 text-white border-orange-500"
              : "text-gray-300"
          }`}
          onClick={() => setSortBy("INSCRIPTION NO.")}
        >
          <span>INSCRIPTION NO.</span>
          <span className="text-gray-400 text-xs">↑</span>
        </div>
        <div
          className={`flex items-center justify-between p-2 mb-1 bg-gray-800 border border-gray-700 cursor-pointer transition-all hover:bg-gray-700 hover:border-orange-500 font-mono text-xs ${
            sortBy === "SAT NO."
              ? "bg-orange-500 text-white border-orange-500"
              : "text-gray-300"
          }`}
          onClick={() => setSortBy("SAT NO.")}
        >
          <span>SAT NO.</span>
          <span className="text-gray-400 text-xs">↑</span>
        </div>
      </div>

      {/* Filters Section */}
      <div className="mb-6">
        <div className="font-mono text-sm font-bold text-white mb-3 uppercase tracking-wider">
          FILTERS ({activeFilterCount}) - {nfts.length}/10000
        </div>
        {hasActiveFilters && (
          <div className="mb-4">
            {Object.entries(activeFilters).map(([traitType, values]) =>
              values.map((value) => (
                <div
                  key={`${traitType}-${value}`}
                  className="inline-flex items-center gap-1 px-2 py-1 m-1 bg-gray-800 border border-gray-700 font-mono text-xs text-white"
                >
                  <span className="text-orange-500 text-xs">◆</span>
                  <span>
                    {traitType} &gt; {value}
                  </span>
                </div>
              ))
            )}
          </div>
        )}
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="font-mono text-sm font-bold text-orange-500 uppercase tracking-wider cursor-pointer hover:text-orange-400 transition-colors"
          >
            Clear &gt;
          </button>
        )}
      </div>

      {/* Attributes Section */}
      <div>
        <div className="font-mono text-sm font-bold text-white mb-3 uppercase tracking-wider">
          ATTRIBUTES
        </div>

        {Object.entries(traitCounts).map(([traitType, traits]) => {
          const isExpanded = expandedSections[traitType];
          const activeCount = activeFilters[traitType]?.length || 0;

          return (
            <div key={traitType} className="mb-4">
              <div
                className="font-mono text-xs font-bold text-white uppercase tracking-wider cursor-pointer flex justify-between items-center mb-2"
                onClick={() => toggleSection(traitType)}
              >
                <span>
                  L {traitType} ({traits.length}){" "}
                  {activeCount > 0 && `(${activeCount})`}
                </span>
                <span className="text-xs">{isExpanded ? "−" : "+"}</span>
              </div>

              {isExpanded && (
                <div className="mt-2">
                  {traits.map(({ value, count }) => {
                    const isActive = activeFilters[traitType]?.includes(value);
                    return (
                      <div
                        key={value}
                        className={`flex items-center justify-between p-2 mb-1 bg-gray-800 border cursor-pointer transition-all hover:bg-gray-700 hover:border-orange-500 font-mono text-xs ${
                          isActive
                            ? "bg-orange-500 text-white border-orange-500"
                            : "border-gray-700 text-gray-300"
                        }`}
                        onClick={() => toggleFilter(traitType, value)}
                      >
                        <span>{value}</span>
                        <span className="text-gray-400 text-xs">{count}</span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}

        {Object.keys(traitCounts).length === 0 && (
          <div className="font-mono text-sm text-gray-400 uppercase tracking-wider">
            No trait data available
          </div>
        )}
      </div>
    </div>
  );
};

export default NFTFilterPanel;
