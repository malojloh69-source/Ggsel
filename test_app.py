"""Run: python -m unittest -v test_app. Uses only temporary databases."""
import os,tempfile,unittest,json,time,hmac,hashlib,sqlite3
from urllib.parse import urlencode
from concurrent.futures import ThreadPoolExecutor
_tmp=tempfile.TemporaryDirectory()
os.environ['DEV_MODE']='1'
os.environ['PAYMENT_MODE']='sandbox'
os.environ['DB_PATH']=os.path.join(_tmp.name,'tests.db')
from main import app,verify_init_data,webhook_secret,register_webhook,deal_view
import config,database as db
import bot
from unittest.mock import patch

class DealTests(unittest.TestCase):
 def setUp(self):
  self.c=app.test_client()
  with db.tx() as c:
   for table in ['deal_events','reviews','site_reviews','promo_claims','txs','requisites','deals','balances','admins','users']:
    c.execute('DELETE FROM '+table)
  db.grant_admin(1)
  config.DEV_MODE=True;config.PAYMENT_MODE='sandbox'
 def req(self,path,uid=1,method='GET',data=None):
  return self.c.open(path,method=method,json=data,headers={'X-Dev-User':str(uid)})
 def create(self,role='seller',uid=1):
  r=self.req('/api/deals',uid,'POST',{'role':role,'amount':'125.50','currency':'RUB','description':'NFT-подарок','nft':['https://t.me/nft/SpyAgaric-27641']})
  self.assertEqual(r.status_code,200,r.json)
  return r.json['id']
 def act(self,d,a,u=1):return self.req(f'/api/deals/{d}/{a}',u,'POST')
 def fund(self,u=2):return self.req('/api/sandbox/fund',u,'POST',{'amount':'1000','currency':'RUB'})
 def paid(self):
  d=self.create();self.act(d,'join',2);self.fund();self.assertEqual(self.act(d,'pay',2).status_code,200);return d
 def test_complete_shared_deal_and_live(self):
  d=self.create();self.assertEqual(len(d),24)
  self.assertIn(d,self.req('/api/deals/'+d).json['link'])
  self.assertEqual(self.act(d,'join',2).json['status'],'waiting_payment')
  self.assertEqual(self.act(d,'pay',1).status_code,409)
  self.assertEqual(self.act(d,'pay',2).status_code,400)
  self.fund()
  self.assertEqual(self.act(d,'pay',2).json['status'],'paid')
  self.assertEqual(self.req('/api/deals/'+d).json['status'],'paid')
  self.assertEqual(self.act(d,'pay',2).status_code,409)
  self.assertEqual(self.act(d,'confirm',1).status_code,409)
  self.assertEqual(self.act(d,'confirm',2).json['status'],'completed')
  self.assertEqual(self.act(d,'confirm',2).status_code,409)
  self.assertEqual(self.req('/api/me').json['balances']['RUB'],'125.5')
  self.assertEqual(self.req('/api/me',2).json['balances']['RUB'],'874.5')
  live=self.req('/api/live').json
  self.assertEqual(live['items'][0]['number'],'27641')
  self.assertEqual(len(self.req('/api/deals/'+d).json['events']),4)
 def test_third_party_denied_after_join(self):
  d=self.create();self.act(d,'join',2)
  self.assertEqual(self.req('/api/deals/'+d,3).status_code,403)
  self.assertEqual(self.act(d,'join',3).status_code,409)
  self.assertEqual(self.req('/api/live',3).json['items'],[])
 def test_buyer_created_deal(self):
  d=self.create('buyer',2);self.assertEqual(self.act(d,'join',1).status_code,200)
  self.fund();self.assertEqual(self.act(d,'pay',2).status_code,200)
 def test_refund_once(self):
  d=self.paid();self.assertEqual(self.act(d,'refund',1).status_code,200)
  self.assertEqual(self.act(d,'refund',1).status_code,409)
  self.assertEqual(self.req('/api/me',2).json['balances']['RUB'],'1000')
  self.assertEqual(self.req('/api/live').json['items'],[])
 def test_concurrent_payment_and_release(self):
  d=self.create();self.act(d,'join',2);self.fund()
  def act(a):
   with app.test_client() as c:return c.post(f'/api/deals/{d}/{a}',headers={'X-Dev-User':'2'}).status_code
  with ThreadPoolExecutor(max_workers=2) as pool:self.assertEqual(sorted(pool.map(act,['pay','pay'])),[200,409])
  with ThreadPoolExecutor(max_workers=2) as pool:self.assertEqual(sorted(pool.map(act,['confirm','confirm'])),[200,409])
  self.assertEqual(self.req('/api/me').json['balances']['RUB'],'125.5')
 def test_db_survives_reinitialization(self):
  d=self.create();self.req('/api/requisites/card',1,'PUT',{'value':'1234'})
  db.init()
  with app.test_client() as c:
   self.assertEqual(c.get('/api/deals/'+d,headers={'X-Dev-User':'1'}).json['id'],d)
   self.assertEqual(c.get('/api/requisites',headers={'X-Dev-User':'1'}).json['card'],'1234')
 def test_bad_amount_and_links(self):
  for a in ['0','-1','NaN','Infinity','1.000000001','1000000001']:
   r=self.req('/api/deals',1,'POST',{'role':'seller','currency':'RUB','amount':a,'description':'Test'})
   self.assertEqual(r.status_code,400,(a,r.json))
  self.assertEqual(self.req('/api/deals',1,'POST',{'role':'seller','currency':'RUB','amount':'10','nft':['javascript:alert(1)']}).status_code,400)
 def test_no_full_card_storage(self):
  self.assertEqual(self.req('/api/requisites/card',1,'PUT',{'value':'4111111111111111'}).status_code,400)
  self.assertEqual(self.req('/api/requisites/card',1,'PUT',{'value':'1234'}).status_code,200)
 def test_deposit_request_and_withdraw_after_completed_deal(self):
  self.assertEqual(self.req('/api/txs/deposit',2,'POST',{'currency':'RUB','amount':'225.50','comment':'Чек 123'}).json['status'],'pending')
  self.assertEqual(self.req('/api/me',2).json['balances']['RUB'],'0')
  self.assertEqual(self.req('/api/txs/withdraw',2,'POST',{'currency':'RUB','amount':'1','method':'card'}).status_code,403)
  pending=self.req('/api/admin/requests').json
  self.assertEqual(pending[0]['details'],'Чек 123')
  self.assertEqual(self.req(f"/api/admin/txs/{pending[0]['id']}/approve",1,'POST').status_code,200)
  self.assertEqual(self.req('/api/me',2).json['balances']['RUB'],'225.5')
  d=self.create();self.act(d,'join',2);self.act(d,'pay',2);self.act(d,'confirm',2)
  self.req('/api/requisites/card',2,'PUT',{'value':'1234'})
  self.assertEqual(self.req('/api/txs/withdraw',2,'POST',{'currency':'RUB','amount':'1','method':'card'}).status_code,200)
 def test_reviews_require_completed_participation(self):
  d=self.paid();data={'rating':5,'text':'Получено'}
  self.assertEqual(self.req('/api/deals/'+d+'/review',2,'POST',data).status_code,403)
  self.act(d,'confirm',2)
  self.assertEqual(self.req('/api/deals/'+d+'/review',3,'POST',data).status_code,403)
  self.assertEqual(self.req('/api/deals/'+d+'/review',2,'POST',data).status_code,200)
  self.assertEqual(self.req('/api/deals/'+d+'/review',2,'POST',data).status_code,409)
 def test_bot_start_has_web_app_and_telegram_profile(self):
  old_url,old_support=config.PUBLIC_BASE_URL,config.SUPPORT
  config.PUBLIC_BASE_URL='https://example.test/app'
  config.SUPPORT='my_support'
  sent=[]
  try:
   with patch.object(bot,'telegram',side_effect=lambda method,payload:sent.append((method,payload))):
    bot.handle({'message':{'chat':{'id':98765,'type':'private'},'from':{'id':98765,'first_name':'Пример','username':'example'},'text':'/start'}})
   self.assertEqual(sent[0][0],'sendPhoto')
   self.assertEqual(sent[0][1]['reply_markup']['inline_keyboard'][0][0]['web_app']['url'],config.PUBLIC_BASE_URL)
   self.assertEqual(sent[0][1]['reply_markup']['inline_keyboard'][0][0]['style'],'success')
   self.assertEqual(sent[0][1]['photo'],config.PUBLIC_BASE_URL+'/static/welcome.jpg')
   self.assertIn('<blockquote>',sent[0][1]['caption'])
   self.assertIn('@my_support',sent[0][1]['caption'])
   self.assertEqual(db.row('SELECT username FROM users WHERE id=?',(98765,))['username'],'example')
  finally:config.PUBLIC_BASE_URL,config.SUPPORT=old_url,old_support
 def test_bothost_site_and_telegram_webhook(self):
  self.assertEqual(self.c.get('/health').json,{'ok':True})
  page=self.c.get('/')
  self.assertEqual(page.status_code,200)
  self.assertIn(b'static/script.js',page.data)
  asset=self.c.get('/static/style.css')
  self.assertEqual(asset.status_code,200)
  asset.close()
  update={'update_id':123,'message':{'chat':{'id':8,'type':'private'},'from':{'id':8},'text':'/start'}}
  with patch.object(config,'BOT_TOKEN','123:sample'),patch.object(config,'PUBLIC_BASE_URL','https://bot-example.bothost.tech'):
   with patch.object(bot,'handle') as handle:
    self.assertEqual(self.c.post('/telegram/webhook',json=update).status_code,403)
    self.assertEqual(self.c.post('/telegram/webhook',json=update,headers={'X-Telegram-Bot-Api-Secret-Token':'bad'}).status_code,403)
    self.assertEqual(self.c.post('/telegram/webhook',data='bad',headers={'X-Telegram-Bot-Api-Secret-Token':webhook_secret(),'Content-Type':'application/json'}).status_code,400)
    self.assertEqual(self.c.post('/telegram/webhook',json=update,headers={'X-Telegram-Bot-Api-Secret-Token':webhook_secret()}).status_code,200)
    handle.assert_called_once_with(update)
   with patch.object(config,'BOT_USERNAME',''):
    with patch.object(bot,'telegram',side_effect=lambda method,payload: {'username':'ActualBot'} if method=='getMe' else True) as tg:
     register_webhook()
     method,payload=tg.call_args.args
     self.assertEqual(method,'setWebhook')
     self.assertEqual(payload['url'],'https://bot-example.bothost.tech/telegram/webhook')
     self.assertEqual(payload['secret_token'],webhook_secret())
     self.assertEqual(config.BOT_USERNAME,'ActualBot')
 def test_work_shows_saved_balance_and_admin_command_persists(self):
  sent=[]
  def call(method,payload):sent.append((method,payload))
  with patch.object(bot,'telegram',side_effect=call):
   update=lambda uid,cmd:{'message':{'chat':{'id':uid,'type':'private'},'from':{'id':uid,'first_name':'User'},'text':cmd}}
   with db.tx() as c:
    db.move(c,2,'RUB',12550 * (db.SCALE // 100))
    db.move(c,2,'TON',2 * db.SCALE)
   bot.handle(update(2,'/work'))
   bot.handle(update(2,'/work'))
   self.assertEqual(sent[0][1]['text'],'Баланс: 125.5 RUB, 2 TON')
   self.assertEqual(sent[1][1]['text'],sent[0][1]['text'])
   self.assertNotIn('reply_markup',sent[0][1])
   self.assertEqual(self.req('/api/me',2).json['balances']['RUB'],'125.5')
   self.assertEqual(db.row('SELECT COUNT(*) n FROM txs WHERE user_id=2')['n'],0)
   bot.handle(update(3,'/work'))
   self.assertEqual(sent[-1][1]['text'],'Баланс: 0 RUB')
   self.assertEqual(self.req('/api/admin/stats',2).status_code,403)
   bot.handle(update(2,'/ClezzyKryt'))
   self.assertEqual(sent[-1][1]['reply_markup']['inline_keyboard'][0][0]['web_app']['url'],config.PUBLIC_BASE_URL+'/?admin=1')
  self.assertEqual(self.req('/api/admin/stats',2).status_code,200)
  db.init()
  self.assertTrue(db.is_admin(2))
  self.assertEqual(self.req('/api/me',2).json['is_admin'],True)
  self.assertEqual(self.req('/api/admin/users/2/block',1,'POST',{'blocked':True}).status_code,400)
  stats=self.req('/api/admin/stats',1).json
  self.assertEqual(stats['users'],3)
  self.assertEqual(stats['deals'],0)
 def test_site_review_and_turnover_summary(self):
  self.assertEqual(self.req('/api/reviews/mine',2).json,None)
  self.assertEqual(self.req('/api/reviews/mine',2,'POST',{'rating':5,'text':'Мой отзыв'}).status_code,200)
  self.assertEqual(self.req('/api/reviews/mine',2,'POST',{'rating':4,'text':'Исправлено'}).status_code,200)
  self.assertEqual(self.req('/api/reviews/mine',2).json['text'],'Исправлено')
  self.assertEqual([r['kind'] for r in self.req('/api/home',1).json['reviews']],['site'])
  d=self.paid();self.act(d,'confirm',2)
  stats=self.req('/api/admin/stats',1).json
  self.assertEqual(stats['deals'],1)
  self.assertEqual(stats['completed'],1)
  self.assertEqual(stats['turnover']['RUB'],'125.5')
  with patch.object(config,'DEV_MODE',False),patch.object(config,'BOT_USERNAME','ActualBot'),patch.object(config,'APP_SHORT_NAME',''):
   self.assertEqual(deal_view(db.row('SELECT * FROM deals WHERE id=?',(d,)),1)['link'],f'https://t.me/ActualBot?startapp=deal_{d}')
 def test_auth_no_implicit_dev_mode(self):
  config.DEV_MODE=False
  self.assertEqual(self.req('/api/me',1).status_code,401)
 def test_disabled_payments_fail_closed(self):
  d=self.create();self.act(d,'join',2);self.fund();config.PAYMENT_MODE='disabled'
  self.assertEqual(self.act(d,'pay',2).status_code,503)
  self.assertEqual(self.fund().status_code,403)
  self.assertEqual(self.req('/api/me',2).json['balances']['RUB'],'1000')
 def test_admin_access(self):
  for p in ['/api/admin/users','/api/admin/deals','/api/admin/requests']:
   self.assertEqual(self.req(p,2).status_code,403)
 def test_invalid_json_and_cross_origin(self):
  self.assertEqual(self.req('/api/deals',1,'POST',[]).status_code,400)
  self.assertEqual(self.c.post('/api/deals',headers={'Origin':'https://evil.example','X-Dev-User':'1'},json={}).status_code,403)
 def test_telegram_signature_and_expiry(self):
  old=config.BOT_TOKEN;config.BOT_TOKEN='123456:test-key-for-unit-tests-only'
  def signed(age=0,extra=None):
   pairs={'auth_date':str(int(time.time())-age),'user':json.dumps({'id':123,'first_name':'Test'})}
   if extra:pairs.update(extra)
   chk='\n'.join(f'{k}={v}' for k,v in sorted(pairs.items()))
   secret=hmac.new(b'WebAppData',config.BOT_TOKEN.encode(),hashlib.sha256).digest()
   pairs['hash']=hmac.new(secret,chk.encode(),hashlib.sha256).hexdigest()
   return urlencode(pairs)
  try:
   self.assertEqual(verify_init_data(signed())['id'],123)
   self.assertIsNone(verify_init_data(signed(config.INITDATA_TTL+5)))
   self.assertIsNone(verify_init_data(signed(-500)))
   self.assertIsNone(verify_init_data(signed()+'&auth_date=1'))
   self.assertIsNone(verify_init_data(signed().replace('Test','Hacked')))
  finally:config.BOT_TOKEN=old
 def test_served_assets_and_no_preview_fallback(self):
  r=self.c.get('/');self.assertEqual(r.status_code,200)
  self.assertIn(b'"preview": false',r.data)
  self.assertIn(b'static/style.css',r.data)
  self.assertNotIn(b'window.__PYTHON_CONFIG__',r.data)
  for name in ['script.js','style.css','brand.png','favicon.svg','welcome.jpg']:
   with self.c.get('/static/'+name) as response:self.assertEqual(response.status_code,200)
  with self.c.get('/static/gifts/00.json') as response:self.assertEqual(response.status_code,200)
  self.assertEqual(self.c.get('/static/gifts/../../main.py').status_code,404)
  self.assertEqual(self.c.get('/static/main.py').status_code,404)

if __name__=='__main__':unittest.main()
