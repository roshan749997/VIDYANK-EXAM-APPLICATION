# Quick Reference: Button Sizes & Touch Targets

## Touch Target Standards
- **iOS Minimum**: 44x44 points
- **Android Recommended**: 48x48 dp
- **Our Implementation**: 48-72px (exceeds both standards)

---

## TakeExam Screen

### Question Navigation Buttons
```
BEFORE:                    AFTER:
┌──────┐                  ┌────────┐
│  1   │ 36x36px         │   1    │ 44x44px (mobile)
└──────┘                  └────────┘
Font: 12px                Font: 14px, Bold
```

### Answer Option Buttons
```
BEFORE:                              AFTER:
┌─────────────────────────┐         ┌──────────────────────────┐
│ ○ (A) Option text      │ ~48px   │ ◯ (A) Option text       │ 56px
└─────────────────────────┘         └──────────────────────────┘
Padding: 16px                       Padding: 18px
Border: 1px                         Border: 2px
Font: 15px                          Font: 16px, Line-height: 22px
```

### Navigation Buttons
```
BEFORE:                              AFTER:
┌─────────────┐                     ┌──────────────┐
│  « Previous │ ~40px               │  « Previous  │ 48px
└─────────────┘                     └──────────────┘
Padding: 12px                       Padding: 14px
Border: 1px                         Border: 2px
Font: 14px, 600                     Font: 15px, 700
```

### Submit Button
```
BEFORE:                              AFTER:
┌──────────────┐                    ┌───────────────┐
│ Submit Exam  │ ~40px              │ Submit Exam   │ 52px
└──────────────┘                    └───────────────┘
Padding: 12px                       Padding: 16px vertical, 20px horizontal
Font: 14px, 600                     Font: 16px, 700
```

---

## Notifications Screen

### Notification Cards
```
BEFORE:                              AFTER:
┌────────────────────────┐          ┌─────────────────────────┐
│ 📱 Notification Title  │ ~70px   │ 📱 Notification Title   │ 80px+
│ Message text here...   │          │ Message text here...    │
│ 2h ago                 │          │ 2h ago                  │
└────────────────────────┘          └─────────────────────────┘
Padding: 16px                       Padding: 18px
Icon: 40x40px                       Icon: 48x48px
Title: 16px, 600                    Title: 17px, 700
Message: 14px                       Message: 15px, Line-height: 21px
```

### Mark All Read Button
```
BEFORE:                              AFTER:
┌──────────────────┐                ┌────────────────────┐
│ ✓ Mark All Read  │ ~36px         │ ✓ Mark All Read    │ 48px
└──────────────────┘                └────────────────────┘
Padding: 8px vertical               Padding: 12px vertical, 20px horizontal
Font: 15px, 600                     Font: 16px, 700
Background: #f1f5f9                 Background: #eef2ff + Border
```

---

## Settings Screen

### Profile Action Buttons
```
BEFORE:                              AFTER:
┌──────────────────────┐            ┌───────────────────────┐
│ 👤 Edit Profile      │ ~60px     │ 👤 Edit Profile       │ 72px
└──────────────────────┘            └───────────────────────┘
Padding: 28px vertical              Padding: 20px vertical & horizontal
Border: 1px                         Border: 2px + Shadow
Icon: 32px                          Icon: 32px
Font: 18px, 600                     Font: 17px, 700
Gap: 22px                           Gap: 16px
```

---

## Color Coding Guide

### Status Colors
```
Question Status:
🔘 Not Visited    → Gray (#6c757d)
🔴 Not Answered   → Red (#dc3545)
🟢 Answered       → Green (#28a745)
🟡 Marked         → Yellow (#ffc107)
🔵 Ans + Marked   → Blue (#17a2b8)

Notification Priority:
🔴 High Priority  → Red border (#dc2626)
🟡 Medium         → Category color
⚪ Low            → Gray
```

### Button States
```
Primary Button:
Normal    → #4f46e5 (Indigo)
Pressed   → Opacity 0.7
Disabled  → Opacity 0.5

Success:
Normal    → #16a34a (Green)

Warning:
Normal    → #f59e0b (Amber)

Error/Danger:
Normal    → #dc2626 (Red)
```

---

## Spacing System

### Padding Scale
```
Extra Small: 8px   → Compact elements
Small:      12px   → Tight spacing
Medium:     16px   → Standard spacing
Large:      20px   → Comfortable spacing
Extra Large: 24px  → Generous spacing
```

### Margin Scale
```
Tight:      8px    → Between related items
Standard:   12px   → Between elements
Comfortable: 16px  → Between sections
Spacious:   20px   → Between major sections
```

### Gap (Flexbox)
```
Tight:      12px   → Compact grids
Standard:   16px   → Standard grids
Comfortable: 20px  → Spacious grids
```

---

## Typography Scale

### Font Sizes
```
Extra Large: 24-28px → Page titles
Large:       20-22px → Section headers
Medium:      17-18px → Card titles
Standard:    15-16px → Body text, buttons
Small:       13-14px → Secondary text
Extra Small: 11-12px → Captions
```

