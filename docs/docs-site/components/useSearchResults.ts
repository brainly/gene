import React from 'react';

function slice(text, startIndex, left, right) {
  const textLength = text.length;
  let leftIndex = Math.max(0, startIndex - left);
  let rightIndex = Math.min(textLength, startIndex + right);

  while (leftIndex > 0 && text[leftIndex] !== ' ') {
    leftIndex--;
  }

  while (rightIndex < textLength && text[rightIndex] !== ' ') {
    rightIndex++;
  }

  return text.slice(leftIndex, rightIndex).trim();
}

export const useSearchResults = () => {
  const [docs, setDocs] = React.useState([]);

  React.useEffect(() => {
    if (!docs || !docs.length) {
      fetch('/data.json')
        .then((data) => data.json())
        .then((json) => setDocs(json));
    }
  }, [docs]);

  const searchDocs = React.useCallback(
    (keyword: string) => {
      if (!docs || !docs.length) {
        return [];
      }

      const contentResults = keyword
        ? docs.filter((doc) =>
            doc.content.toLowerCase().includes(keyword.toLowerCase()),
          )
        : [];

      const withSubstrContent = contentResults.map(
        ({ route, title, content }) => {
          const index = content.toLowerCase().indexOf(keyword.toLowerCase());
          const substr = slice(content, index, 15, 15 + keyword.length);

          return { route, title, content: substr, type: 'content' };
        },
      );

      const titleResults = keyword
        ? docs.filter((doc) =>
            doc.title?.toLowerCase().includes(keyword.toLowerCase()),
          )
        : [];

      const withNoContent = titleResults.map((result) => {
        return { ...result, content: undefined, type: 'title' };
      });

      return [...withNoContent, ...withSubstrContent].slice(0, 10);
    },
    [docs],
  );

  return { searchDocs };
};
