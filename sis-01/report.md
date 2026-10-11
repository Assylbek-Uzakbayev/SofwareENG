# SIS #01 — Software Engineering Fundamentals, With an AI in the Loop

<!--
  This is the only file you write your report in. README.md tells you what goes where.

  Rules the checker relies on:
  - Do not delete, rename or renumber the ## headings, the ### headings, or the **Label:** words.
  - Replace every "(write here)" and "(paste here)". None may be left when you submit.
  - Comments like this one are ignored by the word counter. Delete them or leave them.
-->

**Topic:** 1.1

<!-- Exactly one of 1.1 … 1.10, e.g.  **Topic:** 1.4  -->

---

## 1. Scenario

<!-- 100–150 words, labels included. One small scenario, used in every prompt and in your
     whole answer. Anything fictional is labelled in Assumptions. -->

**Question:** What does a university need beyond program code to receive a usable and maintainable study room booking system?

**Users:** Students book study rooms, and university administrators manage rooms and bookings.

**Problem:** A working program alone does not explain how to use, test, install or maintain the system. The university needs a complete delivery package.

**Constraints:** Two bookings for the same room must not overlap. Students must not delete other students’ bookings; only administrators have that permission.

**Risk:** Overlapping bookings could leave two students expecting to use the same room.

**Assumptions:** This university and its system are fictional. The user roles, booking rules and support needs are fictional scenario assumptions.

## 2. Analysis

<!-- 350–400 words. Your answer to the question, the trade-offs, and how it applies to your
     scenario. Explain at least two engineering decisions and why they fit the scenario. -->

(write here)

## 3. Review

<!-- 250–300 words. What Prompt B's critique said and what you did with it; your two source
     checks and your two substantive revisions, each with a reason. Point at the rows of the
     tables in section 9 ("verification row 2", "change-log row 1"). -->

(write here)

## 4. Conclusion

<!-- 100–150 words. Your recommendation for the scenario and its main limitation. -->

(write here)

## 5. Reflection

<!-- 150–200 words. NOT part of the main total. Written by you, not by the assistant:
     what helped, what you changed, what you learned. Specific beats flattering. -->

(write here)

## 6. References

<!-- Full references, one per line, each starting with "- ". Only sources you actually opened.
     Every URL used in the verification table must also appear here. Example:
     - Sommerville, I. (2016). Software Engineering, 10th ed., Global Edition. Pearson. Ch. 1.
-->

- (write here)

## 7. Appendix A — Initial outline

<!-- Written BEFORE you run Prompt A. Five points, your own words, numbered. These are the
     "five points" you paste into Prompt A. -->

1. The system needs tests to check that it works correctly.
2. Students need instructions explaining how to use the system.
3. The university needs technical support for the system.
4. Two students must not be able to book the same room for overlapping times.
5. Students must not be able to delete other students’ bookings. Only administrators should have this permission.

## 8. Appendix B — AI exchanges

<!-- Complete prompts and complete responses, as text — never screenshots. Paste each inside
     the fenced block that follows its label. If a response itself contains ``` lines, open
     and close that block with ~~~~ instead. You may add B4, B5 … after B3 if you ran more. -->

### B1 — Draft (Prompt A)

- **Tool:** ChatGPT 6,1 Sol  
- **Model:** not displayed
- **Date:** 2026-10-11
- **Purpose:** contextual draft


<!-- Model: the exact model with its version, as the tool shows it (e.g. "GPT-5 Thinking",
     "Claude Sonnet 4.5"). If the tool does not show it, write: not displayed
     Date: YYYY-MM-DD -->

**Prompt:** 

```text
 Act as a software engineering tutor. Help me analyze topic 1.1 Professional software delivery: What does a university need beyond program code to receive a usable and maintainable study room booking system? for a first-year-level university assignment.

My scenario is a fictional university study room booking system. Students book rooms, and university administrators manage rooms and bookings. A working program alone does not explain how to use, test, install or maintain the system. The university needs a complete delivery package. Two bookings for the same room must not overlap. Students must not delete other students’ bookings; only administrators have that permission. The main risk is overlapping bookings leaving two students expecting to use the same room. The university, user roles, booking rules and support needs are fictional assumptions. My initial ideas are 1. The system needs tests to check that it works correctly. 2. Students need instructions explaining how to use the system. 3. The university needs technical support for the system. 4. Two students must not be able to book the same room for overlapping times. 5. Students must not be able to delete other students’ bookings. Only administrators should have this permission. Draft a 400–500 word explanation using these details.

