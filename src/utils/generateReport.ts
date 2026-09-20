import { EligibilityAnalysisResult, SkillGapItem, ActionRecommendation } from '../types/eligibility';

function renderSkillChips(skills: string[]): string {
  return skills.map(s => '<span class="skill-chip">' + s + '</span>').join('');
}

function renderBonusSkills(bonusSkills: string[]): string {
  if (bonusSkills.length === 0) return '';
  const chips = bonusSkills.map(s => '<span class="skill-chip" style="background: transparent;">' + s + '</span>').join('');
  return '<div style="margin-top: 1rem; border-top: 1px solid var(--color-bg-subtle); padding-top: 0.5rem;">' +
    '<div style="font-size: 0.75rem; font-weight: 600; margin-bottom: 0.5rem;">Bonus Skills</div>' +
    chips +
    '</div>';
}

function renderMissingSkills(missingSkills: SkillGapItem[]): string {
  if (missingSkills.length === 0) {
    return '<div style="font-size: 0.875rem; color: var(--color-text-muted)">No critical gaps detected.</div>';
  }
  return missingSkills.map(gap =>
    '<div class="missing-skill">' +
      '<div class="missing-skill-name">' + gap.name + ' <span style="font-size: 0.7rem; font-weight: normal; color: var(--color-text-muted);">(' + gap.levelRequired + ')</span></div>' +
      '<div class="missing-skill-note">' + gap.recommendationNote + '</div>' +
    '</div>'
  ).join('');
}

function renderRecommendations(recommendations: ActionRecommendation[]): string {
  return recommendations.map((rec, i) =>
    '<div class="recommendation">' +
      '<div class="rec-header">' +
        '<div class="rec-title"><span style="color: var(--color-text-muted); font-family: var(--font-mono); margin-right: 0.5rem;">0' + (i + 1) + '</span>' + rec.title + '</div>' +
        '<div class="rec-priority">' + rec.priority + ' Priority</div>' +
      '</div>' +
      '<div class="rec-desc">' + rec.description + '</div>' +
      '<div class="rec-meta">' +
        '<div><strong>Impact:</strong> ' + rec.impact + '</div>' +
        '<div><strong>Effort:</strong> ' + rec.estimatedEffort + '</div>' +
      '</div>' +
    '</div>'
  ).join('');
}

