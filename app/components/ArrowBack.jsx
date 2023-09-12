import React from 'react'

const ArrowBack = ({data}) => {
  return (
    <span
                    onClick={() => data("")}
                    className="arrowBack material-symbols-outlined"
                  >
                    arrow_back
                  </span>
  )
}

export default ArrowBack