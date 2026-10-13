# SIS #01 — Software Engineering Fundamentals, With an AI in the Loop

**Topic:** 1.1

<!-- AI-assisted full draft, prepared for Assylbek Uzakbayev, 24B032082, Monday 16:00–19:00, on 2026-10-13. The initial ideas were supplied by the user and translated/restructured by AI. Sections 1–5, review decisions and appendix were assisted. Sources were opened by the assistant. Independent student reflection, source reading, judgments and workflow compliance are not claimed. -->

## 1. Scenario

**Question:** What does a university need beyond program code to receive a usable and maintainable study room booking system?

**Users:** Students and teachers reserve rooms; administrators manage rooms and bookings; university IT staff operate the service.

**Problem:** A code repository alone does not explain booking rules, installation, test evidence or ongoing support responsibilities.

**Constraints:** Active bookings for the same room must not overlap. Students must not delete another student's booking; administrators may do so.

**Risk:** Two simultaneous requests could leave different users expecting exclusive use of the same room.

**Assumptions:** The university, users, roles, rules, service, staffing and support arrangements are fictional. University-account login is a proposed assumption, not a confirmed integration. No particular database, budget or guaranteed service level is prescribed.

## 2. Analysis

Professional delivery should give the university a usable service and a practical handover package. Working code is necessary, but operators also need agreed requirements, installation instructions, test evidence and support ownership. The starting outline identifies user guidance, technical documents, deployment information, quality evidence and a clean repository. Each item should explain a task that a university user or maintainer actually performs.

The requirements record should describe booking and deletion permissions, cancellation rules and the interpretation of time boundaries. Those details become acceptance criteria. For example, the scenario requires that two conflicting requests cannot both become active bookings. Tests should cover ordinary use, simultaneous conflicting requests and attempts to delete another student's booking. Passing results document observed behavior; they do not prove the absence of every possible defect.

Decision one is to protect booking integrity at the point where reservations are saved. A concurrent acceptance test should submit two overlapping requests for one room and confirm that only one becomes active. PostgreSQL documents a room-and-range exclusion constraint as one possible mechanism [2]. This is an implementation option, not evidence that the university uses PostgreSQL. Its trade-off is stronger enforcement against additional schema and migration complexity.

Decision two is to require server-side authorization for every protected operation. The application should check the authenticated role and the relationship between the user and the booking. OWASP supports server-side enforcement [1]. Tests should include changed identifiers and direct requests. These checks add implementation and testing effort, but address the specific deletion constraint more effectively than interface controls alone.

User guidance should offer short booking examples, while administrator guidance explains room changes and permitted deletion. Technical documents should show architecture, data relationships and relevant operational interfaces. Deployment instructions should name dependencies, configuration variables and migration steps, with credential-free examples. A demonstration supports understanding, but IT staff should also reproduce installation from the delivered repository.

Finally, handover should identify an incident contact, maintenance owner, backup procedure and restore rehearsal. Versioned documentation and a known-defect list should accompany each release. The university should agree support arrangements instead of assuming continuous availability. More documentation and testing increase initial work; concise, maintained materials reduce dependence on the original developer. The final package should therefore prioritize evidence and operational usefulness over document volume.

## 3. Review

The assisted critique identified five concerns, which are judged here rather than accepted automatically. Point one is accepted: the concurrency paragraph needed a measurable outcome. The final analysis now requires two overlapping requests for one room to leave only one active booking. Point two is accepted: role names do not establish object ownership, so deletion checks now include the specific booking and direct requests.

Point three is qualified. Existing account integration may be convenient, but making it mandatory is rejected because the fictional university has no confirmed directory. Login remains an explicit assumption. Point four is accepted with a limit: documentation should cover architecture and relevant operational interfaces, not every implementation detail. Point five is accepted: handover now includes an incident contact, maintenance owner and restore rehearsal without inventing a response-time promise.

