# Back Button Functionality Guide

## Overview
Mobile वर hardware back button आता properly काम करतो सर्व screens वर!

---

## 🔙 Back Button Behavior

### Dashboard Screen
**Action:** Back button दाबल्यावर **Logout Confirmation** दाखवतो

```
Dashboard → Press Back Button
    ↓
┌─────────────────────────────┐
│  Logout Confirmation        │
│  "Are you sure you want     │
│   to logout?"               │
│                              │
│  [Cancel]  [Logout]         │
└─────────────────────────────┘
    ↓ (if Logout pressed)
Login Screen
```

**Why?**
- Dashboard हा main screen आहे
- येथून back जाण्यासाठी logout करावं लागतं
- Accidental logout टाळण्यासाठी confirmation दाखवतो

---

### All Other Screens
**Action:** Back button दाबल्यावर **Previous Screen** वर जातो

```
Example Flow:

Dashboard → Available Exams → Exam Details
                                    ↓ (Press Back)
Dashboard → Available Exams ← ─ ─ ─ ┘
                ↓ (Press Back)
Dashboard ← ─ ─ ┘
    ↓ (Press Back)
Logout Confirmation
```

**Screens with Back Navigation:**
- ✅ Available Exams → Dashboard
- ✅ Exam History → Dashboard
- ✅ Progress → Dashboard
- ✅ Leaderboard → Dashboard
- ✅ Performance Overview → Dashboard
- ✅ Notifications → Dashboard
- ✅ Study Planner → Dashboard
- ✅ Profile → Dashboard
- ✅ Settings → Dashboard (or Profile if came from there)
- ✅ Rate Us → Previous Screen
- ✅ Take Exam → Available Exams
- ✅ Any nested screen → Parent Screen

---

## 🎯 Special Cases

### 1. Sidebar Open
**Behavior:** Back button पहिले sidebar बंद करतो

```
Any Screen with Sidebar Open
    ↓ (Press Back)
Sidebar Closes
    ↓ (Press Back again)
Navigate Back to Previous Screen
```

### 2. Modal Open
**Behavior:** Modal बंद होतो (built-in React Native behavior)

```
Screen with Modal Open
    ↓ (Press Back)
Modal Closes
    ↓ (Press Back again)
Navigate Back
```

### 3. Take Exam Screen
**Behavior:** Exam सोडून previous screen वर जातो

```
Take Exam Screen
    ↓ (Press Back)
Confirmation: "Exit exam?"
    ↓ (if Yes)
Available Exams Screen
```

---

## 📱 Implementation Details

### Code Location
**File:** `frontend/src/userscreens/UserDashboardLayout.tsx`

### Logic Flow
```typescript
Back Button Pressed
    ↓
Is Sidebar Open?
    ├─ Yes → Close Sidebar, Stop
    └─ No → Continue
         ↓
Is Current Screen Dashboard?
    ├─ Yes → Show Logout Confirmation, Stop
    └─ No → Continue
         ↓
Can Navigate Back?
    ├─ Yes → Go Back to Previous Screen
    └─ No → Do Nothing (let system handle)
```

### Code Snippet
```typescript
useEffect(() => {
  const onBackPress = () => {
    // 1. If sidebar is open, close it first
    if (!sidebarCollapsed) {
      closeSidebar();
      return true;
    }

    // 2. On Dashboard, show logout confirmation
    if (activeLabel === 'Dashboard') {
      Alert.alert('Logout', 'Are you sure?', [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Logout', onPress: handleLogout }
      ]);
      return true;
    }

    // 3. On all other screens, navigate back
    if (navigation.canGoBack()) {
      navigation.goBack();
      return true;
    }

    // 4. If can't go back, do nothing
    return false;
  };

  BackHandler.addEventListener('hardwareBackPress', onBackPress);
  return () => BackHandler.removeEventListener('hardwareBackPress', onBackPress);
}, [sidebarCollapsed, activeLabel, navigation]);
```

---

## 🎨 User Experience

### Smooth Navigation
```
User Journey:

1. Login → Dashboard
2. Dashboard → Available Exams
3. Available Exams → Select Exam → Take Exam
4. Press Back → Confirmation → Available Exams
5. Press Back → Dashboard
6. Press Back → Logout Confirmation
```

### Prevents Accidental Actions
- ✅ Sidebar open असताना back दाबलं तर sidebar बंद होतो (screen बदलत नाही)
- ✅ Dashboard वरून back दाबलं तर logout confirmation दाखवतो
- ✅ Exam घेत असताना back दाबलं तर confirmation मागतो
- ✅ Modal open असताना back दाबलं तर modal बंद होतो

---

## 🔧 Technical Details

### Dependencies
```typescript
import { BackHandler } from 'react-native';
import { useNavigation } from '@react-navigation/native';
```

### State Management
```typescript
const [sidebarCollapsed, setSidebarCollapsed] = useState(true);
const navigation = useNavigation();
const activeLabel = "Dashboard"; // or current screen name
```

### Event Listener
```typescript
BackHandler.addEventListener('hardwareBackPress', onBackPress);
// Returns true = handled, false = let system handle
```

---

## 📋 Testing Checklist

### Basic Navigation
- [ ] Dashboard वरून back दाबलं → Logout confirmation दाखवतो
- [ ] Available Exams वरून back → Dashboard वर जातो
- [ ] Exam History वरून back → Dashboard वर जातो
- [ ] Progress वरून back → Dashboard वर जातो
- [ ] Profile वरून back → Dashboard वर जातो
- [ ] Settings वरून back → Dashboard वर जातो

