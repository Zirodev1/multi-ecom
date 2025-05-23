# Code Cleanup Status

## Completed Cleanup

### product.ts
✅ **Removed unused imports:**
- `ProductType` 
- `FreeShipping`
- `setMaxListeners`

✅ **Removed debug console.logs:**
- Line 52: Authentication error log
- Line 60: Role check error log  
- Line 75: Store not found error log
- Line 158: Category/subcategory usage log
- Line 177: Product creation success log
- Line 196: Variant creation success log
- Line 268: Emergency creation failure log
- Line 272: Product creation error log

✅ **Added TODO comments:**
- Emergency fix notice for `upsertProduct`
- Role bypass warning
- Refactoring notes for Prisma relations

✅ **Fixed TypeScript issues:**
- Created `ProductFilters` interface
- Created `WhereClause` interface (using `unknown` instead of `any`)
- Fixed `const` declarations for variables that weren't reassigned
- Improved type safety for `getMinPrice` function
- Created `ReviewFilter` interface
- Added proper return type for `getProductsByIds`
- Fixed error handling for `unknown` type errors

⚠️ **Kept important console.warn:**
- Line 62: Role bypass warning (important for debugging)

### store.ts
✅ **Removed unused imports:**
- `CountryWithShippingRatesType`
- `userAgent` from next/server

✅ **Removed debug console.logs:**
- Line 71: Store upsert data log
- Line 143: Store upsert result log
- Line 146: Store upsert error log (kept throw)
- Lines 566-569: User debug info logs
- Line 669: User not found log

✅ **Kept important error logging:**
- Line 598: Error in getAllStores (important for debugging)
- Line 673: Error updating user role (important for debugging)

## Remaining Issues

### product.ts
1. **Line 25**: `generateUniqueSlug` is imported but not used
   - **Note**: This might be a false positive if it's used elsewhere
   - **Recommendation**: Keep it if needed for future features

2. **Line 1530**: Complex type mismatch in `ordered_products`
   - **Issue**: The filtered array includes `undefined` values
   - **Solution**: Need to ensure `.filter(Boolean)` properly types the result

### Important Notes

1. **Removed Functions**: The `handleProductCreate` and `handleCreateVariant` functions were removed because they were unused. If you need them for future development:
   - They can be found in the git history
   - Consider keeping them in a separate file or commented out

2. **Emergency Fix**: The current `upsertProduct` is marked as an emergency fix. This should be refactored when:
   - The Prisma schema is stable
   - Proper category/subcategory management is implemented
   - Role management is finalized

3. **Console Warnings**: We kept console.warn statements that are important for debugging:
   - Role bypass warnings
   - Error logging for critical operations

## Recommendations

1. **Phase 1 Priority** (from IMPLEMENTATION.md):
   - Complete the TypeScript strict mode migration
   - Set up proper error tracking (Sentry)
   - Implement proper role management

2. **Keep for Development**:
   - Warning logs for security/role issues
   - Error logs for debugging
   - TODO comments for future refactoring

3. **Future Cleanup**:
   - Remove role bypass once proper authentication is set up
   - Refactor emergency fix in `upsertProduct`
   - Add unit tests for all query functions 