# DocuMind AI Requirements

## 1. Product Overview

DocuMind AI is an authenticated document workspace for uploading PDF files, asking questions about their contents, and receiving concise answers grounded in those files. Answers include source citations that help users verify where information came from. Users can return to prior conversations and continue working with their documents.

The initial release is a production-style portfolio MVP for one developer to build incrementally. It should demonstrate a complete, secure path from account access through document ingestion, retrieval-augmented question answering, and persistent chat history. The MVP prioritizes correctness, understandable limits, and a usable end-to-end workflow over broad integrations or advanced collaboration.

### Target users

- Students and researchers reviewing a small collection of course or research PDFs.
- Professionals who need to find and cross-reference information in personal work documents.
- Portfolio reviewers evaluating a practical full-stack application with authentication, file handling, relational data, and an LLM-backed workflow.

The product is for individual use in the initial release. It is not intended for regulated or safety-critical decisions.

### Planned stack

- Frontend: React, TypeScript, Vite, and Tailwind CSS.
- API: Node.js and Express, with Zod for request validation.
- Data: PostgreSQL with Prisma for schema and database access.
- Files: Supabase Storage for private PDF object storage.
- AI: an LLM API for answer generation and an embedding API for document retrieval.

## 2. MVP Functional Requirements

### Authentication and account access

- Users can register, sign in, sign out, and access only their own workspace.
- Authentication credentials and sessions are handled using a secure, established approach; passwords are never stored in plaintext.
- Unauthenticated users are directed to sign in before accessing protected workspace data.

### PDF document management

- An authenticated user can upload a PDF within configured file-size and page-count limits.
- The system validates file type and content, assigns a safe storage key, and stores the file in a private Supabase Storage bucket.
- The application records document metadata and an ingestion status. The user can see whether a document is processing, ready, or failed.
- A user can view their document list and remove a document. Removal also makes its stored file and searchable content unavailable.
- The MVP supports text-based PDFs. Scanned PDFs requiring OCR may be rejected with a clear explanation.

### Document processing and retrieval

- The system extracts text from accepted PDFs, divides it into bounded chunks, and creates embeddings through the configured embedding API.
- Extracted content, chunk metadata, and embeddings are associated with the owning user and document in PostgreSQL.
- Processing failures are recorded and surfaced without leaving the document indefinitely in a processing state.
- Retrieval for a question is restricted to the current user's selected document or documents; other users' content is never eligible.

### Questions, answers, and citations

- A user can start a conversation and ask a question about one or more ready documents.
- The system retrieves relevant text chunks and sends only the necessary context to the configured LLM API.
- Answers are grounded in retrieved content, include citations to the source document and page where available, and do not present unsupported claims as sourced facts.
- If the available documents do not contain enough information, the assistant says so rather than inventing an answer.
- The interface displays a useful pending state while an answer is generated and a recoverable error if the request fails.

### Conversation history

- Conversations and messages persist across page reloads for their owner.
- A user can view a list of their conversations, reopen one, and see its messages and citations.
- A conversation retains references to the documents used so its context is understandable when revisited.
- Users cannot access, list, or mutate another user's conversations or messages.

### Workspace interface

- The authenticated workspace provides navigation to documents and conversation history, plus a clear way to start a conversation.
- Loading, empty, validation, processing, and error states are communicated in the interface.
- The layout works on current desktop and mobile browser sizes and supports keyboard operation for primary workflows.

## 3. Acceptance Criteria for MVP Features

Each criterion is observable through the user interface or a corresponding API/integration test. External APIs may be replaced with deterministic test doubles during automated tests.

### Authentication and authorization

- A new user can register, sign in, and sign out; invalid credentials produce a generic error that does not reveal whether an account exists.
- A signed-out request to a protected page or API cannot retrieve workspace data.
- Given two users, requests made as one user cannot read, change, or delete the other's documents, conversations, or messages, including by substituting resource IDs.
- Passwords are stored only as an appropriate one-way password hash, and session cookies use secure settings in production.

