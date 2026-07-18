// Mock Google Drive backups using localStorage for the demo version to avoid Firebase domain auth errors
let isSigningIn = false;
let cachedAccessToken = null;

export const auth = {
  currentUser: { displayName: "Demo User", email: "demo@gmail.com" }
};

export const initAuth = (onAuthSuccess, onAuthFailure) => {
  // Simulating no automatic Google Drive session on load unless cached
  const savedToken = localStorage.getItem("bizpilot_gd_token");
  const savedUser = localStorage.getItem("bizpilot_gd_user");
  if (savedToken && savedUser) {
    cachedAccessToken = savedToken;
    setTimeout(() => {
      if (onAuthSuccess) onAuthSuccess(JSON.parse(savedUser), savedToken);
    }, 0);
  } else {
    setTimeout(() => {
      if (onAuthFailure) onAuthFailure();
    }, 0);
  }
  // Return mock unsubscribe function
  return () => {};
};

export const googleSignIn = async () => {
  cachedAccessToken = "mock-google-drive-demo-token";
  const user = { displayName: "Demo User", email: "demo@gmail.com" };
  localStorage.setItem("bizpilot_gd_token", cachedAccessToken);
  localStorage.setItem("bizpilot_gd_user", JSON.stringify(user));
  return { user, accessToken: cachedAccessToken };
};

export const googleSignOut = async () => {
  cachedAccessToken = null;
  localStorage.removeItem("bizpilot_gd_token");
  localStorage.removeItem("bizpilot_gd_user");
};

export const getAccessToken = () => {
  return cachedAccessToken;
};

// Mock Google Drive APIs using localStorage
const getMockDriveBackups = () => {
  const backups = localStorage.getItem("bizpilot_mock_gd_backups");
  return backups ? JSON.parse(backups) : [];
};

const saveMockDriveBackups = (backups) => {
  localStorage.setItem("bizpilot_mock_gd_backups", JSON.stringify(backups));
};

export const getOrCreateFolder = async (accessToken, folderName = "BizPilot Backups") => {
  return "mock-folder-id-12345";
};

export const uploadBackupFile = async (accessToken, folderId, filename, content) => {
  const backups = getMockDriveBackups();
  const newBackup = {
    id: "mock-file-" + Date.now(),
    name: filename,
    size: JSON.stringify(content).length,
    createdTime: new Date().toISOString(),
    content: content
  };
  backups.unshift(newBackup);
  saveMockDriveBackups(backups);
  return newBackup;
};

export const listBackupFiles = async (accessToken, folderId) => {
  const backups = getMockDriveBackups();
  // return metadata list compatible with Backups.jsx
  return backups.map(b => ({
    id: b.id,
    name: b.name,
    size: b.size,
    createdTime: b.createdTime
  }));
};

export const downloadBackupContent = async (accessToken, fileId) => {
  const backups = getMockDriveBackups();
  const backup = backups.find(b => b.id === fileId);
  if (!backup) throw new Error("File not found in Mock Google Drive");
  return backup.content;
};

export const deleteBackupFile = async (accessToken, fileId) => {
  let backups = getMockDriveBackups();
  backups = backups.filter(b => b.id !== fileId);
  saveMockDriveBackups(backups);
  return true;
};
