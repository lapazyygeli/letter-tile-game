type ZoomControlsProps = {
  onZoomIn: () => void
  onZoomOut: () => void
}

export function ZoomControls({ onZoomIn, onZoomOut }: ZoomControlsProps) {
  return (
    <div
      data-pan-ignore
      className='absolute right-4 bottom-4 z-5 flex flex-col gap-2'
    >
      <button
        type='button'
        onClick={onZoomIn}
        className='h-10 w-10 cursor-pointer rounded-full bg-white text-lg font-bold text-amber-900 shadow ring-1 ring-amber-200'
      >
        +
      </button>
      <button
        type='button'
        onClick={onZoomOut}
        className='h-10 w-10 cursor-pointer rounded-full bg-white text-lg font-bold text-amber-900 shadow ring-1 ring-amber-200'
      >
        −
      </button>
    </div>
  )
}
