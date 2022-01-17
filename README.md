# Vue 3 Slide Fade

Quick and dirty fork of Craig Riley's [`vue3-slide-up-down`](https://github.com/craigrileyuk/vue3-slide-up-down.git)  
Added optional fade in / fade out support

Regarding transitions, you might also take a look at ['Vâlvă'](https://github.com/I-is-as-I-does/Valva)  
You'll find a Vue 3 component in ['src/vue'](https://github.com/I-is-as-I-does/Valva/tree/main/src/vue)

## Usage

The component takes 8 props:  

| name           | type    | required | description                                        | default       |
| -------------- | ------- | -------- | -------------------------------------------------- | ------------- |
| v-model*       | boolean | yes      | Whether to show the component or not               | N/A           |
| fade           | boolean | no       | Animate opacity or not                             | false         |
| duration       | number  | no       | How long the animation will be in ms               | 400           |
| slideTiming    | string  | no       | CSS transition-timing-function applied to height   | "ease-in-out" |
| fadeTiming     | string  | no       | CSS transition-timing-function applied to opacity  | "ease-in-out" |
| tag            | string  | no       | The HTML tag to use for the wrapper element        | "div"         |
| responsive     | boolean | no       | Animate height when contents are changed           | false         |


* or `modelValue` if a method is required

```html
<div class="MyContent">
  <h1>Always show this</h1>
  <ul>
<li v-for="(item, index) in list" :key="index">
  <slide-fade :modelValue="isActive(index)" :fade="true">
    Only show this if "isActive(index)" returns true
  </slide-fade>
<li>
  </ul>
</div>
```

The component emits five Vue events:

- `open-start`
- `open-end`
- `close-start`
- `close-end`
- `layout-shift`

```html
<slide-fade @close-end="() => console.log('done closing!')" />
```