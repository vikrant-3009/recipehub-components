import { newE2EPage } from '@stencil/core/testing';
import { describe, expect, it } from 'vitest';

describe('recipehub-header', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<recipehub-header></recipehub-header>');

    const element = await page.find('recipehub-header');
    expect(element).toHaveClass('hydrated');
  });
});
