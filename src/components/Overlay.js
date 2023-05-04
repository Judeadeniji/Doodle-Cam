import { Stream, cameraSettings } from "../engine/camera"
import { showLastImage } from "../engine/indexDB"
import View from "./CameraView";
import { showGallery } from "../App";
import { fetchImagesFromDB } from "./Gallery"

const Utils = Stream();
function Overlay() {
 return (
<div className="flex flex-col h-screen">
  <TopBar />
    <View stream={Utils.init} zoomer={Utils.handleZoomChange} />
  <BottomBar />
</div>
  )
}

function TopBar() {

  return (
<div className="flex items-center justify-between py-1 px-2 bg-black backdrop-opacity-80">
    <div className="flex items-center justify-between">
      <button className={`m-1 h-10 w-10 rounded-full text-white hover:bg-white
      hover:text-black font-extrabold text-xl`}
      on:click={Utils.togglePortrait}>
        <span className="bi bi-aspect-ratio"></span>
      </button>
    </div>
    <div className="text-xl font-medium text-white">Camera</div>
    <div className="flex items-center justify-between">
      <button className={`m-1 h-10 w-10 rounded-full font-extrabold text-xl
      ${cameraSettings().flash ? 'bg-white text-black' : 'bg-transparent text-white'}`}
      on:click={Utils.toggleFlash}>
      <span className="bi bi-lightning-fill"></span>
    </button>
    </div>
  </div>
    )
}

function BottomBar() {
  return (
   <div className="flex flex-col items-center justify-between pt-8 pb-2 bg-black">
   <div className="w-full mx-auto flex items-center
   justify-evenly px-10">
      <div>
      <button className="m-1 h-10 w-10 rounded-full border-2 border-white
      font-bold text-2xl text-white" on:click={Utils.switchCamera}>
        <span className="bi bi-arrow-repeat"></span>
      </button>
      </div>
    <button className="h-16 w-16 bg-gray-200 rounded-full border-4 border-white
    hover:bg-blue-500 transition-all duration-200" on:click={Utils.capturePhoto}>
    </button>
<div className="">
  <img className="m-1 h-10 w-10 rounded-full border-2 border-white
  object-cover"
    bind:this={showLastImage}  src=""  on:click={async () =>{
    await fetchImagesFromDB()
    await showGallery.set(true)
    }} />
</div>

   </div>
   
    <div className="flex items-center mt-8">
      <div className="rounded-full text-white px-3 py-1 mr-4">
        Portrait
      </div>
      <div className="rounded-full bg-gray-200 text-black px-3 py-1 mr-4">
        Photo
      </div>
      <div className="rounded-full text-white px-3 py-1">
        Video
      </div>
    </div>
  </div>
    )
}

export default Overlay