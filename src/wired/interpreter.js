import { tokenize } from './lexer.js';
import { Parser } from './parser.js';

export function runWired(code) {
    const tokens = tokenize(code);
    const parser = new Parser(tokens);
    const ast = parser.parse();
    
    const env = {};
    let lastOutput = null;

    function evaluate(node) {
        switch (node.type) {
            case 'Program':
                node.body.forEach(stmt => evaluate(stmt));
                return lastOutput;
            
            case 'SignalDeclaration':
                env[node.name] = evaluate(node.value);
                return env[node.name];
            
            case 'EmitStatement':
                lastOutput = evaluate(node.value);
                return lastOutput;

            case 'Literal':
                return node.value;
            
            case 'Identifier':
                if (!(node.name in env)) throw new Error(`Sinal não definido: ${node.name}`);
                return env[node.name];

            case 'BinaryExpression':
                const leftVal = evaluate(node.left);
                const rightVal = evaluate(node.right);
                switch (node.operator) {
                    case '+': return leftVal + rightVal;
                    case '-': return leftVal - rightVal;
                    case '*': return leftVal * rightVal;
                    case '/': 
                        if (rightVal === 0) throw new Error("Divisão por zero!");
                        return leftVal / rightVal;
                    default:
                        throw new Error(`Operador desconhecido: ${node.operator}`);
                }
            
            default:
                throw new Error(`Nó da AST desconhecido: ${node.type}`);
        }
    }

    return evaluate(ast);
}