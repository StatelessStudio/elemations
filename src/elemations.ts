export class Elemation {
	// Has ready() been called?
	protected isReady: boolean = false;

	// DOM Selectors to query by
	public selectors: string = 'div';

	// Interval between each element's start time
	public interval: number;

	// Class to append
	public appendClass: string = 'scrolled-to';

	// Endstop (top)
	public topEndstop?: number;

	// Endstop (bottom)
	public bottomEndstop?: number;

	// Minimum screen-width to listen for scroll events
	public minWidth?: number;

	// Minimum screen-height to listen for scroll events
	public minHeight?: number;

	/**
	 * Constructor
	 * @param triggerSelector Trigger element
	 * @param animateSelector Elements to animate
	 * @param interval Time between each element's animation begins
	 */
	constructor(
		triggerSelector?: string,
		animateSelector?: string,
		interval: number = 500,
		minWidth?: number,
		minHeight?: number
	) {
		this.interval = interval;
		this.minWidth = minWidth;
		this.minHeight = minHeight;

		if (triggerSelector && animateSelector) {
			this.selectors = animateSelector;
			this.setEndstops(triggerSelector);
			this.ready();
		}
	}

	/**
	 * Calculate endstops
	 * @param querySelector Element to set as the trigger
	 */
	public setEndstops(querySelector: string) {
		const el: HTMLElement = document.querySelector(querySelector);
		//this.splitLocation = el.offsetTop + (el.offsetHeight * 0.5);
		this.topEndstop = el.offsetTop;
		this.bottomEndstop = el.offsetTop + el.offsetHeight;
	}

	/**
	 * Trigger
	 */
	public trigger() {
		const halfScreen = window.scrollY + (window.innerHeight * 0.5);
		return halfScreen >= this.topEndstop && halfScreen <= this.bottomEndstop;
	}

	/**
	 * Start the animation
	 */
	public start() {
		document.querySelectorAll(this.selectors).forEach(
			(el: Element, key: number) => {
				setTimeout(() => {
					el.className += ' ' + this.appendClass;
				}, key * this.interval);
			}
		);
	}

	/**
	 * Animation is ready
	 */
	public ready() {
		if (this.isReady) {
			console.warn(
				'[Elemation]',
				'Do not call ready() on an elemation more than once, or when using constructor parameters.'
			);

			return;
		}

		this.isReady = true;
		
		if (this.trigger()) {
			this.start();
		}
		else {
			const listener = () => {
				if (this.trigger()) {
					this.start();
					window.removeEventListener('scroll', listener);
				}
			};

			window.addEventListener('scroll', listener);
		}
	}
};
