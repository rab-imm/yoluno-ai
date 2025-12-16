const COMMON_PINS = ['0000', '1111', '2222', '3333', '4444', '5555', '6666', '7777', '8888', '9999', '1234', '4321', '1212', '0123'];

export function validatePIN(pin: string): { valid: boolean; error?: string } {
  if (pin.length !== 4) {
    return { valid: false, error: 'PIN must be exactly 4 digits' };
  }
  
  if (!/^\d{4}$/.test(pin)) {
    return { valid: false, error: 'PIN must contain only numbers' };
  }
  
  if (COMMON_PINS.includes(pin)) {
    return { valid: false, error: 'This PIN is too common. Choose a different one.' };
  }
  
  // Check for sequential ascending
  const isSequentialAsc = pin.split('').every((digit, i, arr) => {
    if (i === 0) return true;
    return parseInt(digit) === parseInt(arr[i-1]) + 1;
  });
  
  // Check for sequential descending
  const isSequentialDesc = pin.split('').every((digit, i, arr) => {
    if (i === 0) return true;
    return parseInt(digit) === parseInt(arr[i-1]) - 1;
  });
  
  if (isSequentialAsc || isSequentialDesc) {
    return { valid: false, error: 'PIN cannot be sequential numbers' };
  }
  
  // Check for all same digits
  if (new Set(pin.split('')).size === 1) {
    return { valid: false, error: 'PIN cannot be all the same digit' };
  }
  
  return { valid: true };
}
