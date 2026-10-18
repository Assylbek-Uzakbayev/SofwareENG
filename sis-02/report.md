# SIS #02 — AI-Assisted UML Modeling: University Course Registration

> TECHNICAL DRAFT — prepared by the assistant at the student's direct request, not through the prescribed A–D exchanges. This is not a completed workflow record. No initial Git commit/push has been verified. Full student review, independent Prompt C and a verified Git commit history are pending. The reflection is an AI-assisted draft based on student answers, not independently authored student prose. Do not submit unchanged.

## 1. Scope and assumptions

**Scope:** Model semester catalog browsing, selection of a CourseOffering and registration with atomic duplicate and capacity checks. Confirm success or explain rejection without changing state. Payments, prerequisites, timetable clashes, waiting lists and cancellation are out of scope.

**Assumptions:**

1. The student is already signed in.
2. The selected offering exists and capacity is a positive whole number.
3. Proposed design assumption: a Course may currently have zero CourseOfferings; each offering belongs to exactly one Course.
4. Proposed outcome priority: an existing enrollment is reported before fullness when both conditions hold.

## 2. User stories and acceptance criteria

Assistant-proposed requirements; student approval has not yet been recorded.

### US-01 — Browse offerings

**US-01:** As a student, I want to browse offerings for one semester, so that I can select a suitable offering.

- **AC-01** (R1): Given offerings exist for a semester, When I browse that semester's catalog, Then each result shows its course code, title, offering identifier and available places.
- **AC-02** (R1, R2): Given I view an offering with available places, When I select it, Then the selection identifies that offering and does not reserve a place; registration must recheck current availability.

### US-02 — Register for an offering

**US-02:** As a student, I want to register for a selected offering, so that I receive a confirmed place.

- **AC-03** (R2, R3, R4): Given capacity is 2, enrolled count is 0 and I am not enrolled, When I request registration, Then the system atomically checks duplicates and capacity, creates exactly one Enrollment linking me to that offering, changes count to 1 and available places to 1, and returns confirmation.
- **AC-04** (R2, R3, R4): Given capacity is 2, enrolled count is 1 and I am not enrolled, When I request registration, Then atomic checks and creation produce exactly one Enrollment, count becomes 2, available places become 0 and confirmation is returned; a competing new student cannot take that same last place.

### US-03 — Receive a clear rejection

**US-03:** As a student, I want a clear reason when registration is rejected, so that I understand the result.

- **AC-05** (R2, R5): Given the catalog showed a place but the current count is 2 of capacity 2 and I am not enrolled, When I request registration, Then the current capacity check rejects with course full, creates no Enrollment and leaves count at 2.
- **AC-06** (R3, R5): Given I already hold an Enrollment in the offering with count 1 of capacity 2, When I request registration again, Then the duplicate check rejects with already enrolled, creates no Enrollment and leaves count at 1.

## 3. Sequence diagram

![Final sequence diagram](models/img/sequence.svg)

**Participants:** Student is the signed-in requester. CatalogService presents semester offerings. RegistrationService coordinates registration. RegistrationStore reads and creates enrollment records.

**Atomic operation:** The atomic registration operation serializes all requests for the same offering. It includes alreadyEnrolled, countEnrollmentsAndCapacity, the guarded decision and createEnrollment. The resulting availability is derived before confirmRegistration. Catalog browsing reserves nothing. A database implementation would have to enforce both uniqueness and capacity under concurrency.

**Where the Enrollment is created:** RegistrationService sends createEnrollment(studentId, offeringId) to RegistrationStore only in the success branch. This creates one record of domain class Enrollment, linking the identified Student and CourseOffering.

**Technical lifelines:** CatalogService, RegistrationService and RegistrationStore represent application and storage responsibilities, rather than domain entities. Their omission from the domain class diagram is deliberate. Student represents the actor corresponding to the Student domain concept.

## 4. Class diagram

![Final class diagram](models/img/classes.svg)

| Association | Read left to right | Read right to left |
| --- | --- | --- |
| Student — Enrollment | One Student holds zero or many Enrollments. | Each Enrollment belongs to exactly one Student. |
| CourseOffering — Enrollment | One CourseOffering receives zero or many Enrollments. | Each Enrollment targets exactly one CourseOffering. |
| Course — CourseOffering | One Course has zero or many CourseOfferings. | Each CourseOffering describes exactly one Course. |

