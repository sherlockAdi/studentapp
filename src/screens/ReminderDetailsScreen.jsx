import React, {useState, useEffect} from 'react';
import {View, Text, ScrollView, Alert as RNAlert, Image, Linking} from 'react-native';
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
      // Load attached files for this reminder
      setFileLoading(true);
      const files = await FileService.getAllFiles(reminderId);
      const list = Array.isArray(files) ? files : (files?.items || []);
      const first = list && list.length > 0 ? list[0] : null;
      if (first) {
        setFileRecord(first);
        const hasCloud = !!(first.url || first.Url);
        const hasB64 = !!(first.base64Data || first.Base64Data);
        console.log('Reminder file loaded. Cloudinary URL:', hasCloud ? (first.url || first.Url) : 'none');
        console.log('Has base64:', hasB64);
      } else {
        console.log('No files attached to this reminder');
      }
    } catch (error) {
      console.error('Error loading reminder:', error);
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
      RNAlert.alert('Success', 'Reminder marked as completed!');
    } catch (error) {
      console.error('Error completing reminder:', error);
      RNAlert.alert('Error', 'Failed to mark reminder as completed');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = () => {
    RNAlert.alert(
      'Delete Reminder',
      'Are you sure you want to delete this reminder?',
      [
        {text: 'Cancel', style: 'cancel'},
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await ReminderService.deleteReminder(reminderId);
              navigation.goBack();
            } catch (error) {
              console.error('Error deleting reminder:', error);
              RNAlert.alert('Error', 'Failed to delete reminder');
            }
          },
        },
      ]
    );
  };

  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <Container safe>
        <View className="flex-1 justify-center items-center">
          <Spinner text="Loading reminder..." />
        </View>
      </Container>
    );
  }

  if (!reminder) {
    return (
      <Container safe>
        <View className="flex-1 justify-center items-center p-6">
          <Text className="text-xl text-gray-600">Reminder not found</Text>
          <Button
            title="Go Back"
            variant="primary"
            onPress={() => navigation.goBack()}
            style={{marginTop: 16}}
          />
        </View>
      </Container>
    );
  }

  // Helpers to support capitalized API fields
  const getVal = (obj, a, b) => (obj ? (obj[a] !== undefined ? obj[a] : obj[b]) : undefined);
  const title = getVal(reminder, 'title', 'Title');
  const description = getVal(reminder, 'description', 'Description');
  const reminderTime = getVal(reminder, 'reminderTime', 'ReminderTime');
  const isCompleted = !!getVal(reminder, 'isCompleted', 'IsCompleted');
  const completedAt = getVal(reminder, 'completedAt', 'CompletedAt');
  const createdAt = getVal(reminder, 'createdAt', 'CreatedAt');
  const updatedAt = getVal(reminder, 'updatedAt', 'UpdatedAt');
  const id = getVal(reminder, 'id', 'Id');
  const userId = getVal(reminder, 'userId', 'UserId');

  return (
    <Container safe>
      <ScrollView contentContainerStyle={{padding: 16}}>
        {/* Status Badge */}
        <View className="items-center mb-6">
          <Badge
            variant={isCompleted ? 'success' : 'warning'}
            style={{paddingHorizontal: 20, paddingVertical: 8}}>
            <Text className="text-base font-bold">
              {isCompleted ? '✓ Completed' : '⏰ Pending'}
            </Text>
          </Badge>
        </View>

        {/* Main Card */}
        <Card padding="lg" style={{marginBottom: 16}}>
          {/* Title */}
          <Text className="text-2xl font-bold text-gray-900 mb-4">
            {title}
          </Text>

          <Divider marginVertical={2} />

          {/* Description */}
          {description && (
            <View className="mb-4">
              <Text className="text-sm font-semibold text-gray-700 mb-2">
                Description:
              </Text>
              <Text className="text-gray-600">{description}</Text>
            </View>
          )}

          {/* Reminder Time */}
          <View className="mb-4">
            <Text className="text-sm font-semibold text-gray-700 mb-2">
              Reminder Time:
            </Text>
            <View className="flex-row items-center">
              <Text style={{fontSize: 20, marginRight: 8}}>🕐</Text>
              <Text className="text-gray-900 text-base">
                {formatDateTime(reminderTime)}
              </Text>
            </View>
          </View>

          {/* Completed At */}
          {isCompleted && completedAt && (
            <View className="mb-4">
              <Text className="text-sm font-semibold text-gray-700 mb-2">
                Completed At:
              </Text>
              <View className="flex-row items-center">
                <Text style={{fontSize: 20, marginRight: 8}}>✓</Text>
                <Text className="text-gray-900 text-base">
                  {formatDateTime(completedAt)}
                </Text>
              </View>
            </View>
          )}

          <Divider marginVertical={2} />

          {/* Attachment Preview */}
          <View className="mb-4">
            <Text className="text-sm font-semibold text-gray-700 mb-2">Attachment:</Text>
            {fileLoading ? (
              <Spinner text="Loading attachment..." />
            ) : !fileRecord ? (
              <Text className="text-gray-500">No attachment</Text>
            ) : (
              <AttachmentPreview file={fileRecord} />
            )}
          </View>

          {/* Metadata */}
          <View className="mt-4">
            <Text className="text-xs text-gray-500">
              Created: {createdAt ? new Date(createdAt).toLocaleDateString() : '—'}
            </Text>
            <Text className="text-xs text-gray-500 mt-1">
              Updated: {updatedAt ? new Date(updatedAt).toLocaleDateString() : '—'}
            </Text>
          </View>
        </Card>

        {/* All Details (raw) */}
        {/* <Card padding="md" style={{marginBottom: 16}}>
          <Text className="text-base font-bold text-gray-900 mb-2">All Details</Text>
          <Text className="text-xs text-gray-700">Id: {String(id ?? '')}</Text>
          <Text className="text-xs text-gray-700 mt-1">UserId: {String(userId ?? '')}</Text>
          <Text className="text-xs text-gray-700 mt-1">Title: {String(title ?? '')}</Text>
          <Text className="text-xs text-gray-700 mt-1">Description: {String(description ?? '')}</Text>
          <Text className="text-xs text-gray-700 mt-1">ReminderTime: {String(reminderTime ?? '')}</Text>
          <Text className="text-xs text-gray-700 mt-1">IsCompleted: {String(isCompleted)}</Text>
          <Text className="text-xs text-gray-700 mt-1">CompletedAt: {String(completedAt ?? '')}</Text>
          <Text className="text-xs text-gray-700 mt-1">CreatedAt: {String(createdAt ?? '')}</Text>
          <Text className="text-xs text-gray-700 mt-1">UpdatedAt: {String(updatedAt ?? '')}</Text>
        </Card> */}

        {/* Action Buttons */}
        <View style={{gap: 12}}>
          {!reminder.isCompleted && (
            <Button
              title={actionLoading ? 'Marking Complete...' : 'Mark as Completed'}
              variant="success"
              size="lg"
              fullWidth
              onPress={handleComplete}
              disabled={actionLoading}
              loading={actionLoading}
              icon={<Text style={{fontSize: 20, color: '#fff'}}>✓</Text>}
              iconPosition="left"
            />
          )}

          <Button
            title="Edit Reminder"
            variant="primary"
            size="lg"
            fullWidth
            onPress={() =>
              navigation.navigate('AddReminder', {reminderId: reminder.id})
            }
            disabled={actionLoading}
            icon={<Text style={{fontSize: 20, color: '#fff'}}>✏️</Text>}
            iconPosition="left"
          />

          <Button
            title="Delete Reminder"
            variant="danger"
            size="lg"
            fullWidth
            onPress={handleDelete}
            disabled={actionLoading}
            icon={<Text style={{fontSize: 20, color: '#fff'}}>🗑️</Text>}
            iconPosition="left"
          />

          <Button
            title="Back to List"
            variant="outline"
            size="lg"
            fullWidth
            onPress={() => navigation.goBack()}
            disabled={actionLoading}
          />
        </View>
      </ScrollView>
    </Container>
  );
};

