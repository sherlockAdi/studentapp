# 🚀 Quick Start - Login Screen

## ⚡ Installation (Required)

### **Step 1: Install AsyncStorage**

```bash
npm install @react-native-async-storage/async-storage
```

### **Step 2: For iOS (if applicable)**

```bash
cd ios && pod install && cd ..
```

### **Step 3: Restart Metro**

```bash
npx react-native start --reset-cache
```

---

## 🎯 What You Get

### **Login Screen Features:**
- ✅ Beautiful gradient design
- ✅ Username/Email input
- ✅ Password input with show/hide
- ✅ Remember me checkbox
- ✅ Forgot password link
- ✅ Loading states
- ✅ Error handling
- ✅ Social login buttons
- ✅ Sign up link

### **API Integration:**
- ✅ POST to `http://61.246.33.108:8069/studentapi/login`
- ✅ Sends username and password
- ✅ Receives user data
- ✅ Stores data locally

### **Data Storage:**
- ✅ Saves user data to AsyncStorage
- ✅ Persists login session
- ✅ Retrieves user info
- ✅ Logout functionality

---

## 🧪 Test Credentials

```
Username: dg@atm.edu.in
Password: 12344321
```

---

## 📱 How to Use

### **1. App Opens on Login Screen**

The app now starts with the LoginScreen as the initial route.

### **2. Enter Credentials**

- Type username/email
- Type password
- Optionally check "Remember me"

### **3. Click Login**

- Shows loading spinner
- Calls API
- Saves data if successful
- Navigates to Home screen

### **4. Error Handling**

If login fails:
- Shows error message in red alert
- User can retry
- Validates inputs before API call

---

## 🔧 Files Created

```
src/
├── screens/
│   └── LoginScreen.jsx          # Login UI (250+ lines)
├── utils/
│   ├── auth.js                  # Auth functions
│   └── storage.js               # Storage utilities
└── appnavigation/
    └── AppNavigations.jsx       # Updated with Login route
```

---

## 💻 Code Examples

### **Check if User is Logged In:**

```javascript
import {isUserLoggedIn, getUserData} from './src/utils/auth';

const checkAuth = async () => {
  const loggedIn = await isUserLoggedIn();
  if (loggedIn) {
    const user = await getUserData();
    console.log('User:', user);
  }
};
```

### **Logout User:**

```javascript
import {logoutUser} from './src/utils/auth';

const handleLogout = async () => {
  await logoutUser();
  navigation.replace('Login');
};
```

### **Get User Data:**

```javascript
import {getUserData} from './src/utils/auth';

const user = await getUserData();
console.log('User ID:', user.userId);
console.log('Email:', user.userEmail);
console.log('Role:', user.roleId);
```

---

## 🎨 Design Details

### **Colors:**
- Primary: Blue (#3B82F6)
- Background: Blue gradient
- Card: White
- Error: Red (#DC2626)

### **Layout:**
- Gradient background
- Centered white card
- Logo at top
- Form in middle
- Links at bottom

### **Interactions:**
- Touch feedback on all buttons
- Keyboard aware scrolling
- Password show/hide toggle
- Loading spinner during API call

---

## 🔐 Security Features

- ✅ Password masking
- ✅ Secure local storage
- ✅ Input validation
- ✅ Error messages (no sensitive data)
- ✅ Session management

---

## 📊 API Response

### **Success Response:**

```json
{
  "Success": true,
  "Message": "Login successful",
  "RoleId": "1",
  "useremail": "12344321",
  "userid": "1"
}
```

### **What Gets Stored:**

```javascript
{
  userId: "1",
  userEmail: "12344321",
  roleId: "1",
  username: "dg@atm.edu.in"
}
```

---

## ✅ Checklist

Before running:

- [ ] Install AsyncStorage
- [ ] Restart Metro bundler
- [ ] Clear cache if needed
- [ ] Test with provided credentials

After successful login:

- [ ] User data is stored
- [ ] Navigates to Home screen
- [ ] Session persists on app restart

---

## 🐛 Troubleshooting

### **Error: AsyncStorage not found**
```bash
npm install @react-native-async-storage/async-storage
cd ios && pod install && cd ..
```

### **Error: Network request failed**
- Check internet connection
- Verify API endpoint is accessible
- Check if backend is running

### **Error: Login failed**
- Verify credentials
- Check API response format
- Look at console logs

---

## 🎉 Summary

You now have:

✅ **Professional Login Screen**  
✅ **API Integration**  
✅ **Data Storage**  
✅ **Session Management**  
✅ **Navigation Setup**  
✅ **Error Handling**  

**Just install AsyncStorage and run the app!** 🚀

---

## 📞 Next Steps

1. Install AsyncStorage
2. Run the app
3. Test login with credentials
4. Check data persistence
5. Add logout button in HomeScreen
6. Customize design as needed

**Everything is ready to go!** 🎊
