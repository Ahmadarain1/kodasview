import { useState, useMemo } from "react";

const NFTGrid = ({ nfts, onItemClick, searchQuery = "", filters = {} }) => {
  const [hoveredId, setHoveredId] = useState(null);
  const [loadedImages, setLoadedImages] = useState(new Set());

  // Handle image load
  const handleImageLoad = (imageSrc) => {
    setLoadedImages((prev) => new Set([...prev, imageSrc]));
  };

  // Filter NFTs based on search and filters
  const filteredNFTs = useMemo(() => {
    return nfts.filter((nft) => {
      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesSearch =
          nft.name?.toLowerCase().includes(query) ||
          nft.id?.toString().includes(query) ||
          nft.inscriptionId?.toLowerCase().includes(query);

        if (!matchesSearch) return false;
      }

      // Trait filters
      if (Object.keys(filters).length > 0) {
        for (const [traitType, selectedValues] of Object.entries(filters)) {
          if (selectedValues && selectedValues.length > 0) {
            const nftTrait = nft.attributes?.find(
              (attr) => attr.trait_type === traitType
            );
            if (!nftTrait || !selectedValues.includes(nftTrait.value)) {
              return false;
            }
          }
        }
      }

      return true;
    });
  }, [nfts, searchQuery, filters]);

  if (filteredNFTs.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[400px] text-gray-400">
        <div className="text-center">
          <p className="font-mono text-lg font-bold text-gray-400 mb-2 uppercase tracking-wider">
            No NFTs found
          </p>
          <p className="font-mono text-sm text-gray-400 uppercase tracking-wider">
            Try adjusting your search or filters
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-6 gap-2 max-w-full">
      {filteredNFTs.map((nft) => {
        const isHovered = hoveredId === nft.id;
        const imageSrc = nft.image || "/placeholder.png";
        const isImageLoaded = loadedImages.has(imageSrc);

        return (
          <div
            key={nft.id}
            className="bg-gray-800 border-2 border-gray-700 overflow-hidden transition-all duration-200 cursor-pointer hover:border-orange-500 hover:scale-105 relative"
            onClick={() => onItemClick(nft)}
            onMouseEnter={() => setHoveredId(nft.id)}
            onMouseLeave={() => setHoveredId(null)}
          >
            <div className="relative overflow-hidden bg-gray-800 aspect-square">
              {/* Loading skeleton */}
              {!isImageLoaded && (
                <div className="absolute inset-0 bg-gradient-to-r from-gray-700 via-gray-600 to-gray-700 animate-pulse" />
              )}

              {/* Actual image */}
              <img
                src={imageSrc}
                alt={nft.name || `NFT #${nft.id}`}
                className={`w-full h-full object-cover transition-opacity duration-300 ${
                  isImageLoaded ? "opacity-100" : "opacity-0"
                }`}
                style={{
                  imageRendering: "pixelated",
                  imageRendering: "-moz-crisp-edges",
                  imageRendering: "crisp-edges",
                }}
                loading="lazy"
                onLoad={() => handleImageLoad(imageSrc)}
                onError={(e) => {
                  e.target.src = "/placeholder.png";
                  handleImageLoad("/placeholder.png");
                }}
              />

              {isHovered && (
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end p-3">
                  <span className="font-mono text-white text-sm font-bold uppercase tracking-wider">
                    View Details
                  </span>
                </div>
              )}
            </div>
            <div className="p-2 bg-gray-800 text-center">
              <div className="font-mono text-xs font-bold text-gray-400 uppercase tracking-wider">
                {nft.name || `#${nft.id}`}
              </div>
              <div className="font-mono text-xs text-gray-500 uppercase tracking-wider">
                ID: {nft.inscriptionId || nft.id}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default NFTGrid;
