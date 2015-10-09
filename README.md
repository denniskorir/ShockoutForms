# Shockout SPForms
###SharePoint + Knockout MVVM forms - an InfoPath and XSL Form Replacement (and Vast Improvement)

Forget the frustrations of legacy InfoPath and XSL SharePoint form development. Leverage the power of Knockout's databinding plus SharePoint's REST services to create modern and truly dynamic web forms.

###Compatibilty
Compatible with SharePoint 2010 and 2013, Foundation, Standard, and Enterprise.

####Dependencies: 
jQuery 1.72+, jQuery UI<any>, KnockoutJS 3.2+

##Mobile First
Shockout SP Forms is built on the philosophy of Responsive Design and Mobile First. Therefore, the framework's built-in templates utilize Bootstrap CSS. You're encouraged to become familiar with Boostrap CSS and implement the classes in your own form controls. Download Boostrap at http://getbootstrap.com, or use the CDN (Content Delivery Network) links below. See the Knockout HTML form control samples below which include the Boostrap CSS classes.

##About Knockout JS MVVM (Model View View Model)
You must be familiar with the Knockout JS MVVM framework syntax, but there are form control samples below that you can copy and paste in order to get you started building Shockout forms with a minimal learning curve. Visit http://knockoutjs.com if you need an introduction or refresher.

Knockout utilizes the Observer/Observable design pattern which means that many objects can "observe" another object - called an "observable." This means when the value of an observable changes, all observers will react to the change. A practical example of this behavior is with Excel formula cells - the calculation updates immediately after another variable in the formula changes. 

###Rules
If you've spent any time implementing rules in InfoPath, you have probably become frustrated with the interface to manage those rules. Rules with XSL forms? Forget it unless you're prepared to hack your form to death with jQuery selectors and event handlers. With Knockout's directives, you can embed the functionality of rules in an HTML element with the data-bind attribute. For example, do you need to show an element based on the selected option of a select element?
```
<label>What is your favorite color?</label>
<select data-bind="value: color, optionsCaption: 'Select your favorite color...'">
	<option>Red</option>
	<option>Blue</option>
	<option>Green</option>
</select>
<!-- The div element below is hidden until `color == 'Red'` -->
<div data-bind="visible: color() == 'Red'">What a coincidence. Red is my favorite color too!</div>
```

#### Usage
```
// These are included in the sample Master page provided - Shockout.SpForms.master
<!-- Bootstrap CSS (in head)-->
<link href="//maxcdn.bootstrapcdn.com/bootstrap/3.3.5/css/bootstrap.min.css" rel="stylesheet" type="text/css" />

<!-- jQuery UI CSS (in head)-->
<link href="//code.jquery.com/ui/1.11.4/themes/smoothness/jquery-ui.css" rel="stylesheet" type="text/css" />

<!-- It's recommended to place your scripts at the bottom of the page, before the ending </body> tag, for faster page loads. -->

<!-- jQuery -->
<script src="//code.jquery.com/jquery-1.11.3.min.js" type="text/javascript"></script>
<script src="//code.jquery.com/ui/1.11.4/jquery-ui.min.js" type="text/javascript"></script>

<!-- Bootstrap -->
<script src="//maxcdn.bootstrapcdn.com/bootstrap/3.3.5/js/bootstrap.min.js" type="text/javascript"></script>

<!-- Knockout JS -->
<script src="//cdnjs.cloudflare.com/ajax/libs/knockout/3.3.0/knockout-min.js" type="text/javascript"></script>

<!-- Shockout SPForms -->
<script src="ShockoutForms-0.0.1.min.js" type="text/javascript"></script>

<!-- Setup your form - this goes at the bottom of your form's page -->
<script type="text/javascript">
(function(){
	var spForm = new Shockout.SPForm(
		/*listName:*/ 'My SharePoint List Name', 
		/*formId:*/ 'my-form-ID', 
		/*options:*/ {
			debug: false, // default false
			preRender: function(spForm){}, // default undefined
			postRender: function(spForm){}, // default undefined
			preSave: function(spForm){}, // default undefined	
			allowDelete: false, // default false
			allowPrint: true, // default true
			allowSave: true, // default true
			allowedExtensions: ['txt', 'rtf', 'zip', 'pdf', 'doc', 'docx', 'jpg', 'gif', 'png', 'ppt', 'tif', 'pptx', 'csv', 'pub', 'msg'],  // the default 
			attachmentMessage: 'An attachment is required.', // the default
			confirmationUrl: '/SitePages/Confirmation.aspx', // the default
			enableErrorLog: true, // default true
			errorLogListName: 'Error Log', // Designated SharePoint list for logging user and form errors; Requires a custom SP list named 'Error Log' on root site with fields: 'Title' and 'Error'
			fileHandlerUrl: '/_layouts/SPFormFileHandler.ashx',  // the default    
			enableAttachments: true, // default true
			includeUserProfiles: true, // default true
			includeWorkflowHistory: true, // default true        
			requireAttachments: false, // default false
			siteUrl: '', // default       
			workflowHistoryListName: 'Workflow History' // the default
		});

})();
</script>
```

