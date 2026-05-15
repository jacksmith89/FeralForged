/**
 * remove-demo.js
 *
 * Strips the Beginner-Astro-LESS template to a minimal state with only the Hero section.
 * Files are moved to scripts/deleted/ for recovery, not permanently deleted.
 *
 * Usage: npm run remove-demo
 */

import fs from 'fs';
import path from 'path';
import readline from 'readline';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');

const DELETED_DIR = path.join(__dirname, 'deleted');

// Files to move
const DEMO_PAGES = [
  'src/pages/about.astro',
  'src/pages/contact.astro',
  'src/pages/projects.astro',
  'src/pages/reviews.astro',
];

const DEMO_COMPONENTS = [
  'src/components/CTA.astro',
  'src/components/Footer.astro',
  'src/components/Banner.astro',
];

// Images to keep in src/assets/images (everything else gets moved)
const KEEP_SRC_IMAGES = ['landing.jpg'];

/**
 * Prompts user for confirmation
 */
function askConfirmation(question) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      rl.close();
      resolve(answer.toLowerCase() === 'y' || answer.toLowerCase() === 'yes');
    });
  });
}

/**
 * Ensures a directory exists, creating it recursively if needed
 */
function ensureDir(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

/**
 * Moves a file to the deleted directory, preserving relative path structure
 */
function moveFile(relativePath) {
  const srcPath = path.join(ROOT_DIR, relativePath);
  const destPath = path.join(DELETED_DIR, relativePath);

  if (!fs.existsSync(srcPath)) {
    console.log(`  Skipping (not found): ${relativePath}`);
    return false;
  }

  ensureDir(path.dirname(destPath));
  fs.copyFileSync(srcPath, destPath);
  fs.rmSync(srcPath);
  console.log(`  Moved: ${relativePath}`);
  return true;
}

/**
 * Moves all files in a directory except those in the keep list
 */
function moveDirectoryContents(relativeDirPath, keepFiles = []) {
  const srcDir = path.join(ROOT_DIR, relativeDirPath);

  if (!fs.existsSync(srcDir)) {
    console.log(`  Skipping directory (not found): ${relativeDirPath}`);
    return;
  }

  const entries = fs.readdirSync(srcDir, { withFileTypes: true });

  for (const entry of entries) {
    const entryRelPath = path.join(relativeDirPath, entry.name);

    if (entry.isDirectory()) {
      // Move entire subdirectory
      moveDirectory(entryRelPath);
    } else if (!keepFiles.includes(entry.name)) {
      moveFile(entryRelPath);
    } else {
      console.log(`  Keeping: ${entryRelPath}`);
    }
  }
}

/**
 * Moves an entire directory
 */
function moveDirectory(relativePath) {
  const srcPath = path.join(ROOT_DIR, relativePath);
  const destPath = path.join(DELETED_DIR, relativePath);

  if (!fs.existsSync(srcPath)) {
    console.log(`  Skipping directory (not found): ${relativePath}`);
    return false;
  }

  fs.cpSync(srcPath, destPath, { recursive: true });
  fs.rmSync(srcPath, { recursive: true, force: true });
  console.log(`  Moved directory: ${relativePath}`);
  return true;
}

/**
 * Updates navData.json to only include Home
 */
function updateNavData() {
  const navDataPath = path.join(ROOT_DIR, 'src/data/navData.json');
  const newNavData = [{ key: 'Home', url: '/' }];

  fs.writeFileSync(navDataPath, JSON.stringify(newNavData, null, 2) + '\n');
  console.log('  Updated: src/data/navData.json');
}

/**
 * Updates BaseLayout.astro to remove Footer
 */
function updateBaseLayout() {
  const layoutPath = path.join(ROOT_DIR, 'src/layouts/BaseLayout.astro');
  let content = fs.readFileSync(layoutPath, 'utf-8');

  // Remove Footer import
  content = content.replace(/import Footer from ["']\.\.\/components\/Footer\.astro["'];\n?/g, '');

  // Remove <Footer /> usage
  content = content.replace(/\s*<Footer \/>\s*/g, '\n');

  fs.writeFileSync(layoutPath, content);
  console.log('  Updated: src/layouts/BaseLayout.astro');
}

/**
 * Updates index.astro to Hero-only
 */
function updateIndexPage() {
  const indexPath = path.join(ROOT_DIR, 'src/pages/index.astro');

  const newContent = `---
import { Picture } from "astro:assets";
import BaseLayout from "../layouts/BaseLayout.astro";

import landingImage from "../assets/images/landing.jpg"

---

<BaseLayout
  title="Pixel Perfect Websites"
  description="Meta description for the page"
>
  <!-- ============================================ -->
  <!--                    Hero                      -->
  <!-- ============================================ -->

  <section id="hero">
    <div class="cs-container">
      <div class="cs-flex-group">
        <span class="cs-topper">Starter Kit</span>
        <h1 class="cs-title">Beginner Astro Starter Kit</h1>
        <p class="cs-text">
          This beginner kit includes a pre-configured Astro environment, which
allows for repeated components, centralized data and greater room to scale as your clients grow. The kit runs the latest major Astro version, v5.
        </p>
        <a href="/about" class="cs-button-solid">Explore More</a>
        <a href="/contact" class="cs-button-transparent">
          <img
            class="cs-img"
            loading="lazy"
            decoding="async"
            src="https://csimg.nyc3.digitaloceanspaces.com/Hero/play.svg"
            alt="play icon"
            width="17"
            height="17"
          />
          Get in Touch
        </a>
      </div>
    </div>

    <!-- Background Image -->
	<Picture
		src={landingImage}
		alt=""
		layout="full-width"
		formats={['avif', 'webp']}
		pictureAttributes={{ class: "cs-picture" }}
	/>
  </section>
</BaseLayout>

<style lang="less">
  /* STYLES FOR ABOVE THE FOLD */

  /*-- -------------------------- -->
<---           Hero             -->
<--- -------------------------- -*/

  /* Mobile - 360px */
  @media only screen and (min-width: 0em) {
    #hero {
      font-family: "Roboto", "Arial", sans-serif;
      /* Centers button */
      text-align: center;
      /* changes on tablet */
      padding: 0 (16/16rem);
      padding-bottom: (100/16rem);
      position: relative;
      z-index: 1;
      /* prevents overflow from the lines extending past the screen width */
      overflow: hidden;

      .cs-picture {
        /* Background Image */
        width: 100%;
        height: 100%;
        display: block;
        position: absolute;
        top: 0;
        left: 0;
        z-index: -2;

        &:before {
          /* Black Color Overlay */
          content: "";
          width: 100%;
          height: 100%;
          background: #000;
          opacity: 0.7;
          display: block;
          position: absolute;
          top: 0;
          left: 0;
          z-index: 1;
          /* prevents the cursor from interacting with it */
          pointer-events: none;
        }

        img {
          width: 100%;
          height: 100%;
          /* Makes image act like a background-image */
          object-fit: cover;
          position: absolute;
          top: 0;
          left: 0;
        }
      }

      .cs-container {
        width: 100%;
        max-width: (1280/16em);
        margin: auto;
        /* we put the padding top and bottom on the container instead of #Hero so the pseudo element lines go to the top and bottom of the section */
        /* 144px - 280px - leaving extra space for the navigation */
        /* changes on tablet */
        padding: clamp(9em, 25.95vw, 17.5em) 0;
        position: relative;

        &:before {
          /* Left Line */
          content: "";
          width: 1px;
          height: 100%;
          background: -moz-linear-gradient(
            top,
            rgba(250, 251, 252, 0.5) 0%,
            rgba(250, 251, 252, 0) 100%
          ); /* FF3.6-15 */
          background: -webkit-linear-gradient(
            top,
            rgba(250, 251, 252, 0.5) 0%,
            rgba(250, 251, 252, 0) 100%
          ); /* Chrome10-25,Safari5.1-6 */
          opacity: 1;
          display: block;
          position: absolute;
          top: 0;
          left: 0;
        }
      }

      .cs-flex-group {
        width: 80vw;
        /* 464px - 562px */
        max-width: clamp(29em, 60vw, 35.125em);
        margin: auto;
        /* 60px - 220px */
        margin-bottom: clamp(3.75em, 15.5vw, 13.75em);
        box-sizing: border-box;
        display: flex;
        justify-content: center;
        align-items: flex-start;
        flex-wrap: wrap;
      }

      .cs-topper {
        text-align: center;
        margin-bottom: (16/16rem);
        color: var(--primary);
      }

      .cs-title {
        text-align: center;
        width: 100%;
        color: var(--bodyTextColorWhite);
      }

      .cs-text {
        text-align: center;
        /* 32px - 40px */
        margin: 0 auto clamp(2rem, 4vw, 2.5rem) 0;
        /* 40px - 48px */
        margin-bottom: clamp(2.5rem, 4vw, 3rem);
        color: var(--bodyTextColorWhite);
      }

      .cs-button-solid {
        line-height: clamp(2.875em, 5.5vw, 3.5em);
        height: initial;
        margin-bottom: calc(16 / 16 * 1rem);
      }

      .cs-button-transparent {
        font-size: (16/16rem);
        font-weight: 700;
        /* 46px - 56px */
        line-height: clamp(2.875em, 5.5vw, 3.5em);
        text-decoration: none;
        width: (180/16rem);
        /* 46px - 56px */
        height: clamp(2.875em, 5.5vw, 3.5em);
        margin: 0 (8/16rem);
        box-sizing: border-box;
        padding: 0;
        color: #fff;
        background-color: transparent;
        border: 1px solid var(--bodyTextColorWhite);
        display: inline-flex;
        justify-content: center;
        align-items: center;
        position: relative;
        z-index: 1;

        &:before {
          content: "";
          background: #000;
          opacity: 1;
          display: block;
          position: absolute;
          /* so it sits on top of the border */
          top: -1px;
          right: -1px;
          bottom: -1px;
          left: -1px;
          z-index: -1;
          /* this is what creates the grow affect on hover */
          transform: scaleX(0);
          transition: transform 0.3s;
          transform-origin: left;
        }

        &:hover {
          &:before {
            transform: scaleX(1);
          }
        }

        .cs-img {
          margin-right: (12/16rem);
          display: block;
        }
      }
    }
  }

  /* Tablet - 768px */
  @media only screen and (min-width: 48em) {
    #hero {
      /* 32px - 40px */
      padding: 0 clamp(2em, 5vw, 2.5em);

      .cs-container {
        padding: clamp(7em, 27.95vw, 17.5em) 0 clamp(9em, 30.95vw, 23.5em) 0;
        &:after {
          /* Right Line */
          content: "";
          width: 1px;
          height: 100%;
          background: -moz-linear-gradient(
            top,
            rgba(250, 251, 252, 0) 0%,
            rgba(250, 251, 252, 0.5) 100%
          ); /* FF3.6-15 */
          background: -webkit-linear-gradient(
            top,
            rgba(250, 251, 252, 0) 0%,
            rgba(250, 251, 252, 0.5) 100%
          ); /* Chrome10-25,Safari5.1-6 */
          opacity: 1;
          display: block;
          position: absolute;
          top: 0;
          right: 0;
        }
      }

      .cs-button-solid {
        margin-right: (20/16rem);
        margin-bottom: 0;
      }
    }
  }

  /* Desktop Parallax Effect - 1300px */
  @media only screen and (min-width: 81.25em) {
    #hero {
      background: url("/assets/images/landing.jpg");
      background-position: center;
      background-size: cover;
      background-repeat: no-repeat;
      /* creates parallax effect on background image */
      background-attachment: fixed;
    }
  }

  /* Dark Mode */
  @media only screen and (min-width: 0em) {
    body.dark-mode {
      #hero {
        .cs-background {
          &:before {
            opacity: 0.8;
          }
        }
      }
    }
  }
</style>
`;

  fs.writeFileSync(indexPath, newContent);
  console.log('  Updated: src/pages/index.astro');
}

/**
 * Main execution
 */
async function main() {
  console.log('\n🧹 Beginner-Astro-LESS Demo Removal Script\n');
  console.log('This script will:');
  console.log('  - Move demo pages (about, contact, projects, reviews) to scripts/deleted/');
  console.log('  - Move demo components (CTA, Footer, Banner) to scripts/deleted/');
  console.log('  - Move demo images from src/assets/images to scripts/deleted/');
  console.log('  - Move demo SVGs from src/assets/svgs to scripts/deleted/');
  console.log('  - Update navData.json to Home only');
  console.log('  - Update BaseLayout.astro to remove Footer');
  console.log('  - Update index.astro to Hero section only');
  console.log('\nFiles can be recovered from scripts/deleted/ if needed.\n');

  // Ask for confirmation
  const confirmed = await askConfirmation('Proceed with demo removal? (y/n): ');
  if (!confirmed) {
    console.log('\nAborted.\n');
    process.exit(0);
  }

  console.log('\n--- Moving Demo Pages ---');
  for (const page of DEMO_PAGES) {
    moveFile(page);
  }

  console.log('\n--- Moving Demo Components ---');
  for (const component of DEMO_COMPONENTS) {
    moveFile(component);
  }

  console.log('\n--- Moving Demo Images from src/assets/images ---');
  moveDirectoryContents('src/assets/images', KEEP_SRC_IMAGES);

  console.log('\n--- Moving Demo SVGs from src/assets/svgs ---');
  moveDirectoryContents('src/assets/svgs', ['logo-black.svg', 'moon.svg', 'sun.svg']);

  console.log('\n--- Updating Configuration Files ---');
  updateNavData();
  updateBaseLayout();
  updateIndexPage();

  console.log('\n✅ Demo removal complete!');
  console.log('\nRun "npm run build" to verify the build succeeds.\n');
}

main().catch((error) => {
  console.error('\n❌ Error:', error.message);
  process.exit(1);
});