### PDF upload and document list

- A valid PDF within configured limits can be uploaded by an authenticated user and appears in that user's document list.
- A non-PDF, malformed PDF, or file exceeding configured limits is rejected with a clear message and is not made available for processing.
- A document shows a processing, ready, or failed status; a failed processing attempt does not appear ready or remain processing indefinitely.
- A user sees only their own documents, including after reloading the page.

### Processing and deletion

- A supported text-based PDF is extracted, chunked, embedded, and becomes available for question answering.
- Each stored chunk can be traced to its document and page when page information is available.
- Deleting a document removes or invalidates its file, extracted content, chunks, and embeddings; it cannot be retrieved in a new answer afterward.
- A processing error is recorded and shown to the owner without exposing secrets, provider credentials, or another user's data.

### Question answering and citations

- A user can submit a non-empty question against at least one selected ready document and receive a response tied to that request.
- A response based on retrieved content includes at least one citation that links to a selected source document and identifies a page when available.
- When retrieval finds no sufficiently relevant evidence, the response explicitly communicates that the documents do not provide an answer; it does not fabricate a citation.
- Questions cannot retrieve evidence from documents outside the user's authorized selection or ownership.
- A provider timeout or error is surfaced as a recoverable failure; the conversation remains usable and the user can retry.

### Conversation history

- A submitted question and its completed answer, including citations, are visible after navigating away and reopening the conversation.
- A user can reopen any conversation in their own history and see messages in chronological order.
- A conversation or message belonging to another user cannot be opened by guessing or substituting its identifier.

### Usability and accessibility

- The core upload, start-conversation, ask-question, and revisit-history flows are usable at desktop and mobile viewport sizes without horizontal page overflow.
- All primary controls are reachable and operable by keyboard, have programmatic labels, and expose visible focus.
- Form errors and processing/result status are conveyed in text and are not communicated by color alone.
- Empty, loading, and error states provide a clear next action where one is possible.

## 4. Non-Functional Requirements

### Security

- Enforce authentication and resource ownership on the server for every protected operation; client-side checks are not authorization.
- Validate and constrain request bodies, query parameters, identifiers, uploaded content, and file sizes with Zod and server-side checks.
- Store provider keys and database credentials only in environment-managed secrets; never return them to clients or commit them to source control.
- Use private object storage, unpredictable storage keys, and short-lived authorized access when file download access is needed.
- Apply secure production transport and cookie settings, appropriate security headers, rate limits on costly or abuse-prone endpoints, and protection against common web vulnerabilities.
- Avoid logging passwords, session tokens, raw document contents, or full prompts containing sensitive user data.

### Privacy

- User documents, extracted text, embeddings, and conversations are private to their owner by default.
- Send document excerpts to external LLM and embedding providers only as needed to perform requested processing and answering; disclose this behavior in the product's privacy information before public use.
- Define and document retention and deletion behavior, including provider-side processing limitations and backups where applicable.
- Provide a reliable deletion path for user-controlled files and derived content. Do not claim immediate erasure from external providers or backups unless verified.
- Collect only account and operational data needed for the service; do not use uploaded content for unrelated purposes.

### Accessibility

- Target WCAG 2.2 AA for core workflows, including semantic structure, keyboard access, visible focus, sufficient contrast, labels, and understandable errors.
- Support screen-reader announcements for meaningful upload, processing, and answer-generation status changes.
- Preserve usability at browser zoom and on narrow screens; avoid relying on color, motion, or hover alone to communicate information.

### Reliability

- Ingestion and answer-generation failures produce a visible, recoverable state and do not silently corrupt conversation or document records.
- Repeated processing or submission requests should not create uncontrolled duplicate records or duplicate costly work where idempotency can reasonably be applied.
- Use bounded retries and timeouts for external providers; transient provider failures must not leave requests or documents in an indefinite pending state.
- Database migrations and backups are managed deliberately for deployed environments; recovery expectations are documented before public production use.

