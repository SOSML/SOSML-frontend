// CodeMirror, copyright (c) by Marijn Haverbeke and others
// Distributed under an MIT license: http://codemirror.net/LICENSE

// taken from codemirror/addon/fold/indent-fold.js and adapted

(function(mod) {
    if (typeof exports == "object" && typeof module == "object") // CommonJS
        mod(require("codemirror/lib/codemirror"));
    else // Plain browser env
        mod(CodeMirror);
})(function(CodeMirror) {
    "use strict";


    function getLineIndent(cm, lineNo) {
        var text = cm.getLine(lineNo);
        var spaceTo = text.search(/\S/);

        if (spaceTo === -1) {
            return -1;
        }
        return CodeMirror.countColumn(text, null, cm.getOption("tabSize"))
    }

    CodeMirror.registerHelper("fold", "sml", function(cm, start) {
        var myIndent = getLineIndent(cm, start.line);
        if (myIndent < 0) {
            return;
        }
        var lastLineInFold = null;

        // Go through lines until we find a line that definitely doesn't belong in
        // the block we're folding, or to the end.
        for (var i = start.line + 1, end = cm.lastLine(); i <= end; ++i) {
            var indent = getLineIndent(cm, i);

            if (indent === -1) {
                continue;
            }

            if (indent > myIndent || (cm.getLine(i).startsWith('|') && indent === myIndent)) {
                // Lines with a greater indent are considered part of the block.
                lastLineInFold = i;
            } else {
                // If this line has non-space, non-comment content, and is
                // indented less or equal to the start line, it is the start of
                // another block.
                break;
            }
        }

        if (lastLineInFold) {


            console.log(
                (start.line + 1) + ", " +
                (lastLineInFold + 1)
            );

            return {
                from: CodeMirror.Pos(start.line, cm.getLine(start.line).length),
                to: CodeMirror.Pos(lastLineInFold, cm.getLine(lastLineInFold).length)
            };
        }
    });

});
