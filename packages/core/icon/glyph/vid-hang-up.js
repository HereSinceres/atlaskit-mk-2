"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _index = _interopRequireDefault(require("../cjs/index"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

var VidHangUpIcon = function VidHangUpIcon(props) {
  return _react.default.createElement(_index.default, _extends({
    dangerouslySetGlyph: "<svg width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" focusable=\"false\" role=\"presentation\"><path d=\"M5.467 14.95l2.611-.656s.64-.237.652-.978l-.01-1.212s.038-.471.637-.557c1.768-.327 3.418-.34 5.182 0 .689.131.636.557.636.557l.007.889c.013.74.652.977.652.977l2.593.982c1.227.37 1.868-1.473 1.44-2.574-.991-2.557-3.996-2.994-6.281-3.294-1.085-.143-2.291-.077-3.274 0-1.72.137-5.17.713-6.165 3.27-.427 1.1.093 2.966 1.32 2.596z\" fill=\"currentColor\" fill-rule=\"evenodd\"/></svg>"
  }, props));
};

VidHangUpIcon.displayName = 'VidHangUpIcon';
var _default = VidHangUpIcon;
exports.default = _default;