export function generatePDFReport(result: EligibilityAnalysisResult): void {
  const printWindow = window.open('', '_blank');
  if (!printWindow) {
    alert('Please allow popups to generate the PDF report.');
    return;
  }

  const {
    candidate,
    targetRole,
    scores,
    skillsAnalysis,
    recommendations,
    verdictSummary,
    timestamp,
    evaluationId,
  } = result;

  const matchedSkillsHtml = skillsAnalysis.matchedSkills.length > 0
    ? renderSkillChips(skillsAnalysis.matchedSkills)
    : '<div style="font-size: 0.875rem; color: var(--color-text-muted)">No core skills matched.</div>';

  const bonusSkillsHtml = renderBonusSkills(skillsAnalysis.bonusSkills);
  const missingSkillsHtml = renderMissingSkills(skillsAnalysis.missingSkills);
  const recommendationsHtml = renderRecommendations(recommendations);
  const generatedAt = new Date().toLocaleString();

  const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Job Eligibility Report - ${candidate.fullName}</title>
  <style>
    :root {
      --font-sans: 'Geist', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      --font-mono: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
      --color-border: #e4e4e7;
      --color-text: #27272a;
      --color-text-muted: #71717a;
      --color-bg-subtle: #f4f4f5;
    }
    
    @media print {
      @page {
        margin: 1.5cm;
      }
      body {
        -webkit-print-color-adjust: exact;
        print-color-adjust: exact;
      }
      .page-break {
        page-break-before: always;
      }
    }
    
    body {
      font-family: var(--font-sans);
      color: var(--color-text);
      line-height: 1.5;
      max-width: 700px;
      margin: 0 auto;
      padding: 2rem;
      background: white;
    }
    
    h1, h2, h3, h4 {
      margin-top: 0;
      letter-spacing: -0.025em;
    }
    
    .header {
      border-bottom: 2px solid var(--color-border);
      padding-bottom: 1.5rem;
      margin-bottom: 2rem;
    }
    
    .header-top {
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      margin-bottom: 1rem;
    }
    
    .candidate-name {
      font-size: 2rem;
      font-weight: 700;
      margin: 0 0 0.5rem 0;
    }
    
    .role-title {
      font-size: 1.25rem;
      color: var(--color-text-muted);
      margin: 0;
      font-weight: 500;
    }
    
    .meta {
      font-family: var(--font-mono);
      font-size: 0.75rem;
      color: var(--color-text-muted);
      text-align: right;
    }
    
    .score-section {
      display: flex;
      justify-content: space-between;
      align-items: center;
      background: var(--color-bg-subtle);
      padding: 1.5rem;
      border-radius: 8px;
      margin-bottom: 2rem;
      border: 1px solid var(--color-border);
    }
    
    .overall-score {
      font-size: 3rem;
      font-weight: 700;
      line-height: 1;
      margin-right: 2rem;
    }
    
    .score-tier {
      font-family: var(--font-mono);
      font-size: 0.875rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }
    
    .score-breakdown {
      flex: 1;
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1rem;
    }
    
    .breakdown-item {
      font-size: 0.875rem;
    }
    
    .breakdown-label {
      font-family: var(--font-mono);
      font-size: 0.75rem;
      color: var(--color-text-muted);
      margin-bottom: 0.25rem;
      display: flex;
      justify-content: space-between;
    }
    
    .breakdown-bar-bg {
      height: 6px;
      background: var(--color-border);
      border-radius: 3px;
      overflow: hidden;
    }
    
    .breakdown-bar-fill {
      height: 100%;
      background: var(--color-text);
    }
    
    .section-title {
      font-size: 1.25rem;
      font-weight: 600;
      margin: 2rem 0 1rem 0;
      padding-bottom: 0.5rem;
      border-bottom: 1px solid var(--color-border);
    }
    
    .summary {
      font-size: 1rem;
      padding: 1rem;
      border-left: 4px solid var(--color-text);
      background: var(--color-bg-subtle);
      margin-bottom: 2rem;
    }
    
    .skills-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1.5rem;
      margin-bottom: 2rem;
    }
    
    .skill-box {
      border: 1px solid var(--color-border);
      border-radius: 6px;
      padding: 1rem;
    }
    
    .skill-box-title {
      font-size: 0.875rem;
      font-weight: 600;
      margin-bottom: 0.75rem;
    }
    
    .skill-chip {
      display: inline-block;
      padding: 0.25rem 0.5rem;
      background: var(--color-bg-subtle);
      border: 1px solid var(--color-border);
      border-radius: 4px;
      font-size: 0.75rem;
      font-family: var(--font-mono);
      margin: 0 0.25rem 0.25rem 0;
    }
    
    .missing-skill {
      margin-bottom: 0.75rem;
      padding-bottom: 0.75rem;
      border-bottom: 1px solid var(--color-bg-subtle);
    }
    .missing-skill:last-child {
      margin-bottom: 0;
      padding-bottom: 0;
      border-bottom: none;
    }
    
    .missing-skill-name {
      font-size: 0.875rem;
      font-weight: 600;
      font-family: var(--font-mono);
    }
    
    .missing-skill-note {
      font-size: 0.75rem;
      color: var(--color-text-muted);
      margin-top: 0.25rem;
    }
    
    .recommendation {
      border: 1px solid var(--color-border);
      border-radius: 6px;
      padding: 1rem;
      margin-bottom: 1rem;
    }
    
    .rec-header {
      display: flex;
      justify-content: space-between;
      margin-bottom: 0.5rem;
    }
    
    .rec-title {
      font-weight: 600;
      font-size: 1rem;
    }
    
    .rec-priority {
      font-family: var(--font-mono);
      font-size: 0.75rem;
      padding: 0.125rem 0.375rem;
      background: var(--color-bg-subtle);
      border-radius: 4px;
      border: 1px solid var(--color-border);
    }
    
    .rec-desc {
      font-size: 0.875rem;
      color: var(--color-text-muted);
      margin-bottom: 0.75rem;
    }
    
    .rec-meta {
      font-family: var(--font-mono);
      font-size: 0.75rem;
      color: var(--color-text-muted);
      display: flex;
      gap: 1rem;
    }
    
    .footer {
      margin-top: 3rem;
      padding-top: 1rem;
      border-top: 1px solid var(--color-border);
      font-family: var(--font-mono);
      font-size: 0.7rem;
      color: var(--color-text-muted);
      text-align: center;
    }
  </style>
