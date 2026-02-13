# 🖼️ Olynex Pitha Frame

Olynex Pitha Frame is a sleek, React-based web application that allows users to upload personal photos, apply custom decorative frames, and perform real-time adjustments (cropping, scaling, and rotating) before downloading a high-resolution version for social media or personal use.

## ✨ Features

* **Custom Frame Overlays:** Choose from multiple festive and classic frame designs.
* **Interactive Cropping (Panning):** Click and drag the photo within the frame to position it perfectly.
* **Real-time Scaling:** Smooth zoom controls to adjust the photo size relative to the frame.
* **Instant Rotation:** Rotate photos in 90-degree increments for the best orientation.
* **High-Resolution Export:** Downloads are rendered at 1080x1080px for crisp, professional quality.
* **Responsive UI:** Fully optimized for both desktop and mobile browsers using Tailwind CSS.

## 🚀 Tech Stack

* **Frontend:** [React.js](https://reactjs.org/) (Functional Components & Hooks)
* **Language:** [TypeScript](https://www.typescriptlang.org/)
* **Styling:** [Tailwind CSS](https://tailwindcss.com/)
* **Rendering engine:** HTML5 Canvas API (for image processing and flattening)

## 🛠️ Installation

1.  **Clone the repository:**
    ```bash
    git clone [https://github.com/shihab-uddin/olynex-pitha-frame.git](https://github.com/shihab-uddin/olynex-pitha-frame.git)
    cd olynex-pitha-frame
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Run the development server:**
    ```bash
    npm start
    ```

## 📁 Project Structure

```text
src/
├── assets/             # PNG Frame overlays and static images
├── components/         # React components (FramePreview, etc.)
├── types/              # TypeScript interfaces (ImageState)
├── App.tsx             # Main application logic and UI
└── index.tsx           # Entry point

```

## 📸 How It Works

1. **Upload:** Use the "Add Photo" button to select an image from your device.
2. **Adjust:** * **Drag** the image to change its position (panning).
* Use the **slider** to zoom in or out.
* Click **Rotate** to change the orientation.


3. **Select Frame:** Choose your preferred style from the sidebar.
4. **Save:** Hit "Download Result" to merge the layers into a single PNG file.

---

**Developed with ❤️ by [Shihab Uddin](https://shihab-dev.web.app/)**