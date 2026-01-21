# Mobile UX Testing Guide

## Testing the Improvements

### Prerequisites
Make sure both backend and frontend are running:

```bash
# Terminal 1 - Backend
cd e:\Vidyank\backend
npm start

# Terminal 2 - Frontend  
cd e:\Vidyank\frontend
npx expo start
```

---

## Test Scenarios by Screen

### 1. TakeExam Screen Testing

#### Test Case 1.1: Question Navigation
**Steps:**
1. Navigate to Available Exams
2. Select any exam to start
3. Tap on different question numbers in the left panel

**Expected Results:**
- ✅ Question numbers are easy to tap (44x44px on mobile)
- ✅ Selected question has visible border highlight
- ✅ Color coding is clear:
  - Gray = Not visited
  - Red = Not answered
  - Green = Answered
  - Yellow = Marked for review
  - Blue = Answered & Marked
- ✅ No accidental taps on adjacent numbers

#### Test Case 1.2: Answer Selection
**Steps:**
1. Read a question
2. Tap on different answer options
3. Try tapping near the edges of options

**Expected Results:**
- ✅ Options are easy to tap (minimum 56px height)
- ✅ Selected option shows clear visual feedback (blue background, thicker border)
- ✅ Radio button is clearly visible (24x24px)
- ✅ Text is readable (16px font size)
- ✅ Entire option area is tappable (not just the radio button)

#### Test Case 1.3: Navigation Buttons
**Steps:**
1. Tap "Next" button multiple times
2. Tap "Previous" button multiple times
3. Try tapping when at first/last question

**Expected Results:**
- ✅ Buttons are easy to tap (48px height)
- ✅ Clear visual feedback on press
- ✅ Disabled state is obvious (grayed out, lower opacity)
- ✅ Button text is clear and readable (15px, bold)

#### Test Case 1.4: Action Buttons
**Steps:**
1. Select an answer
2. Tap "Clear" button
3. Select answer again
4. Tap "Mark for Review"
5. Tap "Mark for Review" again to unmark

**Expected Results:**
- ✅ Clear button removes the selected answer
- ✅ Mark button toggles yellow background when marked
- ✅ Button text changes: "Mark for Review" ↔ "Unmark"
- ✅ Buttons are easy to tap (48px height)

#### Test Case 1.5: Submit Exam
**Steps:**
1. Answer a few questions
2. Scroll to bottom
3. Tap "Submit Exam" button
4. Verify submission confirmation

**Expected Results:**
- ✅ Submit button is prominent (52px height, red background)
- ✅ Button is easy to find and tap
- ✅ Clear confirmation before submission
- ✅ Results screen shows correct score

---

### 2. Notifications Screen Testing

#### Test Case 2.1: Notification Cards
**Steps:**
1. Navigate to Notifications screen
2. Tap on different notification cards
3. Observe unread vs read notifications

**Expected Results:**
- ✅ Cards are easy to tap (minimum 80px height)
- ✅ Unread notifications have red left border (6px thick)
- ✅ Read notifications have blue background with lower opacity
- ✅ Icon is clearly visible (48x48px)
- ✅ Title is bold and readable (17px, weight 700)
- ✅ Message text is clear (15px with good line height)
- ✅ Timestamp is visible (13px)

#### Test Case 2.2: Mark All Read
**Steps:**
1. Ensure there are unread notifications
2. Tap "Mark All Read" button at top right
3. Observe all notifications change to read state

**Expected Results:**
- ✅ Button is easy to tap (48px height)
- ✅ Button has clear visual style (blue background with border)
- ✅ All notifications change to read state
- ✅ Visual feedback on button press

#### Test Case 2.3: Responsive Layout
**Steps:**
1. View on mobile (< 768px width)
2. View on tablet/desktop (≥ 768px width)

**Expected Results:**
- ✅ Mobile: Single column layout
- ✅ Desktop: Two-column grid layout
- ✅ Cards maintain consistent styling across breakpoints

---

### 3. Settings Screen Testing

#### Test Case 3.1: Profile Action Buttons
**Steps:**
1. Navigate to Settings screen
2. Tap each button:
   - Edit Profile
   - Reset Password
   - Share Profile
   - Rate Us
   - Sign Out
   - Privacy Policy

**Expected Results:**
- ✅ All buttons are easy to tap (72px height)
- ✅ Icons are clearly visible (32px)
- ✅ Text is readable (17px, bold)
- ✅ Visual feedback on press (shadow, opacity)
- ✅ Each button performs correct action:
  - Edit Profile → Opens modal
  - Reset Password → Opens reset modal
  - Share Profile → Copies to clipboard
  - Rate Us → Navigates to rate screen
  - Sign Out → Shows confirmation, logs out
  - Privacy Policy → Opens external link

