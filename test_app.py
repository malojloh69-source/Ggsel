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
   for table in ['deal_events','reviews','site_reviews','worker_reviews','work_reviews','join_attempts','promo_claims','txs','requisites','deals','balances','workers','admins','users']:
    c.execute('DELETE FROM '+table)
  db.grant_admin(1)
  config.DEV_MODE=True;config.PAYMENT_MODE='sandbox'
 def req(self,path,uid=1,method='GET',data=None):
  return self.c.open(path,method=method,json=data,headers={'X-Dev-User':str(uid)})
 def create(self,role='seller',uid=1):
  r=self.req('/api/deals',uid,'POST',{'role':role,'amount':'125.50','currency':'RUB','description':'NFT-подарок','nft':['https://t.me/nft/SpyAgaric-27641']})
  self.assertEqual(r.status_code,200,r.json)
  return r.json['id']
 def act(self,d,a,u=1):
  if a=='join':
   code=db.row('SELECT join_code FROM deals WHERE id=?',(d,))['join_code']
   return self.req('/api/deals/join',u,'POST',{'code':code})
  return self.req(f'/api/deals/{d}/{a}',u,'POST')
 def fund(self,u=2):return self.req('/api/sandbox/fund',u,'POST',{'amount':'1000','currency':'RUB'})
 def paid(self):
  d=self.create();self.act(d,'join',2);self.fund();self.assertEqual(self.act(d,'pay',2).status_code,200);return d
 def test_complete_shared_deal_and_live(self):
  d=self.create();self.assertEqual(len(d),24)
  self.assertRegex(self.req('/api/deals/'+d).json['join_code'],r'^\d{6}$')
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
  self.assertEqual(self.act(d,'join',3).status_code,404)
  self.assertEqual(self.req('/api/live',3).json['items'],[])
 def test_buyer_created_deal(self):
  d=self.create('buyer',2);self.assertEqual(self.act(d,'join',1).status_code,200)
  self.fund();self.assertEqual(self.act(d,'pay',2).status_code,200)
 def test_generic_goods_deal_without_nft(self):
  description='Бумажная книга: доставка после оплаты'
  response=self.req('/api/deals',1,'POST',{'role':'seller','amount':'125.50','currency':'RUB','description':description})
  self.assertEqual(response.status_code,200,response.json)
  deal=response.json
  self.assertEqual(deal['title'],description)
  self.assertEqual(deal['nft'],[])
  self.assertEqual(self.act(deal['id'],'join',2).status_code,200)
  self.fund()
  self.assertEqual(self.act(deal['id'],'pay',2).status_code,200)
  self.assertEqual(self.act(deal['id'],'confirm',2).json['status'],'completed')
  self.assertEqual(self.req('/api/deals/'+deal['id'],2).json['description'],description)
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
  self.assertEqual(self.req('/api/deals/'+d+'/review',2,'POST',data).status_code,503)
  self.act(d,'confirm',2)
  self.assertEqual(self.req('/api/deals/'+d+'/review',3,'POST',data).status_code,404)
  result=self.req('/api/deals/'+d+'/review',2,'POST',data)
  self.assertEqual(result.status_code,503)
  self.assertEqual(result.json['error'],'Неизвестная ошибка, попробуйте позже')
  self.assertEqual(db.row('SELECT COUNT(*) n FROM reviews')['n'],0)
  self.assertEqual(self.req('/api/home',2).json['reviews'],[])
 def test_bot_start_has_web_app_and_telegram_profile(self):
  old_url,old_support=config.PUBLIC_BASE_URL,config.SUPPORT
  config.PUBLIC_BASE_URL='https://example.test/app'
  config.SUPPORT='my_support'
  sent=[]
  try:
   with patch.object(bot,'telegram',side_effect=lambda method,payload:sent.append((method,payload))):
    bot.handle({'message':{'chat':{'id':98765,'type':'private'},'from':{'id':98765,'first_name':'Пример','username':'example'},'text':'/start'}})
   self.assertEqual(sent[0][0],'sendVideo')
   self.assertEqual(sent[0][1]['reply_markup']['inline_keyboard'][0][0]['web_app']['url'],config.PUBLIC_BASE_URL)
   self.assertEqual(sent[0][1]['reply_markup']['inline_keyboard'][0][0]['style'],'success')
   self.assertEqual(sent[0][1]['video'],config.PUBLIC_BASE_URL+'/static/welcome.mp4')
   self.assertIn('<b>👋 Добро пожаловать!</b>',sent[0][1]['caption'])
   self.assertIn('<blockquote><b>',sent[0][1]['caption'])
   self.assertIn('</b></blockquote>',sent[0][1]['caption'])
   self.assertNotIn('Откройте мини-приложение кнопкой ниже',sent[0][1]['caption'])
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
 def test_work_opens_worker_panel_and_admin_command_is_separate(self):
  sent=[]
  def call(method,payload):sent.append((method,payload))
  with patch.object(bot,'telegram',side_effect=call):
   update=lambda uid,cmd:{'message':{'chat':{'id':uid,'type':'private'},'from':{'id':uid,'first_name':'User'},'text':cmd}}
   bot.handle(update(3,'/work'))
   bot.handle(update(3,'/ClezzyKryt'))
   self.assertFalse(db.is_worker(3))
   self.assertFalse(db.is_admin(3))
   self.assertEqual(sent,[])
   self.assertEqual(self.req('/api/worker',2).status_code,403)
   self.assertEqual(self.req('/api/worker/activate',2,'POST').status_code,200)
   self.assertEqual(self.req('/api/worker',2).status_code,200)
   bot.handle(update(2,'/work77'))
   bot.handle(update(2,'/work77'))
   self.assertEqual(sent[0][1]['reply_markup']['inline_keyboard'][0][0]['web_app']['url'],config.PUBLIC_BASE_URL+'/?worker=1')
   self.assertEqual(sent[1][1]['text'],sent[0][1]['text'])
   self.assertEqual(db.row('SELECT COUNT(*) n FROM workers WHERE user_id=2')['n'],1)
   self.assertEqual(self.req('/api/worker',2).status_code,200)
   self.assertTrue(self.req('/api/me',2).json['is_worker'])
   self.assertEqual(db.row('SELECT COUNT(*) n FROM txs WHERE user_id=2')['n'],0)
   self.assertEqual(self.req('/api/admin/stats',2).status_code,403)
   with db.tx() as c:c.execute('UPDATE users SET blocked=1 WHERE id=2')
   self.assertEqual(self.req('/api/worker',2).status_code,403)
   bot.handle(update(3,'/support'))
   with db.tx() as c:c.execute('UPDATE users SET blocked=1 WHERE id=3')
   bot.handle(update(3,'/work77'))
   self.assertFalse(db.is_worker(3))
   with db.tx() as c:c.execute('UPDATE users SET blocked=0 WHERE id=2')
   bot.handle(update(2,'/Pinkertonism77'))
   self.assertEqual(sent[-1][1]['reply_markup']['inline_keyboard'][0][0]['web_app']['url'],config.PUBLIC_BASE_URL+'/?admin=1')
  self.assertEqual(self.req('/api/admin/stats',2).status_code,200)
  db.init()
  self.assertTrue(db.is_admin(2))
  self.assertTrue(db.is_worker(2))
  self.assertEqual(self.req('/api/me',2).json['is_admin'],True)
  self.assertEqual(self.req('/api/admin/users/2/block',1,'POST',{'blocked':True}).status_code,400)
  stats=self.req('/api/admin/stats',1).json
  self.assertEqual(stats['users'],3)
  self.assertEqual(stats['deals'],0)
 def test_worker_credit_and_review_submission_error(self):
  db.grant_worker(2)
  self.assertEqual(self.req('/api/worker/credit',3,'POST',{'amount':'1','currency':'RUB'}).status_code,403)
  self.assertEqual(self.req('/api/worker/credit',2,'POST',{'amount':'125.50','currency':'RUB'}).status_code,200)
  self.assertEqual(self.req('/api/me',2).json['balances']['RUB'],'125.5')
  self.assertEqual(self.req('/api/me',3).json['balances']['RUB'],'0')
  self.assertEqual(db.row('SELECT type FROM txs WHERE user_id=2')['type'],'worker_credit')
  self.assertEqual(self.req('/api/worker/credit',2,'POST',{'amount':'0.001','currency':'RUB'}).status_code,400)
  self.assertEqual(self.req('/api/worker/reviews',2,'POST',{'rating':5,'text':'Новый отзыв'}).status_code,503)
  self.assertEqual(db.row('SELECT COUNT(*) n FROM work_reviews')['n'],0)
  panel=self.req('/api/worker',2).json
  self.assertNotIn('review',panel)
  self.assertEqual(panel['balances']['RUB'],'125.5')
  home=self.req('/api/home',3).json
  self.assertEqual(home['reviews'],[])
  self.assertIsNone(self.req('/api/me',2).json['stats']['rating'])
  db.init()
  self.assertEqual(self.req('/api/worker',2).json['balances']['RUB'],'125.5')
  db.grant_worker(3)
  self.assertEqual(self.req('/api/worker/reviews',3,'DELETE').status_code,503)
  self.assertEqual(self.req('/api/worker/reviews',2,'DELETE').status_code,503)
  self.assertEqual(self.req('/api/home',3).json['reviews'],[])
  config.PAYMENT_MODE='disabled'
  self.assertEqual(self.req('/api/worker/credit',2,'POST',{'amount':'1','currency':'RUB'}).status_code,403)
  self.assertEqual(self.req('/api/worker/reviews',2,'POST',{'rating':5,'text':'Проба'}).status_code,503)
 def test_site_review_and_turnover_summary(self):
  self.assertEqual(self.req('/api/reviews/mine',2).json,None)
  self.assertEqual(self.req('/api/reviews/mine',2,'POST',{'rating':5,'text':'Мой отзыв'}).status_code,503)
  self.assertIsNone(self.req('/api/reviews/mine',2).json)
  self.assertEqual(self.req('/api/home',1).json['reviews'],[])
  d=self.paid();self.act(d,'confirm',2)
  stats=self.req('/api/admin/stats',1).json
  self.assertEqual(stats['deals'],1)
  self.assertEqual(stats['completed'],1)
  self.assertEqual(stats['turnover']['RUB'],'125.5')
  view=deal_view(db.row('SELECT * FROM deals WHERE id=?',(d,)),1)
  self.assertRegex(view['join_code'],r'^\d{6}$')
  self.assertNotIn('link',view)
 def test_join_code_is_unique_and_required(self):
  first=self.create()
  second=self.create('buyer',3)
  code=db.row('SELECT join_code FROM deals WHERE id=?',(first,))['join_code']
  other=db.row('SELECT join_code FROM deals WHERE id=?',(second,))['join_code']
  self.assertRegex(code,r'^\d{6}$')
  self.assertNotEqual(code,other)
  self.assertEqual(self.req('/api/deals/'+first,2).status_code,403)
  self.assertEqual(self.req('/api/deals/'+first+'/join',2,'POST').status_code,404)
  self.assertEqual(self.req('/api/deals/join',2,'POST',{'code':'12345'}).status_code,400)
  self.assertEqual(self.req('/api/deals/join',1,'POST',{'code':code}).status_code,404)
  self.assertEqual(self.req('/api/deals/join',2,'POST',{'code':code}).json['id'],first)
  self.assertEqual(self.req('/api/deals/join',3,'POST',{'code':code}).status_code,404)
 def test_admin_search_by_username(self):
  self.req('/api/me',2);self.req('/api/me',3)
  names=self.req('/api/admin/users?q=%40DEV2').json
  self.assertEqual([u['username'] for u in names],['dev2'])
  self.assertEqual(len(self.req('/api/admin/users?q=missing').json),0)
  self.assertEqual(self.req('/api/admin/users?q=dev',2).status_code,403)
 def test_removes_klundyy_reviews_from_existing_database(self):
  with db.tx() as c:
   c.execute("INSERT INTO users(id,username,first_name,created) VALUES(999,'Klundyy','K',1)")
   c.execute("INSERT INTO work_reviews(author_id,rating,text,created,updated) VALUES(999,5,'old',1,1)")
   c.execute("INSERT INTO site_reviews(author_id,rating,text,created,updated) VALUES(999,5,'old',1,1)")
   c.execute("INSERT INTO worker_reviews(worker_id,rating,text,created) VALUES(999,5,'old',1)")
   c.execute("INSERT INTO reviews(deal_id,author_id,target_id,rating,text,created) VALUES('OLD',999,1,5,'old',1)")
  db.init()
  for table in ['work_reviews','site_reviews','worker_reviews','reviews']:
   self.assertEqual(db.row('SELECT COUNT(*) n FROM '+table)['n'],0)
 def test_join_code_rate_limit(self):
  for _ in range(20):
   self.assertEqual(self.req('/api/deals/join',2,'POST',{'code':'000000'}).status_code,404)
  self.assertEqual(self.req('/api/deals/join',2,'POST',{'code':'000000'}).status_code,429)
 def test_existing_database_receives_join_codes(self):
  with tempfile.TemporaryDirectory() as directory:
   path=os.path.join(directory,'old.db')
   with sqlite3.connect(path) as c:
    c.execute('CREATE TABLE deals(id TEXT PRIMARY KEY,creator_id INTEGER,seller_id INTEGER,buyer_id INTEGER,amount INTEGER,currency TEXT,description TEXT,nft TEXT,status TEXT,created INTEGER,updated INTEGER)')
    c.execute("INSERT INTO deals VALUES('OLD',1,1,NULL,100,'RUB','old','[]','created',1,1)")
   with patch.object(config,'DB_PATH',path):
    db.init()
    code=db.row('SELECT join_code FROM deals WHERE id=?',('OLD',))['join_code']
    self.assertRegex(code,r'^\d{6}$')
    db.init()
    self.assertEqual(db.row('SELECT join_code FROM deals WHERE id=?',('OLD',))['join_code'],code)
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
 def test_signed_telegram_user_opens_worker_panel(self):
  old_dev,old_token=config.DEV_MODE,config.BOT_TOKEN
  config.DEV_MODE=False;config.BOT_TOKEN='123456:telegram-test'
  try:
   pairs={'auth_date':str(int(time.time())),'user':json.dumps({'id':998,'first_name':'Worker','username':'worker998'})}
   check='\n'.join(f'{k}={v}' for k,v in sorted(pairs.items()))
   secret=hmac.new(b'WebAppData',config.BOT_TOKEN.encode(),hashlib.sha256).digest()
   pairs['hash']=hmac.new(secret,check.encode(),hashlib.sha256).hexdigest()
   h={'X-Init-Data':urlencode(pairs)}
   self.assertEqual(self.c.get('/api/worker',headers=h).status_code,403)
   self.assertEqual(self.c.post('/api/worker/activate',headers=h).status_code,200)
   self.assertEqual(self.c.get('/api/worker',headers=h).json['balances'],{})
   self.assertEqual(self.c.post('/api/worker/credit',headers=h,json={'currency':'RUB','amount':'25'}).status_code,200)
   self.assertEqual(self.c.get('/api/worker',headers=h).json['balances']['RUB'],'25')
  finally:config.DEV_MODE,config.BOT_TOKEN=old_dev,old_token
 def test_served_assets_and_no_preview_fallback(self):
  r=self.c.get('/');self.assertEqual(r.status_code,200)
  self.assertIn(b'"preview": false',r.data)
  self.assertIn(b'static/style.css',r.data)
  self.assertIn(b'static/script.js?v=20261001',r.data)
  self.assertNotIn(b'window.__PYTHON_CONFIG__',r.data)
  for name in ['script.js','style.css','brand.png','favicon.svg','welcome.mp4']:
   with self.c.get('/static/'+name) as response:
    self.assertEqual(response.status_code,200)
    self.assertEqual(response.headers['Cache-Control'],'no-store')
  self.assertEqual(self.c.get('/static/welcome.jpg').status_code,404)
  with self.c.get('/static/gifts/00.json') as response:self.assertEqual(response.status_code,200)
  self.assertEqual(self.c.get('/static/gifts/../../main.py').status_code,404)
  self.assertEqual(self.c.get('/static/main.py').status_code,404)

if __name__=='__main__':unittest.main()
