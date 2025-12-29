
/**
 * NBC PORTAL - Backend API (server.gs)
 * 1. Paste this into a Google Apps Script.
 * 2. Deploy as Web App (Execute as: Me, Access: Anyone).
 * 3. Copy the Web App URL for use in the GitHub Frontend.
 */

const DB_NAME = "NBC_Portal_Database";
const UPLOADS_FOLDER = "NBC_Portal_Uploads";

// Handle GET requests (Initial data fetch)
function doGet(e) {
  try {
    const data = getPortalData();
    return ContentService.createTextOutput(JSON.stringify(data))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ error: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// Handle POST requests (Submissions & Schedules)
function doPost(e) {
  try {
    const params = JSON.parse(e.postData.contents);
    const action = params.action;
    const data = params.payload;
    
    let result;
    if (action === 'saveSubmission') {
      result = saveSubmission(data);
    } else if (action === 'saveSchedule') {
      result = saveSchedule(data);
    } else {
      throw new Error("Invalid action: " + action);
    }
    
    return ContentService.createTextOutput(JSON.stringify(result))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ error: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * DATABASE LOGIC
 */
function getOrCreateDatabase() {
  let ss;
  const files = DriveApp.getFilesByName(DB_NAME);
  if (files.hasNext()) {
    ss = SpreadsheetApp.open(files.next());
  } else {
    ss = SpreadsheetApp.create(DB_NAME);
    initSheets(ss);
  }
  return ss;
}

function initSheets(ss) {
  const tabs = ["Submissions", "Schedules", "DynamicQuestions"];
  tabs.forEach(tab => {
    if (!ss.getSheetByName(tab)) {
      const sheet = ss.insertSheet(tab);
      if (tab === "Submissions") {
        sheet.appendRow(["ID", "Timestamp", "Category", "Branch", "Supervisor", "Area Manager", "District", "Team Leader", "Employees", "Responses JSON", "Image URL"]);
      } else if (tab === "Schedules") {
        sheet.appendRow(["ID", "Timestamp", "Date", "Assign To", "Accompanied By", "District", "Branches", "Purpose", "Approved By"]);
      } else if (tab === "DynamicQuestions") {
        sheet.appendRow(["Category", "ID", "Question Text", "Type", "Options (comma separated)"]);
        sheet.appendRow(["Branch Visit", "bv1", "Overall Cleanliness", "radio", "Excellent,Good,Fair,Poor"]);
        sheet.appendRow(["Employee Evaluation", "ee1", "Punctuality Score", "dropdown", "5,4,3,2,1"]);
      }
    }
  });
  if (ss.getSheetByName("Sheet1")) ss.deleteSheet(ss.getSheetByName("Sheet1"));
}

function saveSubmission(data) {
  const ss = getOrCreateDatabase();
  const sheet = ss.getSheetByName("Submissions");
  let imageUrl = "";

  if (data.image && data.image.includes("base64")) {
    const folder = getOrCreateUploadsFolder();
    const contentType = data.image.substring(5, data.image.indexOf(';'));
    const bytes = Utilities.base64Decode(data.image.split(',')[1]);
    const blob = Utilities.newBlob(bytes, contentType, `Report_${data.id}.jpg`);
    const file = folder.createFile(blob);
    imageUrl = file.getUrl();
  }

  sheet.appendRow([
    data.id, data.timestamp, data.category, data.branchName, data.supervisor, 
    data.areaManager, data.district, data.teamLeader, JSON.stringify(data.employees), 
    JSON.stringify(data.responses), imageUrl
  ]);

  try { generateAndEmailPDF(data, imageUrl); } catch (e) {}
  return { success: true };
}

function saveSchedule(data) {
  const ss = getOrCreateDatabase();
  const sheet = ss.getSheetByName("Schedules");
  sheet.appendRow([
    data.id, data.timestamp, data.date, data.assignTo, data.accompaniedBy, 
    data.district, data.branches.join(", "), data.purpose, data.approvedBy
  ]);
  return { success: true };
}

function getPortalData() {
  const ss = getOrCreateDatabase();
  const submissions = ss.getSheetByName("Submissions").getDataRange().getValues().slice(1);
  const schedules = ss.getSheetByName("Schedules").getDataRange().getValues().slice(1);
  const questions = ss.getSheetByName("DynamicQuestions").getDataRange().getValues().slice(1);
  return { submissions, schedules, questions };
}

function getOrCreateUploadsFolder() {
  const folders = DriveApp.getFoldersByName(UPLOADS_FOLDER);
  let folder = folders.hasNext() ? folders.next() : DriveApp.createFolder(UPLOADS_FOLDER);
  folder.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
  return folder;
}

function generateAndEmailPDF(data, imageUrl) {
  const html = `<html><body style="font-family: sans-serif;">
    <h1 style="color:#FF8C00">NBC REPORT: ${data.category}</h1>
    <p><strong>Branch:</strong> ${data.branchName}</p>
    <p><strong>District:</strong> ${data.district}</p>
    <p><strong>Coordinator:</strong> ${data.supervisor}</p>
    <hr/>
    <h3>Evaluation</h3>
    ${Object.entries(data.responses).map(([k,v]) => `<p><strong>${k}:</strong> ${v}</p>`).join("")}
    ${imageUrl ? `<img src="${imageUrl}" style="max-width:100%"/>` : ""}
  </body></html>`;
  const pdf = HtmlService.createHtmlOutput(html).getAs('application/pdf').setName(`Report_${data.branchName}.pdf`);
  MailApp.sendEmail("ianianguro@gmail.com", `NBC Portal Report: ${data.branchName}`, "See attached.", { attachments: [pdf] });
}
