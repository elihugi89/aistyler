# Enhanced Image Processing Setup

This app now uses a **two-step AI processing pipeline** for clothing items:

1. **Remove.bg API** - Removes background from images
2. **Runway ML API** - Applies fashion segmentation to extract clothing

## 🚀 **Enhanced Processing Workflow**

### **Step 1: Background Removal (Remove.bg)**
- Removes background from uploaded images
- Uses professional AI for clean background removal
- Outputs transparent background image

### **Step 2: Clothing Segmentation (Runway ML)**
- Applies fashion segmentation models
- Extracts only the clothing items
- Discards non-clothing elements
- Outputs clean clothing-only image

## 🔧 **Setup Instructions**

### **1. Remove.bg API Setup** ✅
Already configured with your API key: `D98D5BWVa6NtGmxCLT4Rinoh`

### **2. Runway ML API Setup**

1. **Get API Key**:
   - Visit [https://runwayml.com/api](https://runwayml.com/api)
   - Sign up for an account
   - Navigate to API dashboard
   - Copy your API key

2. **Configure API Key**:
   - Open `src/config/runwayMLConfig.ts`
   - Replace `'YOUR_RUNWAY_ML_API_KEY_HERE'` with your actual API key

3. **Find Fashion Segmentation Model**:
   - Browse available models in Runway ML
   - Look for fashion/clothing segmentation models
   - Update `MODEL_ID` in the config file

## 📁 **Files Created/Modified**

### **New Services**:
- `src/services/RunwayMLService.ts` - Runway ML API integration
- `src/services/ImageProcessingService.ts` - Combined processing pipeline
- `src/config/runwayMLConfig.ts` - Runway ML configuration

### **Updated Files**:
- `src/screens/WardrobeScreen.tsx` - Uses enhanced processing
- `src/services/RemoveBgService.ts` - Already configured

## 🔄 **Processing Flow**

```
User Uploads Image
        ↓
Remove.bg API (Background Removal)
        ↓
Runway ML API (Clothing Segmentation)
        ↓
Clean Clothing-Only Image
        ↓
Save to Wardrobe
```

## ⚙️ **Configuration Options**

### **Remove.bg Settings** (`src/config/removeBgConfig.ts`):
```typescript
export const REMOVE_BG_CONFIG = {
  API_KEY: 'D98D5BWVa6NtGmxCLT4Rinoh',
  DEFAULT_SIZE: 'auto',
  DEFAULT_FORMAT: 'png',
  MAX_RETRIES: 3,
  RETRY_DELAY: 1000,
};
```

### **Runway ML Settings** (`src/config/runwayMLConfig.ts`):
```typescript
export const RUNWAY_ML_CONFIG = {
  API_KEY: 'your-runway-ml-api-key',
  MODEL_ID: 'fashion-segmentation-v1',
  TASK: 'segmentation',
  MAX_RETRIES: 3,
  RETRY_DELAY: 1000,
};
```

## 🎯 **Features**

### **Enhanced Processing**:
- ✅ **Two-step AI pipeline** for optimal results
- ✅ **Real-time progress tracking** for each step
- ✅ **Error handling** for both APIs
- ✅ **Automatic retries** with exponential backoff
- ✅ **Professional quality** clothing extraction

### **User Experience**:
- ✅ **Progress indicators** showing current step
- ✅ **Detailed error messages** for troubleshooting
- ✅ **Seamless integration** with existing workflow
- ✅ **Fallback handling** if one service fails

## 🧪 **Testing**

To test the enhanced processing:

1. **Set up both API keys**
2. **Run the app**: `npx expo start`
3. **Navigate to Wardrobe screen**
4. **Add a clothing item** with photo
5. **Watch the two-step processing**:
   - Step 1: "Background Removal (Remove.bg)"
   - Step 2: "Clothing Segmentation (Runway ML)"

## 🚨 **Error Handling**

The system handles various scenarios:

- **Remove.bg fails**: Shows background removal error
- **Runway ML fails**: Shows segmentation error
- **Network issues**: Automatic retries
- **Invalid API keys**: Clear error messages
- **Rate limiting**: Exponential backoff

## 💰 **API Costs**

### **Remove.bg**:
- Free tier: 50 API calls per month
- Paid: $0.20 per additional image

### **Runway ML**:
- Check [Runway ML pricing](https://runwayml.com/pricing)
- Costs vary by model and usage

## 🔗 **API Documentation**

- **Remove.bg**: [https://www.remove.bg/api](https://www.remove.bg/api)
- **Runway ML**: [https://runwayml.com/api](https://runwayml.com/api)

---

**Note**: Keep your API keys secure and never commit them to version control. Consider using environment variables for production deployments. 