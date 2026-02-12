import { tokenize } from './lexer.js';
import { Parser } from './parser.js';

export async function runWired(code) {
    const tokens = tokenize(code);
    const parser = new Parser(tokens);
    const ast = parser.parse();
    
    const env = {};
    let lastOutput = null;

    async function evaluate(node) {
        switch (node.type) {
            case 'Program':
                for (const stmt of node.body) {
                    await evaluate(stmt);
                }
                return lastOutput;
            
            case 'SignalDeclaration':
                env[node.name] = node.isLatent 
                    ? { status: 'PROPAGATING', value: await evaluate(node.value), availableAt: Date.now() + 2000 }
                    : { status: 'STABLE', value: await evaluate(node.value) };
                return env[node.name].value;
            
            case 'EmitStatement':
                lastOutput = await evaluate(node.value);
                return lastOutput;

            case 'Literal':
                return node.value;


            case 'SyncStatement':
                const signalName = node.sig.name;
                const signal = env[signalName];
                
                if (!signal) throw new Error(`Sinal não definido: ${signalName}`);

                if (signal.status === 'PROPAGATING') {
                    const now = Date.now();
                    if (now < signal.availableAt) {
                        const waitTime = signal.availableAt - now;
                        
                        await new Promise(resolve => setTimeout(resolve, waitTime));
                        
                        signal.status = 'STABLE';
                    }
                }
                return await evaluate(node.action);
            
            case 'Identifier':
                const s = env[node.name];
                if (!s) throw new Error(`Sinal não definido: ${node.name}`);
                // Se alguém tentar usar o sinal fora do SYNC e ele estiver instável, ainda barramos
                if (s.status === 'PROPAGATING' && Date.now() < s.availableAt) {
                    throw new Error(`ERRO DE HARDWARE: Sinal '${node.name}' instável (Jitter detectado).`);
                }
                return s.value;

            case 'BinaryExpression':
                return parser.performMath(node.operator, await evaluate(node.left), await evaluate(node.right));
            
            default:
                throw new Error(`Nó da AST desconhecido: ${node.type}`);
        }
    }

    return evaluate(ast);
}