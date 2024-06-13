// // Test for Text but with REPLACE

// // /^\s*[^a-zA-Z0-9',._]+|[^a-zA-Z0-9',._]+\s*$/
import { Utility } from "../CoreClasses.mjs";
// import { Surreal } from '../node_modules/surrealdb.wasm/dist/full/index.js';

let Util = new Utility();

console.log(Util);

// let regex = ["^\\s*[^a-zA-Z0-9',._]+|[^a-zA-Z0-9',._]+\\s*$", "gmi"]; //test for general text
// // let regex = ["\\D", "gmi"]; //test for numbers
// console.log(regex);
// let matches = new RegExp(regex[0], regex[1]);
// console.log('matches :>> ', matches);
// let string = "  \" ___ Hasibuan Tampubolon Priyosudibyo Ma'sudi   !@#$%^&*();:";
// console.log(string.match(matches));
// console.log(matches.test(string));
// console.log(string.replace(matches, ''));

// // Test for Numbers
// regex = ["([0-9.,]+)", "gmi"];
// console.log(regex);
// matches = new RegExp(regex[0], regex[1]);
// console.log('matches :>> ', matches);
// string = "  \" ___ Hasibuan Tampubolon Priyosudibyo Ma'sudi 123.000  !@#$%^&*();:";
// console.log(string.match(matches));
// console.log(matches.test(string));

// //Test for Dates
// regex = ["^(0[1-9]|[12][0-9]|3[01])[-/](0[1-9]|1[0-2])[-/](19|20)\\d\\d$", "gmi"];
// console.log(regex);
// let regexTest = new RegExp(regex[0], regex[1]);
// console.log('regexTest :>> ', regexTest);
// const dateString = "31-12-2022";
// console.log(dateString);
// console.log(regexTest.test(dateString));

//Test Asynchronous call for JSON.
(async () => { 
	console.log('start async test');
	async function fetchJsonFile(callback) {
		try {
			const response = await fetch('./Blueprint__Node.json');
			let fetchData = await response.json();
			fetchData = callback(fetchData);
			return fetchData;
		} catch (error) {
			// Handle any errors that occur during the fetch
			console.error(error);
		}
	}
	const Blueprint__Node = await fetchJsonFile((zdata) => { 
		console.log('wooohoooo masuk callback');
		console.log('zdata :>> ', zdata);
		return 'woohooo, ini return e';
	});	
	console.log('Blueprint__Node :>> ', Blueprint__Node);	
})();

