# Future Ideas
* change real CSS class (via CSSOM?) instead of all fill properties in SVG - see https://stackoverflow.com/a/45210949 
* SVG enrichment
  * svg item (e.g. rect) contains CSS class for elevation / tint
  * Javascript enriches the SVG 
    * (e.g. with overlayed rect with tint color / elevation shadow via mixing CSS into it?)
    * needs more complex logic to map component click to desired color swatch on click
* detailed class injection from ID via mapping table
  * generate mapping table from andriod XML (component name/id -> CSS styles)
  * define ID naming scheme
    * button-filled-label
    * button-toggle-container (how to handle modifier enabled/disabled/selected?)
  * use IDs in SVG (i.e. postfixed with arbitrary numbers )
  * (or use a class)
  * process SVG with Javascript to set real classes
* support click / ripple color
* support additional syling like corner treatment (possible via CSS?)
* day and night theme - https://webdesign.tutsplus.com/tutorials/color-schemes-with-css-variables-and-javascript--cms-36989