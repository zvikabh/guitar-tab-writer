'use strict';

const FRET_HEADERS = ['e', 'B', 'G', 'D', 'A', 'E'];
const CONNECTED_SUFFIXES = new Set(['b', 'h', 's', 'r']);
const BLANK_ROWS_BETWEEN_TABS = 2;

var tabs = [];

function clickFret(row, col) {
  if ($('#chord-checkbox')[0].checked && tabs.length > 0) {
    tabs[tabs.length - 1][row] = col + '';
  } else {
    let chord = {};
    chord[row] = col + '';
    tabs.push(chord);
  }
  endChord();
  regenerateText();
}

function clickRest() {
  endChord();
  tabs.push({0: '-'});
  regenerateText();
}

function addToAllStrings(text) {
  endChord();
  const chord = {}
  for (let i = 0; i < 6; ++i) {
    chord[i] = text;
  }
  tabs.push(chord);
  regenerateText();
}

function clickBackspace() {
  endChord();
  tabs.pop();
  regenerateText();
}

function addSuffix(suffix) {
  if (tabs.length == 0) {
    return;
  }
  let chord = tabs[tabs.length - 1];
  for (const key of Object.keys(chord)) {
    chord[key] += suffix;
  }
  regenerateText();
}

function endChord() {
  $('#chord-checkbox')[0].checked = false;
}

function regenerateText() {
  let rowNum = 0;
  const linesPerRow = 6 + BLANK_ROWS_BETWEEN_TABS;
  let lines = [];
  for (var i = 0; i < 6; ++i) {
    lines.push(FRET_HEADERS[i] + '|-');
  }
  tabs.forEach(chord => {
    if (chord[0] == 'newline') {
      rowNum++;
      for (let i = 0; i < BLANK_ROWS_BETWEEN_TABS; ++i) {
        lines.push('');
      }
      for (let i = 0; i < 6; ++i) {
        lines.push(FRET_HEADERS[i] + '|-');
      }
      return;
    }
    let chordChars = 0;
    let addSpacer = true;
    for (const [row, col] of Object.entries(chord)) {
      if (col.length > chordChars) {
        chordChars = col.length;
        if (CONNECTED_SUFFIXES.has(col[col.length - 1])) {
          addSpacer = false;
        }
      }
    }
    if (addSpacer) {
      chordChars++;  // Spacer after the chord.
    }
    for (var row = 0; row < 6; ++row) {
      if (row in chord) {
        lines[row + rowNum*linesPerRow] += (chord[row] + '').padEnd(chordChars, '-');
      } else {
        lines[row + rowNum*linesPerRow] += ''.padEnd(chordChars, '-');
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
    fretsContainer.append($('<div class="string-header">').text(FRET_HEADERS[row]));
    for (var col = 0; col < 24; ++col) {
      let elem = $('<div class="fret-cell" id="fret-cell-' + row + '-' + col + '">');
      elem.click(clickFret.bind(null, row, col));
      elem.append($('<div class="string ' + FRET_HEADERS[row] + '-string">'));
      elem.append($('<div class="fret-edge">').append(
          $('<div class="string ' + FRET_HEADERS[row] + '-string">')));
      fretsContainer.append(elem);
    }
  }
  regenerateText();
});
