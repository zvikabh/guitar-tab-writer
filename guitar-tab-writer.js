'use strict';

const fretHeaders = ['E', 'B', 'G', 'D', 'A', 'E'];
var tabs = [];

function clickFret(row, col) {
  tabs.push({row: row, col: col});
  regenerateText();
}

function regenerateText() {
  let lines = ['', '', '', '', '', ''];
  for (var i = 0; i < 6; ++i) {
    lines[i] = fretHeaders[i] + '|-';
  }
  tabs.forEach(elem => {
    for (var row = 0; row < 6; ++row) {
      if (row == elem.row) {
        lines[row] += elem.col + '-';
      } else {
        if (elem.col < 10) {
          lines[row] += '--';
        } else {
          lines[row] += '---';
        }
      }
    }
  });
  $('#tabs-text').text(lines.join('\n'));
}

$(document).ready(() => {
  const fretsContainer = $('#frets');
  fretsContainer.append($('<div>'));
  for (var fret = 0; fret < 24; ++fret) {
    fretsContainer.append($('<div class="fret-header">').text(fret));
  }
  for (var row = 0; row < 6; ++row) {
    fretsContainer.append($('<div class="string-header">').text(fretHeaders[row]));
    for (var col = 0; col < 24; ++col) {
      let elem = $('<div class="fret-cell" id="fret-cell-' + row + '-' + col + '">');
      elem.click(clickFret.bind(null, row, col));
      fretsContainer.append(elem);
    }
  }
  regenerateText();
});
