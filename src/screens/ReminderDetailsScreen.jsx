import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  ScrollView,
  Alert as RNAlert,
  Image,
  Linking,
} from 'react-native';
import {Container, Card, Button, Badge, Spinner, Divider} from '../components';
import ReminderService from '../services/reminderService';
import FileService from '../services/fileService';

const ReminderDetailsScreen = ({navigation, route}) => {
  const {reminderId} = route.params;
  const [reminder, setReminder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [fileRecord, setFileRecord] = useState(null);
  const [fileLoading, setFileLoading] = useState(false);

  useEffect(() => {
    loadReminder();
  }, [reminderId]);

  const loadReminder = async () => {
    try {
      const data = await ReminderService.getReminderById(reminderId);
      setReminder(data);

      setFileLoading(true);
      const files = await FileService.getAllFiles(reminderId);
      const first = (Array.isArray(files) ? files : files?.items)?.[0] || null;
      setFileRecord(first);
    } catch (error) {
      RNAlert.alert('Error', 'Failed to load reminder details');
    } finally {
      setLoading(false);
      setFileLoading(false);
    }
  };

  const handleComplete = async () => {
    setActionLoading(true);
    try {
      await ReminderService.completeReminder(reminderId);
      await loadReminder();
      RNAlert.alert('Success', 'Marked as completed!');
    } finally {
      setActionLoading(false);
    }
  };

  const formatDateTime = (date) =>
    new Date(date).toLocaleString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

  if (loading) {
    return (
      <Container safe>
        <View className="flex-1 justify-center items-center">
          <Spinner text="Loading..." />
        </View>
      </Container>
    );
  }

  if (!reminder) return null;

  const get = (obj, a, b) => obj?.[a] ?? obj?.[b];
  const title = get(reminder, 'title', 'Title');
  const desc = get(reminder, 'description', 'Description');
  const time = get(reminder, 'reminderTime', 'ReminderTime');
  const done = !!get(reminder, 'isCompleted', 'IsCompleted');
  const completedAt = get(reminder, 'completedAt', 'CompletedAt');
  const createdAt = get(reminder, 'createdAt', 'CreatedAt');
  const updatedAt = get(reminder, 'updatedAt', 'UpdatedAt');

  return (
    <Container safe>
      {/* Clean Modern Header */}
      {/* <View
        style={{
          backgroundColor: '#3B82F6',
          padding: 25,
          borderBottomLeftRadius: 28,
          borderBottomRightRadius: 28,
          elevation: 10,
          shadowColor: '#000',
          shadowOffset: {width: 0, height: 10},
          shadowOpacity: 0.25,
          shadowRadius: 20,
        }}>
        <Text className="text-white text-3xl font-extrabold tracking-wide">
          {title}
        </Text>
        <Text className="text-blue-100 mt-1 text-sm">
          Reminder Details Overview
        </Text>
      </View> */}

      <ScrollView contentContainerStyle={{padding: 20}}>
        {/* <View className="items-center mb-6">
          <Badge variant={done ? 'success' : 'warning'}>
            {done ? '✅ Completed' : '⏳ Pending'}
          </Badge>
        </View> */}

        {/* Glass/UI Styled Card */}
        <Card
          padding="xl"
          style={{
            backgroundColor: '#ffffffEE',
            borderRadius: 22,
            shadowColor: '#000',
            shadowOpacity: 0.12,
            shadowOffset: {width: 0, height: 10},
            shadowRadius: 25,
            elevation: 10,
          }}>
          {/* Description */}
          {desc && (
            <View className="mb-2">
              <Text className="text-base font-semibold text-gray-800 mb-1">
                Description 📝
              </Text>
              <Text className="text-gray-600 leading-relaxed">{desc}</Text>
            </View>
          )}

          {/* Reminder Time */}
          <View className="mb-2">
            <Text className="text-base font-semibold text-gray-800 mb-1">
              Remind At 🕒
            </Text>
            <Text className="text-blue-600 font-medium text-lg">
              {formatDateTime(time)}
            </Text>
          </View>

          {/* {done && completedAt && (
            <View className="mb-6">
              <Text className="text-base font-semibold text-gray-800 mb-1">
                Completed On ✅
              </Text>
              <Text className="text-green-600 font-medium text-lg">
                {formatDateTime(completedAt)}
              </Text>
            </View>
          )} */}

          <Divider marginVertical={10} />

          {/* Attachment */}
          <Text className="text-base font-semibold text-gray-800 mb-2">
            Attachment 📎
          </Text>

          {fileLoading ? (
            <Spinner />
          ) : fileRecord ? (
            <AttachmentPreview file={fileRecord} />
          ) : (
            <Text className="text-gray-400 italic">No attachment</Text>
          )}

          <Divider marginVertical={10} />

          {/* Footer */}
          {/* <View className="mt-4">
            <Text className="text-gray-500 text-xs">
              📌 Created: {new Date(createdAt).toDateString()}
            </Text>
            <Text className="text-gray-500 text-xs mt-1">
              ✏️ Updated: {new Date(updatedAt).toDateString()}
            </Text>
          </View> */}
        </Card>

        {/* Actions */}
        <View style={{marginTop: 24, gap: 14}}>
          {!done && (
            <Button
              title={actionLoading ? 'Updating...' : 'Mark as Completed ✅'}
              fullWidth
              variant="success"
              onPress={handleComplete}
              disabled={actionLoading}
            />
          )}

          <Button
            title="Back"
            fullWidth
            variant="outline"
            onPress={() => navigation.goBack()}
          />
        </View>
      </ScrollView>
    </Container>
  );
};

const AttachmentPreview = ({file}) => {
  const url = file.Url || file.url;
  const mime = file.MimeType || file.mimeType;

  if (/image/i.test(mime)) {
    return (
      <Image
        source={{uri: url}}
        style={{
          width: '100%',
          height: 220,
          borderRadius: 16,
          marginBottom: 10,
        }}
      />
    );
  }

  return (
    <Button title="Open File" variant="secondary" onPress={() => Linking.openURL(url)} />
  );
};

export default ReminderDetailsScreen;
