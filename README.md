# 🎵 Aashik's Personal Portfolio

A visually stunning, interactive personal portfolio website showcasing software engineering projects, experience, and skills. Built with a music-themed, futuristic aesthetic featuring smooth animations, a star-powered design system, and an interactive cat mascot.

**🌐 Live:** [aashikilangovan.github.io](https://aashikilangovan.github.io)

---

## ✨ Features

### 🐾 **Mewo the Cat Mascot**
- Interactive animated cat with star-themed design
- Auto-rotating personality messages
- **Secret battle mode** — challenge Mewo to an anime-style turn-based battle
  - 4 randomized silly attacks per battle (music, cat, and tech themed)
  - Mewo reacts to your attacks as his health depletes
  - Win to unlock an exclusive secret message!

### 🎨 **Design & Animations**
- **Star-themed UI** with accent colors (cyan/sky blue gradient)
- **Scroll progress bar** styled like a music track scrubber
- **Starfield background** with multiple depth layers
- **Click-to-burst animations** — colorful stars burst wherever you click
- **Smooth scroll-reveal animations** for section content
- **Music-themed visual effects** throughout
- **Responsive design** across all devices

### 📁 **Highlighted Projects**
- **My Wavelength** — Personal Spotify analytics dashboard with listening heatmaps
- **Blood Donation Database** — Full-stack donation scheduling web app
- **Streamix** — HTPC media browsing and rating application
- Plus additional academic and hackathon projects

### 💼 **Professional Sections**
- **About Me** — Background in Software Engineering + Master of Management (U of C)
- **Experience** — Role details and accomplishments at U Technology Corp
- **Skills** — Tech stack spanning languages, frameworks, databases, and tools
- **Resume** — PDF download link to full resume (Aug 7, 2026)

### ⚡ **Performance Optimizations**
- Lazy-loading images with responsive sizing
- Click-to-load YouTube embed (facade pattern) to avoid heavy player JS
- Efficient starfield via CSS box-shadow (no per-frame calculations)
- Early DOM reveal (no wait for all images)
- Deferred scripts for parallel loading
- Responsive images resized to match CSS display sizes

---

## 🛠️ Tech Stack

**Frontend:**
- HTML5, CSS3 (custom properties, clip-path, animations)
- Vanilla JavaScript (ES5, no frameworks)
- Font Awesome icons

**Hosting:**
- GitHub Pages (static site)
- Custom domain via DNS

**Performance Tools:**
- Playwright for automated testing
- Performance monitoring & optimization

---

## 🎮 How to Battle Mewo

1. Click on **Mewo** (the cat in the top-right corner)
2. Click **"Yes, Let's Go!"** to enter battle
3. Choose from **4 attack options** each turn
4. Mewo's dialogue changes as you damage him
5. **Defeat him in 3–4 attacks** to win
6. **Unlock the secret message** that appears in his rotation

---

## 📂 File Structure

```
aashikilangovan.github.io/
├── index.html              # Main portfolio page
├── assets/
│   ├── css/
│   │   ├── main.css        # Core styles + battle system CSS
│   │   ├── fontawesome-all.min.css
│   │   └── noscript.css
│   ├── js/
│   │   ├── custom.js       # Cat mascot + battle system logic
│   │   ├── jquery.min.js
│   │   ├── browser.min.js
│   │   ├── breakpoints.min.js
│   │   └── util.js
│   └── fonts/              # Web fonts
├── images/
│   ├── resume.pdf          # Current resume
│   ├── my-wavelength.png
│   └── [project images]
└── README.md               # This file
```

---

## 🎨 Color Palette

- **Accent (Primary):** `#38bdf8` (Sky Blue)
- **Accent Soft:** `#7dd3fc` (Light Blue)
- **Accent Deep:** `#818cf8` (Indigo)
- **Background:** `#11142b` (Dark Navy)
- **Text:** Off-white/Light gray

---

## 🚀 Quick Start (Local Development)

1. Clone the repo:
   ```bash
   git clone https://github.com/aashikilangovan/aashikilangovan.github.io.git
   cd aashikilangovan.github.io
   ```

2. Open in a local server (GitHub Pages requires a server for full functionality):
   ```bash
   python -m http.server 8000
   # or
   npx http-server
   ```

3. Visit `http://localhost:8000` and explore!

---

## 📱 Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers

---

## 🎵 Design Philosophy

This portfolio blends **music, technology, and creativity** into a cohesive visual experience. The starfield aesthetic, smooth animations, and interactive elements create an immersive environment that reflects both technical skill and artistic sensibility.

---

## 📧 Contact

- **Email:** [aashikilangovan@gmail.com](mailto:aashikilangovan@gmail.com)
- **LinkedIn:** [aashiki](https://www.linkedin.com/in/aashiki/)
- **GitHub:** [aashikilangovan](https://github.com/aashikilangovan)

---

## 📄 License

Personal portfolio — feel free to draw inspiration, but please don't copy verbatim. 😊

---

**Made with ✨ and 🐾** | Last updated: August 2026