**How an Enrollment links a student to an offering:** Two mandatory associations give each Enrollment exactly one Student and exactly one CourseOffering. Registration uses studentId and offeringId to identify the endpoints.

**Capacity constraint:** For every offering, capacity is a positive integer and 0 <= enrollment count <= capacity. availablePlaces is derived as capacity minus enrollment count. A fixed 0..* multiplicity cannot express an upper bound taken from another attribute.

**Uniqueness constraint:** Each (studentId, offeringId) pair occurs in at most one Enrollment. Multiplicities constrain the number of links per endpoint; they do not prohibit separate Enrollment objects from connecting the same pair.

## 5. Traceability

| Rule and criterion | Model evidence | Validation case |
| --- | --- | --- |
| R1 + AC-01, AC-02 | browseCatalog, getOfferings and showCatalog include semester, courseCode, title, offeringId and availablePlaces. | Assistant catalog inspection: all four displayed fields and semester argument are present; selection note reserves nothing. |
| R2 + AC-02, AC-03, AC-04, AC-05 | countEnrollmentsAndCapacity follows register; atomic note serializes competing registrations; capacity note constrains count. | T1, T2, T3; additional last-place interleaving inspection. |
| R3 + AC-03, AC-04, AC-06 | alreadyEnrolled check precedes creation; already enrolled branch; uniqueness note. | T4. |
| R4 + AC-03, AC-04 | createEnrollment followed by updateAvailability and confirmRegistration in success branch only. | T1, T2. |
| R5 + AC-05, AC-06 | course full and already enrolled branches return reasons without any write or confirmation. | T3, T4. |

## 6. Walkthroughs

The following paths were traced by the assistant against the supplied source. They are not claimed as student-authored walkthroughs. The student must independently trace and rewrite or approve them with disclosure.

| Case | Observed path and state change | Judgment and evidence |
| --- | --- | --- |
| T1. Available | browseCatalog → getOfferings → showCatalog; select offering; register; alreadyEnrolled returns false; countEnrollmentsAndCapacity returns 0 and 2; success guard; createEnrollment; count 0 to 1; updateAvailability derives 1; confirmRegistration. | Pass — success guard not enrolled and places left; createEnrollment precedes confirmRegistration; atomic note covers the checks. |
| T2. Last place | browseCatalog → getOfferings → showCatalog; select offering; register; alreadyEnrolled returns false; countEnrollmentsAndCapacity returns 1 and 2; success guard; createEnrollment; count 1 to 2; updateAvailability derives 0; confirmRegistration. | Pass — atomic registration note and createEnrollment; a serialized second new student sees count 2 and takes course full. |
| T3. Full | browseCatalog → getOfferings → showCatalog originally displays one place; another registration fills it; register; alreadyEnrolled returns false; countEnrollmentsAndCapacity returns 2 and 2; course full branch returns course full; no creation; count remains 2. | Pass — course full guard uses the current count after register; rejection branch has no state-changing message. |
| T4. Duplicate | browseCatalog → getOfferings → showCatalog; select offering; register; alreadyEnrolled returns true; countEnrollmentsAndCapacity returns 1 and 2; already enrolled branch returns already enrolled; no creation; count remains 1. | Pass — already enrolled guard precedes the other outcomes and returns only the rejection reason. |

Additional assistant check: if a duplicate request also sees a full offering, the duplicate guard wins. This priority is a proposed design decision, not a university policy.

**Last-place concurrency walkthrough — requested by the student:** Start with capacity 2 and count 1. Fictional students A and B both see availablePlaces 1 in their catalog snapshots. If A enters the atomic registration operation first, alreadyEnrolled returns false and countEnrollmentsAndCapacity returns count 1, capacity 2. A takes not enrolled and places left, creates one Enrollment, changes count to 2 and receives confirmation with zero places. Only after A completes can B enter the same offering's serialized atomic operation. B has no duplicate, but now reads count 2, capacity 2; B takes course full, creates nothing and leaves count 2. If B enters first, the roles reverse: B succeeds and A is rejected. Both possible serialized orders preserve count <= capacity and produce exactly one new Enrollment. A stale catalog snapshot does not reserve the place.

