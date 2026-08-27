import { Component, Event, EventEmitter, Prop, h } from '@stencil/core';
import { NavigationItem } from '../../models/navigation-item';

@Component({
  tag: 'recipehub-footer',
  styleUrl: 'recipehub-footer.css',
  shadow: true,
})
export class RecipehubFooter {
  @Prop() brandTitle: string = 'RecipeHub';

  @Prop() logoSrc: string = '';

  @Prop() description: string = 'Discover delicious recipes and plan your meals with ease.';

  @Prop() navigationItems: string = '';

  @Prop() copyrightText: string = '';

  @Prop() showPrivacyLink: boolean = true;

  @Prop() privacyLabel: string = 'Privacy Policy';

  @Prop() privacyHref: string = '/privacy';

  @Prop() showTermsLink: boolean = false;

  @Prop() termsLabel: string = 'Terms of Service';

  @Prop() termsHref: string = '/terms';

  @Event() navigationChange: EventEmitter<string>;

  @Event() privacyClick: EventEmitter<void>;

  @Event() termsClick: EventEmitter<void>;

  private getNavigationItems(): NavigationItem[] {
    if (!this.navigationItems) {
      return [];
    }
    try {
      const items = JSON.parse(this.navigationItems);
      if (!Array.isArray(items)) {
        console.error('recipehub-header: navigation-items must be a JSON array');
        return [];
      }
      return items;
    } catch (error) {
      console.error('recipehub-header: Invalid navigation-items JSON', error);
      return [];
    }
  }

  private handleNavigation(event: MouseEvent, item: NavigationItem): void {
    event.preventDefault();
    this.navigationChange.emit(item.value);
  }

  private handlePrivacyClick(event: MouseEvent): void {
    event.preventDefault();
    this.privacyClick.emit();
  }

  private handleTermsClick(event: MouseEvent): void {
    event.preventDefault();
    this.termsClick.emit();
  }

  private getCopyrightText(): string {
    if (this.copyrightText) {
      return this.copyrightText;
    }
    return `© ${new Date().getFullYear()} ${this.brandTitle}. All rights reserved.`;
  }

  render() {
    const navigationItems = this.getNavigationItems();

    return (
      <footer class="footer">
        <div class="footer-container">
          {/* Main Footer Content */}
          <div class="footer-main">
            {/* Brand */}
            <div class="footer-brand">
              <a href="/" class="brand-link">
                {this.logoSrc ? <img src={this.logoSrc} alt={`${this.brandTitle} Logo`} class="logo" /> : null}
                <span class="brand-title">{this.brandTitle}</span>
              </a>
              {this.description && <p class="description">{this.description}</p>}
            </div>
            {/* Navigation */}
            {navigationItems.length > 0 && (
              <nav class="footer-navigation" aria-label="Footer navigation">
                {navigationItems.map(item => (
                  <a href={item.href || '#'} class="footer-link" onClick={event => this.handleNavigation(event, item)}>
                    {item.label}
                  </a>
                ))}
              </nav>
            )}
          </div>

          {/* Footer Bottom */}
          <div class="footer-bottom">
            <p class="copyright">{this.getCopyrightText()}</p>

            <div class="legal-links">
              {this.showPrivacyLink && (
                <a href={this.privacyHref} class="legal-link" onClick={event => this.handlePrivacyClick(event)}>
                  {this.privacyLabel}
                </a>
              )}

              {this.showTermsLink && (
                <a href={this.termsHref} class="legal-link" onClick={event => this.handleTermsClick(event)}>
                  {this.termsLabel}
                </a>
              )}
            </div>
          </div>
        </div>
      </footer>
    );
  }
}
