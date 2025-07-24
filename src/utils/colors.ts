interface RGB {
  r: number;
  g: number;
  b: number;
}

interface HSL {
  h: number;
  s: number;
  l: number;
}

export const colors = {
  hexToRgb(hex: string): RGB | null {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  },

  rgbToHex(r: number, g: number, b: number): string {
    return '#' + [r, g, b].map(x => {
      const hex = x.toString(16);
      return hex.length === 1 ? '0' + hex : hex;
    }).join('');
  },

  rgbToHsl(r: number, g: number, b: number): HSL {
    r /= 255;
    g /= 255;
    b /= 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h = 0;
    let s;
    const l = (max + min) / 2;

    if (max === min) {
      h = s = 0;
    } else {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

      switch (max) {
        case r:
          h = (g - b) / d + (g < b ? 6 : 0);
          break;
        case g:
          h = (b - r) / d + 2;
          break;
        case b:
          h = (r - g) / d + 4;
          break;
      }

      h /= 6;
    }

    return { h: h * 360, s: s * 100, l: l * 100 };
  },

  isColorLight(hex: string): boolean {
    const rgb = this.hexToRgb(hex);
    if (!rgb) return true;

    // Calculate relative luminance
    const luminance = (0.299 * rgb.r + 0.587 * rgb.g + 0.114 * rgb.b) / 255;
    return luminance > 0.5;
  },

  getContrastColor(hex: string): string {
    return this.isColorLight(hex) ? '#000000' : '#FFFFFF';
  },

  getComplementaryColor(hex: string): string {
    const rgb = this.hexToRgb(hex);
    if (!rgb) return hex;

    // Convert to HSL
    const hsl = this.rgbToHsl(rgb.r, rgb.g, rgb.b);
    
    // Rotate hue by 180 degrees
    hsl.h = (hsl.h + 180) % 360;

    // Convert back to RGB
    const { r, g, b } = this.hslToRgb(hsl.h, hsl.s, hsl.l);
    return this.rgbToHex(r, g, b);
  },

  hslToRgb(h: number, s: number, l: number): RGB {
    h /= 360;
    s /= 100;
    l /= 100;

    let r: number, g: number, b: number;

    if (s === 0) {
      r = g = b = l;
    } else {
      const hue2rgb = (p: number, q: number, t: number) => {
        if (t < 0) t += 1;
        if (t > 1) t -= 1;
        if (t < 1/6) return p + (q - p) * 6 * t;
        if (t < 1/2) return q;
        if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
        return p;
      };

      const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      const p = 2 * l - q;

      r = hue2rgb(p, q, h + 1/3);
      g = hue2rgb(p, q, h);
      b = hue2rgb(p, q, h - 1/3);
    }

    return {
      r: Math.round(r * 255),
      g: Math.round(g * 255),
      b: Math.round(b * 255),
    };
  },

  // Common color palettes
  palettes: {
    primary: {
      main: '#007AFF',
      light: '#5AA9FF',
      dark: '#004C99',
      contrast: '#FFFFFF',
    },
    secondary: {
      main: '#5856D6',
      light: '#8684E3',
      dark: '#3634A8',
      contrast: '#FFFFFF',
    },
    success: {
      main: '#34C759',
      light: '#70D98B',
      dark: '#1F7A36',
      contrast: '#FFFFFF',
    },
    error: {
      main: '#FF3B30',
      light: '#FF7B73',
      dark: '#CC2F26',
      contrast: '#FFFFFF',
    },
    warning: {
      main: '#FFCC00',
      light: '#FFDB4D',
      dark: '#CC9900',
      contrast: '#000000',
    },
    grey: {
      100: '#F2F2F7',
      200: '#E5E5EA',
      300: '#C7C7CC',
      400: '#8E8E93',
      500: '#636366',
      600: '#48484A',
      700: '#3A3A3C',
      800: '#2C2C2E',
      900: '#1C1C1E',
    },
  },
}; 