export interface VoiceRecordingState {
  isRecording: boolean;
  isPaused: boolean;
  duration: number;
  waveform: number[];
  blob: Blob | null;
  url: string | null;
}

export interface VoicePlaybackState {
  messageId: string;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  progress: number;
}

export interface VideoRecordingState {
  isRecording: boolean;
  duration: number;
  maxDuration: number;
  blob: Blob | null;
  url: string | null;
  thumbnailUrl: string | null;
  stream: MediaStream | null;
}

export interface MediaPreview {
  id: string;
  type: MediaPreviewType;
  file: File | Blob;
  url: string;
  thumbnailUrl: string | null;
  fileName: string;
  fileSize: number;
  mimeType: string;
  width?: number;
  height?: number;
  duration?: number;
  waveform?: number[];
}

export type MediaPreviewType = 'image' | 'video' | 'audio' | 'voice' | 'video_circle' | 'document';

export interface ImageDimensions {
  width: number;
  height: number;
}

export interface MediaUploadConfig {
  maxFileSize: number;
  allowedMimeTypes: string[];
  maxWidth?: number;
  maxHeight?: number;
  quality?: number;
}

export interface FileInfo {
  name: string;
  size: number;
  mimeType: string;
  extension: string;
  isImage: boolean;
  isVideo: boolean;
  isAudio: boolean;
  isDocument: boolean;
}

export interface WaveformData {
  peaks: number[];
  duration: number;
  sampleRate: number;
}

export interface CameraConstraints {
  video: {
    facingMode: 'user' | 'environment';
    width: { ideal: number };
    height: { ideal: number };
    frameRate: { ideal: number };
  };
  audio: boolean;
}

export interface DragDropState {
  isDragging: boolean;
  isOver: boolean;
  files: File[];
}

export const WAVEFORM_SAMPLES = 64;
export const VOICE_SAMPLE_RATE = 16000;
export const VIDEO_CIRCLE_SIZE = 240;
export const VIDEO_CIRCLE_MAX_DURATION = 60;
export const THUMBNAIL_SIZE = 320;
export const AVATAR_SIZE = 512;
export const AVATAR_THUMBNAIL_SIZE = 64;

export const IMAGE_COMPRESSION_QUALITY = 0.85;
export const THUMBNAIL_COMPRESSION_QUALITY = 0.6;
