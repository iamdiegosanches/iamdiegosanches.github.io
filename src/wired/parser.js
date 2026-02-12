export class Parser {
    constructor(tokens) {
        this.tokens = tokens;
        this.cursor = 0;
    }

    eat(type) {
        const token = this.tokens[this.cursor];
        if (token.type !== type) {
            throw new Error(`Esperado ${type}, mas encontrado ${token.type} na posição ${this.cursor}`);
        }
        this.cursor++;
        return token;
    }

    parse() {
        const statements = [];
        while (this.tokens[this.cursor].type !== 'EOF') {
            statements.push(this.parseStatement());
        }
        return { type: 'Program', body: statements };
    }

    parseStatement() {
        const token = this.tokens[this.cursor];
        if (token.type === 'KEYWORD') {
            if (token.value === 'SIGNAL') return this.parseSignal();
            if (token.value === 'EMIT') return this.parseEmit();
        }
        throw new Error(`Comando desconhecido: ${token.value}`);
    }

    parseSignal() {
        this.eat('KEYWORD');
        const name = this.eat('IDENTIFIER').value;
        this.eat('OPERATOR');
        const value = this.parseExpression();
        return { type: 'SignalDeclaration', name, value };
    }

    parseEmit() {
        this.eat('KEYWORD');
        const value = this.parseExpression();
        return { type: 'EmitStatement', value };
    }

    parseExpression() {
        let left = this.parsePrimary();

        while (this.cursor < this.tokens.length && 
            this.tokens[this.cursor].type === 'OPERATOR' && 
            this.tokens[this.cursor].value !== '=') {
            
            const operator = this.eat('OPERATOR').value;
            const right = this.parsePrimary();
            left = {
                type: 'BinaryExpression',
                operator,
                left,
                right
            };
        }
        return left;
    }

    parsePrimary() {
        const token = this.tokens[this.cursor];
        if (token.type === 'NUMBER') {
            this.cursor++;
            return { type: 'Literal', value: Number(token.value) };
        }
        if (token.type === 'IDENTIFIER') {
            this.cursor++;
            return { type: 'Identifier', name: token.value };
        }
        throw new Error(`Esperado número ou identificador, mas veio: ${token.value}`);
    }
}