**Concurrency verdict:** Pass at the model level, located in the atomic registration note and the current capacity check before createEnrollment. This is a manual trace of the model's specified serialization, not an execution test of a database or proof that an implementation enforces the note. If both requests could read count 1 before either created an Enrollment, the implementation would violate that atomic requirement.

## 7. Review decisions

These decisions come from assistant inspection, not independent Prompt C. The student explicitly accepted the third decision; the other decisions remain proposals. The student also requested the last-place concurrency walkthrough.

| AI suggestion or model element | Decision | Reason | Rule |
| --- | --- | --- | --- |
| Atomic registration group | Proposed: retain per-offering serialization. | Two checks without an indivisible creation step still allow competing requests to claim the same remaining place. | R2, R3, R4 |
| Separate uniqueness constraint | Proposed: retain the note on Enrollment. | Two different Enrollment objects could otherwise connect the same Student and CourseOffering while respecting every multiplicity. | R3 |
| Course to CourseOffering 0..* | Accepted by student: retain subject records without scheduled sections. | The student said this decision seemed more correct; the model permits a subject to exist before any scheduled section. | R1 |
| Duplicate outcome before fullness | Proposed: retain duplicate priority. | An existing enrollment provides a precise rejection reason even when the offering has since reached its capacity. | R3, R5 |
| Confirmation after createEnrollment | Proposed: retain message ordering. | The student must receive confirmation only after exactly one enrollment record has been successfully created for the offering. | R4, R5 |
| Reflection authorship | Student must review and rewrite the AI-expanded English draft. | The draft reflects actual student answers, but AI expansion does not meet the requirement for independently written student prose. | R1-R5 |
| E3, E4, E6, E7, E8, E9, E10: A–D evidence and initial push | Record the missing workflow honestly. | Prepared prompt files are not executed exchanges and local artifact creation is not evidence of a pushed baseline commit. | R1-R5 |

## 8. Modeling explanation

<!-- Assistant-authored draft, requiring student understanding and rewriting to meet the authorship requirement. -->
The model separates a Course from a CourseOffering because a subject and a scheduled section are different concepts. Course contains the code and title, while CourseOffering contains the semester, identifier and capacity. Registration always targets an offering, rather than the general subject. A course may have no scheduled offerings, so its offering multiplicity is zero to many.

Enrollment represents the connection between one Student and one CourseOffering. Each student and offering can be associated with many enrollment records, but every individual enrollment refers to exactly one of each. These associations describe structure. They cannot express the offering's variable capacity or prevent two records with the same student and offering identifiers, so separate constraints state those rules.

The sequence begins with catalog browsing and selection. Its displayed availability is only a snapshot. After the registration request, the system checks duplicates and current capacity inside one atomic operation. A duplicate receives already enrolled; a new student facing a full offering receives course full. Neither rejection changes state. Only the success branch creates an enrollment, derives the new availability and returns confirmation.

CatalogService, RegistrationService and RegistrationStore are technical lifelines, while the class diagram shows domain concepts. This difference keeps storage coordination separate from the domain structure. The sequence diagram explains when checks and changes occur; the class diagram explains what the records mean. An activity diagram could complement them by presenting the student's choices and the three outcomes as a compact workflow. Atomicity remains a modeling requirement, not evidence of a tested implementation.

## 9. Reflection

<!-- AI-expanded English draft based on the student's actual Kazakh answers and this conversation. This is not independently authored student prose; student review and rewriting remain necessary. -->
At the beginning, this task was difficult for me. Later, I understood the difference between Course and CourseOffering. AI helped me most by explaining this difference with examples. For example, Software Engineering is a Course. Software Engineering for group A in the autumn semester of 2026 is a CourseOffering. The first concept describes the subject, while the second identifies a particular scheduled section.

I agreed with the third proposed modeling decision, which allows a Course to exist without a scheduled CourseOffering. This decision seemed more correct to me. I have not yet given a more detailed independent reason for accepting it.

I also wanted to check the last available place when two students request registration. The assistant traced both possible serialized orders: one student receives confirmation and the other receives course full. This showed why the current count must be checked during registration. The remaining limitation of this check is that it follows the model's atomicity assumption; it does not test a working registration system.

## 10. Appendix A — Before AI

**Scope:** The student opens the course catalog, selects a course offering and requests registration. The system checks whether places are available.

**Initial assumptions:**

1. The student is already signed in.
2. The selected course offering exists, and its capacity is a positive whole number.

