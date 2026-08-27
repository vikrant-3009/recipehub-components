# recipehub-planned-recipe



<!-- Auto Generated Below -->


## Properties

| Property              | Attribute               | Description | Type     | Default |
| --------------------- | ----------------------- | ----------- | -------- | ------- |
| `placeholderImageSrc` | `placeholder-image-src` |             | `string` | `''`    |
| `recipe`              | `recipe`                |             | `string` | `''`    |


## Events

| Event          | Description | Type                        |
| -------------- | ----------- | --------------------------- |
| `recipeSelect` |             | `CustomEvent<MealPlanItem>` |
| `removeRecipe` |             | `CustomEvent<string>`       |


## Dependencies

### Used by

 - [recipehub-meal-plan-day](../recipehub-meal-plan-day)

### Graph
```mermaid
graph TD;
  recipehub-meal-plan-day --> recipehub-planned-recipe
  style recipehub-planned-recipe fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
