# Changelog

## 3.0.0

### Major changes
- **Assets moved from `public/` to `src/assets/`** - Images and SVGs are now in `src/assets/` for better optimization through Astro's asset pipeline
- **Using `<Picture>` component across all pages** - Replaces standard `<img>` tags with Astro's optimized Picture component for responsive images
- **SVGs are now components** - SVGs are imported and used as Astro components instead of inline or via `<img>` tags
- **Removed preloading logic** - Simplified the asset loading approach
- **Renamed components** - `Landing.astro` renamed to `Banner.astro` with simplified props
- **New default: constrained layout for Image and Picture** - Images now use constrained layout by default

### Added
- **Remove-demo script** - Run `npm run remove-demo` to strip demo content and start fresh with a clean template

### Updated
- Astro upgraded to v5.17.1
- Deleted unused assets

#### What should I do on my fork?
If you're upgrading from v2.x:
1. Move your images from `public/` to `src/assets/`
2. Update image imports to use Astro's `<Picture>` or `<Image>` components
3. Update any references to `Landing.astro` to use `Banner.astro`
4. Review SVG usage - consider converting to component imports

## 2.0.2
- Astro has been upgraded to v5.7.12
You can find an exhaustive list of all changes in [Astro's changelog](https://github.com/withastro/astro/blob/main/packages/astro/CHANGELOG.md)

## 2.0.1
### patch change
- Astro has been upgraded to v5.4.2
You can find an exhaustive list of all changes in [Astro’s changelog](https://github.com/withastro/astro/blob/main/packages/astro/CHANGELOG.md)

## 2.0.0

### Major changes
- Astro has been upgraded to v5.0

#### What should I do on my fork?
- Upgrade Astro and its dependencies
  - Run `npx @astrojs/upgrade` in your terminal
  - At the yellow warning, choose “Yes” to continue
- Ensure that the other packages you may have added are up-to-date and compatible with Astro v5
- Please refer to the [official Upgrade to v5 guide](https://docs.astro.build/en/guides/upgrade-to/v5/) if you run into any issues.

### Minor changes
- Added CHANGELOG.md to keep track of patch changes and setup instructions

## 0.1.0
### Added
- Initial release of Beginner-Astro-v4-LESS template

