// Paste this code into Extensions > Apps Script inside your Google Sheet.
// See README.md for full setup/deployment steps.

const SHEET_NAME = "Responses"; // change if you want a different sheet/tab name

const HEADERS = [
  "Timestamp",
  "Full Name",
  "Email",
  "Phone",
  "WhatsApp",
  "Age",
  "National ID",
  "Governorate",
  "Eraasoft Student",
  "Group Code",
  "Branch",
  "Instructor",
  "Training Type",
  "Track"
];

function doPost(e) {
  try {
    const sheet = getOrCreateSheet_();
    const data = e.parameter;

    sheet.appendRow([
      new Date(),
      data.fullName || "",
      data.email || "",
      data.phone || "",
      data.whatsapp || "",
      data.age || "",
      data.nationalId || "",
      data.governorate || "",
      data.isEraasoftStudent || "",
      data.groupCode || "",
      data.branch || "",
      data.instructor || "",
      data.trainingType || "",
      data.track || ""
    ]);

    return ContentService
      .createTextOutput(JSON.stringify({ result: "success" }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ result: "error", message: err.message }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function getOrCreateSheet_() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(SHEET_NAME);

  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
  }

  if (sheet.getLastRow() === 0) {
    sheet.appendRow(HEADERS);
    sheet.getRange(1, 1, 1, HEADERS.length).setFontWeight("bold");
  }

  return sheet;
}
