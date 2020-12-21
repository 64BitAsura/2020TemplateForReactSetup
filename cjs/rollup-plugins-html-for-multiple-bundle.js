export const makeHtmlAttributes = (attributes) => {
  if (!attributes) {
    return '';
  }

  const keys = Object.keys(attributes);
  // eslint-disable-next-line no-param-reassign
  return keys.reduce((result, key) => (result += ` ${key}="${attributes[key]}"`), '');
};

const defaultTemplate = async ({ attributes, meta, publicPath, title }) => {
  const scripts = (attributes.scripts || [])
    .map(({ fileName, ...attributes }) => {
      const attrs = makeHtmlAttributes(attributes);
      return `<script src="${publicPath}${fileName}"${attrs}></script>`;
    })
    .join('\n');

  const links = (attributes.css || [])
    .map(({ fileName, ...attributes }) => {
      const attrs = makeHtmlAttributes(attributes);
      return `<link href="${publicPath}${fileName}" rel="stylesheet"${attrs}>`;
    })
    .join('\n');

  const metas = meta
    .map((input) => {
      const attrs = makeHtmlAttributes(input);
      return `<meta${attrs}>`;
    })
    .join('\n');

  return `
<!doctype html>
<html${makeHtmlAttributes(attributes.html)}>
  <head>
    ${metas}
    <title>${title}</title>
    ${links}
  </head>
  <body>
    ${scripts}
  </body>
</html>`;
};

const supportedFormats = ['es', 'esm', 'iife', 'umd'];

const defaults = {
  attributes: {
    link: null,
    html: { lang: 'en' },
    script: null
  },
  fileName: 'index.html',
  meta: [{ charset: 'utf-8' }],
  publicPath: '',
  template: defaultTemplate,
  title: 'Rollup Bundle'
};

const html = (opts = {}) => {
  console.log(opts)
  const { attributes, fileName, meta, publicPath, template, title } = Object.assign(
    {},
    defaults,
    opts
  );

  return {
    name: 'html',

    async generateBundle() {
      const source = await template({ attributes, meta, publicPath, title });
      const htmlFile = {
        type: 'asset',
        source,
        name: 'Rollup HTML Asset',
        fileName
      };
      this.emitFile(htmlFile);
    }
  };
};

export default html;
