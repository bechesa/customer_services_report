/**
 *  Customer minutes application user event script 
 */

function before_Load_user_event() {

	form.setScript('customscript_client_script');

	try {
		if (type == 'view') {
			var internalId = nlapiGetRecordId();
			var button_print = form.addButton('custpage_button_print',
					'View PDF ', "PrintBtn();");

			var button_send = form.addButton('custpage_button_email',
					'Send email', "send_Email();");
			// set the internal id of the created Client script.

		}
	} catch (exception) {
		nlapiLogExecution('DEBUG', 'Error ', exception.message);
	}
}