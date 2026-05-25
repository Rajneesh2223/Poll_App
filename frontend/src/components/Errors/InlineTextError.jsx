import React from 'react'

function InlineTextError({mutation}) {
  return (
     <p className="text-red-500 text-sm md:text-base">
              😵 {mutation?.error?.response?.data?.errors?.[0]?.message || mutation?.error?.response?.data?.message || "An unexpected error occurred"}
            </p>
  )
}

export default InlineTextError
