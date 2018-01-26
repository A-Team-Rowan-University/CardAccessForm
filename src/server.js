
var requests_spreadsheet = SpreadsheetApp.openById("1rS6Qgut9-tmIkPlyAAu6Bn0hDEgzE61yzKpL3UPah9I");
var requests_sheet = requests_spreadsheet.getSheetByName("Requests");

function setup() {
    var student_request_form = FormApp.openById("1egi9mmSgpZUEGv9yNUKkemciwUzs0bccx0YMdDFhwc4");
    ScriptApp.newTrigger("onStudentSubmit").forForm(student_request_form).onFormSubmit().create();
}



