#! /usr/bin/env node

const process = require("process")
const { writeFileSync, readFileSync } = require("fs")
const { version } = require("./package.json")

var convert = require("xml-js")
const { parseNumber } = require("./utils")

const { program } = require("commander")

program
  .name("pdf-bm")
  .description(`Create bookmark.xml (for pdf) from table of content`)
  .version(version)
  .usage("gen [options]")
  .option("-i --input <path>", `path to a text file containing toc`, "toc.txt")
  .option("-o --output <path>", "output path", "bookmarks.xml")
  .option(
    "-s --offset <offsets...>",
    `the beginning page for each page number scheme (separated by space)`,
    ["1"]
  )
  .option(
    "-h --fit-height",
    "fit full height instead of full width when jumping",
    false
  )
  .helpOption(false)
  .addHelpCommand(false)
  .addHelpText(
    "after",
    `\nRead more at https://www.npmjs.com/package/pdf-bookmark-generator`
  )
  .command("gen")
  .description(`generate bookmarks.xml`)
  .action(() => {
    const options = program.opts()
    const INPUT_PATH = options["input"]
    const OUTPUT_PATH = options["output"]
    options["offset"] = options["offset"].map((o) => parseInt(o))
    const OFFSETS = options["offset"]
    const FIT_HEIGHT = options["fitHeight"]

    console.log(`Generating ${OUTPUT_PATH} ...`)
    console.log(`Options: ${JSON.stringify(options, undefined, 2)}`)

    const INPUT_STR = readFileSync(INPUT_PATH, { encoding: "utf-8" })

    let previousPageNumType = undefined
    let refs = []
    let previousTabCount = 0

    /** @type {import("xml-js").ElementCompact} */
    const bookmarks = {
      _declaration: {
        _attributes: {
          version: "1.0",
          encoding: "utf-8",
        },
      },
      BOOKMARKS: {
        ITEM: INPUT_STR.split("\n")
          .map((b) => {
            let tabCount = 0
            const tabChars = ["\t", "  "]
            while (true) {
              const tab = tabChars.find((t) => b.startsWith(t))
              if (!tab) break
              else b = b.replace(tab, "")
              tabCount++
            }
            const matches = b.match(/^(.*)\s+(\S+)$/)
            if (matches) {
              const [pageNum, pageNumType] = parseNumber(matches[2])
              if (previousPageNumType && previousPageNumType !== pageNumType) {
                OFFSETS.shift()
              }
              previousPageNumType = pageNumType
              let offset = (OFFSETS?.[0] || 1) - 1
              let item = {
                _attributes: {
                  NAME: matches[1],
                  PAGE: pageNum + offset,
                  // HACK XYZ can keep view aspect, but require setting VIEWRECT, which behaves inconsistently in different pdf readers
                  // TODO Add an option for choosing FitH (full width) / Fit (full height)
                  FITETYPE: FIT_HEIGHT ? "Fit" : "FitH",
                  ZOOM: "0",
                  COLOR: "0,0,0",
                  STYLE: "notbold,notitalic",
                  ACTION: "",
                  Open: "true",
                  INDENT: tabCount,
                },
                ITEM: [],
              }
              refs = [...refs.slice(0, tabCount), item]
              if (tabCount > 0) {
                // Get the closest parent
                const closestParent =
                  refs.length < tabCount
                    ? refs[refs.length - 1]
                    : refs[tabCount - 1]
                closestParent.ITEM.push(item)
              } else {
                return item
              }
            }
          })
          .filter((b) => b),
      },
    }
    writeFileSync(
      OUTPUT_PATH,
      convert.js2xml(bookmarks, { compact: true, spaces: 2 })
    )
    console.log("Succeed!")
  })
program.parse(process.argv)
