import { createData, For, Suspense } from "brace-js";
import { getAllImages, getImageById } from "../engine/indexDB";
import { showGallery, showPreview } from "../App";

const images$ = createData([]);

export const fetchImagesFromDB = async () => {
 await new Promise((resolve, reject) => {
    getAllImages().then(response => {
    response.onsuccess = function () {
      const images = response.result;
      if (Boolean(images.length)) {
        images$.set(images);
        resolve(images);
      } else {
        resolve("")
      }
    }
    }).catch(error => {
      reject(error);
    });
  });
}

const ImageList = async () => {
  if (!Boolean(images$().length)) {
     await fetchImagesFromDB();
  }
  return (
    <For each={images$()?.reverse()}>
      {(picture, index) => {
      const imageData = picture.data;
      const blob = new Blob([imageData], { type: 'image/jpeg' });
      const imageUrl = URL.createObjectURL(blob);
      return (
        <div class="bg-gray-200 h-48 w-28 flex items-center justify-center"
        on:click={() => showPreview.set({
          isShowing: true,
          currentImage: {src: imageUrl, id: picture.id},
          imageList: images$().reverse()
        })}>
          <img loading="lazy"
            src={imageUrl}
            alt={picture.id+index}
            key={picture.id}
            className="w-full h-48 object-cover"
          />
        </div>
      )}}
    </For>
  );
};

export function ImagePreview({currentImage, imageList}) {
  return (
    <div className="fixed top-0 left-0 w-full h-full flex items-center
    justify-center z-40 backdrop-blur-sm bg-black bg-opacity-75"
    on:click={() => showPreview.update(prev => ({...prev, isShowing: false, imageList: []}))}>
      <div className="relative w-80 h-3/4 max-w-4xl max-h-4xl">
        <div className="h-full flex items-center justify-center">
          <img loading="lazy" className="w-full h-full object-contain rounded-lg shadow-lg"
          src={currentImage.src} alt="Large Image"
          on:click={null}/>
          {/*<div className="absolute inset-0 flex items-center justify-center">
            <button className="bg-gray-800 bg-opacity-50 text-white hover:text-gray-400 absolute top-1/2 transform -translate-y-1/2 left-0 w-12 h-12 rounded-full z-10 ml-4" id="prev-btn">
              <span className="bi bi-chevron-left w-6 h-6"></span>
              <span className="sr-only">Previous</span>
            </button>
            <button className="bg-gray-800 bg-opacity-50 text-white hover:text-gray-400 absolute top-1/2 transform -translate-y-1/2 right-0 w-12 h-12 rounded-full z-10 mr-4" id="next-btn">
              <span className="bi bi-chevron-right w-6 h-6"></span>
              <span className="sr-only">Next</span>
            </button>
          </div>*/}
        </div>
        <div className="mt-2 mb-5 flex justify-center overflow-y-visible
        overflow-x-scroll w-full scroll-smooth scroll-m-0">
         {imageList.reverse().map((picture, index) => {
      const imageData = picture.data;
      const blob = new Blob([imageData], { type: 'image/jpeg' });
      const imageUrl = URL.createObjectURL(blob);

     return (<img loading="lazy" className={`w-1/5 h-auto object-contain cursor-pointer border-2
      rounded-lg transform
      hover:scale-105 mx-1 ${picture.id === currentImage.id ? "border-red-600" :
      "border-gray-800 hover:border-gray-400"}`} src={imageUrl} alt={picture.id} key={index}
      on:click={() => showPreview.update(prev => ({...prev, currentImage:
      {src:imageUrl, id: picture.id}}))}/>) 
         })}
        </div>
      </div>
    </div>
  );
}

export function Gallery () {
  return (
<section className="flex flex-col-reverse z-20 h-screen w-full absolute top-0
left-0 bottom-0 right-0" style={{ backdropFilter: "blur(2px)" }} animate={{
  keyframes: [
    {transform: 'translateY(720px)'},
    {transform: 'translateY(0)'},
    {transform: 'translateY(-10px)'},
    {transform: 'translateY(0)'},
  ],
  options: {
    duration: 500,
    fill: 'forwards',
    easing: 'ease-out'
  }}} on:click={() => {
  showGallery.set(false)
  images$.set([])
}}>
  <div className="relative left-0 bottom-0 right-0 bg-white
  rounded-t-3xl justify-end" style={{ height: '90%' }} on:click={null}>
    <div className="w-full py-3 px-5 flex items-center justify-between font-extrabold text-2xl text-black">
      <span className="bi bi-chevron-down" on:click={() => {
      showGallery.set(false)
      images$.set([])
}} />
      <h3 className="font-bold" style={{ fontFamily: 'comic-sans-ms' }}>Gallery</h3>
      <span className="bi bi-check2-circle" />
    </div>
    <div className="bg-white py-6 self-start">
    <div className="w-full flex items-center justify-between
    font-extrabold text-lg text-black mt-2 rounded-3xl"
    style={{backgroundColor: '#a6a6a642', width: '93%', margin: 'auto',
    padding: '4px 10px'}}>
    <span className="bi bi-search font-extrabold text-xl" />
    <input type="date" placeholder="Search By Date" value="2023-05-02"
    className="w-full appearance-none bg-transparent font-bold text-gray-600
    outline-0 ml-1 text-center" />
    </div>
  </div>
    
<div class="flex flex-col md:flex-row md:flex-wrap gap-4">
  <div class="overflow-hidden flex-1 mx-auto w-full items-start">
    <div class="px-8 py-1 font-extrabold text-sm">
      May 2023
    </div>

  <div className="grid place-items-center h-full">
    <div class="flex flex-row justify-between items-center flex-wrap gap-x-0 gap-y-1 p-2 m-auto overflow-x-hidden overflow-y-scroll">
    <Suspense fallback={<h1>•••</h1>}>
      <ImageList />
    </Suspense>
    </div>
  </div>
</div>
</div>
  </div>
</section>
    )
}
