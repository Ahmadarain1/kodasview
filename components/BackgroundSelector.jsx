import { useState, useEffect } from "react";

const BackgroundSelector = ({ onBackgroundChange }) => {
  const [selectedBackground, setSelectedBackground] = useState("default");
  const [backgroundType, setBackgroundType] = useState("solid");

  const backgrounds = {
    solid: [
      { id: "black", name: "Black", value: "#000000" },
      { id: "dark-gray", name: "Dark Gray", value: "#1a1a1a" },
      { id: "navy", name: "Navy Blue", value: "#0a0f2e" },
      { id: "purple", name: "Deep Purple", value: "#1a0a2e" },
      { id: "green", name: "Forest Green", value: "#0a2e1a" },
    ],
    gradient: [
      {
        id: "blue-purple",
        name: "Blue to Purple",
        value: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      },
      {
        id: "pink-orange",
        name: "Pink to Orange",
        value: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
      },
      {
        id: "cyan-blue",
        name: "Cyan to Blue",
        value: "linear-gradient(135deg, #00c9ff 0%, #92fe9d 100%)",
      },
      {
        id: "sunset",
        name: "Sunset",
        value: "linear-gradient(135deg, #fa709a 0%, #fee140 100%)",
      },
    ],
    image: [
      {
        id: "space",
        name: "Space",
        value: "/assets/fullnodes/backgrounds/space.jpg",
      },
      {
        id: "galaxy",
        name: "Galaxy",
        value: "/assets/fullnodes/backgrounds/galaxy.jpg",
      },
      {
        id: "nebula",
        name: "Nebula",
        value: "/assets/fullnodes/backgrounds/nebula.jpg",
      },
    ],
  };

  useEffect(() => {
    onBackgroundChange(selectedBackground, backgroundType);
  }, [selectedBackground, backgroundType, onBackgroundChange]);

  const getBackgroundStyle = (bg) => {
    if (backgroundType === "image") {
      return {
        backgroundImage: `url(${bg.value})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      };
    }
    return { background: bg.value };
  };

  return (
    <div className="monkedex-background-selector">
      <h3 className="text-lg font-bold text-monke mb-4">Background</h3>

      <div className="flex gap-2 mb-4">
        <button
          onClick={() => setBackgroundType("solid")}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            backgroundType === "solid"
              ? "bg-monke-accent text-white"
              : "bg-monke-gray text-monke-dim border border-monke hover:border-monke-accent"
          }`}
        >
          Solid
        </button>
        <button
          onClick={() => setBackgroundType("gradient")}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            backgroundType === "gradient"
              ? "bg-monke-accent text-white"
              : "bg-monke-gray text-monke-dim border border-monke hover:border-monke-accent"
          }`}
        >
          Gradient
        </button>
        <button
          onClick={() => setBackgroundType("image")}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            backgroundType === "image"
              ? "bg-monke-accent text-white"
              : "bg-monke-gray text-monke-dim border border-monke hover:border-monke-accent"
          }`}
        >
          Image
        </button>
      </div>

      <div className="monkedex-background-grid">
        {backgrounds[backgroundType].map((bg) => (
          <div
            key={bg.id}
            className={`monkedex-background-option ${
              selectedBackground === bg.id ? "active" : ""
            }`}
            onClick={() => setSelectedBackground(bg.id)}
            style={getBackgroundStyle(bg)}
          >
            <div className="w-full h-full flex items-center justify-center">
              <span className="text-xs text-white font-medium bg-black/50 px-2 py-1 rounded">
                {bg.name}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4">
        <button
          onClick={() => setBackgroundType("animated")}
          className="px-4 py-2 bg-monke-gray border border-monke rounded-lg text-sm text-monke hover:border-monke-accent transition-all"
        >
          🎬 Animated Background
        </button>
      </div>
    </div>
  );
};

export default BackgroundSelector;
