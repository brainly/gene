/*
  Right now we generate reports only for react components
  Regexp: https://regex101.com/r/Vhc8QA/1
*/
function extractReactComponents({ files }) {
  const truncatedPaths = files
    .map((file) => {
      const match = file.match(
        /^(.*\/[A-Z][A-Za-z]+)(\.spec|\.stories)?\.tsx$/,
      );

      if (match) {
        return match[1];
      }
      return null;
    })
    .filter(Boolean);

  return [...new Set(truncatedPaths)];
}

module.exports = { extractReactComponents };
