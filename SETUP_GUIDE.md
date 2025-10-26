# 🛠️ Quick Setup Guide

## Step-by-Step Setup Instructions

### 1️⃣ Install Dependencies

```bash
npm install
```

This will install:

- Next.js 14
- React 18
- Tailwind CSS
- React Window (for virtualization)
- All required dependencies

---

### 2️⃣ Prepare Your NFT Assets

#### For KODA Collection:

**Images:**

```
public/assets/koda/images/
├── 1.png
├── 2.png
├── 3.png
...
└── 10000.png
```

**Metadata:**
Edit `public/assets/koda/metadata/metadata.json` with your actual metadata.

#### For Full-Body NodeMonkes:

**Images:**

```
public/assets/fullnodes/images/
├── 1.png
├── 2.png
├── 3.png
...
└── 10000.png
```

**Metadata:**
Edit `public/assets/fullnodes/metadata/metadata.json` with your actual metadata.

**Backgrounds (Optional):**

```
public/assets/fullnodes/backgrounds/
├── space.jpg
├── galaxy.jpg
└── nebula.jpg
```

**Animations (Optional):**

```
public/assets/fullnodes/animations/
├── animated-bg-1.gif
└── animated-bg-2.gif
```

---

### 3️⃣ Update Configuration

Edit `config/config.json` to match your collection:

```json
{
  "koda": {
    "name": "Your KODA Collection Name",
    "totalSupply": 10000,
    "traitCategories": [
      "Body",
      "Eyes",
      "Head",
      "Earring",
      "Mouth",
      "Background",
      "Clothes",
      "Hat",
      "Accessories"
    ]
  },
  "fullnodes": {
    "name": "Your Full-Body Monke Name",
    "totalSupply": 10000,
    "traitCategories": [
      "Body",
      "Eyes",
      "Head",
      "Earring",
      "Mouth",
      "Background",
      "Clothes",
      "Hat",
      "Accessories"
    ],
    "backgrounds": {
      "solid": [
        { "name": "Black", "value": "#000000" },
        { "name": "Dark Gray", "value": "#1a1a1a" }
      ],
      "gradients": [
        {
          "name": "Blue to Purple",
          "value": "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
        }
      ]
    }
  }
}
```

---

### 4️⃣ Test Locally

```bash
npm run dev
```

Open `http://localhost:3000` in your browser.

You should see:

- Home page with links to both viewers
- KODA viewer at `/koda-viewer`
- Full-Body viewer at `/fullnodes-viewer`

---

### 5️⃣ Customize (Optional)

#### Change Colors

Edit `tailwind.config.js`:

```javascript
colors: {
  'monke-dark': '#0a0a0a',      // Change background color
  'monke-accent': '#4a9eff',    // Change accent color
}
```

#### Change Fonts

Edit `styles/globals.css`:

```css
@import url("https://fonts.googleapis.com/css2?family=YourFont:wght@300;400;500;600;700&display=swap");

html,
body {
  font-family: "YourFont", system-ui, sans-serif;
}
```

#### Adjust Grid Size

Edit `components/GridView.jsx`:

```javascript
const columnCount = 4; // Change to 3, 5, etc.
```

---

### 6️⃣ Build for Production

```bash
npm run build
```

This creates an optimized production build in the `out/` folder.

---

### 7️⃣ Deploy

#### Option A: Vercel (Easiest)

```bash
npm install -g vercel
vercel
```

Follow the prompts. Your site will be live in seconds!

#### Option B: Netlify

1. Push your code to GitHub
2. Connect your repo to Netlify
3. Build command: `npm run build`
4. Publish directory: `out`

#### Option C: Static Hosting

Upload the `out/` folder to:

- AWS S3 + CloudFront
- Google Cloud Storage
- Azure Blob Storage
- Any web hosting service

---

## 🎨 Adding Your First NFT

### Quick Test

1. Create a test image: `public/assets/koda/images/1.png`
2. Edit `public/assets/koda/metadata/metadata.json`:

```json
[
  {
    "tokenId": 1,
    "name": "KODA #1",
    "inscriptionId": "KODA-00001",
    "description": "My first KODA",
    "image": "/assets/koda/images/1.png",
    "attributes": [
      { "trait_type": "Body", "value": "Red" },
      { "trait_type": "Eyes", "value": "Laser" }
    ]
  }
]
```

3. Run `npm run dev`
4. Visit `http://localhost:3000/koda-viewer`
5. You should see your NFT!

---

## 🔧 Common Issues

### Issue: Images not showing

**Solution:**

- Check file paths in metadata.json
- Ensure images are in the correct folder
- File names must match tokenId (e.g., tokenId 1 = 1.png)

### Issue: Filters not working

**Solution:**

- Verify attributes array in metadata
- Check trait_type spelling matches config.json
- Ensure each NFT has the same trait categories

### Issue: Build fails

**Solution:**

- Run `npm install` again
- Delete `node_modules` and `.next` folders
- Run `npm install` and `npm run build` again

### Issue: Slow performance

**Solution:**

- Optimize your images (compress to WebP)
- Reduce image file sizes
- The app uses virtualization, so it should handle 10k NFTs fine

---

## 📚 Next Steps

1. ✅ Add all your NFT images
2. ✅ Update metadata.json with real data
3. ✅ Customize colors and fonts
4. ✅ Test all features (search, filters, detail view)
5. ✅ Deploy to production

---

## 🎉 You're All Set!

Your NFT viewers are ready to go. Just add your assets and deploy!

For more details, see the main [README.md](./README.md).
