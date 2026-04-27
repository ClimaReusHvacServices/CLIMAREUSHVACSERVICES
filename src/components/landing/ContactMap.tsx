import React from "react";

export default function ContactMap() {
  return (
    <div className="w-full h-80 md:h-96 rounded-lg overflow-hidden shadow-md">
      <div className="h-full w-full" dangerouslySetInnerHTML={{__html: `
        <div class="framer-13bk3ql" data-framer-name="Container"><div class="framer-1uvddye-container" style="will-change: transform; opacity: 1; transform: none;"><div borderradius="15" bottomleftradius="15" bottomrightradius="15" height="100%" id="yMnumgKUG" topleftradius="15" toprightradius="15" width="100%" style="height:100%;width:100%;position:relative;display:flex;justify-content:center;align-items:center;overflow:hidden;border-radius:15px"><iframe style="height:100%;width:100%;border:0" src="https://maps.google.com/maps?q=41.15217014284379%2C%201.1088681222453698&amp;z=15&amp;output=embed"></iframe></div></div></div>
      `}} />
    </div>
  );
}
