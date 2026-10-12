# AI Usage Disclosure — Week 05

| Tool | Exact model / plan | Used for | Which files it touched |
| --- | --- | --- | --- |
| ChatGPT / Codex | GPT 6.1 sol (student-provided name) / Plus | Plan, implementation, tests, review, report example, declaration, real execution and evidence helper | lab-report.md, code/booking.py, code/original/booking_v1.py, code/test_booking.py, submission.yml, AI_USAGE.md, refresh_evidence.py |

**The assistant wrote, or helped write, my tests in code/:** yes, all 24. Their expected values are derived from AC1–AC5. The non-integer test documents behavior outside the contract. Student review of expected values is still needed.

**code/original/ holds the assistant's first answer exactly as returned:** yes, the first implementation is returned as a file in the assistant's package. Final code is identical.

**Everything submitted can be explained and defended by the student:** no, not yet confirmed. Change this only after understanding the code and the overlap condition.

**Anything accepted from AI without fully understanding it:** This is an AI-assisted draft. The student has not confirmed understanding of overlap, mutation coverage, outside-contract behavior or the redundant lower bound.

**Process disclosure:** The specification and unchanged Prompt 1 were sent after setup guidance in this conversation. The student then asked for all remaining work together. Unchanged Prompts 2 and 4 were not separately sent. The report discloses its consolidated plan and AI-generated conclusion example. No failure or repair was fabricated. Assistant execution used Python 3.12.14; refresh_evidence.py regenerates actual local output and records the current commit. Student review and a personal conclusion remain required.

Prepared for: Assylbek Uzakbayev
Student signature: not yet provided
Date: 2026-10-12
