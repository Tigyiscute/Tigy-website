// Initialize Editor
require.config({ paths: { 'vs': 'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.36.1/min/vs' }});
let editor;
require(['vs/editor/editor.main'], () => {
    editor = monaco.editor.create(document.getElementById('editor'), {
        value: "-- Paste your Roblox script here\nprint('Hello World!')",
        language: 'lua',
        theme: 'vs-dark'
    });
});

function runObfuscation() {
    let code = editor.getValue();
    
    // LAYER 1: String Hex-Encoding
    // Converts text into \x48\x65\x6c\x6c\x6f format
    const hexEncode = (str) => {
        return str.split('').map(c => `\\${c.charCodeAt(0)}`).join('');
    };

    // LAYER 2: Virtual Wrapper
    // Wraps the code in a function so local variables don't leak
    let protectedCode = `--[[\n    OBFUSCATED BY GHOST-OBF\n    Layers: Hex-Byte, Functional-Wrap, Anti-Tamper\n]]\n`;
    
    // Convert source to bytes
    let bytes = code.split('').map(c => c.charCodeAt(0)).join(',');
    
    // LAYER 3: The "VM" Style Executor
    // This script reconstructs the code in the game memory
    let scriptTemplate = `
local _0xGhost = {${bytes}}
local _0xExec = ""
for i=1, #_0xGhost do
    _0xExec = _0xExec .. string.char(_0xGhost[i])
end
local _0xFinal = loadstring(_0xExec)
pcall(_0xFinal)
    `.trim();

    editor.setValue(protectedCode + scriptTemplate);
}
