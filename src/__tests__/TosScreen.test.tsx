import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, firePress } from './test-utils';
import { TosScreen } from '../pages/TosScreen';

describe('TosScreen', () => {
  it('should render title', async () => {
    const { getByText } = await render(
      <TosScreen onAccept={vi.fn()} onCancel={vi.fn()} />
    );

    expect(getByText('Terms of Service')).toBeTruthy();
  });

  it('should render all section headings', async () => {
    const { getByText } = await render(
      <TosScreen onAccept={vi.fn()} onCancel={vi.fn()} />
    );

    expect(getByText('1. Acceptance of Terms')).toBeTruthy();
    expect(getByText('2. Use of Service')).toBeTruthy();
    expect(getByText('3. Vendor Responsibilities')).toBeTruthy();
    expect(getByText('4. Privacy')).toBeTruthy();
    expect(getByText('5. Limitation of Liability')).toBeTruthy();
  });

  it('should render cancel and accept buttons', async () => {
    const { getByText } = await render(
      <TosScreen onAccept={vi.fn()} onCancel={vi.fn()} />
    );

    expect(getByText('Cancel')).toBeTruthy();
    expect(getByText('Accept & Continue')).toBeTruthy();
  });

  it('should show loading text when isLoading is true', async () => {
    const { getByText, queryByText } = await render(
      <TosScreen onAccept={vi.fn()} onCancel={vi.fn()} isLoading />
    );

    expect(getByText('Please wait...')).toBeTruthy();
    expect(queryByText('Accept & Continue')).toBeNull();
  });

  it('should call onAccept when accept button is pressed', async () => {
    const onAccept = vi.fn();
    const { getByText } = await render(
      <TosScreen onAccept={onAccept} onCancel={vi.fn()} />
    );

    firePress(getByText('Accept & Continue'));
    expect(onAccept).toHaveBeenCalledOnce();
  });

  it('should call onCancel when cancel button is pressed', async () => {
    const onCancel = vi.fn();
    const { getByText } = await render(
      <TosScreen onAccept={vi.fn()} onCancel={onCancel} />
    );

    firePress(getByText('Cancel'));
    expect(onCancel).toHaveBeenCalledOnce();
  });

  it('should render body content', async () => {
    const { queryByText } = await render(
      <TosScreen onAccept={vi.fn()} onCancel={vi.fn()} />
    );

    expect(queryByText(/Welcome to Tapayoka/)).toBeTruthy();
  });
});