<!-- These English statements translate the student's Kazakh answers in this conversation. The preceding AI guidance and translation assistance must be disclosed. A commit and push before the required Prompt A have not been verified. -->

## 11. Appendix B — AI exchanges

Actual assistance: ChatGPT Work / model not displayed / 2026-10-18. The student asked the assistant to prepare the work fully. The assistant explained scope and assumptions, translated the student's answers and prepared this technical draft. This chat did not contain the four prescribed prompts as executed user exchanges. Prepared prompts in prompts/ are future inputs, not evidence of completed exchanges. No new-chat critique has occurred.

### B1 — Requirements (Prompt A)

- **Tool:** ChatGPT Work
- **Model:** not displayed
- **Date:** 2026-10-18
- **Purpose:** prepared input only; exchange not executed

**Prompt:**

~~~~text
NOT EXECUTED. Use prompts/Prompt_A.txt when this stage is reached.
~~~~

**Response:**

~~~~text
No response exists for this prescribed exchange. The technical draft elsewhere was created in response to the student's direct request, not this prompt.
~~~~

### B2 — UML drafts (Prompt B)

- **Tool:** ChatGPT Work
- **Model:** not displayed
- **Date:** 2026-10-18
- **Purpose:** prepared input only; exchange not executed

**Prompt:**

~~~~text
NOT EXECUTED. Use prompts/Prompt_B.txt when this stage is reached.
~~~~

**Response:**

~~~~text
No response exists for this prescribed exchange. The technical draft elsewhere was created in response to the student's direct request, not this prompt.
~~~~

### B3 — Model critique (Prompt C)

- **Tool:** ChatGPT Work
- **Model:** not displayed
- **Date:** 2026-10-18
- **Purpose:** prepared input only; exchange not executed

**Prompt:**

~~~~text
NOT EXECUTED. Use prompts/Prompt_C.txt when this stage is reached.
~~~~

**Response:**

~~~~text
No response exists for this prescribed exchange. The technical draft elsewhere was created in response to the student's direct request, not this prompt.
~~~~

### B4 — Focused revision (Prompt D)

- **Tool:** ChatGPT Work
- **Model:** not displayed
- **Date:** 2026-10-18
- **Purpose:** prepared input only; exchange not executed

**Prompt:**

~~~~text
NOT EXECUTED. Use prompts/Prompt_D.txt when this stage is reached.
~~~~

**Response:**

~~~~text
No response exists for this prescribed exchange. The technical draft elsewhere was created in response to the student's direct request, not this prompt.
~~~~

## 12. Appendix C — Original diagrams

These are the assistant's unedited first technical drafts from this direct-request workflow. They are intentionally identical to the current model sources. They are not claimed to be the output of an executed Prompt B. Replace them only with the genuine Prompt B output when performing that workflow.

![Original sequence diagram](models/img/original-sequence.svg)

![Original class diagram](models/img/original-classes.svg)

## 13. Appendix D — References and source checks

The assistant opened the following documentation on 2026-10-18. Student reading has not been confirmed. These sources support notation, not the correctness of the business rules or the implementation of concurrency.

### References

- PlantUML. Sequence diagram documentation. Section “Grouping message”. https://plantuml.com/sequence-diagram . Accessed by the assistant 2026-10-18.
- PlantUML. Class diagram documentation. Section “Label on relations”. https://plantuml.com/class-diagram . Accessed by the assistant 2026-10-18.
- Assignment README.md, sections 1, 4–6 and 11; supplied in SIS_02.zip, read 2026-10-18.

### Source checks

| Modeling decision | Source and locator | What the source says | How it supports or changed your model |
| --- | --- | --- | --- |
| Use guarded alternatives and an enclosing group | PlantUML Sequence diagram, Grouping message; https://plantuml.com/sequence-diagram ; accessed 2026-10-18 by assistant. | alt/else, critical and group delimit message fragments; end closes them. | Supports the branch notation. Atomic serialization is specified explicitly by the assignment and model note, not guaranteed by drawing a group. |
| Put multiplicities at both association ends | PlantUML Class diagram, Label on relations; https://plantuml.com/class-diagram ; accessed 2026-10-18 by assistant. | Cardinalities can be written in quotation marks at each relation end. | Supports the written 1 and 0..* association labels. Pair uniqueness and capacity remain separate assignment constraints. |
