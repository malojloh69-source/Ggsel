/* Route guards, disclosure placement, translations and approval refresh without a browser. */
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const intervals = [];
const box = {
  window: {}, localStorage: {getItem: () => 'ru', setItem: () => {}},
  document: {hidden: false, addEventListener: () => {}},
  setInterval: callback => intervals.push(callback),
};
for (const file of ['i18n-uk.js', 'i18n.js', 'verification.js']) {
  vm.runInNewContext(fs.readFileSync('static/' + file, 'utf8'), box);
}
const I = box.window.GgselI18n;
let state = {enabled: true, stage: 'none', locked: false, qualified_deals: 0,
  thresholds: {RUB: '1000.00', STARS: '939'}, support: 'example_support'};
const me = {verification: state};
let current = 'home', rendered = 0, closed = 0, originalCalls = 0, nextState = state;
const destinations = [];
const PG = {home: async () => '<main>home</main>', 'payout-stars': async () => {originalCalls++; return '<form>stars</form>'}};
const A = {};
const UI = box.window.GgselVerification({
  PG, A, getMe: () => me, getPage: () => current,
  refreshMe: async () => {},
  api: async path => {assert.equal(path, '/verification'); return nextState},
  go: destination => {current = destination; destinations.push(destination)},
  render: async () => {rendered++}, closeSheet: () => {closed++},
  esc: value => String(value).replaceAll('<', '&lt;'), ico: () => '',
  busy: async (_, fn) => fn(), toast: () => {},
});
async function main() {
  assert.equal(await PG.home(), '<main>home</main>');
  assert.equal(await PG['payout-stars'](), '<form>stars</form>');
  assert.equal(UI.guard('home'), false);
  assert.equal(UI.admin({...state, stage: 'exempt'}, 2), '');
  for (const [language, title, demo] of [['ru', 'Верификация', 'Демо'], ['en', 'Verification', 'Demo'], ['uk', 'Верифікація', 'Демо']]) {
    I.set(language);
    me.verification = {...state, stage: 'deals', qualified_deals: 1};
    const first = await PG['payout-stars']();
    assert.match(first, new RegExp('<h1>' + title + '</h1>'));
    assert.match(first, new RegExp('<b>' + demo + '</b>'));
    assert.match(first, /progress max="2" value="1"/);
    assert.match(first, /data-arg="verification-currencies"/);
    assert.doesNotMatch(first, /supportCheck/);
    assert.doesNotMatch(first, /verification-phases|<ol|<li/);
    assert.doesNotMatch(UI.admin(me.verification, 2), /data-act="averify"/);
    me.verification = {...state, stage: 'support', locked: true, qualified_deals: 2};
    const second = await PG.verification();
    assert.match(second, /class="verification-demo"/);
    assert.match(second, /data-act="support"/);
    assert.doesNotMatch(second, /verification-phases|<ol|<li/);
    assert.doesNotMatch(second, /<progress/);
    assert.match(UI.admin(me.verification, 2), /data-act="averify" data-arg="2"/);
    assert.match(await PG['verification-currencies'](), /verification-contact/);
    assert.equal(UI.guard('home'), true);
    assert.equal(destinations.at(-1), 'verification');
    assert.equal(UI.guard('verification'), false);
    me.verification = {...state, stage: 'verified', qualified_deals: 2};
    const third = await PG.verification();
    assert.match(third, /class="verification-demo"/);
    assert.match(third, /data-arg="payout-methods"/);
    assert.doesNotMatch(third, /Оба этапа|Both steps|Обидва етапи/);
    assert.equal(await PG['payout-stars'](), '<form>stars</form>');
    assert.doesNotMatch(UI.admin(me.verification, 2), /data-act="averify"/);
    assert.equal(await PG.home(), '<main>home</main>');
  }
  assert.equal(originalCalls, 4);
  // A lock received from the server closes existing forms and routes to verification.
  assert.equal(UI.handleError(new Error('offline')), false);
  assert.equal(UI.handleError({verification: {...state, stage: 'support', locked: true}}), true);
  assert.ok(closed > 0);
  assert.equal(current, 'verification');
  UI.start();
  assert.equal(intervals.length, 1);
  nextState = {...state, stage: 'verified', qualified_deals: 2, approved_at: 1};
  await intervals[0]();
  assert.equal(me.verification.locked, false);
  assert.equal(rendered, 1, 'Remote administrator approval refreshes the locked screen');
  assert.equal(UI.guard('home'), false);
  console.log('Verification routes, demo placement, RU/EN/UK screens and approval refresh passed');
}
main().catch(error => {console.error(error); process.exitCode = 1});
