const SUCCESS_ICON = ':white_check_mark:';
const EXPERIMENTAL_ICON = ':white_circle:';
const ERROR_ICON = ':red_circle:';

function getIcon(type) {
  return type === 'experimental' ? EXPERIMENTAL_ICON : ERROR_ICON;
}

module.exports = {SUCCESS_ICON, EXPERIMENTAL_ICON, ERROR_ICON, getIcon};
