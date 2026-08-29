# [RecipeHub UI Components](https://github.com/vikrant-3009/recipehub-components)

A reusable Web Component library built with [Stencil](https://stenciljs.com/) for the **RecipeHub – Recipe Finder & Meal Planner** application.

The library provides reusable UI components for recipe discovery, recipe details, favorites, custom recipes, and weekly meal planning.

The components are standard Web Components, so they can be consumed by applications built with SvelteKit, React, Angular, Vue, or plain JavaScript. Stencil's distribution model supports publishing the component library to npm and consuming the generated loader from applications.

## Published NPM Package

**npm:** [`@vikrantkatoch/recipehub-ui-components`](https://www.npmjs.com/package/@vikrantkatoch/recipehub-ui-components?activeTab=code)

## Installation

Install the package from npm:

```bash
npm install @vikrantkatoch/recipehub-ui-components
```

## Usage with SvelteKit

RecipeHub UI Components can be registered using the generated Stencil loader.

In your SvelteKit `+layout.svelte`:

```svelte
<script lang="ts">
	import { onMount } from 'svelte';

	onMount(async () => {
		const { defineCustomElements } =
			await import(
				'@vikrantkatoch/recipehub-ui-components/loader'
			);

		defineCustomElements();
	});
</script>

<slot />
```

Once the components are registered, they can be used directly in Svelte templates.

For example:

```svelte
<recipehub-header />

<recipehub-recipe-card
	recipe={JSON.stringify(recipe)}
></recipehub-recipe-card>
```

## Available Components

### Layout & Navigation

* `recipehub-header`
* `recipehub-footer`
* `recipehub-hero`

### Categories & Cuisines

* `recipehub-category-section`
* `recipehub-category-chip`
* `recipehub-category-grid`
* `recipehub-cuisine-section`
* `recipehub-cuisine-chip`

### Recipes

* `recipehub-recipe-card`
* `recipehub-recipe-details`
* `recipehub-recipe-form`

### Favorites & User Recipes

The recipe components support favorite actions and custom recipe workflows through component properties and events.

### Weekly Meal Planner

* `recipehub-meal-planner`
* `recipehub-meal-plan-day`
* `recipehub-planned-recipe`
* `recipehub-recipe-picker`

These components work together to provide the weekly meal-planning interface.

## Component Events

Interactive components expose custom events so that the consuming application can handle navigation and application-specific behavior.

Examples include:

```text
recipeSelect
favoriteClick
editClick
deleteClick
categorySelect
cuisineSelect
viewMore
addRecipe
removeRecipe
previousWeek
nextWeek
addToMealPlan
```

The components emit events but do not contain application-specific routing or persistence logic.

For example, a recipe card can emit:

```text
recipeSelect
```

and the consuming SvelteKit application can decide whether to navigate to:

```text
/recipes/:id
```

or:

```text
/my-recipes/:id
```

This keeps the component library reusable across applications.

## Recipe Data

Recipe-related components accept JSON-serialized data when complex objects are passed through HTML attributes.

For example:

```svelte
<recipehub-recipe-card
	recipe={JSON.stringify(recipe)}
></recipehub-recipe-card>
```

A recipe can contain information such as:

```ts
interface Recipe {
	id: string;
	name: string;
	category: string;
	area: string;
	image: string;
	description: string;
	ingredients: RecipeIngredient[];
	instructions: string;
	youtubeUrl: string;
}
```

## Example

A simple recipe grid can be implemented using:

```svelte
<div class="recipe-grid">
	{#each recipes as recipe}
		<recipehub-recipe-card
			recipe={JSON.stringify(recipe)}
			show-favorite={true}
		/>
	{/each}
</div>
```

Handle component events in the consuming application:

```svelte
<recipehub-recipe-card
	recipe={JSON.stringify(recipe)}
	onrecipeSelect={handleRecipeSelect}
	onfavoriteClick={handleFavoriteClick}
/>
```

## Weekly Meal Planner

The meal planner is composed of multiple reusable components:

```text
recipehub-meal-planner
        │
        ├── recipehub-meal-plan-day
        │       │
        │       └── recipehub-planned-recipe
        │
        └── recipehub-recipe-picker
```

The consuming application is responsible for:

* Maintaining the weekly meal-plan state
* Persisting planned meals
* Loading recipes
* Navigating to recipe details
* Adding and removing meals
* Managing application-specific business rules

The Stencil components provide the reusable presentation and interaction layer.

## Development

Clone the repository:

```bash
git clone https://github.com/vikrant-3009/recipehub-components.git
cd recipehub-components
```

Install dependencies:

```bash
npm install
```

Start the Stencil development server:

```bash
npm run start
```

Build the component library:

```bash
npm run build
```

Run tests:

```bash
npm run test
```

Stencil's component-library workflow uses the generated distribution output for publishing and consumption by other applications.

## Publishing

Build the library before publishing:

```bash
npm run build
```

Update the package version:

```bash
npm version patch
```

Publish the package:

```bash
npm publish --access public
```

For example:

```text
1.0.0 → 1.0.1
```

Applications using the package can then update to the new version:

```bash
npm install @vikrantkatoch/recipehub-ui-components@latest
```

The README displayed on npm is taken from the package's root `README.md` and is updated when a new package version is published.

## License

MIT