### Font Weights
```
Regular:     400 → Body text
Medium:      500 → Secondary emphasis
Semi-Bold:   600 → Moderate emphasis
Bold:        700 → Strong emphasis
Extra Bold:  800 → Maximum emphasis
```

---

## Border Radius Scale
```
Small:   8px  → Subtle rounding
Medium:  10px → Standard rounding
Large:   12px → Comfortable rounding
XLarge:  14px → Prominent rounding
XXLarge: 16px → Maximum rounding
Pill:    24px → Fully rounded (buttons)
Circle:  50%  → Circular elements
```

---

## Shadow & Elevation

### Elevation Levels
```
Level 0: No shadow
  - Flat elements

Level 1: Subtle shadow
  - elevation: 1
  - shadowOpacity: 0.05
  - shadowRadius: 4px

Level 2: Standard shadow
  - elevation: 2
  - shadowOpacity: 0.08
  - shadowRadius: 8px

Level 3: Prominent shadow
  - elevation: 3
  - shadowOpacity: 0.12
  - shadowRadius: 12px
```

---

## Responsive Breakpoints

```
Mobile:    < 768px   → Single column, larger touch targets
Tablet:    768-1023px → 2 columns, medium touch targets
Desktop:   ≥ 1024px  → 3 columns, standard touch targets
```

---

## Accessibility Quick Check

### Minimum Requirements
✅ Touch targets: ≥ 44px (iOS) / ≥ 48px (Android)
✅ Text contrast: ≥ 4.5:1 (WCAG AA)
✅ Interactive elements: Clear focus states
✅ Labels: Descriptive accessibility labels
✅ Hints: Contextual accessibility hints

### Color Contrast Ratios
```
Normal Text (< 18px):
  - AA: 4.5:1
  - AAA: 7:1

Large Text (≥ 18px):
  - AA: 3:1
  - AAA: 4.5:1

UI Components:
  - Minimum: 3:1
```

---

## Implementation Checklist

### For Each Button/Interactive Element:
- [ ] Minimum size: 44x44px (mobile) or 48x48px (recommended)
- [ ] Clear label (text or icon + label)
- [ ] Visual feedback on press (activeOpacity: 0.7)
- [ ] Disabled state (if applicable)
- [ ] Accessibility label
- [ ] Accessibility hint (if needed)
- [ ] Adequate spacing from other elements (≥ 8px)
- [ ] High contrast with background
- [ ] Clear visual hierarchy

### For Each Screen:
- [ ] Responsive layout (mobile, tablet, desktop)
- [ ] Consistent spacing system
- [ ] Consistent typography
- [ ] Consistent color usage
- [ ] Loading states
- [ ] Error states
- [ ] Empty states
- [ ] Scroll behavior
- [ ] Safe area handling

---

## Common Patterns

### Button Hierarchy
```
1. Primary Action (Most Important)
   - Largest size (52-72px height)
   - Solid background color
   - High contrast
   - Example: "Submit Exam", "Save Changes"

2. Secondary Action
   - Medium size (48-56px height)
   - Outlined or subtle background
   - Medium contrast
   - Example: "Previous", "Next", "Cancel"

3. Tertiary Action
   - Standard size (44-48px height)
   - Minimal styling
   - Lower contrast
   - Example: "Skip", "View Details"
```

### Card Patterns
```
Interactive Card:
- Minimum height: 60-80px
- Padding: 16-20px
- Border radius: 12-16px
- Shadow: elevation 1-2
- Active state: opacity 0.8
- Border: 1-2px (optional)
```

### Input Fields
```
Text Input:
- Minimum height: 48px
- Padding: 14-16px
- Border: 1-2px
- Border radius: 10-12px
- Font size: 16px (prevents zoom on iOS)
```

---

## Testing Commands

### Run the app:
```bash
# Backend
cd backend
npm start

# Frontend
cd frontend
npx expo start
```

### Test on different devices:
- Press `i` for iOS simulator
- Press `a` for Android emulator
- Scan QR code for physical device

---

## Quick Tips

### For Better Mobile UX:
1. **Use larger touch targets** (48px minimum)
2. **Add visual feedback** (activeOpacity, shadows)
3. **Provide clear labels** (no ambiguous icons)
4. **Use consistent spacing** (follow the spacing system)
5. **Test on real devices** (not just simulators)
6. **Consider one-handed use** (place important actions within thumb reach)
7. **Avoid tiny text** (minimum 14px for body text)
8. **Use high contrast** (especially for important actions)
9. **Add loading states** (users need feedback)
10. **Handle errors gracefully** (clear error messages)

### Common Mistakes to Avoid:
❌ Touch targets < 44px
❌ Low contrast text
❌ Ambiguous button labels
❌ Inconsistent spacing
❌ No visual feedback on press
❌ Tiny fonts (< 14px)
❌ Cluttered layouts
❌ No disabled states
❌ Missing loading indicators
❌ Poor error handling