#### Test Case 3.2: Notification Toggles
**Steps:**
1. Scroll to notification settings
2. Toggle each switch:
   - Enable Notifications
   - Exam Reminders
   - Result Notifications
   - Test Series Updates

**Expected Results:**
- ✅ Switches are easy to toggle
- ✅ Clear on/off states
- ✅ Labels are descriptive
- ✅ Descriptions provide context
- ✅ Settings are saved (persist after app restart)

#### Test Case 3.3: Edit Profile Modal
**Steps:**
1. Tap "Edit Profile" button
2. Fill in form fields
3. Tap "Save Changes"
4. Tap "Cancel" to close without saving

**Expected Results:**
- ✅ Modal opens smoothly
- ✅ Input fields are easy to tap and type in
- ✅ Save button works correctly
- ✅ Cancel button closes modal
- ✅ Close button (×) works
- ✅ Tapping outside modal closes it

---

### 4. ExamHistory Screen Testing

#### Test Case 4.1: Exam Cards
**Steps:**
1. Navigate to Exam History
2. Scroll through exam cards
3. Tap "View Details" on different cards

**Expected Results:**
- ✅ Cards are easy to read
- ✅ Score is prominently displayed
- ✅ Progress bar is clear
- ✅ Category badges are visible
- ✅ Status indicators (completed/incomplete) are clear
- ✅ "View Details" button is easy to tap

#### Test Case 4.2: Performance Stats
**Steps:**
1. View the performance overview card at top
2. Check the three stats: Completed, Incomplete, Avg Score

**Expected Results:**
- ✅ Stats are clearly visible
- ✅ Icons are appropriate
- ✅ Numbers are large and readable
- ✅ Labels are clear

#### Test Case 4.3: Responsive Layout
**Steps:**
1. View on mobile (< 768px)
2. View on tablet (768-1023px)
3. View on desktop (≥ 1024px)

**Expected Results:**
- ✅ Mobile: Single column
- ✅ Tablet: 2 columns
- ✅ Desktop: 2-3 columns based on width
- ✅ Cards maintain consistent styling

---

### 5. Progress Screen Testing

#### Test Case 5.1: Charts Visibility
**Steps:**
1. Navigate to Progress screen
2. View pie chart (syllabus completion)
3. View bar chart (subject performance)
4. View line chart (weekly trend)

**Expected Results:**
- ✅ Charts are clearly visible
- ✅ Labels are readable
- ✅ Colors are distinct
- ✅ Charts are appropriately sized for screen

#### Test Case 5.2: Progress Bars
**Steps:**
1. Scroll to subject breakdown section
2. View progress bars for each subject

**Expected Results:**
- ✅ Progress bars are clearly visible
- ✅ Percentages are readable
- ✅ Subject names are clear
- ✅ Completed/Total counts are visible

---

## Cross-Screen Testing

### Test Case 6.1: Navigation Flow
**Steps:**
1. Start from Dashboard
2. Navigate to each screen via sidebar/menu
3. Use back button to return
4. Test deep linking (if applicable)

**Expected Results:**
- ✅ All navigation works smoothly
- ✅ No broken links
- ✅ Back button works correctly
- ✅ Active screen is highlighted in sidebar

### Test Case 6.2: Consistent Styling
**Steps:**
1. Visit all screens
2. Compare button styles
3. Compare card styles
4. Compare typography

**Expected Results:**
- ✅ Consistent button sizes across screens
- ✅ Consistent color usage
- ✅ Consistent spacing
- ✅ Consistent typography

---

## Device-Specific Testing

### Mobile Phones (< 768px)

#### Small Screens (iPhone SE, 375px width)
**Test:**
- All buttons are tappable
- Text is readable without zooming
- No horizontal scrolling
- Cards fit within screen width

#### Standard Screens (iPhone 14, 390px width)
**Test:**
- Optimal layout
- Comfortable spacing
- Easy one-handed use

#### Large Screens (iPhone 14 Pro Max, 430px width)
**Test:**
- No excessive white space
- Content scales appropriately

### Tablets (768-1023px)

**Test:**
- Two-column layouts work well
- Touch targets remain adequate
- No wasted space

### Desktop (≥ 1024px)

**Test:**
- Multi-column layouts
- Hover states work (if applicable)
- Content is centered and not stretched

---

## Accessibility Testing

