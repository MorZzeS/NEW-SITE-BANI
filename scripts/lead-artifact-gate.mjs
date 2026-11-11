import ts from 'typescript'
import { createHash } from 'node:crypto'

const isNextStaticChunk = path => /(?:^|\/)_next\/static\/chunks\//.test(path.replaceAll('\\', '/'))

export function leadArtifactFileAllowed(path, content, enabled) {
  if (content.includes('banger-leads.onrender.com')) return false
  if (!path.endsWith('.html')) return true
  const hasForm = /<form\b/i.test(content)
  if (!enabled && hasForm) return false
  if (enabled && hasForm && !content.includes('data-release-profile="online-leads"')) return false
  if (enabled && hasForm && [...content.matchAll(/<(?:form|button|input)\b([^>]*)>/gi)].some(([, attributes]) => /\b(?:form)?action\s*=|\bmethod\s*=/i.test(attributes))) return false
  return true
}

function propertyString(object, name) {
  if (!object || !ts.isObjectLiteralExpression(object)) return undefined
  for (const property of object.properties) {
    if (!ts.isPropertyAssignment(property)) continue
    const key = property.name
    const keyName = ts.isIdentifier(key) || ts.isStringLiteral(key) ? key.text : undefined
    if (keyName === name && (ts.isStringLiteral(property.initializer) || ts.isNoSubstitutionTemplateLiteral(property.initializer))) return property.initializer.text
  }
  return undefined
}

function fetchMethod(call) {
  if (call.arguments.length < 2) return 'GET'
  const options = call.arguments[1]
  if (!ts.isObjectLiteralExpression(options) || options.properties.some(property => ts.isSpreadAssignment(property))) return undefined
  let method
  for (const property of options.properties) {
    if (!ts.isPropertyAssignment(property)) {
      if (ts.isShorthandPropertyAssignment(property) && property.name.text === 'method') return undefined
      if (ts.isSpreadAssignment(property) || (property.name && ts.isComputedPropertyName(property.name))) return undefined
      if ((ts.isMethodDeclaration(property) || ts.isGetAccessorDeclaration(property) || ts.isSetAccessorDeclaration(property)) && property.name) {
        if (ts.isIdentifier(property.name) || ts.isStringLiteral(property.name)) {
          if (property.name.text === 'method') return undefined
        } else return undefined
      }
      continue
    }
    const key = property.name
    const keyName = ts.isIdentifier(key) || ts.isStringLiteral(key) ? key.text : undefined
    if (ts.isComputedPropertyName(key)) {
      if (ts.isStringLiteral(key.expression) && key.expression.text === 'method') {
        if (!ts.isStringLiteral(property.initializer) && !ts.isNoSubstitutionTemplateLiteral(property.initializer)) return undefined
        method = property.initializer.text.toUpperCase()
      } else if (ts.isStringLiteral(key.expression) || (ts.isPropertyAccessExpression(key.expression) && /_HEADER$/.test(key.expression.name.text))) {
        continue
      } else return undefined
    } else if (keyName === 'method') {
      if (!ts.isStringLiteral(property.initializer) && !ts.isNoSubstitutionTemplateLiteral(property.initializer)) return undefined
      method = property.initializer.text.toUpperCase()
    }
  }
  return method || 'GET'
}

function isFetchCall(node) {
  return ts.isCallExpression(node) && ts.isIdentifier(node.expression) && node.expression.text === 'fetch'
}

function isUnsupportedFetchAccessCall(node) {
  if (!ts.isCallExpression(node)) return false
  const expression = node.expression
  if (ts.isPropertyAccessExpression(expression) && expression.name.text === 'fetch') return true
  if (!ts.isElementAccessExpression(expression)) return false
  const receiver = expression.expression
  const property = expression.argumentExpression
  const globalReceiver = ts.isIdentifier(receiver) && ['globalThis', 'window', 'self'].includes(receiver.text)
  return globalReceiver && (!property || !ts.isStringLiteral(property) || property.text === 'fetch')
}

