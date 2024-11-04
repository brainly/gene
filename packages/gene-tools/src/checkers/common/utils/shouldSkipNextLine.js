function shouldSkipNextLine(arrayOfLines, lineNumber, nextLineKeyword) {
  const lineNumberAboveCurrentLineToCheck = lineNumber - 2;
  const lineWithDisableKeyword =
    arrayOfLines[lineNumberAboveCurrentLineToCheck].line.trim();

  const isDisableNextLineKeyword =
    lineWithDisableKeyword.includes(nextLineKeyword);

  const regexPattern = new RegExp(`// ${nextLineKeyword}+(.+)`);
  const providedReason = lineWithDisableKeyword.match(regexPattern);

  if (isDisableNextLineKeyword && providedReason && providedReason[1]) {
    return {
      valid: true,
    };
  }

  if (isDisableNextLineKeyword && !providedReason) {
    return {
      valid: false,
      error: `Passing ${nextLineKeyword} comment without provided reason`,
    };
  }

  return {
    valid: false,
  };
}

module.exports = {
  shouldSkipNextLine,
};
