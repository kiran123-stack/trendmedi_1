# TrendMedi Website — Complete Documentation

Welcome to the comprehensive documentation for the TrendMedi website! This guide is designed to help beginners and future developers understand how to easily make site-wide changes (colors, fonts, images), edit content, and manage functionality like the product modal and search bar.

---

## 1. Why This Site is Better Than WordPress (Stability & Maintenance)

Before diving into edits, it's important to understand *why* this site is built the way it is, and why it is highly optimized for the future:

* **Zero Plugin Conflicts & No Database:** Unlike WordPress, which relies on PHP, MySQL databases, and third-party plugins that constantly need updating (and often break your site), this website is built using **Vanilla HTML, CSS, and JavaScript**. There is no database to hack, and no plugins to crash. 
* **Future-Proof:** Because it uses core web technologies without heavy frameworks (like React or jQuery), the code will run perfectly on browsers 10 years from now without requiring "updates". It simply cannot break on its own.
* **Insanely Fast:** Server requests are minimal. The browser just reads text files. 
* **Easy Maintenance:** The CSS uses a Design System (`:root` variables) so you don't have to hunt for colors. The JavaScript is modularized using IIFEs (wrapper functions) so different features (like Search and Popups) don't interfere with each other.

---

## 2. Image Optimization (Crucial for Fast Loading)

I have audited the images in the `images/` folder. **Not all image sizes are perfect currently.** For the absolute fastest loading speeds, you need to make a few changes:

* **CRITICAL WARNING:** `surgicaldress.jpg` is **3.29 MB**. This is *massive* for a website and will drastically slow down the page load for mobile users. You must compress this image.
* **Medium Images:** Images like `hospital_corridor.jpg`, `procurement_meeting.jpg`, and `quality_control.jpg` are between **500 KB and 750 KB**. While acceptable for desktop, this is still a bit heavy.
* **The Perfect State:**
    1. Run all `.jpg` and `.png` images through an image compressor (like TinyPNG).
    2. Ideally, keep all large photos **under 200 KB**.
    3. *Best Practice:* Convert your JPEGs to the modern **`.webp`** format, which retains quality but shrinks file size by 50%+.
* **Good News:** Your `.svg` icons (`doctor.svg`, `medical.svg`) are perfectly optimized and tiny!

---

## 3. How to Change Global Colors, Fonts, and Spacing

The entire website uses a **Design System** managed by CSS variables. 

### Changing Colors
Open `style.css` and find the `:root` block (around line 8). To change the main brand colors, update the Hex codes:
```css
:root {
  /* Primary Colors */
  --primary: #0a2540;       /* Main dark blue used for headers, buttons, etc. */
  --primary-light: #0d2e4d; /* Slightly lighter shade for hovers */
  
  /* Brand Green */
  --accent: #1a8f5a;        /* Main green accent */
  --accent-light: #4dd693;  /* Lighter green */
}
```

### Changing Fonts
The fonts are also controlled via variables in the same `:root` block:
```css
  --font-heading: 'Fraunces', ui-serif, Georgia, serif;
  --font-body: 'Inter', system-ui, -apple-system, sans-serif;
```

---

## 4. Managing Images and Logos

### The Main Logo
The main logo is `logo.png` located in the root folder. Simply replace this file with your new transparent PNG (keeping the exact name `logo.png`).

### Other Images
To change a background image or a photo on the site:
1. Upload your new (compressed!) image to the `images/` folder.
2. Open `index.html`, find the `<img>` tag, and update the file path (e.g., `<img src="images/new-photo.jpg">`).

---

## 5. Understanding the Page Structure (HTML Sections)

The `index.html` file is divided into distinct, logical `<section>` tags. To edit text, just find the right section in `index.html`:

1. **`<section class="hero" id="top">`**: The top banner with the main headline.
2. **`<section class="trust-strip">`**: Row of trusted partners.
3. **`<section class="products" id="products">`**: The grid of product categories.
4. **`<section class="about" id="about">`**: Company information.
5. **`<section class="quality" id="quality">`**: Manufacturing quality.
6. **`<section class="why">`**: "Why choose us".
7. **`<section class="industries" id="industries">`**: Industries served.
8. **`<section class="process" id="process">`**: Step-by-step guide.
9. **`<section class="testimonials">`**: Customer reviews.
10. **`<section class="faq" id="faq">`**: Frequently Asked Questions.
11. **`<section class="cta" id="cta">`**: Bottom Call To Action.

---

## 6. How the Search Bar Works (and Why)

### How it is made:
The search bar uses an input field (`id="searchInput"`) in the HTML and a dropdown container (`id="searchResults"`). 
Inside `script.js` (around line 290), there is a custom "Search Database" object containing keywords and category links. When a user types, the JavaScript instantly filters this data and injects matching HTML into the dropdown.

### Why it is built this way:
It is a **Client-Side Search**. Because the site has no backend database (like WordPress), we load the search data directly into the browser. 
**The Benefit:** It is lightning fast. It provides an "instant search as you type" experience without the page ever having to reload or wait for a server response.

---

## 7. The Product Category Modal (Popup Viewer)

### How to REMOVE the Popup
If you decide you no longer want the popup to appear when clicking products:
1. **Remove HTML Attributes:** Go to `index.html` and find the product cards (`<div class="product-card" data-category="...">`). Delete the `data-category="..."` part. Without this attribute, the JavaScript won't trigger.
2. **Remove the Modal HTML:** You can safely delete the entire `<div id="productModal" class="modal">...</div>` block from the bottom of your HTML.
3. **The JavaScript is safe:** The JS file has a safety check (`if(!modal) return;`). If you delete the modal from the HTML, the JS will simply ignore it and won't throw any errors. (You do not *have* to delete the JS code).

### How to Edit Products in the Popup
If you keep it, all product information is stored inside `script.js` in a dictionary called `skuData`. 

To add a new product to an existing category, just add a new line:
```javascript
'medical-apparel': {
  title: 'Medical Apparel — Product Range',
  items: [
    // existing items...
    
    // YOUR NEW ITEM:
    { name: 'New Scrubs', material: 'Premium Cotton', sizes: 'S - XL', badge: 'New Arrival' }
  ]
}
```

---


