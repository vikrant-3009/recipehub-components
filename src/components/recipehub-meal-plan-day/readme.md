# recipehub-meal-plan-day



<!-- Auto Generated Below -->


## Properties

| Property              | Attribute               | Description | Type                                                                                       | Default    |
| --------------------- | ----------------------- | ----------- | ------------------------------------------------------------------------------------------ | ---------- |
| `date`                | `date`                  |             | `string`                                                                                   | `''`       |
| `dayName`             | `day-name`              |             | `"Friday" \| "Monday" \| "Saturday" \| "Sunday" \| "Thursday" \| "Tuesday" \| "Wednesday"` | `'Sunday'` |
| `meals`               | `meals`                 |             | `string`                                                                                   | `'[]'`     |
| `placeholderImageSrc` | `placeholder-image-src` |             | `string`                                                                                   | `''`       |


## Events

| Event          | Description | Type                           |
| -------------- | ----------- | ------------------------------ |
| `addRecipe`    |             | `CustomEvent<string>`          |
| `recipeSelect` |             | `CustomEvent<MealPlanItem>`    |
| `removeRecipe` |             | `CustomEvent<RemoveMealEvent>` |


## Dependencies

### Used by

 - [recipehub-meal-planner](../recipehub-meal-planner)

### Depends on

- [recipehub-planned-recipe](../recipehub-planned-recipe)

### Graph
```mermaid
graph TD;
  recipehub-meal-plan-day --> recipehub-planned-recipe
  recipehub-meal-planner --> recipehub-meal-plan-day
  style recipehub-meal-plan-day fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
