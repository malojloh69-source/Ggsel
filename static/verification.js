/* Verification concerns virtual deals only; existing payout forms remain intact. */
window.GgselVerification = function (ctx) {
'use strict';
const {PG,A,api,go,render,refreshMe,getMe,getPage,esc,ico,busy,toast,closeSheet}=ctx;
const I=window.GgselI18n;
const S={
 note:['Сделки и баланс виртуальные. Переводы денег и передача подарков для верификации не нужны.','Deals and balances are virtual. Verification does not require money transfers or sending gifts.','Угоди й баланс віртуальні. Перекази грошей і передавання подарунків для верифікації не потрібні.'],
 virtualDeals:['Виртуальные сделки','Virtual deals','Віртуальні угоди'],
 wait:['Ожидает подтверждения','Awaiting approval','Очікує підтвердження'],
 requirement:['Нужны две завершённые виртуальные сделки, каждая от 1 000 ₽ в эквиваленте.','Complete two virtual deals, each worth the equivalent of RUB 1,000 or more.','Потрібні дві завершені віртуальні угоди, кожна від 1 000 ₽ в еквіваленті.'],
 after:['Затем администратор бесплатно подтвердит верификацию.','An administrator will then approve verification free of charge.','Потім адміністратор безкоштовно підтвердить верифікацію.'],
 locked:['Доступ временно ограничен','Access is temporarily restricted','Доступ тимчасово обмежено'],
 copy:['Две виртуальные сделки проверены. Для продолжения необходимо подтверждение администратора.','Your two virtual deals have been checked. An administrator must approve verification to continue.','Дві віртуальні угоди перевірено. Для продовження потрібне підтвердження адміністратора.'],
 refresh:['Проверить статус','Check status','Перевірити статус'],
 same:['Подтверждение пока не получено','Approval is still pending','Підтвердження ще не отримано'],
 equivalents:['Виртуальные эквиваленты','Virtual equivalents','Віртуальні еквіваленти'],
 equivalentsNote:['Фиксированные значения из макета для одной виртуальной сделки.','Fixed prototype values for one virtual deal.','Фіксовані значення з макета для однієї віртуальної угоди.'],
 done:['Верификация подтверждена','Verification approved','Верифікацію підтверджено'],
 doneCopy:['Проверка завершена. Доступ восстановлен.','Verification is complete. Access has been restored.','Перевірку завершено. Доступ відновлено.'],
 admin:['Верификация','Verification','Верифікація'],
 qualified:['Подходящие виртуальные сделки','Qualifying virtual deals','Відповідні віртуальні угоди'],
 approve:['Подтвердить верификацию','Approve verification','Підтвердити верифікацію'],
 disabled:['Верификация сейчас недоступна','Verification is currently unavailable','Верифікація зараз недоступна'],
};
const tr=key=>S[key][{ru:0,en:1,uk:2}[I.lang]];
const note=()=>`<aside class="verification-demo" role="note"><span>${tr('note')}</span></aside>`;
const video=name=>`<video class="anim verification-animation" autoplay loop muted playsinline preload="metadata" aria-hidden="true" src="/static/assets/animations/${name}.webm"></video>`;
const title=()=>`<h1>${I.t('verification')}</h1>`;
const status=()=>getMe()?.verification;
const pageNames=new Set(['verification','verification-currencies']);
function screen(s){
 if(!s?.enabled)return `<section class="verification-page">${title()}<p>${tr('disabled')}</p></section>`;
 const done=s.stage==='verified'||s.stage==='exempt';
 const support=s.stage==='support';
 const count=Math.min(s.qualified_deals,2);
 return `<section class="verification-page">${!support?`<button class="back" data-act="back">${ico('back')}${I.t('back')}</button>`:''}${title()}${note()}<div class="card center verification-card">
 ${video(done?'success':'warning')}<h2>${done?tr('done'):support?tr('locked'):I.t('dealVerification')}</h2>
 <p class="mut">${done?tr('doneCopy'):support?tr('copy'):tr('requirement')}</p>
 ${!done&&!support?`<div class="row"><span>${tr('qualified')}</span><b>${count} / 2</b></div><progress max="2" value="${count}" aria-label="${esc(tr('qualified'))}"></progress><p class="hint">${tr('after')}</p><button class="btn" disabled>${I.t('withdrawUnavailable')}</button><button class="btn s" data-act="go" data-arg="verification-currencies">${I.t('otherCurrencies')}</button><button class="text-button verification-return" data-act="tab" data-arg="deals">${I.t('myDeals')}</button>`:''}
 ${support?`${s.support?`<p class="verification-contact" data-user-text>@${esc(s.support)}</p><button class="btn" data-act="support">${I.t('writeSupport')}</button>`:''}<button class="btn s" data-act="verificationRefresh">${tr('refresh')}</button><button class="text-button verification-return" data-act="language">${I.text('Язык интерфейса')}</button>`:''}
 ${done?`<button class="btn" data-act="go" data-arg="payout-methods">${I.t('goWithdraw')}</button>`:''}
 </div></section>`;
}
PG.verification=async()=>{await refreshMe();return screen(status())};
PG['verification-currencies']=async()=>{await refreshMe();const s=status();if(!s?.enabled||s.stage==='support'||s.stage==='verified')return screen(s);return `<section class="verification-page"><button class="back" data-act="back">${ico('back')}${I.t('back')}</button><h1>${tr('equivalents')}</h1>${note()}<p class="mut">${tr('equivalentsNote')}</p><div class="card summary">${Object.entries(s.thresholds).map(([currency,value])=>`<div class="summary-row"><span>${currency}</span><b>${Number(value).toLocaleString(I.locale,{maximumFractionDigits:8})}</b></div>`).join('')}</div></section>`};
for(const name of Object.keys(PG).filter(name=>name.startsWith('payout-')||name==='reqs')){
 const original=PG[name];
 PG[name]=async(...args)=>{await refreshMe();const s=status();return s?.stage==='deals'||s?.locked?screen(s):original(...args)};
}
A.verificationRefresh=(_,button)=>busy(button,async()=>{await refreshMe();if(status()?.locked)toast(tr('same'));await render()});
A.averify=(uid,button)=>busy(button,async()=>{await api(`/admin/users/${uid}/verify`,{method:'POST'});toast(tr('done'));await render()});
function admin(s,uid){if(!s?.enabled||['none','disabled','exempt'].includes(s.stage))return '';return `<section class="verification-admin"><b>${tr('admin')}</b><div class="row"><span>${tr('qualified')}</span><b>${Math.min(s.qualified_deals,2)} / 2</b></div><p class="mut">${s.stage==='verified'?tr('done'):s.locked?tr('wait'):tr('requirement')}</p>${s.locked?`<button class="btn sm" data-act="averify" data-arg="${uid}">${tr('approve')}</button>`:''}</section>`}
function guard(name){if(status()?.locked&&!pageNames.has(name)){closeSheet();go('verification');return true}return false}
function handleError(error){if(!error.verification)return false;if(getMe())getMe().verification=error.verification;closeSheet();go('verification');return true}
function afterRender(){const locked=!!status()?.locked;document.getElementById('nav').hidden=locked;document.body.classList.toggle('verification-locked',locked);if(locked)window.Telegram?.WebApp?.BackButton?.hide();for(const el of document.querySelectorAll('.verification-page video')){if(matchMedia('(prefers-reduced-motion: reduce)').matches){el.autoplay=false;el.pause()}else el.play().catch(()=>{})}}
let checking=false;
async function check(){if(checking||document.hidden||!status()?.enabled)return;checking=true;try{const next=await api('/verification');const previous=JSON.stringify(status());getMe().verification=next;if(previous!==JSON.stringify(next)){if(next.locked&&!pageNames.has(getPage())){closeSheet();go('verification')}else if(pageNames.has(getPage()))await render()}}catch{/* An outage never unlocks the application. */}finally{checking=false}}
function start(){setInterval(check,5000);document.addEventListener('visibilitychange',()=>{if(!document.hidden)check()})}
return {guard,handleError,afterRender,admin,start};
};
