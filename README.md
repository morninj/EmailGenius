## Configuration

- Run `pnpm install` to install dependencies.
- `build/` contains the unpacked Chrome extension.
- `release/` contains the production builds for the Chrome Web Store.

## Development

- `.ts` code lives in `ts/`.
- `content.ts` is the content script and the entry point for the rest of the
  code.
- Go to Chrome > Settings > Extensions and click the "Load unpacked" button and
  select the `build/` folder.
- Install the
  [Reload Extensions](https://chrome.google.com/webstore/detail/extensions-reloader/fimgfedafeadlieiabdeeaodndnlbhid)
  extension.
- Run `pnpm run watch`. This will watch for changes to `.ts` files in the `ts/`
  folder and automatically package them with `webpack`. This creates an unpacked
  extension in `build/`. It also automatically reloads the extension in Chrome
  via the Reload Extensions extension.

## Deployment

- Bump the version in `manifest.json`.
- Run `pnpm run build`. This will create a production build in `release/`.
- Upload the latest zip file in `release/` to the Chrome Web Store.
