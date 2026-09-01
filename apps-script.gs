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
  "University",
  "Faculty",
  "Gender",
  "Eraasoft Student",
  "Group Code",
  "Branch",
  "Instructor",
  "Training Type",
  "Track",
  "Project Link",
  "Academic Status"
];

function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.waitLock(20000); // serialize submissions so the duplicate check is race-free
  try {
    const sheet = getOrCreateSheet_();
    const data = e.parameter;
    const email = String(data.email || "").trim().toLowerCase();

    if (email && emailExists_(sheet, email)) {
      return jsonOutput_({ result: "duplicate", message: "This email is already registered." });
    }

    sheet.appendRow([
      new Date(),
      data.fullName || "",
      data.email || "",
      data.phone || "",
      data.whatsapp || "",
      data.age || "",
      data.nationalId || "",
      data.governorate || "",
      data.university || "",
      data.faculty || "",
      data.gender || "",
      data.isEraasoftStudent || "",
      data.groupCode || "",
      data.branch || "",
      data.instructor || "",
      data.trainingType || "",
      data.track || "",
      data.projectLink || "",
      data.academicStatus || ""
    ]);

    return jsonOutput_({ result: "success" });
  } catch (err) {
    console.error("doPost failed: " + err.stack);
    throw err;
  } finally {
    lock.releaseLock();
  }
}

// Returns true if the given (already lowercased/trimmed) email is present in the
// Email column of any existing response row.
function emailExists_(sheet, email) {
  const lastRow = sheet.getLastRow();
  if (lastRow < 2) return false;
  const emailCol = HEADERS.indexOf("Email") + 1;
  const values = sheet.getRange(2, emailCol, lastRow - 1, 1).getValues();
  return values.some(function (row) {
    return String(row[0]).trim().toLowerCase() === email;
  });
}

function jsonOutput_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
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
