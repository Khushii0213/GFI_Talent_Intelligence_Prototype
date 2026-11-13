# Manual Resume Data Review Log

## Purpose
Record data-quality issues found during resume extraction and verification.
Do not invent, infer, or silently repair missing candidate information.

## Dataset review summary

- Total candidate records: 47
- Non-empty resumes: 46
- Empty source documents: 1
- Independently verified normalized text matches: 46
- Text mismatches between JSON and independent DOCX extraction: 0

## Confirmed issue 1: Empty source document

- Candidate ID: resume_1793685080327
- Filename: anonymized_resume_1793685080327.docx
- JSON status: empty
- Finding: The original DOCX document body is empty.
- Verification: The original DOCX archive and its document XML were inspected.
- Root cause: Empty source document, not an extraction-software failure.
- Action: Retain the record for audit purposes, exclude it from scoring, and display the data-quality issue to HR.
- Correction: None. Candidate information must not be fabricated.

## Confirmed issue 2: Incomplete text in source resume

- Candidate ID: VG_1793682784531
- Filename: anonymized_VG_1793682784531.docx
- Finding: The resume contains incomplete or suspicious phrases, including:
  - "s worth $500M+"
  - "ICETAO ure's impact on learning outcomes across s."
- Verification: The original DOCX was independently extracted and compared with the JSON record. The incomplete phrases are present in the original document as well.
- Root cause: The source document itself contains the incomplete wording; this is not a JSON extraction mismatch.
- Action: Preserve the readable text and flag the affected passages for human review.
- Correction: No missing words have been guessed or inserted.

## Additional heuristic flags

An earlier automated review flagged other resumes for possible extraction fragments, including isolated single letters or unusual text patterns.

These flags are leads for manual inspection, not confirmed errors. They must not be treated as proof of corrupted resumes.

Each flagged resume should be compared with its original DOCX before any correction is made.


### Reviewed heuristic flag: PS_1793682784387

- Independently extracted the original DOCX using Mammoth.
- Original DOCX extraction length: 2,943 characters.
- JSON extraction length: 2,883 characters.
- Mammoth warnings: none.
- Compared visible content; no substantive extraction discrepancy identified.
- The leading "PS" is present in the original document.
- Decision: false-positive heuristic flag; retain the resume for normal evaluation.

### Reviewed heuristic flag: TM_1793682784495

- Independently extracted the original DOCX using Mammoth.
- Original DOCX extraction length: 3,002 characters.
- JSON extraction length: 2,945 characters.
- Mammoth warnings: none.
- Compared the ending of the original DOCX with the JSON extraction.
- The incomplete phrase "anding performance" is present in the original source.
- No confirmed extraction mismatch identified.
- Decision: no confirmed extraction corruption; preserve source wording and retain for normal evaluation.

### Reviewed heuristic flag: AK_1793682784184

- Independently extracted the original DOCX using Mammoth.
- Original DOCX extraction length: 4,594 characters.
- JSON extraction length: 4,521 characters.
- Mammoth warnings: none.
- Compared the ending of the original DOCX with the JSON extraction.
- The incomplete-looking ISO certification entries are present in the original source.
- No substantive extraction discrepancy identified in the reviewed content.
- Decision: no confirmed extraction corruption; preserve source wording and retain for normal evaluation.

## Cleaning principles

1. Preserve original source files.
2. Preserve candidate IDs and filenames.
3. Do not fabricate missing words, dates, skills, qualifications, or experience.
4. Distinguish source-document issues from extraction mismatches.
5. Keep uncertain information visible for HR review.
6. Do not interpret missing keywords as proof that a candidate lacks a skill.
7. Exclude only records that cannot be meaningfully evaluated, while retaining them in the audit trail.

## Review status

- Dataset structure and duplicate checks: completed.
- Empty source document investigation: completed.
- Independent extraction consistency check: completed for all 46 non-empty resumes.
- VG source-text issue investigation: completed.
- Individual inspection of every heuristic flag: not performed; unnecessary for extraction-consistency verification because all 46 non-empty resumes passed independent DOCX-to-JSON comparison. Remaining heuristic flags are not confirmed errors.
- Independent DOCX extraction verification: completed for all 46 non-empty resumes; zero normalized text mismatches.
- Automated heuristic flags: treated as review indicators, not confirmed extraction errors.
- Individually investigated examples: VG, PS, TM and AK.
- Remaining heuristic flags: no further individual extraction checks required based on the full-dataset consistency verification.