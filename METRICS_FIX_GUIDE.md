# Metrics Aggregation Fix Guide

## Problem

Metrics endpoint was returning all zeros despite customers making purchases.

## Root Cause Analysis

The issue was in the **type mismatch between adminID values**:

- Frontend/JWT sends `userID` as a **string** (from JWT payload)
- MongoDB stores `adminID` as an **ObjectId**
- Aggregation pipeline uses `$match { adminID: req.userID }` but was comparing string to ObjectId, finding no matches

## Solutions Implemented

### 1. **JWT Middleware Fix** (`jwt.middleware.js`)

```javascript
// Before: req.userID = payload.userID;  // string
// After:
req.userID = new mongoose.Types.ObjectId(payload.userID); // ObjectId
```

Now `req.userID` is properly converted to ObjectId, matching the stored adminID values.

### 2. **Metrics Function Improvements** (`admin.controller.js`)

- Fixed date boundary calculations (added time boundaries for accurate date ranges)
- Improved date comparisons using `$lte` instead of `$lt` for end dates
- Added better error handling for empty results
- Added logging with metrics values for debugging

### 3. **Database Migration Endpoint** (New)

Added endpoint to migrate existing customers without adminID:

```
POST /api/admin/migrate/set-adminid
```

This updates all customers without the adminID field to associate them with the current admin.

### 4. **Debug Endpoint** (New)

Added debug endpoint to check customer data:

```
GET /api/admin/debug/customers
```

Returns the adminID being searched and list of matching customers.

## Testing Steps

### Step 1: Check Debug Data

```bash
# Login first, then use the returned token
GET http://localhost:2000/api/admin/debug/customers
Headers: Authorization: {token}
```

This will show you how many customers match the current admin's ID.

### Step 2: Run Migration (if needed)

If customers show 0 in debug endpoint:

```bash
POST http://localhost:2000/api/admin/migrate/set-adminid
Headers: Authorization: {token}
```

### Step 3: Test Metrics

```bash
GET http://localhost:2000/api/admin/metrics
Headers: Authorization: {token}
```

Should now show proper metrics values instead of zeros.

### Step 4: Verify Frontend

- Go to Profile page
- Metrics should display day/weekly/monthly/yearly values
- Create a new customer purchase to test real-time updates

## Files Modified

1. **backend/src/middleware/jwt.middleware.js**

   - Added mongoose import
   - Convert userID to ObjectId

2. **backend/src/admin/admin.controller.js**

   - Improved date boundary calculations
   - Better handling of empty results
   - Added logging

3. **backend/src/admin/admin.routes.js**
   - Added debug endpoint
   - Added migration endpoint

## Expected Results

After these fixes:

- ✅ Metrics endpoint correctly filters customers by adminID
- ✅ Date ranges properly matched with transactions
- ✅ Aggregation pipeline finds and processes customer data
- ✅ Profile page displays actual financial metrics
- ✅ Day/weekly/monthly/yearly metrics show correct values

## If Issues Persist

1. Check backend logs for any aggregation errors
2. Use debug endpoint to verify customers are found
3. Check MongoDB directly to ensure:
   - Customers have `adminID` field
   - Transactions have `date` field with proper Date objects
   - `amountDue` field has numeric values

## Code Changes Summary

### jwt.middleware.js

```diff
+ import mongoose from "mongoose";
...
- req.userID = payload.userID;
+ req.userID = new mongoose.Types.ObjectId(payload.userID);
```

### admin.controller.js

```diff
- const rangeAgg = async (start, end) => {
-   const result = await CoustomerModel.aggregate([
-     { $match: { adminID: req.userID } },
+ const rangeAgg = async (start, end) => {
+   const result = await CoustomerModel.aggregate([
+     { $match: { adminID } },  // Now properly typed as ObjectId
```

This ensures consistent ObjectId comparison throughout the aggregation pipeline.
