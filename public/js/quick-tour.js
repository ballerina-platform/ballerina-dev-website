$(document).ready(function(){
	loadMonacoEditor($('#code-01-hello-code').val().replace(/<(.|\n)*?>/g, ""), 70, 'code-01-hello');
	loadMonacoEditor($('#code-02-service-code').val().replace(/<(.|\n)*?>/g, ""), 430, 'code-02-service');
	loadMonacoEditor($('#code-03-k-code').val().replace(/<(.|\n)*?>/g, ""), 300, 'code-03-k');
})