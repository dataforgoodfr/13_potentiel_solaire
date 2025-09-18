export const printFiche = () => {
  const ficheElement = document.getElementById('fiche-root');
  if (!ficheElement) {
    throw new Error(`La fiche n'a pas été trouvée`);
  }

  const accordions = ficheElement.querySelectorAll(
    '[data-state="closed"], .collapsible-trigger, [aria-expanded="false"]'
  );
  accordions.forEach((accordion) => {
    if (accordion instanceof HTMLElement) {
      accordion.click();
    }
  });

  setTimeout(() => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      throw new Error(`La fenêtre d'impression n'a pas pu être ouverte`);
    }

    const ficheHTML = ficheElement.innerHTML;

    const styles = Array.from(document.styleSheets)
      .map(styleSheet => {
        try {
          return Array.from(styleSheet.cssRules)
            .map(rule => rule.cssText)
            .join('\n');
        } catch (e) {
          return `${e}`;
        }
      })
      .join('\n');

    const printDocument = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Fiche</title>
          <style>
            ${styles}

            /* Print-specific overrides */
            body {
              margin: 0;
              padding: 20px;
              font-family: Verdana, sans-serif;
            }

            /* Page setup */
            @page { size: A4; margin: 1cm; }
          </style>
        </head>
        <body>
          ${ficheHTML}
        </body>
      </html>
    `;

    printWindow.document.write(printDocument);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
    printWindow.close();
  }, 1000);
};
