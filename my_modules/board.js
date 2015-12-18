var make =  function (dim, lvl, arr, coord) {
          if (lvl === 0) {
            return '';
          }
          if (!lvl) {
            lvl = dim;
          }
          if (!arr) {
            arr = [];
          }
          if (!coord) {
            coord = [];
          }
          for (var i = 0, l = dim; i < l; i += 1) {
            coord[lvl] = i;
            arr[i] = make(dim, lvl - 1, arr[i], coord);
          }
          return arr;
      };

var board = make(9,2);

for(var i = 8; i>=0; i--) {
  board[i][i] = 9-i;
}

module.exports = board;