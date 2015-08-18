/*******************************************************************************
 * customer minutes application client script
 */
function PrintBtn() {
	// alert("Print");

	var createdPdfUrl = nlapiResolveURL('SUITELET',
			'customscript_customer_minutes', 'customdeploy1', false);
	// pass the internal id of the current record
	createdPdfUrl += '&id=' + nlapiGetRecordId();

	// show the PDF file
	newWindow = window.open(createdPdfUrl); // opens on a different window
}
function send_Email() {

	try {
		var createdPdfUrl = nlapiResolveURL('SUITELET',
				'customscript_customer_minutes', 'customdeploy1', false);
		// pass the internal id of the current record
		createdPdfUrl += '&id=' + nlapiGetRecordId() + "&send=1";

		// show the PDF file
		newWindow = window.open(createdPdfUrl);

	} catch (err) {
		alert(err.message);
	}

}
function pageInit_customer_minutes(type) {
	if (type == "create") {

		var filters = new Array();
		filters[0] = new nlobjSearchFilter('company', null, 'is', '817');

		var columns = [];

		columns[0] = new nlobjSearchColumn('company');
		columns[1] = new nlobjSearchColumn('entityid');

		var searchresults = nlapiSearchRecord('contact', null, filters, columns);

		var contact_ids = [];
		for (var i = 0; searchresults != null && i < searchresults.length; i++) {
			var searchresult = searchresults[i];
			var record = searchresult.getId();

			contact_ids.push(record);
		}

		// alert(nlapiGetFieldValue('custrecord_company_name'));

		// var id = ['817'];
		// nlapiSetCurrentLineItemValues(
		// 'recmachcustrecord_parent_minutes_record',
		// 'custrecord_customer_owner', contact_ids, true,true);
		if (nlapiGetLineItemValue(
				'recmachcustrecord_parent_minutes_record',
				'custrecord_customer_owner',
				nlapiGetCurrentLineItemIndex('recmachcustrecord_parent_minutes_record')) == null) {
			nlapiSetCurrentLineItemValue(
					'recmachcustrecord_parent_minutes_record',
					'custrecord_custmer_name',
					nlapiGetFieldValue('custrecord_company_name'), false, false);
		}

	}

}

function field_changed_customer_minutes(type, name, linenum) {
	// alert('myFieldChanged');
	// alert('type=' + type);
	// alert('name=' + name);
	// alert('linenum=' + linenum);
	// alert(nlapiGetCurrentLineItemValue('recmachcustrecord_parent_minutes_record','custrecord_customer_owner'));

}

function validateLine_customer_minutes(type) {
	// alert('myValidateLine');
	// alert('type=' + type);
	// alert(nlapiGetCurrentLineItemIndex('recmachcustrecord_parent_minutes_record'));
	return true;
}

function myLineInit_customer_minutes(type) {
	// alert('myLineInit');
	// alert('type=' + type);

	// alert(nlapiGetFieldValue('custrecord_company_name'));
	//
	if (type == "recmachcustrecord_parent_minutes_record") {
		nlapiSetCurrentLineItemValue('recmachcustrecord_parent_minutes_record',
				'custrecord_custmer_name',
				nlapiGetFieldValue('custrecord_company_name'), false, false);

	}
	// if (type == "recmachcustrecord_parent_minutes_record") {
	// if (nlapiGetLineItemValue(
	// 'recmachcustrecord_parent_minutes_record',
	// 'custrecord_customer_owner',
	// nlapiGetCurrentLineItemIndex('recmachcustrecord_parent_minutes_record'))
	// == null) {
	//			
	// nlapiSetCurrentLineItemValue(
	// 'recmachcustrecord_parent_minutes_record',
	// 'custrecord_custmer_name',
	// nlapiGetFieldValue('custrecord_company_name'), false, false);

	// }

}
