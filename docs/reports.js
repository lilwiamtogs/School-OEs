(() => {
  const source = window.LOST_FOUND_REPORTS_CSV_URL;
  const placeholder = "PASTE_PUBLIC_SAFE_CSV_URL_HERE";
  const list = document.getElementById("reports-list");
  const message = document.getElementById("message");
  const empty = document.getElementById("empty");
  const search = document.getElementById("search");
  const filter = document.getElementById("type-filter");
  const typeTrigger = document.getElementById("type-filter-trigger");
  const typeMenu = document.getElementById("type-filter-menu");
  if (typeTrigger && typeMenu && filter) {
    typeTrigger.addEventListener("click", () => {
      typeMenu.hidden = !typeMenu.hidden;
    });
    typeMenu.addEventListener("click", (event) => {
      const option = event.target.closest("[data-value]");
      if (!option) return;
      filter.value = option.dataset.value;
      typeTrigger.textContent = option.textContent;
      typeMenu.hidden = true;
      render();
    });
    document.addEventListener("click", (event) => {
      if (!event.target.closest(".custom-select")) {
        typeMenu.hidden = true;
      }
    });
  }
  let records = [];

  function parseCsv(text) {
    const rows = [];
    let row = [],
      value = "",
      quoted = false;
    for (let i = 0; i < text.length; i++) {
      const ch = text[i];
      if (ch === '"' && quoted && text[i + 1] === '"') {
        value += '"';
        i++;
      } else if (ch === '"') quoted = !quoted;
      else if (ch === "," && !quoted) {
        row.push(value);
        value = "";
      } else if ((ch === "\n" || ch === "\r") && !quoted) {
        if (ch === "\r" && text[i + 1] === "\n") i++;
        row.push(value);
        if (row.some((cell) => cell.trim())) rows.push(row);
        row = [];
        value = "";
      } else value += ch;
    }
    if (value || row.length) {
      row.push(value);
      rows.push(row);
    }
    return rows;
  }
  const norm = (value) => value.toLowerCase().replace(/[^a-z0-9]/g, "");
  function field(record, names) {
    const name = Object.keys(record).find((key) =>
      names.map(norm).includes(norm(key)),
    );
    return name ? String(record[name] || "").trim() : "";
  }
  function photoSource(value) {
    if (!value) return "";
    const cleaned = String(value).replace(/^HYPERLINK\("([^"]+)".*\)$/i, "$1");
    const id =
      cleaned.match(
        /drive\.google\.com\/(?:file\/d\/|open\?id=|uc\?.*id=)([\w-]+)/i,
      )?.[1] || cleaned.match(/[?&]id=([\w-]+)/i)?.[1];
    const raw = id
      ? `https://drive.google.com/thumbnail?id=${id}&sz=w1200`
      : cleaned;
    try {
      const url = new URL(raw);
      return url.protocol === "https:" ? url.href : "";
    } catch {
      return "";
    }
  }
  function details(record) {
    return {
      type: field(record, [
        "Report type",
        "Type",
        "Lost or found",
        "Did you lose or find?",
        "Did you lose it or find it?",
      ]),
      item:
        field(record, [
          "Item",
          "Item name",
          "Object",
          "What is the item?",
          "What’s the item called?",
          "What item are we looking for?",
        ]) || "Item not specified",
      place: field(record, [
        "Location",
        "Last seen or found location",
        "Where was it seen?",
        "Where did you see it last?",
        "Last seen where?",
      ]),
      date: field(record, [
        "Date",
        "Date lost or found",
        "When?",
        "When was it?",
      ]),
      note: field(record, [
        "Identifying details",
        "Description",
        "One special detail",
        "A detail that could help identify it",
        "Distinguishing details",
      ]),
      image: photoSource(
        field(record, [
          "Image URL",
          "Photo URL",
          "Photo URL (custom upload)",
          "Image",
          "Photo",
          "Photo upload",
          "Item image",
        ]),
      ),
      status:
        field(record, [
          "Status",
          "Claim status",
          "Report status",
        ]).toLowerCase() || "unclaimed",
      key:
        field(record, ["Report ID", "ID", "Timestamp"]) ||
        `${field(record, ["Item", "Item name"])}-${field(record, ["Date", "Date lost or found"])}-${field(record, ["Location", "Last seen or found location"])}`,
    };
  }
  function formatDate(value) {
    if (!value) return "Date not provided";
    const date = new Date(value);
    return Number.isNaN(date.getTime())
      ? value
      : new Intl.DateTimeFormat(undefined, {
          month: "short",
          day: "numeric",
          year: "numeric",
        }).format(date);
  }
  function render() {
    const term = search.value.trim().toLowerCase(),
      selected = filter.value;
    const rows = records
      .map(details)
      .filter(
        (row) =>
          row.status !== "claimed" &&
          (selected === "all" || row.type.toLowerCase() === selected) &&
          (!term ||
            `${row.type} ${row.item} ${row.place} ${row.note}`
              .toLowerCase()
              .includes(term)),
      );
    list.replaceChildren();
    rows.forEach((row) => {
      const card = document.createElement("article");
      card.className = "report-card";
      if (row.image) {
        const image = document.createElement("img");
        image.className = "report-photo";
        image.src = row.image;
        image.alt = `Photo of ${row.item}`;
        image.loading = "lazy";
        image.onerror = () => image.remove();
        card.append(image);
      } else {
        const placeholderArt = document.createElement("div");
        placeholderArt.className = "photo-placeholder";
        placeholderArt.textContent = "NO PHOTO";
        card.append(placeholderArt);
      }
      const content = document.createElement("div");
      content.className = "report-card-content";
      const badge = document.createElement("span");
      badge.className = `type-tag ${row.type.toLowerCase() === "lost" ? "lost" : "found"}`;
      badge.textContent =
        row.type.toLowerCase() === "lost" ? "Looking for" : "Found item";
      const title = document.createElement("h2");
      title.textContent = row.item;
      const place = document.createElement("p");
      place.className = "report-place";
      place.textContent = row.place || "Location not provided";
      const date = document.createElement("p");
      date.className = "report-date";
      date.textContent = formatDate(row.date);
      content.append(badge, title, place, date);
      if (row.note) {
        const note = document.createElement("p");
        note.className = "report-detail";
        note.textContent = row.note;
        content.append(note);
      }
      const claim = document.createElement("button");
      claim.type = "button";
      claim.className = "claim-button";
      claim.textContent = "This is mine";
      claim.addEventListener("click", () => openClaim(row));
      content.append(claim);
      card.append(content);
      list.append(card);
    });
    empty.hidden = rows.length > 0;
  }
  async function loadReports() {
    if (!source || source === placeholder) {
      message.hidden = false;
      message.textContent =
        "Add a public-safe CSV URL in form-config.js to load reports.";
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
      if (!response.ok)
        throw new Error("The report feed could not be reached.");
      const rows = parseCsv(await response.text());
      if (rows.length < 2) {
        records = [];
        message.hidden = true;
        render();
        return;
      }
      const headers = rows[0].map((value) => value.trim());
      records = rows
        .slice(1)
        .map((cells) =>
          Object.fromEntries(
            headers.map((header, i) => [header, cells[i] || ""]),
          ),
        );
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
  if (search && filter && list) {
    search.addEventListener("input", render);
    filter.addEventListener("change", render);
    document.getElementById("refresh")?.addEventListener("click", loadReports);
  }
  const form = document.getElementById("report-form");
  const status = document.getElementById("form-status");
  const submitUrl = window.LOST_FOUND_SUBMIT_URL;
  const bridgeFrame = document.querySelector('iframe[name="bridge-frame"]');
  const dateInput = document.getElementById("report-date");
  const nativeDate = document.getElementById("report-date-native");
  const dateTrigger = document.getElementById("date-trigger");
  const datePicker = document.getElementById("date-picker");
  if (dateInput && dateTrigger && datePicker) {
    dateInput.max = new Date().toISOString().slice(0, 10);
    nativeDate?.addEventListener("input", () => {
      dateInput.value = nativeDate.value;
      dateTrigger.textContent = nativeDate.value || "Choose a date";
    });
    let calendarMonth = new Date();
    function renderCalendar() {
      const year = calendarMonth.getFullYear();
      const month = calendarMonth.getMonth();
      const firstDay = new Date(year, month, 1).getDay();
      const days = new Date(year, month + 1, 0).getDate();
      const labels = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
      datePicker.innerHTML = `<div class="calendar-head"><button type="button" data-calendar="previous">‹</button><strong>${calendarMonth.toLocaleString(undefined, { month: "long", year: "numeric" })}</strong><button type="button" data-calendar="next">›</button></div><div class="calendar-week">${labels.map((label) => `<span>${label}</span>`).join("")}</div><div class="calendar-days"></div>`;
      const daysElement = datePicker.querySelector(".calendar-days");
      for (let i = 0; i < firstDay; i++)
        daysElement.append(document.createElement("span"));
      for (let day = 1; day <= days; day++) {
        const button = document.createElement("button");
        button.type = "button";
        button.textContent = day;
        const value = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
        if (value === dateInput.value) button.className = "selected";
        button.addEventListener("click", () => {
          dateInput.value = value;
          dateTrigger.textContent = new Intl.DateTimeFormat(undefined, {
            month: "short",
            day: "numeric",
            year: "numeric",
          }).format(new Date(year, month, day));
          datePicker.hidden = true;
        });
        daysElement.append(button);
      }
    }
    dateTrigger.addEventListener("click", () => {
      datePicker.hidden = !datePicker.hidden;
      if (!datePicker.hidden) renderCalendar();
    });
    datePicker.addEventListener("click", (event) => {
      const action = event.target.dataset.calendar;
      if (!action) return;
      calendarMonth.setMonth(
        calendarMonth.getMonth() + (action === "next" ? 1 : -1),
      );
      renderCalendar();
    });
  }
  function bridgeMessage(event) {
    if (typeof event.data === "object") return event.data;
    try {
      return JSON.parse(event.data);
    } catch {
      return null;
    }
  }
  const claimDialog = document.getElementById("claim-dialog");
  const claimForm = document.getElementById("claim-form");
  const claimStatus = document.getElementById("claim-status");
  if (claimDialog && claimForm && claimStatus) {
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
      const data = new FormData(claimForm),
        payload = {
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
        if (
          reply?.type !== "lost-found-submit" ||
          reply?.nonce !== payload.nonce
        )
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
        if (button.disabled) {
          window.removeEventListener("message", onReply);
          button.disabled = false;
          button.removeAttribute("disabled");
          claimStatus.className = "form-status success";
          claimStatus.textContent =
            "Claim submitted. The campus team will review it and contact you.";
          setTimeout(() => claimDialog.close(), 1200);
        }
      }, 1200);
      setTimeout(() => {
        if (button.disabled) {
          window.removeEventListener("message", onReply);
          button.disabled = false;
          claimStatus.className = "form-status error";
          claimStatus.textContent =
            "The claim was submitted, but the page did not receive a confirmation. Check the claims sheet before trying again.";
        }
      }, 45000);
    });
  }
  function compressPhoto(file) {
    return new Promise((resolve, reject) => {
      if (!file) return resolve("");
      if (!/^image\//.test(file.type))
        return reject(new Error("Choose an image file."));
      const reader = new FileReader();
      reader.onerror = () => reject(new Error("The photo could not be read."));
      reader.onload = () => {
        const image = new Image();
        image.onerror = () =>
          reject(new Error("The photo could not be opened."));
        image.onload = () => {
          const scale = Math.min(1, 1280 / Math.max(image.width, image.height));
          const canvas = document.createElement("canvas");
          canvas.width = Math.round(image.width * scale);
          canvas.height = Math.round(image.height * scale);
          canvas
            .getContext("2d")
            .drawImage(image, 0, 0, canvas.width, canvas.height);
          resolve(canvas.toDataURL("image/jpeg", 0.8));
        };
        image.src = reader.result;
      };
      reader.readAsDataURL(file);
    });
  }
  if (form && status && bridgeFrame) {
    const tipsButton = document.getElementById("tips-button");
    const tipsList = document.querySelector(".tips-list");
    const photoInput = form.elements.photo;
    const photoPreview = document.getElementById("photo-preview");
    const removePhoto = document.getElementById("remove-photo");
    let photoUrl = "";
    tipsButton?.addEventListener("click", () => {
      tipsList?.classList.toggle("open");
    });
    photoInput?.addEventListener("change", () => {
      const file = photoInput.files?.[0];
      if (photoUrl) URL.revokeObjectURL(photoUrl);
      if (!file || !photoPreview) return;
      photoUrl = URL.createObjectURL(file);
      photoPreview.querySelector("img").src = photoUrl;
      photoPreview.hidden = false;
    });
    removePhoto?.addEventListener("click", () => {
      photoInput.value = "";
      photoPreview.hidden = true;
      if (photoUrl) URL.revokeObjectURL(photoUrl);
      photoUrl = "";
    });
    function showSuccess(message) {
      status.className = "form-status success";
      status.replaceChildren(
        document.createTextNode(
          `${message || "Your report was sent."} The campus team will review it and add it to the board. `,
        ),
        Object.assign(document.createElement("a"), {
          href: "reports.html",
          textContent: "Browse reports",
        }),
        document.createTextNode("."),
      );
    }

    form.addEventListener("submit", async (event) => {
      event.preventDefault();
      if (!form.reportValidity()) return;
      if (!dateInput.value) {
        dateTrigger.focus();
        status.className = "form-status error";
        status.textContent = "Choose the date the item was lost or found.";
        return;
      }
      if (!submitUrl || submitUrl === "PASTE_APPS_SCRIPT_WEB_APP_URL_HERE") {
        status.className = "form-status error";
        status.textContent =
          "The report form is not connected yet. Add the deployed Apps Script URL in form-config.js.";
        return;
      }
      const data = new FormData(form),
        photo = data.get("photo"),
        hasPhoto = photo && photo.size > 0;
      if (hasPhoto && !data.get("photoConsent")) {
        status.className = "form-status error";
        status.textContent =
          "Please agree to the photo sharing note, or remove the photo.";
        return;
      }
      const button = form.querySelector(".submit-button");
      button.disabled = true;
      status.className = "form-status";
      status.textContent = "Sending your report…";
      try {
        const payload = {
          nonce: crypto.randomUUID
            ? crypto.randomUUID()
            : `${Date.now()}-${Math.random()}`,
          reportType: data.get("reportType"),
          itemName: data.get("itemName").trim(),
          reportDate: data.get("reportDate"),
          location: data.get("location").trim(),
          details: data.get("details").trim(),
          contact: data.get("contact").trim(),
          photoConsent: Boolean(data.get("photoConsent")),
          photoData: await compressPhoto(hasPhoto ? photo : null),
        };
        if (payload.photoData.length > 3400000)
          throw new Error(
            "That photo is still too large. Choose a smaller image.",
          );
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
        const onReply = (event) => {
          const reply = bridgeMessage(event);
          if (
            reply?.type !== "lost-found-submit" ||
            reply?.nonce !== payload.nonce
          )
            return;
          window.removeEventListener("message", onReply);
          button.disabled = false;
          if (reply.success) showSuccess(reply.message);
          else {
            status.className = "form-status error";
            status.textContent = reply.message;
          }
          if (reply.success) {
            form.reset();
            dateTrigger.textContent = "Choose a date";
            if (nativeDate) nativeDate.value = "";
            if (photoPreview) photoPreview.hidden = true;
            if (photoUrl) URL.revokeObjectURL(photoUrl);
            photoUrl = "";
            if (list) loadReports();
          }
        };
        window.addEventListener("message", onReply);
        document.body.append(postForm);
        postForm.submit();
        setTimeout(() => postForm.remove(), 2000);
        setTimeout(() => {
          window.removeEventListener("message", onReply);
          if (button.disabled) {
            button.disabled = false;
            status.className = "form-status error";
            status.textContent =
              "No response came back. Check your connection and try again.";
          }
        }, 45000);
      } catch (error) {
        button.disabled = false;
        status.className = "form-status error";
        status.textContent = error.message || "The report could not be sent.";
      }
    });
  }
  if (list) loadReports();
})();
