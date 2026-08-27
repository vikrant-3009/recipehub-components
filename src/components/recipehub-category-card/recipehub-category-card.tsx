import { Component, Event, EventEmitter, Prop, h } from '@stencil/core';

@Component({
  tag: 'recipehub-category-card',
  styleUrl: 'recipehub-category-card.css',
  shadow: true,
})
export class RecipehubCategoryCard {

  @Prop() categoryId: string = '';

  @Prop() name: string = '';

  @Prop() imageSrc: string = '';

  @Prop() description: string = '';

  @Event() categorySelect: EventEmitter<string>;

  private handleClick(): void {
    this.categorySelect.emit(this.name);
  }

  render() {
    return (
      <button
        type="button"
        class="category-card"
        aria-label={`View ${this.name} recipes`}
        onClick={() => this.handleClick()}
      >
        <div class="image-container">
          {this.imageSrc ? (
            <img
              src={this.imageSrc}
              alt={this.name}
              class="category-image"
              loading="lazy"
            />
          ) : (
            <div class="image-placeholder" aria-hidden="true">
              <span>{this.name ? this.name.charAt(0) : '?'}</span>
            </div>
          )}
        </div>

        <div class="category-content">
          <h3 class="category-name">
            {this.name}
          </h3>
          {/* {this.description && (
            <p class="category-description">
              {this.description}
            </p>
          )} */}
        </div>
      </button>
    );
  }
}