### Performance

- Use pagination or bounded queries for document and conversation lists as data grows.
- Enforce configurable limits for file size, page count, extracted text, chunk count, prompt context, and request duration to control resource use and cost.
- Perform potentially long-running ingestion outside the synchronous upload response, with status persisted so the UI can report progress.
- Establish a portfolio-scale target of under 2 seconds for typical non-provider workspace reads at the 95th percentile, excluding network latency outside the application. LLM and embedding response times are provider-dependent and must be shown as pending rather than hidden.

### Maintainability

- Keep API validation, authorization, document processing, retrieval, and provider integrations in separable modules with clear ownership boundaries.
- Use TypeScript across client and server code where practical, Zod at untrusted input boundaries, and Prisma migrations for schema changes.
- Keep secrets and environment-specific configuration out of source; document required variables and setup in project documentation when implementation begins.
- Include automated tests for authorization boundaries, validation, core document and conversation behavior, and key failure cases.
- Make LLM and embedding providers replaceable behind narrow interfaces so tests can use deterministic substitutes and future providers can be evaluated.

## 5. High-Level User Journeys

### First-time user asks about a document

1. The visitor registers and signs in.
2. They upload a supported PDF and see its processing status.
3. Once processing is complete, they select the document and start a conversation.
4. They ask a question and see the answer, source citation, and page reference when available.
5. They open the citation to verify the supporting document location.

### Returning user revisits a conversation

1. The user signs in and opens conversation history.
2. They choose a prior conversation and review its questions, answers, and citations.
3. They continue asking questions using the conversation's available documents.

### User handles an unsupported or failed document

1. The user attempts to upload an invalid, oversized, or unsupported PDF.
2. The application rejects it with a specific, actionable explanation and does not expose it as ready.
3. For a processing failure, the user can see the failed status, retry when supported, or remove the document.

### User removes a document

1. The user chooses to delete a document and confirms the action.
2. The document is removed from their workspace and its stored and indexed content is no longer available for retrieval.
3. Existing conversation history remains understandable; deleted-source citations are clearly unavailable rather than silently pointing to another resource.

## 6. Advanced Features Planned for Later

These are not required for the initial release and should be considered only after the MVP's security and core workflows are stable.

- OCR for scanned PDFs and broader file formats such as DOCX, TXT, and HTML.
- Background job queue, resumable uploads, bulk upload, and richer processing progress.
- Better retrieval such as hybrid keyword/vector search, reranking, query rewriting, and user-adjustable retrieval settings.
- Streaming answers, suggested questions, conversation renaming, search, and export.
- Highlighted source passages, in-app PDF viewing, and citation navigation to exact page locations.
- User-configurable retention, account export, and account deletion workflows with documented backup lifecycle.
- Shared workspaces, team roles, and document sharing with explicit permissions.
- Usage quotas, billing, administrative operations, analytics, and abuse monitoring.
- Provider selection, model configuration, evaluation datasets, and answer-quality feedback workflows.
- Internationalization and expanded accessibility testing with assistive technologies.

## 7. Initial Release Out of Scope

- Team accounts, shared workspaces, public links, or cross-user document access.
- Mobile native applications or offline synchronization.
- OCR, handwriting recognition, and guaranteed support for image-only or encrypted/password-protected PDFs.
- Guaranteed support for files beyond documented size, page, and content limits.
- Real-time collaborative editing or multi-user live conversations.
- Legal, medical, financial, or other regulated decision support; guarantees that AI answers are correct or complete.
- Training or fine-tuning a model on user documents.
- User-facing model/provider selection, billing, subscription plans, or enterprise administration.
- Unbounded web search or answers sourced from outside the user's selected documents.
- Guaranteed provider-side deletion, zero retention, or immediate deletion from backups unless the selected providers and deployment can substantiate those guarantees.