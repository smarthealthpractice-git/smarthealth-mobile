const escapeHtml = value => {
  return String(value ?? '').replace(/[&<>"']/g, character => {
    const entities = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;',
    };

    return entities[character];
  });
};

export const buildSummaryHtml = (title, patientName, sections) => {
  const safeTitle = escapeHtml(title);
  const safePatientName = escapeHtml(patientName);
  const renderSection = section => {
  if (!section || !Array.isArray(section.lines) || section.lines.length === 0) return '';

    return `
      <div class="section">
        <h2>${escapeHtml(section.title)}</h2>
        <ul>
          ${section.lines.map(line => `<li>${escapeHtml(line)}</li>`).join('')}
            </ul>
      </div>
    `;
  };

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8"/>
      <title>${safeTitle}</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          padding: 24px;
          color: #222;
          line-height: 1.4;
        }

        h1 {
          font-size: 22px;
          margin-bottom: 4px;
        }

        .meta {
          color: #555;
          margin-bottom: 10px;
        }

        hr {
          border: none;
          border-top: 1px solid #ccc;
          margin: 10px 0 16px;
        }

        .section {
          margin-bottom: 18px;
        }

        h2 {
          font-size: 16px;
          margin-bottom: 6px;
        }

        ul {
          padding-left: 18px;
          margin: 0;
        }

        li {
          margin-bottom: 4px;
        }
      </style>
    </head>

    <body>
      <h1>${safeTitle}</h1>
      <p class="meta">Patient: ${safePatientName}</p>
      <hr/>

      ${(Array.isArray(sections) ? sections : []).map(renderSection).join('')}

    </body>
    </html>
  `;
};

