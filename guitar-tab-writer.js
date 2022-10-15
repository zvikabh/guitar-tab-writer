'use strict';

const fretHeaders = ['E', 'B', 'G', 'D', 'A', 'E'];
var tabs = [];

function clickFret(row, col) {
  let chord = {};
  chord[row] = col + '';
  tabs.push(chord);
  regenerateText();
}

function clickRest() {
  tabs.push({0: '-'});
  regenerateText();
}

function clickEndMeasure() {
  const endMeasure = {0: '|', 1: '|', 2: '|', 3: '|', 4: '|', 5: '|'}
  tabs.push(endMeasure);
  regenerateText();
}

function regenerateText() {
  let lines = ['', '', '', '', '', ''];
  for (var i = 0; i < 6; ++i) {
    lines[i] = fretHeaders[i] + '|-';
  }
  tabs.forEach(chord => {
    let chordChars = 0;
    for (const [row, col] of Object.entries(chord)) {
      if (col.length > chordChars) {
        chordChars = col.length;
      }
    }
    chordChars++;  // Spacer after the chord.
    for (var row = 0; row < 6; ++row) {
      if (row in chord) {
        lines[row] += (chord[row] + '').padEnd(chordChars, '-');
      } else {
        lines[row] += ''.padEnd(chordChars, '-');
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
