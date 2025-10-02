# 📱 Mobile Testing Checklist

## How to Test on Mobile

### Option 1: Using Your Phone
1. Make sure your dev server is running: `npm run dev`
2. Find your computer's local IP: `ipconfig` (Windows) or `ifconfig` (Mac/Linux)
3. Open browser on phone: `http://YOUR_IP:3000` (e.g., http://192.168.1.100:3000)

### Option 2: Using Browser DevTools (Quick Test)
1. Open site in Chrome: http://localhost:3000
2. Press F12 → Toggle device toolbar (Ctrl+Shift+M)
3. Select device: iPhone 12 Pro or Pixel 5

---

## ✅ Test Checklist

### 1. Page Load & First Impression
- [ ] Page loads within 3 seconds
- [ ] No horizontal scrolling
- [ ] All text is readable (not too small)
- [ ] Header displays correctly
- [ ] Progress bar visible at top

**Expected**: Clean, professional look on mobile screen

---

### 2. Contact Information Form (First Question)
- [ ] Name input field is easily tappable
- [ ] Mobile number input field works
- [ ] Keyboard opens automatically
- [ ] "+91" prefix displays correctly
- [ ] "Continue" button is clearly visible
- [ ] Button is large enough to tap (min 44x44px)

**Test Data**:
- Name: Your Full Name
- Mobile: 9876543210

**Expected**: Easy to fill, no zoom required

---

### 3. Question Flow Navigation
- [ ] Questions transition smoothly
- [ ] Radio buttons are tap-friendly
- [ ] Checkbox options are easy to select
- [ ] Selected options are clearly highlighted
- [ ] "Continue" button always visible
- [ ] Progress bar updates correctly

**Expected**: Smooth, intuitive navigation

---

### 4. Broker Selection Screen
- [ ] Broker logos load and display
- [ ] Broker names are readable
- [ ] Grid layout looks good (2 columns)
- [ ] Selected brokers show checkmark
- [ ] "Show More" button works
- [ ] Scrolling is smooth

**Expected**: Clean grid, easy selection

---

### 5. Recommendation Screen
- [ ] Broker recommendation displays
- [ ] Match percentage visible
- [ ] "Open Account" button is prominent
- [ ] Button text is fully visible
- [ ] Stats cards display correctly
- [ ] Trust indicators readable

**Expected**: Clear recommendation, strong CTA

---

### 6. Open Account Button
- [ ] Button is easily tappable
- [ ] Opens in new tab correctly
- [ ] No accidental double-taps
- [ ] Loading state shows if network is slow

**Expected**: Single tap opens affiliate link

---

### 7. Error Scenarios
- [ ] Turn on airplane mode
- [ ] Try to submit form
- [ ] Error message displays clearly
- [ ] Error message is readable
- [ ] User can retry easily

**Expected**: "Network error, please try again" message

---

### 8. Landscape Mode (Optional)
- [ ] Rotate phone to landscape
- [ ] Layout adapts correctly
- [ ] All elements still accessible
- [ ] No content cut off

**Expected**: Responsive in both orientations

---

### 9. Different Devices

Test on at least 2 of these:

#### Small Phone (iPhone SE / Small Android)
- Screen: 375 x 667
- [ ] All content fits
- [ ] Buttons not too small
- [ ] Text readable

#### Medium Phone (iPhone 12 / Pixel 5)
- Screen: 390 x 844
- [ ] Optimal layout
- [ ] Good spacing
- [ ] Professional look

#### Large Phone (iPhone 14 Pro Max / Samsung Galaxy)
- Screen: 428 x 926
- [ ] Not too spread out
- [ ] Good use of space
- [ ] Maintains centered layout

---

### 10. Different Browsers

Test on:
- [ ] Safari (iOS) - CRITICAL
- [ ] Chrome (Android) - CRITICAL
- [ ] Samsung Internet (if available)
- [ ] Firefox Mobile (optional)

---

## 🐛 Common Mobile Issues to Watch For

### Issue: Text Too Small
**Fix**: Minimum font size should be 14px

### Issue: Buttons Too Small
**Fix**: Minimum tap target 44x44px

### Issue: Horizontal Scrolling
**Fix**: Ensure `max-width: 100%` on all elements

### Issue: Zoom on Input Focus
**Fix**: Font size in inputs ≥ 16px

### Issue: Images Not Loading
**Fix**: Check image URLs, use fallback emojis

---

## 📊 Performance Checklist

- [ ] Page loads in under 3 seconds on 4G
- [ ] Images load progressively
- [ ] No layout shifts during load
- [ ] Smooth animations (60fps)
- [ ] No freezing during input

---

## ✅ Final Approval Checklist

Before launching, confirm:

- [ ] Tested on real iPhone
- [ ] Tested on real Android phone
- [ ] All forms work correctly
- [ ] CTA buttons work
- [ ] No console errors
- [ ] Affiliate links open correctly
- [ ] Facebook Pixel tracking works

---

## 📝 Bug Report Template

If you find issues, note:

**Device**: (e.g., iPhone 12, Android Pixel 5)
**Browser**: (e.g., Safari 15, Chrome Mobile 110)
**Issue**: (Describe what's wrong)
**Steps to Reproduce**:
1.
2.
3.

**Expected**: (What should happen)
**Actual**: (What actually happens)
**Screenshot**: (If possible)

---

## 🚀 Quick Test Procedure (5 minutes)

1. **Open site on your phone**
2. **Fill form completely** (use real data)
3. **Go through all questions**
4. **Check recommendation displays**
5. **Tap "Open Account" button**
6. **Verify affiliate link opens**

If all 6 steps work smoothly → **✅ Mobile Ready!**

---

**Status**: ⬜ Not Tested | ⬜ Tested - Issues Found | ✅ Tested - All Good

**Tested By**: ________________
**Date**: ________________
**Issues Found**: ________________
