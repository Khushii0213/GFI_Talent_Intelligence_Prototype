# GFI Talent Intelligence — Resume Screening Prototype

A Next.js prototype for screening the 47 anonymized DOCX resumes against the two supplied Growth For Impact roles.

## What is included
- 47 source DOCX resumes under `public/resumes/` (one source document is empty and is intentionally flagged).
- Extracted text and source filename metadata in `data/resumes.json`.
- Job-description reference metadata in `data/job_descriptions.json`.
- Separate LCA and UI/UX weighted evidence scores.
- Classification into LCA / UI/UX / Both / Neither-uncertain (plus potential-review state).
- Candidate evidence, score breakdown, extracted text and source-resume link.
- Upload and ranking of additional PDF or DOCX resumes through `/api/analyze`.

## Stack
Next.js 14 App Router, React, TypeScript, Mammoth (DOCX extraction), pdf-parse (PDF extraction). This architecture is chosen to fit the assignment's Vercel deployment requirement. A Streamlit-only app cannot be deployed directly as a standard Vercel app.

## Run locally
Requires Node.js 18.17+.

```bash
npm install
npm run dev
```
Open http://localhost:3000.

## Deploy to Vercel
1. Push this project to a GitHub repository.
2. Import the repository in Vercel.
3. Keep the framework preset as Next.js.
4. Deploy with the default build command (`npm run build`).
5. Test uploading a DOCX and a text-based PDF after deployment.

The API route uses the Node.js runtime. Very large files may exceed serverless request or execution limits; the supplied and expected resume documents are small.

## Scoring methodology
Each role has six evidence categories. The score for a category is based on the number of distinct configured phrases found in the extracted resume text, normalized to a capped 0–100 bucket score. The final score is the weighted sum of bucket scores. Matched terms are displayed in the candidate detail panel.

### Weights
| Category | LCA | UI/UX |
|---|---:|---:|
| Relevant experience | 25% | 15% |
| Technical skills | 25% | 25% |
| Relevant projects | 20% | 20% |
| Domain knowledge | 15% | 15% |
| Education | 10% | 10% |
| Tools | 5% | 15% |

These weights and keyword dictionaries are transparent prototype assumptions, not employer-provided weights. The score is a triage aid, not a hiring decision. Review the original resume before making decisions.

## Data quality and limitations
- The archive contains 47 DOCX files; one document has no extractable paragraph or table text. It is retained and flagged.
- The source documents include inconsistent formatting and some visibly corrupted or missing standards strings. The app displays extracted text and does not silently repair such content.
- The assignment PDF says 4–6 years for the LCA role, while linked JD1 says 2–3 years of independent LCA project experience. The prototype explicitly flags this discrepancy and does not use either value as an automatic rejection rule.
- Keyword matching can miss synonyms and context; a phrase match is not proof of proficiency. Human review is required.
- The initial dataset is embedded as extracted text for fast demo loading. The original DOCX files are retained for source inspection.
- This prototype does not score demographic or protected characteristics.

## Validation checklist
- Confirm all 47 source filenames appear.
- Confirm the empty file is flagged rather than scored as real evidence.
- Compare top-ranked profiles with original resumes.
- Upload one new DOCX and one text-based PDF.
- Verify the new resume appears in both role rankings.
- Review false positives caused by generic terms and tune the dictionaries before submission.
