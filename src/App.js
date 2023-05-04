import { createData, If, memo } from "brace-js"
import Overlay from "./components/Overlay"
import { Gallery, ImagePreview } from "./components/Gallery"

const showAlert = createData(false);
export const showGallery = createData(false)
export const showPreview = createData({
  isShowing: false,
  currentImage: {src:'',id:null},
  imageList: []
})

const MemoOverlay = memo(Overlay)

const AlertModal = memo(function Alert() {
  const animation = {
    keyframes: [
      {
        opacity: 0.5,
        transform: "translateY(-30px)"
      },
      {
        opacity: 0.7,
        transform: "translateY(20px)"
      },
      {
        opacity: 1,
        transform: "translateY(0)"
      },
      ],
    options: {
      fill: 'forwards',
      duration: 250,
      easing: 'linear'
    }
  }
  const colorRed = {color: 'red'}
  return (
    <div animate={animation} className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-gray-900 bg-opacity-70 z-50">
      <div className="bg-white rounded-lg overflow-hidden w-11/12 md:max-w-md">
        <div className="flex justify-between items-center p-4 border-b">
          <p className="text-sm w-full text-red-600 font-bold text-center
          self-center" style={colorRed}>Warning!</p>
        </div>

        <div className="p-4 border-b border-gray-300 font-semibold text-gray-700 md:px-6">
          <p className="mb-2 text-sm">The Gallery app is currently experiencing instability issues. Some features may not work properly.</p>
          <p className="text-sm">Additionally, there is no delete button available to remove images from the gallery.</p>
        </div>

        <div className="flex justify-end p-4">
          <button style={colorRed} className="bg-white text-red-600 font-bold rounded-lg w-full h-full" on:click={() => showAlert.set(false)}>Close</button>
        </div>
      </div>
    </div>
  );
});

function App() {
  return (
    <div>
      <If eval={showPreview().isShowing}>
      <ImagePreview {...showPreview()} />
      </If>
      <MemoOverlay />
      <If eval={showGallery()}>
        <Gallery/>
      </If>
      <If eval={showAlert()}>
        <AlertModal />
      </If>
    </div>
  );
}

setTimeout(() => showAlert.set(true), 1500)

export default App;
