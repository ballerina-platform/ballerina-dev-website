Prism.languages.ballerina = {
    'comment': /\/\/[^\r\n]*/,
    'string': {
        pattern: /"(?:[^\\"]|\\.)*(?:"|$)/,
        greedy: true,
    },
    'boolean': /\b(?:true|false)\b/,
    'keyword': (new RegExp(
        '\\b(?:' +
        'if|else|iterator|try|catch|finally|fork|join|all|some|while|foreach|in|throw|return|returns|break|let|' +
        'timeout|transaction|aborted|abort|committed|failed|retries|onretry|onabort|oncommit|next|bind|with|lengthof|typeof|enum|' +
        'import|version|public|private|attach|as|native|documentation|lock|record|' +
        'from|on|select|group|by|having|order|where|followed|insert|into|update|delete|set|for|window|query|forever|untaint|start|await|done|check' +
        'annotation|package|type|typedesc|connector|function|resource|service|action|worker|struct|transformer|endpoint|object|' +
        'const|true|false|reply|create|parameter|primarykey|scope|compensate|compensation|' +
        'boolean|int|float|string|var|any|datatable|table|byte|stream|' +
        'map|exception|json|xml|xmlns|error|__init' +
        ')\\b'
    )),
    'operator': /(?:!|%|\+|\-|~|=|=|!|<|>|&|\|)/,
    'number': /\b0[xX][\da-f]+\b|\b\d+\.?\d*/
};
