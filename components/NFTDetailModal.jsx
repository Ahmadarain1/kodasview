import { useEffect, useState } from "react";

const NFTDetailModal = ({
  nft,
  onClose,
  onNext,
  onToggleFavorite,
  isFavorite,
}) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

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

  // Function to composite multiple images into one
  const compositeImages = async (imageUrls) => {
    return new Promise((resolve, reject) => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      // Set canvas size (assuming square images)
      canvas.width = 512;
      canvas.height = 512;

      let loadedImages = 0;
      const images = [];

      if (imageUrls.length === 0) {
        reject(new Error("No images to composite"));
        return;
      }

      // Load all images
      imageUrls.forEach((url, index) => {
        const img = new Image();
        img.crossOrigin = "anonymous";

        img.onload = () => {
          images[index] = img;
          loadedImages++;

          // When all images are loaded, composite them
          if (loadedImages === imageUrls.length) {
            // Draw each image on top of the previous ones
            images.forEach((img) => {
              if (img) {
                ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
              }
            });

            // Convert canvas to blob
            canvas.toBlob((blob) => {
              if (blob) {
                resolve(blob);
              } else {
                reject(new Error("Failed to create blob from canvas"));
              }
            }, "image/png");
          }
        };

        img.onerror = () => {
          console.warn(`Failed to load image ${index}:`, url);
          loadedImages++;

          // If this was the last image, try to composite what we have
          if (loadedImages === imageUrls.length) {
            images.forEach((img) => {
              if (img) {
                ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
              }
            });

            canvas.toBlob((blob) => {
              if (blob) {
                resolve(blob);
              } else {
                reject(new Error("Failed to create blob from canvas"));
              }
            }, "image/png");
          }
        };

        img.src = url;
      });
    });
  };

  // Download function
  const handleDownload = async () => {
    if (isDownloading) return; // Prevent multiple downloads

    setIsDownloading(true);
    try {
      const imageUrls = generateKodaImageUrls(nft);

      // Check if it's a local placeholder
      if (imageUrls.length === 1 && imageUrls[0] === "/placeholder.png") {
        const link = document.createElement("a");
        link.href = imageUrls[0];
        link.download = `monke-${nft.id}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        return;
      }

      let blob;

      if (imageUrls.length === 1) {
        // Single image - fetch directly
        const response = await fetch(imageUrls[0], {
          mode: "cors",
          headers: {
            Accept: "image/*",
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        blob = await response.blob();
      } else {
        // Multiple images - composite them
        blob = await compositeImages(imageUrls);
      }

      const blobUrl = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = `monke-${nft.id}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Clean up the blob URL
      URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error("Download failed:", error);

      // Fallback: try to download placeholder
      try {
        const link = document.createElement("a");
        link.href = "/placeholder.png";
        link.download = `monke-${nft.id}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } catch (fallbackError) {
        console.error("Fallback download also failed:", fallbackError);
        alert("Download failed. Please try again or contact support.");
      }
    } finally {
      setIsDownloading(false);
    }
  };

  // Next NFT function
  const handleNext = () => {
    if (onNext) {
      onNext();
    }
  };

  if (!nft) return null;

  // Calculate rarity (mock calculation)
  const rarity = Math.floor(Math.random() * 10000) + 1;
  const traitCount = nft.attributes?.length || 0;
  const imageUrls = generateKodaImageUrls(nft);

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-95 backdrop-blur-sm z-50 flex items-center justify-center p-2 sm:p-4 lg:p-8 animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="bg-black border-2 sm:border-4 border-white max-w-4xl w-full max-h-[95vh] sm:max-h-[90vh] overflow-hidden animate-scaleUp mx-2 sm:mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with ESC button */}
        <div className="px-3 sm:px-4 lg:px-6 py-3 sm:py-4 border-b-2 border-white bg-black flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div className="font-mono text-sm sm:text-base lg:text-lg font-semibold text-white uppercase tracking-widest">
            MONKE {nft.id} / INSCRIPTION {nft.inscriptionId || nft.id}
          </div>
          <button
            className="font-mono text-sm sm:text-base font-semibold text-white uppercase px-3 sm:px-4 py-2 hover:text-orange-500 transition-colors tracking-wider"
            onClick={onClose}
          >
            &lt;ESC&gt;
          </button>
        </div>

        {/* Main content */}
        <div className="p-3 sm:p-4 lg:p-6 grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8 bg-black min-h-[400px]">
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
          <div className="flex flex-col gap-3 sm:gap-4 bg-black">
            <div className="flex flex-col gap-2">
              <div className="font-mono text-xs sm:text-sm font-semibold text-white uppercase tracking-wider">
                RARITY - {rarity} / 10000
              </div>

              {/* Attributes */}
              {nft.attributes && nft.attributes.length > 0 ? (
                nft.attributes.map((attr, index) => (
                  <div
                    key={index}
                    className="font-mono text-xs sm:text-sm font-semibold text-white uppercase tracking-wider mb-1"
                  >
                    {attr.trait_type.toUpperCase()} ▸ {attr.value.toUpperCase()}
                  </div>
                ))
              ) : (
                <div className="font-mono text-xs sm:text-sm font-semibold text-white uppercase tracking-wider">
                  NO TRAITS AVAILABLE
                </div>
              )}

              <div className="font-mono text-xs sm:text-sm font-semibold text-white uppercase tracking-wider mb-1">
                TRAIT COUNT ▸ {traitCount}
              </div>

              <div className="font-mono text-xs sm:text-sm font-semibold text-white uppercase tracking-wider">
                SIZE - {Math.floor(Math.random() * 500) + 200} BYTES
              </div>

              <div className="font-mono text-xs sm:text-sm font-semibold text-white uppercase tracking-wider">
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
        <div className="px-3 sm:px-4 lg:px-6 py-3 sm:py-4 border-t-2 border-white bg-black flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
          <div className="flex flex-col sm:flex-row gap-2">
            <button
              className={`font-mono text-xs sm:text-sm font-semibold uppercase px-3 sm:px-4 py-2 transition-colors border border-white hover:border-orange-500 tracking-wider ${
                isDownloading
                  ? "text-orange-500 cursor-not-allowed"
                  : "text-white hover:text-orange-500"
              }`}
              onClick={handleDownload}
              disabled={isDownloading}
            >
              {isDownloading ? "DOWNLOADING..." : "DOWNLOAD"}
            </button>
            {onToggleFavorite && (
              <button
                className={`font-mono text-xs sm:text-sm font-semibold uppercase px-3 sm:px-4 py-2 transition-colors border tracking-wider ${
                  isFavorite
                    ? "text-orange-500 border-orange-500 bg-orange-500 bg-opacity-20"
                    : "text-white border-white hover:text-orange-500 hover:border-orange-500"
                }`}
                onClick={() => onToggleFavorite(nft)}
              >
                {isFavorite ? "★ FAVORITED" : "☆ ADD TO FAVORITES"}
              </button>
            )}
          </div>
          <button
            className="font-mono text-xs sm:text-sm font-semibold text-white uppercase px-3 sm:px-4 py-2 hover:text-orange-500 transition-colors border border-white hover:border-orange-500 tracking-wider"
            onClick={handleNext}
          >
            NEXT →
          </button>
        </div>
      </div>
    </div>
  );
};

export default NFTDetailModal;
