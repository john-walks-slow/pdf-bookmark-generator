# PDF Bookmark XML Generator

Create bookmark.xml file from table of content.
You can then import the XML into PDF's bookmark with programs like foxit phantom pdf.

## Usage

`pdf-bm gen [options]`

```
Options:
  -V, --version             output the version number
  -i --input <path>         path to a text file containing toc (default: "toc.txt")
  -o --output <path>        output path (default: "bookmarks.xml")
  -s --offset <offsets...>  the beginning page for each page number scheme (separated by space) (default: ["1"])
  -h --fit-height           fit full height instead of full width when jumping (default: false)
```

## Example

`pdf-bm gen -i example.txt -o output.xml -s 1 6 `

example.txt:
```txt
Copyright ii
Foreword iv
Chapter One 1
  1.1 Introduction 2
    Reference
Chapter Two 58
Glossaries 253
```

output.xml
```xml
<?xml version="1.0" encoding="utf-8"?>
<BOOKMARKS>
  <ITEM NAME="Copyright" PAGE="2" FITETYPE="FitH" ZOOM="0" COLOR="0,0,0" STYLE="notbold,notitalic" ACTION="" Open="true" INDENT="0">
  </ITEM>
  <ITEM NAME="Foreword" PAGE="4" FITETYPE="FitH" ZOOM="0" COLOR="0,0,0" STYLE="notbold,notitalic" ACTION="" Open="true" INDENT="0">
  </ITEM>
  <ITEM NAME="Chapter One" PAGE="6" FITETYPE="FitH" ZOOM="0" COLOR="0,0,0" STYLE="notbold,notitalic" ACTION="" Open="true" INDENT="0">
    <ITEM NAME="1.1 Introduction" PAGE="7" FITETYPE="FitH" ZOOM="0" COLOR="0,0,0" STYLE="notbold,notitalic" ACTION="" Open="true" INDENT="1">
    </ITEM>
  </ITEM>
  <ITEM NAME="Chapter Two" PAGE="63" FITETYPE="FitH" ZOOM="0" COLOR="0,0,0" STYLE="notbold,notitalic" ACTION="" Open="true" INDENT="0">
  </ITEM>
  <ITEM NAME="Glossaries" PAGE="258" FITETYPE="FitH" ZOOM="0" COLOR="0,0,0" STYLE="notbold,notitalic" ACTION="" Open="true" INDENT="0">
  </ITEM>
</BOOKMARKS>
```

## TOC Format

- Every line is a chapter name, a whitespace, followed by a page number.
- Indentations are identified as groups. (2 spaces / 1 tab)
- Latin numbers, Roman numbers or Chinese numbers can be used as page numbers. 

## Offsets

- An offset can be provided to align pdf page number with actual page number.
  - `-o 2` will map page 1 in toc to page 2 of pdf. 
- If there are multiple schemes of page number (e.g. Roman in foreword, Latin in main text), you can provide an offset for each of them (separated by space).
  - `-o 1 5` will map page 1 of the second scheme to page 5 of pdf