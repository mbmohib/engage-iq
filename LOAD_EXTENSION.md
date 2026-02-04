# How to Load EngageIQ Extension in Chrome

## Quick Start

1. **Build the extension** (if not already built):

   ```bash
   npm run build
   ```

2. **Open Chrome Extensions page**:

   - Open Chrome browser
   - Navigate to `chrome://extensions/`
   - Or: Menu (⋮) → Extensions → Manage extensions

3. **Enable Developer Mode**:

   - Toggle "Developer mode" switch in the top-right corner

4. **Load the extension**:

   - Click "Load unpacked" button
   - Navigate to and select the `dist` folder in this project:
     ```
     /Users/mohib/Works/EngageIQ/dist
     ```

5. **Verify installation**:
   - You should see "EngageIQ" extension in your extensions list
   - The extension icon should appear in your Chrome toolbar

## Testing the Extension

1. **Navigate to LinkedIn**:

   - Go to https://www.linkedin.com
   - Log in to your account

2. **Test the extension**:
   - Look for the floating "⚡ EngageIQ" button on LinkedIn posts
   - Click the button to open the side panel
   - Configure API keys in the popup (click extension icon)

## Development Mode

For active development with auto-rebuild:

```bash
npm run dev
```

This will watch for changes and rebuild automatically. After rebuilding:

- Go to `chrome://extensions/`
- Click the refresh icon (🔄) on the EngageIQ extension card

## Troubleshooting

- **Extension not loading**: Check the browser console (`chrome://extensions/` → Click "Errors" or check console)
- **Icons not showing**: The placeholder icons should work, but you can replace them in `dist/icons/` with proper PNG files
- **Content scripts not running**: Make sure you're on `https://www.linkedin.com/*`
- **Side panel not opening**: Check that you have the `sidePanel` permission in manifest.json

## Next Steps

1. Configure your API keys (OpenAI/Anthropic) in the extension popup
2. Test on various LinkedIn post types
3. Check browser console for any errors
4. Review the extension logs in `chrome://extensions/` → EngageIQ → "service worker" link
