import { Component, Event, EventEmitter, Prop, State, h } from '@stencil/core';

@Component({
  tag: 'recipehub-hero',
  styleUrl: 'recipehub-hero.css',
  shadow: true,
})
export class RecipehubHero {
  @Prop() heroTitle: string = 'Demo Title';

  @Prop() placeholder: string = 'Search placeholder...';

  @Prop() buttonLabel: string = 'Search';

  @Prop() initialValue: string = '';

  @State() searchValue: string = '';

  @Event() searchSubmit: EventEmitter<string>;

  @Event() searchClear: EventEmitter<void>;

  componentWillLoad() {
    this.searchValue = this.initialValue;
  }

  private handleInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.searchValue = input.value;
  }

  private handleSubmit(event: Event): void {
    event.preventDefault();
    const searchValue = this.searchValue.trim();
    if (!searchValue) {
      return;
    }
    this.searchSubmit.emit(searchValue);
  }

  private handleKeyDown(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      event.preventDefault();
      this.submitSearch();
    }
  }

  private submitSearch(): void {
    const searchValue = this.searchValue.trim();
    if (!searchValue) {
      return;
    }
    this.searchSubmit.emit(searchValue);
  }

  private handleClear(): void {
    this.searchValue = '';
    this.searchClear.emit();
  }

  render() {
    return (
      <section class="hero">
        <div class="hero-container">
          <h1 class="hero-title">{this.heroTitle}</h1>

          <form class="search-form" role="search" onSubmit={event => this.handleSubmit(event)}>
            <div class="search-input-container">
              {/* <img src="/assets/search-icon.svg" alt="Search Icon" class="search-icon" /> */}
              <svg class="search-icon" viewBox="0 0 24 24" aria-hidden="true">
                <circle cx="11" cy="11" r="7" />
                <path d="M20 20l-4-4" />
              </svg>
              <input
                type="search"
                class="search-input"
                value={this.searchValue}
                placeholder={this.placeholder}
                aria-label="Search recipes"
                autocomplete="off"
                onInput={event => this.handleInput(event)}
                onKeyDown={event => this.handleKeyDown(event)}
              />
              {this.searchValue && (
                <button type="button" class="clear-search-button" aria-label="Clear search" onClick={() => this.handleClear()}>
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M6 6l12 12" />
                    <path d="M18 6L6 18" />
                  </svg>
                </button>
              )}
              <button type="submit" class="search-button">
                {this.buttonLabel}
              </button>
            </div>
          </form>
        </div>
      </section>
    );
  }
}
