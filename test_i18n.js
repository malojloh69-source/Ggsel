/* Language persistence, dynamic text and complete Ukrainian dictionary coverage. */
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
let saved='uk';
const box={window:{},localStorage:{getItem:()=>saved,setItem:(_,value)=>{saved=value}}};
vm.runInNewContext(fs.readFileSync('static/i18n-uk.js','utf8'),box);
vm.runInNewContext(fs.readFileSync('static/i18n.js','utf8').replace('window.GgselI18n=','window.__dictionary={D,M};window.GgselI18n='),box);
const I=box.window.GgselI18n;
assert.equal(I.lang,'uk');assert.equal(I.hasSavedLanguage,true);assert.equal(I.locale,'uk-UA');assert.equal(I.languageName,'Українська');
assert.equal(I.t('withdrawTitle'),'Виведення коштів');
assert.equal(I.t('banksCount',{count:42}),'Знайдено банків: 42');
assert.equal(I.text('Сделка · код 123456'),'Угода · код 123456');
assert.equal(I.text('Оборот'),'Оборот');
assert.equal(I.text('Реальные платежи не подключены.'),'Реальні платежі не підключено.');
for(const language of ['ru','en','uk']){I.set(language);assert.equal(saved,language);assert.equal(I.lang,language)}
I.set('en');assert.equal(I.t('withdrawTitle'),'Withdraw funds');
I.set('ru');assert.equal(I.t('withdrawTitle'),'Вывод средств');
I.set('uk');I.set('invalid');assert.equal(I.lang,'uk');
const {D,M}=box.window.__dictionary;
const missing=[...new Set([...Object.values(D).map(pair=>pair[1]),...Object.values(M)])].filter(value=>!box.window.GgselUkrainian[value]);
assert.deepEqual(missing,[],'Every source string needs a Ukrainian translation');
for(const initial of [null,'invalid']){
 const fresh={window:{},localStorage:{getItem:()=>initial,setItem:()=>{}}};
 vm.runInNewContext(fs.readFileSync('static/i18n-uk.js','utf8'),fresh);
 vm.runInNewContext(fs.readFileSync('static/i18n.js','utf8'),fresh);
 assert.equal(fresh.window.GgselI18n.hasSavedLanguage,false);
 fresh.window.GgselI18n.set('en');assert.equal(fresh.window.GgselI18n.hasSavedLanguage,true);
}
console.log('RU/EN/UK language and saved-selection checks passed');
