// engine/indexDB.js
import { createData } from "brace-js";

const prevImage = createData('');
let previewEl;
const dbName = 'doddleCam';
const dbVersion = 1;
let db;

function connectToDatabase() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(dbName, dbVersion);
    request.onerror = (event) => {
      reject(event.target.error);
    };
    request.onsuccess = (event) => {
      db = event.target.result;
      resolve(db);
    };
    request.onupgradeneeded = (event) => {
      db = event.target.result;
      db.createObjectStore('images', { keyPath: 'id', autoIncrement: true });
    };
  });
}

export async function saveImage(imageData) {
  // Convert base64 string to ArrayBuffer
  const byteString = atob(imageData.split(',')[1]);
  const buffer = new ArrayBuffer(byteString.length);
  const view = new Uint8Array(buffer);
  for (let i = 0; i < byteString.length; i++) {
    view[i] = byteString.charCodeAt(i);
  }

  // Create a blob from ArrayBuffer
  const blob = new Blob([buffer], { type: 'image/jpeg' });

  // Get database connection
  const db = await connectToDatabase();

  // Save image to IndexedDB
  const id = Date.now();
  const image = { id, data: blob };
  const tx = db.transaction('images', 'readwrite');
  const store = tx.objectStore('images');
  await store.add(image);
  await tx.complete;
  await prevImage.set(imageData);
  console.log(`Image saved with id: ${id}`);
  if(previewEl) {
    previewEl.src = prevImage();
  }
}

export async function getAllImages() {
  // Get database connection
  const db = await connectToDatabase();

  const tx = db.transaction('images', 'readonly');
  const store = tx.objectStore('images');
  const images = await store.getAll();
  return images;
}

export async function getImageById(id) {
  // Get database connection
  const db = await connectToDatabase();

  const tx = db.transaction('images', 'readonly');
  const store = tx.objectStore('images');
  const image = await store.get(id);
  return image;
}

export async function showLastImage(element) {
  previewEl = element
  // Get database connection
  const db = await connectToDatabase();

  const tx = db.transaction('images', 'readonly');
  const store = tx.objectStore('images');
  const request = store.getAll();

  request.onsuccess = function(event) {
    const images = event.target.result;
    const lastImage = images[images.length - 1];
    if (lastImage) {
      const imageData = lastImage.data;
      const blob = new Blob([imageData], { type: 'image/jpeg' });
      const imageUrl = URL.createObjectURL(blob);
      prevImage.set(imageUrl)
      element.src = prevImage();
    }
  };
}