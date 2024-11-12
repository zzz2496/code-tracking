let cr = true;
if (cr) console.log('>>> >>> >>> >>> ParadigmREVOLUTION');

document.addEventListener('UtilitiesLoaded', () => {
	console.log('>>>>>> check for UtilitiesLoaded in paradigm_revolution.js');
	(() => {
		// ParadigmREVOLUTION.Flow.Form.Events.addGlobalEventListener('keyup', '.text_input', (e) => {
		// 	e.target.value = ParadigmREVOLUTION.Utility.Strings.SafeString(e.target.value);
		// 	e.target.dataset.textinput = 'initialized';
		// }, document.querySelector('#testform'));
		// ParadigmREVOLUTION.Flow.Form.Events.addGlobalEventListener('keyup', '.number_input', (e) => {
		// 	e.target.value = ParadigmREVOLUTION.Utility.Numbers.ThousandSeparator(e.target.value.replace(/[^0-9\.\-]/gmi, ''), '.');
		// 	e.target.dataset.numberinput = 'initialized';
		// }, document.querySelector('#testform'));
		// ParadigmREVOLUTION.Flow.Form.Events.addGlobalEventListener('keyup', '.number_input', (e) => {
		// 	// Clear any previous timer
		// 	clearTimeout(e.target.debounceTimeout);

		// 	// Set a new timer for 0.5 seconds
		// 	e.target.debounceTimeout = setTimeout(() => {
		// 		e.target.value = ParadigmREVOLUTION.Utility.Numbers.ThousandSeparator(
		// 			e.target.value.replace(/[^0-9\.\-]/g, ''), // Remove non-numeric characters except '.' and '-'
		// 			'.'
		// 		);
		// 		e.target.dataset.numberinput = 'initialized';
		// 	}, 500);
		// }, document.querySelector('#testform'));
		// ParadigmREVOLUTION.Flow.Form.Events.addGlobalEventListener('focusin', '.text_select', (e) => {
		// 	console.log('init text_select');
		// 	if (e.target.dataset.textselectinput !== 'initialized') {
		// 		console.log('id >>>>', e.target.id.split('___'));
		// 		ParadigmREVOLUTION.Utility.Forms.initSearchDropdown(e.target, JSON.parse(e.target.dataset.selectValues));
		// 		e.target.dataset.textselectinput = 'initialized';
		// 	}
		// });

		let chain = [
			{
				"id": "P1",
				"input": {
					"a": [1, 2, 3],
				},
				"process": "add",
				"output": null,
				"next_process": "P2"
			},
			{
				"id": "P2",
				"input": {
					"a": ["P1.output", 3],
				},
				"process": "subtract",
				"output": null,
				"next_process": "P3"
			},
			{
				"id": "P3",
				"input": {
					"a": ["P2.output", 5],  // Dynamic reference as a string for later evaluation
				},
				"process": "multiply",
				"output": null,
				"next_process": "P4"
			},
			{
				"id": "P4",
				"input": {
					"a": "P3.output"
				},
				"process": "store",
				"output": null,
				"next_process": null
			}
		];
		window.chain = chain;

		// let flow = new ParadigmREVOLUTION.SystemCore.Modules.Flow(ParadigmREVOLUTION.Utility.BasicMath, chain);
		// window.flow = flow;
		// console.log(flow);
		// flow.Form.Run.executeChain();
	})();
});
document.addEventListener('BlueprintsLoaded', () => {
	console.log('>>>>>> check for BlueprintsLoaded  in paradigm_revolution.js');
});
document.addEventListener('SurrealDBEnginesLoaded', () => {
	console.log('>>> >>> >>> >>> ||| STARTING YGGDRASIL INITIALIZATION');

	let Node = JSON.parse(JSON.stringify(template__Node));
	console.log('Node :>> ', Node);
	// form.Dataset.Schema = {
	// 	informasi_faktur: JSON.parse(JSON.stringify(template__node)),
	// 	identitas_pemilik: JSON.parse(JSON.stringify(template__node)),
	// 	identitas_kendaraan: JSON.parse(JSON.stringify(template__node)),
	// 	data_pendukung: JSON.parse(JSON.stringify(template__node)),
	// 	keterangan: JSON.parse(JSON.stringify(template__node))
	// };


	let Flow = new ParadigmREVOLUTION.SystemCore.Modules.Flow(document.body, ParadigmREVOLUTION.Utility);
	console.log('Flow :>> ', Flow);
	// NOTE - Initialize Main Form (App_menu, App_Container, App_Helper, App_console)
	Node.Dataset.Layout = template__MainAppLayout;
	// NOTE - Render Main Form, get something on the screen
	Flow.FormContainer.innerHTML = Flow.Form.Render.traverseDOMProxyOBJ(Node.Dataset.Layout);
	Node.Dataset.Forms = [template__FormInputTypes, template__FormInputTypeDefinition];
	Flow.Forms = Node.Dataset.Forms;

	console.log('>>>',Node.Dataset.Forms);
	Flow.Form.Events.InitializeFormControls();
	window.Flow = Flow;

	// document.querySelector('#app_content').innerHTML = `Dolorem dolor quidem esse et et possimus. Sed ipsam libero nostrum quia enim dignissimos et nostrum. Fugiat possimus laboriosam sapiente ut dicta. Dolor sit sequi fuga adipisci nihil quos et nisi.
	// 	Voluptatem occaecati quo et nobis vero ipsa. Expedita laboriosam odio incidunt architecto culpa rerum quia ea cupiditate. Facere qui tempora nulla praesentium fuga. Incidunt consectetur autem. Accusamus quam ut dolores voluptas ipsa laborum. Et neque laudantium soluta nostrum est ipsum architecto. 
	// 	Ipsam ducimus facere eius quia voluptatum ipsum quas et. Debitis totam explicabo earum est dicta ipsa praesentium perspiciatis. Enim iure reprehenderit maiores nesciunt quia fugiat consequatur nisi. Blanditiis minima ut molestiae a iusto sed soluta.`;
	// document.querySelector('#app_content').innerHTML += `<br>Dolorem dolor quidem esse et et possimus. Sed ipsam libero nostrum quia enim dignissimos et nostrum. Fugiat possimus laboriosam sapiente ut dicta. Dolor sit sequi fuga adipisci nihil quos et nisi.
	// 	Voluptatem occaecati quo et nobis vero ipsa. Expedita laboriosam odio incidunt architecto culpa rerum quia ea cupiditate. Facere qui tempora nulla praesentium fuga. Incidunt consectetur autem. Accusamus quam ut dolores voluptas ipsa laborum. Et neque laudantium soluta nostrum est ipsum architecto.
	// 	Ipsam ducimus facere eius quia voluptatum ipsum quas et. Debitis totam explicabo earum est dicta ipsa praesentium perspiciatis. Enim iure reprehenderit maiores nesciunt quia fugiat consequatur nisi. Blanditiis minima ut molestiae a iusto sed soluta.`;
	// document.querySelector('#app_content').innerHTML += `<br>Dolorem dolor quidem esse et et possimus. Sed ipsam libero nostrum quia enim dignissimos et nostrum. Fugiat possimus laboriosam sapiente ut dicta. Dolor sit sequi fuga adipisci nihil quos et nisi.
	// 	Voluptatem occaecati quo et nobis vero ipsa. Expedita laboriosam odio incidunt architecto culpa rerum quia ea cupiditate. Facere qui tempora nulla praesentium fuga. Incidunt consectetur autem. Accusamus quam ut dolores voluptas ipsa laborum. Et neque laudantium soluta nostrum est ipsum architecto.
	// 	Ipsam ducimus facere eius quia voluptatum ipsum quas et. Debitis totam explicabo earum est dicta ipsa praesentium perspiciatis. Enim iure reprehenderit maiores nesciunt quia fugiat consequatur nisi. Blanditiis minima ut molestiae a iusto sed soluta.`;
	// document.querySelector('#app_content').innerHTML += `<br>Dolorem dolor quidem esse et et possimus. Sed ipsam libero nostrum quia enim dignissimos et nostrum. Fugiat possimus laboriosam sapiente ut dicta. Dolor sit sequi fuga adipisci nihil quos et nisi.
	// 	Voluptatem occaecati quo et nobis vero ipsa. Expedita laboriosam odio incidunt architecto culpa rerum quia ea cupiditate. Facere qui tempora nulla praesentium fuga. Incidunt consectetur autem. Accusamus quam ut dolores voluptas ipsa laborum. Et neque laudantium soluta nostrum est ipsum architecto.
	// 	Ipsam ducimus facere eius quia voluptatum ipsum quas et. Debitis totam explicabo earum est dicta ipsa praesentium perspiciatis. Enim iure reprehenderit maiores nesciunt quia fugiat consequatur nisi. Blanditiis minima ut molestiae a iusto sed soluta.`;
	// document.querySelector('#app_content').innerHTML += `<br>Dolorem dolor quidem esse et et possimus. Sed ipsam libero nostrum quia enim dignissimos et nostrum. Fugiat possimus laboriosam sapiente ut dicta. Dolor sit sequi fuga adipisci nihil quos et nisi.
	// 	Voluptatem occaecati quo et nobis vero ipsa. Expedita laboriosam odio incidunt architecto culpa rerum quia ea cupiditate. Facere qui tempora nulla praesentium fuga. Incidunt consectetur autem. Accusamus quam ut dolores voluptas ipsa laborum. Et neque laudantium soluta nostrum est ipsum architecto.
	// 	Ipsam ducimus facere eius quia voluptatum ipsum quas et. Debitis totam explicabo earum est dicta ipsa praesentium perspiciatis. Enim iure reprehenderit maiores nesciunt quia fugiat consequatur nisi. Blanditiis minima ut molestiae a iusto sed soluta.`;
	// document.querySelector('#app_content').innerHTML += `<br>Dolorem dolor quidem esse et et possimus. Sed ipsam libero nostrum quia enim dignissimos et nostrum. Fugiat possimus laboriosam sapiente ut dicta. Dolor sit sequi fuga adipisci nihil quos et nisi.
	// 	Voluptatem occaecati quo et nobis vero ipsa. Expedita laboriosam odio incidunt architecto culpa rerum quia ea cupiditate. Facere qui tempora nulla praesentium fuga. Incidunt consectetur autem. Accusamus quam ut dolores voluptas ipsa laborum. Et neque laudantium soluta nostrum est ipsum architecto.
	// 	Ipsam ducimus facere eius quia voluptatum ipsum quas et. Debitis totam explicabo earum est dicta ipsa praesentium perspiciatis. Enim iure reprehenderit maiores nesciunt quia fugiat consequatur nisi. Blanditiis minima ut molestiae a iusto sed soluta.`;
	// document.querySelector('#app_content').innerHTML += `<br>Dolorem dolor quidem esse et et possimus. Sed ipsam libero nostrum quia enim dignissimos et nostrum. Fugiat possimus laboriosam sapiente ut dicta. Dolor sit sequi fuga adipisci nihil quos et nisi.
	// 	Voluptatem occaecati quo et nobis vero ipsa. Expedita laboriosam odio incidunt architecto culpa rerum quia ea cupiditate. Facere qui tempora nulla praesentium fuga. Incidunt consectetur autem. Accusamus quam ut dolores voluptas ipsa laborum. Et neque laudantium soluta nostrum est ipsum architecto.
	// 	Ipsam ducimus facere eius quia voluptatum ipsum quas et. Debitis totam explicabo earum est dicta ipsa praesentium perspiciatis. Enim iure reprehenderit maiores nesciunt quia fugiat consequatur nisi. Blanditiis minima ut molestiae a iusto sed soluta.`;
	// document.querySelector('#app_content').innerHTML += `<br>Dolorem dolor quidem esse et et possimus. Sed ipsam libero nostrum quia enim dignissimos et nostrum. Fugiat possimus laboriosam sapiente ut dicta. Dolor sit sequi fuga adipisci nihil quos et nisi.
	// 	Voluptatem occaecati quo et nobis vero ipsa. Expedita laboriosam odio incidunt architecto culpa rerum quia ea cupiditate. Facere qui tempora nulla praesentium fuga. Incidunt consectetur autem. Accusamus quam ut dolores voluptas ipsa laborum. Et neque laudantium soluta nostrum est ipsum architecto.
	// 	Ipsam ducimus facere eius quia voluptatum ipsum quas et. Debitis totam explicabo earum est dicta ipsa praesentium perspiciatis. Enim iure reprehenderit maiores nesciunt quia fugiat consequatur nisi. Blanditiis minima ut molestiae a iusto sed soluta.`;
	// document.querySelector('#app_content').innerHTML += `
	// <div class="buttons has-addons">
	// 	<!-- Main Button with primary action -->
	// 	<button class="button is-primary" onclick="primaryAction()">
	// 		Main Action
	// 	</button>

	// 	<!-- Dropdown Button -->
	// 	<div class="dropdown is-hoverable">
	// 		<div class="dropdown-trigger">
	// 			<button class="button is-primary" aria-haspopup="true" aria-controls="dropdown-menu">
	// 			<span class="icon is-small">
	// 				<i class="fas fa-caret-down"></i>
	// 			</span>
	// 			</button>
	// 		</div>
	// 		<div class="dropdown-menu" id="dropdown-menu" role="menu">
	// 			<div class="dropdown-content">
	// 			<a href="#" class="dropdown-item" onclick="secondaryAction1()">
	// 				Secondary Action 1
	// 			</a>
	// 			<a href="#" class="dropdown-item" onclick="secondaryAction2()">
	// 				Secondary Action 2
	// 			</a>
	// 			</div>
	// 		</div>
	// 	</div>
	// </div>`;
	// console.log('DONE YGGDRASIL INITIALIZATION');
});