Verification row one uses OWASP's section on performing authorization checks in the right location. It supports server-side enforcement, so that claim is kept. The scenario's specific permissions still come from its fictional requirements, not from OWASP. Verification row two checks PostgreSQL's room reservation exclusion example. The database mechanism is kept as an available example but qualified as a technology choice, since no platform has been selected.

Change-log row one replaces general testing advice with the concurrent acceptance outcome. Row two expands deletion protection into role, booking relationship and direct-request checks. Row three turns general support ownership into concrete handover responsibilities. These revisions alter what the delivery package must demonstrate, not merely its wording. Sources were opened by the assistant; student reading and agreement remain unconfirmed. No real system was implemented or tested in this analysis, and its operational recommendations still need customer validation.

## 4. Conclusion

The university should accept the study room service together with a focused delivery package: agreed requirements, reproducible installation instructions, documented tests, user guidance, technical information and a named maintenance owner. Acceptance should prioritize the two scenario constraints. Concurrent conflicting requests must not create two active bookings, and students must not delete another student's reservation.

The recommended package balances useful evidence with manageable documentation. A demonstration helps users understand the service, but cannot replace reproducible deployment or an incident route. The main limitation is that this university and its operating arrangements are fictional. The proposed database mechanism, account integration and support responsibilities therefore require agreement with the actual customer before deployment. Source-backed mechanisms support design choices; they do not certify an unbuilt system.

## 5. Reflection

AI helped turn my initial ideas about documentation, installation, testing and a clean repository into a structured report. It also helped connect these ideas to the university booking scenario. However, the generated explanation needed a review because general recommendations do not always explain what the customer should receive.

One important improvement was making the booking test more specific. Instead of only saying that overlapping bookings should be tested, the revised analysis describes two conflicting requests and requires that only one booking becomes active. Another improvement was explaining that login does not automatically give permission to delete another user's booking.

The assistant also checked two sources and explained the difference between a possible database solution and a required technology. I still need to read these sources myself before claiming independent verification.

This work shows me that professional delivery includes more than working code. Clear requirements, useful instructions, test evidence and support responsibilities also matter. In future assignments, I should record my own outline earlier and write my reflection from my actual experience.
## 6. References

- [1] OWASP Foundation. Authorization Cheat Sheet. Sections “Verify that Authorization Checks are Performed in the Right Location” and “Validate the Permissions on Every Request.” https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html. Accessed by assistant: 2026-10-13.
- [2] PostgreSQL Global Development Group. PostgreSQL 17 Documentation, 8.17 Range Types, 8.17.10 “Constraints on Ranges,” room_reservation example. https://www.postgresql.org/docs/17/rangetypes.html. Accessed by assistant: 2026-10-13.

## 7. Appendix A — Initial outline

<!-- Student-supplied ideas translated and reorganized by AI. Saved in the assistant's worktree before constructing Draft A. This is not evidence of a student-authored commit pushed before Prompt A. -->

1. Provide user instructions explaining login, room selection and booking for students, teachers and administrators.
2. Provide technical documentation covering the architecture, database diagram and API endpoints.
3. Include deployment instructions, dependencies and configuration examples so the university can run the system.
4. Deliver test results for booking conflicts and a report of known bugs and their fixes.
5. Hand over a clean Git repository with understandable commits and demonstrate the working system.

## 8. Appendix B — AI exchanges

The following are assistant-composed working prompts and actual assistant-generated outputs prepared together under the user's request to complete the work. They are not transcripts of three separately sent user messages. Their internal order is draft, critique, source reading, revision. The user supplied the initial ideas earlier; AI translated and reorganized them. No pre-Prompt-A push by the student has been confirmed. These process deviations are disclosed rather than presented as compliant independent exchanges.

### B1 — Draft (Prompt A)

- **Tool:** ChatGPT / Codex
- **Model:** GPT 6.1 sol
- **Date:** 2026-10-13
- **Purpose:** contextual draft prepared under full-completion instruction

**Prompt:**

