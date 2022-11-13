#!/bin/sh

FILE1=../scss/mockstyle.scss
FILE2=./mockstyle_inkscape.css

cd "$(dirname "$(readlink -f "$0")")"
echo "Generating $FILE1"
npx xslt3 "-s:m3.xml" "-xsl:generate_css.xslt" "-o:$FILE1"
echo "Generating $FILE2"
npx xslt3 "-im:inkscape" "-s:m3.xml" "-xsl:generate_css.xslt" "-o:$FILE2"
