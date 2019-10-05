const path = require('path');
const fg = require('fast-glob');
const fs = require('fs');
const Handlebars = require('handlebars');

const helpers = require('./helpers');

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
    return collection.getFilteredByGlob('src/stick-figures/**/index.md');
  });

  // Make patterns available as collections
  eleventyConfig.addCollection('patterns', function(collection) {
    return collection.getFilteredByGlob('src/patterns/**/index.md');
  });
  eleventyConfig.addCollection('patternExamples', function(collection) {
    return collection.getFilteredByGlob('src/patterns/**/examples/**/*.hbs');
  });

  // Register handlebars helpers
  Object.keys(helpers).forEach(group => {
    const method = `add${group}`;
    if (typeof eleventyConfig[method] !== 'function') return;

    Object.keys(helpers[group]).forEach(key => {
      eleventyConfig[method](key, helpers[group][key]);
    });
  });

  // Register handlebars partials
  fg.sync('src/patterns/**/partials/**/*.hbs').forEach(file => {
    const partial = fs.readFileSync(file, 'utf8');
    const pathSegments = file.split('/');
    let key = pathSegments[pathSegments.length - 1];
    key = key.replace(path.extname(file), '');
    Handlebars.registerPartial(key, partial);
  });

  // Set input and output folders
  return {
    dir: {
      input: 'src',
      output: 'dist',
    },
  };
}