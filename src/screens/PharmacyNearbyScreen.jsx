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
  Platform,
  PermissionsAndroid,
  Linking,
} from 'react-native';
import {Spinner} from '../components';
import Geolocation from 'react-native-geolocation-service';
import AsyncStorage from '@react-native-async-storage/async-storage';
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
    name: '',
    address: '',
    city: '',
    state: '',
    country: '',
    latitude: '',
    longitude: '',
    phone: '',
  });
  const [currentCoords, setCurrentCoords] = useState(null); // { latitude, longitude }
  const [currentPlace, setCurrentPlace] = useState('Locating...');
  const [progressText, setProgressText] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const showSuccessToast = () => {
    Animated.sequence([
      Animated.delay(500),
      Animated.timing(toastY, {toValue: 0, duration: 250, useNativeDriver: true}),
      Animated.delay(1600),
      Animated.timing(toastY, {toValue: -80, duration: 250, useNativeDriver: true}),
    ]).start();
  };

  const openAddHospital = async () => {
    // ensure we have coords; if not, initialize location first
    if (!currentCoords) {
      await initLocationAndNearby();
    }
    const lat = currentCoords?.latitude;
    const lon = currentCoords?.longitude;
    // Pre-fill lat/long
    setNewHospital((prev) => ({
      ...prev,
      latitude: lat ? String(lat) : prev.latitude || '',
      longitude: lon ? String(lon) : prev.longitude || '',
    }));
    setShowAddHospitalModal(true);
    // Also try to auto-fill address fields from reverse geocode
    try {
      if (lat && lon) {
        const resp = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`, {
          headers: { 'Accept': 'application/json', 'User-Agent': 'StudentApp/1.0 (RN)' }
        });
        const data = await resp.json();
        const a = data && data.address ? data.address : {};
        const composedAddress = [a.house_number, a.road, a.suburb || a.neighbourhood || a.locality]
          .filter(Boolean)
          .join(', ');
        const fullDisplay = data?.display_name || '';
        setNewHospital((prev) => ({
          ...prev,
          address: prev.address || composedAddress || fullDisplay || currentPlace || '',
          city: prev.city || a.city || a.town || a.village || '',
          state: prev.state || a.state || '',
          country: prev.country || a.country || '',
        }));
      }
    } catch {}
  };

  useEffect(() => {
    initLocationAndNearby();
  }, []);

  // If modal is open and coords arrive later, auto-fill fields
  useEffect(() => {
    const fillFromCoords = async () => {
      if (!showAddHospitalModal || !currentCoords) return;
      const lat = currentCoords.latitude;
      const lon = currentCoords.longitude;
      setNewHospital((prev) => ({
        ...prev,
        latitude: prev.latitude || String(lat),
        longitude: prev.longitude || String(lon),
      }));
      try {
        const resp = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`, {
          headers: { 'Accept': 'application/json', 'User-Agent': 'StudentApp/1.0 (RN)' }
        });
        const data = await resp.json();
        const a = data && data.address ? data.address : {};
        const composedAddress = [a.house_number, a.road, a.suburb || a.neighbourhood || a.locality]
          .filter(Boolean)
          .join(', ');
        const fullDisplay = data?.display_name || '';
        setNewHospital((prev) => ({
          ...prev,
          address: prev.address || composedAddress || fullDisplay || currentPlace || '',
          city: prev.city || a.city || a.town || a.village || '',
          state: prev.state || a.state || '',
          country: prev.country || a.country || '',
        }));
      } catch {}
    };
    fillFromCoords();
  }, [showAddHospitalModal, currentCoords]);

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

  const requestLocationPermission = async () => {
    try {
      if (Platform.OS === 'android') {
        // Request both; accept if either is granted
        const result = await PermissionsAndroid.requestMultiple([
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
        ]);
        const fine = result[PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION];
        const coarse = result[PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION];
        return (
          fine === PermissionsAndroid.RESULTS.GRANTED ||
          coarse === PermissionsAndroid.RESULTS.GRANTED
        );
      }
      // iOS permissions are handled by system prompt when accessing geolocation
      return true;
    } catch (e) {
      console.warn('Location permission error:', e);
      return false;
    }
  };

  const getDeviceLocation = () => new Promise((resolve) => {
    // If native module not available yet (e.g., app not rebuilt), fallback to navigator
    if (!Geolocation || typeof Geolocation.getCurrentPosition !== 'function') {
      console.warn('Geolocation native module not available, falling back to navigator.geolocation');
      const navGeo = (typeof navigator !== 'undefined' && navigator.geolocation) ? navigator.geolocation : null;
      if (!navGeo) return resolve(null);
      navGeo.getCurrentPosition(
        (pos) => {
          const coords = { latitude: pos.coords.latitude, longitude: pos.coords.longitude };
          console.log('Location (navigator):', coords);
          resolve(coords);
        },
        (err) => {
          console.warn('Navigator getCurrentPosition error:', err);
          resolve(null);
        },
        { enableHighAccuracy: true, timeout: 20000, maximumAge: 0 }
      );
      return;
    }

    const tryLowAccuracy = () =>
      Geolocation.getCurrentPosition(
        (pos) => {
          const coords = { latitude: pos.coords.latitude, longitude: pos.coords.longitude };
          console.log('Location (low accuracy):', coords);
          resolve(coords);
        },
        (err) => {
          console.warn('Low accuracy getCurrentPosition error:', err);
          resolve(null);
        },
        { enableHighAccuracy: false, timeout: 15000, maximumAge: 0, forceRequestLocation: true }
      );

    Geolocation.getCurrentPosition(
      (pos) => {
        const coords = { latitude: pos.coords.latitude, longitude: pos.coords.longitude };
        console.log('Location (high accuracy):', coords);
        resolve(coords);
      },
      (err) => {
        console.warn('High accuracy getCurrentPosition error:', err);
        tryLowAccuracy();
      },
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 0, forceRequestLocation: true }
    );
  });

  const reverseGeocode = async (lat, lon) => {
    try {
      const resp = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`, {
        headers: { 'Accept': 'application/json', 'User-Agent': 'StudentApp/1.0 (RN)' }
      });
      const data = await resp.json();
      // Prefer full display_name from Nominatim; fallback to composed address
      let place = data && data.display_name;
      if (!place) {
        const a = data && data.address ? data.address : {};
        const parts = [
          a.house_number,
          a.road,
          a.suburb || a.neighbourhood || a.locality,
          a.village || a.town || a.city || a.county,
          a.state,
          a.postcode,
          a.country,
        ].filter(Boolean);
        place = parts.length ? parts.join(', ') : `${lat.toFixed(3)}, ${lon.toFixed(3)}`;
      }
      console.log('Reverse geocode place:', place);
      return place;
    } catch (e) {
      console.warn('Reverse geocode failed:', e);
      return `${lat.toFixed(3)}, ${lon.toFixed(3)}`;
    }
  };

  const initLocationAndNearby = async () => {
    setLoading(true);
    const permitted = await requestLocationPermission();
    console.log('Location permission granted:', permitted);
    let coords = null;
    if (permitted) {
      coords = await getDeviceLocation();
    }
    if (!coords) {
      // Fallback to default (NYC) if no location
      coords = { latitude: 40.7128, longitude: -74.006 };
      console.log('Using fallback coords:', coords);
    }
    setCurrentCoords(coords);
    const place = await reverseGeocode(coords.latitude, coords.longitude);
    setCurrentPlace(place);
    await loadNearby(coords.latitude, coords.longitude);
  };

  // Create reminder with the proven payload (lowercase fields + ISO Z + userId)
  const createUploadReminder = async ({fileName}) => {
    try {
      const isoNoMsZ = new Date().toISOString().replace(/\.\d{3}Z$/, 'Z');
      const uidStr = await AsyncStorage.getItem('userId');
      const userId = uidStr ? parseInt(uidStr, 10) : undefined;
      const payload = {
        title: 'Prescription Upload',
        description: `Document: ${fileName}`,
        reminderTime: isoNoMsZ,
        isCompleted: false,
        completedAt: null,
        ...(userId ? {userId} : {}),
      };
      console.log('Creating reminder (final payload):', payload);
      const res = await ReminderService.createReminder(payload);
      const rid = res && (res.id || res.Id || res.reminderId);
      if (rid) {
        console.log('Reminder created with ID:', rid);
        return rid;
      }
      return null;
    } catch (e) {
      console.warn('Failed to create reminder for upload:', e.message || e);
      return null;
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    if (currentCoords) {
      console.log('Refresh with coords:', currentCoords);
      await loadNearby(currentCoords.latitude, currentCoords.longitude);
    } else {
      await initLocationAndNearby();
    }
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
      setProgressText('Uploading...');
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
      setProgressText('Creating reminder...');
      const reminderId = await createUploadReminder({fileName: stagedFile.fileName});
      setProgressText('Saving...');
      await uploadPayload({
        fileName: cloud.fileName,
        mimeType: cloud.mimeType,
        url: cloud.secureUrl,
        publicId: cloud.publicId,
        sizeBytes: cloud.sizeBytes,
        base64Data: stagedFile.type === 'file' ? stagedFile.base64 : '',
        reminderId,
      });
      showSuccessToast();
      setStagedFile(null);
      setUploadedPreview(null);
      setLastFileId(null);
    } catch (e) {
      console.error('Continue upload error:', e);
    } finally {
      setProgressText('');
      setUploading(false);
    }
  }

  return (
  <View className="flex-1 bg-white">
    
    {/* HEADER */}
  <View className="flex-row items-center px-4 pt-8 pb-3 bg-white shadow-sm rounded-b-2xl">
  <TouchableOpacity
    onPress={() => navigation.goBack()}
    className="w-9 h-9 rounded-full border border-gray-300 items-center justify-center"
  >
    <Text className="text-base font-bold">←</Text>
  </TouchableOpacity>

  <View className="ml-3" style={{flexShrink: 1, flex: 1}}>
    <View className="flex-row items-center">
      <Text style={{fontSize: 14, marginRight: 6}}>📍</Text>
      <Text
        className="text-base font-semibold text-gray-900"
        numberOfLines={1}
        ellipsizeMode="tail"
      >
        {(currentPlace || 'Locating...').split(',')[0]}
      </Text>
    </View>
    <Text className="text-[11px] text-gray-500" numberOfLines={1} ellipsizeMode="tail">
      {(currentPlace || 'Locating...')}
    </Text>
  </View>
</View>


    <ScrollView
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
      contentContainerStyle={{ paddingBottom: 120 }}
      showsVerticalScrollIndicator={false}
    >

      {/* Section Title */}
      <View className="px-4 mt-4 mb-2 flex-row justify-between items-center">
        <Text className="text-lg font-bold">Nearby Pharmacy</Text>
        <TouchableOpacity onPress={openAddHospital}>
          <Text className="text-blue-600 font-semibold">+ Add Hospital</Text>
        </TouchableOpacity>
      </View>

      {/* Search */}
      <View className="px-4 mb-3">
        <View
          className="flex-row items-center bg-gray-50"
          style={{borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 12, paddingHorizontal: 12, height: 46}}>
          <Text style={{fontSize: 18, marginRight: 8}}>🔎</Text>
          <TextInput
            placeholder="Search pharmacies..."
            placeholderTextColor="#9CA3AF"
            value={searchQuery}
            onChangeText={setSearchQuery}
            style={{flex: 1, color: '#111'}}
          />
        </View>
      </View>

      {/* Card Container */}
      <View className="px-4 pb-2 flex-row flex-wrap justify-between">
        {(() => {
          const filtered = (pharmacies || []).filter((p) => {
            const name = (p?.Name || p?.name || '').toString().toLowerCase();
            return name.includes(searchQuery.trim().toLowerCase());
          });
          const visible = showAllNearby ? filtered : filtered.slice(0, 2);
          return visible;
        })().map((pharmacy, index) => (
          <TouchableOpacity
            key={(pharmacy.Id || pharmacy.id || index).toString()}
            className="bg-white mb-4"
            style={{
              width: "48%",
              borderRadius: 16,
              borderWidth: 1,
              borderColor: "#E8E8E8",
              elevation: 3,
              shadowColor: "#000",
              shadowOpacity: 0.08,
              shadowRadius: 4,
              shadowOffset: { width: 0, height: 2 },
            }}
          >
            {/* Accent bar */}
            <View style={{height: 6, backgroundColor: '#4F46E5', borderTopLeftRadius: 16, borderTopRightRadius: 16}} />

            {/* Icon area */}
            <View className="w-full items-center justify-center" style={{ height: 76, backgroundColor: "#F8FAFC", borderTopLeftRadius: 0, borderTopRightRadius: 0 }}>
              <View style={{width: 46, height: 46, borderRadius: 23, backgroundColor: '#EEF2FF', alignItems: 'center', justifyContent: 'center'}}>
                <Text style={{ fontSize: 22 }}>🏥</Text>
              </View>
            </View>

            <View className="p-3">
              <View className="flex-row justify-between items-start">
                <View style={{flex: 1, paddingRight: 6}}>
                  <Text className="text-sm font-semibold text-gray-900" numberOfLines={1}>
                    {pharmacy.Name || pharmacy.name}
                  </Text>
                  {!!(pharmacy.Address || pharmacy.address) && (
                    <Text className="text-[11px] text-gray-500 mt-1" numberOfLines={1}>
                      {pharmacy.Address || pharmacy.address}
                    </Text>
                  )}
                  {!!pharmacy.DistanceKM && (
                    <Text className="text-[11px] text-gray-500 mt-1">
                      {(pharmacy.DistanceKM || 0).toFixed(1)} km away
                    </Text>
                  )}
                </View>
                <View style={{backgroundColor: '#FEF3C7', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 8}}>
                  <Text style={{fontSize: 11, color: '#92400E'}}>⭐ 4.5</Text>
                </View>
              </View>

              <View className="flex-row justify-between mt-3">
                <TouchableOpacity
                  style={{flex: 1, marginRight: 6, backgroundColor: '#EEF2FF', borderRadius: 10, paddingVertical: 8, alignItems: 'center'}}
                  onPress={() => {
                    const phone = (pharmacy.Phone || pharmacy.phone || '').toString();
                    if (phone) Linking.openURL(`tel:${phone}`);
                  }}
                >
                  <Text style={{color: '#4338CA', fontWeight: '600'}}>📞 Call</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={{flex: 1, marginLeft: 6, backgroundColor: '#ECFDF5', borderRadius: 10, paddingVertical: 8, alignItems: 'center'}}
                  onPress={() => {
                    const lat = pharmacy.Latitude ?? pharmacy.latitude;
                    const lon = pharmacy.Longitude ?? pharmacy.longitude;
                    if (typeof lat === 'number' && typeof lon === 'number') {
                      Linking.openURL(`https://www.google.com/maps/search/?api=1&query=${lat},${lon}`);
                    } else {
                      const q = encodeURIComponent(`${pharmacy.Name || pharmacy.name}`);
                      Linking.openURL(`https://www.google.com/maps/search/?api=1&query=${q}`);
                    }
                  }}
                >
                  <Text style={{color: '#065F46', fontWeight: '600'}}>🗺️ Map</Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </View>

      {/* See More bottom-right */}
      {pharmacies.length > 2 && (
        <View className="px-4 mb-2" style={{alignItems: 'flex-end'}}>
          <TouchableOpacity onPress={() => setShowAllNearby(!showAllNearby)}>
            <Text className="text-blue-600 font-semibold">{showAllNearby ? 'See Less' : 'See More'}</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Upload Section */}
      <View className="px-5 mt-2">
        <Text className="text-lg font-bold text-center mb-1">Upload Prescription</Text>
        <Text className="text-xs text-gray-600 text-center mb-3">
          We will recommend the best pharmacy for your need.
        </Text>

        <View
          className="bg-white rounded-2xl p-4 mb-4"
          style={{ borderWidth: 1, borderColor: "#E5E5E5" }}
        >
          {uploadedPreview ? (
            <View>
              <Text className="text-sm font-medium text-gray-700 mb-2">Preview</Text>

              {(uploadedPreview.url || uploadedPreview.base64) &&
              isImageMime(uploadedPreview.mimeType) ? (
                <Image
                  source={{
                    uri: uploadedPreview.url
                      ? uploadedPreview.url
                      : `data:${uploadedPreview.mimeType};base64,${uploadedPreview.base64}`,
                  }}
                  style={{ width: "100%", height: 150, borderRadius: 8 }}
                  resizeMode="cover"
                />
              ) : (
                <View className="items-center justify-center py-10">
                  <Text style={{ fontSize: 40 }}>📎</Text>
                  <Text
                    className="text-xs mt-1 text-gray-600"
                    numberOfLines={1}
                  >
                    {uploadedPreview.fileName}
                  </Text>
                </View>
              )}
            </View>
          ) : (
            <View className="flex-row justify-evenly">
              <TouchableOpacity
                className="items-center"
                onPress={() => !uploading && setShowLinkModal(true)}
              >
                <Text style={{ fontSize: 36 }}>🔗</Text>
                <Text className="text-sm mt-1 font-medium">Add Link</Text>
              </TouchableOpacity>

              <TouchableOpacity
                className="items-center"
                onPress={handlePickAndUploadFile}
              >
                <Text style={{ fontSize: 34 }}>📄</Text>
                <Text className="text-sm mt-1 font-medium">Add File</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Continue Button */}
        <TouchableOpacity
          onPress={handleContinueUpload}
          disabled={!uploadedPreview || uploading}
          className="rounded-xl py-4 mb-4"
          style={{
            backgroundColor: uploadedPreview ? "#059669" : "#9CA3AF",
          }}
        >
          <Text className="text-white text-center text-base font-semibold">
            Continue
          </Text>
        </TouchableOpacity>

      </View>
    </ScrollView>

    {/* Uploading overlay */}
    <Modal visible={uploading} transparent animationType="fade">
      <View style={{flex: 1, backgroundColor: 'rgba(0,0,0,0.25)', justifyContent: 'center', alignItems: 'center'}}>
        <View style={{backgroundColor: 'white', borderRadius: 12, padding: 16, minWidth: 200, alignItems: 'center'}}>
          <ActivityIndicator size="large" color="#00A8A8" />
         
         {progressText && <Text style={{marginTop: 12, color: '#333', fontWeight: '600'}}>{progressText || 'Please wait...'}</Text>}
        </View>
      </View>
    </Modal>

    {/* Slide-in success toast */}
    <Animated.View style={{position: 'absolute', top: 12, left: 16, right: 16, transform: [{translateY: toastY}]}}>
      <View style={{backgroundColor: '#16A34A', borderRadius: 10, paddingVertical: 10, paddingHorizontal: 14, shadowColor: '#000', shadowOpacity: 0.15, shadowOffset: {width:0, height:2}, shadowRadius: 6, elevation: 3}}>
        <Text style={{color: 'white', fontWeight: '700'}}>Successfully uploaded</Text>
      </View>
    </Animated.View>

    {/* Add Hospital Modal */}
    <Modal
      visible={showAddHospitalModal}
      transparent
      animationType="slide"
      onRequestClose={() => setShowAddHospitalModal(false)}
    >
      <View style={{flex: 1, backgroundColor: 'rgba(0,0,0,0.35)', justifyContent: 'center', padding: 16}}>
        <View style={{backgroundColor: 'white', borderRadius: 12, padding: 16}}>
          <Text style={{fontWeight: 'bold', fontSize: 16, marginBottom: 10}}>Add Hospital</Text>
          {[
            {label: 'Name', key: 'name'},
            {label: 'Address', key: 'address'},
            {label: 'City', key: 'city'},
            {label: 'State', key: 'state'},
            {label: 'Country', key: 'country'},
            {label: 'Latitude', key: 'latitude'},
            {label: 'Longitude', key: 'longitude'},
            {label: 'Phone', key: 'phone'},
          ].map(({label, key}) => (
            <View key={key} style={{marginBottom: 8}}>
              <Text style={{fontSize: 12, marginBottom: 4, color: '#444'}}>{label}</Text>
              <TextInput
                value={String(newHospital[key] ?? '')}
                onChangeText={(t) => setNewHospital((p) => ({...p, [key]: t}))}
                keyboardType={(key==='latitude' || key==='longitude') ? 'numeric' : 'default'}
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
                  const payload = {
                    name: newHospital.name,
                    address: newHospital.address,
                    city: newHospital.city,
                    state: newHospital.state,
                    country: newHospital.country,
                    latitude: parseFloat(newHospital.latitude) || 0,
                    longitude: parseFloat(newHospital.longitude) || 0,
                    phone: newHospital.phone,
                  };
                  console.log('Create hospital (final payload):', payload);
                  const created = await PharmacyService.createPharmacy(payload);
                  console.log('Hospital created:', created);
                  setShowAddHospitalModal(false);
                  setNewHospital({name:'',address:'',city:'',state:'',country:'',latitude:'',longitude:'',phone:''});
                  if (currentCoords) {
                    await loadNearby(currentCoords.latitude, currentCoords.longitude);
                  } else {
                    await initLocationAndNearby();
                  }
                } catch (e) {
                  console.error('Create hospital error:', e);
                  RNAlert.alert('Error', e?.message || 'Failed to create hospital');
                }
              }}
              style={{padding: 10}}
            >
              <Text style={{color: '#2563EB', fontWeight: '600'}}>Save</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  </View>
);

};

export default PharmacyNearbyScreen;
