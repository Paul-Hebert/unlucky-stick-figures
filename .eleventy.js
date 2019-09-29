const path = require('path');
const fg = require('fast-glob');

const layoutsDir = 'src/_includes/layouts/';

module.exports = eleventyConfig => {
  // Configure layout files
  fg.sync(layoutsDir + '*.hbs').forEach(file => {
    const basename = path.basename(file, '.hbs');
    eleventyConfig.addLayoutAlias(basename, `layouts/${basename}.hbs`);
  });

  // Push images to the output folder
  eleventyConfig.addPassthroughCopy('src/stick-figures/**/*.png');
  eleventyConfig.addPassthroughCopy('src/stick-figures/**/*.jpg');

  // Make stick figures available as a collection
  eleventyConfig.addCollection('figures', function(collection) {
    console.log(collection.getFilteredByGlob('src/stick-figures/**/index.md'));
    return collection.getFilteredByGlob('src/stick-figures/**/index.md');
  });

  // Set input and output folders
  return {
    dir: {
      input: 'src',
      output: 'dist',
    },
  };
}