import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#c0c0c0] flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="max-w-6xl w-full">
        <div className="bg-[#0a0a0a] border-2 border-[#1a1a1a] shadow-lg p-4 sm:p-6 lg:p-8">
          <h1
            className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-[#e0e0e0] mb-2 tracking-wider text-center leading-tight"
            style={{ fontFamily: '"Press Start 2P", "DOS NODE", monospace' }}
          >
            DUAL NFT COLLECTION VIEWERS
          </h1>
          <p
            className="text-xs sm:text-sm md:text-base text-[#888] text-center mb-6 sm:mb-8 px-2"
            style={{ fontFamily: '"Press Start 2P", "DOS NODE", monospace' }}
          >
            {/* Explore two stunning NFT collections with a Monkedex-inspired
            interface */}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            <Link href="/koda-viewer">
              <div className="bg-[#1a1a1a] border-2 border-[#2a2a2a] p-4 sm:p-6 cursor-pointer transition-all hover:border-[#ff8c00] hover:scale-[1.02]">
                <div className="text-center mb-4">
                  <div className="text-3xl sm:text-4xl lg:text-5xl mb-2">
                    🎨
                  </div>
                  <h2
                    className="text-lg sm:text-xl lg:text-2xl font-bold text-[#e0e0e0] mb-2"
                    style={{
                      fontFamily:
                        '"Share Tech Mono", "Orbitron", "Courier New", monospace',
                      fontWeight: "700",
                    }}
                  >
                    KODA MonkePET
                  </h2>
                  <p
                    className="text-[#888] text-xs sm:text-sm mb-4 px-2"
                    style={{
                      fontFamily:
                        '"Share Tech Mono", "Orbitron", "Courier New", monospace',
                      fontWeight: "700",
                    }}
                  >
                    View 10,000 unique KODA NFTs with advanced filtering and
                    search
                  </p>
                  <div
                    className="inline-block px-4 sm:px-6 py-2 bg-[#ff8c00] text-white text-xs sm:text-sm"
                    style={{
                      fontFamily:
                        '"Share Tech Mono", "Orbitron", "Courier New", monospace',
                      fontWeight: "700",
                    }}
                  >
                    VIEW COLLECTION →
                  </div>
                </div>
              </div>
            </Link>

            <Link href="/fullnodes-viewer">
              <div className="bg-[#1a1a1a] border-2 border-[#2a2a2a] p-4 sm:p-6 cursor-pointer transition-all hover:border-[#ff8c00] hover:scale-[1.02]">
                <div className="text-center mb-4">
                  <div className="text-3xl sm:text-4xl lg:text-5xl mb-2">
                    🐵
                  </div>
                  <h2
                    className="text-lg sm:text-xl lg:text-2xl font-bold text-[#e0e0e0] mb-2"
                    style={{
                      fontFamily:
                        '"Share Tech Mono", "Orbitron", "Courier New", monospace',
                      fontWeight: "700",
                    }}
                  >
                    FULL-BODY NODEMONKES
                  </h2>
                  <p
                    className="text-[#888] text-xs sm:text-sm mb-4 px-2"
                    style={{
                      fontFamily:
                        '"Share Tech Mono", "Orbitron", "Courier New", monospace',
                      fontWeight: "700",
                    }}
                  >
                    Explore 10,000 Monkes with customizable backgrounds
                  </p>
                  <div
                    className="inline-block px-4 sm:px-6 py-2 bg-[#ff8c00] text-white text-xs sm:text-sm"
                    style={{
                      fontFamily:
                        '"Share Tech Mono", "Orbitron", "Courier New", monospace',
                      fontWeight: "700",
                    }}
                  >
                    VIEW COLLECTION →
                  </div>
                </div>
              </div>
            </Link>
          </div>

          {/* <div
            className="mt-8 text-[#888] text-sm text-center"
            style={{ fontFamily: '"Press Start 2P", "DOS NODE", monospace' }}
          >
            <p>
              Design inspired by{" "}
              <a
                href="https://nodemonkes.com/monkedex"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#ff8c00] hover:underline"
              >
                NODEMONKES MONKEDEX
              </a>
            </p>
          </div> */}
        </div>
      </div>
    </div>
  );
}
