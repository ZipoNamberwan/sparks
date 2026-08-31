// Global helper function to display PDF preview in an iframe
window.tampilkanPDF = function (url) {
  const container = document.getElementById("preview-container");
  if (!container) return;

  container.innerHTML = `
    <iframe src="${url}" width="100%" height="600px" style="border: none;"></iframe>
  `;

  // Scroll to preview container smoothly
  container.scrollIntoView({ behavior: "smooth" });
};

document.addEventListener("DOMContentLoaded", function () {
  const pathParts = window.location.pathname.split("/");
  const filename = pathParts.pop().replace(".html", "");
  const foldername = pathParts.pop();

  let categoryData = null;
  let subCategoryData = null;

  if (typeof dataSubSidebar !== "undefined") {
    dataSubSidebar.forEach((category) => {
      if (category[foldername]) {
        categoryData = category[foldername];
      }
    });

    if (categoryData) {
      categoryData.forEach((subCategory) => {
        const key = Object.keys(subCategory).find(
          (k) => k.toLowerCase() === filename.toLowerCase()
        );
        if (key) {
          subCategoryData = subCategory[key];
        }
      });
    }
  }

  const container = document.getElementById("dynamic-cards-container");
  if (container && subCategoryData) {
    container.innerHTML = "";

    subCategoryData.forEach((item) => {
      const link = item.Link.trim();
      const isBelum = link === "Belum Tersedia" || !link;
      const isExternalUrl = link.startsWith("http://") || link.startsWith("https://");
      const isPdf = link.toLowerCase().endsWith(".pdf") || (isExternalUrl && link.toLowerCase().includes(".pdf"));

      let iconClass, onClickAttr, hrefAttr, colorClass;

      if (isBelum) {
        iconClass = "fas fa-clock";
        colorClass = "text-warning";
        onClickAttr = "";
        hrefAttr = "";
      } else if (isPdf) {
        iconClass = "fas fa-file-pdf";
        colorClass = "text-danger";
        // If it's a local filename (not starting with http), prepend ../pdf/
        const pdfUrl = isExternalUrl ? link : `../pdf/${link}`;
        onClickAttr = `onclick="tampilkanPDF('${pdfUrl}')" style="cursor: pointer"`;
        hrefAttr = "";
      } else {
        // Google Drive link or other external URL -> open in new tab
        iconClass = "fab fa-google-drive";
        colorClass = "text-success";
        onClickAttr = "";
        hrefAttr = `href="${link}" target="_blank" style="cursor: pointer"`;
      }

      const wrapperTagOpen =
        hrefAttr || onClickAttr
          ? `<a ${hrefAttr} ${onClickAttr}>`
          : `<a>`;

      const cardHtml = `
        <div class="col-lg-6 col-md-6 col-sm-12 mb-3">
          <div class="card shadow">
            <div class="card-body">
              ${wrapperTagOpen}
                <i class="${iconClass} ${colorClass} display-4"></i><br />
                <h4>${item.Tahun}${isBelum ? " (Coming Soon)" : ""}</h4>
              </a>
            </div>
          </div>
        </div>
      `;
      container.innerHTML += cardHtml;
    });
  }
});