###Attachments
To enable attachments for your forms, ensure the `enableAttachments` option is `true` (the default) and include at least one element within your form with the class name "attachments". Shockout will place everything inside the element(s).
```
<section class="attachments"></section>
```

I've written a generic handler (.ashx) for attaching documents to your list items. Be sure to copy `SPFormFileHandler.ashx` from the `_layouts` directory of this project to the LAYOUTS directory of your SharePoint front-end server. The URI will be `http://<mysite.com>/_layouts/SPFormFileHandler.ashx`. My goal for the near future is to eliminate dependency on this generic handler for those using Office 365. It's doubtful that users of Office 365 have permissions to copy files to their LAYOUTS directory. Since modern browsers now convert file uplaods to base64 strings, it's possible to send attachments to list items via SharePoint's SOAP API.

Also ensure your SharePoint list has attachments enabled. Shockout will detect this setting and render attachments based on your SP list settings.

###Show the User Profiles for Created By and Modified By
To enable this feature, ensure that `includeUserProfiles` is `true` (the default) include an element with the class name "created-info". 
Shockout will query the User Information List or User Profile Service, if you have it, and display user profiles with: picture, full name, job title, email, phone, department, and office.
If this feature is disabled, Shockout will only show the Created By/Created and Modified By/Modified fields. 
```
<section class="created-info" data-edit-only></section>
```

###SharePoint Field Variable Names
Shockout relies on SharePoint REST Services and SP REST Services returns your list's field names in a specific format; basically the current display name, minus spaces and special characters, in "CamelCase."

The Shockout framework will map these camel case variable names to an instance of a Knockout view model. You'll use these variable names to create your form's fields.

To preview the formatting of your SharePoint list's field names, it's very helpful to use a REST client such as the Advanced REST Client for Google's Chrome browser - https://chrome.google.com/webstore/detail/advanced-rest-client/hgmloofddffdnphfgcellkdfbfbjeloo

Once this application is installed, you can preview the JSON returned by entering the following in the address bar. Your list name must NOT contain spaces and must be in CamelCase
```
http://<SiteUrl>/<Subsite>/_vti_bin/listdata.svc/<MyListName>(<ID>)

// example: https://mysite.com/forms/_vti_bin/listdata.svc/PurchaseRequisitions(1)
```
Choose the GET radio option and enter `Accept: application/json;odata=verbose` in the RAW field. This tells SP to return JSON, not XML!
Now that you know the variable names, you're ready to create your Shockout form.

###SP Field Metadata
* Shockout assigns metadata properties to all of your list fields.

    * `_koName` - (String) - the Knockout variable name
    * `_name` - (String) the internal name of the SP field
    * `_choices` - (Array) if the field is a choice or multichoice field, the field's choices 
    * `_description` (String) the decription of the SP field
    * `_required` (Boolean) if the field is required or not
    * `_readOnly` (Boolean) if the field is read-only or not
    * `_format` (String) the standard name of the type of SP field: Text, Choice, Note, Computed, etc.

The Knockout framework features a `with` directive which makes it very convenient to reference a field's metadata properties by wrapping child elements with a parent element having the attribute `data-bind="with: MySpFieldName._metadata"`. See the code samples below.

###Displaying a SharePoint Text Field
```
<div class="form-group">
	<label data-bind="text: MySpFieldName._displayName" class="control-label" for="MySpFieldName"></label>
	
	<input type="text" data-bind="value: MySpFieldName, attr:{'placeholder': MySpFieldName._displayName}" maxlength="255" id="MySpFieldName" class="form-control" />
	
	<!-- optional Field Description -->
	<p data-bind="text: MySpFieldName._description"></p>
</div>
```

###Displaying a SharePoint Checkbox Field (Boolean)
```
<div class="form-group">
	<label class="checkbox">
        <input type="checkbox" data-bind="checked: MySpFieldName" />
        <span data-bind="text: MySpFieldName._displayName"></span>
    </label>

	<!-- optional Field Description -->
	<p data-bind="text: MySpFieldName._description"></p>
</div>
```

###Displaying SharePoint Choice Fields - Select Menu
How to display the choices from a SharePoint Choice Field in a select menu.
```
<div class="form-group">
	<label data-bind="text: MySpFieldName._displayName" class="control-label" for="MySpFieldName"></label>
	
	<select data-bind="value: MySpFieldName, attr:{'placeholder': MySpFieldName._displayName}, options: MySpFieldName._choices, optionsValue: 'value', optionsCaption: '--SELECT--'" id="MySpFieldName" class="form-control"></select>

	<!-- optional Field Description -->
	<p data-bind="text: MySpFieldName._description"></p>
</div>
```

