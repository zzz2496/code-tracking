let cr = false;
if (cr) console.log('>>> Startup Loader')
HTMLElement.prototype.addEventOnce = function (eventName, eventHandler) {
	console.log('Start Add event Once @startup.js');
	const element = this;
	const eventKey = `data-event-${eventName}-initialized`;

	// Check if the element already has the event marker
	if (element.hasAttribute(eventKey)) {
		return; // Event is already initialized, do nothing
	}

	// Add the event handler
	element.addEventListener(eventName, eventHandler);

	// Add the marker attribute to the element
	element.setAttribute(eventKey, 'true');

	// Add a function to remove the event
	element.removeEvent = function () {
		element.removeEventListener(eventName, eventHandler);
		element.removeAttribute(eventKey);
		delete element.removeEvent;
	};
	console.log('Done Add event Once @startup.js');
};
// NOTE - HTML removeAllEvents function
HTMLElement.prototype.removeAllEvents = function (eventName) {
	console.log('Start Remove All Events @startup.js');
	const element = this;
	const eventKey = `data-event-${eventName}-initialized`;

	// Check if the element has the event marker
	if (element.hasAttribute(eventKey)) {
		// Remove all event listeners of the specified type
		element.querySelectorAll(`[data-event-${eventName}-initialized="true"]`).forEach((el) => {
			el.removeEventListener(eventName, el.eventHandler);
			el.removeAttribute(eventKey);
		});
	}
	console.log('Done Remove All Events @startup.js');
};


// Define a helper function to check if an SVG element has the event marker
function hasSvgEventMarker(element, eventName) {
	return element._eventMarkers && element._eventMarkers[eventName];
}

// Define a helper function to mark an SVG element with an event marker
function markSvgElement(element, eventName) {
	if (!element._eventMarkers) {
		element._eventMarkers = {};
	}
	element._eventMarkers[eventName] = true;
}

// NOTE - Add the addEventOnce method for SVG elements
// The above code is adding a method `addEventOnce` to the `SVGElement` prototype in JavaScript. This method allows you to add an event listener to an SVG element that will only trigger the event handler once for a specific event.
SVGElement.prototype.addEventOnce = function (eventName, eventHandler) {
	console.log('Start SVG Add event Once @startup.js');

	const element = this;

	// Check if the element already has the event marker
	if (hasSvgEventMarker(element, eventName)) {
		return; // Event is already initialized, do nothing
	}

	// Add the event handler
	element.addEventListener(eventName, function (e) {
		// Call the event handler
		eventHandler(e);

		// Remove the event listener and marker after the event is triggered
		element.removeEventListener(eventName, eventHandler);
		markSvgElement(element, eventName);
	});

	// Mark the SVG element with the event marker
	markSvgElement(element, eventName);
	console.log('Done SVG Add event Once @startup.js');
};

// NOTE - Add a function to remove the event from an SVG element
SVGElement.prototype.removeEvent = function (eventName, eventHandler) {
	const element = this;
	if (hasSvgEventMarker(element, eventName)) {
		element.removeEventListener(eventName, eventHandler);
		delete element._eventMarkers[eventName];
	}
};

// NOTE - Add the getWeek function
Date.prototype.getWeek = function (dowOffset) {
	/*getWeek() was developed by Nick Baicoianu at MeanFreePath: http://www.meanfreepath.com */

	dowOffset = typeof (dowOffset) == 'number' ? dowOffset : 0; //default dowOffset to zero
	const newYear = new Date(this.getFullYear(), 0, 1);
	let day = newYear.getDay() - dowOffset; //the day of week the year begins on
	day = (day >= 0 ? day : day + 7);
	const daynum = Math.floor((this.getTime() - newYear.getTime() - (this.getTimezoneOffset() - newYear.getTimezoneOffset()) * 60000) / 86400000) + 1;
	let weeknum;
	//if the year starts before the middle of a week
	if (day < 4) {
		weeknum = Math.floor((daynum + day - 1) / 7) + 1;
		if (weeknum > 52) {
			let nYear = new Date(this.getFullYear() + 1, 0, 1);
			let nday = nYear.getDay() - dowOffset;
			nday = nday >= 0 ? nday : nday + 7;
			/*if the next year starts before the middle of the week, it is week #1 of that year*/
			weeknum = nday < 4 ? 1 : 53;
		}
	}
	else {
		weeknum = Math.floor((daynum + day - 1) / 7);
	}
	return weeknum;
};

// document.dispatchEvent(new Event('StartupLoaded'));
if (cr) console.log('<<< Startup Loader')