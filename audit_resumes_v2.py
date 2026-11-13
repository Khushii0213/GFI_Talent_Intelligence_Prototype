import json
import re
from pathlib import Path
from collections import Counter

data = json.loads(Path("data/resumes.json").read_text(encoding="utf-8"))

patterns = {
    "possible_truncated_word": re.compile(
        r"\b(?:ure|tion|ment|ing)\b", re.IGNORECASE
    ),
    "repeated_punctuation": re.compile(r"[.]{2,}|[,]{2,}|[-]{3,}"),
    "unfinished_sentence": re.compile(r"\b(?:and|or|with|including|such as|of|in)$", re.I),
}

lines = [
    "# Second-Pass Resume Text Review",
    "",
    "Automated screening only. Flags are not confirmed errors.",
    "",
    f"Total records: {len(data)}",
    f"Non-empty records: {sum(bool((r.get('text') or '').strip()) for r in data)}",
    "",
]

for record in data:
    text = record.get("text") or ""
    if not text.strip():
        continue

    flags = []
    for name, pattern in patterns.items():
        matches = list(pattern.finditer(text))
        if matches:
            flags.append(f"{name}: {len(matches)}")

    if flags:
        lines.extend([
            f"## {record.get('id')} — {record.get('filename')}",
            "",
            "Flags: " + ", ".join(flags),
            "",
        ])

        for name, pattern in patterns.items():
            for match in list(pattern.finditer(text))[:5]:
                start = max(0, match.start() - 65)
                end = min(len(text), match.end() + 65)
                context = re.sub(r"\s+", " ", text[start:end])
                lines.append(f"- {name}: `{context}`")

        lines.append("")

output = Path("reports/second_pass_review.md")
output.parent.mkdir(exist_ok=True)
output.write_text("\n".join(lines), encoding="utf-8")

print("Second-pass report created:", output)
print("Non-empty resumes scanned:", sum(bool((r.get("text") or "").strip()) for r in data))
print("Records with potential text flags:", sum(
    any(pattern.search(r.get("text") or "") for pattern in patterns.values())
    for r in data
))
