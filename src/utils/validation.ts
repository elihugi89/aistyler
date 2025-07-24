export const validation = {
  email(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },

  password(password: string): {
    isValid: boolean;
    errors: string[];
  } {
    const errors: string[] = [];

    if (password.length < 8) {
      errors.push('Password must be at least 8 characters long');
    }
    if (!/[A-Z]/.test(password)) {
      errors.push('Password must contain at least one uppercase letter');
    }
    if (!/[a-z]/.test(password)) {
      errors.push('Password must contain at least one lowercase letter');
    }
    if (!/[0-9]/.test(password)) {
      errors.push('Password must contain at least one number');
    }
    if (!/[!@#$%^&*]/.test(password)) {
      errors.push('Password must contain at least one special character (!@#$%^&*)');
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  },

  username(username: string): {
    isValid: boolean;
    errors: string[];
  } {
    const errors: string[] = [];

    if (username.length < 3) {
      errors.push('Username must be at least 3 characters long');
    }
    if (username.length > 20) {
      errors.push('Username must be less than 20 characters long');
    }
    if (!/^[a-zA-Z0-9_]+$/.test(username)) {
      errors.push('Username can only contain letters, numbers, and underscores');
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  },

  imageUrl(url: string): boolean {
    const imageRegex = /\.(jpg|jpeg|png|gif|webp)$/i;
    return imageRegex.test(url);
  },

  required(value: any): boolean {
    if (typeof value === 'string') {
      return value.trim().length > 0;
    }
    if (Array.isArray(value)) {
      return value.length > 0;
    }
    return value !== null && value !== undefined;
  },

  maxLength(value: string, max: number): boolean {
    return value.length <= max;
  },

  minLength(value: string, min: number): boolean {
    return value.length >= min;
  },

  number(value: string): boolean {
    return !isNaN(Number(value));
  },

  integer(value: string): boolean {
    return Number.isInteger(Number(value));
  },

  positiveNumber(value: string): boolean {
    const num = Number(value);
    return !isNaN(num) && num > 0;
  },

  url(value: string): boolean {
    try {
      new URL(value);
      return true;
    } catch {
      return false;
    }
  },

  phone(value: string): boolean {
    const phoneRegex = /^\+?[\d\s-]{10,}$/;
    return phoneRegex.test(value);
  },

  date(value: string): boolean {
    const date = new Date(value);
    return date instanceof Date && !isNaN(date.getTime());
  },

  futureDate(value: string): boolean {
    const date = new Date(value);
    const now = new Date();
    return date instanceof Date && !isNaN(date.getTime()) && date > now;
  },

  pastDate(value: string): boolean {
    const date = new Date(value);
    const now = new Date();
    return date instanceof Date && !isNaN(date.getTime()) && date < now;
  },
}; 