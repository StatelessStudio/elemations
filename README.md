# Elemations
Typescript HTML Element Animations

[Custom Development by Stateless Studio](https://stateless.studio)

## Installation

```bash
npm i elemations
```

## How It Works

When a **trigger** element is scrolled into view, the **selector** elements will get a new class. The CSS `transition` will animate between the two states.

## Usage
1. Create an HTML element to animate
2. Create a CSS rule for the default (before animation) state
3. Add a `transition` to the CSS of the element to set how the animation should look
4. Create a CSS rule for the after-animation state
5. In your TypeScript class, create a new `Elemation()`

View the examples below and this will all make some sense.

## Examples

### Fade In
`index.html`
```html
...
<div class="fade-container">
	<div class="fade">Faded</div>
</div>
...
```

`index.css`
```css
.fade {
	opacity: 0; /* Start the element faded out completely */
	transition: opacity 2s; /* Animate the fade over a two seconds */
}

.fade.scrolled-to {
	opacity: 1; /* The animation will finish with the element visible */
}
```

`index.ts`
```ts
onLoad() {
	const elemation = new Elemation(
		'.fade-container', // Trigger the animation when this element is visible
		'.fade' // Animate the `.fade` element
	);
}
```

### Slide from right-hand
`index.html`
```html
...
<div class="woo-container">
	<div class="woo">WOOOO!</div>
</div>
...
```

`index.css`
```css
.woo {
	position: relative; /* Needed for all movement animations */
	left: 100vw; /* Start the element off the screen (to the right) */
	transition: left 0.5s; /* Animate the left movement over a half-second */
}

.woo.scrolled-to {
	left: 0; /* The animation will end with the element back in position */
}
```

`index.ts`
```ts
onLoad() {
	const elemation = new Elemation(
		'.woo-container', // Trigger the animation when this element is visible
		'.woo' // Animate the `.woo` element
	);
}
```

### Fade in & Slide from bottom-right
`index.html`
```html
...
<div class="woo-fade-container">
	<div class="woo-fade">WOOOO! Fade!</div>
</div>
...
```

`index.css`
```css
.woo-fade {
	position: relative; /* Needed for all movement animations */
	left: 100vw; /* Start the element off the screen (to the right) */
	top: 100vh; /* Start the element off the screen (to the bottom) */
	opacity: 0; /* Start the element faded out completely */
	transition: all 0.5s; /* Animate all properties over a half-second */
}

.woo-fade.scrolled-to {
	left: 0; /* The animation will end with the element back in position */
	top: 0;
	opacity: 1; /* And with completely faded in */
}
```

`index.ts`
```ts
onLoad() {
	const elemation = new Elemation(
		'.woo-fade-container', // Trigger the animation when this element is visible
		'.woo-fade' // Animate the `.woo-fade` element
	);
}
```

### Multiple objects per animation
`index.html`
```html
...
<div class="multi-container">
	<div class="multi-obj">Object 1</div>
	<div class="multi-obj">Object 2</div>
	<div class="multi-obj">Object 3</div>
</div>
...
```

`index.css`
```css
.multi-obj {
	position: relative; /* Needed for all movement animations */
	top: -100vw; /* Start the element off the screen (to the top) */
	transition: top 0.5s; /* Animate top position over a half-second */
}

.multi-obj.scrolled-to {
	top: 0; /* The animation will end with each element back in position */
}
```

`index.ts`
```ts
onLoad() {
	const elemation = new Elemation(
		'.multi-container', // Trigger the animation when this element is visible
		'.multi-obj', // Animate each `.multi-obj` element
		500 // Start each element 500ms after the previous one
	);
}
```

## Don't Forget
1. To create CSS for both states, default and `.scrolled-to`
2. Add the `transition` property, otherwise the state-change will be instant and unanimated
3. Add the `position: relative` property for any animations that slide/move the elements
4. Add `overflow` property to the body/parent to hide elements which should be out-of-view.

e.g.
```css
html,
body {
	overflow-x: hidden; /* This will hide the element while it's off the screen */
}

.woo {
	position: relative;
	left: 100vw;
	transition: left 0.5s;
}

.woo.scrolled-to {
	left: 0;
}
...
```

## Using Angular?

If you're using Angular, create your Elemation in `ngOnInt()`.

You'll also have to use a `setTimeout()` to set the elemations after page-load:

```typescript
export class CoolComponent implements OnInit {
	ngOnInit() {
		setTimeout(() => {
			const elemation = new Elemation(...);
		});
	}
}
```

If you're using Angular Universal (Server-Side Rendering), you'll also need to check that the platform is browser before calling the `setTimeout`. For help on this, see https://stackoverflow.com/questions/46099644/how-to-check-for-isbrowser-in-angular-4


## Advanced Setup

If you'd like to get more control, you can use a more advanced setup:

```typescript
const elemation = new Elemation(); // Don't pass any arguments to constructor
elemation.selectors = '.woo'; // Animate the `.woo` element
elemation.setEndstops('.woo-container'); // Set the scroll trigger container
elemation.ready(); // Start listening for scroll trigger
```

### Manual Trigger

You can also trigger the animation programmatically (e.g. at the click of a button):

Note: Don't call `ready()` on the elemation if you don't want to use the scroll trigger.

```typescript
elemation.start(); // Programatically start the animation
```

### Custom Trigger Location

Or set a manual trigger location (pixels from top):

```typescript
elemation.splitLocation = 1500; // Trigger at 1500 pixels of scroll
elemation.ready();
```

### Custom Trigger

You can override the trigger to be based off anything. When the trigger method returns true, the animation will start. The trigger is assessed on page load and every time the window is scrolled, until it fires.

For example, we can start the animation when a random number is 0.5:

```typescript
elemation.trigger = function() {
	return Math.random() === 0.5;
};
elemation.ready();
```

or when the year is 3000:

```typescript
elemation.trigger = function() {
	return Date.now() >= 32503680000; // Epoch time for Jan 1st, 3000
};
elemation.ready();
```

Once the trigger fires, the elemation will automatically unregister it's listener.
