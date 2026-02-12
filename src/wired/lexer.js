export const TOKEN_TYPES = {
    KEYWORD: 'KEYWORD',
    IDENTIFIER: 'IDENTIFIER',
    NUMBER: 'NUMBER',
    OPERATOR: 'OPERATOR',
    LBRACKET: 'LBRACKET',
    RBRACKET: 'RBRACKET',
    LATENCY_ASSIGN: 'LATENCY_ASSIGN',
    ARROW: 'ARROW',
    EOF: 'EOF'
};

export function tokenize(input) {
    const tokens = [];
    let cursor = 0;

    const specs = [
        [/^\s+/, null],
        [/^(--.*)/, null],
        [/^(SIGNAL|SYNC|TRANSFORM|EMIT)\b/, TOKEN_TYPES.KEYWORD],
        [/^~>/, TOKEN_TYPES.LATENCY_ASSIGN],
        [/^->/, TOKEN_TYPES.ARROW],
        [/^[a-zA-Z_][a-zA-Z0-9_]*/, TOKEN_TYPES.IDENTIFIER],
        [/^[0-9]+/, TOKEN_TYPES.NUMBER],
        [/^==/, TOKEN_TYPES.OPERATOR],
        [/^[\+\-\*\/\=]/, TOKEN_TYPES.OPERATOR],
        [/^\[/, TOKEN_TYPES.LBRACKET],
        [/^\]/, TOKEN_TYPES.RBRACKET],

    ];

    while (cursor < input.length) {
        const slice = input.slice(cursor);
        let matched = false;

        for (const [regex, type] of specs) {
            const result = regex.exec(slice);
            if (result !== null) {
                if (type !== null) {
                    tokens.push({ type, value: result[0] });
                }
                cursor += result[0].length;
                matched = true;
                break;
            }
        }

        if (!matched) throw new Error(`Caractere inesperado na posição ${cursor}: ${slice[0]}`);
    }

    tokens.push({ type: TOKEN_TYPES.EOF });
    return tokens;
}