### Test Case 7.1: Screen Reader
**Steps:**
1. Enable TalkBack (Android) or VoiceOver (iOS)
2. Navigate through each screen
3. Tap on buttons and interactive elements

**Expected Results:**
- ✅ All buttons have descriptive labels
- ✅ Screen reader announces element types
- ✅ Navigation is logical
- ✅ Status changes are announced

### Test Case 7.2: Color Contrast
**Steps:**
1. Use a color contrast checker tool
2. Check text against backgrounds
3. Check button colors

**Expected Results:**
- ✅ All text meets WCAG AA (4.5:1 for normal text)
- ✅ Large text meets WCAG AA (3:1)
- ✅ UI components meet 3:1 minimum

### Test Case 7.3: Touch Target Sizes
**Steps:**
1. Measure interactive elements
2. Verify minimum sizes

**Expected Results:**
- ✅ All buttons ≥ 44px (iOS) or ≥ 48px (Android)
- ✅ Adequate spacing between elements (≥ 8px)

---

## Performance Testing

### Test Case 8.1: Loading States
**Steps:**
1. Navigate to screens with data loading
2. Observe loading indicators
3. Test with slow network (if possible)

**Expected Results:**
- ✅ Loading indicators are visible
- ✅ Content doesn't jump when loaded
- ✅ Skeleton screens or spinners are shown

### Test Case 8.2: Smooth Scrolling
**Steps:**
1. Scroll through long lists
2. Test on different devices

**Expected Results:**
- ✅ Smooth scrolling (60fps)
- ✅ No lag or stuttering
- ✅ Pull-to-refresh works (if implemented)

---

## Edge Cases Testing

### Test Case 9.1: Empty States
**Steps:**
1. View screens with no data:
   - No notifications
   - No exam history
   - No progress data

**Expected Results:**
- ✅ Clear empty state messages
- ✅ Helpful instructions
- ✅ Appropriate icons

### Test Case 9.2: Error States
**Steps:**
1. Disconnect network
2. Try to load data
3. Try to submit forms

**Expected Results:**
- ✅ Clear error messages
- ✅ Retry options
- ✅ No app crashes

### Test Case 9.3: Long Content
**Steps:**
1. Test with very long question text
2. Test with many notifications
3. Test with long exam titles

**Expected Results:**
- ✅ Text wraps correctly
- ✅ No overflow
- ✅ Scrolling works
- ✅ Truncation with ellipsis (if applicable)

---

## Regression Testing Checklist

After making changes, verify:
- [ ] All existing functionality still works
- [ ] No new bugs introduced
- [ ] Performance hasn't degraded
- [ ] Styling is consistent
- [ ] Navigation flows work
- [ ] Data loads correctly
- [ ] Forms submit correctly
- [ ] Error handling works

---

## Bug Reporting Template

If you find issues, report them using this format:

```
**Screen:** [Screen name]
**Test Case:** [Test case number]
**Device:** [Device model and OS version]
**Steps to Reproduce:**
1. [Step 1]
2. [Step 2]
3. [Step 3]

**Expected Result:**
[What should happen]

**Actual Result:**
[What actually happened]

**Screenshots:**
[Attach screenshots if applicable]

**Severity:**
- [ ] Critical (app crashes, data loss)
- [ ] High (major functionality broken)
- [ ] Medium (minor functionality issue)
- [ ] Low (cosmetic issue)
```

---

## Success Criteria

The improvements are successful if:
✅ All touch targets are ≥ 44-48px
✅ All text is readable without zooming
✅ All buttons have clear labels and visual feedback
✅ Navigation is intuitive and consistent
✅ Accessibility standards are met
✅ Performance is smooth (60fps scrolling)
✅ No critical bugs
✅ User feedback is positive

---

## Next Steps

1. **Run the app** and test all scenarios above
2. **Document any issues** using the bug report template
3. **Verify fixes** after changes are made
4. **Test on real devices** (not just simulators)
5. **Get user feedback** from actual users
6. **Iterate** based on feedback

---

## Quick Test Commands

```bash
# Start backend
cd e:\Vidyank\backend && npm start

# Start frontend
cd e:\Vidyank\frontend && npx expo start

# Run on iOS simulator
Press 'i' in Expo terminal

# Run on Android emulator
Press 'a' in Expo terminal

# Run on physical device
Scan QR code with Expo Go app
```

---

## Additional Resources

- [iOS Human Interface Guidelines](https://developer.apple.com/design/human-interface-guidelines/)
- [Material Design Guidelines](https://material.io/design)
- [WCAG Accessibility Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [React Native Accessibility](https://reactnative.dev/docs/accessibility)

---

Happy Testing! 🎉
