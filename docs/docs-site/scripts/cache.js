const fs = require('fs');
const matter = require('gray-matter');
const glob = require('glob');

function getDocs() {
  // eslint-disable-next-line no-undef
  return new Promise(resolve => {
    glob('pages/**/*.mdx', function (err, fileNames) {
      console.log({fileNames});
      const docs = fileNames.map(fileName => {
        const route = fileName
          .replace(/\.mdx$/, '')
          .replace('pages/', '/')
          .replace('/index', '/');
        const fileContents = fs.readFileSync(fileName, 'utf8');
        const matterResult = matter(fileContents);
        return {
          route,
          title: matterResult.data.title,
          content: matterResult.content,
        };
      });

      resolve(JSON.stringify(docs));
    });
  });
}

getDocs().then(docs => {
  const fileContents = `${docs}`;

  try {
    fs.readdirSync('public');
  } catch (e) {
    fs.mkdirSync('public');
  }

  fs.writeFile('public/data.json', fileContents, function (err) {
    if (err) {
      return console.log(err);
    }
    console.log('Docs cached.');
  });
});
