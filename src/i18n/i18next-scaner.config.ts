const fs = require('fs');
const {crc32} = require('crc');

module.exports = {
  input: ['src/**/*.{js,ts,tsx}', '!**/node_modules/**'],
  output: './',
  options: {
    debug: true,
    func: false,
    trans: false,
    lngs: ['zh-CN', 'en-US'],
    defaultLng: 'zh-CN',
    resource: {
      loadPath: './src/i18n/json/{{lng}}.json',
      savePath: './src/i18n/json/{{lng}}.json',
      jsonIndent: 2,
      lineEnding: '\n',
    },
    removeUnusedKeys: true,
    nsSeparator: false, // namespace separator
    keySeparator: false, // key separator
    interpolation: {
      prefix: '{{',
      suffix: '}}',
    },
  },
  transform: function customTransform(file, enc, done) {
    const parser = this.parser;
    const content = fs.readFileSync(file.path, enc);
    parser.parseFuncFromString(content, {list: ['t', 't']}, (key, options) => {
      options.defaultValue = key;
      // let hashKey = `k${crc32(key).toString(16)}`;
      const hashKey = `k${crc32(key).toString(16)}`;
      parser.set(hashKey, options);
    });
    done();
  },
};
