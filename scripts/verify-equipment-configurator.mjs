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
const logistics = load('src/lib/logistics.ts')
const selection = load('src/lib/equipment-selection.ts', id => {
  if (id === '@/data/options') return source
  if (id === '@/lib/logistics') return logistics
  throw new Error('Unexpected equipment selection dependency: ' + id)
})
const ids = source.additionalOptions.filter(o => o.enabled).map(o => o.id)
assert.equal(ids.length, 27)
assert.equal(selection.equipmentSelection([...ids, ...ids, 'invalid']).selected.length, 27)
const allSelection = selection.equipmentSelection(ids)
assert.equal(allSelection.knownTotal, source.additionalOptions.filter(o => o.enabled && !['delivery', 'crane-unload'].includes(o.id)).reduce((sum, o) => sum + (o.salePrice ?? 0), 0), 'logistics prices stay out until the Ramensky district is selected')
assert.equal(allSelection.unpricedCount, 3, 'larch flooring and both district-priced services need confirmation by default')
assert.equal(source.additionalOptions.filter(option => /санузел/i.test(option.name)).length, 1, 'the existing sanitary option must not be duplicated')
for (const id of ['delivery', 'crane-unload']) {
  const option = source.additionalOptions.find(o => o.id === id)
  assert.equal(logistics.resolveOptionPrice(option, 'ramenskoe'), option.salePrice, `${id}: Ramensky tariff is fixed`)
  assert.equal(logistics.resolveOptionPrice(option, 'outside'), null, `${id}: outside the district is individually calculated`)
  assert.equal(logistics.resolveOptionPrice(option, 'unknown'), null, `${id}: missing district is individually calculated`)
}
const reportedCase=selection.equipmentSelection(['floor','decor','ermak']);assert.equal(reportedCase.selected.length,3);assert.equal(reportedCase.knownTotal,57900);for(const option of reportedCase.selected)assert(reportedCase.comment.includes(option.name));
const pair = selection.equipmentSelection(['boiler', 'larch-wash', 'boiler'])
assert.equal(pair.selected.length, 2); assert.equal(pair.knownTotal, 37500); assert.equal(pair.unpricedCount, 1)
const tray = source.additionalOptions.find(option => option.id === 'tray')
assert.equal(tray.name, 'Душевой поддон со шторкой и выводом воды')
assert.equal(tray.salePrice, 18000)
assert.equal(selection.equipmentSelection([]).comment, '')
assert.equal(selection.equipmentSelection(['ceiling-height'], { 'ceiling-height': 0 }).selected.length, 0, '0 cm means no height option is selected')
assert.equal(selection.equipmentSelection(['ceiling-height'], { 'ceiling-height': 2 }).knownTotal, 44_000, '20 cm is the maximum height increase')
assert.equal(selection.equipmentSelection(['ceiling-height'], { 'ceiling-height': 3 }).knownTotal, 44_000, 'steps above 20 cm are clamped')
assert.equal(selection.mergeConfigurationComment('Мой комментарий'), 'Мой комментарий')
assert.throws(() => selection.mergeConfigurationComment('x'.repeat(1500), pair.comment), /1500/)
// The visual release carries selections into a contact panel and clipboard.
// No lead submission is part of this release contract.
const jsx = (type, props) => ({ type, props })
function nodes(node){if(!node||typeof node!=='object')return [];const component=typeof node.type==='function'?node.type(node.props):null;return [node,...(component?[component].flatMap(nodes):[]),...[node.props?.children].flat(Infinity).flatMap(nodes)]}
let district = 'unknown', address = ''
const deliveryFields = load('src/components/catalog/DeliveryFields.tsx', id => {
  if (id === 'react/jsx-runtime') return { jsx, jsxs: jsx }
  throw new Error('Unexpected delivery fields dependency: ' + id)
})
const deliveryNodes = nodes(deliveryFields.DeliveryFields({ id: 'audit', district, address, onDistrict: value => { district = value }, onAddress: value => { address = value } }))
const districtSelect = deliveryNodes.find(node => node.type === 'select')
assert.deepEqual(JSON.parse(JSON.stringify(districtSelect.props.children.map(option => option.props.value))), ['unknown', 'ramenskoe', 'outside'])
districtSelect.props.onChange({ target: { value: 'outside' } })
assert.equal(district, 'outside', 'the tariff district is a manual selection')
const addressInput = deliveryNodes.find(node => node.type === 'input')
addressInput.props.onChange({ target: { value: 'Раменское' } })
assert.equal(address, 'Раменское')
assert.equal(district, 'outside', 'free-text address must not infer or override the selected district')
assert(deliveryNodes.some(node => node.type === 'p' && JSON.stringify(node.props.children).includes('индивидуальный расчёт')))
let contactState = [], contactHook = 0, copied = '', failClipboard = false
const contactReact = {
  useState: initial => { const index = contactHook++; return [contactState[index] ?? initial, next => { contactState[index] = next }] },
  useEffect: () => {}, useRef: value => ({ current: value }),
}
const contacts = load('src/components/forms/CTAFormInline.tsx', id => {
  if (id === 'react') return contactReact
  if (id === 'react/jsx-runtime') return { jsx, jsxs: jsx }
  if (id === '@/data') return { siteSettings: { phone: '+79000000000', phone2: '+79000000001', email: 'test@example.invalid', max: 'https://example.invalid/max', telegram: 'https://example.invalid/telegram' } }
  if (id === '@/lib/release-policy') return { releasePolicy: { onlineLeads: false } }
  if (id === '@/lib/lead-topics') return { LEAD_TOPIC_EVENT: 'test-lead-topic' }
  if (id === './OnlineLeadForm') return { OnlineLeadForm: 'test-online-lead-form' }
  throw new Error('Unexpected contact dependency: ' + id)
}, { navigator: { clipboard: { writeText: async value => { if (failClipboard) throw new Error('Clipboard unavailable'); copied = value } } } })
function renderContacts(props) { contactHook = 0; const component = contacts.CTAFormInline(props); return nodes(component.type(component.props)) }
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
console.log('PASS: 27/27 options; historical prices, exact new options, district-dependent logistics, deduplication, unpriced items, comment limit; contact-only selection transfer and clipboard success/failure. No real requests sent.')

