/**
 * Public form bridge for the LPU Laguna Lost & Found site.
 * Set LF_BRIDGE_FORM_ID below, run prepareCustomFormBridge(), then deploy as a web app
 * executing as the form owner. The public custom form posts to doPost().
 */
const LF_BRIDGE_FORM_ID = "1jRpUozCXSnY_XVct5TLksrUWatjHn8_PJIeWM7xeH-o";
const LF_BRIDGE_PHOTO_FOLDER_NAME = "LPU Laguna Lost and Found Photos";
const LF_BRIDGE_PHOTO_URL_TITLE = "Photo URL (custom upload)";
const LF_BRIDGE_MAX_PHOTO_BYTES = 2500000;
const LF_BRIDGE_CLAIMS_NAME = "LPU Laguna Lost and Found Claims";
// Keep status on the form response/source sheet, not on a formula-driven board tab.
const LF_BRIDGE_STATUS_SHEET_ID = "USE_FORM_DESTINATION";
const LF_BRIDGE_STATUS_TAB_NAME = "Form Responses 1";
const LF_BRIDGE_STATUS_HEADER = "Status";

function prepareCustomFormBridge() {
  if (LF_BRIDGE_FORM_ID === "PASTE_FORM_ID_FROM_EDIT_URL_HERE") {
    throw new Error(
      "Set FORM_ID from the Google Form edit URL before running setup.",
    );
  }
  const form = FormApp.openById(LF_BRIDGE_FORM_ID);
  const existingPhotoUrl = form
    .getItems()
    .some((item) => item.getTitle() === LF_BRIDGE_PHOTO_URL_TITLE);
  if (!existingPhotoUrl) {
    form
      .addTextItem()
      .setTitle(LF_BRIDGE_PHOTO_URL_TITLE)
      .setHelpText("Photo link added by the campus website.")
      .setRequired(false);
  }

  const folders = DriveApp.getFoldersByName(LF_BRIDGE_PHOTO_FOLDER_NAME);
  const folder = folders.hasNext()
    ? folders.next()
    : DriveApp.createFolder(LF_BRIDGE_PHOTO_FOLDER_NAME);
  PropertiesService.getScriptProperties().setProperty(
    "PHOTO_FOLDER_ID",
    folder.getId(),
  );
  let claimsId =
    PropertiesService.getScriptProperties().getProperty("CLAIMS_SHEET_ID");
  if (!claimsId) {
    const claims = SpreadsheetApp.create(LF_BRIDGE_CLAIMS_NAME);
    claims
      .getSheets()[0]
      .appendRow([
        "Submitted at",
        "Report key",
        "Claimant name",
        "Claimant contact",
        "Proof",
        "Review status",
      ]);
    claimsId = claims.getId();
    PropertiesService.getScriptProperties().setProperty(
      "CLAIMS_SHEET_ID",
      claimsId,
    );
  }
  ensureClaimsHeaders_(SpreadsheetApp.openById(claimsId).getSheets()[0]);
  Logger.log("Bridge is ready for form: " + form.getEditUrl());
  Logger.log("Uploaded photos will be stored in: " + folder.getUrl());
}

function doGet(event) {
  const token = event?.parameter?.claim || "";
  const decision = event?.parameter?.decision || "";
  if (!token || !["approve", "decline"].includes(decision)) {
    return HtmlService.createHtmlOutput("This claim link is not valid.");
  }
  try {
    const result = decideClaim_(token, decision);
    return HtmlService.createHtmlOutput(result);
  } catch (error) {
    return HtmlService.createHtmlOutput(
      "This claim could not be updated: " + (error.message || "try again."),
    );
  }
}

