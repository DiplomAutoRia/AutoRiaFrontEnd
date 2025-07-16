import { useEffect, useMemo, useState } from 'react';

import debounce from 'lodash.debounce';

export function useDebounce(value: string, delay: number) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

interface IUseDebounceValidationProps {
  validate: (_value: string) => Promise<boolean>;
  successCallback?: () => void;
  errorCallback?: () => void;
}
export function useDebounceValidation({ validate, successCallback, errorCallback }: IUseDebounceValidationProps) {
  const [isValidating, setIsValidating] = useState(false);
  const [isFieldValid, setIsFieldValid] = useState(true);
  const [isTyping, setIsTyping] = useState(false);
  const debouncedValidate = useMemo(
    () =>
      debounce(async (value: string) => {
        setIsValidating(true);
        setIsTyping(false);
        try {
          const isValid = await validate(value);
          if (!isValid) {
            errorCallback?.();
            setIsFieldValid(false);
          } else {
            successCallback?.();
            setIsFieldValid(true);
          }
        } catch {
          errorCallback?.();
          setIsFieldValid(false);
        } finally {
          setIsValidating(false);
        }
      }, 1000),
    [validate],
  );

  return { isValidating, isFieldValid, isTyping, setIsTyping, debouncedValidate };
}
