
var requests_spreadsheet = SpreadsheetApp.openById("1rS6Qgut9-tmIkPlyAAu6Bn0hDEgzE61yzKpL3UPah9I");
var requests_sheet = requests_spreadsheet.getSheetByName("Requests");

function setup() {
    var student_request_form = FormApp.openById("1egi9mmSgpZUEGv9yNUKkemciwUzs0bccx0YMdDFhwc4");
    ScriptApp.newTrigger("onStudentSubmit").forForm(student_request_form).onFormSubmit().create();
}

function onStudentSubmit(event) {
    Logger.log("Form Submitted!");

    var email = event.response.getRespondentEmail();
    var person = PersonLookup.lookupPerson("Email", email);
    var phone_number = "";
    var faculty = "";
    var rooms = [];

    event.response.getItemResponses().forEach(function (item_response) {
        var item = item_response.getItem();
        var response = item_response.getResponse();

        switch (item.getTitle()) {
            case "Phone Number":
                phone_number = response;
                break;
            case "Supervising Faculty":
                faculty = response;
                break;
            case "Select the rooms you want access to":
                rooms.concatenate(response);
                break;
            default:
                Logger.log("Unknown question: " + item.getTitle());
        }
    });

    var rooms_string = rooms.reduce(function (rooms_string, room) {
        return rooms_string + room;
    });

    requests_sheet.appendRow([
        email,
        person["First Name"],
        person["Last Name"],
        phone_number,
        faculty,
        rooms_string,
    ]);
}