```text
Act as a software engineering tutor. Help me analyze topic 1.1 Professional software delivery: What does a university need beyond program code to receive a usable and maintainable study room booking system? for a first-year-level university assignment.

My scenario is A fictional university study room booking system. Students and teachers reserve rooms; administrators manage rooms and bookings; university IT staff operate the service. A code repository alone does not explain booking rules, installation, test evidence or ongoing support responsibilities. Constraints: active bookings for the same room must not overlap; students must not delete another student's booking, while administrators may do so. Risk: simultaneous conflicting requests leave two users expecting exclusive use of one room. All institutional details, staffing, roles, rules and account integration are fictional assumptions.. My initial ideas are 1. Provide user instructions explaining login, room selection and booking for students, teachers and administrators. 2. Provide technical documentation covering the architecture, database diagram and API endpoints. 3. Include deployment instructions, dependencies and configuration examples so the university can run the system. 4. Deliver test results for booking conflicts and a report of known bugs and their fixes. 5. Hand over a clean Git repository with understandable commits and demonstrate the working system.. Draft a 400–500 word explanation using these details.

Separate facts from assumptions. Explain trade-offs and identify claims I should verify. Do not invent quotations, references or page numbers.
```

**Response:**

```text
Professional software delivery gives the university more than executable code. It provides a system that users can understand, operators can install, and future developers can maintain. In this fictional study room service, the delivery package should connect agreed booking rules to documentation, test evidence and named responsibilities. These are recommendations for the scenario, not evidence that a real university already has these arrangements.

The requirements document should identify users and permitted actions. Students and teachers book rooms, while administrators manage bookings and rooms. The two central constraints are non-overlapping active bookings for the same room and preventing students from deleting someone else's booking. Acceptance criteria should explain how the university decides whether these constraints are satisfied. Rules about cancellation, touching time intervals and account access need agreement rather than guesses.

User instructions should show login, room selection, booking and cancellation with short examples. Administrator instructions should explain room changes and permitted deletion. Technical documentation should include an architecture overview, a database diagram and relevant API endpoints. Detailed documentation takes time and becomes outdated unless changes are maintained. However, a small, accurate set of documents helps future staff understand why important decisions were made.

The installation package should contain required software versions, dependencies, database setup instructions and configuration examples without real credentials. A clean repository and understandable commits help university IT staff reproduce the delivered version. A live demonstration can support acceptance, but the institution should receive reproducible installation steps rather than depending entirely on the developer's demonstration server.

Testing should include successful bookings, rejected overlaps, account permissions and room management. Two users attempting conflicting bookings at nearly the same time deserve particular attention because checking availability and saving a booking are different operations. Database enforcement could strengthen the booking rule; PostgreSQL is one possible implementation to investigate, not a required technology. Server-side permission checks should protect deletion even when a user bypasses the normal interface. These technical claims require verification in authoritative sources.

Support should identify who receives incidents, deploys fixes and maintains documentation. Known defects should be recorded with their impact and any workaround. A simple support plan is preferable to an invented promise of continuous availability. The university must agree who owns operations after handover.

Two engineering decisions follow from the scenario. First, tie acceptance tests to the most harmful failures before adding presentation features. This uses limited effort on booking conflicts and unauthorized deletion. Second, deliver concise operational documentation together with code and test results. This increases initial work but reduces dependence on the original developer. Neither passing tests nor complete documents guarantee permanent reliability; real usage, workload and support capacity remain uncertain.
```

### B2 — Critique (Prompt B)

- **Tool:** ChatGPT / Codex
- **Model:** GPT 6.1 sol
- **Date:** 2026-10-13
- **Purpose:** critical review of the working draft

**Prompt:**

