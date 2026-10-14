import { bridgeMessage } from "./reports-data.js?v=2";

export function initReportForm() {
  const form = document.getElementById("report-form");
  const status = document.getElementById("form-status");
  const submitUrl = window.LOST_FOUND_SUBMIT_URL;
  const bridgeFrame = document.querySelector('iframe[name="bridge-frame"]');
  const dateInput = document.getElementById("report-date");
  if (dateInput) dateInput.max = new Date().toISOString().slice(0, 10);

  function compressPhoto(file) {
    return new Promise((resolve, reject) => {
      if (!file) return resolve("");
      if (!/^image\//.test(file.type))
        return reject(new Error("Choose an image file."));
      const reader = new FileReader();
      reader.onerror = () => reject(new Error("The photo could not be read."));
      reader.onload = () => {
        const image = new Image();
        image.onerror = () => reject(new Error("The photo could not be opened."));
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

  if (!form || !status || !bridgeFrame) return;

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
        textContent: "Browse found items",
      }),
      document.createTextNode("."),
    );
  }

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (!form.reportValidity()) return;
    if (!dateInput.value) {
      dateInput.focus();
      status.className = "form-status error";
      status.textContent = "Choose the date you found the item.";
      return;
    }
    if (!submitUrl || submitUrl === "PASTE_APPS_SCRIPT_WEB_APP_URL_HERE") {
      status.className = "form-status error";
      status.textContent =
        "The report form is not connected yet. Add the deployed Apps Script URL in js/form-config.js.";
      return;
    }
    const data = new FormData(form);
    const photo = data.get("photo");
    const hasPhoto = photo && photo.size > 0;
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
    let replyReceived = false;
    let onReply;
    const onFrameLoad = () => {
      setTimeout(() => {
        if (replyReceived || !button.disabled) return;
        window.removeEventListener("message", onReply);
        button.disabled = false;
        status.className = "form-status error";
        status.textContent =
          "The form finished sending, but no confirmation came back. Check your report before trying again.";
      }, 500);
    };

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

      onReply = (event) => {
        const reply = bridgeMessage(event);
        if (reply?.type !== "lost-found-submit" || reply?.nonce !== payload.nonce)
          return;
        replyReceived = true;
        bridgeFrame.removeEventListener("load", onFrameLoad);
        window.removeEventListener("message", onReply);
        button.disabled = false;
        if (reply.success) showSuccess(reply.message);
        else {
          status.className = "form-status error";
          status.textContent = reply.message;
        }
        if (reply.success) {
          form.reset();
          if (photoPreview) photoPreview.hidden = true;
          if (photoUrl) URL.revokeObjectURL(photoUrl);
          photoUrl = "";
        }
      };

      window.addEventListener("message", onReply);
      bridgeFrame.addEventListener("load", onFrameLoad, { once: true });
      document.body.append(postForm);
      postForm.submit();
      setTimeout(() => postForm.remove(), 2000);
      setTimeout(() => {
        window.removeEventListener("message", onReply);
        bridgeFrame.removeEventListener("load", onFrameLoad);
        if (!button.disabled) return;
        button.disabled = false;
        status.className = "form-status error";
        status.textContent =
          "No response came back. Check your connection and try again.";
      }, 45000);
    } catch (error) {
      button.disabled = false;
      status.className = "form-status error";
      status.textContent = error.message || "The report could not be sent.";
    }
  });
}