###Displaying SharePoint MultiChoice Fields - Checkboxes
How to display the choices from a SharePoint MultiChoice Field with checkboxes.
```
<div class="form-group">
	<label data-bind="text: MySpFieldName._displayName" class="control-label"></label>
				
	<!-- ko foreach: MySpFieldName._choices -->
	<label class="radio">
		<input type="checkbox" data-bind="checked: $root.MySpFieldName, attr: { value: $data.value }" />
		<span data-bind="text: $data.value"></span>
	</label>
	<!-- /ko -->   
					
	<!-- optional Field Description -->
	<p data-bind="text: MySpFieldName._description"></p>          
</div>

```

###Displaying SharePoint MultiChoice Fields - Radio Buttons
How to display the choices from a SharePoint MultiChoice Field with radio buttons.
```
<div class="form-group">
	<label data-bind="text: MySpFieldName._displayName" class="control-label"></label>
				
	<!-- ko foreach: MySpFieldName._choices -->
	<label class="radio">
		<input type="radio" data-bind="checked: $root.MySpFieldName, attr: {value: $data.value}" name="MySpFieldName" />
		<span data-bind="text: $data.value"></span>
	</label>
	<!-- /ko -->   
					
	<!-- optional Field Description -->
	<p data-bind="text: MySpFieldName._description"></p>          
</div>

```
     


###Multiple Persons (UserMulti)
####A Control with Multiple User Accounts

```
<!-- in markup -->
<div class="row">
	<div class="col-md-6 col-xs-6">
		<input type="text" data-bind="spPerson: person" />
		<button class="btn btn-success" data-bind="click: addPerson, attr: {'disabled': person() == null}"><span>Add</span></button> 		
	</div>	
</div>

<!-- ko foreach: People -->
<div class="row">
	<div class="col-md-10 col-xs-10" data-bind="spPerson: $data"></div>
	<div class="col-md-2 col-xs-2">
		<button class="btn btn-xs btn-danger" data-bind="click: $root.removePerson"><span class="glyphicon glyphicon-trash"></span></button>
	</div>
</div>
<!-- /ko -->
```

If `People` is a field in your SharePoint list, then:

```
// in preRender
...
preRender(spForm, vm){

    // This is a temporary local variable to hold a person object.
    // You will push this to the People observable array.
	vm.person = ko.observable(null);
	
	// add a person to KO object People
	vm.addPerson = function(model, ctrl){
		if(vm.People() == null){
			vm.People([]);
		}
		
		vm.People().push(vm.person());
		vm.People.valueHasMutated();
		
		vm.person(null);
		return false;
	};
	
	// remove a person from KO object People
	vm.removePerson = function(person, event){
		vm.People.remove(person);
		return false;
	}

}
...
```

##Required Field Validation
Simply add the `required="required"` attribute to required fields. Shockout will do the rest!

##Knockout SharePoint Field Binding Handlers
You may use these binding handlers with any HTML element. Shockout will render the apporpriate content whether it's a static element such as a DIV, SPAN, etc. or an input field: INPUT, SELECT, and TEXTAREA.
	
####data-sp-html
```
<textarea data-bind="value: Comments" data-sp-html></textarea>
``` 

####spPerson
Displays an auto-complete field with user name and email address as you type a user's first or last name in the field. The minimum number of characters is 3 before it will query the User Information List.
SharePoint group names aren't supported at this time, but coming soon.
```
<input type="text" data-bind="spPerson: myVar" />
<div data-bind="spPerson: myVar"></div>
```

####spDate
Displays a date in MM/DD/YYYY format.
```
<input type="text" data-bind="spDate: myVar" />
<div data-bind="spDate: myVar"></div>
```

####spDateTime
Displays a date/time in MM/DD/YYYY HH:MMM TT format.
```
<input type="text" data-bind="spDateTime: myVar" />
<div data-bind="spDateTime: myVar"></div>
```

####spMoney
Displays currency in USD. Negative values are displayed in red and enclosed in parenthesis `()`. Other currency symbols coming soon.
```
<input type="text" data-bind="spMoney: myVar" />
<div data-bind="spMoney: myVar"></div>
```

####spDecimal
Displays number with 2 decimal places. Negative values are displayed in red. You can change the decmial places with the precision attribute.
```
<input type="text" data-bind="spDecimal: myVar, precision: 2" />
<div data-bind="spDecimal: myVar, precision: 2"></div>
```

####spNumber
Displays integer/whole number. Negative values are displayed in red.
```
<input type="text" data-bind="spNumber: myVar" />
<div data-bind="spNumber: myVar"></div>
```

##Element Attributes

