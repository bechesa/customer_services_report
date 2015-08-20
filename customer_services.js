function main(request, response) {

	try {
		if ((request.getMethod() == 'GET')) {
			var form = nlapiCreateForm('Customer Services List', false);
			var myInlineHtml = form.addField('custpage_btn', 'inlinehtml');

			var select_customer = form.addField('customer', 'select',
					'Select Customer', 'customer');

			select_customer.setMandatory(true);
			form.addSubmitButton('Search');

			response.writePage(form);
		} else {

			var customer = request.getParameter('customer');
			var content = getContent(customer);
			var form = nlapiCreateForm('Customer Services List', false);
			var myInlineHtml = form.addField('custpage_btn', 'inlinehtml');

			// form.addField('select_customer', 'select', 'Select Customer',
			// 'customer');
			myInlineHtml.setDefaultValue(content);

			response.writePage(form);

			nlapiLogExecution('DEBUG', 'Customer', customer);
		}

	} catch (err) {
		nlapiLogExecution('ERROR', 'ERROR', err.message);
	}
}

function getContent(customer_id) {
	var template = nlapiLoadFile(951943);

	var customers = [ {
		name : nlapiLookupField('customer', customer_id, 'companyname')
	} ];

	var Customers = [];
	var Services = [];

	var services = getServices(customer_id);

	// var circuits = getCircuits("1");
	for (j = 0; j < customers.length; j++) {
		for (i = 0; i < services.length; i++) {

			var circuits = getCircuits2(services[i].sof);
			nlapiLogExecution('DEBUG', 'SOF', JSON.stringify(services[i].sof));
			nlapiLogExecution('DEBUG', 'Circuits', JSON.stringify(circuits));
			Services.push({
				sof : services[i].sof,
				memo : services[i].memo,
				sof_legacy_no : services[i].sof_legacy_no,
<<<<<<< HEAD
				tcv_amount : services[i].tcv_amount,
=======
>>>>>>> 229dd12c03cf653ba2cbd6cc7c70f9d5fccd7ab0
				circuits : circuits,
				number_of_circuits : circuits.length+1,
				
			});

		}
		Customers.push({
			name : customers[j].name,
			services : Services,
			rowspan : 1000,
		});
	}

	 nlapiLogExecution('DEBUG', 'Customers', JSON.stringify(Customers));

	var tag = {
		customers : Customers,

	// number_of_circuits : circuits.length

	}

	var file = mergeTemplate(template.getValue(), tag); // merge template with
	// tag

	return file;
}

function mergeTemplate(template, tag) {

	var body = Mustache.render(template, tag);

	return body;
}

function getServices(customer_id) {
	var services = [];
	var filters = new Array();
	filters[0] = new nlobjSearchFilter('entity', null, 'is', customer_id);
	var searchresults = nlapiSearchRecord('transaction', 'customsearch605',
			filters, null, null);

	for (var i = 0; searchresults != null && i < searchresults.length; i++) {
		var searchresult = searchresults[i];
		var record = searchresult.getId();
		var sof = searchresult.getValue('transactionnumber');
		var memo = searchresult.getValue('memo');
		var custbody_legacy_no = searchresult.getValue('custbody_legacy_no');
		services.push({
			sof : sof,
			memo : memo,
			sof_legacy_no : custbody_legacy_no,
			sof_id : record,
<<<<<<< HEAD
			tcv_amount : numberWithCommas(searchresult.getValue("totalamount")),
=======
>>>>>>> 229dd12c03cf653ba2cbd6cc7c70f9d5fccd7ab0
		});

	}

	return services;

}
function getCircuits(sof_id) {

	nlapiLogExecution('DEBUG', 'Inside get circuits', "SOF: "
			+ JSON.stringify(sof_id));
	var circuits = [];
	var filters = new Array();
	filters[0] = new nlobjSearchFilter('custrecord_order_no', null, 'is',
			sof_id);

	var searchresults = nlapiSearchRecord('customrecord_arcl_links',
			'customsearch600', filters, null, null);

	for (var i = 0; searchresults != null && i < searchresults.length; i++) {
		var searchresult = searchresults[i];

		circuits.push({
			new_circuit_id : searchresult.getValue('name'),
			description : searchresult
					.getValue('custrecord_customer_service_desc'),
			capacity_qty : searchresult.getValue('custrecord_capacity_qty'),
			term : searchresult.getText('custrecord_term'),
			handover_date : searchresult
					.getValue("custrecord_customer_handover_date"),
			legacy_no : searchresult.getValue("custrecord_legacy_no"),
			expiry_date : searchresult
					.getValue("custrecord_service_expiry_date"),
			unit : searchresult.getText("custrecord_unit"),
			
		});
	}

	return circuits;
}

function getCircuits2(sof_id) {
	
	nlapiLogExecution('DEBUG', 'Inside get circuits', "SOF: "
			+ JSON.stringify(sof_id));
	var circuits = [];
	var filters = new Array();
	filters[0] = new nlobjSearchFilter('tranid', null, 'is', sof_id);

	var searchresults = nlapiSearchRecord('transaction',
			'customsearch_customer_services_sof', filters, null, null);
	
	nlapiLogExecution('DEBUG', 'Search Results', "Search Results "
			+ JSON.stringify(searchresults));

	for (var i = 0; searchresults != null && i < searchresults.length; i++) {
		var searchresult = searchresults[i];

<<<<<<< HEAD
		var searchColumns = searchresult.getAllColumns();
=======
>>>>>>> 229dd12c03cf653ba2cbd6cc7c70f9d5fccd7ab0
		circuits.push({
			new_circuit_id : searchresult
					.getValue('name', 'CUSTCOL_WI_LINK_ID'),
			description : searchresult.getValue(
<<<<<<< HEAD
					'memo'),
=======
					'custrecord_customer_service_desc', 'CUSTCOL_WI_LINK_ID'),
>>>>>>> 229dd12c03cf653ba2cbd6cc7c70f9d5fccd7ab0
			capacity_qty : searchresult.getValue('custrecord_capacity_qty',
					'CUSTCOL_WI_LINK_ID'),
			term : searchresult
					.getText('custrecord_term', 'CUSTCOL_WI_LINK_ID'),
			handover_date : searchresult.getValue(
					"custrecord_customer_handover_date", 'CUSTCOL_WI_LINK_ID'),
			legacy_no : searchresult.getValue("custrecord_legacy_no",
					'CUSTCOL_WI_LINK_ID'),
			expiry_date : searchresult.getValue(
					"custrecord_service_expiry_date", 'CUSTCOL_WI_LINK_ID'),
			unit : searchresult
					.getText("custrecord_unit", 'CUSTCOL_WI_LINK_ID'),
			charge_type : searchresult.getText("custcol_charge_type"),
			amount : numberWithCommas(searchresult.getValue("amount")),
			recurrence : searchresult.getText('custcol_recurrence'),
<<<<<<< HEAD
			mrc : numberWithCommas(searchresult.getValue(searchColumns[19])),
			arc : numberWithCommas(searchresult.getValue(searchColumns[20])),
			qrc : numberWithCommas(searchresult.getValue(searchColumns[21])),
			nrc : numberWithCommas(searchresult.getValue(searchColumns[22])),
=======
>>>>>>> 229dd12c03cf653ba2cbd6cc7c70f9d5fccd7ab0
		});
	}
	return circuits;
}
function numberWithCommas(x) {
	var parts = x.toString().split(".");
	parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
	return parts.join(".");
}