import { useState, useMemo, useRef, useEffect } from "react";

const NFTGrid = ({
  nfts,
  onItemClick,
  searchQuery = "",
  filters = {},
  traits = {},
}) => {
  const [hoveredId, setHoveredId] = useState(null);
  const [loadedImages, setLoadedImages] = useState(new Set());
  const [visibleItems, setVisibleItems] = useState(new Set());
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(100); // Show 100 NFTs per page
  const observerRef = useRef(null);

  // Handle image load
  const handleImageLoad = (imageSrc) => {
    setLoadedImages((prev) => new Set([...prev, imageSrc]));
  };

  // Intersection Observer for lazy loading
  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const nftId = entry.target.getAttribute("data-nft-id");
            setVisibleItems((prev) => new Set([...prev, nftId]));
          }
        });
      },
      { rootMargin: "50px" }
    );

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, []);

  // Generate layered image URLs for Koda NFTs with fallback
  const generateKodaImageUrls = (nft) => {
    if (!nft.tokenData || !traits) {
      // Use placeholder or sample image for sample data
      return [`/placeholder.png`];
    }

    const imageUrls = [];

    // Layer each trait image like in the HTML file
    for (const attr of nft.tokenData.a) {
      const traitType = Object.keys(traits).find(
        (key) => key.toLowerCase() === attr.t.toLowerCase()
      );
      if (!traitType) continue;

      const traitKeys = Object.keys(traits[traitType]);
      const matchKey = traitKeys.find(
        (k) => k.split("#")[0].toLowerCase() === attr.v.toLowerCase()
      );
      if (!matchKey) continue;

      const imgUrl = `https://ordinals.com/content/${traits[traitType][matchKey]}`;
      imageUrls.push(imgUrl);
    }

    return imageUrls.length > 0 ? imageUrls : [`/placeholder.png`];
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

  // Pagination logic
  const totalPages = Math.ceil(filteredNFTs.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedNFTs = filteredNFTs.slice(startIndex, endIndex);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, filters]);

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
    <div className="w-full">
      {/* Pagination Info */}
      <div className="mb-4 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
        <div className="font-mono text-xs sm:text-sm text-gray-400">
          Showing {startIndex + 1}-{Math.min(endIndex, filteredNFTs.length)} of{" "}
          {filteredNFTs.length} NFTs
        </div>
        <div className="flex flex-wrap gap-2 items-center">
          {/* Items per page selector */}
          <div className="flex gap-1">
            <button
              onClick={() => setItemsPerPage(100)}
              className={`px-2 py-1 text-xs font-mono border ${
                itemsPerPage === 100
                  ? "bg-orange-500 border-orange-500 text-white"
                  : "bg-gray-800 border-gray-700 text-gray-300 hover:bg-gray-700"
              }`}
            >
              100
            </button>
            <button
              onClick={() => setItemsPerPage(500)}
              className={`px-2 py-1 text-xs font-mono border ${
                itemsPerPage === 500
                  ? "bg-orange-500 border-orange-500 text-white"
                  : "bg-gray-800 border-gray-700 text-gray-300 hover:bg-gray-700"
              }`}
            >
              500
            </button>
            <button
              onClick={() => setItemsPerPage(filteredNFTs.length)}
              className={`px-2 py-1 text-xs font-mono border ${
                itemsPerPage === filteredNFTs.length
                  ? "bg-orange-500 border-orange-500 text-white"
                  : "bg-gray-800 border-gray-700 text-gray-300 hover:bg-gray-700"
              }`}
            >
              ALL
            </button>
          </div>

          {/* Pagination controls */}
          {totalPages > 1 && (
            <div className="flex gap-2">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 bg-gray-800 border border-gray-700 text-white font-mono text-xs disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-700 hover:border-orange-500"
              >
                ← PREV
              </button>
              <span className="px-3 py-1 bg-gray-800 border border-gray-700 text-white font-mono text-xs">
                {currentPage} / {totalPages}
              </span>
              <button
                onClick={() =>
                  setCurrentPage(Math.min(totalPages, currentPage + 1))
                }
                disabled={currentPage === totalPages}
                className="px-3 py-1 bg-gray-800 border border-gray-700 text-white font-mono text-xs disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-700 hover:border-orange-500"
              >
                NEXT →
              </button>
            </div>
          )}
        </div>
      </div>

      {/* NFT Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-1 sm:gap-2 max-w-full">
        {paginatedNFTs.map((nft) => {
          const isHovered = hoveredId === nft.id;
          const imageUrls = generateKodaImageUrls(nft);
          const isImageLoaded = loadedImages.has(imageUrls[0]);
          const isVisible = visibleItems.has(nft.id.toString());

          return (
            <div
              key={nft.id}
              data-nft-id={nft.id}
              ref={(el) => {
                if (el && observerRef.current) {
                  observerRef.current.observe(el);
                }
              }}
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

                {/* Layered images for Koda NFTs - only load when visible */}
                {isVisible &&
                  imageUrls.map((imageUrl, index) => (
                    <img
                      key={index}
                      src={imageUrl}
                      alt={`${nft.name || `NFT #${nft.id}`} layer ${index + 1}`}
                      className={`absolute w-full h-full object-contain transition-opacity duration-300 ${
                        isImageLoaded ? "opacity-100" : "opacity-0"
                      }`}
                      style={{
                        imageRendering: "pixelated",
                        imageRendering: "-moz-crisp-edges",
                        imageRendering: "crisp-edges",
                        zIndex: index,
                      }}
                      loading="lazy"
                      onLoad={() => handleImageLoad(imageUrls[0])}
                      onError={(e) => {
                        e.target.src = "/placeholder.png";
                        handleImageLoad("/placeholder.png");
                      }}
                    />
                  ))}

                {isHovered && (
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end p-3">
                    {/* <span className="font-mono text-white text-sm font-bold uppercase tracking-wider">
                      View Details
                    </span> */}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default NFTGrid;
