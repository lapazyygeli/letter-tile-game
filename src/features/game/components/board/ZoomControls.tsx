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
        className='text-gamearea-card-text ring-gamearea-card-border bg-gamearea-bg h-10 w-10 cursor-pointer rounded-full text-lg font-bold shadow ring-1'
      >
        +
      </button>
      <button
        type='button'
        onClick={onZoomOut}
        className='text-gamearea-card-text ring-gamearea-card-border bg-gamearea-bg h-10 w-10 cursor-pointer rounded-full text-lg font-bold shadow ring-1'
      >
        −
      </button>
    </div>
  )
}
