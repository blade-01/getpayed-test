import { toPng } from "html-to-image";
import jsPDF from "jspdf";

export async function downloadPdfFromNode(
  node: HTMLElement,
  name = "dashboard.pdf"
) {
  // optional: temporarily disable transitions/animations for crisp capture
  const prev = node.style.transition;
  node.style.transition = "none";

  const dataUrl = await toPng(node, {
    cacheBust: true,
    pixelRatio: 2 // sharper
    // filter: (n) => !n.classList?.contains('no-print') // optional
  });

  node.style.transition = prev;

  const pdf = new jsPDF({ orientation: "landscape", unit: "px" });
  const pageW = pdf.internal.pageSize.getWidth();
  const pageH = pdf.internal.pageSize.getHeight();

  const img = new Image();
  img.src = dataUrl;
  await img.decode();

  const ratio = Math.min(pageW / img.width, pageH / img.height);
  const w = img.width * ratio;
  const h = img.height * ratio;

  pdf.addImage(dataUrl, "PNG", (pageW - w) / 2, (pageH - h) / 2, w, h);
  pdf.save(name);
}
