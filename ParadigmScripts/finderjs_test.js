function addGlobalEventListeners(type, selector, callback, parent) {
	parent.addEventListener(type, e => {
		if (e.target.matches(selector)) {
			callback();
		}
	});
}

function toggleStatusBar() {
	const statusBar = document.getElementById('status_bar');
	if (statusBar.classList.contains('collapsed')) {
		statusBar.classList.remove('collapsed');
		statusBar.classList.add('expanded');
	} else {
		statusBar.classList.remove('expanded');
		statusBar.classList.add('collapsed');
	}
	const tabs = document.querySelector('.status_bar.tabs');
	if (tabs.classList.contains('collapsed')) {
		tabs.classList.remove('collapsed');
		tabs.classList.add('expanded');
	} else {
		tabs.classList.remove('expanded');
		tabs.classList.add('collapsed');
	}
}

// Initially collapsed
document.getElementById('status_bar').addEventListener('click', () => toggleStatusBar());
document.getElementById('status_bar').classList.add('collapsed');

addGlobalEventListeners('click', '#debug_button1', ((e) => {
	document.querySelector('#segment_header_1').classList.add('collapsed');
}), document.querySelector('.debug_buttons'));

document.addEventListener('DOMContentLoaded', (e) => {
	// console.log('documentLoaded >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>');
	var data = [
		{
			size: '10 KB',
			modified: '02/21/2015 at 10:04am',
			label: 'build',
			children: [
				{
					size: '44 KB',
					modified: '02/21/2015 at 10:04am',
					label: 'build',
					children: [
						{
							size: '2 KB',
							modified: '02/21/2015 at 10:04am',
							label: 'finder.js'
						}
					]
				},
				{
					size: '11 KB',
					modified: '02/21/2015 at 10:04am',
					label: 'finder.js'
				}
			]
		},
		{
			size: '9 KB',
			modified: '02/21/2015 at 10:04am',
			label: 'example',
			children: [
				{
					size: '10 KB',
					modified: '02/21/2015 at 10:04am',
					label: 'example',
					children: [
						{
							size: '10 KB',
							modified: '02/21/2015 at 10:04am',
							label: 'test',
							children: [
								{
									size: '10 KB',
									modified: '03/09/2014 at 11:45am',
									label: 'index.js'
								},
								{
									size: '10 KB',
									modified: '03/09/2014 at 11:45am',
									label: 'test.js'
								},
								{
									size: '10 KB',
									modified: '03/09/2014 at 11:45am',
									label: 'util.js'
								}
							]
						},
						{
							size: '33 KB',
							modified: '02/21/2015 at 10:04am',
							label: 'bundle.js'
						},
						{
							size: '103 KB',
							modified: '02/21/2015 at 10:04am',
							label: 'finderjs.css'
						},
						{
							size: '56 KB',
							modified: '02/21/2015 at 10:04am',
							label: 'index.html'
						},
						{
							size: '122 KB',
							modified: '02/21/2015 at 10:04am',
							label: 'index.js'
						}
					]
				},
				{
					size: '8 KB',
					modified: '02/21/2015 at 10:04am',
					label: 'bundle.js'
				},
				{
					size: '6 KB',
					modified: '02/21/2015 at 10:04am',
					label: 'finderjs.css'
				},
				{
					size: '4 KB',
					modified: '02/21/2015 at 10:04am',
					label: 'index.html'
				},
				{
					size: '2 KB',
					modified: '02/21/2015 at 10:04am',
					label: 'index.js'
				}
			]
		},
		{
			size: '10 KB',
			modified: '02/21/2015 at 10:04am',
			label: 'test',
			children: [
				{
					size: '10 KB',
					modified: '03/09/2014 at 11:45am',
					label: 'index.js'
				},
				{
					size: '10 KB',
					modified: '03/09/2014 at 11:45am',
					label: 'test.js'
				},
				{
					size: '10 KB',
					modified: '03/09/2014 at 11:45am',
					label: 'util.js'
				}
			]
		},
		{
			size: '56 KB',
			modified: '02/21/2015 at 10:04am',
			label: '.codeclimate.yml'
		},
		{
			size: '33 KB',
			modified: '02/21/2015 at 10:04am',
			label: '.eslintrc'
		},
		{
			size: '101 KB',
			modified: '02/21/2015 at 10:04am',
			label: '.gitignore'
		},
		{
			size: '96 KB',
			modified: '02/21/2015 at 10:04am',
			label: '.travis.yml'
		},
		{
			size: '69 KB',
			modified: '02/15/2012 at 1:02pm',
			label: 'index.js'
		},
		{
			size: '666 KB',
			modified: '02/15/2012 at 1:02pm',
			label: 'LICENSE'
		},
		{
			size: '187 KB',
			modified: '02/15/2012 at 1:02pm',
			label: 'Makefile'
		},
		{
			size: '45 KB',
			modified: '02/15/2012 at 1:02pm',
			label: 'package.json'
		},
		{
			size: '10 KB',
			modified: '02/15/2012 at 1:02pm',
			label: 'README.md'
		},
		{
			size: '7 KB',
			modified: '02/15/2012 at 1:02pm',
			label: 'util.js'
		},
		{
			size: '10 KB',
			modified: '02/21/2015 at 10:04am',
			label: 'Project page',
			type: 'github-url',
			url: 'https://github.com/mynameistechno/finderjs'
		}
	];

	var container = document.getElementById('test_finderjs');
	// console.log('container :>> ', container);
	
	var options = {};
	var f = finder(container, data, options);
	f.on('leaf-selected', function (item) {
		console.log('Leaf selected', item);
	});
});
