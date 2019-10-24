var loadMonacoEditor = function(code, height, container){
    var  editor = null ,editorRun = null;
    require.config({ paths: { 'vs': '../js/vs' }});
	if(height) {
		height = parseInt(height);
	}
	require(['vs/editor/editor.main'], function() {
        if(typeof container === "string"){
            container = $("#"+container);
        }
        container.height(height);
        monaco.languages.register({ id:'ballerina' });
        monaco.languages.setMonarchTokensProvider('ballerina', ballerina_grammar);
        ballerina_theme.colors['editor.background'] = "#ffffff";
        monaco.editor.defineTheme('myTheme',  ballerina_theme);
        monaco.editor.setTheme('myTheme');
        if(!editor){
            editor = monaco.editor.create(container.get(0), {
                value: code,
                language: 'ballerina',
                minimap: {
                    enabled: false
                },
                scrollbar: {
                    vertical: 'hidden'
                },
                scrollBeyondLastLine: false,
                fontSize: 11,
                readOnly: true,
                lineNumbersMinChars: 2
            });
        } else {
            editor.setValue(code);
        }
	});
}