const baseData=load('src/data/equipment.ts');let uiHook=0;const uiState=[[],{},'unknown','',['Моечная']];
const uiReact={useState: initial=>{const n=uiHook++;return [uiState[n]??initial,next=>{uiState[n]=typeof next==='function'?next(uiState[n]):next}]},useRef:value=>({current:value})};
const ui=load('src/components/catalog/EquipmentConfigurator.tsx',id=>{
 if(id==='react')return uiReact;
 if(id==='react/jsx-runtime')return {jsx,jsxs:jsx};
 if(id==='next/image')return {default:'test-image'};
 if(id==='@/lib/logistics')return logistics;
 if(id==='@/lib/site-path')return {withBasePath:value=>value};
 if(id==='@/data/option-guidance')return load('src/data/option-guidance.ts');
 if(id==='@/data/equipment')return baseData;
 if(id==='@/data/options')return source;
 if(id==='@/lib/equipment-selection')return selection;
 if(id==='@/lib/analytics')return {trackGoal:()=>{}};
 if(id==='@/components/forms/CTAFormInline')return {CTAFormInline:'test-form'};
 if(id==='./DeliveryFields')return {DeliveryFields:'test-delivery-fields'};
 if(id==='./ConfigurationOption')return {ConfigurationCategoryTitle:props=>jsx('span',{children:props.name}),ConfigurationOption:props=>jsx('article',{children:jsx('input',{type:'checkbox','aria-label':'Добавить: '+props.option.name,onChange:props.onToggle})})};
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
