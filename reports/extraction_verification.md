# Resume Extraction Verification

## Objective
Verify that extracted JSON resume text is consistent with the original DOCX files.

## Method
1. Loaded all candidate records from data/resumes.json.
2. Extracted text independently from each corresponding DOCX using Mammoth.
3. Applied Unicode NFKC normalization.
4. Normalized whitespace.
5. Compared the normalized original text against the normalized JSON text.

## Results
- Total candidate records: 47
- Non-empty resumes checked: 46
- Exact normalized text matches: 46
- Text mismatches: 0
- Empty source documents: 1

## Confirmed exception
Candidate ID: resume_1793685080327

The original DOCX and its copy in the assignment ZIP contain an empty document body.

## Conclusion
All 46 non-empty JSON records are consistent with independent Mammoth extraction from their corresponding DOCX files after normalization.

This validates extraction consistency, not the completeness or accuracy of the original resume content.

The empty source document must remain excluded from ranking and visible in data-quality reporting.

## Limitations
- Extraction consistency does not guarantee source-document completeness.
- Text-based matching may not fully capture formatting, visual information, or context.
- All ranking results require human review.
