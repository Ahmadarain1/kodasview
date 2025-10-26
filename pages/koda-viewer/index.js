import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import NFTGrid from "../../components/NFTGrid";
import NFTFilterPanel from "../../components/NFTFilterPanel";
import NFTDetailModal from "../../components/NFTDetailModal";
import LoadingSkeleton from "../../components/LoadingSkeleton";

export default function KodaViewer() {
  const [nfts, setNfts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({});
  const [selectedNFT, setSelectedNFT] = useState(null);
  const [activeTab, setActiveTab] = useState("ALL");
  const [timestamp, setTimestamp] = useState("01:02:01");
  const [metadata, setMetadata] = useState([]);
  const [traits, setTraits] = useState({});
  const [loadingRealData, setLoadingRealData] = useState(false);

  useEffect(() => {
    loadNFTs();
    updateTimestamp();
  }, []);

  const updateTimestamp = () => {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");
    const seconds = String(now.getSeconds()).padStart(2, "0");
    setTimestamp(`${hours}:${minutes}:${seconds}`);
  };

  const loadCompressedJson = async (url) => {
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error(`Failed to fetch ${url}`);
      const blob = await res.blob();
      const ds = new DecompressionStream("gzip");
      const stream = blob.stream().pipeThrough(ds);
      const buf = await new Response(stream).arrayBuffer();
      return JSON.parse(new TextDecoder("utf-8").decode(buf));
    } catch (error) {
      console.error("Error loading compressed JSON:", error);
      throw error;
    }
  };

  const loadNFTs = async () => {
    // First, immediately show sample data for fast initial loading
    setNfts(generateSampleNFTs());
    setLoading(false);

    // Then try to load real data in the background
    try {
      setLoadingRealData(true);
      console.log("Loading real Koda data in background...");

      // URLs from your HTML file
      const metadataUrl =
        "https://ordinals.com/content/bb80ebc496c8062447be938a94e5763e2d273d3a3b6a5e0e81d7b79333137476i0";
      const traitsUrl =
        "https://ordinals.com/content/fec3ab3747625ad82fa981a00d3d0e78f9cc2e28a1d5033bed4b5bdabcb9f301i0";

      // Set a timeout to avoid hanging on slow requests
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error("Request timeout")), 10000)
      );

      const dataPromise = Promise.all([
        loadCompressedJson(metadataUrl),
        loadCompressedJson(traitsUrl),
      ]);

      const [metadataData, traitsData] = await Promise.race([
        dataPromise,
        timeoutPromise,
      ]);

      console.log("✅ Real data loaded:", metadataData.length, "NFTs");

      setMetadata(metadataData);
      setTraits(traitsData);

      // Process NFTs with proper structure (load all 10,000 NFTs)
      const processedNFTs = metadataData.map((tokenData) => {
        const attributes = tokenData.a.map((attr) => ({
          trait_type: attr.t.toUpperCase(),
          value: attr.v.toUpperCase(),
        }));

        return {
          id: tokenData.e,
          name: `KODA #${tokenData.e}`,
          inscriptionId: `KODA-${String(tokenData.e).padStart(5, "0")}`,
          description: `KODA NFT #${tokenData.e} from the collection`,
          attributes: attributes,
          tokenData: tokenData,
          traits: traitsData,
        };
      });

      setNfts(processedNFTs);
      console.log("✅ Updated with real data:", processedNFTs.length, "NFTs");
    } catch (error) {
      console.warn(
        "Real data loading failed, using sample data:",
        error.message
      );
      // Keep using sample data - no need to change anything
    } finally {
      setLoadingRealData(false);
    }
  };

  const generateSampleNFTs = () => {
    // Sample data that matches the BODY attributes from your image with realistic distribution
    const bodyTraits = [
      { value: "BROWN", count: 558 },
      { value: "GREY", count: 557 },
      { value: "GREEN", count: 534 },
      { value: "BEAK", count: 505 },
      { value: "RED", count: 495 },
      { value: "STRIPED", count: 474 },
      { value: "WHITE", count: 468 },
      { value: "PEPE", count: 466 },
      { value: "BONED", count: 464 },
      { value: "BOT", count: 453 },
      { value: "BINARY", count: 416 },
      { value: "PURPLE", count: 365 },
      { value: "DOS", count: 364 },
      { value: "VHS", count: 351 },
      { value: "ION", count: 292 },
      { value: "HYENA", count: 257 },
      { value: "PATRIOT", count: 244 },
      { value: "DEATHBOT", count: 238 },
      { value: "DARK", count: 233 },
      { value: "MEMPOOL", count: 233 },
      { value: "ZOMBIE", count: 217 },
      { value: "SAFEMODE", count: 212 },
      { value: "PINK", count: 206 },
      { value: "LIGHT", count: 202 },
      { value: "MEDIUM", count: 202 },
      { value: "RAINBOW", count: 195 },
      { value: "ALBINO", count: 192 },
      { value: "MOON", count: 180 },
      { value: "UNDERLORD", count: 157 },
      { value: "WRAPPED", count: 127 },
      { value: "GOLD", count: 102 },
      { value: "ALIEN", count: 41 },
    ];

    const otherTraits = {
      EYES: [
        "NORMAL",
        "LASER",
        "3D",
        "CYCLOPS",
        "GLOWING",
        "WINK",
        "ANGRY",
        "SLEEPY",
      ],
      HEAD: ["NONE", "CROWN", "CAP", "HELMET", "HALO", "HAT", "HEADBAND"],
      MOUTH: ["SMILE", "FROWN", "OPEN", "TONGUE", "TEETH", "NONE"],
      BACKGROUND: ["SOLID", "GRADIENT", "PATTERN", "ABSTRACT", "STARS", "GRID"],
    };

    // Create weighted distribution for body traits
    const weightedBodyTraits = [];
    bodyTraits.forEach((trait) => {
      for (let i = 0; i < Math.min(trait.count / 10, 50); i++) {
        weightedBodyTraits.push(trait.value);
      }
    });

    return Array.from({ length: 1000 }, (_, i) => ({
      id: i + 1,
      name: `KODA #${i + 1}`,
      inscriptionId: `KODA-${String(i + 1).padStart(5, "0")}`,
      image: `/assets/koda/images/${i + 1}.png`,
      description: `KODA NFT #${i + 1} from the collection`,
      attributes: [
        {
          trait_type: "BODY",
          value:
            weightedBodyTraits[
              Math.floor(Math.random() * weightedBodyTraits.length)
            ],
        },
        {
          trait_type: "EYES",
          value:
            otherTraits.EYES[
              Math.floor(Math.random() * otherTraits.EYES.length)
            ],
        },
        {
          trait_type: "HEAD",
          value:
            otherTraits.HEAD[
              Math.floor(Math.random() * otherTraits.HEAD.length)
            ],
        },
        {
          trait_type: "MOUTH",
          value:
            otherTraits.MOUTH[
              Math.floor(Math.random() * otherTraits.MOUTH.length)
            ],
        },
        {
          trait_type: "BACKGROUND",
          value:
            otherTraits.BACKGROUND[
              Math.floor(Math.random() * otherTraits.BACKGROUND.length)
            ],
        },
      ],
    }));
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  const handleItemClick = (nft) => {
    setSelectedNFT(nft);
  };

  const handleCloseModal = () => {
    setSelectedNFT(null);
  };

  return (
    <div className="min-h-screen bg-gray-300 p-5">
      <div className="max-w-7xl mx-auto bg-black border-2 border-gray-800 shadow-2xl">
        {/* Header */}
        <div className="bg-black border-b border-gray-700 px-6 py-4 sticky top-0 z-50">
          <div className="flex justify-between items-center mb-4">
            <div>
              <div className="font-mono text-2xl font-bold text-white tracking-wider">
                KODA COLLECTION
                {loadingRealData && (
                  <span className="ml-2 text-orange-500 text-sm">
                    (Loading real data...)
                  </span>
                )}
              </div>
              <div className="font-mono text-sm text-gray-400">{timestamp}</div>
            </div>
            <div className="flex gap-6 font-mono text-sm">
              <Link
                href="/"
                className="text-gray-400 hover:text-white transition-colors"
              >
                MONKEDEX
              </Link>
              <a
                href="#"
                className="text-gray-400 hover:text-white transition-colors"
              >
                AUCTION RESULTS
              </a>
              {/* <a
                href="#"
                className="text-gray-400 hover:text-white transition-colors"
              >
                TOP SALES
              </a> */}
              <a
                href="#"
                className="text-gray-400 hover:text-white transition-colors"
              >
                TWITTER
              </a>
              {/* <a
                href="#"
                className="text-gray-400 hover:text-white transition-colors"
              >
                DISCORD
              </a> */}
            </div>
          </div>

          <div className="flex gap-2 mb-4">
            <div
              className={`px-4 py-2 bg-gray-800 border border-gray-700 text-white font-mono text-sm cursor-pointer transition-all hover:bg-gray-700 hover:border-orange-500 ${
                activeTab === "ALL" ? "bg-orange-500 border-orange-500" : ""
              }`}
              onClick={() => setActiveTab("ALL")}
            >
              ALL
            </div>
            <div
              className={`px-4 py-2 bg-gray-800 border border-gray-700 text-white font-mono text-sm cursor-pointer transition-all hover:bg-gray-700 hover:border-orange-500 ${
                activeTab === "MY KODAS"
                  ? "bg-orange-500 border-orange-500"
                  : ""
              }`}
              onClick={() => setActiveTab("MY KODAS")}
            >
              MY KODAS
            </div>
            <div
              className={`px-4 py-2 bg-gray-800 border border-gray-700 text-white font-mono text-sm cursor-pointer transition-all hover:bg-gray-700 hover:border-orange-500 ${
                activeTab === "WALLET LOOKUP"
                  ? "bg-orange-500 border-orange-500"
                  : ""
              }`}
              onClick={() => setActiveTab("WALLET LOOKUP")}
            >
              WALLET LOOKUP
            </div>
          </div>

          <div className="flex justify-between items-center gap-4">
            <div className="flex gap-2 items-center">
              <span className="font-mono text-sm text-gray-400 whitespace-nowrap">
                LOOKUP ID / KODA NO.
              </span>
              <input
                type="text"
                placeholder="ex, 2291"
                value={searchQuery}
                onChange={handleSearch}
                className="bg-gray-800 border border-gray-700 text-white px-3 py-2 font-mono text-sm transition-all focus:outline-none focus:border-orange-500 focus:bg-gray-700 w-48"
              />
              <button className="px-4 py-2 bg-gray-800 border border-gray-700 text-white font-mono text-sm cursor-pointer transition-all hover:bg-gray-700 hover:border-orange-500">
                &lt;CONNECT WALLET&gt;
              </button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex min-h-screen">
          {/* Sidebar Filters */}
          <NFTFilterPanel nfts={nfts} onFilterChange={handleFilterChange} />

          {/* Grid View */}
          <div className="flex-1 bg-black p-4 overflow-y-auto h-screen">
            {loading ? (
              <LoadingSkeleton count={30} />
            ) : (
              <NFTGrid
                nfts={nfts}
                searchQuery={searchQuery}
                filters={filters}
                onItemClick={handleItemClick}
                traits={traits}
              />
            )}
          </div>
        </div>
      </div>

      {/* Detail Modal */}
      {selectedNFT && (
        <NFTDetailModal nft={selectedNFT} onClose={handleCloseModal} />
      )}
    </div>
  );
}
