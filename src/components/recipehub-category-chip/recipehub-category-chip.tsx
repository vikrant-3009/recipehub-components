import { Component, Event, EventEmitter, Prop, h } from '@stencil/core';

@Component({
  tag: 'recipehub-category-chip',
  styleUrl: 'recipehub-category-chip.css',
  shadow: true,
})
export class RecipehubCategoryChip {
  @Prop() categoryId: string = '';

  @Prop() name: string = '';

  @Event() categorySelect: EventEmitter<string>;

  private handleClick(): void {
    this.categorySelect.emit(this.name);
  }

  render() {
    return (
      <button type="button" class="category-chip" onClick={() => this.handleClick()}>
        {this.name}
      </button>
    );
  }
}
