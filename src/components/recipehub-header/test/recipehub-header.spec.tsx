import { newSpecPage } from '@stencil/core/testing';
import { RecipehubHeader } from '../recipehub-header';
import { describe, expect, it } from 'vitest';

describe('recipehub-header', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [RecipehubHeader],
      html: `<recipehub-header></recipehub-header>`,
    });
    expect(page.root).toEqualHtml(`
      <recipehub-header>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </recipehub-header>
    `);
  });
});
