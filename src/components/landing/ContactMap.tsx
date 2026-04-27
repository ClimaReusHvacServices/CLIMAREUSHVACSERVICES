import React from "react";

export default function ContactMap() {
  return (
    <div className="w-full h-64 md:h-96 rounded-lg overflow-hidden shadow-md bg-gray-50">
      <div className="h-full w-full" dangerouslySetInnerHTML={{__html: `
        <div style="height:100%;width:100%;position:relative;display:flex;justify-content:center;align-items:center;overflow:hidden;border-radius:15px"><iframe style="height:100%;width:100%;border:0" src="https://maps.google.com/maps?q=41.15217014284379%2C%201.1088681222453698&amp;z=15&amp;output=embed" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe></div>
      `}} />
    </div>
  );
}