// Helper component to preview a file: prefer Cloudinary URL; fallback to base64 for images; otherwise provide open buttons
const AttachmentPreview = ({file}) => {
  const url = file.url || file.Url || '';
  const base64 = file.base64Data || file.Base64Data || '';
  const name = file.fileName || file.FileName || 'file';
  const mime = file.mimeType || file.MimeType || '';

  const isImage = (m) => /image\/(png|jpe?g|gif|webp)/i.test(m);
  const isPdf = (m) => /application\/pdf/i.test(m);

  if (url && isImage(mime)) {
    console.log('Preview using Cloudinary URL');
    return (
      <Image source={{uri: url}} style={{width: '100%', height: 220, borderRadius: 8}} resizeMode="cover" />
    );
  }
  if (!url && base64 && isImage(mime)) {
    console.log('Preview using base64 fallback');
    return (
      <Image source={{uri: `data:${mime};base64,${base64}`}} style={{width: '100%', height: 220, borderRadius: 8}} resizeMode="cover" />
    );
  }

  // Non-image (e.g., PDF) or no previewable source
  return (
    <View>
      <Text className="text-gray-700 mb-2">{name}</Text>
      {url ? (
        <Button
          title="Open in Browser"
          variant="secondary"
          onPress={() => Linking.openURL(url)}
        />
      ) : base64 ? (
        <Text className="text-gray-500">Base64 available. No inline previewer for this file type.</Text>
      ) : (
        <Text className="text-gray-500">No preview available</Text>
      )}
      {isPdf(mime) && url ? (
        <Text className="text-xs text-gray-500 mt-2">PDFs open in your browser.</Text>
      ) : null}
    </View>
  );
};

export default ReminderDetailsScreen;
