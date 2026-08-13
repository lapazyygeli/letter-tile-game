import { ZoomControls } from './ZoomControls'

export function Board() {
  const world = {
    origin: {
      x: 0,
      y: 0,
    },
    zoom: 1,
  }

  return (
    <div className='relative h-full w-full'>
      <div
        className={`absolute top-1/2 left-1/2`}
        style={{
          transform: `translate(${world.origin.x}px, ${world.origin.y}px) scale(${world.zoom})`,
        }}
      >
        <span className='bg-red-700'>Hi there</span>
      </div>
      <ZoomControls onZoomIn={() => {}} onZoomOut={() => {}} />
    </div>
  )
}
