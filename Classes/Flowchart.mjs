export class Flowchart {
	Sequence = {

	};
	Decision = {
		"if": {
			"input_pin1": null,
			"input_pin2": null,
			"operator": null,
			"output_pin1": null,
			"output_pin2": null,
			"operator_template": OperatorTemplate,
			"do_if": function () {
				switch (operator) {
					case '<':

						break;
					case '<=':

						break;
					case '==':

						break;
					case '===':

						break;
					case '>':

						break;
					case '>=':

						break;

					case 'is':

						break;

					default:
						break;
				}
			}
		},
		"switch": function (input_pin1, operator) {

		}
	};
	Repetition = {

	};
};