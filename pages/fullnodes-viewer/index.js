import { useState, useEffect } from "react";
import Link from "next/link";
import NFTGrid from "../../components/NFTGrid";
import NFTFilterPanel from "../../components/NFTFilterPanel";
import NFTDetailModal from "../../components/NFTDetailModal";
import BackgroundSelector from "../../components/BackgroundSelector";
import LoadingSkeleton from "../../components/LoadingSkeleton";

export default function FullNodesViewer() {
  const [nfts, setNfts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({});
  const [selectedNFT, setSelectedNFT] = useState(null);
  const [activeTab, setActiveTab] = useState("ALL");
  const [timestamp, setTimestamp] = useState("01:02:01");
  const [backgroundStyle, setBackgroundStyle] = useState({
    type: "solid",
    value: "#ff8c00",
  });

  useEffect(() => {
    loadNFTs();

    // Update timestamp every second
    const interval = setInterval(() => {
      const now = new Date();
      const hours = String(now.getHours()).padStart(2, "0");
      const minutes = String(now.getMinutes()).padStart(2, "0");
      const seconds = String(now.getSeconds()).padStart(2, "0");
      setTimestamp(`${hours}:${minutes}:${seconds}`);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const loadNFTs = async () => {
    try {
      setLoading(true);
      const response = await fetch("/assets/fullnodes/metadata/metadata.json");
      const data = await response.json();

      const processedNFTs = data.map((nft, index) => ({
        ...nft,
        id: nft.tokenId || index + 1,
        image:
          nft.image ||
          `/assets/fullnodes/images/${nft.tokenId || index + 1}.png`,
        inscriptionId:
          nft.inscriptionId || `FULLNODE-${String(index + 1).padStart(5, "0")}`,
      }));

      setNfts(processedNFTs);
    } catch (error) {
      console.error("Error loading NFTs:", error);
      setNfts(generateSampleNFTs());
    } finally {
      setLoading(false);
    }
  };

  const generateSampleNFTs = () => {
    const sampleTraits = {
      Body: [
        "Red",
        "Blue",
        "Green",
        "Yellow",
        "Purple",
        "Brown",
        "Grey",
        "Beak",
      ],
      Eyes: ["Normal", "Laser", "3D", "Cyclops", "Glowing"],
      Head: ["None", "Crown", "Cap", "Helmet", "Halo"],
      Earring: ["None", "Diamond", "Gold", "Silver", "Crystal"],
      Mouth: ["Smile", "Frown", "Open", "Tongue", "Teeth"],
      Background: ["Solid", "Gradient", "Pattern", "Abstract", "Stars"],
      Clothes: ["T-Shirt", "Suit", "Jacket", "Hoodie", "Vest"],
      Hat: ["None", "Baseball", "Beanie", "Top Hat", "Crown"],
      Accessories: ["None", "Sunglasses", "Mask", "Necklace", "Watch"],
    };

    return Array.from({ length: 100 }, (_, i) => ({
      id: i + 1,
      name: `Full-Body Monke #${i + 1}`,
      inscriptionId: `FULLNODE-${String(i + 1).padStart(5, "0")}`,
      image: `/assets/fullnodes/images/${i + 1}.png`,
      description: `Full-Body NodeMonke #${i + 1} from the collection`,
      attributes: Object.entries(sampleTraits).map(([trait_type, values]) => ({
        trait_type,
        value: values[Math.floor(Math.random() * values.length)],
      })),
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

  const handleBackgroundChange = (backgroundId, backgroundType) => {
    setBackgroundStyle({
      type: backgroundType,
      value: backgroundId,
    });
  };

  const getGridBackgroundStyle = () => {
    if (backgroundStyle.type === "gradient") {
      return { background: backgroundStyle.value };
    }
    return { backgroundColor: backgroundStyle.value };
  };

  return (
    <div className="monkedex-container">
      <div className="monkedex-main-wrapper">
        {/* Header */}
        <div className="monkedex-header">
          <div className="monkedex-header-top">
            <div>
              <div className="monkedex-title">FULL-BODY NODEMONKES</div>
              <div className="monkedex-timestamp">{timestamp}</div>
            </div>
            <div className="monkedex-header-links">
              <Link href="/">MONKEDEX</Link>
              <a href="#">AUCTION RESULTS</a>
              <a href="#">TOP SALES</a>
              <a href="#">TWITTER</a>
              <a href="#">DISCORD</a>
            </div>
          </div>

          <div className="monkedex-nav-tabs">
            <div
              className={`monkedex-nav-tab ${
                activeTab === "ALL" ? "active" : ""
              }`}
              onClick={() => setActiveTab("ALL")}
            >
              ALL
            </div>
            <div
              className={`monkedex-nav-tab ${
                activeTab === "MY MONKES" ? "active" : ""
              }`}
              onClick={() => setActiveTab("MY MONKES")}
            >
              MY MONKES
            </div>
            <div
              className={`monkedex-nav-tab ${
                activeTab === "WALLET LOOKUP" ? "active" : ""
              }`}
              onClick={() => setActiveTab("WALLET LOOKUP")}
            >
              WALLET LOOKUP
            </div>
          </div>

          <div className="monkedex-header-bottom">
            <div className="monkedex-search-container">
              <span className="monkedex-search-label">
                LOOKUP ID / MONKE NO.
              </span>
              <input
                type="text"
                placeholder="ex, 2291"
                value={searchQuery}
                onChange={handleSearch}
                className="monkedex-search"
              />
              <button className="monkedex-connect-wallet">
                &lt;CONNECT WALLET&gt;
              </button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="monkedex-main-layout">
          {/* Sidebar Filters */}
          <div>
            <BackgroundSelector onBackgroundChange={handleBackgroundChange} />
            <NFTFilterPanel nfts={nfts} onFilterChange={handleFilterChange} />
          </div>

          {/* Grid View */}
          <div
            className="monkedex-grid-container"
            style={getGridBackgroundStyle()}
          >
            {loading ? (
              <LoadingSkeleton count={30} />
            ) : (
              <NFTGrid
                nfts={nfts}
                searchQuery={searchQuery}
                filters={filters}
                onItemClick={handleItemClick}
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