function isNextServerActionPost(file, call) {
  const target = call.arguments[0]
  const options = call.arguments[1]
  if (!isNextStaticChunk(file.path) || !target || !ts.isPropertyAccessExpression(target) || target.name.text !== 'canonicalUrl' || !options || !ts.isObjectLiteralExpression(options)) return false
  let hasActionHeader = false
  function visit(node) {
    if (ts.isPropertyAssignment(node) && ts.isComputedPropertyName(node.name) && ts.isPropertyAccessExpression(node.name.expression) && node.name.expression.name.text === 'ACTION_HEADER') hasActionHeader = true
    ts.forEachChild(node, visit)
  }
  visit(options)
  return hasActionHeader
}

function isNextRouterDataRequest(file, call) {
  const options = call.arguments[1]
  const isMainChunk = /(?:^|[\\/])main-[^\\/]+\.js$/.test(file.path)
  if (!isMainChunk || !ts.isIdentifier(call.arguments[0]) || !options || !ts.isObjectLiteralExpression(options)) return false
  const methodProperty = options.properties.find(property => ts.isPropertyAssignment(property) && property.name.getText() === 'method')
  const credentialsProperty = options.properties.find(property => ts.isPropertyAssignment(property) && property.name.getText() === 'credentials')
  const headersProperty = options.properties.find(property => ts.isPropertyAssignment(property) && property.name.getText() === 'headers')
  const method = methodProperty?.initializer
  const hasNextDataHeader = headersProperty && ts.isCallExpression(headersProperty.initializer) && headersProperty.initializer.arguments.some(argument => ts.isObjectLiteralExpression(argument) && argument.properties.some(property => ts.isPropertyAssignment(property) && (ts.isStringLiteral(property.name) || ts.isIdentifier(property.name)) && property.name.text.toLowerCase() === 'x-nextjs-data'))
  return Boolean(method && ts.isBinaryExpression(method) && method.operatorToken.kind === ts.SyntaxKind.BarBarToken && ts.isStringLiteral(method.right) && method.right.text.toUpperCase() === 'GET' && credentialsProperty && ts.isStringLiteral(credentialsProperty.initializer) && credentialsProperty.initializer.text === 'same-origin' && hasNextDataHeader)
}

function hasRequestObjectInitializer(expression, source) {
  if (!ts.isIdentifier(expression)) return ts.isNewExpression(expression) && ts.isIdentifier(expression.expression) && expression.expression.text === 'Request'
  let found = false
  function visit(node) {
    if (ts.isVariableDeclaration(node) && ts.isIdentifier(node.name) && node.name.text === expression.text && node.initializer && ts.isNewExpression(node.initializer) && ts.isIdentifier(node.initializer.expression) && node.initializer.expression.text === 'Request') found = true
    ts.forEachChild(node, visit)
  }
  visit(source)
  return found
}

function isJsPdfCreateImageFetch(call) {
  for (let node = call.parent; node; node = node.parent) {
    if (ts.isPropertyAssignment(node) && (ts.isIdentifier(node.name) || ts.isStringLiteral(node.name)) && node.name.text === 'createImage') return true
    if (ts.isSourceFile(node)) break
  }
  return false
}

function isSafeCompiledGetTarget(file, call, source) {
  const target = call.arguments[0]
  if (!target || hasRequestObjectInitializer(target, source)) return false
  if ((ts.isStringLiteral(target) || ts.isNoSubstitutionTemplateLiteral(target)) && target.text.startsWith('/')) return true
  if (ts.isTemplateExpression(target) && target.head.text.startsWith('/')) return true
  if (ts.isNewExpression(target) && ts.isIdentifier(target.expression) && target.expression.text === 'URL') return true
  if (ts.isCallExpression(target) && target.arguments.some(argument => (ts.isStringLiteral(argument) || ts.isNoSubstitutionTemplateLiteral(argument)) && argument.text.startsWith('/'))) return true
  if (isJsPdfCreateImageFetch(call)) return true
  if (isNextRouterDataRequest(file, call)) return true
  const options = call.arguments[1]
  if (ts.isIdentifier(target) && options && ts.isObjectLiteralExpression(options) && isNextStaticChunk(file.path)) {
    const credentials = options.properties.find(property => ts.isPropertyAssignment(property) && property.name.getText(source) === 'credentials')
    const hasBody = options.properties.some(property => ts.isPropertyAssignment(property) && property.name.getText(source) === 'body')
    return Boolean(credentials && ts.isStringLiteral(credentials.initializer) && credentials.initializer.text === 'same-origin' && !hasBody)
  }
  return false
}

