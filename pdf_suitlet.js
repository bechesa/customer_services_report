function pdf_generate(request, response) {

	try {
		var id = request.getParameter('id');
		var content = getContent(id);
		var file = nlapiXMLToPDF(content[0].file);

		var email_addresses = [];

		if (request.getParameter('send') && content[0].employee_ids != null) {
			if (content[0].send_to_customers == 'T') {

				var all_email_addresses = getEmail_addressess_in_Array(
						content[0].employee_ids, 'employee').concat(
						getEmail_addressess_in_Array(content[0].customers_ids,
								'contact'),getEmail_addressess_in_Array(content[0].employee_id_cced,
								'employee'));

				var emailBody = nlapiMergeRecord(76,
						'customrecord_parent_minutes_record', id);

				nlapiSendEmail(nlapiGetUser(), all_email_addresses[0],
						emailBody.getName(), emailBody.getValue(),
						all_email_addresses, null, null, file);
				nlapiLogExecution('DEBUG', 'all email addresses', JSON
						.stringify(all_email_addresses));

			} else {

				var wiocc_email_addresses = getEmail_addressess_in_Array(
						content[0].employee_ids, 'employee').concat(getEmail_addressess_in_Array(content[0].employee_id_cced,
						'employee'));
				var emailBody = nlapiMergeRecord(76,
						'customrecord_parent_minutes_record', id);

				nlapiSendEmail(nlapiGetUser(), wiocc_email_addresses[0],
						emailBody.getName(), emailBody.getValue(),
						wiocc_email_addresses, null, null, file);
				nlapiLogExecution('DEBUG', 'wiocc email addresses', JSON
						.stringify(wiocc_email_addresses));
			}

			// back
			nlapiSetRedirectURL('RECORD', 'customrecord_parent_minutes_record',
					id, false);
		} else {
			response.setContentType('PDF', id, 'inline');
			response.write(file);
		}
	} catch (err) {
		nlapiLogExecution('ERROR', 'pdf generator error', err.message);
		nlapiLogExecution('DEBUG', 'all email addresses', JSON
				.stringify(all_email_addresses));
		// nlapiLogExecution('ERROR', 'pdf generator error',
		// JSON.stringify(content[0].employee_ids));
	}
}

function getContent(id) {

	var file_content = [];

	var xml_template = nlapiLoadFile(950527);

	var record = nlapiLoadRecord("customrecord_parent_minutes_record", id)

	var action_items_count = record
			.getLineItemCount("recmachcustrecord_parent_minutes_record");

	var action_items = [];

	for (i = 1; i <= action_items_count; i++) {
		action_items.push({
			topic : record.getLineItemValue(
					"recmachcustrecord_parent_minutes_record",
					"custrecord_topic", i),
			type : record.getLineItemText(
					"recmachcustrecord_parent_minutes_record",
					"custrecord_item_type", i),
			note : record.getLineItemValue(
					"recmachcustrecord_parent_minutes_record",
					"custrecord_note", i).replace(
					/[^\u000D\u00B7\u0020-\u007E\u00A2-\u00A4]/g, ''),
			person_responsible : record.getLineItemTexts(
					"recmachcustrecord_parent_minutes_record",
					"custrecord_owner", i).join(),
			customer_person_responsible : getContact(record.getLineItemValues(
					"recmachcustrecord_parent_minutes_record",
					"custrecord_customer_owner", i)),
			deadline : record.getLineItemValue(
					"recmachcustrecord_parent_minutes_record",
					"custrecord_due", i)
		});
	}

	var agenda_items = [];

	var agenda_items_count = record
			.getLineItemCount("recmachcustrecord_customer_minutes_item");

	for (i = 1; i <= agenda_items_count; i++) {

		agenda_items.push({
			topic : record.getLineItemValue(
					"recmachcustrecord_customer_minutes_item",
					"custrecord_item_title", i),
			note : record.getLineItemValue(
					"recmachcustrecord_customer_minutes_item",
					"custrecord_customer_minutes_items", i).replace(/\n/g, "<br/>")
		});

	}

	var employee_ids = record.getFieldValues("custrecord_attendees");

	var customers_ids = record.getFieldValues("custrecord_company_attendees");
	
	var employee_id_cced = record.getFieldValues("custrecord_carbon_copy");

	var send_to_customers = record
			.getFieldValue("custrecord_send_to_customers");

	var tag = {
		title : record.getFieldValue("custrecord_title"),
		tarehe : record.getFieldValue("custrecord_date"),
		time : record.getFieldValue('custrecord_time'),
		company_name : record.getFieldText("custrecord_company_name"),
		facilitator : record.getFieldText("custrecord_minutes_taker"),
		wiocc_attendees : record.getFieldTexts("custrecord_attendees").join(),
		company_attendees : record
				.getFieldTexts("custrecord_company_attendees").join(),
//		agenda : record.getFieldValue("custrecord_agenda").replace(/\r?\n/g,
//				'<br />'),
		meeting_id : "WIOCC"+record.getFieldValue("custrecord_date").split("/").join("."),
		action_items : action_items,
		agenda_items : agenda_items,
	};

	var file = Mustache.render(xml_template.getValue(), tag);

	file_content.push({
		file : file,
		employee_ids : employee_ids,
		send_to_customers : send_to_customers,
		customers_ids : customers_ids,
		employee_id_cced : employee_id_cced
	});

	return file_content;
}

function mergeTemplate(template, tag) {

	var body = Mustache.render(template.getValue(), tag);

	return body;
}

function getEmail_addressess_in_Array(ids, record_name) {
	var email_addresses = [];
	var filters = [];
	filters[0] = new nlobjSearchFilter('internalid', null, 'is', ids);

	var columns = [];
	columns[0] = new nlobjSearchColumn('email');

	var searchresults = nlapiSearchRecord(record_name, null, filters, columns);

	for (var i = 0; searchresults != null && i < searchresults.length; i++) {
		var searchresult = searchresults[i];

		var email = searchresult.getValue('email');
		if (email || email.length) {
			email_addresses.push(email);
		}
	}

	return email_addresses;
}

function getContact(internal_ids_in_array) {
	var contacts = [];
	// nlapiLogExecution('ERROR', 'Internal ids',
	// JSON.stringify(internal_ids_in_array));
	for (var i = 0; internal_ids_in_array != null
			&& i < internal_ids_in_array.length; i++) {
		var searchresult = internal_ids_in_array[i];

		var salesrep_supervisor = nlapiLookupField('contact', searchresult,
				'entityid');

		contacts.push(salesrep_supervisor);
	}

	// nlapiLogExecution('ERROR', 'contacts', JSON.stringify(contacts));
	return contacts;
}
/**
 * custrecord_customer_owner
 * 
 * custrecord_owner
 */