####data-author-only
Restricts element to authors only where `currentUser.id == listItem.CreatedById`. Removes from DOM otherwise.
Useful for restricting edit fields to the person that created the form.
```
<section data-author-only></section>
```

####data-non-authors
Restricts element to non-authors of a form. Removes from DOM otherwise. 
Useful for displaying read-only/non-edit sections to non-authors only.
```
<section data-non-authors></section>
```

####data-edit-only
Only renders an element when there's an ID in the querystring - an existing form. Removes from DOM otherwise. 
Useful for sections that require another person's input (such as comment and approval sections) on an existing form.
```
<section data-edit-only></section>
```

####data-new-only
Only renders an element when there is NO ID in the querystring - a new form. Removes from DOM otherwise.
```
<section data-new-only></section>
```

####data-sp-groups
Only renders an element for users belonging to the specified SharePoint user groups. Removes from DOM otherwise.
Useful for restricting access to manager approval sections and fields.
// Value is a comma delimitted list of user group IDs and names: `<groupId>;#<groupName>`. Shockout SPForms will first try to match on group ID and then the group name.
```
// Example:
<section data-sp-groups="1;#Administrators,2;#Managers"></section>
```

For approval sections, you can combine these attributes:
```
<section data-edit-only data-sp-groups="1;#Administrators,2;#Managers"></section>
```
This element will be rendered for users who belong to the SP user groups specified and only when there is an ID in the querystring of the form URL. 

##Form Events
You may further customize your form by adding extra functionality within the appropriate event methods. 
You specify the code for these methods in the third parameter of the constructor - the options object.

####preRender()
```
preRender: function(spForm){
	// Run custom code here BEFORE the form is rendered and BEFORE the Knockout view model is bound.
	// Useful for adding custom markup and/or custom local Knockout variables to your form.
	// Shockout will know the difference between your variables and the ones that exist in your SharePoint list.
}
```

####postRender()
```
postRender: function(spForm){
	// Run custom code here AFTER the form is rendered and AFTER the Knockout view model is bound.
	// Useful for:
	//	- setting default values for your Knockout objects
	//	- using JSON.parse() to convert string data stored in a text field to JSON - think tables in InfoPath but with JSON instead of XML!
}
```

####preSave()
```
preSave: function(spForm){
	// Run code before the form is saved.
	// Useful for: 
	//	- implementing custom validation
	//	- converting JSON data to a string with JSON.stringify(), which is saved in a plain text field.
}	
```

##Saving vs. Submitting Forms
Shockout includes a feature that allows your users to save their forms before submitting and triggering approval workflows. This is very useful for long forms - I know our users, especially managers, are interupted constantly 
and leave their forms open so long their sessions used to time out. 

To enable this feature, you must: 
  * Have a field of type `boolean` named "IsSubmitted" in your form's list. 
  * Shockout will detect this field and render a 'Save' button next to the 'Submit' button.
  * Set all required fields in your SP list to `No`. If not the server will return an error if required fields aren't filled in yet. No need to control validation in your SP list; Shockout will handle the validation for you.
  * To prevent your approval workflows from triggering until the user presses the Submit button, include in the beginning of your workflows: 
		```
		Wait on 'IsSubmitted' to equal 'Yes'
		```   

##Workflow History
If your form has one or more workflows, Shockout will display all logs from your site's Workflow History list at the bottom of your form. This is a very helpful feature for your users to track the status of their forms.
The Workflow History list is hidden by default and can be made visible a coupe of ways. You can view your site's Workflow History list at `http://<mysite.com>/Lists/Workflow%20History`.

Warning: Workflow HIstory lists can qickly become full, exceeding your list threshold for non-admin users. Be sure to run regular maintenance to delete old list items. I use a PowerShell script which runs in the front-end server's Task Scheduler, nightly, to delete list items older than 6 months.

The option `includeWorkflowHistory` is `true` by default but you may override and set it to `false`. 

The option `workflowHistoryListName` is "Workflow History" by default since all SharePoint sites feature this list. You may override this list name if you've created another custom workflow history list but it must be of the same list template.

##Error Logging
This feature allows you to track and fix any errors your users experience. The default options are `enableErrorLog: true` and `errorLogListName: 'Error Log'`. 

Your Error Log list must be hosted on the root site and have 2 fields: "Title" (text) and "Error" (multiple lines of text - rich HTML). 

It's recommended to set a workflow or an alert on this list to notify you as soon as an error is logged.   

##Browser Compatibility
Shockout SPForms has been successfully tested with IE 9-11 and the latest versions of Chrome and FireFox.

###Copyright

Copyright (C) 2015  John T. Bonfardeci

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU Affero General Public License as
published by the Free Software Foundation, either version 3 of the
License, or (at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License
along with this program.  If not, see <http://www.gnu.org/licenses/>.