function doPost(event) {
  let payload = {};
  let uploadedFile = null;
  try {
    if (!event || !event.parameter || !event.parameter.payload) {
      throw new Error("The report could not be read. Please try again.");
    }
    payload = JSON.parse(event.parameter.payload);
    if (payload.kind === "claim") {
      const notified = saveClaim_(payload);
      return bridgeReply_(
        payload.nonce,
        true,
        notified
          ? "Claim received. The poster was notified by email."
          : "Claim received. No poster email was available for this post.",
      );
    }
    validatePayload_(payload);
    const form = FormApp.openById(LF_BRIDGE_FORM_ID);
    let photoUrl = "";
    if (payload.photoData) {
      uploadedFile = savePhoto_(payload);
      photoUrl = uploadedFile.getUrl();
    }
    const response = form.createResponse();
    const items = form.getItems();
    const answers = {
      "Report type": payload.reportType,
      "Item name": payload.itemName,
      "Date lost or found": payload.reportDate,
      "Last seen or found location": payload.location,
      "Identifying details": payload.details || "",
      "Contact email or phone number": payload.contact,
      "Contact email": payload.contact,
      "Your contact email or phone number": payload.contact,
      "Email address or phone number": payload.contact,
      [LF_BRIDGE_PHOTO_URL_TITLE]: photoUrl,
    };

    items.forEach((item) => {
      const title = item.getTitle();
      if (!Object.prototype.hasOwnProperty.call(answers, title)) return;
      const answer = answers[title];
      if (
        answer === "" &&
        title !== LF_BRIDGE_PHOTO_URL_TITLE &&
        title !== "Identifying details"
      )
        return;
      const type = item.getType();
      if (type === FormApp.ItemType.MULTIPLE_CHOICE) {
        response.withItemResponse(
          item.asMultipleChoiceItem().createResponse(answer),
        );
      } else if (type === FormApp.ItemType.TEXT) {
        response.withItemResponse(item.asTextItem().createResponse(answer));
      } else if (type === FormApp.ItemType.PARAGRAPH_TEXT) {
        response.withItemResponse(
          item.asParagraphTextItem().createResponse(answer),
        );
      } else if (type === FormApp.ItemType.DATE && answer) {
        const parts = answer.split("-").map(Number);
        response.withItemResponse(
          item
            .asDateItem()
            .createResponse(new Date(parts[0], parts[1] - 1, parts[2])),
        );
      }
    });

    response.submit();
    return bridgeReply_(
      payload.nonce,
      true,
      "Report submitted. Thank you for helping a fellow Lycean.",
    );
  } catch (error) {
    if (uploadedFile) uploadedFile.setTrashed(true);
    console.error(error);
    return bridgeReply_(
      payload.nonce || "",
      false,
      error.message || "The report could not be submitted.",
    );
  }
}

function saveClaim_(payload) {
  if (
    !payload.reportKey ||
    !payload.claimantName ||
    !payload.claimantContact ||
    !payload.proof
  )
    throw new Error("Complete all claim fields.");
  if (
    payload.claimantName.length > 100 ||
    payload.claimantContact.length > 120 ||
    payload.proof.length > 400
  )
    throw new Error("Keep the claim details within the field limits.");
  const claimsId =
    PropertiesService.getScriptProperties().getProperty("CLAIMS_SHEET_ID");
  if (!claimsId)
    throw new Error(
      "Run prepareCustomFormBridge() again before accepting claims.",
    );
  const sheet = SpreadsheetApp.openById(claimsId).getSheets()[0];
  ensureClaimsHeaders_(sheet);
  const token = Utilities.getUuid();
  const values = {
    "Submitted at": new Date(),
    "Report key": payload.reportKey,
    "Claimant name": payload.claimantName,
    "Claimant contact": payload.claimantContact,
    Proof: payload.proof,
    "Review status": "New",
    "Approval token": token,
    Item: payload.reportItem || "",
    Date: payload.reportDate || "",
    Location: payload.reportLocation || "",
  };
  const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  sheet.appendRow(headers.map((header) => values[header] || ""));
  const posterEmail = findPosterEmail_(payload);
  if (posterEmail) {
    const base = ScriptApp.getService().getUrl();
    const approve = `${base}?claim=${encodeURIComponent(token)}&decision=approve`;
    const decline = `${base}?claim=${encodeURIComponent(token)}&decision=decline`;
    MailApp.sendEmail({
      to: posterEmail,
      subject: "A claim was submitted for your LPU Laguna lost and found post",
      body:
        "Someone has submitted a claim for your lost and found post. Review the details below, then choose one link.\n\nItem: " +
        (payload.reportItem || "your posted item") +
        "\n\nProof provided: " +
        payload.proof +
        "\n\nApprove claim: " +
        approve +
        "\n\nDecline claim: " +
        decline +
        "\n\nThe claimant's contact details will be shared only after you approve.",
      htmlBody:
        "<p>Someone has submitted a claim for your lost and found post.</p>" +
        "<p><strong>Item:</strong> " +
        escapeHtml_(payload.reportItem || "your posted item") +
        "</p><p><strong>Proof provided:</strong> " +
        escapeHtml_(payload.proof) +
        '</p><p><a href="' +
        approve +
        '" style="display:inline-block;padding:12px 18px;background:#881a23;color:#fff;text-decoration:none;">Approve claim</a> &nbsp; <a href="' +
        decline +
        '" style="display:inline-block;padding:12px 18px;background:#eee;color:#242831;text-decoration:none;">Decline claim</a></p><p>The claimant\'s contact details will be shared only after you approve.</p>',
    });
    return true;
  }
  return false;
}

