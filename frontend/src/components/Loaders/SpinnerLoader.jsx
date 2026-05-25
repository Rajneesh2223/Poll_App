import React from 'react'

function SpinnerLoader({size = "sm"}) {
  return (
    <span className={`loading loading-spinner loading-${size}`}></span>
  )
}

export default SpinnerLoader