```text
Review the draft below against my chosen question and scenario. Identify inaccuracies, missing reasoning, vague claims and unsupported assumptions.
For each concern, explain why it matters and how I could check it. Include a counterexample or alternative interpretation. Do not rewrite the answer yet.
Question: What does a university need beyond program code to receive a usable and maintainable study room booking system?. Scenario: A fictional university study room booking system. Students and teachers reserve rooms; administrators manage rooms and bookings; university IT staff operate the service. A code repository alone does not explain booking rules, installation, test evidence or ongoing support responsibilities. Constraints: active bookings for the same room must not overlap; students must not delete another student's booking, while administrators may do so. Risk: simultaneous conflicting requests leave two users expecting exclusive use of one room. All institutional details, staffing, roles, rules and account integration are fictional assumptions.. Draft: Professional software delivery gives the university more than executable code. It provides a system that users can understand, operators can install, and future developers can maintain. In this fictional study room service, the delivery package should connect agreed booking rules to documentation, test evidence and named responsibilities. These are recommendations for the scenario, not evidence that a real university already has these arrangements.

The requirements document should identify users and permitted actions. Students and teachers book rooms, while administrators manage bookings and rooms. The two central constraints are non-overlapping active bookings for the same room and preventing students from deleting someone else's booking. Acceptance criteria should explain how the university decides whether these constraints are satisfied. Rules about cancellation, touching time intervals and account access need agreement rather than guesses.

User instructions should show login, room selection, booking and cancellation with short examples. Administrator instructions should explain room changes and permitted deletion. Technical documentation should include an architecture overview, a database diagram and relevant API endpoints. Detailed documentation takes time and becomes outdated unless changes are maintained. However, a small, accurate set of documents helps future staff understand why important decisions were made.

The installation package should contain required software versions, dependencies, database setup instructions and configuration examples without real credentials. A clean repository and understandable commits help university IT staff reproduce the delivered version. A live demonstration can support acceptance, but the institution should receive reproducible installation steps rather than depending entirely on the developer's demonstration server.

Testing should include successful bookings, rejected overlaps, account permissions and room management. Two users attempting conflicting bookings at nearly the same time deserve particular attention because checking availability and saving a booking are different operations. Database enforcement could strengthen the booking rule; PostgreSQL is one possible implementation to investigate, not a required technology. Server-side permission checks should protect deletion even when a user bypasses the normal interface. These technical claims require verification in authoritative sources.

Support should identify who receives incidents, deploys fixes and maintains documentation. Known defects should be recorded with their impact and any workaround. A simple support plan is preferable to an invented promise of continuous availability. The university must agree who owns operations after handover.

Two engineering decisions follow from the scenario. First, tie acceptance tests to the most harmful failures before adding presentation features. This uses limited effort on booking conflicts and unauthorized deletion. Second, deliver concise operational documentation together with code and test results. This increases initial work but reduces dependence on the original developer. Neither passing tests nor complete documents guarantee permanent reliability; real usage, workload and support capacity remain uncertain.
```

**Response:**

```text
1. Concurrency needs an acceptance outcome. The draft says, "Two users attempting conflicting bookings at nearly the same time deserve particular attention," but does not state what passing means. Specify that only one conflicting active booking can be committed. Otherwise two sequential tests could pass without testing the main risk. Check a controlled concurrent test and the database's documented guarantees. Counterexample: both requests read an empty schedule before either saves.

2. The deletion rule needs an object-level check. "Server-side permission checks should protect deletion" is sensible, but role labels alone are insufficient. A student could change a booking identifier while remaining logged in. Check authorization guidance and a request targeting another user's booking. Alternative interpretation: removing a delete button improves usability but does not enforce permission.

3. Existing university-account login is not established. The draft lists login instructions but gives no integration contract. A directory provider could be a useful option if the university confirms it. Check identity-provider availability, supported interfaces and the system owner. Counterexample: a small fictional university has no central directory. Do not turn a possible integration into a factual requirement.

4. Documentation depth should be proportional. "Relevant API endpoints" could mean documenting only the public or operational interfaces, rather than every internal helper. Check what university IT staff need to install, troubleshoot and modify the service. A complete generated API catalogue can still omit the reasons for design decisions. Keep the delivery focus on usable handover rather than document volume.

5. Support responsibility is clear in principle but not testable yet. "The university must agree who owns operations after handover" should become a handover checklist item with a named contact, incident route and recovery procedure. Check an agreed responsibility list and a restore rehearsal. A support promise without an owner may leave failures unanswered. No specific response time should be asserted without staffing and an agreement.
```

