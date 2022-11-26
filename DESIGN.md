
# Design

## Terminology
* development time - editing of the code
* build time - processing of the repo data by scripts and webpack in oder to provide a deployed version of the code
* run time - execution of the deployed website in a browser


## Runtime - Editable Colors in SVG Mockups

![Alt text](./doc/editable-mockup-colors.svg)

* phone mockups are drawn as SVG images
* the SVGs are made inline in order to share the website's CSS
* each themable item in the SVG has a CSS class (e.g. button-filled-container)
* the CSS class uses CSS variables
* color picker changes the value of the CSS variables
* the map of colors is transformed to Android XML files for export 

## Runtime - Filters

* some CSS classes reference filters for elevation and shadow
* the filters are defined in index.html in an SVG
* due to inlining of the mockup SVGs the filter URL is accessible

## Build time - Generation of color data (CSS + Javascirpt)

* Material Components are defined via own XML in m3.xml
* CSS and JS is generated from m3.xml via generate_css.xslt
* 3 files are generated (via different XSLT modes)
  * mockstyle_inkscape.css (CSS used for Inkscape editing as Inkscape has some limitations regarding CSS support)
  * mockstyle.scss (CSS used at runtime from the website)
  * colorMap.js (Javascript map used at runtime as data structure for the colors)

## Development time - Inkscape Editing
* in-repo SVG files contain a &lt;style&gt; reference to mockstyle_inkscape.css
* this file is being used by Inkscape when editing the SVG
* the file mockstyle_inkscape.css has some simplifications compared to the runtime mockstyle.scss. (e.g. no CSS variables and no rgba transparency support) - it is purely used to provide a comfortable editing experience
* at build time the &lt;style&gt; is removed by webpack

