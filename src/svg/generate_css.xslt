<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
                xmlns:xs="http://www.w3.org/2001/XMLSchema"
                xmlns:array="http://www.w3.org/2005/xpath-functions/array"
                xmlns:map="http://www.w3.org/2005/xpath-functions/map"
                xmlns:math="http://www.w3.org/2005/xpath-functions/math"
                xmlns:fn="http://foo.bar"
                exclude-result-prefixes="#all"
                expand-text="yes"
                version="3.0">
  
  <xsl:output method="text" indent="yes"/>
  <xsl:strip-space elements="*"/>
  
  <xsl:function name="fn:hex-to-dec" as="xs:integer">
    <xsl:param name="hex" as="xs:string" />
    <xsl:variable name="digit"
      select="string-length(substring-before('0123456789ABCDEF', upper-case(substring($hex,1,1))))"/>
    <xsl:variable name="remainder"
      select="substring($hex,2)"/>
    <xsl:value-of select="
      if (string-length($remainder) eq 0)
        then $digit
      else 16*$digit + fn:hex-to-dec($remainder)
                    " />
  </xsl:function>
  
  <xsl:function name="fn:hex-to-rbgstring" as="xs:string">
    <xsl:param name="hex" as="xs:string" />
    <xsl:variable name="red" as="xs:string" 
      select="substring($hex, 2, 2)"/>
    <xsl:variable name="green" as="xs:string" 
      select="substring($hex, 4, 2)"/>
    <xsl:variable name="blue" as="xs:string" 
      select="substring($hex, 6, 2)"/>
    <xsl:text>{fn:hex-to-dec($red)}, {fn:hex-to-dec($green)}, {fn:hex-to-dec($blue)}</xsl:text>
  </xsl:function>
  
  <xsl:function name="fn:lookup-color" as="xs:string">
    <xsl:param name="root"  />
    <xsl:param name="name" as="xs:string" />
    <xsl:value-of select="
      if ($name eq 'colorTransparent') 
        then 'none'
      else $root/style/colors/color[@name = $name]/@value
                    "/>
  </xsl:function>
  
  <xsl:template match="/style/colors" mode="#default">
    <xsl:text>:root {{&#10;</xsl:text> 
    <xsl:for-each select="color">
      <xsl:text>  --{@name}: {@value};&#10;</xsl:text> 
      <xsl:text>  --{@name}-rgbstr: {fn:hex-to-rbgstring(string(@value))};&#10;</xsl:text> 
    </xsl:for-each>
    <xsl:text>  --colorTransparent : none;&#10;</xsl:text> 
    <xsl:text>}}&#10;</xsl:text> 
    <xsl:text>&#10;</xsl:text> 
  </xsl:template>
  
  <xsl:template match="/style/classes" mode="#default">
    <xsl:text>/* generated with generate_css.xslt */&#10;</xsl:text>
    <xsl:text>&#10;</xsl:text>
    <xsl:for-each select="class">
      <xsl:text>.{@name} {{&#10;</xsl:text> 
      <xsl:if test="@fill">
        <xsl:choose>
          <!-- FIXME overlay https://m3.material.io/styles/color/the-color-system/color-roles -->
          <xsl:when test="@fill-opacity">
            <xsl:text> fill: rgba(var(--{@fill}-rgbstr), {1 - @fill-opacity div 100});&#10;</xsl:text> 
          </xsl:when>
          <xsl:otherwise>
            <xsl:text> fill: var(--{@fill});&#10;</xsl:text> 
          </xsl:otherwise>
        </xsl:choose>
      </xsl:if>
      <xsl:if test="@stroke">
        <xsl:choose>
          <xsl:when test="@stroke-opacity">
            <!--
                 This is an uncommon solution. Objective is to combine the hex color value
                 from @stroke with an alpha value from @stroke-opacity. In SCSS this would 
                 be simple. However, we need this to work in the browser with dynamically
                 changing color values. Thus, we need a pure CSS solution. 
                 Essentially we store @stroke a second time as {@stroke}-rgbstr, but in the 
                 form of a decimal rgb triplet. This can be combined with the opacity and 
                 fed into the rgba() function. The variable {@stroke}-rgbstr here contributes
                 the first three arguments for the rgba() function. This only works because
                 CSS variable expansion is being done before the function parsing.
            -->
            <xsl:text> stroke: rgba(var(--{@stroke}-rgbstr), {1 - @stroke-opacity div 100});&#10;</xsl:text> 
          </xsl:when>
          <xsl:otherwise>
            <xsl:text> stroke: var(--{@stroke});&#10;</xsl:text> 
          </xsl:otherwise>
        </xsl:choose>
        <xsl:text> stroke-width : 0.5;&#10;</xsl:text> 
      </xsl:if>
      <xsl:if test="@tint">
        <xsl:choose>
          <!-- FIXME this is wrong -->
          <xsl:when test="@tint-opacity">
            <xsl:text> fill: rgba(var(--{@tint}-rgbstr), {1 - @tint-opacity div 100});&#10;</xsl:text> 
          </xsl:when>
          <xsl:otherwise>
            <xsl:text> fill: var(--{@tint});&#10;</xsl:text> 
          </xsl:otherwise>
        </xsl:choose>
      </xsl:if>
      <xsl:choose>
        <!-- Elevation is 0, 1, 3, 6, 8, 12 dp
             see https://m3.material.io/styles/elevation/tokens -->
        <xsl:when test="@elevation eq '1'">
          <xsl:text> filter: url("#elevation-1");&#10;</xsl:text> 
        </xsl:when>
        <xsl:when test="@elevation eq '2'">
          <xsl:text> filter: url("#elevation-2");&#10;</xsl:text> 
        </xsl:when>
        <xsl:when test="@elevation eq '3'">
          <xsl:text> filter: url("#elevation-4");&#10;</xsl:text> 
        </xsl:when>
        <xsl:when test="@elevation eq '4'">
          <xsl:text> filter: url("#elevation-3");&#10;</xsl:text> 
        </xsl:when>
        <xsl:when test="@elevation eq '5'">
          <!--                   <xsl:text> filter: drop-shadow(0px 2px 3px rgb(0 0 0 / 0.3));&#10;</xsl:text>  -->
          <xsl:text> filter: url("#elevation-5");&#10;</xsl:text> 
        </xsl:when>
        <xsl:when test="@elevation eq '6'">
          <!--                   <xsl:text> filter: drop-shadow(0px 3px 3px rgb(0 0 0 / 0.3));&#10;</xsl:text>  -->
          <xsl:text> filter: url("#elevation-6");&#10;</xsl:text> 
        </xsl:when>
      </xsl:choose>
      <xsl:text>}}&#10;</xsl:text> 
      <xsl:text>&#10;</xsl:text> 
    </xsl:for-each>
  </xsl:template>
  
  <xsl:template match="/style/classes" mode="inkscape">
    <xsl:text>/* generated with generate_css.xslt */&#10;</xsl:text>
    <xsl:text>&#10;</xsl:text>
    <xsl:for-each select="class">
      <xsl:text>.{@name} {{&#10;</xsl:text> 
      <xsl:if test="@fill">
        <xsl:choose>
          <!-- inkscape cannot handle rgba(.), so we generate crude grayscale colors to tell things apart visually at least -->
          <xsl:when test="@fill-opacity < 50">
            <xsl:text> fill: #222222;&#10;</xsl:text> 
          </xsl:when>
          <xsl:when test="@fill-opacity < 80">
            <xsl:text> fill: #888888;&#10;</xsl:text> 
          </xsl:when>
          <xsl:when test="@fill-opacity <= 100">
            <xsl:text> fill: #EEEEEE;&#10;</xsl:text> 
          </xsl:when>
          <xsl:otherwise>
            <xsl:text> fill: {fn:lookup-color(/,string(@fill))};&#10;</xsl:text> 
          </xsl:otherwise>
        </xsl:choose>
      </xsl:if>
      <xsl:if test="@stroke">
        <!-- no special handling of @stroke-opacity - Inkscape seems to have problems here with rgba() color-->
        <xsl:text> stroke: {fn:lookup-color(/,string(@stroke))};&#10;</xsl:text> 
        <xsl:text> stroke-width : 0.5;&#10;</xsl:text> 
      </xsl:if>
      <!-- for now @tint is identical to @fill -->
      <xsl:if test="@tint">
        <xsl:choose>
          <xsl:when test="@tint-opacity">
            <xsl:text> fill: rgba({fn:hex-to-rbgstring(fn:lookup-color(/, string(@tint)))}, {1 - @tint-opacity div 100});&#10;</xsl:text> 
          </xsl:when>
          <xsl:otherwise>
            <xsl:text> fill: {fn:lookup-color(/,string(@tint))};&#10;</xsl:text> 
          </xsl:otherwise>
        </xsl:choose>
      </xsl:if>
      <xsl:text>}}&#10;</xsl:text> 
      <xsl:text>&#10;</xsl:text> 
    </xsl:for-each>
  </xsl:template>
  
  <xsl:template match="/style/colors" mode="javascript">
    <xsl:text>/* generated with generate_css.xslt */&#10;</xsl:text>
    <xsl:text>const colorMap = {{&#10;</xsl:text>
    <xsl:for-each select="color">
      <xsl:if test="@label[. != 'internal' and . != 'unused'] ">
        
        <xsl:text>  {@name}: {{&#10;</xsl:text> 
        <xsl:text>    l: '{@label}',&#10;</xsl:text> 
        <xsl:text>    v: '{@value}',&#10;</xsl:text> 
        <xsl:text>  }},&#10;</xsl:text> 
      </xsl:if>
    </xsl:for-each>
    <xsl:text>}};&#10;</xsl:text> 
    <xsl:text>&#10;</xsl:text> 
    <xsl:text>export default colorMap;&#10;</xsl:text> 
  </xsl:template>
  
  
  
  
  
</xsl:stylesheet>