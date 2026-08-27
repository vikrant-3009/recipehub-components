import { Component, Event, EventEmitter, Prop, h } from '@stencil/core';
import { RecipeCategory } from '../../models/recipe-category';

@Component({
  tag: 'recipehub-category-section',
  styleUrl: 'recipehub-category-section.css',
  shadow: true,
})
export class RecipehubCategorySection {
  @Prop() categoryTitle: string = 'Explore Categories';

  @Prop() categories: string = '';

  @Prop() visibleCount: number = 6;

  @Prop() showViewMore: boolean = true;

  @Event() categorySelect: EventEmitter<string>;

  @Event() viewMore: EventEmitter<void>;

  private getCategories(): RecipeCategory[] {
    if (!this.categories) {
      return [];
    }
    try {
      const parsedCategories = JSON.parse(this.categories);
      if (!Array.isArray(parsedCategories)) {
        console.error('recipehub-category-section: categories must be a JSON array');
        return [];
      }
      return parsedCategories as RecipeCategory[];
    } catch (error) {
      console.error('recipehub-category-section: Invalid categories JSON', error);
      return [];
    }
  }

  private handleCategorySelect(event: CustomEvent<string>): void {
    this.categorySelect.emit(event.detail);
  }

  private handleViewMore(): void {
    this.viewMore.emit();
  }

  render() {
    const categories = this.getCategories();
    const visibleCategories = this.visibleCount > 0 ? categories.slice(0, this.visibleCount) : categories;

    return (
      <section class="category-section">
        <div class="section-container">
          <div class="section-header">
            <h2 class="section-title">{this.categoryTitle}</h2>

            {this.showViewMore && categories.length >= this.visibleCount && (
              <button type="button" class="view-more-button" onClick={() => this.handleViewMore()}>
                View More
                <svg class="view-more-icon" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M9 18l6-6-6-6" />
                </svg>
              </button>
            )}
          </div>

          {visibleCategories.length > 0 ? (
            <div class="category-list">
              {visibleCategories.map(category => (
                <recipehub-category-chip
                  categoryId={category.id}
                  name={category.name}
                  onCategorySelect={event => this.handleCategorySelect(event)}
                ></recipehub-category-chip>
              ))}
            </div>
          ) : (
            <div class="empty-state">
              <p>No categories available.</p>
            </div>
          )}
        </div>
      </section>
    );
  }
}