/**
 * Keep the browser's only POST transport on the reviewed lead client. Other
 * application fetches must remain GETs (or omit method, whose default is GET).
 * This prevents a second form handler from bypassing the gated endpoint.
 */
export function sourceLeadTransportAllowed(files) {
  let approvedLeadPostCount = 0
  let approvedFormCount = 0
  for (const file of files) {
    const scriptKind = /\.(?:tsx|jsx)$/.test(file.path) ? ts.ScriptKind.TSX : /\.(?:js|mjs)$/.test(file.path) ? ts.ScriptKind.JS : ts.ScriptKind.TS
    const source = ts.createSourceFile(file.path, file.content, ts.ScriptTarget.Latest, true, scriptKind)
    let allowed = true
    if (source.parseDiagnostics.length) allowed = false
    function visit(node) {
      if (isFetchCall(node)) {
        const method = fetchMethod(node)
        if (file.path.replaceAll('\\', '/') === 'src/lib/leads.ts' || file.path.replaceAll('\\', '/').endsWith('/src/lib/leads.ts')) {
          const target = node.arguments[0]
          const approvedTarget = target && (ts.isIdentifier(target) && target.text === 'leadEndpoint'
            || ts.isBinaryExpression(target) && target.operatorToken.kind === ts.SyntaxKind.BarBarToken
              && target.left.getText(source) === 'process.env.NEXT_PUBLIC_LEADS_ENDPOINT'
              && ts.isStringLiteral(target.right) && target.right.text === '')
          if (method !== 'POST' || !approvedTarget) allowed = false
          else approvedLeadPostCount++
        } else if (method !== 'GET' || !node.arguments[0] || !isSafeSourceGetTarget(node.arguments[0])) allowed = false
      }
      if (isUnsupportedFetchAccessCall(node)) allowed = false
      if (ts.isIdentifier(node) && node.text === 'fetch' && !(ts.isCallExpression(node.parent) && node.parent.expression === node)) allowed = false
      if (ts.isCallExpression(node) && ts.isPropertyAccessExpression(node.expression) && ['submit', 'requestSubmit'].includes(node.expression.name.text)) allowed = false
      if (ts.isCallExpression(node) && ts.isPropertyAccessExpression(node.expression) && node.expression.name.text === 'post') allowed = false
      if (ts.isIdentifier(node) && ['XMLHttpRequest', 'axios', 'ky', 'superagent'].includes(node.text)) allowed = false
      if (ts.isCallExpression(node) && ts.isPropertyAccessExpression(node.expression) && node.expression.name.text === 'setAttribute' && (ts.isStringLiteral(node.arguments[0]) || ts.isNoSubstitutionTemplateLiteral(node.arguments[0])) && ['action', 'formaction'].includes(node.arguments[0].text.toLowerCase())) allowed = false
      if ((ts.isJsxOpeningElement(node) || ts.isJsxSelfClosingElement(node)) && ts.isIdentifier(node.tagName) && node.tagName.text.toLowerCase() === 'form') {
        const allowedFormFile = file.path.replaceAll('\\', '/') === 'src/components/forms/OnlineLeadForm.tsx' || file.path.replaceAll('\\', '/').endsWith('/src/components/forms/OnlineLeadForm.tsx')
        const attributes = node.attributes.properties.filter(ts.isJsxAttribute)
        const forbidden = attributes.some(attribute => ['action', 'method', 'formAction', 'formMethod'].includes(attribute.name.getText(source)))
        const onSubmit = attributes.find(attribute => attribute.name.getText(source) === 'onSubmit')
        const usesApprovedHandler = onSubmit && onSubmit.initializer && ts.isJsxExpression(onSubmit.initializer) && onSubmit.initializer.expression && ts.isIdentifier(onSubmit.initializer.expression) && onSubmit.initializer.expression.text === 'submit'
        if (!allowedFormFile || forbidden || !usesApprovedHandler) allowed = false
        approvedFormCount++
      }
      if (file.path.replaceAll('\\', '/').endsWith('/src/components/forms/OnlineLeadForm.tsx') && ts.isVariableDeclaration(node) && ts.isIdentifier(node.name) && node.name.text === 'submit' && node.initializer) {
        let callsSendLead = false
        function findSendLead(candidate) {
          if (ts.isCallExpression(candidate) && ts.isIdentifier(candidate.expression) && candidate.expression.text === 'sendLead') callsSendLead = true
          ts.forEachChild(candidate, findSendLead)
        }
        findSendLead(node.initializer)
        if (!callsSendLead) allowed = false
      }
      if (ts.isNewExpression(node) && ts.isIdentifier(node.expression) && node.expression.text === 'XMLHttpRequest') allowed = false
      if (ts.isPropertyAccessExpression(node) && node.name.text === 'sendBeacon') allowed = false
      if (ts.isCallExpression(node) && ts.isPropertyAccessExpression(node.expression) && node.expression.name.text === 'post' && ts.isIdentifier(node.expression.expression) && ['axios', 'ky'].includes(node.expression.expression.text)) allowed = false
      ts.forEachChild(node, visit)
    }
    visit(source)
    if (!allowed) return false
  }
  return approvedLeadPostCount === 1 && approvedFormCount === 1
}

