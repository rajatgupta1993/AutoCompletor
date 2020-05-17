import React from "react";

export default function AutoCompletorRow({movie, id, hoveredId}) {
  return <div className={"search-result-row" + (hoveredId ===id? ' selected': ' ')} id={id}>{movie.Title}</div>;
}
