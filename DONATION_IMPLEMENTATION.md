# Donation System Implementation - Member 3

## Summary
Complete implementation of the Donation system with Razorpay payment integration for the CrowdFunding Platform.

## Files Created

### 1. Models/DonationModel.js
**Purpose:** Database schema for donations

**Fields:**
- `campaign` - Reference to Campaign (required)
- `donor` - Reference to User (required)
- `amount` - Donation amount in INR (required, >0)
- `message` - Optional donor message
- `isAnonymous` - Boolean flag for anonymous donations
- `razorpayPaymentId` - Razorpay payment reference
- `razorpayOrderId` - Razorpay order reference
- `razorpaySignature` - Razorpay signature for verification
- `status` - Enum: ["pending", "success", "failed"] (default: "pending")
- `timestamps` - Auto-managed createdAt, updatedAt

---

### 2. config/razorpay.js
**Purpose:** Razorpay payment gateway initialization

**Configuration:**
```javascript
- Initializes Razorpay with API credentials
- Uses RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET from .env
- Exported as singleton instance
```

**Required .env variables:**
```
RAZORPAY_KEY_ID=your_key_id
RAZORPAY_KEY_SECRET=your_key_secret
```

---

### 3. utils/verifyRazorpaySignature.js
**Purpose:** Verify Razorpay payment signatures for security

**Function:** `verifyRazorpaySignature(razorpayOrderId, razorpayPaymentId, razorpaySignature)`
- Creates HMAC SHA256 hash using Razorpay secret
- Compares with received signature
- Returns boolean: true if valid, false if tampered

---

### 4. controllers/donationController.js
**Purpose:** Business logic for donation operations

**Endpoints Implemented:**

#### a) createOrder
- **Route:** `POST /api/donations/create-order`
- **Auth:** Required (user must be logged in)
- **Request Body:**
  ```json
  {
    "campaignId": "ObjectId",
    "amount": 1000
  }
  ```
- **Flow:**
  1. Validate input (campaignId, amount > 0)
  2. Verify campaign exists
  3. Verify campaign status is "approved"
  4. Convert amount to paise (multiply by 100)
  5. Create Razorpay order
  6. Save pending donation record
  7. Return order details with Razorpay Key ID for frontend
- **Response:**
  ```json
  {
    "success": true,
    "message": "Order created successfully",
    "data": {
      "orderId": "order_xxx",
      "amount": 1000,
      "currency": "INR",
      "donationId": "ObjectId",
      "razorpayKeyId": "key_xxx"
    }
  }
  ```

#### b) confirmDonation
- **Route:** `POST /api/donations/confirm`
- **Auth:** Required
- **Request Body:**
  ```json
  {
    "donationId": "ObjectId",
    "razorpayPaymentId": "pay_xxx",
    "razorpaySignature": "signature_xxx"
  }
  ```
- **Flow:**
  1. Validate all required fields
  2. Find pending donation by ID
  3. Verify donation belongs to current user
  4. Verify donation status is "pending"
  5. Verify Razorpay signature
  6. Update donation status to "success"
  7. Update campaign raisedAmount
  8. Add donation to campaign donations array
  9. Return confirmation with updated campaign state
- **Response:**
  ```json
  {
    "success": true,
    "message": "Payment confirmed successfully",
    "data": {
      "donation": {
        "id": "ObjectId",
        "amount": 1000,
        "status": "success",
        "campaign": "ObjectId"
      },
      "campaignUpdated": {
        "raisedAmount": 15000
      }
    }
  }
  ```

#### c) getUserDonations
- **Route:** `GET /api/users/me/donations`
- **Auth:** Required
- **Query Parameters:** None
- **Response:** Array of all donations made by logged-in user, sorted by creation date (newest first)
- **Populated fields:** Campaign details (title, category, goalAmount, raisedAmount)

#### d) getDonationById
- **Route:** `GET /api/donations/:donationId`
- **Auth:** Required
- **Access Control:** Only donor or admin can view
- **Response:** Complete donation details with campaign and donor info

---

### 5. routes/donation.routes.js
**Purpose:** Route definitions for donation endpoints

**Routes:**
```
POST /api/donations/create-order    - Create payment order
POST /api/donations/confirm          - Confirm payment
GET  /api/donations/:donationId      - Get donation details
GET  /api/donations/                 - Get user's donations (alternate naming)
```

All routes require authentication via `authMiddleware`.

---

## Integration Checklist

### Frontend Integration Required:
- [ ] Capture donation amount and campaign ID from user
- [ ] Initialize Razorpay with received Key ID and Order ID
- [ ] Handle payment modal
- [ ] Capture payment ID and signature
- [ ] Send confirmation request with payment details
- [ ] Display success/failure message

### Backend Integration Required:
- [ ] Ensure `.env` file has RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET
- [ ] Verify CampaignModel has `donations` array field
- [ ] Ensure auth middleware returns user._id or user.id
- [ ] Test with Razorpay test keys before production

### Campaign Model Consideration:
Your donation system expects the Campaign model to have:
- `donations` array field: `donations: [{ type: Schema.Types.ObjectId, ref: "Donation" }]`
- `status` field with "approved" value
- The current CampaignModel may need updates from Member 1

---

## Error Handling

All endpoints return consistent response format:
```json
{
  "success": false,
  "message": "Error description",
  "data": {}
}
```

**Common error scenarios handled:**
- Missing authentication token → 401
- Invalid campaign ID or not found → 404
- Campaign not approved → 400
- Invalid Razorpay signature → 400
- Unauthorized access → 403
- Donation not in pending state → 400
- Server errors → 500

---

## Security Features

1. **Authentication:** All donation endpoints require valid JWT token
2. **Authorization:** Users can only confirm their own donations
3. **Signature Verification:** All payments verified using Razorpay HMAC-SHA256
4. **Amount Validation:** Amounts must be positive
5. **Campaign Verification:** Only approved campaigns can receive donations
6. **Idempotency:** Duplicate confirmations are rejected (donation must be pending)

---

## Testing Scenarios

### Happy Path:
1. User initiates donation → GET order
2. User completes payment on Razorpay
3. System receives payment details
4. System verifies signature
5. Campaign raisedAmount updates
6. User views donation in history

### Error Cases:
- Tampered signature → Donation marked as failed
- Invalid campaign ID → 404 error
- Unapproved campaign → 400 error
- Duplicate confirmation → 400 error
- User tries to view others' donations → 403 error

---

## Environment Variables Needed
```
RAZORPAY_KEY_ID=rzp_test_xxxxx
RAZORPAY_KEY_SECRET=xxxxx
```

---

## Notes

- All monetary amounts are in INR (Indian Rupees)
- Razorpay amounts are stored in paise (1 INR = 100 paise)
- Donation status flow: pending → success OR pending → failed
- Anonymous donations are supported but still tracked by user ID internally
- All timestamps are automatically managed by MongoDB

---

## Next Steps for Team Integration

1. **Member 1 (Campaigns):** Ensure Campaign model has `donations` array field
2. **Member 2 (Coupons):** Integrate coupon assignment on successful donation
3. **Member 4 (Notifications):** Send notifications to campaign creator on donation received
4. **Frontend:** Implement Razorpay payment modal and API calls
