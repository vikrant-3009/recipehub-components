import { Component, Event, EventEmitter, h, Prop } from '@stencil/core';
import { RecipeCategory } from '../../models/recipe-category';

@Component({
  tag: 'recipehub-category-grid',
  styleUrl: 'recipehub-category-grid.css',
  shadow: true,
})
export class RecipehubCategoryGrid {
  @Prop() categories: string = '';

  @Event() categorySelect: EventEmitter<string>;

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

  render() {
    const categories = this.getCategories();

    if (categories.length === 0) {
      return (
        <div class="empty-state">
          <p>No categories available.</p>
        </div>
      );
    }

    return (
      <div class="category-grid">
        {categories.map(category => (
          <recipehub-category-card
            categoryId={category.id}
            name={category.name}
            imageSrc={category.imageSrc}
            onCategorySelect={event => this.handleCategorySelect(event)}
          ></recipehub-category-card>
        ))}
      </div>
    );
  }
}
