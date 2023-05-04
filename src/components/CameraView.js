function View({ stream, zoomer }) {
  return (
  <div className="flex-grow flex items-center justify-center relative">
    <video className="bg-black h-full w-full" autoplay bind:this={stream} />
   <div className="absolute zoomCtn">
     <span className="bi bi-search font-extrabold text-xl text-white" />
     <input className="" type="range" min="0" max="100" step="0.01"
      value="0" bind:input={zoomer}/>
   </div>
  </div>
    )
}


export default View