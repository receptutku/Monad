import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { formatEther, formatUnits } from 'ethers';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatAddress(address: string): string {
  if (!address) return '';
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

export function formatTime(seconds: number): string {
  if (seconds <= 0) return '00:00:00';
  
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);
  
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

export function formatTimeShort(seconds: number): string {
  if (seconds <= 0) return '0s';
  
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);
  
  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  } else if (minutes > 0) {
    return `${minutes}m ${secs}s`;
  } else {
    return `${secs}s`;
  }
}

export function formatPrice(price: string, decimals: number = 18): string {
  try {
    const formatted = formatEther(price);
    const num = parseFloat(formatted);
    return num.toFixed(4);
  } catch {
    return '0.0000';
  }
}

export function formatTokenAmount(amount: string, decimals: number = 18): string {
  try {
    const formatted = formatUnits(amount, decimals);
    const num = parseFloat(formatted);
    return num.toFixed(2);
  } catch {
    return '0.00';
  }
}

export function calculateEthAmount(amountMonad: string, price: string): string {
  try {
    const amount = BigInt(amountMonad);
    const priceBigInt = BigInt(price);
    const result = (amount * priceBigInt) / BigInt(10 ** 18);
    return result.toString();
  } catch {
    return '0';
  }
}

export function generateSalt(): string {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
}

export function getPhaseColor(phase: string): string {
  switch (phase) {
    case 'COMMIT':
      return 'bg-blue-100 text-blue-800 border-blue-200';
    case 'REVEAL':
      return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    case 'FINALIZE':
      return 'bg-green-100 text-green-800 border-green-200';
    case 'SETTLED':
      return 'bg-gray-100 text-gray-800 border-gray-200';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
}

export function getPhaseIcon(phase: string): string {
  switch (phase) {
    case 'COMMIT':
      return 'Lock';
    case 'REVEAL':
      return 'Eye';
    case 'FINALIZE':
      return 'CheckCircle';
    case 'SETTLED':
      return 'Archive';
    default:
      return 'Clock';
  }
}

