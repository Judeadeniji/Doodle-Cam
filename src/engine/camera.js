// engine/camera.js
import { createData } from "brace-js";
import { saveImage } from "./indexDB";

export const cameraSettings = createData({
  facingMode: 'user',
  aspectRatio: 3/4,
  flash: false,
  zoom: 1
});

export function Stream() {
  let video;
  let stream;
  let track;

  // Function to toggle the flash on/off
  function toggleFlash() {
   cameraSettings().flash === false ? cameraSettings.update(p => {
    return {
      ...p,
      flash: true
    }
  }) : cameraSettings.update(p => {
    return {
      ...p,
      flash: false
    }
  });
  
  track.applyConstraints({ advanced: [{ torch: cameraSettings().flash }] });
  return cameraSettings().flash
  }

  // Function to toggle between portrait and landscape mode
  function togglePortrait() {
  track.getSettings().aspectRatio === 3/4 ? cameraSettings.update(p => {
    return {
      ...p,
      aspectRatio: 4/3
    }
  }) : cameraSettings.update(p => {
    return {
      ...p,
      aspectRatio: 3/4
    }
  });
  track.applyConstraints({ aspectRatio: cameraSettings().aspectRatio });
  }

  // Function to switch between front and back camera
  async function switchCamera() {
  cameraSettings().facingMode === 'user' ? cameraSettings.update(p => {
    return {
      ...p,
      facingMode: 'environment'
    }
  }) : cameraSettings.update(p => {
    return {
      ...p,
      facingMode: 'user'
    }
  });
    // Stop the current stream and track
    video.srcObject = null;
    stream.getTracks().forEach(track => track.stop());

    // Request a new stream with the other camera
    const constraints = {
      video: { facingMode: cameraSettings().facingMode }
    };
    stream = await navigator.mediaDevices.getUserMedia(constraints);
    video.srcObject = stream;
    track = stream.getVideoTracks()[0];
  }
 
  // Function to apply the current zoom level
  function applyZoom() {
    track.applyConstraints({ advanced: [{ zoom: cameraSettings().zoom }] });
  }

  // Function to handle the zoom input range change event
  function handleZoomChange(event) {
    const minZoom = track.getCapabilities().zoom.min || 0;
    const maxZoom = track.getCapabilities().zoom.max || 100;
    const newZoom = (maxZoom - minZoom) * (event.target.value / 100) + minZoom;
    cameraSettings.update(p => {
      return {
        ...p,
        zoom: newZoom
    }
  });
  applyZoom();
}

  // Function to capture a photo from the video stream
  function capturePhoto() {
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const context = canvas.getContext('2d');
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    const dataUrl = canvas.toDataURL('image/png');
    saveImage(dataUrl);
  }


  // Request access to the camera stream
  function init(target) {
    video = target;
    navigator.mediaDevices.getUserMedia({ video: { facingMode:
    cameraSettings().facingMode } })
    .then(s => {
      stream = s;
      video.srcObject = stream;
      track = stream.getVideoTracks()[0];
//   (track.getCapabilities().zoom.max)
    })
    .catch(error => {
      console.error('Unable to access camera:', error);
    });
  }
    
    return {
      togglePortrait,
      toggleFlash,
      switchCamera,
      handleZoomChange,
      capturePhoto,
      init
    }
}
