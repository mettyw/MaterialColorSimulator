#!/bin/sh

FILE1=../scss/mockstyle.scss
FILE2=./mockstyle_inkscape.css
FILE3=../js/colorMap.js

cd "$(dirname "$(readlink -f "$0")")"
echo "Generating $FILE1"
npx xslt3 "-s:m3.xml" "-xsl:generate_css.xslt" "-o:$FILE1"
echo "Generating $FILE2"
npx xslt3 "-im:inkscape" "-s:m3.xml" "-xsl:generate_css.xslt" "-o:$FILE2"
echo "Generating $FILE3"
npx xslt3 "-im:javascript" "-s:m3.xml" "-xsl:generate_css.xslt" "-o:$FILE3"
