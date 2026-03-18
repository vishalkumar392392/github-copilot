import { describe, it, expect } from 'vitest';
import { cn } from '@/lib/utils';

describe('cn', () => {
  it('returns an empty string when called with no arguments', () => {
    expect(cn()).toBe('');
  });

  it('returns a single class name unchanged', () => {
    expect(cn('text-red-500')).toBe('text-red-500');
  });

  it('merges multiple class names', () => {
    expect(cn('px-4', 'py-2')).toBe('px-4 py-2');
  });

  it('handles conditional classes via clsx syntax', () => {
    expect(cn('base', false && 'hidden', 'extra')).toBe('base extra');
    expect(cn('base', true && 'visible')).toBe('base visible');
  });

  it('resolves tailwind conflicts — last class wins', () => {
    const result = cn('px-4', 'px-8');
    expect(result).toBe('px-8');
  });

  it('handles undefined and null inputs gracefully', () => {
    expect(cn(undefined, null, 'valid')).toBe('valid');
  });

  it('handles an empty string input', () => {
    expect(cn('', 'block')).toBe('block');
  });

  it('handles array inputs via clsx', () => {
    expect(cn(['px-2', 'py-2'])).toBe('px-2 py-2');
  });

  it('merges object-style conditional classes', () => {
    expect(cn({ 'bg-red-500': true, 'bg-blue-500': false })).toBe('bg-red-500');
  });

  it('resolves complex tailwind merge with variants', () => {
    const result = cn('hover:bg-red-500', 'hover:bg-blue-500');
    expect(result).toBe('hover:bg-blue-500');
  });

  it('handles mixed types (strings, arrays, objects)', () => {
    const result = cn('text-sm', ['font-bold'], { italic: true });
    expect(result).toBe('text-sm font-bold italic');
  });
});
