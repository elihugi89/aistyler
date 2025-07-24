# Remove.bg API Integration Setup

This app now uses the [Remove.bg API](https://www.remove.bg/api) for actual background removal instead of mock functionality.

## Setup Instructions

### 1. Get Your API Key

1. Visit [https://www.remove.bg/api](https://www.remove.bg/api)
2. Sign up for a free account
3. Navigate to your API dashboard
4. Copy your API key

### 2. Configure the API Key

1. Open `src/config/removeBgConfig.ts`
2. Replace `'YOUR_REMOVE_BG_API_KEY_HERE'` with your actual API key:

```typescript
export const REMOVE_BG_CONFIG = {
  API_KEY: 'your-actual-api-key-here',
  // ... other settings
};
```

### 3. API Usage

- **Free Tier**: 50 API calls per month
- **Paid Tier**: $0.20 per additional image
- **Rate Limits**: 500 images per minute (resolution-dependent)

### 4. Features

The integration includes:

- ✅ **Real background removal** using Remove.bg's AI
- ✅ **Automatic retry logic** for failed requests
- ✅ **Rate limiting handling** with exponential backoff
- ✅ **Error handling** with user-friendly messages
- ✅ **Multiple output formats** (PNG, JPG, ZIP)
- ✅ **Account information** retrieval

### 5. Usage in the App

1. **Wardrobe Screen**: Tap the FAB (floating action button) to add items
2. **Image Selection**: Choose from camera or photo library
3. **Background Removal**: The app automatically removes backgrounds using Remove.bg
4. **Save Item**: Add the processed item to your wardrobe

### 6. Configuration Options

You can customize the API behavior in `src/config/removeBgConfig.ts`:

```typescript
export const REMOVE_BG_CONFIG = {
  API_KEY: 'your-api-key',
  DEFAULT_SIZE: 'auto', // 'auto', 'preview', 'full', 'regular', 'medium', 'hd', '4k'
  DEFAULT_FORMAT: 'png', // 'auto', 'png', 'jpg', 'zip'
  MAX_RETRIES: 3,
  RETRY_DELAY: 1000, // milliseconds
};
```

### 7. Error Handling

The app handles various error scenarios:

- **Invalid API key**: Shows configuration error
- **Rate limiting**: Automatically retries with exponential backoff
- **Network errors**: Retries up to 3 times
- **Processing errors**: Shows user-friendly error messages

### 8. Testing

To test the integration:

1. Set up your API key
2. Run the app: `npx expo start`
3. Navigate to the Wardrobe screen
4. Add a clothing item with a photo
5. Verify background removal works

### 9. Troubleshooting

**Common Issues:**

- **"API key not found"**: Check your API key configuration
- **"Rate limit exceeded"**: Wait a moment and try again
- **"Network error"**: Check your internet connection
- **"Processing failed"**: Try with a different image

**Support:**

- Remove.bg API Documentation: [https://www.remove.bg/api](https://www.remove.bg/api)
- Remove.bg Support: [https://www.remove.bg/support](https://www.remove.bg/support)

---

**Note**: Keep your API key secure and never commit it to version control. Consider using environment variables for production deployments. 