Separate facts from assumptions. Explain trade-offs and identify claims I should verify. Do not invent quotations, references or page numbers.```

**Response:**

```text
Professional software delivery means giving the university a system it can use, operate and maintain, together with evidence that it meets agreed requirements. Program code is one part of this delivery. The study room booking system also needs documented rules, test results, user instructions, installation guidance and a support plan.

The university, user roles and booking rules in this scenario are fictional assumptions, not facts about a real institution. We assume students create bookings and administrators manage them. Two bookings for the same room must not overlap, and students must not delete another student’s booking. These assumptions should become explicit requirements approved by the university before delivery. Further questions include whether touching time intervals are allowed and whether students can cancel their own bookings.

The first engineering decision is to deliver documented acceptance criteria with repeatable tests. Tests should cover ordinary bookings, overlapping intervals and attempts to delete another user’s booking. A simultaneous booking test is also important: two requests might both see a room as available before either booking is saved. The implementation should therefore enforce the overlap rule when saving bookings, using a suitable transaction or concurrency mechanism. This adds complexity, but directly addresses the scenario’s main failure risk. Passing tests provides evidence for the cases tested; it does not establish that every possible failure has been eliminated.

The second decision is to enforce permissions on the server, rather than relying on hidden interface buttons. Students should be prevented from deleting another student’s booking even if they send a request directly. Administrators receive the relevant management permission. This requires additional authorization checks and tests, but supports the stated access rule. Administrator access should also be managed carefully, because a privileged account could delete legitimate bookings.

Students need brief instructions showing how to select a room, choose a time and understand rejection messages. Administrators need separate guidance for managing bookings and handling reported problems. Documentation takes time to produce and update, but can reduce confusion and make the delivered system easier to use.

The delivery package should also explain installation, configuration, backup and recovery procedures. A named support contact and an agreed maintenance process help the university respond to faults after handover. The level of support should match the university’s resources: continuous support might be too expensive for this small fictional system, while limited support hours could delay incident resolution. That choice needs agreement rather than an assumed service promise.

Before finalizing the analysis, verify two general claims in authoritative sources: professional software includes associated documentation beyond code, and testing cannot prove the absence of defects. Separately, confirm scenario decisions with the fictional customer requirements. The recommended delivery is a tested, documented and supported system, with concurrency and permission controls justified by its booking risks.
```

### B2 — Critique (Prompt B)

- **Tool:** (ChatGPT)
- **Model:** (not displayed)
- **Date:** (2026-10-11)
- **Purpose:** contextual draft

**Prompt:**

```text
Review the draft below against my chosen question and scenario. Identify inaccuracies, missing reasoning, vague claims and unsupported assumptions.
For each concern, explain why it matters and how I could check it. Include a counterexample or alternative interpretation. Do not rewrite the answer yet.
Question: What does a university need beyond program code to receive a usable and maintainable study room booking system?
Scenario: A fictional university study room booking system. Students book rooms, and administrators manage rooms and bookings. The university needs a complete delivery package beyond working code. Two bookings for the same room must not overlap. Students must not delete other students’ bookings; only administrators have that permission. The main risk is overlapping bookings leaving two students expecting to use the same room. The university, user roles, booking rules and support needs are fictional assumptions.
Draft: Professional software delivery means giving the university a system it can use, operate and maintain, together with evidence that it meets agreed requirements. Program code is one part of this delivery. The study room booking system also needs documented rules, test results, user instructions, installation guidance and a support plan.

The university, user roles and booking rules in this scenario are fictional assumptions, not facts about a real institution. We assume students create bookings and administrators manage them. Two bookings for the same room must not overlap, and students must not delete another student’s booking. These assumptions should become explicit requirements approved by the university before delivery. Further questions include whether touching time intervals are allowed and whether students can cancel their own bookings.

The first engineering decision is to deliver documented acceptance criteria with repeatable tests. Tests should cover ordinary bookings, overlapping intervals and attempts to delete another user’s booking. A simultaneous booking test is also important: two requests might both see a room as available before either booking is saved. The implementation should therefore enforce the overlap rule when saving bookings, using a suitable transaction or concurrency mechanism. This adds complexity, but directly addresses the scenario’s main failure risk. Passing tests provides evidence for the cases tested; it does not establish that every possible failure has been eliminated.

