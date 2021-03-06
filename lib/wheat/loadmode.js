module.exports = function loadmode(CodeMirror) {
    GLOBAL.CodeMirror = CodeMirror;
    if (!CodeMirror.modeURL) CodeMirror.modeURL = "../../../codemirror/mode/%N/%N.js";
    require("../../../codemirror/mode/meta.js");

    CodeMirror.requireMode = function(mode) {
        if (typeof mode != "string") mode = mode.name;
        if (!CodeMirror.modes.hasOwnProperty(mode)) {
            try {
                require(CodeMirror.modeURL.replace(/%N/g, mode));
            } catch(e) {
                process.stderr.write(e.stack);
            }
        }
    };
    CodeMirror.defineMode("null", function() {
        return {
            token: function(stream) {
                stream.skipToEnd();
            }
        };
    });
    CodeMirror.defineMIME("text/plain", "null");

    // Load all modes.
    var modes = {};

    CodeMirror.modeInfo.forEach(function(info) {
        var m = info.mode;
        modes[m] = true;
    });
    modes = Object.keys(modes);

    modes.forEach(function(mode) {
        CodeMirror.requireMode(mode);
    });
};

