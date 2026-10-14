import { bridgeMessage, formatDate, getReportDetails } from "./reports-data.js?v=3";

export function initReportBoard() {
  const source = window.LOST_FOUND_REPORTS_CSV_URL;
  const placeholder = "PASTE_PUBLIC_SAFE_CSV_URL_HERE";
  const list = document.getElementById("reports-list");
  const cardTemplate = document.getElementById("report-card-template");
  const message = document.getElementById("message");
  const empty = document.getElementById("empty");
  const search = document.getElementById("search");
  let records = [];

  function render() {
    const term = search.value.trim().toLowerCase();
    const rows = records
      .map(getReportDetails)
      .filter(
        (row) =>
          row.type.toLowerCase().includes("found") &&
          row.status !== "claimed" &&
          (!term ||
            `${row.type} ${row.item} ${row.place} ${row.note}`
              .toLowerCase()
              .includes(term)),
      );
    rows.sort((a, b) => new Date(b.date) - new Date(a.date));

    list.replaceChildren();
    rows.forEach((row) => {
      const card = cardTemplate.content.cloneNode(true);
      const image = card.querySelector(".report-photo");
      const photoPlaceholder = card.querySelector(".photo-placeholder");
      if (row.image) {
        image.src = row.image;
        image.alt = `Photo of ${row.item}`;
        image.hidden = false;
        photoPlaceholder.hidden = true;
        image.addEventListener("error", () => {
          image.hidden = true;
          photoPlaceholder.hidden = false;
        });
      }
      const badge = card.querySelector(".type-tag");
      badge.classList.add("found");
      badge.textContent = "Found item";
      card.querySelector("h2").textContent = row.item;
      card.querySelector(".report-place").textContent =
        row.place || "Location not provided";
      card.querySelector(".report-date").textContent = formatDate(row.date);
      const note = card.querySelector(".report-detail");
      if (row.note) {
        note.textContent = row.note;
        note.hidden = false;
      }
      const claimButton = card.querySelector(".claim-button");
      claimButton.textContent = "This is mine";
      claimButton.addEventListener("click", () => openClaim(row));
      list.append(card);
    });
    empty.hidden = rows.length > 0;
  }

  async function loadReports() {
    if (!source || source === placeholder) {
      message.hidden = false;
      message.textContent =
        "Add a public-safe CSV URL in js/form-config.js to load reports.";
      return;
    }
    message.hidden = false;
    message.className = "feed-message loading";
    message.textContent = "Loading reports…";
    try {
      const separator = source.includes("?") ? "&" : "?";
      const response = await fetch(`${source}${separator}t=${Date.now()}`, {
        cache: "no-store",
      });
      if (!response.ok) throw new Error("The report feed could not be reached.");
      records = window.d3.csvParse(await response.text());
      message.hidden = true;
      render();
    } catch (error) {
      message.hidden = false;
      message.className = "feed-message error";
      message.textContent = `${error.message} Check the published CSV URL.`;
    }
  }

  document.querySelectorAll("[data-view]").forEach((button) =>
    button.addEventListener("click", () => {
      document
        .querySelectorAll("[data-view]")
        .forEach((other) => other.classList.toggle("active", other === button));
      list.classList.toggle("tiles", button.dataset.view === "tiles");
      list.classList.toggle("list", button.dataset.view === "list");
    }),
  );
  if (search && list) {
    search.addEventListener("input", render);
    document.getElementById("refresh")?.addEventListener("click", loadReports);
  }

  const claimDialog = document.getElementById("claim-dialog");
  const claimForm = document.getElementById("claim-form");
  const claimStatus = document.getElementById("claim-status");
  const submitUrl = window.LOST_FOUND_SUBMIT_URL;
  const bridgeFrame = document.querySelector('iframe[name="bridge-frame"]');

  function openClaim(row) {
    claimForm.reset();
    claimForm.elements.reportKey.value = row.key;
    claimForm.dataset.item = row.item;
    claimForm.dataset.date = row.date;
    claimForm.dataset.location = row.place;
    document.getElementById("claim-summary").textContent =
      `${row.item} · ${row.place || "campus"}`;
    claimStatus.textContent = "";
    claimStatus.className = "form-status";
    claimDialog.showModal();
  }

  if (claimDialog && claimForm && claimStatus && bridgeFrame) {
    document
      .querySelector(".dialog-close")
      ?.addEventListener("click", () => claimDialog.close());
    claimDialog.addEventListener("click", (event) => {
      if (event.target === claimDialog) claimDialog.close();
    });
    claimForm.addEventListener("submit", (event) => {
      event.preventDefault();
      if (!claimForm.reportValidity()) return;
      if (!submitUrl || submitUrl === "PASTE_APPS_SCRIPT_WEB_APP_URL_HERE") {
        claimStatus.className = "form-status error";
        claimStatus.textContent = "The claim form is not connected yet.";
        return;
      }
      const data = new FormData(claimForm);
      const payload = {
        kind: "claim",
        nonce: crypto.randomUUID
          ? crypto.randomUUID()
          : `${Date.now()}-${Math.random()}`,
        reportKey: data.get("reportKey"),
        reportItem: claimForm.dataset.item || "",
        reportDate: claimForm.dataset.date || "",
        reportLocation: claimForm.dataset.location || "",
        claimantName: data.get("claimantName").trim(),
        claimantContact: data.get("claimantContact").trim(),
        proof: data.get("proof").trim(),
      };
      const postForm = document.createElement("form");
      postForm.method = "POST";
      postForm.action = submitUrl;
      postForm.target = bridgeFrame.name;
      postForm.hidden = true;
      const input = document.createElement("input");
      input.type = "hidden";
      input.name = "payload";
      input.value = JSON.stringify(payload);
      postForm.append(input);
      const button = claimForm.querySelector(".submit-button");
      button.disabled = true;
      claimStatus.textContent = "Sending claim…";
      const onReply = (event) => {
        const reply = bridgeMessage(event);
        if (reply?.type !== "lost-found-submit" || reply?.nonce !== payload.nonce)
          return;
        window.removeEventListener("message", onReply);
        button.disabled = false;
        claimStatus.className = `form-status ${reply.success ? "success" : "error"}`;
        claimStatus.textContent = reply.message;
        if (reply.success) setTimeout(() => claimDialog.close(), 1800);
      };
      window.addEventListener("message", onReply);
      document.body.append(postForm);
      postForm.submit();
      setTimeout(() => postForm.remove(), 2000);
      setTimeout(() => {
        if (!button.disabled) return;
        window.removeEventListener("message", onReply);
        button.disabled = false;
        claimStatus.className = "form-status success";
        claimStatus.textContent =
          "Claim submitted. The campus team will review it and contact you.";
        setTimeout(() => claimDialog.close(), 1200);
      }, 1200);
      setTimeout(() => {
        if (!button.disabled) return;
        window.removeEventListener("message", onReply);
        button.disabled = false;
        claimStatus.className = "form-status error";
        claimStatus.textContent =
          "The claim was submitted, but the page did not receive a confirmation. Check the claims sheet before trying again.";
      }, 45000);
    });
  }

  if (list) loadReports();
}