The second decision is to enforce permissions on the server, rather than relying on hidden interface buttons. Students should be prevented from deleting another student’s booking even if they send a request directly. Administrators receive the relevant management permission. This requires additional authorization checks and tests, but supports the stated access rule. Administrator access should also be managed carefully, because a privileged account could delete legitimate bookings.

Students need brief instructions showing how to select a room, choose a time and understand rejection messages. Administrators need separate guidance for managing bookings and handling reported problems. Documentation takes time to produce and update, but can reduce confusion and make the delivered system easier to use.

The delivery package should also explain installation, configuration, backup and recovery procedures. A named support contact and an agreed maintenance process help the university respond to faults after handover. The level of support should match the university’s resources: continuous support might be too expensive for this small fictional system, while limited support hours could delay incident resolution. That choice needs agreement rather than an assumed service promise.

Before finalizing the analysis, verify two general claims in authoritative sources: professional software includes associated documentation beyond code, and testing cannot prove the absence of defects. Separately, confirm scenario decisions with the fictional customer requirements. The recommended delivery is a tested, documented and supported system, with concurrency and permission controls justified by its booking risks.
```

**Response:**

```text
The draft answers the question and connects delivery documents, testing and support to the booking scenario. However, four concerns need evaluation before revision.

1. **The delivery package needs clearer acceptance and ownership arrangements.**  
   The draft lists useful materials but does not explain who accepts the system or maintains its documentation. Without an agreed handover process, the university could receive test results without knowing whether they cover its requirements. Check this by proposing an acceptance checklist linking each requirement to a test, naming a university approver and assigning maintenance responsibilities. These would be proposed fictional arrangements, not established facts.  
   **Alternative interpretation:** A small system may need only a short checklist and named contact; a large formal handover document could create unnecessary work.

2. **A transaction alone does not necessarily prevent overlapping bookings.**  
   The draft correctly identifies simultaneous requests as a risk, but “a suitable transaction or concurrency mechanism” leaves the decisive behavior unspecified. Two transactions could both check availability before either saves, depending on the implementation. Check the chosen database’s official documentation and test two competing requests for overlapping times. The acceptance condition should require that at most one conflicting booking is confirmed.  
   **Counterexample:** Two individually successful transactions can still produce conflicting bookings if the check and save operations lack appropriate coordination. The report should specify the required outcome without claiming that any transaction guarantees it.

3. **Server-side permission enforcement assumes a particular architecture.**  
   This is appropriate for a shared web application, but the scenario does not explicitly say the system has a server. The recommendation therefore introduces an unstated architectural assumption. Check whether a shared web application is intended, then label it as fictional. Verify the general authorization recommendation in an authoritative security source.  
   **Counterexample:** A locally operated booking tool might have no web server. The broader requirement is to enforce permissions at a trusted point that students cannot bypass, rather than prescribing one architecture for every system.

4. **General claims need evidence, and support commitments need agreement.**  
   The statements about software documentation and the limits of testing are plausible but remain unsupported until sources are read. Check a software engineering textbook’s definition of software and an authoritative testing source’s discussion of testing limitations. Record exact locators and qualify the wording if necessary. Documentation reducing confusion is also a possible benefit, not a measured outcome in this fictional scenario. Meanwhile, support hours, backup responsibilities and recovery expectations should be agreed with the university.  
   **Alternative interpretation:** Existing university IT support might handle incidents, making a separate support team unnecessary. Brief instructions may help users, but usability testing could reveal problems that documentation alone cannot solve.
```

### B3 — Revision (Prompt C)

- **Tool:** (write here)
- **Model:** (write here)
- **Date:** (write here)
- **Purpose:** revision using my decisions and verified evidence

**Prompt:**

```text
(paste here)
```

**Response:**

```text
(paste here)
```

## 9. Appendix C — Evidence tables

### Verification table

<!-- At least two complete rows. Source and locator: title + page / slide / section / chapter,
     or title + URL + access date (YYYY-MM-DD). Decision: keep, qualify or reject — one word. -->

| AI claim | Source and locator | Evidence found | Decision |
| --- | --- | --- | --- |
| (write here) | (write here) | (write here) | (write here) |
| (write here) | (write here) | (write here) | (write here) |

### Change log

<!-- At least two substantive revisions. Your final version must differ from the AI wording,
     and the reason must say which evidence or scenario constraint made you change it. -->

| AI wording / suggestion | Your final version | Reason for change |
| --- | --- | --- |
| (write here) | (write here) | (write here) |
| (write here) | (write here) | (write here) |
