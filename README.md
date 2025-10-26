# 🚀 Dual NFT Collection Viewers

**KODA Viewer** & **Full-Body NodeMonkes Viewer** — Pixel-perfect Monkedex design replica

---

## 📋 Overview

Two separate NFT collection viewers built with Next.js, featuring:

- **KODA Collection Viewer** (`/koda-viewer`) — 10,000 KODA NFTs
- **Full-Body NodeMonkes Viewer** (`/fullnodes-viewer`) — 10,000 Monkes with customizable backgrounds

Both viewers replicate the exact design and feel of [NodeMonkes Monkedex](https://nodemonkes.com/monkedex) with dark theme, smooth animations, and responsive layout.

---

## ✨ Features

### Core Features (Both Viewers)

- 🎨 **Monkedex-inspired Design** — Dark theme, light gray borders, hover animations
- 🔍 **Advanced Search** — Search by inscription ID or name
- 🎛️ **Sidebar Filters** — Filter by traits (Body, Eyes, Head, Earring, etc.)
- 📱 **Responsive Design** — Mobile, tablet, and desktop optimized
- ⚡ **Lazy Loading** — Efficient image loading with virtualization
- 🖼️ **Detail Modal** — Full-size art viewer with complete trait list
- 🎭 **Smooth Animations** — Hover effects, transitions, and loading states

### Full-Body NodeMonkes Exclusive

- 🎨 **Background Customization** — Solid colors, gradients, and images
- 🎬 **Animated Backgrounds** — Optional GIF backgrounds
- 🌈 **Multiple Themes** — Easy theme switching

---

## 🛠️ Tech Stack

- **Framework**: Next.js 14
- **Styling**: Tailwind CSS + Custom CSS
- **Performance**: React Window (virtualization)
- **Language**: JavaScript/JSX
- **Build**: Static export ready

---

## 📁 Project Structure

```
project-root/
├── pages/
│   ├── index.js                    # Home page
│   ├── _app.js                     # App wrapper
│   ├── koda-viewer/
│   │   └── index.js               # KODA viewer page
│   └── fullnodes-viewer/
│       └── index.js               # Full-Body Monkes viewer page
│
├── components/
│   ├── GridView.jsx               # NFT grid with virtualization
│   ├── FilterPanel.jsx            # Sidebar trait filters
│   ├── DetailViewer.jsx           # NFT detail modal
│   ├── BackgroundSelector.jsx     # Background customization (Full-Body only)
│   └── LoadingSkeleton.jsx        # Loading states
│
├── public/
│   ├── assets/
│   │   ├── koda/
│   │   │   ├── images/            # KODA NFT images (1.png to 10000.png)
│   │   │   └── metadata/
│   │   │       └── metadata.json  # KODA metadata
│   │   └── fullnodes/
│   │       ├── images/            # Full-Body Monke images
│   │       ├── metadata/
│   │       │   └── metadata.json  # Full-Body metadata
│   │       ├── backgrounds/       # Background images
│   │       └── animations/        # Animated backgrounds (GIFs)
│   └── placeholder.png            # Fallback image
│
├── config/
│   └── config.json                # Collection configuration
│
├── styles/
│   └── globals.css                # Global styles + Monkedex theme
│
├── package.json
├── next.config.js
├── tailwind.config.js
├── tsconfig.json
└── README.md
```

---

## 🚀 Getting Started

### 1. Install Dependencies

```bash
npm install
```

### 2. Add Your NFT Assets

#### For KODA Collection:

1. Place your KODA images in `public/assets/koda/images/` (1.png to 10000.png)
2. Update `public/assets/koda/metadata/metadata.json` with your metadata

#### For Full-Body NodeMonkes:

1. Place your Monke images in `public/assets/fullnodes/images/` (1.png to 10000.png)
2. Update `public/assets/fullnodes/metadata/metadata.json` with your metadata
3. Add background images to `public/assets/fullnodes/backgrounds/`
4. Add animated backgrounds to `public/assets/fullnodes/animations/`

### 3. Update Configuration

Edit `config/config.json` to customize:

- Collection names
- Total supply
- Trait categories
- Background options

### 4. Run Development Server

```bash
npm run dev
```

Visit `http://localhost:3000` to see the home page.

### 5. Build for Production

```bash
npm run build
npm start
```

---

## 📝 Metadata Format

Your `metadata.json` files should follow this structure:

```json
[
  {
    "tokenId": 1,
    "name": "KODA #1",
    "inscriptionId": "KODA-00001",
    "description": "The first KODA in the collection",
    "image": "/assets/koda/images/1.png",
    "attributes": [
      { "trait_type": "Body", "value": "Red" },
      { "trait_type": "Eyes", "value": "Laser" },
      { "trait_type": "Head", "value": "Crown" },
      { "trait_type": "Earring", "value": "Diamond" },
      { "trait_type": "Mouth", "value": "Smile" },
      { "trait_type": "Background", "value": "Solid" },
      { "trait_type": "Clothes", "value": "Suit" },
      { "trait_type": "Hat", "value": "Top Hat" },
      { "trait_type": "Accessories", "value": "Sunglasses" }
    ]
  }
]
```

---

## 🎨 Customization

### Changing Colors

Edit `tailwind.config.js`:

```javascript
colors: {
  'monke-dark': '#0a0a0a',      // Background
  'monke-gray': '#1a1a1a',      // Cards
  'monke-border': '#2a2a2a',    // Borders
  'monke-text': '#e0e0e0',      // Text
  'monke-accent': '#4a9eff',    // Accent/Highlight
}
```

### Adding New Trait Categories

Update `config/config.json`:

```json
{
  "koda": {
    "traitCategories": [
      "Body",
      "Eyes",
      "Head",
      "Earring",
      "Mouth",
      "Background",
      "Clothes",
      "Hat",
      "Accessories",
      "YourNewTrait"
    ]
  }
}
```

### Custom Backgrounds

Add backgrounds to `config/config.json` under `fullnodes.backgrounds`:

```json
"backgrounds": {
  "solid": [
    { "name": "Your Color", "value": "#hexcode" }
  ],
  "gradients": [
    { "name": "Your Gradient", "value": "linear-gradient(...)" }
  ]
}
```

---

## 🎯 Key Features Explained

### Virtualized Grid

Uses `react-window` for efficient rendering of 10,000+ NFTs. Only visible items are rendered in the DOM.

### Dynamic Filtering

Filters are calculated in real-time from your metadata. Click any trait to filter the collection.

### Responsive Design

- **Desktop**: 4-column grid, sidebar filters
- **Tablet**: 3-column grid, collapsible sidebar
- **Mobile**: 2-column grid, top filters

### Lazy Loading

Images load as you scroll using native `loading="lazy"` attribute.

---

## 📦 Deployment

### Vercel (Recommended)

```bash
npm install -g vercel
vercel
```

### Netlify

```bash
npm run build
# Deploy the 'out' folder
```

### GitHub Pages

```bash
npm run build
# Deploy the 'out' folder
```

### Static Hosting

The project builds to a fully static site in the `out/` folder. You can host it anywhere:

- AWS S3 + CloudFront
- Google Cloud Storage
- Azure Blob Storage
- Any static hosting service

---

## 🔧 Troubleshooting

### Images Not Loading

- Check file paths in `metadata.json`
- Ensure images are in the correct folders
- Verify file names match metadata (e.g., `1.png` for tokenId 1)

### Filters Not Working

- Verify `attributes` array in metadata
- Check `trait_type` and `value` format
- Ensure config.json trait categories match

### Performance Issues

- Reduce image file sizes
- Enable image optimization in `next.config.js`
- Use WebP format for images

---

## 📄 License

MIT License — feel free to use this project for your own NFT collections!

---

## 🙏 Credits

- **Design Inspiration**: [NodeMonkes Monkedex](https://nodemonkes.com/monkedex)
- **Framework**: [Next.js](https://nextjs.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Virtualization**: [React Window](https://github.com/bvaughn/react-window)

---

## 📮 Support

For issues, questions, or feature requests:

1. Check the troubleshooting section above
2. Review the code comments for implementation details
3. Ensure your metadata follows the correct format

---

## 🎉 Enjoy Your NFT Viewers!

Both viewers are production-ready and optimized for performance. Just add your assets and deploy!

**Happy viewing! 🚀**
