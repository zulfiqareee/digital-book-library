# Security Specification: Digital Book Library

## 1. Data Invariants

1. **Free Reading Invariant:** Published books (`isPublished == true`) are readable by everyone.
2. **Download Entitlement Invariant:** Original PDF download tokens are NEVER issued without a verified completed bKash purchase record (`status == 'COMPLETED'`) belonging to the requesting `userId`.
3. **Price Integrity Invariant:** Book prices are strictly controlled by the backend server and administrator. The client cannot forge or alter the checkout amount.
4. **Admin Mutation Invariant:** Only server-verified administrators (matching `/admins/{adminId}` or user email `zulfiqar1hasan@gmail.com`) can upload, edit, publish, or delete books. Public visitors have read-only access to published books.
5. **Private PDF Storage Invariant:** Unrestricted original PDF download URLs are never exposed in public book metadata or client reading views. Reading uses server-rendered protected page streams.

## 2. The "Dirty Dozen" Adversarial Payloads

1. **Unpaid Download Spoof:** An unauthenticated or unpaid user calling `POST /api/books/:id/request-download`. Expected: HTTP 401/403 PERMISSION_DENIED.
2. **Forged Client Payment:** Client sending arbitrary `status: "COMPLETED"` without bKash server verification. Expected: Rejected, status remains unverified.
3. **Shadow Field Injection:** Attempting to inject `isAdmin: true` into a user document during profile creation. Expected: Blocked by Firestore security rules.
4. **Price Modification Attack:** Attacker posting a book update changing `priceBDT: 0`. Expected: 403 Forbidden unless authenticated admin.
5. **ID Poisoning Attack:** Creating a book with a 2MB non-alphanumeric ID string. Expected: Blocked by `isValidId()` guard.
6. **Cross-User Entitlement Hijacking:** User A requesting a download token using User B's purchase order ID. Expected: Blocked, `userId` mismatch.
7. **Public Book Unpublishing:** Non-admin attempting to delete or unpublish another author's book. Expected: Blocked.
8. **Permanent URL Scraping:** Searching public catalogue response for direct Cloud Storage bucket links. Expected: Storage keys are stripped from public responses.
9. **Expired Token Re-Use:** Submitting a download token older than 300 seconds. Expected: Rejected with 403 Expired Token.
10. **Unpublished Book Exposure:** Public user requesting an unpublished draft book via `/api/books/:id`. Expected: 403 or 404.
11. **bKash Double-Claim Replay:** Sending duplicate payment notifications for the same `paymentID`. Expected: Handled idempotently without double-crediting.
12. **Negative Price Exploit:** Admin or user setting `priceBDT: -500`. Expected: Rejected by input validator.
