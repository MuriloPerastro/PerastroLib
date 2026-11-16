import assert from 'node:assert/strict'
import {
    criarBackup, serializarBackup, validarBackup,
    restaurarNoArmazenamento, nomeArquivoBackup, CHAVES_ARMAZENAMENTO
} from './src/utils/backup.js'

let n = 0
const ok = (nome, fn) => { fn(); n++; console.log('OK  ', nome) }

const dados = {
    livros: [{ id: 1, titulo: 'Dom Casmurro', autor: 'Machado', quantidade: 2, cdd: '869.3' }, { id: 2, titulo: 'X', autor: 'Y' }],
    pessoas: [{ id: 10, nome: 'Ana', tipo: 'Aluno', turma: '1A Regular' }],
    registros: [{ id: 100, livroId: 1, pessoaId: 10, status: 'Em andamento', dataEmprestimo: '2026-11-01' },
                { id: 101, livroId: 1, pessoaId: 10, status: 'Devolvido', dataDevolucao: '2026-11-05' }],
    categorias: ['Romance'],
    config: { nomeEscola: 'Escola A', modoOrganizacao: 'cdd' },
    turmas: ['1A Regular', '2 EJA']
}

class Mem {
    constructor(init = {}, falharNaChave = null) { this.m = new Map(Object.entries(init)); this.falhar = falharNaChave; this.cont = 0 }
    getItem(k) { return this.m.has(k) ? this.m.get(k) : null }
    setItem(k, v) { if (this.falhar && ++this.cont === this.falhar) throw new Error('quota'); this.m.set(k, String(v)) }
    removeItem(k) { this.m.delete(k) }
}

ok('nome do arquivo usa data local', () => {
    assert.equal(nomeArquivoBackup(new Date(2026, 10, 16)), 'PerastroLib_Backup_2026-11-16.json')
})

ok('exporta e valida round-trip sem perda', () => {
    const r = validarBackup(serializarBackup(dados))
    assert.equal(r.ok, true)
    assert.deepEqual(r.dados, dados)
    assert.deepEqual(r.resumo, { instituicao: 'Escola A', livros: 2, pessoas: 1, registros: 2 })
})

ok('backup contém app, versão e data', () => {
    const b = criarBackup(dados)
    assert.equal(b.app, 'PerastroLib'); assert.equal(b.backupVersion, 1); assert.ok(!isNaN(Date.parse(b.exportedAt)))
})

for (const [nome, texto] of [
    ['vazio', ''], ['não-JSON', '{abc'], ['JSON aleatório', '{"a":1}'], ['array', '[]'],
    ['app errado', JSON.stringify({ app: 'Outro', backupVersion: 1, data: dados })],
    ['versão futura', JSON.stringify({ app: 'PerastroLib', backupVersion: 99, data: dados })],
    ['sem data', JSON.stringify({ app: 'PerastroLib', backupVersion: 1 })],
]) ok(`rejeita: ${nome}`, () => assert.equal(validarBackup(texto).ok, false))

const mut = (f) => { const c = structuredClone(dados); f(c); return JSON.stringify({ app: 'PerastroLib', backupVersion: 1, data: c }) }
ok('rejeita livros não-lista', () => assert.equal(validarBackup(mut(c => c.livros = {})).ok, false))
ok('rejeita item vazio {} em pessoas', () => assert.equal(validarBackup(mut(c => c.pessoas.push({}))).ok, false))
ok('rejeita ids repetidos', () => assert.equal(validarBackup(mut(c => c.livros.push({ id: 1 }))).ok, false))
ok('rejeita config sem modo', () => assert.equal(validarBackup(mut(c => c.config.modoOrganizacao = '')).ok, false))
ok('rejeita modo desconhecido', () => assert.equal(validarBackup(mut(c => c.config.modoOrganizacao = 'x')).ok, false))
ok('rejeita turmas não-texto', () => assert.equal(validarBackup(mut(c => c.turmas = [1])).ok, false))
ok('aceita backup vazio válido (biblioteca nova)', () =>
    assert.equal(validarBackup(mut(c => { c.livros = []; c.pessoas = []; c.registros = [] })).ok, true))

ok('restaura em instalação limpa (computador B)', () => {
    const B = new Mem()
    restaurarNoArmazenamento(dados, B)
    for (const [campo, chave] of Object.entries(CHAVES_ARMAZENAMENTO))
        assert.deepEqual(JSON.parse(B.getItem(chave)), dados[campo])
})

ok('falha no meio da gravação reverte tudo (estado anterior intacto)', () => {
    const antigos = { perastrolib_livros: '[{"id":9}]', perastrolib_config: '{"nomeEscola":"Velha","modoOrganizacao":"estante"}' }
    const B = new Mem(antigos, 4) // falha na 4ª gravação
    assert.throws(() => restaurarNoArmazenamento(dados, B), /quota/)
    assert.equal(B.getItem('perastrolib_livros'), antigos.perastrolib_livros)
    assert.equal(B.getItem('perastrolib_config'), antigos.perastrolib_config)
    assert.equal(B.getItem('perastrolib_pessoas'), null)
    assert.equal(B.getItem('perastrolib_registros'), null)
})

ok('histórico preservado: registros devolvidos e ativos idênticos', () => {
    const r = validarBackup(serializarBackup(dados))
    assert.deepEqual(r.dados.registros, dados.registros)
})
console.log(`\n${n} testes passaram`)
