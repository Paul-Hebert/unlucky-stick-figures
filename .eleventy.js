const path = require('path');
const fg = require('fast-glob');

const layoutsDir = 'src/_includes/layouts/';

module.exports = eleventyConfig => {
  fg.sync(layoutsDir + '*.hbs').forEach(file => {
    const basename = path.basename(file, '.hbs');
    eleventyConfig.addLayoutAlias(basename, `layouts/${basename}.hbs`);
  });

  return {
    dir: {
      input: 'src',
      output: 'dist',
    },
  };
}