import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  RefreshControl,
  Modal,
  TextInput,
  Alert as RNAlert,
  ActivityIndicator,
  Animated,
} from 'react-native';
import {Spinner} from '../components';
import PharmacyService from '../services/pharmacyService';
import FileService from '../services/fileService';
import DocumentPicker from 'react-native-document-picker';
import RNFS from 'react-native-fs';
import sha1 from 'crypto-js/sha1';
import ReminderService from '../services/reminderService';

const PharmacyNearbyScreen = ({navigation}) => {
  const [pharmacies, setPharmacies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [showLinkModal, setShowLinkModal] = useState(false);
  const [linkUrl, setLinkUrl] = useState('');
  const [lastFileId, setLastFileId] = useState(null);
  const [uploadedPreview, setUploadedPreview] = useState(null); // { url, mimeType, base64, fileName }
  const [stagedFile, setStagedFile] = useState(null); // { type: 'file'|'link', fileName, mimeType, base64?, url?, sizeBytes? }
  const toastY = useRef(new Animated.Value(-80)).current;
  const [showAllNearby, setShowAllNearby] = useState(false);
  const [showAddHospitalModal, setShowAddHospitalModal] = useState(false);
  const [newHospital, setNewHospital] = useState({
    Name: '',
    Address: '',
    City: '',
    State: '',
    Country: '',
    Latitude: '',
    Longitude: '',
    Phone: '',
  });

  const showSuccessToast = () => {
    Animated.sequence([
      Animated.delay(500),
      Animated.timing(toastY, {toValue: 0, duration: 250, useNativeDriver: true}),
      Animated.delay(1600),
      Animated.timing(toastY, {toValue: -80, duration: 250, useNativeDriver: true}),
    ]).start();
  };

  useEffect(() => {
    loadNearby();
  }, []);

  const loadPharmacies = async () => {
    try {
      const data = await PharmacyService.getAllPharmacies();
      setPharmacies(data || []);
    } catch (error) {
      console.error('Error loading pharmacies:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadNearby = async (lat = 40.7128, long = -74.006) => {
    try {
      const data = await PharmacyService.getNearbyPharmacies(lat, long);
      console.log('Nearby pharmacies:', data);
      setPharmacies(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Get nearby pharmacies error:', error);
    } finally {
      setLoading(false);
    }
  };

  // Create a simple reminder associated with the uploaded document
  const createUploadReminder = async ({fileName}) => {
    try {
      const nowIso = new Date().toISOString();
      // Many endpoints in this API use Capitalized fields
      const payloadCapital = {
        Title: 'Prescription Upload',
        Description: `Document: ${fileName}`,
        ReminderTime: nowIso,
        IsCompleted: false,
        CompletedAt: null,
      };
      console.log('Creating reminder (capitalized fields)...');
      let res = await ReminderService.createReminder(payloadCapital);
      if (res && (res.id || res.Id || res.reminderId)) {
        const rid = res.id || res.Id || res.reminderId;
        console.log('Reminder created with ID:', rid);
        return rid;
      }
      // Fallback: try lowercase fields if first didn’t return an id
      const payloadLower = {
        title: payloadCapital.Title,
        description: payloadCapital.Description,
        reminderTime: payloadCapital.ReminderTime,
        isCompleted: false,
        completedAt: null,
      };
      console.log('Retry creating reminder (lowercase fields)...');
      res = await ReminderService.createReminder(payloadLower);
      const rid = res && (res.id || res.Id || res.reminderId);
      console.log('Reminder create (fallback) response id:', rid);
      return rid || null;
    } catch (e) {
      console.warn('Failed to create reminder for upload:', e.message || e);
      return null;
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadNearby();
    setRefreshing(false);
  };

  // Cloudinary config (demo: provided by user; no .env)
  const CLOUD_NAME = 'djcczcmoy';
  const CLOUD_API_KEY = '786586212851496';
  const CLOUD_API_SECRET = 'K_wvbCFcJMT90_kfEfvxMT-iNiY';
  const CLOUD_UPLOAD_URL = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/auto/upload`;

  const guessMimeFromName = (name = '') => {
    const lower = name.toLowerCase();
    if (lower.endsWith('.pdf')) return 'application/pdf';
    if (lower.endsWith('.jpg') || lower.endsWith('.jpeg')) return 'image/jpeg';
    if (lower.endsWith('.png')) return 'image/png';
    if (lower.endsWith('.txt')) return 'text/plain';
    return 'application/octet-stream';
  };

  const isImageMime = (m) => /image\/(png|jpe?g|gif|webp)/i.test(m || '');

  // Upload record to our backend API after Cloudinary upload
  const uploadPayload = async ({
    fileName,
    mimeType,
    url = '',
    publicId = '',
    sizeBytes = 0,
    base64Data = '',
    reminderId = null,
  }) => {
    try {
      setUploading(true);
      const payload = {
        fileName,
        mimeType,
        url,
        publicId,
        sizeBytes,
        base64Data,
        ...(reminderId ? {reminderId} : {}),
      };
      const res = await FileService.uploadFile(payload);
      if (res && (res.fileId || res.id)) {
        setLastFileId(res.fileId || res.id);
        // store preview data
        setUploadedPreview({ url, mimeType, base64: base64Data, fileName });
      } else {
        setUploadedPreview({ url, mimeType, base64: base64Data, fileName });
      }
    } catch (e) {
      console.error('Upload error:', e);
      // RNAlert.alert('Error', e.message || 'Failed to upload file');
    } finally {
      setUploading(false);
    }
  };

  // Build Cloudinary signature for signed upload
  const buildCloudinarySignature = (paramsObj) => {
    const keys = Object.keys(paramsObj).sort();
    const toSign = keys
      .map((k) => `${k}=${paramsObj[k]}`)
      .join('&');
    const toHash = `${toSign}${CLOUD_API_SECRET}`;
    return sha1(toHash).toString();
  };

  // Upload to Cloudinary first; fileSource can be a URL or data URI string
  const uploadToCloudinary = async ({fileSource, fileName, mimeType, sizeBytes}) => {
    const timestamp = Math.floor(Date.now() / 1000);
    const folder = 'healthcare';
    const public_id = `${(fileName || 'file')}`.replace(/\.[^/.]+$/, '') + `_${timestamp}`;

    // Params to sign (exclude file, api_key)
    const paramsToSign = {
      folder,
      public_id,
      timestamp,
    };
    const signature = buildCloudinarySignature(paramsToSign);

    const form = new FormData();
    form.append('file', fileSource);
    form.append('api_key', CLOUD_API_KEY);
    form.append('timestamp', String(timestamp));
    form.append('signature', signature);
    form.append('folder', folder);
    form.append('public_id', public_id);

    const res = await fetch(CLOUD_UPLOAD_URL, {
      method: 'POST',
      body: form,
    });
    if (!res.ok) {
      const txt = await res.text();
      throw new Error(`Cloudinary upload failed: ${res.status} ${txt}`);
    }
    const json = await res.json();
    return {
      secureUrl: json.secure_url,
      publicId: json.public_id,
      sizeBytes,
      mimeType,
      fileName,
    };
  };

  const handleUploadLink = async () => {
    if (!linkUrl.trim()) {
      // RNAlert.alert('Link required', 'Please enter a valid URL');
      return;
    }
    try {
      const nameFromUrl = linkUrl.split('/').pop() || 'link';
      const mime = guessMimeFromName(nameFromUrl);
      // Stage for later upload and show preview (URL preview for images handled)
      setStagedFile({ type: 'link', fileName: nameFromUrl, mimeType: mime, url: linkUrl.trim(), sizeBytes: 0 });
      setUploadedPreview({ url: linkUrl.trim(), mimeType: mime, base64: '', fileName: nameFromUrl });
      setShowLinkModal(false);
      setLinkUrl('');
    } catch {}
  };

  const handlePickAndUploadFile = async () => {
    try {
      const res = await DocumentPicker.pickSingle({
        type: [DocumentPicker.types.allFiles],
        copyTo: 'cachesDirectory',
      });
      let path = res.fileCopyUri || res.uri;
      // Resolve content:// path if needed
      if (path && path.startsWith('content://')) {
        try {
          const stat = await RNFS.stat(path);
          if (stat && stat.path) path = stat.path;
        } catch {}
      }
      const base64Data = await RNFS.readFile(path, 'base64');
      const fileName = res.name || 'file';
      const mimeType = res.type || guessMimeFromName(fileName);
      const sizeBytes = res.size || Math.floor((base64Data.length * 3) / 4);

      // Stage selection for later upload and show preview
      setStagedFile({ type: 'file', fileName, mimeType, base64: base64Data, sizeBytes });
      setUploadedPreview({ url: '', mimeType, base64: base64Data, fileName });
    } catch (err) {
      if (DocumentPicker.isCancel && DocumentPicker.isCancel(err)) return;
      console.error('Pick/upload error:', err);
      // RNAlert.alert('Error', err.message || 'Failed to pick/upload file');
    }
  };

  // Perform the actual upload on Continue
  const handleContinueUpload = async () => {
    if (!stagedFile) return;
    try {
      setUploading(true);
      let cloud;
      if (stagedFile.type === 'file') {
        const dataUri = `data:${stagedFile.mimeType};base64,${stagedFile.base64}`;
        cloud = await uploadToCloudinary({
          fileSource: dataUri,
          fileName: stagedFile.fileName,
          mimeType: stagedFile.mimeType,
          sizeBytes: stagedFile.sizeBytes,
        });
        console.log('Cloudinary file upload success:', cloud);
      } else {
        cloud = await uploadToCloudinary({
          fileSource: stagedFile.url,
          fileName: stagedFile.fileName,
          mimeType: stagedFile.mimeType,
          sizeBytes: stagedFile.sizeBytes || 0,
        });
        console.log('Cloudinary link upload success:', cloud);
      }

      // Create reminder and save file record
      const reminderId = await createUploadReminder({fileName: stagedFile.fileName});
      await uploadPayload({
        fileName: cloud.fileName,
        mimeType: cloud.mimeType,
        url: cloud.secureUrl,
        publicId: cloud.publicId,
        sizeBytes: cloud.sizeBytes,
        base64Data: stagedFile.type === 'file' ? stagedFile.base64 : '',
        reminderId,
      });
      // Show toast, then reset UI
      showSuccessToast();
      setStagedFile(null);
      setUploadedPreview(null);
      setLastFileId(null);
    } catch (e) {
      // errors handled in uploadPayload
    } finally {
      setUploading(false);
    }
  };

  if (loading) {
    return (
      <View className="flex-1 bg-white justify-center items-center">
        <Spinner text="Loading..." />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-white">
      {/* Header */}
      <View className="flex-row items-center px-4 pt-10 pb-3">
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={{fontSize: 24}}>←</Text>
        </TouchableOpacity>
        <View className="flex-row items-center ml-3">
          <Text style={{fontSize: 18, marginRight: 6}}>📍</Text>
          <Text className="text-base font-semibold">Mohali</Text>
        </View>
      </View>

      <ScrollView
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{paddingBottom: 70}}>
        
        {/* Title & actions */}
        <View className="px-4 mb-3 flex-row justify-between items-center">
          <Text className="text-xl font-bold">Pharmacy Nearby</Text>
          <TouchableOpacity onPress={() => loadNearby()}>
            <Text style={{color: '#2563EB', fontWeight: '600'}}>Refresh</Text>
          </TouchableOpacity>
        </View>

        {/* Pharmacy Cards - with See more */}
        <View className="px-4 flex-row mb-3" style={{gap: 10, flexWrap: 'wrap'}}>
          {(showAllNearby ? pharmacies : pharmacies.slice(0, 2)).map((pharmacy, index) => (
            <TouchableOpacity
              key={(pharmacy.Id || pharmacy.id || index).toString()}
              className="bg-white rounded-2xl overflow-hidden"
              style={{
                width: '48%',
                borderWidth: 1,
                borderColor: '#E0E0E0',
                shadowColor: '#000',
                shadowOffset: {width: 0, height: 1},
                shadowOpacity: 0.1,
                shadowRadius: 2,
                elevation: 2,
              }}>
              {/* Pharmacy Image Placeholder */}
              <View
                className="w-full items-center justify-center"
                style={{height: 100, backgroundColor: '#F5F5F5'}}>
                <Text style={{fontSize: 40}}>🏥</Text>
              </View>

              {/* Pharmacy Info */}
              <View className="p-3">
                <Text className="text-sm font-bold mb-1" style={{color: '#333'}}>
                  {pharmacy.Name || pharmacy.name}
                </Text>
                <Text className="text-xs mb-1" style={{color: '#666'}}>
                  {pharmacy.DistanceKM ? `${pharmacy.DistanceKM.toFixed(1)} km Away` : ''}
                </Text>
                <View className="flex-row items-center">
                  <Text style={{fontSize: 12, color: '#FFA500'}}>⭐</Text>
                  <Text className="text-xs ml-1" style={{color: '#666'}}>
                    4.5 (120 review)
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {pharmacies.length > 2 && (
          <View className="px-4 mb-4">
            <TouchableOpacity onPress={() => setShowAllNearby(!showAllNearby)}>
              <Text style={{color: '#2563EB', fontWeight: '600'}}>
                {showAllNearby ? 'See less' : 'See more'}
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Upload Prescription Section */}
        <View className="px-4">
          <Text className="text-xl font-bold text-center mb-2">
            Upload Prescription
          </Text>
          <Text className="text-xs text-center mb-4" style={{color: '#666', lineHeight: 16}}>
            We will show the pharmacy that fits as per{'\n'}your prescription.
          </Text>

          {/* Upload Options or Preview */}
          <View
            className="bg-white rounded-2xl p-5 mb-4"
            style={{borderWidth: 1, borderColor: '#E0E0E0'}}>
            {uploadedPreview ? (
              <View>
                <Text className="text-sm font-semibold mb-2" style={{color: '#333'}}>Preview</Text>
                {uploadedPreview.url && isImageMime(uploadedPreview.mimeType) ? (
                  <Image source={{uri: uploadedPreview.url}} style={{width: '100%', height: 180, borderRadius: 8}} resizeMode="cover" />
                ) : (!uploadedPreview.url && uploadedPreview.base64 && isImageMime(uploadedPreview.mimeType)) ? (
                  <Image source={{uri: `data:${uploadedPreview.mimeType};base64,${uploadedPreview.base64}`}} style={{width: '100%', height: 180, borderRadius: 8}} resizeMode="cover" />
                ) : (
                  <View className="items-center justify-center" style={{height: 120}}>
                    <Text style={{fontSize: 40}}>📎</Text>
                    <Text className="text-xs mt-2" style={{color: '#666'}} numberOfLines={1}>{uploadedPreview.fileName}</Text>
                  </View>
                )}
              </View>
            ) : (
              <View className="flex-row justify-around">
                <TouchableOpacity className="items-center" onPress={() => !uploading && setShowLinkModal(true)} disabled={uploading}>
                  <View
                    className="items-center justify-center mb-2"
                    style={{width: 50, height: 50}}>
                    {uploading ? (
                      <ActivityIndicator size="small" color="#00A8A8" />
                    ) : (
                      <Text style={{fontSize: 32}}>📄</Text>
                    )}
                  </View>
                  <Text className="text-sm font-medium">Upload Link</Text>
                </TouchableOpacity>

                <TouchableOpacity className="items-center" onPress={handlePickAndUploadFile} disabled={uploading}>
                  <View
                    className="items-center justify-center mb-2"
                    style={{width: 50, height: 50}}>
                    {uploading ? (
                      <ActivityIndicator size="small" color="#00A8A8" />
                    ) : (
                      <Text style={{fontSize: 32}}>⬆️</Text>
                    )}
                  </View>
                  <Text className="text-sm font-medium">Upload File</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>

          {/* Continue Button */}
          <TouchableOpacity
            className="rounded-xl py-4 items-center"
            style={{backgroundColor: '#4CAF50', opacity: uploading || !uploadedPreview ? 0.5 : 1}}
            disabled={uploading || !uploadedPreview}
            onPress={handleContinueUpload}
          >
            <Text className="text-white text-base font-bold">Continue</Text>
          </TouchableOpacity>

          {/* Add Hospital */}
          <View className="mt-4 items-center">
            <TouchableOpacity onPress={() => setShowAddHospitalModal(true)}>
              <Text style={{color: '#2563EB', fontWeight: '600'}}>+ Add New Hospital</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {/* Uploading overlay */}
      <Modal visible={uploading} transparent animationType="fade">
        <View style={{flex: 1, backgroundColor: 'rgba(0,0,0,0.25)', justifyContent: 'center', alignItems: 'center'}}>
          <View style={{backgroundColor: 'white', borderRadius: 12, padding: 16, minWidth: 180, alignItems: 'center'}}>
            <ActivityIndicator size="large" color="#00A8A8" />
            <Text style={{marginTop: 12, color: '#333', fontWeight: '600'}}>Uploading...</Text>
          </View>
        </View>
      </Modal>

      {/* Add Hospital Modal */}
      <Modal visible={showAddHospitalModal} transparent animationType="slide" onRequestClose={() => setShowAddHospitalModal(false)}>
        <View style={{flex: 1, backgroundColor: 'rgba(0,0,0,0.35)', justifyContent: 'center', padding: 16}}>
          <View style={{backgroundColor: 'white', borderRadius: 12, padding: 16}}>
            <Text style={{fontWeight: 'bold', fontSize: 16, marginBottom: 10}}>Add Hospital</Text>
            {['Name','Address','City','State','Country','Latitude','Longitude','Phone'].map((key) => (
              <View key={key} style={{marginBottom: 8}}>
                <Text style={{fontSize: 12, marginBottom: 4, color: '#444'}}>{key}</Text>
                <TextInput
                  value={String(newHospital[key])}
                  onChangeText={(t) => setNewHospital((p) => ({...p, [key]: t}))}
                  keyboardType={(key==='Latitude' || key==='Longitude') ? 'numeric' : 'default'}
                  style={{borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 8, paddingHorizontal: 10, paddingVertical: 8, color: '#000'}}
                />
              </View>
            ))}
            <View style={{flexDirection: 'row', justifyContent: 'flex-end', marginTop: 8}}>
              <TouchableOpacity onPress={() => setShowAddHospitalModal(false)} style={{padding: 10}}>
                <Text style={{color: '#6B7280'}}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={async () => {
                  try {
                    const payloadCap = {
                      Name: newHospital.Name,
                      Address: newHospital.Address,
                      City: newHospital.City,
                      State: newHospital.State,
                      Country: newHospital.Country,
                      Latitude: parseFloat(newHospital.Latitude) || 0,
                      Longitude: parseFloat(newHospital.Longitude) || 0,
                      Phone: newHospital.Phone,
                    };
                    const created = await PharmacyService.createPharmacy(payloadCap);
                    console.log('Hospital created (pharmacy endpoint):', created);
                    setShowAddHospitalModal(false);
                    setNewHospital({Name:'',Address:'',City:'',State:'',Country:'',Latitude:'',Longitude:'',Phone:''});
                    await loadNearby();
                    showSuccessToast();
                  } catch (e) {
                    console.error('Create hospital error:', e);
                  }
                }}
                style={{padding: 10}}>
                <Text style={{color: '#2563EB', fontWeight: '600'}}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Slide-in success toast */}
      <Animated.View style={{position: 'absolute', top: 12, left: 16, right: 16, transform: [{translateY: toastY}]}}>
        <View style={{backgroundColor: '#16A34A', borderRadius: 10, paddingVertical: 10, paddingHorizontal: 14, shadowColor: '#000', shadowOpacity: 0.15, shadowOffset: {width:0, height:2}, shadowRadius: 6, elevation: 3}}>
          <Text style={{color: 'white', fontWeight: '700'}}>Successfully uploaded</Text>
        </View>
      </Animated.View>

      {/* Link Modal */}
      <Modal visible={showLinkModal} transparent animationType="fade" onRequestClose={() => setShowLinkModal(false)}>
        <View style={{flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'center', padding: 24}}>
          <View style={{backgroundColor: 'white', borderRadius: 12, padding: 16}}>
            <Text style={{fontWeight: 'bold', fontSize: 16, marginBottom: 8}}>Upload Link</Text>
            <TextInput
              placeholder="https://example.com/file.pdf"
              value={linkUrl}
              onChangeText={setLinkUrl}
              autoCapitalize="none"
              keyboardType="url"
              style={{borderWidth: 1, borderColor: '#E0E0E0', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 10, color: '#000'}}
              placeholderTextColor="#999"
            />
            <View style={{flexDirection: 'row', justifyContent: 'flex-end', marginTop: 12}}>
              <TouchableOpacity onPress={() => setShowLinkModal(false)} style={{paddingHorizontal: 12, paddingVertical: 8}}>
                <Text style={{color: '#555'}}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleUploadLink} disabled={uploading} style={{paddingHorizontal: 12, paddingVertical: 8}}>
                <Text style={{color: '#2196F3', fontWeight: 'bold'}}>{uploading ? 'Uploading...' : 'Upload'}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default PharmacyNearbyScreen;
