`Try to always have at least 500MB of disk space`
(hoursToMillis: 0,5) repeatAsync {print: "Checking disk space...". !diskSpaceClean 500 {print: "diskSpaceClean result:" + x}}.