### Sidebar Behavior
- [ ] Sidebar open आहे → Back दाबलं → Sidebar बंद होतो
- [ ] Sidebar बंद आहे → Back दाबलं → Previous screen वर जातो

### Nested Navigation
- [ ] Dashboard → Screen A → Screen B → Back → Screen A
- [ ] Screen A → Screen B → Screen C → Back → Screen B → Back → Screen A

### Logout Flow
- [ ] Dashboard → Back → Logout Confirmation दाखवतो
- [ ] Logout Confirmation → Cancel → Dashboard वर राहतो
- [ ] Logout Confirmation → Logout → Login Screen वर जातो
- [ ] Logout केल्यावर सर्व data clear होतो

---

## 🎯 Benefits

### Better UX
✅ **Natural Navigation**: Android users ला back button वापरायची सवय आहे
✅ **Prevents Confusion**: Sidebar open असताना back काम करतो
✅ **Prevents Accidents**: Dashboard वरून logout confirmation मागतो
✅ **Consistent Behavior**: सर्व screens वर same logic

### Mobile-Friendly
✅ **Hardware Button Support**: Physical back button काम करतो
✅ **Gesture Support**: Swipe back gesture (iOS) काम करतो
✅ **Modal Handling**: Modals properly बंद होतात

### Developer-Friendly
✅ **Centralized Logic**: एकाच ठिकाणी सर्व logic
✅ **Easy to Maintain**: Simple, clear code
✅ **Reusable**: UserDashboardLayout वापरणाऱ्या सर्व screens साठी काम करतो

---

## 🚀 Usage Examples

### Example 1: Simple Back Navigation
```typescript
// User on Available Exams screen
Press Back Button
    ↓
Automatically goes to Dashboard
```

### Example 2: Sidebar Open
```typescript
// User on any screen with sidebar open
Press Back Button (1st time)
    ↓
Sidebar closes
    ↓
Press Back Button (2nd time)
    ↓
Goes to previous screen
```

### Example 3: Dashboard Logout
```typescript
// User on Dashboard
Press Back Button
    ↓
Shows: "Are you sure you want to logout?"
    ↓
User selects "Logout"
    ↓
Clears all data (authToken, userInfo, etc.)
    ↓
Navigates to Login Screen
```

---

## 🔮 Future Enhancements

### Potential Improvements
1. **Custom Back Behavior per Screen**
   - Some screens might need special handling
   - Example: Unsaved changes warning

2. **Animation Improvements**
   - Smooth transition animations
   - Slide-in/slide-out effects

3. **Gesture Navigation**
   - Swipe from edge to go back
   - iOS-style gestures on Android

4. **Navigation History**
   - Show navigation breadcrumbs
   - Quick jump to any previous screen

---

## 📝 Common Issues & Solutions

### Issue 1: Back Button Not Working
**Solution:** Check if screen uses `UserDashboardLayout`
```typescript
// Correct ✅
<UserDashboardLayout title="My Screen" activeLabel="My Screen">
  {/* content */}
</UserDashboardLayout>

// Wrong ❌
<View>
  {/* content without layout */}
</View>
```

### Issue 2: Double Back Required
**Reason:** Sidebar is open
**Solution:** Close sidebar first, then press back again

### Issue 3: Logout on Every Screen
**Reason:** `activeLabel` not set correctly
**Solution:** Ensure `activeLabel` matches screen name
```typescript
// Dashboard
<UserDashboardLayout activeLabel="Dashboard">

// Other screens
<UserDashboardLayout activeLabel="Available Exams">
```

---

## 🎓 Best Practices

### For Developers

1. **Always use UserDashboardLayout**
   ```typescript
   // Good ✅
   const MyScreen = () => (
     <UserDashboardLayout title="My Screen" activeLabel="My Screen">
       {/* content */}
     </UserDashboardLayout>
   );
   ```

2. **Set correct activeLabel**
   ```typescript
   // Matches sidebar item label
   <UserDashboardLayout activeLabel="Available Exams">
   ```

3. **Handle special cases in screen**
   ```typescript
   // For screens with unsaved changes
   useEffect(() => {
     const onBackPress = () => {
       if (hasUnsavedChanges) {
         Alert.alert('Unsaved Changes', 'Save before leaving?');
         return true; // Prevent default
       }
       return false; // Allow default back behavior
     };
     
     BackHandler.addEventListener('hardwareBackPress', onBackPress);
     return () => BackHandler.removeEventListener('hardwareBackPress', onBackPress);
   }, [hasUnsavedChanges]);
   ```

---

## Summary

✅ **Back button आता सर्व screens वर काम करतो**
✅ **Dashboard वरून logout confirmation दाखवतो**
✅ **Sidebar open असताना पहिले sidebar बंद करतो**
✅ **Natural Android navigation experience**
✅ **Prevents accidental logouts**
✅ **Consistent behavior across all screens**

सर्व काही **ready आहे testing साठी**! 🎉

---

## Quick Test

1. Open app → Login → Dashboard
2. Navigate to Available Exams
3. **Press back button** → Should go to Dashboard ✅
4. On Dashboard, **press back button** → Should show logout confirmation ✅
5. Press Cancel → Stay on Dashboard ✅
6. Press back again → Logout confirmation → Logout → Login screen ✅

**Perfect!** 🎯
