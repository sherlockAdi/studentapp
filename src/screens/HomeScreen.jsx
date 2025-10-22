import React, {useState} from 'react';
import {Text, View, Image} from 'react-native';
import {
  Container,
  Button,
  Input,
  Card,
  Checkbox,
  Radio,
  Select,
  Switch,
  Badge,
  Avatar,
  Chip,
  Alert,
  Modal,
  Toast,
  Tabs,
  Accordion,
  List,
  SearchBar,
  Divider,
  Grid,
  ProgressBar,
  Stepper,
  IconButton,
  Spinner,
  BottomSheet,
  Skeleton,
  Sidebar,
  BottomNavigation,
  Drawer,
  AppBar,
  TabBar,
  Carousel,
  EmptyState,
  FloatingActionButton,
} from '../components';

const HomeScreen = () => {
  // State management
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [agreed, setAgreed] = useState(false);
  const [selectedOption, setSelectedOption] = useState('A');
  const [country, setCountry] = useState('');
  const [notifications, setNotifications] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [showBottomSheet, setShowBottomSheet] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);
  const [showDrawer, setShowDrawer] = useState(false);
  const [bottomNavIndex, setBottomNavIndex] = useState(0);
  const [tabBarIndex, setTabBarIndex] = useState(0);
  const [carouselIndex, setCarouselIndex] = useState(0);

  const countryOptions = [
    {label: 'United States', value: 'us'},
    {label: 'Canada', value: 'ca'},
    {label: 'United Kingdom', value: 'uk'},
    {label: 'Australia', value: 'au'},
  ];

  const listData = [
    {id: '1', name: 'Item 1', description: 'Description 1'},
    {id: '2', name: 'Item 2', description: 'Description 2'},
    {id: '3', name: 'Item 3', description: 'Description 3'},
  ];

  const steps = [
    {label: 'Personal Info', description: 'Enter your details'},
    {label: 'Address', description: 'Enter your address'},
    {label: 'Confirmation', description: 'Review and confirm'},
  ];

  const tabs = [
    {
      label: 'Overview',
      content: (
        <View>
          <Text className="text-gray-900 text-base">Overview content goes here</Text>
        </View>
      ),
    },
    {
      label: 'Details',
      content: (
        <View>
          <Text className="text-gray-900 text-base">Details content goes here</Text>
        </View>
      ),
    },
  ];

  return (
    <>
      <Container padding="md" safe scrollable>
        {/* Header */}
        <View className="mb-6">
          <Text className="text-3xl font-bold text-gray-900 mb-2">
            Component Library Showcase
          </Text>
          <Text className="text-gray-600">
            All 30+ components in action
          </Text>
        </View>

      {/* Buttons Section */}
      <Card title="Buttons" padding="md" style={{marginBottom: 16}}>
        <View style={{gap: 8}}>
          <Button title="Primary Button" variant="primary" onPress={() => {}} />
          <Button title="Secondary Button" variant="secondary" onPress={() => {}} />
          <Button title="Success Button" variant="success" onPress={() => {}} />
          <Button title="Danger Button" variant="danger" onPress={() => {}} />
          <Button title="Outline Button" variant="outline" onPress={() => {}} />
          <Button
            title="Loading Button"
            variant="primary"
            loading={loading}
            onPress={() => setLoading(!loading)}
          />
        </View>
      </Card>

      {/* Form Inputs Section */}
      <Card title="Form Inputs" padding="md" style={{marginBottom: 16}}>
        <Input
          label="Email"
          placeholder="Enter your email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
        />
        <Input
          label="Password"
          placeholder="Enter your password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        <Select
          label="Country"
          placeholder="Select your country"
          value={country}
          options={countryOptions}
          onChange={setCountry}
        />
        <SearchBar
          placeholder="Search..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </Card>

      {/* Checkboxes & Radio Section */}
      <Card title="Selection Controls" padding="md" style={{marginBottom: 16}}>
        <Checkbox
          checked={agreed}
          onChange={setAgreed}
          label="I agree to terms and conditions"
        />
        <Divider marginVertical={3} />
        <View style={{gap: 8}}>
          <Radio
            selected={selectedOption === 'A'}
            onSelect={() => setSelectedOption('A')}
            label="Option A"
          />
          <Radio
            selected={selectedOption === 'B'}
            onSelect={() => setSelectedOption('B')}
            label="Option B"
          />
        </View>
        <Divider marginVertical={3} />
        <Switch
          value={notifications}
          onValueChange={setNotifications}
          label="Enable Notifications"
        />
      </Card>

      {/* Badges & Avatars Section */}
      <Card title="Badges & Avatars" padding="md" style={{marginBottom: 16}}>
        <View className="flex-row mb-4" style={{gap: 8}}>
          <Badge variant="primary">Primary</Badge>
          <Badge variant="success">Success</Badge>
          <Badge variant="danger">Danger</Badge>
          <Badge variant="warning">Warning</Badge>
        </View>
        <View className="flex-row mb-4" style={{gap: 8}}>
          <Avatar name="John Doe" size="sm" />
          <Avatar name="Jane Smith" size="md" backgroundColor="#10B981" />
          <Avatar name="Bob Johnson" size="lg" backgroundColor="#EF4444" />
        </View>
        <View className="flex-row" style={{gap: 8}}>
          <Chip label="React Native" variant="filled" color="blue" />
          <Chip label="JavaScript" variant="outlined" color="green" />
        </View>
      </Card>

      {/* Alerts Section */}
      <Card title="Alerts" padding="md" style={{marginBottom: 16}}>
        <Alert type="success" title="Success" message="Operation completed successfully!" />
        <Alert type="error" title="Error" message="Something went wrong!" />
        <Alert type="warning" title="Warning" message="Please review your input!" />
        <Alert type="info" title="Info" message="Here's some helpful information." />
      </Card>

      {/* Progress Section */}
      <Card title="Progress Indicators" padding="md" style={{marginBottom: 16}}>
        <ProgressBar progress={25} showLabel />
        <View style={{marginVertical: 16}} />
        <ProgressBar progress={50} color="#10B981" showLabel />
        <View style={{marginVertical: 16}} />
        <ProgressBar progress={75} color="#EF4444" showLabel />
        <View style={{marginVertical: 16}} />
        <Spinner text="Loading..." />
      </Card>

      {/* Stepper Section */}
      <Card title="Stepper" padding="md" style={{marginBottom: 16}}>
        <Stepper steps={steps} currentStep={currentStep} orientation="horizontal" />
        <View className="flex-row justify-between mt-4" style={{gap: 8}}>
          <Button
            title="Previous"
            variant="outline"
            onPress={() => setCurrentStep(Math.max(0, currentStep - 1))}
            disabled={currentStep === 0}
            style={{flex: 1}}
          />
          <Button
            title="Next"
            variant="primary"
            onPress={() => setCurrentStep(Math.min(steps.length - 1, currentStep + 1))}
            disabled={currentStep === steps.length - 1}
            style={{flex: 1}}
          />
        </View>
      </Card>

      {/* Tabs Section */}
      <Card title="Tabs" padding="md" style={{marginBottom: 16}}>
        <Tabs tabs={tabs} variant="underline" />
      </Card>

      {/* Accordion Section */}
      <Card title="Accordion" padding="md" style={{marginBottom: 16}}>
        <Accordion title="What is React Native?" defaultExpanded>
          <Text className="text-gray-700">
            React Native is a framework for building native mobile applications using React.
          </Text>
        </Accordion>
        <Accordion title="How do I get started?">
          <Text className="text-gray-700">
            Install React Native CLI and create a new project using 'npx react-native init'.
          </Text>
        </Accordion>
      </Card>

      {/* List Section */}
      <Card title="List" padding="md" style={{marginBottom: 16}}>
        <List
          data={listData}
          renderItem={({item}) => (
            <List.Item
              title={item.name}
              subtitle={item.description}
              rightIcon={<Text>→</Text>}
              onPress={() => console.log('Selected:', item.name)}
            />
          )}
          keyExtractor={item => item.id}
        />
      </Card>

      {/* Grid Section */}
      <Card title="Grid Layout" padding="md" style={{marginBottom: 16}}>
        <Grid columns={2} gap={4}>
          <Card variant="filled" padding="md">
            <Text className="text-center font-bold">Item 1</Text>
          </Card>
          <Card variant="filled" padding="md">
            <Text className="text-center font-bold">Item 2</Text>
          </Card>
          <Card variant="filled" padding="md">
            <Text className="text-center font-bold">Item 3</Text>
          </Card>
          <Card variant="filled" padding="md">
            <Text className="text-center font-bold">Item 4</Text>
          </Card>
        </Grid>
      </Card>

      {/* Skeleton Loading Section */}
      <Card title="Skeleton Loading" padding="md" style={{marginBottom: 16}}>
        <Skeleton width="100%" height={20} />
        <View style={{marginVertical: 8}} />
        <Skeleton width="80%" height={20} />
        <View style={{marginVertical: 8}} />
        <Skeleton width="60%" height={20} />
      </Card>

      {/* Modal & Toast Triggers */}
      <Card title="Modals & Toasts" padding="md" style={{marginBottom: 16}}>
        <Button
          title="Show Modal"
          variant="primary"
          onPress={() => setShowModal(true)}
          fullWidth
        />
        <View style={{marginVertical: 8}} />
        <Button
          title="Show Toast"
          variant="success"
          onPress={() => setShowToast(true)}
          fullWidth
        />
        <View style={{marginVertical: 8}} />
        <Button
          title="Show Bottom Sheet"
          variant="secondary"
          onPress={() => setShowBottomSheet(true)}
          fullWidth
        />
      </Card>

      {/* Icon Buttons */}
      <Card title="Icon Buttons" padding="md" style={{marginBottom: 16}}>
        <View className="flex-row justify-center" style={{gap: 8}}>
          <IconButton icon={<Text>❤️</Text>} variant="filled" />
          <IconButton icon={<Text>⭐</Text>} variant="outlined" />
          <IconButton icon={<Text>🔔</Text>} variant="ghost" />
          <IconButton icon={<Text>⚙️</Text>} variant="default" />
        </View>
      </Card>

      {/* Sidebar & Drawer */}
      <Card title="Sidebar & Drawer" padding="md" style={{marginBottom: 16}}>
        <Button
          title="Open Sidebar"
          variant="primary"
          onPress={() => setShowSidebar(true)}
          fullWidth
        />
        <View style={{marginVertical: 8}} />
        <Button
          title="Open Drawer"
          variant="secondary"
          onPress={() => setShowDrawer(true)}
          fullWidth
        />
      </Card>

      {/* Tab Bar */}
      <Card title="Tab Bar" padding="md" style={{marginBottom: 16}}>
        <TabBar
          tabs={[
            {label: 'Home', icon: <Text>🏠</Text>},
            {label: 'Search', icon: <Text>🔍</Text>},
            {label: 'Profile', icon: <Text>👤</Text>, badge: '3'},
          ]}
          activeIndex={tabBarIndex}
          onChange={setTabBarIndex}
          variant="underline"
        />
        <Divider marginVertical={3} />
        <TabBar
          tabs={[
            {label: 'All'},
            {label: 'Active'},
            {label: 'Completed'},
          ]}
          activeIndex={0}
          variant="pills"
        />
      </Card>

      {/* Carousel */}
      <Card title="Carousel" padding="md" style={{marginBottom: 16}}>
        <Carousel
          data={[
            {id: 1, color: '#3B82F6', title: 'Slide 1'},
            {id: 2, color: '#10B981', title: 'Slide 2'},
            {id: 3, color: '#EF4444', title: 'Slide 3'},
          ]}
          renderItem={({item}) => (
            <View
              className="flex-1 items-center justify-center rounded-lg"
              style={{backgroundColor: item.color}}>
              <Text className="text-white text-2xl font-bold">{item.title}</Text>
            </View>
          )}
          itemHeight={150}
          autoPlay
          onIndexChange={setCarouselIndex}
        />
      </Card>

      {/* Empty State */}
      <Card title="Empty State" padding="md" style={{marginBottom: 16}}>
        <EmptyState
          icon={<Text style={{fontSize: 48}}>📭</Text>}
          title="No messages"
          description="You don't have any messages yet. Start a conversation!"
          actionLabel="New Message"
          onActionPress={() => console.log('New message')}
        />
      </Card>

      {/* Bottom Navigation Preview */}
      <Card title="Bottom Navigation" padding="md" style={{marginBottom: 80}}>
        <Text className="text-gray-700 mb-2">
          Bottom navigation is displayed at the bottom of the screen
        </Text>
        <Text className="text-gray-600 text-sm">
          Current tab: {['Home', 'Search', 'Favorites', 'Profile'][bottomNavIndex]}
        </Text>
      </Card>
      </Container>

      {/* Modal Component */}
      <Modal
        visible={showModal}
        onClose={() => setShowModal(false)}
        title="Example Modal"
        size="md"
        footer={
          <View className="flex-row" style={{gap: 8}}>
            <Button
              title="Cancel"
              variant="outline"
              onPress={() => setShowModal(false)}
              style={{flex: 1}}
            />
            <Button
              title="Confirm"
              variant="primary"
              onPress={() => {
                setShowModal(false);
                setShowToast(true);
              }}
              style={{flex: 1}}
            />
          </View>
        }>
        <Text className="text-gray-700 text-base">
          This is an example modal dialog. You can put any content here.
        </Text>
      </Modal>

      {/* Toast Component */}
      <Toast
        visible={showToast}
        message="Action completed successfully!"
        type="success"
        duration={3000}
        onHide={() => setShowToast(false)}
        position="top"
      />

      {/* Bottom Sheet Component */}
      <BottomSheet
        visible={showBottomSheet}
        onClose={() => setShowBottomSheet(false)}
        title="Bottom Sheet Example"
        height={400}>
        <Text className="text-gray-700 text-base mb-4">
          This is a bottom sheet component. It slides up from the bottom of the screen.
        </Text>
        <Button
          title="Close"
          variant="primary"
          onPress={() => setShowBottomSheet(false)}
          fullWidth
        />
      </BottomSheet>

      {/* Sidebar Component */}
      <Sidebar
        visible={showSidebar}
        onClose={() => setShowSidebar(false)}
        position="left"
        header={
          <View>
            <Text className="text-white text-xl font-bold">Menu</Text>
            <Text className="text-white text-sm opacity-80">Welcome back!</Text>
          </View>
        }
        items={[
          {
            label: 'Home',
            icon: <Text>🏠</Text>,
            active: true,
            onPress: () => console.log('Home'),
          },
          {
            label: 'Profile',
            icon: <Text>👤</Text>,
            subtitle: 'View your profile',
            onPress: () => console.log('Profile'),
          },
          {
            label: 'Settings',
            icon: <Text>⚙️</Text>,
            onPress: () => console.log('Settings'),
          },
          {
            label: 'Notifications',
            icon: <Text>🔔</Text>,
            badge: '5',
            onPress: () => console.log('Notifications'),
          },
          {
            label: 'Help',
            icon: <Text>❓</Text>,
            onPress: () => console.log('Help'),
          },
        ]}
        footer={
          <Button
            title="Logout"
            variant="danger"
            onPress={() => {
              console.log('Logout');
              setShowSidebar(false);
            }}
            fullWidth
          />
        }
      />

      {/* Drawer Component */}
      <Drawer
        visible={showDrawer}
        onClose={() => setShowDrawer(false)}
        position="right">
        <View className="p-4">
          <Text className="text-2xl font-bold text-gray-900 mb-4">Drawer Menu</Text>
          <Divider />
          <View style={{gap: 16, marginTop: 16}}>
            <Button title="Option 1" variant="outline" onPress={() => {}} />
            <Button title="Option 2" variant="outline" onPress={() => {}} />
            <Button title="Option 3" variant="outline" onPress={() => {}} />
            <Button
              title="Close Drawer"
              variant="primary"
              onPress={() => setShowDrawer(false)}
            />
          </View>
        </View>
      </Drawer>

      {/* Bottom Navigation */}
      <BottomNavigation
        items={[
          {label: 'Home', icon: <Text style={{fontSize: 24}}>🏠</Text>},
          {label: 'Search', icon: <Text style={{fontSize: 24}}>🔍</Text>},
          {label: 'Favorites', icon: <Text style={{fontSize: 24}}>❤️</Text>, badge: '3'},
          {label: 'Profile', icon: <Text style={{fontSize: 24}}>👤</Text>},
        ]}
        activeIndex={bottomNavIndex}
        onChange={setBottomNavIndex}
      />

      {/* Floating Action Button */}
      <FloatingActionButton
        icon={<Text style={{fontSize: 24, color: '#fff'}}>+</Text>}
        position="bottom-right"
        actions={[
          {
            icon: <Text style={{fontSize: 20, color: '#fff'}}>📷</Text>,
            backgroundColor: '#10B981',
            onPress: () => console.log('Camera'),
          },
          {
            icon: <Text style={{fontSize: 20, color: '#fff'}}>📁</Text>,
            backgroundColor: '#3B82F6',
            onPress: () => console.log('Files'),
          },
          {
            icon: <Text style={{fontSize: 20, color: '#fff'}}>📝</Text>,
            backgroundColor: '#EF4444',
            onPress: () => console.log('Note'),
          },
        ]}
      />
    </>
  );
};

export default HomeScreen;
