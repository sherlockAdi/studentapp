# Component Library Documentation

A comprehensive, production-ready React Native component library with 30+ components for building industrial-grade applications.

## Installation & Usage

Import components from the index file:

```javascript
import { Button, Input, Card, Modal } from './components';
```

---

## 📦 UI Components

### Button
Versatile button component with multiple variants and sizes.

**Props:**
- `title` (string) - Button text
- `onPress` (function) - Click handler
- `variant` ('primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'outline' | 'ghost') - Button style
- `size` ('sm' | 'md' | 'lg' | 'xl') - Button size
- `disabled` (boolean) - Disable button
- `loading` (boolean) - Show loading spinner
- `icon` (ReactNode) - Icon element
- `iconPosition` ('left' | 'right') - Icon position
- `fullWidth` (boolean) - Full width button

**Example:**
```javascript
<Button 
  title="Submit" 
  variant="primary" 
  size="md" 
  onPress={() => console.log('Clicked')} 
/>
```

---

### Input
Text input with label, icons, and validation support.

**Props:**
- `label` (string) - Input label
- `placeholder` (string) - Placeholder text
- `value` (string) - Input value
- `onChangeText` (function) - Change handler
- `error` (string) - Error message
- `helperText` (string) - Helper text
- `disabled` (boolean) - Disable input
- `secureTextEntry` (boolean) - Password input
- `multiline` (boolean) - Multi-line input
- `leftIcon` (ReactNode) - Left icon
- `rightIcon` (ReactNode) - Right icon
- `keyboardType` (string) - Keyboard type

**Example:**
```javascript
<Input 
  label="Email" 
  placeholder="Enter your email" 
  value={email}
  onChangeText={setEmail}
  error={emailError}
/>
```

---

### Card
Container component with title, subtitle, and footer.

**Props:**
- `title` (string) - Card title
- `subtitle` (string) - Card subtitle
- `footer` (ReactNode) - Footer content
- `onPress` (function) - Make card pressable
- `variant` ('elevated' | 'outlined' | 'filled') - Card style
- `padding` ('none' | 'sm' | 'md' | 'lg' | 'xl') - Card padding

**Example:**
```javascript
<Card 
  title="Card Title" 
  subtitle="Card subtitle"
  variant="elevated"
  padding="md"
>
  <Text>Card content</Text>
</Card>
```

---

### Badge
Small status indicator or label.

**Props:**
- `children` (string) - Badge text
- `variant` ('primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info') - Badge color
- `size` ('sm' | 'md' | 'lg') - Badge size
- `rounded` (boolean) - Fully rounded badge

**Example:**
```javascript
<Badge variant="success" size="md">Active</Badge>
```

---

### Avatar
User avatar with image or initials.

**Props:**
- `source` (ImageSource) - Image source
- `name` (string) - Name for initials
- `size` ('xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl') - Avatar size
- `rounded` (boolean) - Circular avatar
- `backgroundColor` (string) - Background color

**Example:**
```javascript
<Avatar name="John Doe" size="md" />
<Avatar source={{uri: 'https://...'}} size="lg" />
```

---

### Chip
Compact element for tags or selections.

**Props:**
- `label` (string) - Chip text
- `onPress` (function) - Press handler
- `onDelete` (function) - Delete handler
- `variant` ('filled' | 'outlined') - Chip style
- `color` ('blue' | 'green' | 'red' | 'gray') - Chip color
- `size` ('sm' | 'md' | 'lg') - Chip size
- `icon` (ReactNode) - Icon element

**Example:**
```javascript
<Chip 
  label="React Native" 
  variant="filled" 
  color="blue"
  onDelete={() => console.log('Delete')}
/>
```

---

### IconButton
Button with icon only.

**Props:**
- `icon` (ReactNode) - Icon element
- `onPress` (function) - Press handler
- `size` ('sm' | 'md' | 'lg' | 'xl') - Button size
- `variant` ('default' | 'filled' | 'outlined' | 'ghost') - Button style
- `disabled` (boolean) - Disable button

**Example:**
```javascript
<IconButton 
  icon={<Icon name="heart" />} 
  variant="filled"
  onPress={() => console.log('Liked')}
/>
```

---

### Divider
Visual separator between content.

**Props:**
- `text` (string) - Optional text in divider
- `orientation` ('horizontal' | 'vertical') - Divider orientation
- `thickness` (number) - Line thickness
- `color` (string) - Line color
- `marginVertical` (number) - Vertical margin
- `marginHorizontal` (number) - Horizontal margin

**Example:**
```javascript
<Divider />
<Divider text="OR" />
```

---

### Spinner
Loading indicator.

**Props:**
- `size` ('small' | 'large') - Spinner size
- `color` (string) - Spinner color
- `text` (string) - Loading text
- `fullScreen` (boolean) - Full screen spinner

**Example:**
```javascript
<Spinner size="large" text="Loading..." />
```

---

### ProgressBar
Progress indicator bar.

**Props:**
- `progress` (number) - Progress value (0-100)
- `height` (number) - Bar height
- `color` (string) - Progress color
- `backgroundColor` (string) - Background color
- `showLabel` (boolean) - Show percentage label
- `animated` (boolean) - Animate progress

**Example:**
```javascript
<ProgressBar progress={75} showLabel />
```

---

### Skeleton
Loading placeholder.

**Props:**
- `width` (number | string) - Skeleton width
- `height` (number) - Skeleton height
- `borderRadius` (number) - Border radius

**Example:**
```javascript
<Skeleton width="100%" height={20} />
<Skeleton width={100} height={100} borderRadius={50} />
```

---

## 📝 Form Components

### Checkbox
Checkbox input with label.

**Props:**
- `checked` (boolean) - Checked state
- `onChange` (function) - Change handler
- `label` (string) - Checkbox label
- `disabled` (boolean) - Disable checkbox
- `size` ('sm' | 'md' | 'lg') - Checkbox size
- `color` ('blue' | 'green' | 'red' | 'purple') - Checkbox color

**Example:**
```javascript
<Checkbox 
  checked={agreed} 
  onChange={setAgreed}
  label="I agree to terms"
/>
```

---

### Radio
Radio button input.

**Props:**
- `selected` (boolean) - Selected state
- `onSelect` (function) - Select handler
- `label` (string) - Radio label
- `disabled` (boolean) - Disable radio
- `size` ('sm' | 'md' | 'lg') - Radio size
- `color` ('blue' | 'green' | 'red' | 'purple') - Radio color

**Example:**
```javascript
<Radio 
  selected={option === 'A'} 
  onSelect={() => setOption('A')}
  label="Option A"
/>
```

---

### Select
Dropdown select input.

**Props:**
- `label` (string) - Select label
- `placeholder` (string) - Placeholder text
- `value` (any) - Selected value
- `options` (array) - Options array [{label, value}]
- `onChange` (function) - Change handler
- `error` (string) - Error message
- `disabled` (boolean) - Disable select

**Example:**
```javascript
<Select 
  label="Country"
  value={country}
  options={[
    {label: 'USA', value: 'us'},
    {label: 'Canada', value: 'ca'}
  ]}
  onChange={setCountry}
/>
```

---

### Switch
Toggle switch input.

**Props:**
- `value` (boolean) - Switch state
- `onValueChange` (function) - Change handler
- `label` (string) - Switch label
- `disabled` (boolean) - Disable switch
- `color` (string) - Active color

**Example:**
```javascript
<Switch 
  value={enabled} 
  onValueChange={setEnabled}
  label="Enable notifications"
/>
```

---

### Slider
Range slider input.

**Props:**
- `value` (number) - Slider value
- `onValueChange` (function) - Change handler
- `minimumValue` (number) - Minimum value
- `maximumValue` (number) - Maximum value
- `step` (number) - Step increment
- `label` (string) - Slider label
- `showValue` (boolean) - Show current value

**Example:**
```javascript
<Slider 
  value={volume}
  onValueChange={setVolume}
  minimumValue={0}
  maximumValue={100}
  label="Volume"
  showValue
/>
```

---

### DatePicker
Date and time picker.

**Props:**
- `label` (string) - Picker label
- `value` (Date) - Selected date
- `onChange` (function) - Change handler
- `mode` ('date' | 'time' | 'datetime') - Picker mode
- `placeholder` (string) - Placeholder text
- `error` (string) - Error message
- `disabled` (boolean) - Disable picker
- `minimumDate` (Date) - Minimum date
- `maximumDate` (Date) - Maximum date

**Example:**
```javascript
<DatePicker 
  label="Birth Date"
  value={birthDate}
  onChange={setBirthDate}
  mode="date"
/>
```

---

### SearchBar
Search input with clear button.

**Props:**
- `placeholder` (string) - Placeholder text
- `value` (string) - Search value
- `onChangeText` (function) - Change handler
- `onSearch` (function) - Search handler
- `onClear` (function) - Clear handler
- `leftIcon` (ReactNode) - Left icon
- `autoFocus` (boolean) - Auto focus

**Example:**
```javascript
<SearchBar 
  placeholder="Search products..."
  value={search}
  onChangeText={setSearch}
  onSearch={handleSearch}
/>
```

---

## 📐 Layout Components

### Container
Main container with safe area and scrolling.

**Props:**
- `padding` ('none' | 'sm' | 'md' | 'lg' | 'xl') - Container padding
- `safe` (boolean) - Use SafeAreaView
- `scrollable` (boolean) - Enable scrolling
- `centered` (boolean) - Center content

**Example:**
```javascript
<Container padding="md" safe scrollable>
  <Text>Content</Text>
</Container>
```

---

### Grid
Responsive grid layout.

**Props:**
- `columns` (number) - Number of columns
- `gap` (number) - Gap between items

**Example:**
```javascript
<Grid columns={2} gap={4}>
  <Card>Item 1</Card>
  <Card>Item 2</Card>
  <Card>Item 3</Card>
</Grid>
```

---

## 💬 Feedback Components

### Alert
Alert message box.

**Props:**
- `type` ('success' | 'error' | 'warning' | 'info') - Alert type
- `title` (string) - Alert title
- `message` (string) - Alert message
- `icon` (ReactNode | false) - Custom icon
- `onClose` (function) - Close handler

**Example:**
```javascript
<Alert 
  type="success"
  title="Success!"
  message="Your changes have been saved."
/>
```

---

### Modal
Modal dialog.

**Props:**
- `visible` (boolean) - Modal visibility
- `onClose` (function) - Close handler
- `title` (string) - Modal title
- `footer` (ReactNode) - Footer content
- `size` ('sm' | 'md' | 'lg' | 'full') - Modal size
- `showCloseButton` (boolean) - Show close button
- `animationType` ('fade' | 'slide' | 'none') - Animation type

**Example:**
```javascript
<Modal 
  visible={showModal}
  onClose={() => setShowModal(false)}
  title="Confirm Action"
  footer={
    <Button title="Confirm" onPress={handleConfirm} />
  }
>
  <Text>Are you sure?</Text>
</Modal>
```

---

### Toast
Toast notification.

**Props:**
- `visible` (boolean) - Toast visibility
- `message` (string) - Toast message
- `type` ('success' | 'error' | 'warning' | 'info') - Toast type
- `duration` (number) - Display duration (ms)
- `onHide` (function) - Hide handler
- `position` ('top' | 'bottom') - Toast position

**Example:**
```javascript
<Toast 
  visible={showToast}
  message="Item added to cart"
  type="success"
  duration={3000}
  onHide={() => setShowToast(false)}
/>
```

---

### BottomSheet
Bottom sheet modal.

**Props:**
- `visible` (boolean) - Sheet visibility
- `onClose` (function) - Close handler
- `title` (string) - Sheet title
- `height` (number) - Sheet height
- `showHandle` (boolean) - Show drag handle

**Example:**
```javascript
<BottomSheet 
  visible={showSheet}
  onClose={() => setShowSheet(false)}
  title="Options"
  height={400}
>
  <Text>Sheet content</Text>
</BottomSheet>
```

---

## 🧭 Navigation Components

### Tabs
Tab navigation.

**Props:**
- `tabs` (array) - Tabs array [{label, content}]
- `defaultTab` (number) - Default active tab
- `onChange` (function) - Tab change handler
- `variant` ('underline' | 'pills') - Tab style

**Example:**
```javascript
<Tabs 
  tabs={[
    {label: 'Home', content: <HomeContent />},
    {label: 'Profile', content: <ProfileContent />}
  ]}
  variant="underline"
/>
```

---

### Accordion
Collapsible content panel.

**Props:**
- `title` (string) - Accordion title
- `defaultExpanded` (boolean) - Default expanded state
- `icon` (ReactNode) - Title icon

**Example:**
```javascript
<Accordion title="FAQ 1" defaultExpanded>
  <Text>Answer to FAQ 1</Text>
</Accordion>
```

---

### Stepper
Step progress indicator.

**Props:**
- `steps` (array) - Steps array [{label, description}]
- `currentStep` (number) - Current step index
- `orientation` ('horizontal' | 'vertical') - Stepper orientation

**Example:**
```javascript
<Stepper 
  steps={[
    {label: 'Step 1', description: 'Description'},
    {label: 'Step 2', description: 'Description'}
  ]}
  currentStep={0}
  orientation="horizontal"
/>
```

---

## 📊 Data Display Components

### List
List with items.

**Props:**
- `data` (array) - List data
- `renderItem` (function) - Item render function
- `keyExtractor` (function) - Key extractor
- `emptyText` (string) - Empty state text

**List.Item Props:**
- `title` (string) - Item title
- `subtitle` (string) - Item subtitle
- `leftIcon` (ReactNode) - Left icon
- `rightIcon` (ReactNode) - Right icon
- `onPress` (function) - Press handler
- `disabled` (boolean) - Disable item

**Example:**
```javascript
<List 
  data={items}
  renderItem={({item}) => (
    <List.Item 
      title={item.name}
      subtitle={item.description}
      onPress={() => handleSelect(item)}
    />
  )}
  keyExtractor={item => item.id}
/>
```

---

## 🎨 Styling

All components use TailwindCSS classes via NativeWind. You can customize styles by:

1. Passing `style` prop for custom styles
2. Modifying component files directly
3. Using `className` prop where supported

---

## 📦 Dependencies

Some components require additional packages:

```bash
npm install @react-native-community/slider
npm install @react-native-community/datetimepicker
```

---

## 🚀 Quick Start Example

```javascript
import React, {useState} from 'react';
import {
  Container,
  Button,
  Input,
  Card,
  Alert,
  Modal,
  Toast
} from './components';

const App = () => {
  const [email, setEmail] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [showToast, setShowToast] = useState(false);

  return (
    <Container padding="md" safe scrollable>
      <Card title="Login" padding="lg">
        <Input 
          label="Email"
          placeholder="Enter email"
          value={email}
          onChangeText={setEmail}
        />
        
        <Button 
          title="Login"
          variant="primary"
          fullWidth
          onPress={() => setShowModal(true)}
        />
      </Card>

      <Alert 
        type="info"
        title="Welcome"
        message="Please login to continue"
      />

      <Modal 
        visible={showModal}
        onClose={() => setShowModal(false)}
        title="Confirm"
      >
        <Text>Proceed with login?</Text>
      </Modal>

      <Toast 
        visible={showToast}
        message="Login successful!"
        type="success"
      />
    </Container>
  );
};
```

---

## 📄 License

This component library is part of your Weather app project.
