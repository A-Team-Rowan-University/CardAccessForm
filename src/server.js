
var requests_spreadsheet = SpreadsheetApp.openById("1rS6Qgut9-tmIkPlyAAu6Bn0hDEgzE61yzKpL3UPah9I");
var requests_sheet = requests_spreadsheet.getSheetByName("Requests");

function setup() {
    var student_request_form = FormApp.openById("1egi9mmSgpZUEGv9yNUKkemciwUzs0bccx0YMdDFhwc4");
    ScriptApp.newTrigger("onStudentSubmit").forForm(student_request_form).onFormSubmit().create();
}

function onStudentSubmit(event) {
    Logger.log("Form Submitted!");


    var request_id = requests_sheet.getLastRow();
    var email = event.response.getRespondentEmail();
    var person = PersonLookup.lookupPerson("Email", email);
    var phone_number = "";
    var faculty = "";
    var faculty_email = "timothyhollabaugh@gmail.com"; // Should actually be looked up in PersonLookup once completed
    var citi_training = "";
    var rooms = [];

    event.response.getItemResponses().forEach(function (item_response) {
        var item = item_response.getItem();
        var response = item_response.getResponse();

        Logger.log(response);

        switch (item.getTitle()) {
            case "Phone Number":
                phone_number = response;
                break;
            case "Supervising Faculty":
                faculty = response;
                break;
            case "Select the rooms that you need access to":
                rooms = rooms.concat(response);
                break;
            case "Citi Training":
                citi_training = DriveApp.getFileById(response).getUrl();
                break;
            default:
                Logger.log("Unknown question: " + item.getTitle());
        }
    });

    Logger.log(rooms);

    var rooms_string = rooms.reduce(function (rooms_string, room) {
        if (rooms_string != "") {
            return rooms_string + ", " + room.replace(" (Requires ECE training and Citi training)", "");
        } else {
            return rooms_string + room.replace(" (Requires ECE training and Citi training)", "");
        }
    }, "");

    requests_sheet.appendRow([
        request_id,
        person["First Name"],
        person["Last Name"],
        email,
        phone_number,
        faculty,
        faculty_email,
        rooms_string,
    ]);

    GmailApp.sendEmail(email, "Card Access Request", 
        "Hello " + person["First Name"] + " " + person["Last Name"] + ","
        + "\n\nYour card access request is currently being proccess with the following information."
        + "\n\nRooms requested: " + rooms_string 
        + "\n\nFaulty: " + faculty 
        + "\n\nFaulty's Email: " + faculty_email);
        // remember to include Lab Policy

    GmailApp.sendEmail(faculty_email, "Student's Card Access Request",
        "Hello " + faculty + ","
        + "\n\nStudent: " + person["First Name"] + " " + person["Last Name"] 
        + "\n\nRooms: " + rooms_string
        + "\n\nCiti Training Certificate: " + citi_training);
        // remember to include the Google form link for faulty to approve
}

