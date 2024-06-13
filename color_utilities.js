function colorLuminance(hex, lum) {
	// validate hex string
	hex = String(hex).replace(/[^0-9a-f]/gi, '')
	if (hex.length < 6) {
		hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2]
	}
	lum = lum || 0

	// convert to decimal and change luminosity
	let rgb = '#',
		c,
		i
	for (i = 0; i < 3; i++) {
		c = parseInt(hex.substr(i * 2, 2), 16)
		c = Math.round(Math.min(Math.max(0, c + c * lum), 255)).toString(16)
		rgb += ('00' + c).substr(c.length)
	}

	return rgb
}
function colorLuminanceRGBA(color, lum) {
	let sanitizedColor = color.toLowerCase().trim();

	if (sanitizedColor.startsWith("rgba(")) {
		// Input is in rgba() format
		let rgbaValues = sanitizedColor
			.replace("rgba(", "")
			.replace(")", "")
			.split(",")
			.map((value) => parseFloat(value.trim()));

		let [r, g, b, a] = rgbaValues;

		// Adjust the luminosity of the color
		r = Math.round(Math.min(Math.max(0, r + r * lum), 255));
		g = Math.round(Math.min(Math.max(0, g + g * lum), 255));
		b = Math.round(Math.min(Math.max(0, b + b * lum), 255));

		return `rgba(${r}, ${g}, ${b}, ${a})`;
	} else {
		// Input is in hex format
		let hex = sanitizedColor.replace("#", "");

		if (hex.length < 6) {
			hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
		}

		// Convert to decimal and change luminosity
		let rgb = "#",
			c,
			i;
		for (i = 0; i < 3; i++) {
			c = parseInt(hex.substr(i * 2, 2), 16);
			c = Math.round(Math.min(Math.max(0, c + c * lum), 255)).toString(16);
			rgb += ("00" + c).substr(c.length);
		}

		return rgb;
	}
}

function getContrast(hex) {
	const r = parseInt(hex.substr(1, 2), 16),
		g = parseInt(hex.substr(3, 2), 16),
		b = parseInt(hex.substr(5, 2), 16),
		yiq = (r * 299 + g * 587 + b * 114) / 1000
	return yiq >= 128 ? '#001f3f' : '#F6F5F7'
}

const isValidColor = hex => /^#[0-9A-F]{6}$/i.test(hex)

const getColorFromRoute = () => {
	if (window.location.hash) {
		if (/^#[0-9A-F]{6}$/i.test(window.location.hash)) {
			return window.location.hash
		}
	}
}

const getSizes = () => {
	const windowWidth = window.innerWidth
	const windowHeight = window.innerHeight
	if ((windowWidth < 1000 || windowHeight < 860) && window.navigator.userAgent !== 'ReactSnap') {
		if (windowWidth < 800) {
			if (windowWidth < 680) {
				return { maxSize: 180, size: 150 }
			} else {
				return { maxSize: 250, size: 200 }
			}
		} else {
			return { maxSize: 350, size: 250 }
		}
	} else {
		return { maxSize: 410, size: 300 }
	}
}

const camelize = str => {
	return str
		.replace(/(?:^\w|[A-Z]|\b\w)/g, function (word, index) {
			return index === 0 ? word.toLowerCase() : word.toUpperCase()
		})
		.replace(/\s+/g, '')
}