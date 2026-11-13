import json
import re
from collections import Counter
from pathlib import Path

data = json.loads(Path("data/resumes.json").read_text(encoding="utf-8"))

print("\n========== RESUME DATA QUALITY AUDIT ==========")
print("Total records:", len(data))

print("\n1. RECORD STRUCTURE")
print("Fields:", sorted(set().union(*(r.keys() for r in data))))

ids = [r.get("id") for r in data]
filenames = [r.get("filename") for r in data]

print("\n2. MISSING AND DUPLICATE VALUES")
print("Missing IDs:", sum(not x for x in ids))
print("Duplicate IDs:", [k for k, v in Counter(ids).items() if k and v > 1])
print("Missing filenames:", sum(not x for x in filenames))
print("Duplicate filenames:", [k for k, v in Counter(filenames).items() if k and v > 1])

print("\n3. EXTRACTION STATUS")
print("Statuses:", dict(Counter(r.get("status", "missing") for r in data)))
print("Empty text:", sum(not (r.get("text") or "").strip() for r in data))

lengths = [len((r.get("text") or "").strip()) for r in data]
print("Shortest text length:", min(lengths, default=0))
print("Longest text length:", max(lengths, default=0))
print("Texts under 200 characters:", sum(n < 200 for n in lengths))

print("\n4. FILE TYPES")
print(dict(Counter(Path(f).suffix.lower() for f in filenames if f)))

print("\n5. DUPLICATE RESUME TEXT")
normalized = [
    re.sub(r"\s+", " ", (r.get("text") or "").lower()).strip()
    for r in data
]
text_counts = Counter(t for t in normalized if t)
print("Duplicate text groups:", sum(v > 1 for v in text_counts.values()))

print("\n6. POSSIBLE EXTRACTION FRAGMENTS")
for r in data:
    text = r.get("text") or ""
    single_letters = len(re.findall(r"\b[a-zA-Z]\b", text))
    suspicious = len(re.findall(r"\b(?:ure|tion|ment|ing)\b", text))
    if single_letters >= 3 or suspicious >= 3:
        print(r.get("id"), "| single letters:", single_letters,
              "| suspicious fragments:", suspicious)

print("\n7. RECORDS NEEDING INITIAL REVIEW")
for r in data:
    text = (r.get("text") or "").strip()
    reasons = []
    if not r.get("id"):
        reasons.append("missing ID")
    if not r.get("filename"):
        reasons.append("missing filename")
    if not text:
        reasons.append("empty text")
    elif len(text) < 200:
        reasons.append("very short text")
    if r.get("status") != "ok":
        reasons.append("extraction status not OK")
    if reasons:
        print(r.get("id", "UNKNOWN"), "->", ", ".join(reasons))

print("\n========== AUDIT COMPLETE ==========")
