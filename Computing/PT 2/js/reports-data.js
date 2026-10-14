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

export function getReportDetails(record) {
  const value = (column) => String(record[column] || "").trim();
  return {
    type: value("Report type"),
    item: value("Item name") || "Item not specified",
    place: value("Last seen or found location"),
    date: value("Date lost or found"),
    note: value("Identifying details"),
    image: photoSource(value("Image URL")),
    status: value("Status").toLowerCase() || "unclaimed",
    key: value("Timestamp"),
  };
}

export function formatDate(value) {
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

export function bridgeMessage(event) {
  if (typeof event.data === "object") return event.data;
  try {
    return JSON.parse(event.data);
  } catch {
    return null;
  }
}
