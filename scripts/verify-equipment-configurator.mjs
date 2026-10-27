import fs from 'node:fs'
import vm from 'node:vm'
import assert from 'node:assert/strict'
import ts from 'typescript'
function load(file, requireModule, scope = {}) {
  const exports = {}
  const code = ts.transpileModule(fs.readFileSync(file, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020, jsx: ts.JsxEmit.ReactJSX } }).outputText
  vm.runInNewContext(code, { exports, require: requireModule, ...scope })
  return exports
}
const source = load('src/data/options.ts')
const selection = load('src/lib/equipment-selection.ts', id => { assert.equal(id, '@/data/options'); return source })
const ids = source.additionalOptions.filter(o => o.enabled).map(o => o.id)
assert.equal(ids.length, 19)
assert.equal(selection.equipmentSelection([...ids, ...ids, 'invalid']).selected.length, 19)
assert.equal(selection.equipmentSelection(ids).knownTotal, source.additionalOptions.filter(o => o.enabled).reduce((sum, o) => sum + (o.salePrice ?? 0), 0))
const reportedCase=selection.equipmentSelection(['floor','decor','ermak']);assert.equal(reportedCase.selected.length,3);assert.equal(reportedCase.knownTotal,57900);for(const option of reportedCase.selected)assert(reportedCase.comment.includes(option.name));
const pair = selection.equipmentSelection(['boiler', 'tray', 'boiler'])
assert.equal(pair.selected.length, 2); assert.equal(pair.knownTotal, 37500); assert.equal(pair.unpricedCount, 1)
assert.equal(selection.equipmentSelection([]).comment, '')
assert.equal(selection.mergeConfigurationComment('Мой комментарий'), 'Мой комментарий')
assert.throws(() => selection.mergeConfigurationComment('x'.repeat(1500), pair.comment), /1500/)
// The visual release carries selections into a contact panel and clipboard.
// No lead submission is part of this release contract.
const jsx = (type, props) => ({ type, props })
function nodes(node){if(!node||typeof node!=='object')return [];return [node,...[node.props?.children].flat(Infinity).flatMap(nodes)]}
let contactState = [], contactHook = 0, copied = '', failClipboard = false
const contactReact = {
  useState: initial => { const index = contactHook++; return [contactState[index] ?? initial, next => { contactState[index] = next }] },
  useEffect: () => {}, useRef: value => ({ current: value }),
}
const contacts = load('src/components/forms/CTAFormInline.tsx', id => {
  if (id === 'react') return contactReact
  if (id === 'react/jsx-runtime') return { jsx, jsxs: jsx }
  if (id === '@/data') return { siteSettings: { phone: '+79000000000', phone2: '+79000000001', email: 'test@example.invalid', max: 'https://example.invalid/max', telegram: 'https://example.invalid/telegram' } }
  throw new Error('Unexpected contact dependency: ' + id)
}, { navigator: { clipboard: { writeText: async value => { if (failClipboard) throw new Error('Clipboard unavailable'); copied = value } } } })
function renderContacts(props) { contactHook = 0; return nodes(contacts.CTAFormInline(props)) }
const configurationNote = selection.equipmentSelection(ids).comment
const contactProps = { modelName: 'БГ-01', configurationNote }
let contactNodes = renderContacts(contactProps)
assert(!contactNodes.some(node => node.type === 'form' || node.type === 'input'), 'Contacts-only release must not render a lead form')
assert(contactNodes.some(node => node.props?.['data-release-profile'] === 'visual-contacts'))
const selectionText = contactNodes.find(node => node.type === 'p' && node.props?.children === 'Модель: БГ-01\n\n' + configurationNote)
assert(selectionText, 'Model and all selected option names must transfer to contact panel')
await contactNodes.find(node => node.type === 'button').props.onClick()
assert.equal(copied, 'Модель: БГ-01\n\n' + configurationNote)
assert(renderContacts(contactProps).some(node => node.props?.role === 'status' && node.props.children.includes('Текст скопирован')))
failClipboard = true
await renderContacts(contactProps).find(node => node.type === 'button').props.onClick()
assert(renderContacts(contactProps).some(node => node.props?.role === 'status' && node.props.children.includes('Не удалось скопировать')))
contactState = []
assert(!renderContacts({}).some(node => node.type === 'button'), 'Empty selection has no copy control')
console.log('PASS: 19/19 options; canonical prices, deduplication, unpriced option, comment limit; contact-only selection transfer, clipboard success/failure and empty selection. No real requests sent.')

const baseData=load('src/data/equipment.ts');let uiHook=0;const uiState=[[],['Моечная']];
const uiReact={useState: initial=>{const n=uiHook++;return [uiState[n]??initial,next=>{uiState[n]=typeof next==='function'?next(uiState[n]):next}]},useRef:value=>({current:value})};
const ui=load('src/components/catalog/EquipmentConfigurator.tsx',id=>{
 if(id==='react')return uiReact;
 if(id==='react/jsx-runtime')return {jsx,jsxs:jsx};
 if(id==='@/data/equipment')return baseData;
 if(id==='@/data/options')return source;
 if(id==='@/lib/equipment-selection')return selection;
 if(id==='@/lib/analytics')return {trackGoal:()=>{}};
 if(id==='@/components/forms/CTAFormInline')return {CTAFormInline:'test-form'};
 if(id==='./InteriorExecutionGallery')return {InteriorExecutionGallery:'test-interior-gallery'};
 if(id.endsWith('.module.css'))return {default:new Proxy({},{get:(_,key)=>String(key)})};
 throw new Error(id);
});
function renderUI(){uiHook=0;return nodes(ui.EquipmentConfigurator())}
function snapshot(){const all=renderUI(),summary=all.find(n=>n.props?.['data-selected-count']!==undefined),form=all.find(n=>n.type==='test-form');return {all,summary,form}}
for(const id of ['floor','decor','ermak']){const state=snapshot();const option=source.additionalOptions.find(o=>o.id===id);const input=state.all.find(n=>n.type==='input'&&n.props['aria-label']==='Добавить: '+option.name);input.props.onChange()}
let rendered=snapshot();assert.equal(rendered.summary.props['data-selected-count'],3);assert.equal(rendered.summary.props['data-additional-total'],57900);assert(rendered.form.props.configurationNote.includes('Проливной пол'));
const remove=rendered.all.find(n=>n.type==='button'&&n.props['aria-label']==='Убрать: Печь Ермак 12 ПС');remove.props.onClick();rendered=snapshot();assert.equal(rendered.summary.props['data-selected-count'],2);assert.equal(rendered.summary.props['data-additional-total'],33400);
rendered.all.find(n=>n.type==='button'&&n.props.className==='clear').props.onClick();rendered=snapshot();assert.equal(rendered.summary.props['data-selected-count'],0);assert.equal(rendered.summary.props['data-additional-total'],0);assert.equal(rendered.form.props.configurationNote,'');
console.log('PASS: component events from multiple categories + popular remove + reset update summary count/total and form from one canonical selection. Browser paint/translation still needs live verification.');