### B3 — Revision (Prompt C)

- **Tool:** ChatGPT / Codex
- **Model:** GPT 6.1 sol
- **Date:** 2026-10-13
- **Purpose:** revision using assistant-proposed decisions and actual source notes

**Prompt:**

```text
Revise the draft using my review decisions and source notes below. Keep the answer relevant to my scenario and preserve uncertainty where evidence is limited.

My decisions: Accept points 1 and 2: specify a concurrent acceptance outcome and booking-level authorization. Qualify point 3: possible directory integration is useful, but reject a mandatory provider without confirmed infrastructure. Accept point 4 with proportional documentation. Accept point 5 with named support responsibilities, without an invented response-time promise.. Verified evidence: OWASP Authorization Cheat Sheet, section Verify that Authorization Checks are Performed in the Right Location, https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html, opened by assistant 2026-10-13: decisive access checks should be server-side. PostgreSQL 17 documentation, section 8.17.10 Constraints on Ranges, room_reservation example, https://www.postgresql.org/docs/17/rangetypes.html, opened by assistant 2026-10-13: combining room equality and range overlap in an exclusion constraint provides a non-overlap mechanism for the same room; retain only as an option.. Draft: Professional software delivery gives the university more than executable code. It provides a system that users can understand, operators can install, and future developers can maintain. In this fictional study room service, the delivery package should connect agreed booking rules to documentation, test evidence and named responsibilities. These are recommendations for the scenario, not evidence that a real university already has these arrangements.

The requirements document should identify users and permitted actions. Students and teachers book rooms, while administrators manage bookings and rooms. The two central constraints are non-overlapping active bookings for the same room and preventing students from deleting someone else's booking. Acceptance criteria should explain how the university decides whether these constraints are satisfied. Rules about cancellation, touching time intervals and account access need agreement rather than guesses.

User instructions should show login, room selection, booking and cancellation with short examples. Administrator instructions should explain room changes and permitted deletion. Technical documentation should include an architecture overview, a database diagram and relevant API endpoints. Detailed documentation takes time and becomes outdated unless changes are maintained. However, a small, accurate set of documents helps future staff understand why important decisions were made.

The installation package should contain required software versions, dependencies, database setup instructions and configuration examples without real credentials. A clean repository and understandable commits help university IT staff reproduce the delivered version. A live demonstration can support acceptance, but the institution should receive reproducible installation steps rather than depending entirely on the developer's demonstration server.

Testing should include successful bookings, rejected overlaps, account permissions and room management. Two users attempting conflicting bookings at nearly the same time deserve particular attention because checking availability and saving a booking are different operations. Database enforcement could strengthen the booking rule; PostgreSQL is one possible implementation to investigate, not a required technology. Server-side permission checks should protect deletion even when a user bypasses the normal interface. These technical claims require verification in authoritative sources.

Support should identify who receives incidents, deploys fixes and maintains documentation. Known defects should be recorded with their impact and any workaround. A simple support plan is preferable to an invented promise of continuous availability. The university must agree who owns operations after handover.

Two engineering decisions follow from the scenario. First, tie acceptance tests to the most harmful failures before adding presentation features. This uses limited effort on booking conflicts and unauthorized deletion. Second, deliver concise operational documentation together with code and test results. This increases initial work but reduces dependence on the original developer. Neither passing tests nor complete documents guarantee permanent reliability; real usage, workload and support capacity remain uncertain..

Show what you changed and why. Use only the sources I supplied. Flag remaining gaps instead of inventing details.
```

**Response:**

