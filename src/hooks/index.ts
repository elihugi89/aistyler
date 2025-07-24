export * from './useAnimation';
export * from './useAppState';
export * from './useImageUpload';

import { useCallback, useEffect, useRef, useState } from 'react';
import { Dimensions, ScaledSize } from 'react-native';

export const useDebounce = <T>(value: T, delay: number): T => {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

export const useWindowDimensions = () => {
  const [dimensions, setDimensions] = useState(() => Dimensions.get('window'));

  useEffect(() => {
    const subscription = Dimensions.addEventListener('change', ({ window }) => {
      setDimensions(window);
    });

    return () => subscription.remove();
  }, []);

  return dimensions;
};

export const useInterval = (callback: () => void, delay: number | null) => {
  const savedCallback = useRef(callback);

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    if (delay === null) return;
    const id = setInterval(() => savedCallback.current(), delay);
    return () => clearInterval(id);
  }, [delay]);
};

export const useMount = (callback: () => void) => {
  useEffect(() => {
    callback();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
};

export const useUnmount = (callback: () => void) => {
  useEffect(() => {
    return () => callback();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
};

export const useUpdateEffect = (
  callback: () => void,
  dependencies: any[]
) => {
  const firstRenderRef = useRef(true);

  useEffect(() => {
    if (firstRenderRef.current) {
      firstRenderRef.current = false;
      return;
    }
    return callback();
  }, dependencies); // eslint-disable-line react-hooks/exhaustive-deps
};

export const usePrevious = <T>(value: T): T | undefined => {
  const ref = useRef<T>();
  useEffect(() => {
    ref.current = value;
  }, [value]);
  return ref.current;
};

export const useBoolean = (
  initialValue: boolean = false
): [boolean, { toggle: () => void; setTrue: () => void; setFalse: () => void }] => {
  const [value, setValue] = useState(initialValue);

  const toggle = useCallback(() => setValue(v => !v), []);
  const setTrue = useCallback(() => setValue(true), []);
  const setFalse = useCallback(() => setValue(false), []);

  return [value, { toggle, setTrue, setFalse }];
};

export const useCounter = (
  initialValue: number = 0,
  options: { min?: number; max?: number } = {}
) => {
  const { min, max } = options;
  const [count, setCount] = useState(initialValue);

  const increment = useCallback(() => {
    setCount(currentCount => {
      if (max !== undefined && currentCount >= max) return currentCount;
      return currentCount + 1;
    });
  }, [max]);

  const decrement = useCallback(() => {
    setCount(currentCount => {
      if (min !== undefined && currentCount <= min) return currentCount;
      return currentCount - 1;
    });
  }, [min]);

  const reset = useCallback(() => setCount(initialValue), [initialValue]);

  return { count, increment, decrement, reset };
}; 