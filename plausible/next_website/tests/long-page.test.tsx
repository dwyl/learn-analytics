import React from 'react'
import { act, fireEvent, render } from '@testing-library/react';
import { vi, describe, expect, it } from 'vitest';
import LongPage from '../pages/long-page';

describe('ScrollDepthTracker', () => {

  it('long page exists', async () => {

    act(() => {
      render(<LongPage />);
    });
    // Simulate scroll event
    await fireEvent.scroll(window, { target: { scrollY: 300 } });

    // Fast-forward time to trigger the debounce
    vi.useFakeTimers()
    vi.advanceTimersByTime(2000);
    
    expect(window.scrollY).toBe(300);
  });

});