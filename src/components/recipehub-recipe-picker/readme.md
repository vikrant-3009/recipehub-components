# recipehub-recipe-picker



<!-- Auto Generated Below -->


## Properties

| Property              | Attribute               | Description | Type                                                                                       | Default    |
| --------------------- | ----------------------- | ----------- | ------------------------------------------------------------------------------------------ | ---------- |
| `dayName`             | `day-name`              |             | `"Friday" \| "Monday" \| "Saturday" \| "Sunday" \| "Thursday" \| "Tuesday" \| "Wednesday"` | `'Sunday'` |
| `isLoading`           | `is-loading`            |             | `boolean`                                                                                  | `false`    |
| `open`                | `open`                  |             | `boolean`                                                                                  | `false`    |
| `placeholderImageSrc` | `placeholder-image-src` |             | `string`                                                                                   | `''`       |
| `recipes`             | `recipes`               |             | `string`                                                                                   | `'[]'`     |
| `searchValue`         | `search-value`          |             | `string`                                                                                   | `''`       |


## Events

| Event          | Description | Type                          |
| -------------- | ----------- | ----------------------------- |
| `close`        |             | `CustomEvent<void>`           |
| `recipeSelect` |             | `CustomEvent<RecipeCardData>` |
| `search`       |             | `CustomEvent<string>`         |


----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
