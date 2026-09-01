// Paste this code into Extensions > Apps Script inside your Google Sheet.
// See README.md for full setup/deployment steps.

const SHEET_NAME = "Responses"; // change if you want a different sheet/tab name
const SPREADSHEET_ID = "1_xfmbhPuWdgu1gTWx4K9PF65wAjcwbR0boGws-jIeVc"; // target Google Sheet

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
  "Track",
  "Project Link"
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
      data.track || "",
      data.projectLink || ""
    ]);

    return ContentService.createTextOutput(JSON.stringify({ result: "success" })).setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    console.error("doPost failed: " + err.stack);
    throw err;
  }
}

// Quick check: open the /exec URL in a browser. If you see "OK - sheet: ..." the
// script can reach the target spreadsheet and the deployment is live.
function doGet(e) {
  try {
    const sheet = getOrCreateSheet_();
    return ContentService.createTextOutput("OK - sheet: " + sheet.getParent().getName() + " / tab: " + sheet.getName());
  } catch (err) {
    return ContentService.createTextOutput("ERROR: " + err.message);
  }
}

// Run this manually from the editor once to (a) trigger the authorization prompt
// and (b) confirm a row lands in the right spreadsheet.
function testAppend_() {
  doPost({ parameter: { fullName: "TEST ROW", email: "test@example.com" } });
}

// Run this once from the editor if the header row in the sheet has drifted out
// of sync with HEADERS (e.g. a column landed under the wrong title). It rewrites
// row 1 to exactly match HEADERS without touching the response rows below.
function resetHeaders_() {
  const sheet = getOrCreateSheet_();
  const width = Math.max(sheet.getLastColumn(), HEADERS.length);
  sheet.getRange(1, 1, 1, width).clearContent();
  sheet.getRange(1, 1, 1, HEADERS.length).setValues([HEADERS]).setFontWeight("bold");
}

// DESTRUCTIVE: deletes every response row (everything below the header row) and
// rewrites row 1 to match HEADERS. Run manually from the editor to wipe old test data.
function clearAllResponses_() {
  const sheet = getOrCreateSheet_();
  const lastRow = sheet.getLastRow();
  if (lastRow > 1) {
    sheet.getRange(2, 1, lastRow - 1, sheet.getLastColumn()).clearContent();
  }
  resetHeaders_();
}

function getOrCreateSheet_() {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
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