</head>
<body>
  <div class="header">
    <div class="header-top">
      <div>
        <h1 class="candidate-name">${candidate.fullName}</h1>
        <h2 class="role-title">Target Role: ${targetRole.title}</h2>
      </div>
      <div class="meta">
        <div>EVAL ID: ${evaluationId}</div>
        <div>DATE: ${new Date(timestamp).toLocaleDateString()}</div>
      </div>
    </div>
    <div style="font-size: 0.875rem; color: var(--color-text-muted);">
      ${candidate.educationLevel} &bull; ${candidate.yearsOfExperience} Years Experience
    </div>
  </div>

  <div class="summary">
    <strong>Executive Summary:</strong> ${verdictSummary}
  </div>

  <div class="score-section">
    <div>
      <div class="score-tier">${scores.tier}</div>
      <div class="overall-score">${scores.overallScore}<span style="font-size: 1.5rem; color: var(--color-text-muted)">/100</span></div>
    </div>
    <div class="score-breakdown">
      <div class="breakdown-item">
        <div class="breakdown-label">
          <span>Skills Match</span>
          <span>${scores.skillsScore}%</span>
        </div>
        <div class="breakdown-bar-bg">
          <div class="breakdown-bar-fill" style="width: ${scores.skillsScore}%"></div>
        </div>
      </div>
      <div class="breakdown-item">
        <div class="breakdown-label">
          <span>Education Fit</span>
          <span>${scores.educationScore}%</span>
        </div>
        <div class="breakdown-bar-bg">
          <div class="breakdown-bar-fill" style="width: ${scores.educationScore}%"></div>
        </div>
      </div>
      <div class="breakdown-item">
        <div class="breakdown-label">
          <span>Experience Fit</span>
          <span>${scores.experienceScore}%</span>
        </div>
        <div class="breakdown-bar-bg">
          <div class="breakdown-bar-fill" style="width: ${scores.experienceScore}%"></div>
        </div>
      </div>
      <div class="breakdown-item">
        <div class="breakdown-label">
          <span>Academics</span>
          <span>${scores.academicsScore}%</span>
        </div>
        <div class="breakdown-bar-bg">
          <div class="breakdown-bar-fill" style="width: ${scores.academicsScore}%"></div>
        </div>
      </div>
    </div>
  </div>

  <div class="skills-grid">
    <div class="skill-box">
      <div class="skill-box-title">&check; Matched Skills (${skillsAnalysis.matchedSkills.length})</div>
      <div>
        ${matchedSkillsHtml}
      </div>
      ${bonusSkillsHtml}
    </div>
    
    <div class="skill-box">
      <div class="skill-box-title">&warning; Missing Core Skills (${skillsAnalysis.missingSkills.length})</div>
      <div>
        ${missingSkillsHtml}
      </div>
    </div>
  </div>

  <div class="page-break"></div>

  <h3 class="section-title">Action Roadmap</h3>
  <div>
    ${recommendationsHtml}
  </div>

  <div class="footer">
    Generated by Job Eligibility Checker &bull; ${generatedAt}
  </div>

  <script>
    window.onload = () => {
      window.print();
    };
  </script>
</body>
</html>
  `;

  printWindow.document.open();
  printWindow.document.write(htmlContent);
  printWindow.document.close();
}
