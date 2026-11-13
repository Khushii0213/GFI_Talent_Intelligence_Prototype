# Resume Dataset — Data Quality Report

## Dataset Overview
- Total candidate records supplied: 47
- Original DOCX files available: 47
- Records with extracted text: 46
- Records with empty source documents: 1

## Validation Checks
- Missing candidate IDs: 0
- Duplicate candidate IDs: 0
- Missing filenames: 0
- Duplicate filenames: 0
- Duplicate extracted text groups: 0

## Confirmed Source-Data Issue

**Candidate ID:** `resume_1793685080327`

### Findings
- The candidate's extracted JSON text is empty.
- The corresponding DOCX in `data/resumes` also produces no text using Mammoth.
- The original assignment ZIP contains the same document.
- Inspection of `word/document.xml` confirms that the document body contains an empty text element.

**Conclusion:** This is a source-data issue, not a text-extraction failure.

## Handling Decision
- Retain the original candidate record for traceability.
- Mark the record as `empty_source_document`.
- Exclude it from role scoring and ranking.
- Do not infer or fabricate candidate qualifications.
- Surface the exclusion in the HR dashboard.

## Limitations
Automated text extraction and keyword-based matching can miss context, synonyms, formatting, and qualifications that require human interpretation.

Scores are relevance indicators, not probabilities of hiring success. Final shortlisting requires human review.
