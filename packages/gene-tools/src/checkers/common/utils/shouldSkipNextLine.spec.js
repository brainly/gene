const { shouldSkipNextLine } = require('./shouldSkipNextLine');
const {
  GENE_REPORT_DISABLE_MEMO_NEXT_LINE,
} = require('../constants/nextLineDisablers');

const arrayOfLines = [
  {
    line: '        // gene-report-disable-memo-next-line some reason',
    indent: 8,
    locked: false,
    sliceStart: 8,
    sliceEnd: 57,
  },
  {
    line: '        selectedSubjectId={selectedSubjectId}',
    indent: 8,
    locked: false,
    sliceStart: 8,
    sliceEnd: 45,
  },
];

const lineNumber = 2;

describe('shouldSkipNextLine()', () => {
  it('returns true when provided next line disabler keyword with reason', () => {
    const skipNextLine = shouldSkipNextLine(
      arrayOfLines,
      lineNumber,
      GENE_REPORT_DISABLE_MEMO_NEXT_LINE,
    );

    expect(skipNextLine).toEqual({
      valid: true,
    });
  });

  it('returns error when provided next line disabler keyword without reason', () => {
    arrayOfLines[0].line = '        // gene-report-disable-memo-next-line';

    const skipNextLine = shouldSkipNextLine(
      arrayOfLines,
      lineNumber,
      GENE_REPORT_DISABLE_MEMO_NEXT_LINE,
    );

    expect(skipNextLine).toEqual({
      valid: false,
      error: `Passing ${GENE_REPORT_DISABLE_MEMO_NEXT_LINE} comment without provided reason`,
    });
  });

  it('returns false when next line disabler keyword was not provided', () => {
    arrayOfLines[0].line = '        <SomeComponent />';

    const skipNextLine = shouldSkipNextLine(
      arrayOfLines,
      lineNumber,
      GENE_REPORT_DISABLE_MEMO_NEXT_LINE,
    );

    expect(skipNextLine).toEqual({
      valid: false,
    });
  });
});
