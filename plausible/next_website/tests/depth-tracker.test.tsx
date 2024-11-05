import React from 'react'
import { act, fireEvent, render } from '@testing-library/react';
import { vi, describe, afterEach, beforeEach, expect, it } from 'vitest';
import { usePlausible } from 'next-plausible';
import ScrollDepthTracker from '../components/depth-tracker';
import ClientApplication from '../components/client-pages-root';
import LongPage from '../pages/long-page';

// Mock the usePlausible hook
vi.mock('next-plausible', () => ({
  usePlausible: vi.fn(),
}));

describe('ScrollDepthTracker', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.clearAllMocks();
    vi.useRealTimers();
  });
  

  it('expect `usePlausible` hook to have been called', async () => {
    act(() => {
      render(<ScrollDepthTracker />);
    });
    // Simulate scroll event
    await fireEvent.scroll(window, { target: { scrollY: 300 } });

    // Fast-forward time to trigger the debounce
    vi.advanceTimersByTime(2000);
    expect(usePlausible).toHaveBeenCalled();
  });
  

  it('expect ClientApplication wrapper to be defined', async () => {
    act(() => {
      render(<ClientApplication><LongPage/></ClientApplication>);
    });
    // Simulate scroll event
    await fireEvent.scroll(window, { target: { scrollY: 1000 } });

    // Fast-forward time to trigger the debounce
    vi.advanceTimersByTime(3000);
    expect(usePlausible).toHaveBeenCalled();
  });

});