function escapeHtml_(value) {
  return String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function ensureClaimsHeaders_(sheet) {
  const required = [
    "Submitted at",
    "Report key",
    "Claimant name",
    "Claimant contact",
    "Proof",
    "Review status",
    "Approval token",
    "Item",
    "Date",
    "Location",
  ];
  const width = Math.max(sheet.getLastColumn(), 1);
  const headers = sheet.getRange(1, 1, 1, width).getValues()[0];
  required.forEach((header) => {
    if (!headers.includes(header)) headers.push(header);
  });
  sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
}

function decideClaim_(token, decision) {
  const claimsId =
    PropertiesService.getScriptProperties().getProperty("CLAIMS_SHEET_ID");
  if (!claimsId) throw new Error("The claims sheet is not configured.");
  const sheet = SpreadsheetApp.openById(claimsId).getSheets()[0];
  ensureClaimsHeaders_(sheet);
  const values = sheet.getDataRange().getValues();
  const headers = values.shift();
  const tokenColumn = headers.indexOf("Approval token");
  const statusColumn = headers.indexOf("Review status");
  const row = values.findIndex((cells) => String(cells[tokenColumn]) === token);
  if (row < 0)
    throw new Error("This claim link has expired or was already removed.");
  const sheetRow = row + 2;
  const currentStatus = String(values[row][statusColumn] || "").toLowerCase();
  if (currentStatus !== "new") {
    return "This claim has already been reviewed.";
  }
  const status = decision === "approve" ? "Approved" : "Declined";
  sheet.getRange(sheetRow, statusColumn + 1).setValue(status);
  const claim = Object.fromEntries(
    headers.map((header, index) => [header, values[row][index]]),
  );
  if (decision === "approve") updateSourceStatus_(claim, "claimed");
  notifyClaimDecision_(claim, decision);
  return decision === "approve"
    ? "Claim approved. The item was marked as claimed and the claimant was notified."
    : "Claim declined. The claimant was notified.";
}

function notifyClaimDecision_(claim, decision) {
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const claimantEmail = String(claim["Claimant contact"] || "").trim();
  if (emailPattern.test(claimantEmail)) {
    MailApp.sendEmail(
      claimantEmail,
      decision === "approve"
        ? "Your lost and found claim was approved"
        : "Your lost and found claim was declined",
      decision === "approve"
        ? "The person who posted this item approved your claim. You can arrange a handoff with them directly."
        : "The person who posted this item could not approve your claim. You may try again with more identifying details.",
    );
  }
  if (decision === "approve") {
    const posterEmail = findPosterEmail_(claim);
    if (posterEmail) {
      MailApp.sendEmail(
        posterEmail,
        "Claim approved for your LPU Laguna lost and found post",
        "You approved the claim for " +
          (claim.Item || "your item") +
          ". The claimant's contact is: " +
          claimantEmail +
          ". Arrange the handoff in a public campus location.",
      );
    }
  }
}

function updateSourceStatus_(claim, status) {
  const sheetId =
    LF_BRIDGE_STATUS_SHEET_ID === "USE_FORM_DESTINATION"
      ? FormApp.openById(LF_BRIDGE_FORM_ID).getDestinationId()
      : LF_BRIDGE_STATUS_SHEET_ID;
  if (!sheetId)
    throw new Error("The form response spreadsheet is not connected.");
  const book = SpreadsheetApp.openById(sheetId);
  const sheet =
    book.getSheetByName(LF_BRIDGE_STATUS_TAB_NAME) || book.getSheets()[0];
  if (!sheet) throw new Error("The form response sheet could not be found.");
  const data = sheet.getDataRange().getValues();
  const headers = data.shift();
  let statusColumn = headers.indexOf(LF_BRIDGE_STATUS_HEADER);
  if (statusColumn < 0) {
    statusColumn = headers.length;
    sheet.getRange(1, statusColumn + 1).setValue(LF_BRIDGE_STATUS_HEADER);
  }
  const itemColumn = headers.findIndex((header) =>
    ["Item name", "Item"].includes(header),
  );
  const locationColumn = headers.findIndex((header) =>
    ["Last seen or found location", "Location"].includes(header),
  );
  const clean = (value) =>
    String(value || "")
      .trim()
      .toLowerCase();
  const row = data.findIndex(
    (cells) =>
      (!claim.Item || clean(cells[itemColumn]) === clean(claim.Item)) &&
      (!claim.Location ||
        clean(cells[locationColumn]) === clean(claim.Location)),
  );
  if (row >= 0) sheet.getRange(row + 2, statusColumn + 1).setValue(status);
}

function findPosterEmail_(payload) {
  const form = FormApp.openById(LF_BRIDGE_FORM_ID);
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const clean = (value) =>
    String(value || "")
      .trim()
      .toLowerCase()
      .replace(/\s+/g, " ");
  const titleKey = (value) => clean(value).replace(/[^a-z0-9]/g, "");
  const getAnswer = (answers, titles) => {
    const wanted = titles.map(titleKey);
    const key = Object.keys(answers).find((title) =>
      wanted.includes(titleKey(title)),
    );
    return key ? answers[key] : "";
  };
  const responses = form.getResponses();
  for (let i = responses.length - 1; i >= 0; i--) {
    const answers = {};
    responses[i].getItemResponses().forEach((itemResponse) => {
      answers[itemResponse.getItem().getTitle()] = String(
        itemResponse.getResponse() || "",
      ).trim();
    });
    const item = getAnswer(answers, ["Item name", "Item", "What is the item?"]);
    const location = getAnswer(answers, [
      "Last seen or found location",
      "Location",
    ]);
    const itemMatches =
      !payload.reportItem || clean(item) === clean(payload.reportItem);
    const locationMatches =
      !payload.reportLocation ||
      clean(location) === clean(payload.reportLocation);
    if (itemMatches && locationMatches) {
      const contact = getAnswer(answers, [
        "Contact email or phone number",
        "Your contact email or phone number",
        "Email address or phone number",
        "Contact email",
        "Email",
      ]);
      return emailPattern.test(contact) ? contact : "";
    }
  }
  return "";
}

function validatePayload_(payload) {
  if (!payload || !["Lost", "Found"].includes(payload.reportType))
    throw new Error("Choose Lost or Found.");
  if (!payload.itemName || payload.itemName.length > 120)
    throw new Error("Add an item name (up to 120 characters).");
  if (!payload.location || payload.location.length > 160)
    throw new Error("Add the last seen or found location.");
  if (!/^\d{4}-\d{2}-\d{2}$/.test(payload.reportDate || ""))
    throw new Error("Choose the date.");
  if (!payload.contact || payload.contact.length > 120)
    throw new Error("Add an email address or phone number.");
  const contactPattern =
    /^([A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}|\+?([0-9][ ()-]*){6,}[0-9])$/;
  if (!contactPattern.test(payload.contact.trim()))
    throw new Error("Enter a valid email address or phone number.");
  if (payload.details && payload.details.length > 600)
    throw new Error("Keep identifying details under 600 characters.");
  if (payload.photoData && payload.photoConsent !== true)
    throw new Error(
      "Please confirm that an uploaded photo may be shown on the public report board.",
    );
}

function savePhoto_(payload) {
  const match = String(payload.photoData).match(
    /^data:image\/(jpeg|png|webp);base64,([A-Za-z0-9+/=]+)$/,
  );
  if (!match) throw new Error("Choose a JPG, PNG, or WebP image.");
  const bytes = Utilities.base64Decode(match[2]);
  if (bytes.length > LF_BRIDGE_MAX_PHOTO_BYTES)
    throw new Error(
      "The compressed photo is too large. Choose a smaller image.",
    );
  const folderId =
    PropertiesService.getScriptProperties().getProperty("PHOTO_FOLDER_ID");
  if (!folderId)
    throw new Error(
      "Run prepareCustomFormBridge() once before deploying the bridge.",
    );
  const safeName = String(payload.itemName || "campus-item")
    .replace(/[^a-z0-9_-]/gi, "-")
    .slice(0, 40);
  const extension = match[1] === "jpeg" ? "jpg" : match[1];
  const blob = Utilities.newBlob(
    bytes,
    "image/" + match[1],
    safeName + "-" + Date.now() + "." + extension,
  );
  const file = DriveApp.getFolderById(folderId).createFile(blob);
  if (payload.photoConsent !== true) {
    file.setTrashed(true);
    throw new Error(
      "Photo sharing consent is required when attaching an image.",
    );
  }
  file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
  return file;
}

function bridgeReply_(nonce, success, message) {
  const result = JSON.stringify({
    type: "lost-found-submit",
    nonce: nonce,
    success: success,
    message: message,
  }).replace(/</g, "\\u003c");
  return HtmlService.createHtmlOutput(
    "<!doctype html><html><body><script>parent.postMessage(" +
      result +
      ", '*');</script></body></html>",
  ).setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}