function isSafeSourceGetTarget(expression) {
  if ((ts.isStringLiteral(expression) || ts.isNoSubstitutionTemplateLiteral(expression)) && expression.text.startsWith('/')) return true
  if (ts.isTemplateExpression(expression) && expression.head.text.startsWith('/')) return true
  if (ts.isCallExpression(expression) && ts.isIdentifier(expression.expression) && expression.expression.text === 'withBasePath') {
    const base = expression.arguments[0]
    return Boolean((ts.isStringLiteral(base) || ts.isNoSubstitutionTemplateLiteral(base)) && base.text.startsWith('/'))
  }
  return false
}

export function compiledLeadEndpointPresent(files, endpoint) {
  let approvedPostCount = 0
  for (const file of files.filter(file => file.path.endsWith('.js'))) {
    // The locked canvg dependency includes two GET-only member calls that load SVG as text.
    // Permit those calls only in the exact reviewed Next chunk.
    const reviewedCanvg = isNextStaticChunk(file.path) &&
      ['fe2292408e7501841871b21337c872ff4744d29efe91b8b45114df3f4a915b9a', '09616de0cdcb16eb4cd05a7db84f45e2f3b711e2501651e33ba7a6ff18416752'].includes(createHash('sha256').update(file.content).digest('hex'))
    const source = ts.createSourceFile(file.path, file.content, ts.ScriptTarget.Latest, true, ts.ScriptKind.JS)
    let allowed = true
    if (source.parseDiagnostics.length) allowed = false
    function visit(node) {
      if (isUnsupportedFetchAccessCall(node) && !reviewedCanvg) allowed = false
      if (isFetchCall(node)) {
        const method = fetchMethod(node)
        if (method === undefined) {
          if (!isNextRouterDataRequest(file, node)) allowed = false
        } else if (method === 'POST') {
          if (node.arguments[0] && ts.isStringLiteral(node.arguments[0]) && node.arguments[0].text === endpoint) approvedPostCount++
          else if (!isNextServerActionPost(file, node)) allowed = false
        } else if (method === 'GET') {
          if (!isSafeCompiledGetTarget(file, node, source)) allowed = false
        } else allowed = false
      }
      ts.forEachChild(node, visit)
    }
    visit(source)
    if (!allowed) return false
  }
  return approvedPostCount > 0
}
