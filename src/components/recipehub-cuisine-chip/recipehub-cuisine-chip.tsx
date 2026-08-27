import { Component, Event, EventEmitter, Prop, h } from '@stencil/core';
import { RecipeCuisine } from '../../models/recipe-cuisine';

@Component({
  tag: 'recipehub-cuisine-chip',
  styleUrl: 'recipehub-cuisine-chip.css',
  shadow: true,
})
export class RecipehubCuisineChip {
  @Prop() cuisineData: RecipeCuisine = {
    id: '',
    name: '',
    area: '',
    country: ''
  };

  @Event() cuisineSelect: EventEmitter<RecipeCuisine>;

  private handleClick(): void {
    this.cuisineSelect.emit(this.cuisineData);
  }

  render() {
    return (
      <button type="button" class="cuisine-chip" onClick={() => this.handleClick()}>
        {this.cuisineData.name}
      </button>
    );
  }
}