```text
Professional delivery should give the university a usable service and a practical handover package. Working code is necessary, but operators also need agreed requirements, installation instructions, test evidence and support ownership. The starting outline identifies user guidance, technical documents, deployment information, quality evidence and a clean repository. Each item should explain a task that a university user or maintainer actually performs.

The requirements record should describe booking and deletion permissions, cancellation rules and the interpretation of time boundaries. Those details become acceptance criteria. For example, the scenario requires that two conflicting requests cannot both become active bookings. Tests should cover ordinary use, simultaneous conflicting requests and attempts to delete another student's booking. Passing results document observed behavior; they do not prove the absence of every possible defect.

Decision one is to protect booking integrity at the point where reservations are saved. A concurrent acceptance test should submit two overlapping requests for one room and confirm that only one becomes active. PostgreSQL documents a room-and-range exclusion constraint as one possible mechanism [2]. This is an implementation option, not evidence that the university uses PostgreSQL. Its trade-off is stronger enforcement against additional schema and migration complexity.

Decision two is to require server-side authorization for every protected operation. The application should check the authenticated role and the relationship between the user and the booking. OWASP supports server-side enforcement [1]. Tests should include changed identifiers and direct requests. These checks add implementation and testing effort, but address the specific deletion constraint more effectively than interface controls alone.

User guidance should offer short booking examples, while administrator guidance explains room changes and permitted deletion. Technical documents should show architecture, data relationships and relevant operational interfaces. Deployment instructions should name dependencies, configuration variables and migration steps, with credential-free examples. A demonstration supports understanding, but IT staff should also reproduce installation from the delivered repository.

Finally, handover should identify an incident contact, maintenance owner, backup procedure and restore rehearsal. Versioned documentation and a known-defect list should accompany each release. The university should agree support arrangements instead of assuming continuous availability. More documentation and testing increase initial work; concise, maintained materials reduce dependence on the original developer. The final package should therefore prioritize evidence and operational usefulness over document volume.

Changes and reasons:
1. Added the one-active-booking concurrent acceptance outcome because of the scenario's main risk; PostgreSQL [2] supplies one candidate mechanism.
2. Expanded deletion protection to booking-level server-side checks, supported by OWASP [1] and the scenario's ownership rule.
3. Added named operational responsibilities and a restore rehearsal as scenario-based recommendations, not externally guaranteed services.

Remaining gaps: identity provider, database choice, cancellation rules, measured workload, staffing and service targets are unconfirmed. No operational system has been implemented. The source notes were obtained by the assistant; the student has not yet confirmed reading them.
```


## 9. Appendix C — Evidence tables

### Verification table

| AI claim | Source and locator | Evidence found | Decision |
| --- | --- | --- | --- |
| Server-side permission checks should protect deletion even when a user bypasses the normal interface. | OWASP Authorization Cheat Sheet, Verify that Authorization Checks are Performed in the Right Location; https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html; assistant access 2026-10-13 | The relevant section supports server-side enforcement; application to booking ownership is a scenario decision. Student reading is not confirmed. | keep |
| Database enforcement could strengthen the booking rule; PostgreSQL is one possible implementation to investigate, not a required technology. | PostgreSQL 17 Documentation, 8.17.10 Constraints on Ranges, room_reservation example; https://www.postgresql.org/docs/17/rangetypes.html; assistant access 2026-10-13 | The example combines room equality with range overlap to exclude conflicting rows; this demonstrates an available mechanism, not the university's platform. Student reading is not confirmed. | qualify |

### Change log

| AI wording / suggestion | Your final version | Reason for change |
| --- | --- | --- |
| Two users attempting conflicting bookings at nearly the same time deserve particular attention. | Submit two overlapping requests for one room and confirm that only one becomes active. | The scenario's main risk needs a measurable outcome; database mechanism considered in verification row 2. Assistant-proposed revision. |
| Server-side permission checks should protect deletion even when a user bypasses the normal interface. | Check authenticated role and user-booking relationship; test changed identifiers and direct requests. | Booking ownership constraint and verification row 1 require protection beyond interface controls. Assistant-proposed revision. |
| The university must agree who owns operations after handover. | Identify an incident contact, maintenance owner, backup procedure and restore rehearsal. | Makes the handover actionable without inventing a support service level. Assistant-proposed revision. |
