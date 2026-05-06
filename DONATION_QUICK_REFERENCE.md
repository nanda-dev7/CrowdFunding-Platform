# Donation System - Quick Reference

## Files Created ✅

```
backend/
├── Models/
│   └── DonationModel.js              ← Donation schema
├── config/
│   └── razorpay.js                   ← Razorpay initialization
├── utils/
│   └── verifyRazorpaySignature.js    ← Signature verification
├── controllers/
│   └── donationController.js          ← Business logic
└── routes/
    └── donation.routes.js             ← Route definitions
```

## API Endpoints

| Method | Route | Purpose | Auth |
|--------|-------|---------|------|
| POST | `/api/donations/create-order` | Create Razorpay order | ✅ |
| POST | `/api/donations/confirm` | Confirm payment | ✅ |
| GET | `/api/donations/:donationId` | Get donation details | ✅ |
| GET | `/api/donations/` | Get user's donations | ✅ |

## Setup Steps

1. **Update .env file:**
   ```env
   RAZORPAY_KEY_ID=your_test_key
   RAZORPAY_KEY_SECRET=your_test_secret
   ```

2. **Ensure dependencies installed:**
   ```bash
   npm install razorpay
   ```

3. **Mount routes in app.js** (already done):
   ```javascript
   import donationRoutes from "./routes/donation.routes.js";
   app.use("/api/donations", donationRoutes);
   ```

## Key Implementation Details

### Create Order Flow
```
User initiates donation
  ↓
POST /api/donations/create-order
  ↓
Validate campaign & amount
  ↓
Create Razorpay order (amount * 100 paise)
  ↓
Save pending donation record
  ↓
Return orderID + Razorpay Key
  ↓
Frontend opens Razorpay modal
```

### Confirm Payment Flow
```
Payment completed on Razorpay
  ↓
POST /api/donations/confirm (with paymentId & signature)
  ↓
Verify Razorpay signature (HMAC-SHA256)
  ↓
Mark donation as "success"
  ↓
Update campaign raisedAmount += donationAmount
  ↓
Add donation to campaign.donations array
  ↓
Return success response
```

## Testing with Razorpay Test Mode

**Test Card Numbers:**
- Visa Success: `4111 1111 1111 1111`
- Visa Failure: `4111 1111 1111 1112`
- Master Success: `5555 5555 5555 4444`

**Expiry:** Any future date (MM/YY)
**CVV:** Any 3 digits

## Response Examples

### ✅ Create Order Success
```json
{
  "success": true,
  "message": "Order created successfully",
  "data": {
    "orderId": "order_IluGWxBm9U8zJ8",
    "amount": 1000,
    "currency": "INR",
    "donationId": "650a1b2c3d4e5f6g7h8i9j",
    "razorpayKeyId": "rzp_test_K6KJ2JK2JK2JK"
  }
}
```

### ✅ Confirm Payment Success
```json
{
  "success": true,
  "message": "Payment confirmed successfully",
  "data": {
    "donation": {
      "id": "650a1b2c3d4e5f6g7h8i9j",
      "amount": 1000,
      "status": "success",
      "campaign": "640a1a1c1d1e1f1g1h1i1j"
    },
    "campaignUpdated": {
      "raisedAmount": 25000
    }
  }
}
```

### ❌ Error Response
```json
{
  "success": false,
  "message": "Campaign not found",
  "data": {}
}
```

## Donation Statuses

| Status | Meaning |
|--------|---------|
| `pending` | Donation initiated, awaiting payment confirmation |
| `success` | Payment verified, campaign updated |
| `failed` | Payment signature verification failed |

## Integration with Other Members

### With Member 1 (Campaigns):
- ✅ Reads campaign status and updates raisedAmount
- ⚠️ Needs: Campaign model to have `donations` array field

### With Member 2 (Coupons):
- ⚠️ Needs: Call coupon creation after donation success

### With Member 4 (Notifications):
- ⚠️ Needs: Trigger notification to campaign creator

## Troubleshooting

| Issue | Solution |
|-------|----------|
| 401 Unauthorized | Check JWT token in Authorization header |
| 404 Campaign not found | Verify campaignId exists and is valid ObjectId |
| 400 Campaign not approved | Campaign status must be "approved" |
| 400 Invalid signature | Check RAZORPAY_KEY_SECRET in .env matches Razorpay account |
| 500 Server error | Check database connection and .env variables |

## Production Checklist

- [ ] Update RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET with production keys
- [ ] Test complete flow with real payments
- [ ] Verify campaign donations array field exists
- [ ] Set up monitoring for failed donations
- [ ] Enable email notifications on successful donations
- [ ] Test with various payment methods
- [ ] Verify currency handling (INR)
