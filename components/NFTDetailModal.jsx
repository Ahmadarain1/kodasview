import { useEffect, useState } from "react";

const NFTDetailModal = ({ nft, onClose }) => {
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [onClose]);

  // Reset image loaded state when NFT changes
  useEffect(() => {
    setImageLoaded(false);
  }, [nft?.id]);

  // Generate layered image URLs for Koda NFTs
  const generateKodaImageUrls = (nft) => {
    if (!nft.tokenData || !nft.traits) {
      // Use placeholder or sample image for sample data
      return [`/placeholder.png`];
    }

    const imageUrls = [];

    // Layer each trait image like in the HTML file
    for (const attr of nft.tokenData.a) {
      const traitType = Object.keys(nft.traits).find(
        (key) => key.toLowerCase() === attr.t.toLowerCase()
      );
      if (!traitType) continue;

      const traitKeys = Object.keys(nft.traits[traitType]);
      const matchKey = traitKeys.find(
        (k) => k.split("#")[0].toLowerCase() === attr.v.toLowerCase()
      );
      if (!matchKey) continue;

      const imgUrl = `https://ordinals.com/content/${nft.traits[traitType][matchKey]}`;
      imageUrls.push(imgUrl);
    }

    return imageUrls.length > 0 ? imageUrls : [`/placeholder.png`];
  };

  if (!nft) return null;

  // Calculate rarity (mock calculation)
  const rarity = Math.floor(Math.random() * 10000) + 1;
  const traitCount = nft.attributes?.length || 0;
  const imageUrls = generateKodaImageUrls(nft);

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-95 backdrop-blur-sm z-50 flex items-center justify-center p-8 animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="bg-black border-4 border-white max-w-4xl w-full max-h-[80vh] overflow-hidden animate-scaleUp"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with ESC button */}
        <div className="px-6 py-4 border-b-2 border-white bg-black flex items-center justify-between">
          <div className="font-mono text-lg font-bold text-white uppercase tracking-wider">
            MONKE {nft.id} / INSCRIPTION {nft.inscriptionId || nft.id}
          </div>
          <button
            className="font-mono text-base font-bold text-white uppercase px-4 py-2 hover:text-orange-500 transition-colors"
            onClick={onClose}
          >
            &lt;ESC&gt;
          </button>
        </div>

        {/* Main content */}
        <div className="p-6 grid grid-cols-2 gap-8 bg-black min-h-[400px]">
          {/* Left side - Image */}
          <div className="relative bg-orange-500 aspect-square flex items-center justify-center overflow-hidden">
            {!imageLoaded && (
              <div className="absolute inset-0 bg-gradient-to-r from-gray-800 via-gray-700 to-gray-800 animate-pulse" />
            )}

            {/* Layered images for Koda NFTs */}
            {imageUrls.map((imageUrl, index) => (
              <img
                key={index}
                src={imageUrl}
                alt={`${nft.name || `NFT #${nft.id}`} layer ${index + 1}`}
                className={`absolute w-full h-full object-contain transition-opacity duration-300 ${
                  imageLoaded ? "opacity-100" : "opacity-0"
                }`}
                style={{
                  imageRendering: "pixelated",
                  imageRendering: "-moz-crisp-edges",
                  imageRendering: "crisp-edges",
                  zIndex: index,
                }}
                onLoad={() => {
                  if (index === 0) setImageLoaded(true);
                }}
                onError={(e) => {
                  if (index === 0) {
                    e.target.src = "/placeholder.png";
                    setImageLoaded(true);
                  }
                }}
              />
            ))}
          </div>

          {/* Right side - Details */}
          <div className="flex flex-col gap-4 bg-black">
            <div className="flex flex-col gap-2">
              <div className="font-mono text-sm font-bold text-white uppercase tracking-wider">
                RARITY - {rarity} / 10000
              </div>

              {/* Attributes */}
              {nft.attributes && nft.attributes.length > 0 ? (
                nft.attributes.map((attr, index) => (
                  <div
                    key={index}
                    className="font-mono text-sm font-bold text-white uppercase tracking-wider mb-1"
                  >
                    {attr.trait_type.toUpperCase()} ▸ {attr.value.toUpperCase()}
                  </div>
                ))
              ) : (
                <div className="font-mono text-sm font-bold text-white uppercase tracking-wider">
                  NO TRAITS AVAILABLE
                </div>
              )}

              <div className="font-mono text-sm font-bold text-white uppercase tracking-wider mb-1">
                TRAIT COUNT ▸ {traitCount}
              </div>

              <div className="font-mono text-sm font-bold text-white uppercase tracking-wider">
                SIZE - {Math.floor(Math.random() * 500) + 200} BYTES
              </div>

              <div className="font-mono text-sm font-bold text-white uppercase tracking-wider">
                SAT -{" "}
                {Math.floor(Math.random() * 1000000000000000) + 100000000000000}
              </div>
            </div>

            {/* Color palette squares */}
            <div className="flex gap-2 mt-4">
              <div
                className="w-5 h-5 border border-white cursor-pointer hover:scale-110 transition-transform"
                style={{ backgroundColor: "#ff8c00" }}
              ></div>
              <div
                className="w-5 h-5 border border-white cursor-pointer hover:scale-110 transition-transform"
                style={{ backgroundColor: "#1a0a2e" }}
              ></div>
              <div
                className="w-5 h-5 border border-white cursor-pointer hover:scale-110 transition-transform"
                style={{ backgroundColor: "#000000" }}
              ></div>
              <div
                className="w-5 h-5 border border-white cursor-pointer hover:scale-110 transition-transform"
                style={{
                  background:
                    "linear-gradient(45deg, #ff0000 25%, #ffffff 25%, #ffffff 50%, #ff0000 50%, #ff0000 75%, #ffffff 75%)",
                }}
              ></div>
              <div
                className="w-5 h-5 border border-white cursor-pointer hover:scale-110 transition-transform"
                style={{
                  background:
                    "linear-gradient(45deg, #ff00ff, #00ffff, #0000ff)",
                }}
              ></div>
            </div>
          </div>
        </div>

        {/* Footer buttons */}
        <div className="px-6 py-4 border-t-2 border-white bg-black flex justify-between items-center">
          <button className="font-mono text-sm font-bold text-white uppercase px-4 py-2 hover:text-orange-500 transition-colors">
            &lt;↓DOWNLOAD&gt;
          </button>
          <button className="font-mono text-sm font-bold text-white uppercase px-4 py-2 hover:text-orange-500 transition-colors">
            NEXT →
          </button>
        </div>
      </div>
    </div>
  );
};

export default NFTDetailModal;
