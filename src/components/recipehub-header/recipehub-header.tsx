import { Component, Event, EventEmitter, Listen, Prop, State, h } from '@stencil/core';
import { NavigationItem } from '../../models/navigation-item';

@Component({
  tag: 'recipehub-header',
  styleUrl: 'recipehub-header.css',
  shadow: true,
})
export class RecipehubHeader {
  @Prop() brandTitle: string = 'RecipeHub';

  @Prop() logoSrc: string = '';

  @Prop() genericUserSrc: string = '';

  @Prop() activePage: string = 'discover';

  @Prop() navigationItems: string = '';

  @Prop() showNotifications: boolean = true;

  @Prop() showProfile: boolean = true;

  @Prop() showMobileMenu: boolean = true;

  @State() mobileMenuOpen: boolean = false;

  @Event() navigationChange: EventEmitter<string>;

  @Event() notificationIconClick: EventEmitter<void>;

  @Event() profileIconClick: EventEmitter<void>;

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

  private handleNotificationClick(): void {
    this.notificationIconClick.emit();
  }

  private handleProfileClick(): void {
    this.profileIconClick.emit();
  }

  private toggleMobileMenu(): void {
    this.mobileMenuOpen = !this.mobileMenuOpen;
  }

  private closeMobileMenu(): void {
    this.mobileMenuOpen = false;
  }

  @Listen('resize', { target: 'window' })
  handleWindowResize(): void {
    if (window.innerWidth > 768 && this.mobileMenuOpen) {
      this.closeMobileMenu();
    }
  }

  render() {
    const navigationItems = this.getNavigationItems();

    return (
      <header class="header">
        <div class="header-container">
          {/* Logo */}
          <div class="brand">
            <a href="/" class="brand-link">
              {this.logoSrc ? <img src={this.logoSrc} alt={`${this.brandTitle} Logo`} class="logo" /> : null}
              <span class="brand-title">{this.brandTitle}</span>
            </a>
          </div>

          {/* Desktop Navigation Links */}
          <nav class="navigation desktop-navigation" aria-label="Main navigation">
            {navigationItems.map(item => (
              <a
                key={item.id}
                href={item.href || '#'}
                class={{
                  'nav-link': true,
                  'active': this.activePage === item.value,
                }}
                aria-current={this.activePage === item.value ? 'page' : undefined}
                onClick={event => this.handleNavigation(event, item)}
              >
                {item.label}
              </a>
            ))}
          </nav>

          {/* Header Actions */}
          <div class="header-actions">
            {/* Mobile Navigation Menu Icon */}
            {this.showMobileMenu && (
              <button
                type="button"
                class="menu-toggle"
                // class={{
                //   'menu-button': true,
                //   'menu-open': this.mobileMenuOpen,
                // }}
                aria-label={this.mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
                aria-expanded={this.mobileMenuOpen ? 'true' : 'false'}
                aria-controls="mobile-navigation"
                onClick={() => this.toggleMobileMenu()}
              >
                {!this.mobileMenuOpen ? (
                  <svg class="menu-icon" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M4 6h16" />
                    <path d="M4 12h16" />
                    <path d="M4 18h16" />
                  </svg>
                ) : (
                  // <img src="/assets/hamburger-icon.svg" alt="Hamburger Icon" class="menu-icon" />
                  // <img src="/assets/close-icon.svg" alt="Close Icon" class="menu-icon" />
                  <svg class="menu-icon" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M6 6l12 12" />
                    <path d="M18 6L6 18" />
                  </svg>
                )}
              </button>
            )}

            {/* Notification */}
            {this.showNotifications && (
              <button type="button" class="notification-icon-btn icon-btn" aria-label="Notifications" onClick={() => this.handleNotificationClick()}>
                {/* <img src="/assets/bell-icon.svg" alt="Bell icon" class="btn-icon" /> */}
                <svg class="btn-icon notification-icon" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9" />
                  <path d="M10 21h4" />
                </svg>
              </button>
            )}

            {/* Profile */}
            {this.showProfile && (
              <button type="button" class="profile-icon-btn icon-btn" aria-label="Profile" onClick={() => this.handleProfileClick()}>
                {/* <img src="/assets/generic-user-icon.svg" alt="Profile icon" class="btn-icon profile-icon" /> */}
                {this.genericUserSrc ? (
                  <img src={this.genericUserSrc} alt="Profile" class="btn-icon profile-icon" />
                ) : (
                  <span class="profile-placeholder" aria-hidden="true">
                    ?
                  </span>
                )}
              </button>
            )}
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {this.showMobileMenu && (
          <nav
            id="mobile-navigation"
            class={{
              'mobile-navigation': true,
              'open': this.mobileMenuOpen,
            }}
            aria-label="Mobile navigation"
          >
            <div class="mobile-navigation-container">
              {navigationItems.map(item => (
                <a
                  key={item.id}
                  href={item.href || '#'}
                  class={{
                    'mobile-nav-link': true,
                    'active': this.activePage === item.value,
                  }}
                  aria-current={this.activePage === item.value ? 'page' : undefined}
                  onClick={event => this.handleNavigation(event, item)}
                >
                  <span class="mobile-nav-label">{item.label}</span>
                  <svg class="mobile-nav-arrow" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M9 18l6-6-6-6" />
                  </svg>
                </a>
              ))}
            </div>
          </nav>
        )}
      </header>
    );
  }
}
