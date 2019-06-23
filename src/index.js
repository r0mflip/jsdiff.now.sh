import {diffLines} from '../node_modules/diff/lib/index.es6.js';
import CodeMirror from '../node_modules/codemirror/src/codemirror.js';


const getDiffHTML = (oldValue, newValue, mode) => {
  if (mode === 'split') {
    return {
      domText: '<center>Need help for Split mode at <a href="https://github.com/r0mflip/jsdiff.netlify.com" target="_blank" rel="noreferrer nofollow">https://github.com/r0mflip/jsdiff.netlify.com</a></center>',
      linesLength: 1,
    };
  } else {
    const textDiff = diffLines(oldValue, newValue, {ignoreWhitespace: false});

    let oldLines = 0;
    let newLines = 0;

    const domText = textDiff.reduce((acc, part, idx) => {
      const tag = part.added
        ? 'ins'
        : part.removed
          ? 'del'
          : 'span';

      const lines = part.value.split(/(\r\n|\n)/).filter(l => l.charCodeAt(0) !== 10);
      // don't pop for last patch
      if (idx !== textDiff.length -1 && lines.length && !lines[lines.length-1]) {
        lines.pop();
      }

      const lineStart = part.added
        ? newLines
        : part.removed
          ? oldLines
          : Math.max(newLines, oldLines);

      if (part.added) {
        newLines += lines.length;
      } else if (part.removed) {
        // do nothing
      } else {
        newLines += lines.length;
      }

      const stub = acc.concat(lines.map((line, i) => {
        const c = document.createElement('code');
        c.innerText = line;
        line = c.innerHTML;

        return [
          `<pre class="${tag}">`,
          `<span class="line-number">${tag !== 'del' ? lineStart + i + 1 : '&#8203;'}</span>`,
          `<${tag}>${line}</${tag}>`,
          '</pre>'
        ].join('');
      }));

      return stub;
    }, []).join('');

    return {domText, linesLength: Math.max(oldLines, newLines)};
  }
};

const init = _ => {
  const main = document.querySelector('main');

  const oldtextNode = main.querySelector('.old-text textarea');
  const newtextNode = main.querySelector('.new-text textarea');

  const oldEditor = new CodeMirror(el => {
    oldtextNode.parentNode.replaceChild(el, oldtextNode);
  }, {
    value: oldtextNode.value,
    lineNumbers: true,
    lineWrapping: true,
  });

  const newEditor = new CodeMirror(el => {
    newtextNode.parentNode.replaceChild(el, newtextNode);
  }, {
    value: newtextNode.value,
    lineNumbers: true,
    lineWrapping: true,
  });

  document.querySelector('.action').addEventListener('click', async _ => {
    const targetNode = main.querySelector('.diff-text');
    const viewType = [...document.querySelectorAll('[name=view-type]')]
      .find(el => el.checked).value;

    targetNode.classList.remove('hidden');
    targetNode.setAttribute('view-type', viewType);

    try {
      const {domText, linesLength} = getDiffHTML(
        oldEditor.getValue() || '',
        newEditor.getValue() || '',
        viewType
      );

      const codeEl = targetNode.querySelector('code.code');
      codeEl.innerHTML = domText;

      requestAnimationFrame(_ => {
        requestAnimationFrame(_ => {
          const gutterWidth =
            `calc(${getComputedStyle(codeEl).fontSize} * ${linesLength.toString().length})`;

          [...codeEl.querySelectorAll('.line-number')].forEach(node => {
            node.style.width = gutterWidth;
          });
        });
      });
    } catch (e) {
      console.error(e);
      targetNode.classList.add('hidden');
    }
  });
};

window.addEventListener('load', init, {once: true});
