

/**
 * @brief Display non enabled largeaccount with light red background
 **/
nw_rowformat.nwdemo_largeaccountstatus = function(rowdata) {
  if (rowdata.I_CONTROL == 0) {
    return 'error';
  }
  return '';
};




