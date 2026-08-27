import { Component, Event, EventEmitter, Prop, h } from '@stencil/core';
import { RecipeCuisine } from '../../models/recipe-cuisine';

@Component({
  tag: 'recipehub-cuisine-section',
  styleUrl: 'recipehub-cuisine-section.css',
  shadow: true,
})
export class RecipehubCuisineSection {
  @Prop() cuisineTitle: string = 'Explore Cuisines';

  @Prop() cuisines: string = '';

  @Prop() visibleCount: number = 6;

  @Prop() showViewMore: boolean = true;

  @Event() cuisineSelect: EventEmitter<RecipeCuisine>;

  @Event() viewMore: EventEmitter<void>;

  private getCuisines(): RecipeCuisine[] {
    if (!this.cuisines) {
      return [];
    }
    try {
      const parsedCuisines = JSON.parse(this.cuisines);
      if (!Array.isArray(parsedCuisines)) {
        console.error('recipehub-cuisine-section: cuisines must be a JSON array');
        return [];
      }
      return parsedCuisines as RecipeCuisine[];
    } catch (error) {
      console.error('recipehub-cuisines-section: Invalid cuisines JSON', error);
      return [];
    }
  }

  private handleCuisineSelect(event: CustomEvent<RecipeCuisine>): void {
    this.cuisineSelect.emit(event.detail);
  }

  private handleViewMore(): void {
    this.viewMore.emit();
  }

  render() {
    const cuisines = this.getCuisines();
    const visibleCuisines = this.visibleCount > 0 ? cuisines.slice(0, this.visibleCount) : cuisines;

    return (
      <section class="cuisine-section">
        <div class="section-container">
          <div class="section-header">
            <h2 class="section-title">{this.cuisineTitle}</h2>

            {this.showViewMore && cuisines.length >= this.visibleCount && (
              <button type="button" class="view-more-button" onClick={() => this.handleViewMore()}>
                View More
                <svg class="view-more-icon" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M9 18l6-6-6-6" />
                </svg>
              </button>
            )}
          </div>

          {visibleCuisines.length > 0 ? (
            <div class="cuisine-list">
              {visibleCuisines.map(cuisine => (
                <recipehub-cuisine-chip
                  cuisineData={cuisine}
                  onCuisineSelect={event => this.handleCuisineSelect(event)}
                ></recipehub-cuisine-chip>
              ))}
            </div>
          ) : (
            <div class="empty-state">
              <p>No cuisines available.</p>
            </div>
          )}
        </div>
      </section>
    );
  }
}
