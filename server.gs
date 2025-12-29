
/**
 * NBC PORTAL - Training Coordinator (Code.gs)
 * This handles all server-side operations.
 */

const DB_NAME = "NBC_Portal_Database";
const UPLOADS_FOLDER = "NBC_Portal_Uploads";

function doGet() {
  return HtmlService.createHtmlOutputFromFile('index')
    .setTitle('NBC Portal - Training Coordinator')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL)
    .addMetaTag('viewport', 'width=device-width, initial-scale=1');
}

/**
 * DATABASE & FOLDER MANAGEMENT
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
        // Seed initial questions
        sheet.appendRow(["Branch Visit", "bv1", "Is the branch clean?", "radio", "Yes,No,N/A"]);
        sheet.appendRow(["Branch Visit", "bv2", "Equipment Status", "dropdown", "Excellent,Good,Poor"]);
        sheet.appendRow(["Employee Evaluation", "ee1", "Uniform Compliance", "radio", "Yes,No"]);
        sheet.appendRow(["Employee Evaluation", "ee2", "Overall Score", "dropdown", "1,2,3,4,5"]);
        sheet.appendRow(["Report Problem", "rp1", "Severity", "radio", "High,Medium,Low"]);
      }
    }
  });
  const sheet1 = ss.getSheetByName("Sheet1");
  if (sheet1) ss.deleteSheet(sheet1);
}

function getOrCreateUploadsFolder() {
  const folders = DriveApp.getFoldersByName(UPLOADS_FOLDER);
  let folder;
  if (folders.hasNext()) {
    folder = folders.next();
  } else {
    folder = DriveApp.createFolder(UPLOADS_FOLDER);
    folder.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
  }
  return folder;
}

/**
 * DATA STORAGE
 */
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
    data.id,
    data.timestamp,
    data.category,
    data.branchName,
    data.supervisor,
    data.areaManager,
    data.district,
    data.teamLeader,
    JSON.stringify(data.employees),
    JSON.stringify(data.responses),
    imageUrl
  ]);

  try {
    sendEmailReport(data, imageUrl);
  } catch (e) {
    console.error("Email failed: " + e.toString());
  }
  return { success: true };
}

function saveSchedule(data) {
  const ss = getOrCreateDatabase();
  const sheet = ss.getSheetByName("Schedules");
  sheet.appendRow([
    data.id,
    data.timestamp,
    data.date,
    data.assignTo,
    data.accompaniedBy,
    data.district,
    data.branches.join(", "),
    data.purpose,
    data.approvedBy
  ]);

  try {
    sendScheduleEmail(data);
  } catch (e) {
    console.error("Email failed: " + e.toString());
  }
  return { success: true };
}

/**
 * COMMUNICATION & PDF
 */
function sendEmailReport(data, imageUrl) {
  const pdfBlob = generatePDF(data, imageUrl);
  const adminEmail = "ianianguro@gmail.com"; 
  
  MailApp.sendEmail({
    to: adminEmail,
    subject: `[NBC PORTAL] ${data.category} - ${data.branchName}`,
    body: `Attached is the professional report for the ${data.category} conducted at ${data.branchName}.`,
    attachments: [pdfBlob]
  });
}

function sendScheduleEmail(data) {
  const adminEmail = "ianianguro@gmail.com";
  const ccs = "elmer@bon.com.sa";
  
  MailApp.sendEmail({
    to: adminEmail,
    cc: ccs,
    subject: `[NBC SCHEDULE] New Visit: ${data.date}`,
    body: `A new visit has been scheduled.\n\nDate: ${data.date}\nDistrict: ${data.district}\nBranches: ${data.branches.join(", ")}\nAssigned To: ${data.assignTo}`
  });
}

function generatePDF(data, imageUrl) {
  const html = `
    <html>
      <head>
        <style>
          @page { size: A4 portrait; margin: 0.25in; }
          body { font-family: sans-serif; color: #333; font-size: 10pt; line-height: 1.4; margin: 0; }
          .header { border-bottom: 4px solid #FF8C00; padding-bottom: 10px; margin-bottom: 20px; text-align: center; }
          .logo { font-size: 28pt; font-weight: bold; color: #FF8C00; margin: 0; }
          .report-header { background: #444; color: #fff; padding: 10px; text-align: center; font-size: 14pt; margin: 15px 0; border-radius: 4px; font-weight: bold; }
          table { width: 100%; border-collapse: collapse; margin-bottom: 15px; }
          th { background: #f2f2f2; text-align: left; padding: 8px; border: 1px solid #ddd; width: 35%; font-weight: bold; }
          td { padding: 8px; border: 1px solid #ddd; }
          .img-container { text-align: center; margin-top: 20px; border: 1px solid #eee; padding: 10px; }
          .footer { position: fixed; bottom: 0; width: 100%; text-align: center; font-size: 8pt; color: #aaa; border-top: 1px solid #eee; padding-top: 5px; }
        </style>
      </head>
      <body>
        <div class="header">
          <p class="logo">BON CAFE</p>
          <p style="text-transform:uppercase; letter-spacing: 2px; color: #666; font-weight: bold;">Professional Training Portal</p>
        </div>
        <div class="report-header">${data.category.toUpperCase()}</div>
        <table>
          <tr><th>Branch Name</th><td>${data.branchName}</td></tr>
          <tr><th>District</th><td>${data.district}</td></tr>
          <tr><th>Area Manager</th><td>${data.areaManager}</td></tr>
          <tr><th>Supervisor</th><td>${data.supervisor}</td></tr>
          <tr><th>Team Leader</th><td>${data.teamLeader}</td></tr>
          <tr><th>Timestamp</th><td>${data.timestamp}</td></tr>
        </table>
        <h3 style="color: #FF8C00; border-bottom: 1px solid #eee;">Personnel Involved</h3>
        <table>
          <tr><th>Employees</th><td>${data.employees.map(e => `${e.name} (ID: ${e.id})`).join("<br/>")}</td></tr>
        </table>
        <h3 style="color: #FF8C00; border-bottom: 1px solid #eee;">Evaluation Responses</h3>
        <table>
          ${Object.entries(data.responses).map(([q, a]) => `<tr><th>${q}</th><td>${Array.isArray(a) ? a.join(", ") : a}</td></tr>`).join("")}
        </table>
        ${imageUrl ? `<div class="img-container"><strong>Image Evidence:</strong><br/><img src="${imageUrl}" style="max-width: 100%; max-height: 400px; margin-top: 10px;"/></div>` : ""}
        <div class="footer">NBC PORTAL - TRAINING COORDINATOR | Confidential Document | BON Cafe © 2024</div>
      </body>
    </html>
  `;
  return HtmlService.createHtmlOutput(html).getAs('application/pdf').setName(`${data.category}_Report.pdf`);
}

function getPortalData() {
  const ss = getOrCreateDatabase();
  const submissions = ss.getSheetByName("Submissions").getDataRange().getValues().slice(1);
  const schedules = ss.getSheetByName("Schedules").getDataRange().getValues().slice(1);
  const questions = ss.getSheetByName("DynamicQuestions").getDataRange().getValues().slice(1);
  return { submissions, schedules, questions };
}
