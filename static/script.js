
(() => {
"use strict";
const tg = window.Telegram && window.Telegram.WebApp;
const P = new URLSearchParams(location.search);
const CFG = window.APP_CONFIG || {};
let DEV = CFG.dev ? (P.get("dev") || sessionStorage.getItem("deal_dev_user") || "1") : null;
const CATALOG = [{"title": "Spy Agaric", "number": "27641", "lottie": "https://ddejfvww7sqtk.cloudfront.net/nft-content-cache/lottie/EQD6mH9bwbn6S3M_tCRWOvqAIW8M34kRwbI01niGLRPeDPsl/ad78888323282bc4", "bg": "#3E2723", "key": "spyagaric-27641"}, {"title": "Mousse Cake", "number": "40311", "lottie": "https://ddejfvww7sqtk.cloudfront.net/nft-content-cache/lottie/EQBjzdi27ZI-Re93OOIia0m7YmUU8d8ubJNsStZTc7qNJnOv/02820d81131efef1", "bg": "#5D4037", "key": "moussecake-40311"}, {"title": "Eternal Candle", "number": "7856", "lottie": "https://ddejfvww7sqtk.cloudfront.net/nft-content-cache/lottie/EQBzZLNIr4lie0pTfrbRsANJOtFYwY5gmngRfs84Ras5-aVN/8786ee4a2da53b73", "bg": "#4A148C", "key": "eternalcandle-7856"}, {"title": "Restless Jar", "number": "1732", "lottie": "https://ddejfvww7sqtk.cloudfront.net/nft-content-cache/lottie/EQDycOgkLwcfPDokh8q-2DIUzVhPetdFuZmwrFYFP6i1nZ_u/c099d698c75b4c30", "bg": "#BF360C", "key": "restlessjar-1732"}, {"title": "Stellar Rocket", "number": "77564", "lottie": "https://ddejfvww7sqtk.cloudfront.net/nft-content-cache/lottie/EQDIruSTyxvq60gUH8j2kkj3qzoBrBaJy9WkKbeNNRasWe4j/82cc4259a5d4fadb", "bg": "#3498db", "key": "stellarrocket-77564"}, {"title": "Jack-in-the-Box", "number": "1287", "lottie": "https://ddejfvww7sqtk.cloudfront.net/nft-content-cache/lottie/EQA401QqpXtBnwIaDbFjwd5yXfP2mYiCusbJ3Zcw9eXR9CqL/311b48002dcaceb4", "bg": "#9b59b6", "key": "jackinthebox-1287"}, {"title": "Snoop Dogg", "number": "306168", "lottie": "https://ddejfvww7sqtk.cloudfront.net/nft-content-cache/lottie/EQAoJw7BpOcBD3y9voMuEQ-qhS3K4gtM-6EePLxkzk8iSifX/4a27bdf126f1c236", "bg": "#3E2723", "key": "snoopdogg-306168"}, {"title": "Ice Cream", "number": "33019", "lottie": "https://ddejfvww7sqtk.cloudfront.net/nft-content-cache/lottie/EQBUvskEvmWdp_V6HX-2Tyfp4mFSzMzdg9TaUz6zKVz6Ov3f/6963c8bf9186ec4d", "bg": "#880E4F", "key": "icecream-33019"}, {"title": "Fresh Socks", "number": "5340", "lottie": "https://ddejfvww7sqtk.cloudfront.net/nft-content-cache/lottie/EQAUffQWl09_yhXDTp8oN13Px8ygPm0xcyNGhHOiONV-x3om/e73575435c843b99", "bg": "#0D47A1", "key": "freshsocks-5340"}, {"title": "Light Sword", "number": "25087", "lottie": "https://ddejfvww7sqtk.cloudfront.net/nft-content-cache/lottie/EQDRrfw5pgIC4e6NafUAx52Z9Ym6q1k26xxaXR_qx0LKJJ7D/8a2461e92974ec06", "bg": "#212121", "key": "lightsword-25087"}, {"title": "Lush Bouquet", "number": "4315", "lottie": "https://ddejfvww7sqtk.cloudfront.net/nft-content-cache/lottie/EQA2lHcvZWW_bN_2NMKrkEUv9xz6fx8wTE5upa8u1neZb6hJ/1e1733f2e96cf6e8", "bg": "#1B5E20", "key": "lushbouquet-4315"}, {"title": "Top Hat", "number": "11048", "lottie": "https://ddejfvww7sqtk.cloudfront.net/nft-content-cache/lottie/EQADvJxMxCHA7fRlYjoceBORf7RwKs0rzjVaKepQACMnZzG7/87a4769888f4671c", "bg": "#212121", "key": "tophat-11048"}, {"title": "Holiday Drink", "number": "22200", "lottie": "https://ddejfvww7sqtk.cloudfront.net/nft-content-cache/lottie/EQB5P3ZP2PjLION52Y1SNAux1do4-ZOqMWotXS-fdMpqHcCH/6214fc78d5135bb3", "bg": "#5D4037", "key": "holidaydrink-22200"}, {"title": "Input Key", "number": "66374", "lottie": "https://ddejfvww7sqtk.cloudfront.net/nft-content-cache/lottie/EQBSIId7sMmlqN8oBGaMNtUeuaLeSQPUR1ByMwpnfWL3hhZq/d1808ffcf855e5e0", "bg": "#E65100", "key": "inputkey-66374"}, {"title": "Happy Brownie", "number": "101299", "lottie": "https://ddejfvww7sqtk.cloudfront.net/nft-content-cache/lottie/EQB1ATaKGNYk6T5R2cA18BOF-KB_idaKKigwYI2jtjWuLg8n/59f712b4b5b578e8", "bg": "#0D47A1", "key": "happybrownie-101299"}, {"title": "Spring Basket", "number": "18731", "lottie": "https://ddejfvww7sqtk.cloudfront.net/nft-content-cache/lottie/EQCZ4-h65iTiWDPRPcLlS63gbcS40YBadEFLA4W-iIWUZld0/c6aa276254ffb471", "bg": "#2d3436", "key": "springbasket-18731"}, {"title": "Money Pot", "number": "25433", "lottie": "https://ddejfvww7sqtk.cloudfront.net/nft-content-cache/lottie/EQBM3U1twWjI_vYUaPdFkzZs1q9c0orHhQjx0m2Xa9ljgTqY/dbb4f035eb23b761", "bg": "#2d3436", "key": "moneypot-25433"}, {"title": "Spring Basket", "number": "61462", "lottie": "https://ddejfvww7sqtk.cloudfront.net/nft-content-cache/lottie/EQCZ4-h65iTiWDPRPcLlS63gbcS40YBadEFLA4W-iIWUZld0/997da509e065fc33", "bg": "#2d3436", "key": "springbasket-61462"}, {"title": "Mousse Cake", "number": "78867", "lottie": "https://ddejfvww7sqtk.cloudfront.net/nft-content-cache/lottie/EQBjzdi27ZI-Re93OOIia0m7YmUU8d8ubJNsStZTc7qNJnOv/15f9ac73ef15292a", "bg": "#2d3436", "key": "moussecake-78867"}, {"title": "Instant Ramen", "number": "337835", "lottie": "https://ddejfvww7sqtk.cloudfront.net/nft-content-cache/lottie/EQBIj0uF-qIASqv6qIvcTif2wKSdt4WQc4mcoBywNp5GntuG/327c9ae0ae021cad", "bg": "#212121", "key": "instantramen-337835"}, {"title": "Input Key", "number": "78219", "lottie": "https://ddejfvww7sqtk.cloudfront.net/nft-content-cache/lottie/EQBSIId7sMmlqN8oBGaMNtUeuaLeSQPUR1ByMwpnfWL3hhZq/5551e054276259e8", "bg": "#2d3436", "key": "inputkey-78219"}, {"title": "Spring Basket", "number": "3249", "lottie": "https://ddejfvww7sqtk.cloudfront.net/nft-content-cache/lottie/EQCZ4-h65iTiWDPRPcLlS63gbcS40YBadEFLA4W-iIWUZld0/4f3587b4ece8f203", "bg": "#FFD700", "key": "springbasket-3249"}, {"title": "Happy Brownie", "number": "2334", "lottie": "https://ddejfvww7sqtk.cloudfront.net/nft-content-cache/lottie/EQB1ATaKGNYk6T5R2cA18BOF-KB_idaKKigwYI2jtjWuLg8n/867e29078b1e9a77", "bg": "#0D47A1", "key": "happybrownie-2334"}, {"title": "Ion Gem", "number": "731", "lottie": "https://ddejfvww7sqtk.cloudfront.net/nft-content-cache/lottie/EQDL7HMbca0FufrjHFcRoiLkEiOXkXoO_vH2gVUN8JNp4khK/8a18f6cdf272b05c", "bg": "#1B5E20", "key": "iongem-731"}, {"title": "Desk Calendar", "number": "18493", "lottie": "https://ddejfvww7sqtk.cloudfront.net/nft-content-cache/lottie/EQBMcfMAZlMUr1W3X8kdEw3fJMUAaWH4-XcmE5R5RfFIY0E2/a293182bce065643", "bg": "#B71C1C", "key": "deskcalendar-18493"}, {"title": "Moon Pendant", "number": "2737", "lottie": "https://ddejfvww7sqtk.cloudfront.net/nft-content-cache/lottie/EQC7oPa-gJDZ6JRwW0WW4WH_Vjn7ioKmfDdFItD7nYFGdbuU/63a6a4dc95adb735", "bg": "#636E72", "key": "moonpendant-2737"}, {"title": "Electric Skull", "number": "3337", "lottie": "https://ddejfvww7sqtk.cloudfront.net/nft-content-cache/lottie/EQAOYYJib8K6-91TjeOYRbWEtbtRJHXKoWltnULwdaqd7mR5/0f0eb3435a9cfb44", "bg": "#636E72", "key": "electricskull-3337"}, {"title": "Easter Egg", "number": "3783", "lottie": "https://ddejfvww7sqtk.cloudfront.net/nft-content-cache/lottie/EQAwnP7dGfE_WO0xiCiulkAXUG1K1bWH1vE1k64T4G-7gruO/45a01eb8ed561c61", "bg": "#2d3436", "key": "easteregg-3783"}, {"title": "Toy Bear", "number": "784", "lottie": "https://ddejfvww7sqtk.cloudfront.net/nft-content-cache/lottie/EQC1gud6QO8NdJjVrqr7qFBMO0oQsktkvzhmIRoMKo8vxiyL/fdd58a45af6f6a8c", "bg": "#FFD700", "key": "toybear-784"}, {"title": "Big Year", "number": "8492", "lottie": "https://ddejfvww7sqtk.cloudfront.net/nft-content-cache/lottie/EQDx-SqQEhP9Rzfi2cqdehTVUvQbArsUz1X7t-ul8IiKZpYb/245abfb95445b4d4", "bg": "#2d3436", "key": "bigyear-8492"}, {"title": "Candy Cane", "number": "9023", "lottie": "https://ddejfvww7sqtk.cloudfront.net/nft-content-cache/lottie/EQDLM65t0shS7gZAg0lMltGHYhsU94PzsMJHhYibmRV7kdUs/fae3fbc105b9f598", "bg": "#2d3436", "key": "candycane-9023"}, {"title": "Jester Hat", "number": "4882", "lottie": "https://ddejfvww7sqtk.cloudfront.net/nft-content-cache/lottie/EQCBK_JBASAA5XVz1D17Pn--kQaMWm0b9wReVtsEdRO4Tgy9/38ece3e59365f378", "bg": "#FFD700", "key": "jesterhat-4882"}, {"title": "Diamond Ring", "number": "4053", "lottie": "https://ddejfvww7sqtk.cloudfront.net/nft-content-cache/lottie/EQCWh1lPltyTwCWxCXm4umL5tPZoXR8kTIcT-pd0JqoadLHo/e044d118679c0b2c", "bg": "#4A148C", "key": "diamondring-4053"}, {"title": "Big Year", "number": "4947", "lottie": "https://ddejfvww7sqtk.cloudfront.net/nft-content-cache/lottie/EQDx-SqQEhP9Rzfi2cqdehTVUvQbArsUz1X7t-ul8IiKZpYb/d6065bf852f518a8", "bg": "#1B5E20", "key": "bigyear-4947"}, {"title": "Bow Tie", "number": "584", "lottie": "https://ddejfvww7sqtk.cloudfront.net/nft-content-cache/lottie/EQDpxJ6VAwUA-tX6w8ACnoAJLrP3hKWmieBl71uv1_qKRD3x/a8e21d7b62b9ff51", "bg": "#1B5E20", "key": "bowtie-584"}, {"title": "Spy Agaric", "number": "7843", "lottie": "https://ddejfvww7sqtk.cloudfront.net/nft-content-cache/lottie/EQD6mH9bwbn6S3M_tCRWOvqAIW8M34kRwbI01niGLRPeDPsl/c7d3981c50a8a6eb", "bg": "#2d3436", "key": "spyagaric-7843"}, {"title": "Spy Agaric", "number": "386", "lottie": "https://ddejfvww7sqtk.cloudfront.net/nft-content-cache/lottie/EQD6mH9bwbn6S3M_tCRWOvqAIW8M34kRwbI01niGLRPeDPsl/4417fd39fc4527c5", "bg": "#1B5E20", "key": "spyagaric-386"}, {"title": "Durov’s Cap", "number": "255", "lottie": "https://ddejfvww7sqtk.cloudfront.net/nft-content-cache/lottie/EQD9ikZq6xPgKjzmdBG0G0S80RvUJjbwgHrPZXDKc_wsE84w/774964f1079c7fbe", "bg": "#2d3436", "key": "durovscap-255"}, {"title": "Hex Pot", "number": "4268", "lottie": "https://ddejfvww7sqtk.cloudfront.net/nft-content-cache/lottie/EQB6AtBPOuTtQml8oSA7X8ZqJ5QmcOYYqoz92sQYXGUQrxyB/4b8aeefe8db1ce8b_194a95ccd5a", "bg": "#2d3436", "key": "hexpot-4268"}, {"title": "Scared Cat", "number": "1204", "lottie": "https://ddejfvww7sqtk.cloudfront.net/nft-content-cache/lottie/EQATuUGdvrjLvTWE5ppVFOVCqU2dlCLUnKTsu0n1JYm9la10/7584f0089f1701bd", "bg": "#1B5E20", "key": "scaredcat-1204"}, {"title": "Scared Cat", "number": "652", "lottie": "https://ddejfvww7sqtk.cloudfront.net/nft-content-cache/lottie/EQATuUGdvrjLvTWE5ppVFOVCqU2dlCLUnKTsu0n1JYm9la10/be3fadc16aea0e1a", "bg": "#0D47A1", "key": "scaredcat-652"}, {"title": "Evil Eye", "number": "9897", "lottie": "https://ddejfvww7sqtk.cloudfront.net/nft-content-cache/lottie/EQDQ6DjRabTYSAxf2xrZsnsXtqcIm1bj9dF5x_h8lNjWPmH4/a4aba269fe7986d6", "bg": "#0D47A1", "key": "evileye-9897"}, {"title": "Santa Hat", "number": "4229", "lottie": "https://ddejfvww7sqtk.cloudfront.net/nft-content-cache/lottie/EQAaTIR7oJyowDiumYLVN0oe61kGE3I6EPEn7WgHPGuWAeCy/7710c7a31fc5aa5d", "bg": "#2d3436", "key": "santahat-4229"}, {"title": "Santa Hat", "number": "385", "lottie": "https://ddejfvww7sqtk.cloudfront.net/nft-content-cache/lottie/EQAaTIR7oJyowDiumYLVN0oe61kGE3I6EPEn7WgHPGuWAeCy/48cf91e3b7da71b7", "bg": "#2d3436", "key": "santahat-385"}, {"title": "Perfume Bottle", "number": "486", "lottie": "https://ddejfvww7sqtk.cloudfront.net/nft-content-cache/lottie/EQDJsN9OJBhKGZoWZWtkEpzkCfIu16Z9UzTWbYjeLpuHdT5f/f15ea4812d572509", "bg": "#FFD700", "key": "perfumebottle-486"}, {"title": "Spy Agaric", "number": "10250", "lottie": "https://ddejfvww7sqtk.cloudfront.net/nft-content-cache/lottie/EQD6mH9bwbn6S3M_tCRWOvqAIW8M34kRwbI01niGLRPeDPsl/6a0eb89f958a8719", "bg": "#2d3436", "key": "spyagaric-10250"}, {"title": "Trapped Heart", "number": "244", "lottie": "https://ddejfvww7sqtk.cloudfront.net/nft-content-cache/lottie/EQCyAMkb6bNyNlKPH0tJbubk1VVjASqyq9sZwkJ8AbxMkxxU/9587d8a330793106", "bg": "#212121", "key": "trappedheart-244"}, {"title": "Skull Flower", "number": "5987", "lottie": "https://ddejfvww7sqtk.cloudfront.net/nft-content-cache/lottie/EQBaOL8mH5YywkXjkps65X1OLPNH7pns4YcfLmaVpFaoNKZn/6e1f4f7c0b206b03_194a967c648", "bg": "#DFE6E9", "key": "skullflower-5987"}, {"title": "Durov’s Cap", "number": "204", "lottie": "https://ddejfvww7sqtk.cloudfront.net/nft-content-cache/lottie/EQD9ikZq6xPgKjzmdBG0G0S80RvUJjbwgHrPZXDKc_wsE84w/467c718f1c6b9232", "bg": "#0D47A1", "key": "durovscap-204"}, {"title": "Plush Pepe", "number": "1194", "lottie": "https://ddejfvww7sqtk.cloudfront.net/nft-content-cache/lottie/EQBG-g6ahkAUGWpefWbx-D_9sQ8oWbvy6puuq78U2c4NUDFS/1e2b8edb5ca3bf71_194a96db50b", "bg": "#BF360C", "key": "plushpepe-1194"}, {"title": "Trapped Heart", "number": "2003", "lottie": "https://ddejfvww7sqtk.cloudfront.net/nft-content-cache/lottie/EQCyAMkb6bNyNlKPH0tJbubk1VVjASqyq9sZwkJ8AbxMkxxU/763eba9f28416229", "bg": "#2d3436", "key": "trappedheart-2003"}, {"title": "Durov’s Cap", "number": "1444", "lottie": "https://ddejfvww7sqtk.cloudfront.net/nft-content-cache/lottie/EQD9ikZq6xPgKjzmdBG0G0S80RvUJjbwgHrPZXDKc_wsE84w/96aa0340ba123fdf", "bg": "#1B5E20", "key": "durovscap-1444"}, {"title": "Spiced Wine", "number": "8057", "lottie": "https://ddejfvww7sqtk.cloudfront.net/nft-content-cache/lottie/EQA8DCWyCWyywgOKYORerRoSVevWrUQ_FjKQgNihxY1227x7/7b493d15df351e09", "bg": "#2d3436", "key": "spicedwine-8057"}, {"title": "Santa Hat", "number": "2068", "lottie": "https://ddejfvww7sqtk.cloudfront.net/nft-content-cache/lottie/EQAaTIR7oJyowDiumYLVN0oe61kGE3I6EPEn7WgHPGuWAeCy/46229fb0e61121e8", "bg": "#2d3436", "key": "santahat-2068"}, {"title": "Durov’s Cap", "number": "714", "lottie": "https://ddejfvww7sqtk.cloudfront.net/nft-content-cache/lottie/EQD9ikZq6xPgKjzmdBG0G0S80RvUJjbwgHrPZXDKc_wsE84w/1ff12059e7ae9c4a", "bg": "#1B5E20", "key": "durovscap-714"}, {"title": "Precious Peach", "number": "45", "lottie": "https://ddejfvww7sqtk.cloudfront.net/nft-content-cache/lottie/EQA4i58iuS9DUYRtUZ97sZo5mnkbiYUBpWXQOe3dEUCcP1W8/a3ac863e85872512", "bg": "#2d3436", "key": "preciouspeach-45"}, {"title": "Sharp Tongue", "number": "3735", "lottie": "https://ddejfvww7sqtk.cloudfront.net/nft-content-cache/lottie/EQBw2tO5UaJ4c_YXt3I8y5KD0k37staZxedV2O5HmryiK0dN/0eb50d6e7b9b822c_194a970f43d", "bg": "#0D47A1", "key": "sharptongue-3735"}, {"title": "Spy Agaric", "number": "1048", "lottie": "https://ddejfvww7sqtk.cloudfront.net/nft-content-cache/lottie/EQD6mH9bwbn6S3M_tCRWOvqAIW8M34kRwbI01niGLRPeDPsl/1d7c5beb8c1124fd", "bg": "#212121", "key": "spyagaric-1048"}, {"title": "Jelly Bunny", "number": "844", "lottie": "https://ddejfvww7sqtk.cloudfront.net/nft-content-cache/lottie/EQAwzubeoJwnqmmBuTPpnUSurRzWPB8ERzcfzx55Z2YjE0jx/6a9d8347ca00a1bc", "bg": "#2d3436", "key": "jellybunny-844"}, {"title": "Durov’s Cap", "number": "811", "lottie": "https://ddejfvww7sqtk.cloudfront.net/nft-content-cache/lottie/EQD9ikZq6xPgKjzmdBG0G0S80RvUJjbwgHrPZXDKc_wsE84w/fe105957dd3f1b40", "bg": "#B71C1C", "key": "durovscap-811"}, {"title": "Signet Ring", "number": "151", "lottie": "https://ddejfvww7sqtk.cloudfront.net/nft-content-cache/lottie/EQCrGA9slCoksgD-NyRDjtHySKN0Ts8k6hdueJkUkZZdD4_K/f45025599e91afd7_194a978e47c", "bg": "#2d3436", "key": "signetring-151"}, {"title": "Evil Eye", "number": "2108", "lottie": "https://ddejfvww7sqtk.cloudfront.net/nft-content-cache/lottie/EQDQ6DjRabTYSAxf2xrZsnsXtqcIm1bj9dF5x_h8lNjWPmH4/c8d12830889af837", "bg": "#2d3436", "key": "evileye-2108"}, {"title": "Trapped Heart", "number": "49", "lottie": "https://ddejfvww7sqtk.cloudfront.net/nft-content-cache/lottie/EQCyAMkb6bNyNlKPH0tJbubk1VVjASqyq9sZwkJ8AbxMkxxU/b117637bb1db9405", "bg": "#2d3436", "key": "trappedheart-49"}, {"title": "Sharp Tongue", "number": "1168", "lottie": "https://ddejfvww7sqtk.cloudfront.net/nft-content-cache/lottie/EQBw2tO5UaJ4c_YXt3I8y5KD0k37staZxedV2O5HmryiK0dN/34de405efea12b71_194a970761f", "bg": "#0D47A1", "key": "sharptongue-1168"}, {"title": "Evil Eye", "number": "12802", "lottie": "https://ddejfvww7sqtk.cloudfront.net/nft-content-cache/lottie/EQDQ6DjRabTYSAxf2xrZsnsXtqcIm1bj9dF5x_h8lNjWPmH4/51644b99e49f89d8", "bg": "#2d3436", "key": "evileye-12802"}, {"title": "Spy Agaric", "number": "20945", "lottie": "https://ddejfvww7sqtk.cloudfront.net/nft-content-cache/lottie/EQD6mH9bwbn6S3M_tCRWOvqAIW8M34kRwbI01niGLRPeDPsl/197be79e840afc7f", "bg": "#2d3436", "key": "spyagaric-20945"}, {"title": "Durov’s Cap", "number": "673", "lottie": "https://ddejfvww7sqtk.cloudfront.net/nft-content-cache/lottie/EQD9ikZq6xPgKjzmdBG0G0S80RvUJjbwgHrPZXDKc_wsE84w/8fa3ce8d8fc67284", "bg": "#1B5E20", "key": "durovscap-673"}, {"title": "Durov’s Cap", "number": "722", "lottie": "https://ddejfvww7sqtk.cloudfront.net/nft-content-cache/lottie/EQD9ikZq6xPgKjzmdBG0G0S80RvUJjbwgHrPZXDKc_wsE84w/96a5a2eccb7c816e", "bg": "#2d3436", "key": "durovscap-722"}, {"title": "Skull Flower", "number": "45", "lottie": "https://ddejfvww7sqtk.cloudfront.net/nft-content-cache/lottie/EQBaOL8mH5YywkXjkps65X1OLPNH7pns4YcfLmaVpFaoNKZn/1c76b046f08ee96a_194a967b32e", "bg": "#0D47A1", "key": "skullflower-45"}, {"title": "Sharp Tongue", "number": "1096", "lottie": "https://ddejfvww7sqtk.cloudfront.net/nft-content-cache/lottie/EQBw2tO5UaJ4c_YXt3I8y5KD0k37staZxedV2O5HmryiK0dN/584fa1e24938fd15_194a96fb739", "bg": "#2d3436", "key": "sharptongue-1096"}, {"title": "Spy Agaric", "number": "5520", "lottie": "https://ddejfvww7sqtk.cloudfront.net/nft-content-cache/lottie/EQD6mH9bwbn6S3M_tCRWOvqAIW8M34kRwbI01niGLRPeDPsl/6828d50985fd08e6", "bg": "#2d3436", "key": "spyagaric-5520"}, {"title": "Durov’s Cap", "number": "2558", "lottie": "https://ddejfvww7sqtk.cloudfront.net/nft-content-cache/lottie/EQD9ikZq6xPgKjzmdBG0G0S80RvUJjbwgHrPZXDKc_wsE84w/d473b934df7000ec", "bg": "#2d3436", "key": "durovscap-2558"}, {"title": "Durov’s Cap", "number": "660", "lottie": "https://ddejfvww7sqtk.cloudfront.net/nft-content-cache/lottie/EQD9ikZq6xPgKjzmdBG0G0S80RvUJjbwgHrPZXDKc_wsE84w/c53299bab268170a", "bg": "#0D47A1", "key": "durovscap-660"}, {"title": "Magic Potion", "number": "1157", "lottie": "https://ddejfvww7sqtk.cloudfront.net/nft-content-cache/lottie/EQAtFU9GrGfix4UG9DOivN58QxvgBJUaAZ_pdZBZCmbhKo4P/4b5a3e64f520fb91", "bg": "#1B5E20", "key": "magicpotion-1157"}, {"title": "Hex Pot", "number": "4119", "lottie": "https://ddejfvww7sqtk.cloudfront.net/nft-content-cache/lottie/EQB6AtBPOuTtQml8oSA7X8ZqJ5QmcOYYqoz92sQYXGUQrxyB/d569a39db1b612ba_194a961be71", "bg": "#2d3436", "key": "hexpot-4119"}, {"title": "Magic Potion", "number": "1375", "lottie": "https://ddejfvww7sqtk.cloudfront.net/nft-content-cache/lottie/EQAtFU9GrGfix4UG9DOivN58QxvgBJUaAZ_pdZBZCmbhKo4P/c420098c9cc43b2a", "bg": "#2d3436", "key": "magicpotion-1375"}, {"title": "Spy Agaric", "number": "20946", "lottie": "https://ddejfvww7sqtk.cloudfront.net/nft-content-cache/lottie/EQD6mH9bwbn6S3M_tCRWOvqAIW8M34kRwbI01niGLRPeDPsl/03572a34b2c29408", "bg": "#212121", "key": "spyagaric-20946"}, {"title": "B-Day Candle", "number": "138345", "lottie": "https://ddejfvww7sqtk.cloudfront.net/nft-content-cache/lottie/EQCwEFfUbbR-22fn3VgxUpBil7bwBQqEHm7wgQYbWY9c08YJ/beeaea3af4db4301", "bg": "#2d3436", "key": "bdaycandle-138345"}, {"title": "Instant Ramen", "number": "144702", "lottie": "https://ddejfvww7sqtk.cloudfront.net/nft-content-cache/lottie/EQBIj0uF-qIASqv6qIvcTif2wKSdt4WQc4mcoBywNp5GntuG/4305a61924a83a9f", "bg": "#0D47A1", "key": "instantramen-144702"}, {"title": "Spring Basket", "number": "61462", "lottie": "https://ddejfvww7sqtk.cloudfront.net/nft-content-cache/lottie/EQCZ4-h65iTiWDPRPcLlS63gbcS40YBadEFLA4W-iIWUZld0/997da509e065fc33", "bg": "#2d3436", "key": "springbasket-61462"}, {"title": "Mousse Cake", "number": "78867", "lottie": "https://ddejfvww7sqtk.cloudfront.net/nft-content-cache/lottie/EQBjzdi27ZI-Re93OOIia0m7YmUU8d8ubJNsStZTc7qNJnOv/15f9ac73ef15292a", "bg": "#2d3436", "key": "moussecake-78867"}, {"title": "Xmas Stocking", "number": "48335", "lottie": "https://ddejfvww7sqtk.cloudfront.net/nft-content-cache/lottie/EQDz_VecErEBTLOTiR1tq0VS3lZuHHqhYmhZbthcrbFk7ztK/3fde93225df39441", "bg": "#1B5E20", "key": "xmasstocking-48335"}, {"title": "Light Sword", "number": "10732", "lottie": "https://ddejfvww7sqtk.cloudfront.net/nft-content-cache/lottie/EQDRrfw5pgIC4e6NafUAx52Z9Ym6q1k26xxaXR_qx0LKJJ7D/4b4849c5d8998129", "bg": "#1B5E20", "key": "lightsword-10732"}, {"title": "Instant Ramen", "number": "61148", "lottie": "https://ddejfvww7sqtk.cloudfront.net/nft-content-cache/lottie/EQBIj0uF-qIASqv6qIvcTif2wKSdt4WQc4mcoBywNp5GntuG/af2aaa5e79804666", "bg": "#2d3436", "key": "instantramen-61148"}, {"title": "Input Key", "number": "117029", "lottie": "https://ddejfvww7sqtk.cloudfront.net/nft-content-cache/lottie/EQBSIId7sMmlqN8oBGaMNtUeuaLeSQPUR1ByMwpnfWL3hhZq/70d0b6f99dfd6a04", "bg": "#0D47A1", "key": "inputkey-117029"}, {"title": "Xmas Stocking", "number": "49842", "lottie": "https://ddejfvww7sqtk.cloudfront.net/nft-content-cache/lottie/EQDz_VecErEBTLOTiR1tq0VS3lZuHHqhYmhZbthcrbFk7ztK/321c075892078069", "bg": "#0D47A1", "key": "xmasstocking-49842"}, {"title": "Pet Snake", "number": "49367", "lottie": "https://ddejfvww7sqtk.cloudfront.net/nft-content-cache/lottie/EQBBLRFtC_3PLxNpWX5nfchwapk7eWcG3dzKoxbV6cWzqROo/6041ed1a071bd022", "bg": "#5D4037", "key": "petsnake-49367"}, {"title": "Bow Tie", "number": "19767", "lottie": "https://ddejfvww7sqtk.cloudfront.net/nft-content-cache/lottie/EQDpxJ6VAwUA-tX6w8ACnoAJLrP3hKWmieBl71uv1_qKRD3x/9a1ecf7da1529206", "bg": "#1B5E20", "key": "bowtie-19767"}, {"title": "Instant Ramen", "number": "337835", "lottie": "https://ddejfvww7sqtk.cloudfront.net/nft-content-cache/lottie/EQBIj0uF-qIASqv6qIvcTif2wKSdt4WQc4mcoBywNp5GntuG/327c9ae0ae021cad", "bg": "#212121", "key": "instantramen-337835"}, {"title": "Spring Basket", "number": "40436", "lottie": "https://ddejfvww7sqtk.cloudfront.net/nft-content-cache/lottie/EQCZ4-h65iTiWDPRPcLlS63gbcS40YBadEFLA4W-iIWUZld0/0817e2a1fae3e3a8", "bg": "#FFD700", "key": "springbasket-40436"}, {"title": "Instant Ramen", "number": "237764", "lottie": "https://ddejfvww7sqtk.cloudfront.net/nft-content-cache/lottie/EQBIj0uF-qIASqv6qIvcTif2wKSdt4WQc4mcoBywNp5GntuG/dd2d33a6924b813d", "bg": "#0D47A1", "key": "instantramen-237764"}, {"title": "Stellar Rocket", "number": "16998", "lottie": "https://ddejfvww7sqtk.cloudfront.net/nft-content-cache/lottie/EQDIruSTyxvq60gUH8j2kkj3qzoBrBaJy9WkKbeNNRasWe4j/a38807b87c66c48a", "bg": "#2d3436", "key": "stellarrocket-16998"}, {"title": "Money Pot", "number": "5520", "lottie": "https://ddejfvww7sqtk.cloudfront.net/nft-content-cache/lottie/EQBM3U1twWjI_vYUaPdFkzZs1q9c0orHhQjx0m2Xa9ljgTqY/b59b373793cdb863", "bg": "#2d3436", "key": "moneypot-5520"}, {"title": "Input Key", "number": "78219", "lottie": "https://ddejfvww7sqtk.cloudfront.net/nft-content-cache/lottie/EQBSIId7sMmlqN8oBGaMNtUeuaLeSQPUR1ByMwpnfWL3hhZq/5551e054276259e8", "bg": "#2d3436", "key": "inputkey-78219"}, {"title": "Spring Basket", "number": "3249", "lottie": "https://ddejfvww7sqtk.cloudfront.net/nft-content-cache/lottie/EQCZ4-h65iTiWDPRPcLlS63gbcS40YBadEFLA4W-iIWUZld0/4f3587b4ece8f203", "bg": "#FFD700", "key": "springbasket-3249"}, {"title": "Instant Ramen", "number": "31123", "lottie": "https://ddejfvww7sqtk.cloudfront.net/nft-content-cache/lottie/EQBIj0uF-qIASqv6qIvcTif2wKSdt4WQc4mcoBywNp5GntuG/2cbad84fa6efa64e", "bg": "#FFD700", "key": "instantramen-31123"}, {"title": "Holiday Drink", "number": "39721", "lottie": "https://ddejfvww7sqtk.cloudfront.net/nft-content-cache/lottie/EQB5P3ZP2PjLION52Y1SNAux1do4-ZOqMWotXS-fdMpqHcCH/89ae17edf8f4ef9a", "bg": "#1B5E20", "key": "holidaydrink-39721"}, {"title": "Spring Basket", "number": "13321", "lottie": "https://ddejfvww7sqtk.cloudfront.net/nft-content-cache/lottie/EQCZ4-h65iTiWDPRPcLlS63gbcS40YBadEFLA4W-iIWUZld0/642532066e23d11e", "bg": "#5D4037", "key": "springbasket-13321"}, {"title": "Mousse Cake", "number": "74402", "lottie": "https://ddejfvww7sqtk.cloudfront.net/nft-content-cache/lottie/EQBjzdi27ZI-Re93OOIia0m7YmUU8d8ubJNsStZTc7qNJnOv/1768f0087dbcbe5d", "bg": "#212121", "key": "moussecake-74402"}, {"title": "Eternal Candle", "number": "13035", "lottie": "https://ddejfvww7sqtk.cloudfront.net/nft-content-cache/lottie/EQBzZLNIr4lie0pTfrbRsANJOtFYwY5gmngRfs84Ras5-aVN/d30420f7835ad1b9", "bg": "#2d3436", "key": "eternalcandle-13035"}, {"title": "Happy Brownie", "number": "2334", "lottie": "https://ddejfvww7sqtk.cloudfront.net/nft-content-cache/lottie/EQB1ATaKGNYk6T5R2cA18BOF-KB_idaKKigwYI2jtjWuLg8n/867e29078b1e9a77", "bg": "#0D47A1", "key": "happybrownie-2334"}, {"title": "Lush Bouquet", "number": "17999", "lottie": "https://ddejfvww7sqtk.cloudfront.net/nft-content-cache/lottie/EQA2lHcvZWW_bN_2NMKrkEUv9xz6fx8wTE5upa8u1neZb6hJ/9861213cc4106527", "bg": "#0D47A1", "key": "lushbouquet-17999"}, {"title": "Desk Calendar", "number": "83356", "lottie": "https://ddejfvww7sqtk.cloudfront.net/nft-content-cache/lottie/EQBMcfMAZlMUr1W3X8kdEw3fJMUAaWH4-XcmE5R5RfFIY0E2/114be9b1c34c45f3", "bg": "#2d3436", "key": "deskcalendar-83356"}, {"title": "Happy Brownie", "number": "65737", "lottie": "https://ddejfvww7sqtk.cloudfront.net/nft-content-cache/lottie/EQB1ATaKGNYk6T5R2cA18BOF-KB_idaKKigwYI2jtjWuLg8n/ee65a489afbc2377", "bg": "#2d3436", "key": "happybrownie-65737"}, {"title": "Money Pot", "number": "21151", "lottie": "https://ddejfvww7sqtk.cloudfront.net/nft-content-cache/lottie/EQBM3U1twWjI_vYUaPdFkzZs1q9c0orHhQjx0m2Xa9ljgTqY/8e712b9dd76e96b4", "bg": "#FFD700", "key": "moneypot-21151"}, {"title": "Lol Pop", "number": "223387", "lottie": "https://ddejfvww7sqtk.cloudfront.net/nft-content-cache/lottie/EQC6zjid8vJNEWqcXk10XjsdDLRKbcPZzbHusuEW6FokOWIm/6557a42394a777d1", "bg": "#2d3436", "key": "lolpop-223387"}, {"title": "Holiday Drink", "number": "37790", "lottie": "https://ddejfvww7sqtk.cloudfront.net/nft-content-cache/lottie/EQB5P3ZP2PjLION52Y1SNAux1do4-ZOqMWotXS-fdMpqHcCH/cfb3b511d0a1f072", "bg": "#2d3436", "key": "holidaydrink-37790"}, {"title": "Money Pot", "number": "3413", "lottie": "https://ddejfvww7sqtk.cloudfront.net/nft-content-cache/lottie/EQBM3U1twWjI_vYUaPdFkzZs1q9c0orHhQjx0m2Xa9ljgTqY/75f8a2cef23b8b91", "bg": "#0D47A1", "key": "moneypot-3413"}, {"title": "Lol Pop", "number": "391248", "lottie": "https://ddejfvww7sqtk.cloudfront.net/nft-content-cache/lottie/EQC6zjid8vJNEWqcXk10XjsdDLRKbcPZzbHusuEW6FokOWIm/83d77b400ab6c6d8", "bg": "#3E2723", "key": "lolpop-391248"}, {"title": "Spring Basket", "number": "51766", "lottie": "https://ddejfvww7sqtk.cloudfront.net/nft-content-cache/lottie/EQCZ4-h65iTiWDPRPcLlS63gbcS40YBadEFLA4W-iIWUZld0/012260a2e2b83f45", "bg": "#0D47A1", "key": "springbasket-51766"}, {"title": "Happy Brownie", "number": "893", "lottie": "https://ddejfvww7sqtk.cloudfront.net/nft-content-cache/lottie/EQB1ATaKGNYk6T5R2cA18BOF-KB_idaKKigwYI2jtjWuLg8n/0e50d6a0df1ee3d6", "bg": "#FFD700", "key": "happybrownie-893"}, {"title": "Xmas Stocking", "number": "50773", "lottie": "https://ddejfvww7sqtk.cloudfront.net/nft-content-cache/lottie/EQDz_VecErEBTLOTiR1tq0VS3lZuHHqhYmhZbthcrbFk7ztK/145435f030c4eac1", "bg": "#2d3436", "key": "xmasstocking-50773"}, {"title": "Light Sword", "number": "74621", "lottie": "https://ddejfvww7sqtk.cloudfront.net/nft-content-cache/lottie/EQDRrfw5pgIC4e6NafUAx52Z9Ym6q1k26xxaXR_qx0LKJJ7D/c60f527970e53157", "bg": "#E65100", "key": "lightsword-74621"}, {"title": "Whip Cupcake", "number": "79613", "lottie": "https://ddejfvww7sqtk.cloudfront.net/nft-content-cache/lottie/EQAo_snApDDqF6GKV0xe_T5oe28r842gJtgmkgPMhX0-dRkh/c205b7f732cce65a", "bg": "#2d3436", "key": "whipcupcake-79613"}, {"title": "Snake Box", "number": "9804", "lottie": "https://ddejfvww7sqtk.cloudfront.net/nft-content-cache/lottie/EQBbUKx5CalEly2TekDNeFbv4e02pj6xsAqXZP0X_AprKj4I/5f878babe7aa5692", "bg": "#1B5E20", "key": "snakebox-9804"}, {"title": "Party Sparkler", "number": "33439", "lottie": "https://ddejfvww7sqtk.cloudfront.net/nft-content-cache/lottie/EQCa1I09fE9UoTV6awM6QC9-fkv51hoii24w1tJoFfigG_ax/d425bb0123a64bd0", "bg": "#2d3436", "key": "partysparkler-33439"}, {"title": "Xmas Stocking", "number": "16018", "lottie": "https://ddejfvww7sqtk.cloudfront.net/nft-content-cache/lottie/EQDz_VecErEBTLOTiR1tq0VS3lZuHHqhYmhZbthcrbFk7ztK/bc2a50f76db7b370", "bg": "#2d3436", "key": "xmasstocking-16018"}, {"title": "Xmas Stocking", "number": "21971", "lottie": "https://ddejfvww7sqtk.cloudfront.net/nft-content-cache/lottie/EQDz_VecErEBTLOTiR1tq0VS3lZuHHqhYmhZbthcrbFk7ztK/94d12fdbf2bad480", "bg": "#2d3436", "key": "xmasstocking-21971"}, {"title": "Whip Cupcake", "number": "41868", "lottie": "https://ddejfvww7sqtk.cloudfront.net/nft-content-cache/lottie/EQAo_snApDDqF6GKV0xe_T5oe28r842gJtgmkgPMhX0-dRkh/b596beef45184d47", "bg": "#0D47A1", "key": "whipcupcake-41868"}, {"title": "Lol Pop", "number": "147748", "lottie": "https://ddejfvww7sqtk.cloudfront.net/nft-content-cache/lottie/EQC6zjid8vJNEWqcXk10XjsdDLRKbcPZzbHusuEW6FokOWIm/31e81e9b33cb0e7e", "bg": "#0D47A1", "key": "lolpop-147748"}, {"title": "Valentine Box", "number": "14448", "lottie": "https://ddejfvww7sqtk.cloudfront.net/nft-content-cache/lottie/EQDjBdu3zS-JT94OwIup4KVNaQjxDzGcIPRJ24Ha0Y8jLw83/5360e6ef35aefa3e", "bg": "#0D47A1", "key": "valentinebox-14448"}, {"title": "Whip Cupcake", "number": "10020", "lottie": "https://ddejfvww7sqtk.cloudfront.net/nft-content-cache/lottie/EQAo_snApDDqF6GKV0xe_T5oe28r842gJtgmkgPMhX0-dRkh/1ea6b3b9da1c01dc", "bg": "#1B5E20", "key": "whipcupcake-10020"}, {"title": "Big Year", "number": "21435", "lottie": "https://ddejfvww7sqtk.cloudfront.net/nft-content-cache/lottie/EQDx-SqQEhP9Rzfi2cqdehTVUvQbArsUz1X7t-ul8IiKZpYb/7ef848177d736176", "bg": "#2d3436", "key": "bigyear-21435"}, {"title": "Sleigh Bell", "number": "2124", "lottie": "https://ddejfvww7sqtk.cloudfront.net/nft-content-cache/lottie/EQBcNxMCTyEHkcQ5cK3fO_3Ebjf6JcA5JJ_OJV4npDN-604P/cf9fb31b73343828", "bg": "#2d3436", "key": "sleighbell-2124"}, {"title": "Lunar Snake", "number": "6450", "lottie": "https://ddejfvww7sqtk.cloudfront.net/nft-content-cache/lottie/EQC2lsUy1SKxJEJBwj5ZCfVnLPvAqDqy5c26Xg8xS_pDTXGk/115b15bf39802048", "bg": "#2d3436", "key": "lunarsnake-6450"}, {"title": "Spring Basket", "number": "51766", "lottie": "https://ddejfvww7sqtk.cloudfront.net/nft-content-cache/lottie/EQCZ4-h65iTiWDPRPcLlS63gbcS40YBadEFLA4W-iIWUZld0/012260a2e2b83f45", "bg": "#0D47A1", "key": "springbasket-51766"}, {"title": "Instant Ramen", "number": "268537", "lottie": "https://ddejfvww7sqtk.cloudfront.net/nft-content-cache/lottie/EQBIj0uF-qIASqv6qIvcTif2wKSdt4WQc4mcoBywNp5GntuG/2cea572c8d0b3626", "bg": "#2d3436", "key": "instantramen-268537"}, {"title": "Light Sword", "number": "16385", "lottie": "https://ddejfvww7sqtk.cloudfront.net/nft-content-cache/lottie/EQDRrfw5pgIC4e6NafUAx52Z9Ym6q1k26xxaXR_qx0LKJJ7D/e5aec76f555361ec", "bg": "#0D47A1", "key": "lightsword-16385"}, {"title": "Stellar Rocket", "number": "4670", "lottie": "https://ddejfvww7sqtk.cloudfront.net/nft-content-cache/lottie/EQDIruSTyxvq60gUH8j2kkj3qzoBrBaJy9WkKbeNNRasWe4j/8806f24cb3a60959", "bg": "#0D47A1", "key": "stellarrocket-4670"}, {"title": "Ice Cream", "number": "32207", "lottie": "https://ddejfvww7sqtk.cloudfront.net/nft-content-cache/lottie/EQBUvskEvmWdp_V6HX-2Tyfp4mFSzMzdg9TaUz6zKVz6Ov3f/ce940da83d0e2a37", "bg": "#2d3436", "key": "icecream-32207"}, {"title": "Ice Cream", "number": "11990", "lottie": "https://ddejfvww7sqtk.cloudfront.net/nft-content-cache/lottie/EQBUvskEvmWdp_V6HX-2Tyfp4mFSzMzdg9TaUz6zKVz6Ov3f/ed29738cf47628ed", "bg": "#1B5E20", "key": "icecream-11990"}, {"title": "Big Year", "number": "43069", "lottie": "https://ddejfvww7sqtk.cloudfront.net/nft-content-cache/lottie/EQDx-SqQEhP9Rzfi2cqdehTVUvQbArsUz1X7t-ul8IiKZpYb/14719b583987048c", "bg": "#2d3436", "key": "bigyear-43069"}, {"title": "Party Sparkler", "number": "33439", "lottie": "https://ddejfvww7sqtk.cloudfront.net/nft-content-cache/lottie/EQCa1I09fE9UoTV6awM6QC9-fkv51hoii24w1tJoFfigG_ax/d425bb0123a64bd0", "bg": "#2d3436", "key": "partysparkler-33439"}, {"title": "Snoop Cigar", "number": "66262", "lottie": "https://ddejfvww7sqtk.cloudfront.net/nft-content-cache/lottie/EQA72Uevr_MHvzYwSCHJUK-uC6kd-w8kbxzhJ49WIiG-o6CD/3687a49c80ea2070", "bg": "#2d3436", "key": "snoopcigar-66262"}, {"title": "Instant Ramen", "number": "177764", "lottie": "https://ddejfvww7sqtk.cloudfront.net/nft-content-cache/lottie/EQBIj0uF-qIASqv6qIvcTif2wKSdt4WQc4mcoBywNp5GntuG/e739cade1266d193", "bg": "#2d3436", "key": "instantramen-177764"}, {"title": "B-Day Candle", "number": "213851", "lottie": "https://ddejfvww7sqtk.cloudfront.net/nft-content-cache/lottie/EQCwEFfUbbR-22fn3VgxUpBil7bwBQqEHm7wgQYbWY9c08YJ/6ab8e1eb6a17f041", "bg": "#0D47A1", "key": "bdaycandle-213851"}, {"title": "Lush Bouquet", "number": "17999", "lottie": "https://ddejfvww7sqtk.cloudfront.net/nft-content-cache/lottie/EQA2lHcvZWW_bN_2NMKrkEUv9xz6fx8wTE5upa8u1neZb6hJ/9861213cc4106527", "bg": "#0D47A1", "key": "lushbouquet-17999"}, {"title": "Happy Brownie", "number": "65737", "lottie": "https://ddejfvww7sqtk.cloudfront.net/nft-content-cache/lottie/EQB1ATaKGNYk6T5R2cA18BOF-KB_idaKKigwYI2jtjWuLg8n/ee65a489afbc2377", "bg": "#2d3436", "key": "happybrownie-65737"}, {"title": "Spy Agaric", "number": "16078", "lottie": "https://ddejfvww7sqtk.cloudfront.net/nft-content-cache/lottie/EQD6mH9bwbn6S3M_tCRWOvqAIW8M34kRwbI01niGLRPeDPsl/612bb50aa702d56d", "bg": "#2d3436", "key": "spyagaric-16078"}, {"title": "Holiday Drink", "number": "476", "lottie": "https://ddejfvww7sqtk.cloudfront.net/nft-content-cache/lottie/EQB5P3ZP2PjLION52Y1SNAux1do4-ZOqMWotXS-fdMpqHcCH/21c75e13ebea59a8", "bg": "#2d3436", "key": "holidaydrink-476"}, {"title": "Eternal Candle", "number": "13035", "lottie": "https://ddejfvww7sqtk.cloudfront.net/nft-content-cache/lottie/EQBzZLNIr4lie0pTfrbRsANJOtFYwY5gmngRfs84Ras5-aVN/d30420f7835ad1b9", "bg": "#2d3436", "key": "eternalcandle-13035"}, {"title": "Light Sword", "number": "64130", "lottie": "https://ddejfvww7sqtk.cloudfront.net/nft-content-cache/lottie/EQDRrfw5pgIC4e6NafUAx52Z9Ym6q1k26xxaXR_qx0LKJJ7D/cadc11230ecd0500", "bg": "#2d3436", "key": "lightsword-64130"}, {"title": "Spy Agaric", "number": "12494", "lottie": "https://ddejfvww7sqtk.cloudfront.net/nft-content-cache/lottie/EQD6mH9bwbn6S3M_tCRWOvqAIW8M34kRwbI01niGLRPeDPsl/df1a1db62a49fd1f", "bg": "#1B5E20", "key": "spyagaric-12494"}, {"title": "Lol Pop", "number": "147748", "lottie": "https://ddejfvww7sqtk.cloudfront.net/nft-content-cache/lottie/EQC6zjid8vJNEWqcXk10XjsdDLRKbcPZzbHusuEW6FokOWIm/31e81e9b33cb0e7e", "bg": "#0D47A1", "key": "lolpop-147748"}, {"title": "Happy Brownie", "number": "54791", "lottie": "https://ddejfvww7sqtk.cloudfront.net/nft-content-cache/lottie/EQB1ATaKGNYk6T5R2cA18BOF-KB_idaKKigwYI2jtjWuLg8n/24b5d9aba471f197", "bg": "#0D47A1", "key": "happybrownie-54791"}, {"title": "Desk Calendar", "number": "83356", "lottie": "https://ddejfvww7sqtk.cloudfront.net/nft-content-cache/lottie/EQBMcfMAZlMUr1W3X8kdEw3fJMUAaWH4-XcmE5R5RfFIY0E2/114be9b1c34c45f3", "bg": "#2d3436", "key": "deskcalendar-83356"}, {"title": "Money Pot", "number": "3413", "lottie": "https://ddejfvww7sqtk.cloudfront.net/nft-content-cache/lottie/EQBM3U1twWjI_vYUaPdFkzZs1q9c0orHhQjx0m2Xa9ljgTqY/75f8a2cef23b8b91", "bg": "#0D47A1", "key": "moneypot-3413"}, {"title": "Whip Cupcake", "number": "79613", "lottie": "https://ddejfvww7sqtk.cloudfront.net/nft-content-cache/lottie/EQAo_snApDDqF6GKV0xe_T5oe28r842gJtgmkgPMhX0-dRkh/c205b7f732cce65a", "bg": "#2d3436", "key": "whipcupcake-79613"}, {"title": "Snoop Dogg", "number": "380303", "lottie": "https://ddejfvww7sqtk.cloudfront.net/nft-content-cache/lottie/EQAoJw7BpOcBD3y9voMuEQ-qhS3K4gtM-6EePLxkzk8iSifX/f77f9550f8c527fc", "bg": "#0D47A1", "key": "snoopdogg-380303"}, {"title": "Ice Cream", "number": "52575", "lottie": "https://ddejfvww7sqtk.cloudfront.net/nft-content-cache/lottie/EQBUvskEvmWdp_V6HX-2Tyfp4mFSzMzdg9TaUz6zKVz6Ov3f/fb132009a77ff352", "bg": "#4A148C", "key": "icecream-52575"}, {"title": "Lol Pop", "number": "6233", "lottie": "https://ddejfvww7sqtk.cloudfront.net/nft-content-cache/lottie/EQC6zjid8vJNEWqcXk10XjsdDLRKbcPZzbHusuEW6FokOWIm/c61f8280c1b16287", "bg": "#2d3436", "key": "lolpop-6233"}, {"title": "Happy Brownie", "number": "90268", "lottie": "https://ddejfvww7sqtk.cloudfront.net/nft-content-cache/lottie/EQB1ATaKGNYk6T5R2cA18BOF-KB_idaKKigwYI2jtjWuLg8n/187efccd5f098eb2", "bg": "#2d3436", "key": "happybrownie-90268"}, {"title": "Hex Pot", "number": "1403", "lottie": "https://ddejfvww7sqtk.cloudfront.net/nft-content-cache/lottie/EQB6AtBPOuTtQml8oSA7X8ZqJ5QmcOYYqoz92sQYXGUQrxyB/560f740273e37433", "bg": "#2d3436", "key": "hexpot-1403"}, {"title": "Lol Pop", "number": "30090", "lottie": "https://ddejfvww7sqtk.cloudfront.net/nft-content-cache/lottie/EQC6zjid8vJNEWqcXk10XjsdDLRKbcPZzbHusuEW6FokOWIm/91f8cd985ec547fb", "bg": "#0D47A1", "key": "lolpop-30090"}, {"title": "Spiced Wine", "number": "520", "lottie": "https://ddejfvww7sqtk.cloudfront.net/nft-content-cache/lottie/EQA8DCWyCWyywgOKYORerRoSVevWrUQ_FjKQgNihxY1227x7/82c360322a5aae9a", "bg": "#0D47A1", "key": "spicedwine-520"}, {"title": "Lol Pop", "number": "63494", "lottie": "https://ddejfvww7sqtk.cloudfront.net/nft-content-cache/lottie/EQC6zjid8vJNEWqcXk10XjsdDLRKbcPZzbHusuEW6FokOWIm/814f3720d3ba3b15", "bg": "#0D47A1", "key": "lolpop-63494"}, {"title": "Money Pot", "number": "38349", "lottie": "https://ddejfvww7sqtk.cloudfront.net/nft-content-cache/lottie/EQBM3U1twWjI_vYUaPdFkzZs1q9c0orHhQjx0m2Xa9ljgTqY/17270564d74cf632", "bg": "#2d3436", "key": "moneypot-38349"}, {"title": "Happy Brownie", "number": "2334", "lottie": "https://ddejfvww7sqtk.cloudfront.net/nft-content-cache/lottie/EQB1ATaKGNYk6T5R2cA18BOF-KB_idaKKigwYI2jtjWuLg8n/867e29078b1e9a77", "bg": "#0D47A1", "key": "happybrownie-2334"}, {"title": "Hex Pot", "number": "24588", "lottie": "https://ddejfvww7sqtk.cloudfront.net/nft-content-cache/lottie/EQB6AtBPOuTtQml8oSA7X8ZqJ5QmcOYYqoz92sQYXGUQrxyB/d952d8de71fcb96f", "bg": "#636E72", "key": "hexpot-24588"}, {"title": "Winter Wreath", "number": "4649", "lottie": "https://ddejfvww7sqtk.cloudfront.net/nft-content-cache/lottie/EQC8WVW9DSN4PPfFlCW2AHJkXxBUHBFsvnhXiYqSTpD7tXsp/9747bd49923e12ae", "bg": "#2d3436", "key": "winterwreath-4649"}, {"title": "Lol Pop", "number": "97718", "lottie": "https://ddejfvww7sqtk.cloudfront.net/nft-content-cache/lottie/EQC6zjid8vJNEWqcXk10XjsdDLRKbcPZzbHusuEW6FokOWIm/808565294086b235", "bg": "#FFD700", "key": "lolpop-97718"}, {"title": "Happy Brownie", "number": "60291", "lottie": "https://ddejfvww7sqtk.cloudfront.net/nft-content-cache/lottie/EQB1ATaKGNYk6T5R2cA18BOF-KB_idaKKigwYI2jtjWuLg8n/b3d7cc4bf8f408aa", "bg": "#2d3436", "key": "happybrownie-60291"}, {"title": "Happy Brownie", "number": "171936", "lottie": "https://ddejfvww7sqtk.cloudfront.net/nft-content-cache/lottie/EQB1ATaKGNYk6T5R2cA18BOF-KB_idaKKigwYI2jtjWuLg8n/c1e452dd6557c788", "bg": "#FFD700", "key": "happybrownie-171936"}, {"title": "Whip Cupcake", "number": "41868", "lottie": "https://ddejfvww7sqtk.cloudfront.net/nft-content-cache/lottie/EQAo_snApDDqF6GKV0xe_T5oe28r842gJtgmkgPMhX0-dRkh/b596beef45184d47", "bg": "#0D47A1", "key": "whipcupcake-41868"}, {"title": "Snake Box", "number": "8684", "lottie": "https://ddejfvww7sqtk.cloudfront.net/nft-content-cache/lottie/EQBbUKx5CalEly2TekDNeFbv4e02pj6xsAqXZP0X_AprKj4I/1232b1a26469912d", "bg": "#2d3436", "key": "snakebox-8684"}, {"title": "Lol Pop", "number": "223387", "lottie": "https://ddejfvww7sqtk.cloudfront.net/nft-content-cache/lottie/EQC6zjid8vJNEWqcXk10XjsdDLRKbcPZzbHusuEW6FokOWIm/6557a42394a777d1", "bg": "#2d3436", "key": "lolpop-223387"}, {"title": "Snoop Cigar", "number": "55523", "lottie": "https://ddejfvww7sqtk.cloudfront.net/nft-content-cache/lottie/EQA72Uevr_MHvzYwSCHJUK-uC6kd-w8kbxzhJ49WIiG-o6CD/795dbb346d3f9567", "bg": "#2d3436", "key": "snoopcigar-55523"}, {"title": "Snoop Dogg", "number": "221815", "lottie": "https://ddejfvww7sqtk.cloudfront.net/nft-content-cache/lottie/EQAoJw7BpOcBD3y9voMuEQ-qhS3K4gtM-6EePLxkzk8iSifX/2ecc8a9316608f10", "bg": "#E84393", "key": "snoopdogg-221815"}, {"title": "Xmas Stocking", "number": "16018", "lottie": "https://ddejfvww7sqtk.cloudfront.net/nft-content-cache/lottie/EQDz_VecErEBTLOTiR1tq0VS3lZuHHqhYmhZbthcrbFk7ztK/bc2a50f76db7b370", "bg": "#2d3436", "key": "xmasstocking-16018"}, {"title": "Snoop Dogg", "number": "30937", "lottie": "https://ddejfvww7sqtk.cloudfront.net/nft-content-cache/lottie/EQAoJw7BpOcBD3y9voMuEQ-qhS3K4gtM-6EePLxkzk8iSifX/f2cf578430125185", "bg": "#0D47A1", "key": "snoopdogg-30937"}, {"title": "Holiday Drink", "number": "37790", "lottie": "https://ddejfvww7sqtk.cloudfront.net/nft-content-cache/lottie/EQB5P3ZP2PjLION52Y1SNAux1do4-ZOqMWotXS-fdMpqHcCH/cfb3b511d0a1f072", "bg": "#2d3436", "key": "holidaydrink-37790"}, {"title": "Happy Brownie", "number": "893", "lottie": "https://ddejfvww7sqtk.cloudfront.net/nft-content-cache/lottie/EQB1ATaKGNYk6T5R2cA18BOF-KB_idaKKigwYI2jtjWuLg8n/0e50d6a0df1ee3d6", "bg": "#FFD700", "key": "happybrownie-893"}, {"title": "Lol Pop", "number": "29976", "lottie": "https://ddejfvww7sqtk.cloudfront.net/nft-content-cache/lottie/EQC6zjid8vJNEWqcXk10XjsdDLRKbcPZzbHusuEW6FokOWIm/ee790e254eb7c2f1", "bg": "#2d3436", "key": "lolpop-29976"}, {"title": "Input Key", "number": "12448", "lottie": "https://ddejfvww7sqtk.cloudfront.net/nft-content-cache/lottie/EQBSIId7sMmlqN8oBGaMNtUeuaLeSQPUR1ByMwpnfWL3hhZq/9dd0e15464a48f4b", "bg": "#2d3436", "key": "inputkey-12448"}, {"title": "Money Pot", "number": "21151", "lottie": "https://ddejfvww7sqtk.cloudfront.net/nft-content-cache/lottie/EQBM3U1twWjI_vYUaPdFkzZs1q9c0orHhQjx0m2Xa9ljgTqY/8e712b9dd76e96b4", "bg": "#FFD700", "key": "moneypot-21151"}, {"title": "Spy Agaric", "number": "367", "lottie": "https://ddejfvww7sqtk.cloudfront.net/nft-content-cache/lottie/EQD6mH9bwbn6S3M_tCRWOvqAIW8M34kRwbI01niGLRPeDPsl/afdee6f4c11cde80", "bg": "#1B5E20", "key": "spyagaric-367"}, {"title": "Hex Pot", "number": "8580", "lottie": "https://ddejfvww7sqtk.cloudfront.net/nft-content-cache/lottie/EQB6AtBPOuTtQml8oSA7X8ZqJ5QmcOYYqoz92sQYXGUQrxyB/8e1c172ecc60b8fc", "bg": "#4A148C", "key": "hexpot-8580"}, {"title": "Lol Pop", "number": "20928", "lottie": "https://ddejfvww7sqtk.cloudfront.net/nft-content-cache/lottie/EQC6zjid8vJNEWqcXk10XjsdDLRKbcPZzbHusuEW6FokOWIm/f9a77d1be88844ca", "bg": "#2d3436", "key": "lolpop-20928"}, {"title": "Spy Agaric", "number": "14336", "lottie": "https://ddejfvww7sqtk.cloudfront.net/nft-content-cache/lottie/EQD6mH9bwbn6S3M_tCRWOvqAIW8M34kRwbI01niGLRPeDPsl/b40a7fbd453a7b97", "bg": "#2d3436", "key": "spyagaric-14336"}, {"title": "Stellar Rocket", "number": "121829", "lottie": "https://ddejfvww7sqtk.cloudfront.net/nft-content-cache/lottie/EQDIruSTyxvq60gUH8j2kkj3qzoBrBaJy9WkKbeNNRasWe4j/ec1b5a5b65bdea43", "bg": "#0D47A1", "key": "stellarrocket-121829"}, {"title": "Pet Snake", "number": "14813", "lottie": "https://ddejfvww7sqtk.cloudfront.net/nft-content-cache/lottie/EQBBLRFtC_3PLxNpWX5nfchwapk7eWcG3dzKoxbV6cWzqROo/0ac1d964a91bfac0", "bg": "#2d3436", "key": "petsnake-14813"}, {"title": "Xmas Stocking", "number": "50773", "lottie": "https://ddejfvww7sqtk.cloudfront.net/nft-content-cache/lottie/EQDz_VecErEBTLOTiR1tq0VS3lZuHHqhYmhZbthcrbFk7ztK/145435f030c4eac1", "bg": "#2d3436", "key": "xmasstocking-50773"}, {"title": "Winter Wreath", "number": "46402", "lottie": "https://ddejfvww7sqtk.cloudfront.net/nft-content-cache/lottie/EQC8WVW9DSN4PPfFlCW2AHJkXxBUHBFsvnhXiYqSTpD7tXsp/b7ea957af7cb8efc", "bg": "#2d3436", "key": "winterwreath-46402"}, {"title": "Xmas Stocking", "number": "21971", "lottie": "https://ddejfvww7sqtk.cloudfront.net/nft-content-cache/lottie/EQDz_VecErEBTLOTiR1tq0VS3lZuHHqhYmhZbthcrbFk7ztK/94d12fdbf2bad480", "bg": "#2d3436", "key": "xmasstocking-21971"}, {"title": "Stellar Rocket", "number": "93416", "lottie": "https://ddejfvww7sqtk.cloudfront.net/nft-content-cache/lottie/EQDIruSTyxvq60gUH8j2kkj3qzoBrBaJy9WkKbeNNRasWe4j/9cc4ebfe768c1a58", "bg": "#2d3436", "key": "stellarrocket-93416"}, {"title": "Lol Pop", "number": "156320", "lottie": "https://ddejfvww7sqtk.cloudfront.net/nft-content-cache/lottie/EQC6zjid8vJNEWqcXk10XjsdDLRKbcPZzbHusuEW6FokOWIm/52f4020a563090d3", "bg": "#1B5E20", "key": "lolpop-156320"}, {"title": "Desk Calendar", "number": "42150", "lottie": "https://ddejfvww7sqtk.cloudfront.net/nft-content-cache/lottie/EQBMcfMAZlMUr1W3X8kdEw3fJMUAaWH4-XcmE5R5RfFIY0E2/b236b1dc3ff84092", "bg": "#0D47A1", "key": "deskcalendar-42150"}, {"title": "Witch Hat", "number": "31558", "lottie": "https://ddejfvww7sqtk.cloudfront.net/nft-content-cache/lottie/EQBD8aBKC4NsnYMqtkCfPQk2EVnieynJQp1UgZVyx1VmR5Ml/e72cf96d2737fa03", "bg": "#2d3436", "key": "witchhat-31558"}, {"title": "Valentine Box", "number": "14448", "lottie": "https://ddejfvww7sqtk.cloudfront.net/nft-content-cache/lottie/EQDjBdu3zS-JT94OwIup4KVNaQjxDzGcIPRJ24Ha0Y8jLw83/5360e6ef35aefa3e", "bg": "#0D47A1", "key": "valentinebox-14448"}, {"title": "Holiday Drink", "number": "20375", "lottie": "https://ddejfvww7sqtk.cloudfront.net/nft-content-cache/lottie/EQB5P3ZP2PjLION52Y1SNAux1do4-ZOqMWotXS-fdMpqHcCH/0ea43bc37b6420ee", "bg": "#2d3436", "key": "holidaydrink-20375"}, {"title": "Spy Agaric", "number": "31048", "lottie": "https://ddejfvww7sqtk.cloudfront.net/nft-content-cache/lottie/EQD6mH9bwbn6S3M_tCRWOvqAIW8M34kRwbI01niGLRPeDPsl/c6734eb16ffb7b8f", "bg": "#2d3436", "key": "spyagaric-31048"}, {"title": "Jack-in-the-Box", "number": "83020", "lottie": "https://ddejfvww7sqtk.cloudfront.net/nft-content-cache/lottie/EQA401QqpXtBnwIaDbFjwd5yXfP2mYiCusbJ3Zcw9eXR9CqL/2609e61086eefaae", "bg": "#2d3436", "key": "jackinthebox-83020"}, {"title": "Light Sword", "number": "74621", "lottie": "https://ddejfvww7sqtk.cloudfront.net/nft-content-cache/lottie/EQDRrfw5pgIC4e6NafUAx52Z9Ym6q1k26xxaXR_qx0LKJJ7D/c60f527970e53157", "bg": "#E65100", "key": "lightsword-74621"}, {"title": "Whip Cupcake", "number": "10020", "lottie": "https://ddejfvww7sqtk.cloudfront.net/nft-content-cache/lottie/EQAo_snApDDqF6GKV0xe_T5oe28r842gJtgmkgPMhX0-dRkh/1ea6b3b9da1c01dc", "bg": "#1B5E20", "key": "whipcupcake-10020"}, {"title": "Snake Box", "number": "9804", "lottie": "https://ddejfvww7sqtk.cloudfront.net/nft-content-cache/lottie/EQBbUKx5CalEly2TekDNeFbv4e02pj6xsAqXZP0X_AprKj4I/5f878babe7aa5692", "bg": "#1B5E20", "key": "snakebox-9804"}, {"title": "Input Key", "number": "59919", "lottie": "https://ddejfvww7sqtk.cloudfront.net/nft-content-cache/lottie/EQBSIId7sMmlqN8oBGaMNtUeuaLeSQPUR1ByMwpnfWL3hhZq/eade2742cbea1019", "bg": "#DFE6E9", "key": "inputkey-59919"}, {"title": "Lol Pop", "number": "391248", "lottie": "https://ddejfvww7sqtk.cloudfront.net/nft-content-cache/lottie/EQC6zjid8vJNEWqcXk10XjsdDLRKbcPZzbHusuEW6FokOWIm/83d77b400ab6c6d8", "bg": "#3E2723", "key": "lolpop-391248"}, {"title": "Happy Brownie", "number": "55694", "lottie": "https://ddejfvww7sqtk.cloudfront.net/nft-content-cache/lottie/EQB1ATaKGNYk6T5R2cA18BOF-KB_idaKKigwYI2jtjWuLg8n/428cb129fbd30660", "bg": "#2d3436", "key": "happybrownie-55694"}, {"title": "Ice Cream", "number": "223926", "lottie": "https://ddejfvww7sqtk.cloudfront.net/nft-content-cache/lottie/EQBUvskEvmWdp_V6HX-2Tyfp4mFSzMzdg9TaUz6zKVz6Ov3f/88a4bb33a8ef3072", "bg": "#0D47A1", "key": "icecream-223926"}, {"title": "Ice Cream", "number": "60895", "lottie": "https://ddejfvww7sqtk.cloudfront.net/nft-content-cache/lottie/EQBUvskEvmWdp_V6HX-2Tyfp4mFSzMzdg9TaUz6zKVz6Ov3f/375c5f56823fa519", "bg": "#2d3436", "key": "icecream-60895"}, {"title": "Snoop Cigar", "number": "78282", "lottie": "https://ddejfvww7sqtk.cloudfront.net/nft-content-cache/lottie/EQA72Uevr_MHvzYwSCHJUK-uC6kd-w8kbxzhJ49WIiG-o6CD/a5dce5a1b17611a9", "bg": "#2d3436", "key": "snoopcigar-78282"}, {"title": "Happy Brownie", "number": "45357", "lottie": "https://ddejfvww7sqtk.cloudfront.net/nft-content-cache/lottie/EQB1ATaKGNYk6T5R2cA18BOF-KB_idaKKigwYI2jtjWuLg8n/4954e52371e4fac9", "bg": "#0D47A1", "key": "happybrownie-45357"}, {"title": "Happy Brownie", "number": "69809", "lottie": "https://ddejfvww7sqtk.cloudfront.net/nft-content-cache/lottie/EQB1ATaKGNYk6T5R2cA18BOF-KB_idaKKigwYI2jtjWuLg8n/fed50f3b0179a40c", "bg": "#2d3436", "key": "happybrownie-69809"}, {"title": "Sleigh Bell", "number": "9000", "lottie": "https://ddejfvww7sqtk.cloudfront.net/nft-content-cache/lottie/EQBcNxMCTyEHkcQ5cK3fO_3Ebjf6JcA5JJ_OJV4npDN-604P/d38b01f0cdd5f1a0", "bg": "#0D47A1", "key": "sleighbell-9000"}, {"title": "Spring Basket", "number": "28558", "lottie": "https://ddejfvww7sqtk.cloudfront.net/nft-content-cache/lottie/EQCZ4-h65iTiWDPRPcLlS63gbcS40YBadEFLA4W-iIWUZld0/401d317a098057bd", "bg": "#2d3436", "key": "springbasket-28558"}, {"title": "Spy Agaric", "number": "40638", "lottie": "https://ddejfvww7sqtk.cloudfront.net/nft-content-cache/lottie/EQD6mH9bwbn6S3M_tCRWOvqAIW8M34kRwbI01niGLRPeDPsl/a2d1bd0b5d3cd8de", "bg": "#0D47A1", "key": "spyagaric-40638"}, {"title": "Mousse Cake", "number": "64759", "lottie": "https://ddejfvww7sqtk.cloudfront.net/nft-content-cache/lottie/EQBjzdi27ZI-Re93OOIia0m7YmUU8d8ubJNsStZTc7qNJnOv/6af1ef00fffee5b7", "bg": "#2d3436", "key": "moussecake-64759"}, {"title": "Jack-in-the-Box", "number": "45942", "lottie": "https://ddejfvww7sqtk.cloudfront.net/nft-content-cache/lottie/EQA401QqpXtBnwIaDbFjwd5yXfP2mYiCusbJ3Zcw9eXR9CqL/09f66e12fa5a01c8", "bg": "#FFD700", "key": "jackinthebox-45942"}, {"title": "Snoop Cigar", "number": "33771", "lottie": "https://ddejfvww7sqtk.cloudfront.net/nft-content-cache/lottie/EQA72Uevr_MHvzYwSCHJUK-uC6kd-w8kbxzhJ49WIiG-o6CD/9efea6911b121d76", "bg": "#2d3436", "key": "snoopcigar-33771"}, {"title": "Money Pot", "number": "31145", "lottie": "https://ddejfvww7sqtk.cloudfront.net/nft-content-cache/lottie/EQBM3U1twWjI_vYUaPdFkzZs1q9c0orHhQjx0m2Xa9ljgTqY/6a2f7a7ebd4f66df", "bg": "#3E2723", "key": "moneypot-31145"}, {"title": "Perfume Bottle", "number": "2666", "lottie": "https://ddejfvww7sqtk.cloudfront.net/nft-content-cache/lottie/EQDJsN9OJBhKGZoWZWtkEpzkCfIu16Z9UzTWbYjeLpuHdT5f/456498284e89b0b2", "bg": "#2d3436", "key": "perfumebottle-2666"}, {"title": "Money Pot", "number": "10356", "lottie": "https://ddejfvww7sqtk.cloudfront.net/nft-content-cache/lottie/EQBM3U1twWjI_vYUaPdFkzZs1q9c0orHhQjx0m2Xa9ljgTqY/9d2f957e2339f5f8", "bg": "#2d3436", "key": "moneypot-10356"}, {"title": "Love Potion", "number": "20018", "lottie": "https://ddejfvww7sqtk.cloudfront.net/nft-content-cache/lottie/EQD7yDu2WCgd9Uzx1dF_DQkWK7IZJJ4Mp9M9g1rGUUiQE43m/17f15f9e3d757ee8", "bg": "#2d3436", "key": "lovepotion-20018"}, {"title": "Trapped Heart", "number": "17339", "lottie": "https://ddejfvww7sqtk.cloudfront.net/nft-content-cache/lottie/EQCyAMkb6bNyNlKPH0tJbubk1VVjASqyq9sZwkJ8AbxMkxxU/6146fb04edf77c1d", "bg": "#2d3436", "key": "trappedheart-17339"}, {"title": "Ice Cream", "number": "288922", "lottie": "https://ddejfvww7sqtk.cloudfront.net/nft-content-cache/lottie/EQBUvskEvmWdp_V6HX-2Tyfp4mFSzMzdg9TaUz6zKVz6Ov3f/babbd19170a4d2e8", "bg": "#1B5E20", "key": "icecream-288922"}, {"title": "Money Pot", "number": "11958", "lottie": "https://ddejfvww7sqtk.cloudfront.net/nft-content-cache/lottie/EQBM3U1twWjI_vYUaPdFkzZs1q9c0orHhQjx0m2Xa9ljgTqY/68cf1d5fe822188e", "bg": "#2d3436", "key": "moneypot-11958"}, {"title": "Low Rider", "number": "22865", "lottie": "https://ddejfvww7sqtk.cloudfront.net/nft-content-cache/lottie/EQDCPq7QSUvCmq7kBhmDulxVdeFHKFc1wT9MQxnesanl1Hql/a6cd14f02c34966b", "bg": "#2d3436", "key": "lowrider-22865"}, {"title": "Money Pot", "number": "4915", "lottie": "https://ddejfvww7sqtk.cloudfront.net/nft-content-cache/lottie/EQBM3U1twWjI_vYUaPdFkzZs1q9c0orHhQjx0m2Xa9ljgTqY/f1f2411b4d39a31a", "bg": "#1B5E20", "key": "moneypot-4915"}, {"title": "Money Pot", "number": "60015", "lottie": "https://ddejfvww7sqtk.cloudfront.net/nft-content-cache/lottie/EQBM3U1twWjI_vYUaPdFkzZs1q9c0orHhQjx0m2Xa9ljgTqY/9d5961f3d79f7f5a", "bg": "#1B5E20", "key": "moneypot-60015"}, {"title": "Mousse Cake", "number": "26110", "lottie": "https://ddejfvww7sqtk.cloudfront.net/nft-content-cache/lottie/EQBjzdi27ZI-Re93OOIia0m7YmUU8d8ubJNsStZTc7qNJnOv/aad09ff28f1786ab", "bg": "#2d3436", "key": "moussecake-26110"}, {"title": "Ice Cream", "number": "254115", "lottie": "https://ddejfvww7sqtk.cloudfront.net/nft-content-cache/lottie/EQBUvskEvmWdp_V6HX-2Tyfp4mFSzMzdg9TaUz6zKVz6Ov3f/eff095b6b5599e30", "bg": "#1B5E20", "key": "icecream-254115"}, {"title": "Cookie Heart", "number": "41591", "lottie": "https://ddejfvww7sqtk.cloudfront.net/nft-content-cache/lottie/EQBT9PbZBR6FGcZBSnwgo-DLpc0r7_X_8dlhG5UA6v9l9uJM/53194740c87fef10", "bg": "#4A148C", "key": "cookieheart-41591"}, {"title": "UFC Strike", "number": "45734", "lottie": "https://ddejfvww7sqtk.cloudfront.net/nft-content-cache/lottie/EQDaj18cd61VLZHCHsM7sKbfxBudD3gaSfcN02olVnQ3BCIB/33e6cd821fc23cbd", "bg": "#1B5E20", "key": "ufcstrike-45734"}, {"title": "Ice Cream", "number": "206529", "lottie": "https://ddejfvww7sqtk.cloudfront.net/nft-content-cache/lottie/EQBUvskEvmWdp_V6HX-2Tyfp4mFSzMzdg9TaUz6zKVz6Ov3f/869b58b4d928b60d", "bg": "#2d3436", "key": "icecream-206529"}, {"title": "Money Pot", "number": "51264", "lottie": "https://ddejfvww7sqtk.cloudfront.net/nft-content-cache/lottie/EQBM3U1twWjI_vYUaPdFkzZs1q9c0orHhQjx0m2Xa9ljgTqY/86f6420311ba0f35", "bg": "#2d3436", "key": "moneypot-51264"}, {"title": "Money Pot", "number": "28912", "lottie": "https://ddejfvww7sqtk.cloudfront.net/nft-content-cache/lottie/EQBM3U1twWjI_vYUaPdFkzZs1q9c0orHhQjx0m2Xa9ljgTqY/1b696dc60b2f62fa", "bg": "#1B5E20", "key": "moneypot-28912"}, {"title": "Ice Cream", "number": "165306", "lottie": "https://ddejfvww7sqtk.cloudfront.net/nft-content-cache/lottie/EQBUvskEvmWdp_V6HX-2Tyfp4mFSzMzdg9TaUz6zKVz6Ov3f/fba85679e8cbcf7d", "bg": "#2d3436", "key": "icecream-165306"}, {"title": "Top Hat", "number": "7529", "lottie": "https://ddejfvww7sqtk.cloudfront.net/nft-content-cache/lottie/EQADvJxMxCHA7fRlYjoceBORf7RwKs0rzjVaKepQACMnZzG7/842e66dd19217cfb", "bg": "#1B5E20", "key": "tophat-7529"}, {"title": "Money Pot", "number": "12644", "lottie": "https://ddejfvww7sqtk.cloudfront.net/nft-content-cache/lottie/EQBM3U1twWjI_vYUaPdFkzZs1q9c0orHhQjx0m2Xa9ljgTqY/3d2969539ddd2683", "bg": "#2d3436", "key": "moneypot-12644"}, {"title": "Snoop Cigar", "number": "15971", "lottie": "https://ddejfvww7sqtk.cloudfront.net/nft-content-cache/lottie/EQA72Uevr_MHvzYwSCHJUK-uC6kd-w8kbxzhJ49WIiG-o6CD/b3ba5266d73989a9", "bg": "#2d3436", "key": "snoopcigar-15971"}, {"title": "Trapped Heart", "number": "15398", "lottie": "https://ddejfvww7sqtk.cloudfront.net/nft-content-cache/lottie/EQCyAMkb6bNyNlKPH0tJbubk1VVjASqyq9sZwkJ8AbxMkxxU/e32fbed6af54a901", "bg": "#2d3436", "key": "trappedheart-15398"}, {"title": "Money Pot", "number": "16868", "lottie": "https://ddejfvww7sqtk.cloudfront.net/nft-content-cache/lottie/EQBM3U1twWjI_vYUaPdFkzZs1q9c0orHhQjx0m2Xa9ljgTqY/1bd4724636b7d1c8", "bg": "#0D47A1", "key": "moneypot-16868"}, {"title": "Input Key", "number": "18643", "lottie": "https://ddejfvww7sqtk.cloudfront.net/nft-content-cache/lottie/EQBSIId7sMmlqN8oBGaMNtUeuaLeSQPUR1ByMwpnfWL3hhZq/41b188c3a4f0e8e7", "bg": "#2d3436", "key": "inputkey-18643"}, {"title": "Money Pot", "number": "20209", "lottie": "https://ddejfvww7sqtk.cloudfront.net/nft-content-cache/lottie/EQBM3U1twWjI_vYUaPdFkzZs1q9c0orHhQjx0m2Xa9ljgTqY/16d6245880cd2f4d", "bg": "#5D4037", "key": "moneypot-20209"}, {"title": "Desk Calendar", "number": "173861", "lottie": "https://ddejfvww7sqtk.cloudfront.net/nft-content-cache/lottie/EQBMcfMAZlMUr1W3X8kdEw3fJMUAaWH4-XcmE5R5RfFIY0E2/b9d3f6050c6c8238", "bg": "#1B5E20", "key": "deskcalendar-173861"}, {"title": "Money Pot", "number": "2296", "lottie": "https://ddejfvww7sqtk.cloudfront.net/nft-content-cache/lottie/EQBM3U1twWjI_vYUaPdFkzZs1q9c0orHhQjx0m2Xa9ljgTqY/8bfe6db2c58e1d73", "bg": "#1B5E20", "key": "moneypot-2296"}, {"title": "Homemade Cake", "number": "159905", "lottie": "https://ddejfvww7sqtk.cloudfront.net/nft-content-cache/lottie/EQCefrjhCD2_7HRIr2lmwt9ZaqeG_tdseBvADC66833kBS3y/62b580ec6ff29cd5", "bg": "#E65100", "key": "homemadecake-159905"}, {"title": "Money Pot", "number": "58832", "lottie": "https://ddejfvww7sqtk.cloudfront.net/nft-content-cache/lottie/EQBM3U1twWjI_vYUaPdFkzZs1q9c0orHhQjx0m2Xa9ljgTqY/997d7818270b92a4", "bg": "#0D47A1", "key": "moneypot-58832"}, {"title": "UFC Strike", "number": "47238", "lottie": "https://ddejfvww7sqtk.cloudfront.net/nft-content-cache/lottie/EQDaj18cd61VLZHCHsM7sKbfxBudD3gaSfcN02olVnQ3BCIB/f19045da5e55432b", "bg": "#1B5E20", "key": "ufcstrike-47238"}, {"title": "Money Pot", "number": "8387", "lottie": "https://ddejfvww7sqtk.cloudfront.net/nft-content-cache/lottie/EQBM3U1twWjI_vYUaPdFkzZs1q9c0orHhQjx0m2Xa9ljgTqY/b7b180b3c844c8b5", "bg": "#B71C1C", "key": "moneypot-8387"}, {"title": "Ice Cream", "number": "230226", "lottie": "https://ddejfvww7sqtk.cloudfront.net/nft-content-cache/lottie/EQBUvskEvmWdp_V6HX-2Tyfp4mFSzMzdg9TaUz6zKVz6Ov3f/18b7714e33b6f3d8", "bg": "#2d3436", "key": "icecream-230226"}, {"title": "Money Pot", "number": "6338", "lottie": "https://ddejfvww7sqtk.cloudfront.net/nft-content-cache/lottie/EQBM3U1twWjI_vYUaPdFkzZs1q9c0orHhQjx0m2Xa9ljgTqY/feabcaf1ef5d9d18", "bg": "#0D47A1", "key": "moneypot-6338"}, {"title": "Spy Agaric", "number": "5126", "lottie": "https://ddejfvww7sqtk.cloudfront.net/nft-content-cache/lottie/EQD6mH9bwbn6S3M_tCRWOvqAIW8M34kRwbI01niGLRPeDPsl/229179c4a9da796e", "bg": "#3E2723", "key": "spyagaric-5126"}, {"title": "Money Pot", "number": "17776", "lottie": "https://ddejfvww7sqtk.cloudfront.net/nft-content-cache/lottie/EQBM3U1twWjI_vYUaPdFkzZs1q9c0orHhQjx0m2Xa9ljgTqY/e0a2207b487a5942", "bg": "#3E2723", "key": "moneypot-17776"}, {"title": "Money Pot", "number": "27904", "lottie": "https://ddejfvww7sqtk.cloudfront.net/nft-content-cache/lottie/EQBM3U1twWjI_vYUaPdFkzZs1q9c0orHhQjx0m2Xa9ljgTqY/13860a8423644dd1", "bg": "#2d3436", "key": "moneypot-27904"}, {"title": "Ice Cream", "number": "243172", "lottie": "https://ddejfvww7sqtk.cloudfront.net/nft-content-cache/lottie/EQBUvskEvmWdp_V6HX-2Tyfp4mFSzMzdg9TaUz6zKVz6Ov3f/4cc76b074d450678", "bg": "#2d3436", "key": "icecream-243172"}, {"title": "Diamond Ring", "number": "13270", "lottie": "https://ddejfvww7sqtk.cloudfront.net/nft-content-cache/lottie/EQCWh1lPltyTwCWxCXm4umL5tPZoXR8kTIcT-pd0JqoadLHo/b4fee65a835f4659", "bg": "#2d3436", "key": "diamondring-13270"}, {"title": "Money Pot", "number": "14595", "lottie": "https://ddejfvww7sqtk.cloudfront.net/nft-content-cache/lottie/EQBM3U1twWjI_vYUaPdFkzZs1q9c0orHhQjx0m2Xa9ljgTqY/e80812e81f06c035", "bg": "#2d3436", "key": "moneypot-14595"}, {"title": "Ice Cream", "number": "100198", "lottie": "https://ddejfvww7sqtk.cloudfront.net/nft-content-cache/lottie/EQBUvskEvmWdp_V6HX-2Tyfp4mFSzMzdg9TaUz6zKVz6Ov3f/2821cdf730f0d323", "bg": "#1B5E20", "key": "icecream-100198"}, {"title": "Ice Cream", "number": "25190", "lottie": "https://ddejfvww7sqtk.cloudfront.net/nft-content-cache/lottie/EQBUvskEvmWdp_V6HX-2Tyfp4mFSzMzdg9TaUz6zKVz6Ov3f/fa4967c6d733a57f", "bg": "#2d3436", "key": "icecream-25190"}, {"title": "Love Potion", "number": "11585", "lottie": "https://ddejfvww7sqtk.cloudfront.net/nft-content-cache/lottie/EQD7yDu2WCgd9Uzx1dF_DQkWK7IZJJ4Mp9M9g1rGUUiQE43m/8638e169d284ab6c", "bg": "#2d3436", "key": "lovepotion-11585"}, {"title": "Money Pot", "number": "15218", "lottie": "https://ddejfvww7sqtk.cloudfront.net/nft-content-cache/lottie/EQBM3U1twWjI_vYUaPdFkzZs1q9c0orHhQjx0m2Xa9ljgTqY/944d80d1b2bcac20", "bg": "#2d3436", "key": "moneypot-15218"}, {"title": "Ionic Dryer", "number": "4766", "lottie": "https://ddejfvww7sqtk.cloudfront.net/nft-content-cache/lottie/EQCEVLBbgzL5Ih9bzMkneLi68xzOelYN3NEugm_4gZTpuAFP/079740bed9b9810c", "bg": "#2d3436", "key": "ionicdryer-4766"}, {"title": "UFC Strike", "number": "47231", "lottie": "https://ddejfvww7sqtk.cloudfront.net/nft-content-cache/lottie/EQDaj18cd61VLZHCHsM7sKbfxBudD3gaSfcN02olVnQ3BCIB/0c0f34d3ce8ad64c", "bg": "#2d3436", "key": "ufcstrike-47231"}, {"title": "Spy Agaric", "number": "74323", "lottie": "https://ddejfvww7sqtk.cloudfront.net/nft-content-cache/lottie/EQD6mH9bwbn6S3M_tCRWOvqAIW8M34kRwbI01niGLRPeDPsl/c4f7309226f2d79b", "bg": "#2d3436", "key": "spyagaric-74323"}, {"title": "Homemade Cake", "number": "162124", "lottie": "https://ddejfvww7sqtk.cloudfront.net/nft-content-cache/lottie/EQCefrjhCD2_7HRIr2lmwt9ZaqeG_tdseBvADC66833kBS3y/ef2d65151ec4fe2d", "bg": "#1B5E20", "key": "homemadecake-162124"}, {"title": "Money Pot", "number": "39174", "lottie": "https://ddejfvww7sqtk.cloudfront.net/nft-content-cache/lottie/EQBM3U1twWjI_vYUaPdFkzZs1q9c0orHhQjx0m2Xa9ljgTqY/7fe552b42e84aa9d", "bg": "#2d3436", "key": "moneypot-39174"}, {"title": "Money Pot", "number": "7413", "lottie": "https://ddejfvww7sqtk.cloudfront.net/nft-content-cache/lottie/EQBM3U1twWjI_vYUaPdFkzZs1q9c0orHhQjx0m2Xa9ljgTqY/ff1bd1917d1a3bf6", "bg": "#2d3436", "key": "moneypot-7413"}, {"title": "Desk Calendar", "number": "141728", "lottie": "https://ddejfvww7sqtk.cloudfront.net/nft-content-cache/lottie/EQBMcfMAZlMUr1W3X8kdEw3fJMUAaWH4-XcmE5R5RfFIY0E2/615c4784e418f2fc", "bg": "#2d3436", "key": "deskcalendar-141728"}, {"title": "Money Pot", "number": "24497", "lottie": "https://ddejfvww7sqtk.cloudfront.net/nft-content-cache/lottie/EQBM3U1twWjI_vYUaPdFkzZs1q9c0orHhQjx0m2Xa9ljgTqY/f71fc4a36dd917f0", "bg": "#636E72", "key": "moneypot-24497"}, {"title": "Money Pot", "number": "59329", "lottie": "https://ddejfvww7sqtk.cloudfront.net/nft-content-cache/lottie/EQBM3U1twWjI_vYUaPdFkzZs1q9c0orHhQjx0m2Xa9ljgTqY/913cdf344197fa3e", "bg": "#E65100", "key": "moneypot-59329"}, {"title": "Tama Gadget", "number": "44464", "lottie": "https://ddejfvww7sqtk.cloudfront.net/nft-content-cache/lottie/EQA_kx2WOydXWzYUYO1DP80aHl4yhlLGYhxjPAtRPNjMgfYM/0f1a258094ad64c3", "bg": "#2d3436", "key": "tamagadget-44464"}, {"title": "Desk Calendar", "number": "315440", "lottie": "https://ddejfvww7sqtk.cloudfront.net/nft-content-cache/lottie/EQBMcfMAZlMUr1W3X8kdEw3fJMUAaWH4-XcmE5R5RfFIY0E2/45b0be54a9d1887a", "bg": "#1B5E20", "key": "deskcalendar-315440"}, {"title": "Money Pot", "number": "55460", "lottie": "https://ddejfvww7sqtk.cloudfront.net/nft-content-cache/lottie/EQBM3U1twWjI_vYUaPdFkzZs1q9c0orHhQjx0m2Xa9ljgTqY/0f8d95241c2e24ef", "bg": "#1B5E20", "key": "moneypot-55460"}, {"title": "Bunny Muffin", "number": "19570", "lottie": "https://ddejfvww7sqtk.cloudfront.net/nft-content-cache/lottie/EQA3-i1IUFjWyDhaIoCGdYUB4nt2IYaT3T-95CHPrSvV3AfX/cf2feaca0c08096f", "bg": "#2d3436", "key": "bunnymuffin-19570"}, {"title": "Money Pot", "number": "46309", "lottie": "https://ddejfvww7sqtk.cloudfront.net/nft-content-cache/lottie/EQBM3U1twWjI_vYUaPdFkzZs1q9c0orHhQjx0m2Xa9ljgTqY/d3a6b48862e0ca64", "bg": "#2d3436", "key": "moneypot-46309"}, {"title": "Ice Cream", "number": "125331", "lottie": "https://ddejfvww7sqtk.cloudfront.net/nft-content-cache/lottie/EQBUvskEvmWdp_V6HX-2Tyfp4mFSzMzdg9TaUz6zKVz6Ov3f/53ccae37706a8f77", "bg": "#2d3436", "key": "icecream-125331"}, {"title": "Ice Cream", "number": "175801", "lottie": "https://ddejfvww7sqtk.cloudfront.net/nft-content-cache/lottie/EQBUvskEvmWdp_V6HX-2Tyfp4mFSzMzdg9TaUz6zKVz6Ov3f/12d052a2543390c0", "bg": "#2d3436", "key": "icecream-175801"}, {"title": "Homemade Cake", "number": "162109", "lottie": "https://ddejfvww7sqtk.cloudfront.net/nft-content-cache/lottie/EQCefrjhCD2_7HRIr2lmwt9ZaqeG_tdseBvADC66833kBS3y/d988fe17aee20dbf", "bg": "#1B5E20", "key": "homemadecake-162109"}, {"title": "Money Pot", "number": "2476", "lottie": "https://ddejfvww7sqtk.cloudfront.net/nft-content-cache/lottie/EQBM3U1twWjI_vYUaPdFkzZs1q9c0orHhQjx0m2Xa9ljgTqY/d1ff9ed9005b5c53", "bg": "#2d3436", "key": "moneypot-2476"}, {"title": "Jack-in-the-Box", "number": "77608", "lottie": "https://ddejfvww7sqtk.cloudfront.net/nft-content-cache/lottie/EQA401QqpXtBnwIaDbFjwd5yXfP2mYiCusbJ3Zcw9eXR9CqL/600d8e0c3305ec21", "bg": "#2d3436", "key": "jackinthebox-77608"}, {"title": "Ice Cream", "number": "156102", "lottie": "https://ddejfvww7sqtk.cloudfront.net/nft-content-cache/lottie/EQBUvskEvmWdp_V6HX-2Tyfp4mFSzMzdg9TaUz6zKVz6Ov3f/955b6f2c529dff9b", "bg": "#B71C1C", "key": "icecream-156102"}, {"title": "Money Pot", "number": "10684", "lottie": "https://ddejfvww7sqtk.cloudfront.net/nft-content-cache/lottie/EQBM3U1twWjI_vYUaPdFkzZs1q9c0orHhQjx0m2Xa9ljgTqY/9a6fcded476474ec", "bg": "#2d3436", "key": "moneypot-10684"}, {"title": "Snoop Cigar", "number": "61737", "lottie": "https://ddejfvww7sqtk.cloudfront.net/nft-content-cache/lottie/EQA72Uevr_MHvzYwSCHJUK-uC6kd-w8kbxzhJ49WIiG-o6CD/79fd29239888a60a", "bg": "#2d3436", "key": "snoopcigar-61737"}, {"title": "Ice Cream", "number": "116318", "lottie": "https://ddejfvww7sqtk.cloudfront.net/nft-content-cache/lottie/EQBUvskEvmWdp_V6HX-2Tyfp4mFSzMzdg9TaUz6zKVz6Ov3f/22d0db1c3012d027", "bg": "#2d3436", "key": "icecream-116318"}, {"title": "Mousse Cake", "number": "57447", "lottie": "https://ddejfvww7sqtk.cloudfront.net/nft-content-cache/lottie/EQBjzdi27ZI-Re93OOIia0m7YmUU8d8ubJNsStZTc7qNJnOv/310dc1a68d0ea871", "bg": "#1B5E20", "key": "moussecake-57447"}, {"title": "Jack-in-the-Box", "number": "8038", "lottie": "https://ddejfvww7sqtk.cloudfront.net/nft-content-cache/lottie/EQA401QqpXtBnwIaDbFjwd5yXfP2mYiCusbJ3Zcw9eXR9CqL/41b376caf9343f8d", "bg": "#2d3436", "key": "jackinthebox-8038"}, {"title": "Jack-in-the-Box", "number": "43576", "lottie": "https://ddejfvww7sqtk.cloudfront.net/nft-content-cache/lottie/EQA401QqpXtBnwIaDbFjwd5yXfP2mYiCusbJ3Zcw9eXR9CqL/090510220c590640", "bg": "#2d3436", "key": "jackinthebox-43576"}, {"title": "Ice Cream", "number": "11393", "lottie": "https://ddejfvww7sqtk.cloudfront.net/nft-content-cache/lottie/EQBUvskEvmWdp_V6HX-2Tyfp4mFSzMzdg9TaUz6zKVz6Ov3f/90da8ce92f59fa64", "bg": "#0D47A1", "key": "icecream-11393"}, {"title": "Snoop Cigar", "number": "110954", "lottie": "https://ddejfvww7sqtk.cloudfront.net/nft-content-cache/lottie/EQA72Uevr_MHvzYwSCHJUK-uC6kd-w8kbxzhJ49WIiG-o6CD/1c309332848ef34a", "bg": "#0D47A1", "key": "snoopcigar-110954"}, {"title": "Snoop Cigar", "number": "95753", "lottie": "https://ddejfvww7sqtk.cloudfront.net/nft-content-cache/lottie/EQA72Uevr_MHvzYwSCHJUK-uC6kd-w8kbxzhJ49WIiG-o6CD/d823c21734d91c3e", "bg": "#0D47A1", "key": "snoopcigar-95753"}, {"title": "Jolly Chimp", "number": "27289", "lottie": "https://ddejfvww7sqtk.cloudfront.net/nft-content-cache/lottie/EQCeTSJOPXP_SSvOjILY-kui4bGHUmsa-U7TXP4DjUANTl4s/be41491b0ba88313", "bg": "#0D47A1", "key": "jollychimp-27289"}, {"title": "Ice Cream", "number": "93308", "lottie": "https://ddejfvww7sqtk.cloudfront.net/nft-content-cache/lottie/EQBUvskEvmWdp_V6HX-2Tyfp4mFSzMzdg9TaUz6zKVz6Ov3f/9d0fbe824023b020", "bg": "#1B5E20", "key": "icecream-93308"}, {"title": "Ice Cream", "number": "206809", "lottie": "https://ddejfvww7sqtk.cloudfront.net/nft-content-cache/lottie/EQBUvskEvmWdp_V6HX-2Tyfp4mFSzMzdg9TaUz6zKVz6Ov3f/1d8d582d84cc2b0a", "bg": "#2d3436", "key": "icecream-206809"}, {"title": "Ion Gem", "number": "3781", "lottie": "https://ddejfvww7sqtk.cloudfront.net/nft-content-cache/lottie/EQDL7HMbca0FufrjHFcRoiLkEiOXkXoO_vH2gVUN8JNp4khK/edc20bbf6f53c4ab", "bg": "#2d3436", "key": "iongem-3781"}, {"title": "Mousse Cake", "number": "117650", "lottie": "https://ddejfvww7sqtk.cloudfront.net/nft-content-cache/lottie/EQBjzdi27ZI-Re93OOIia0m7YmUU8d8ubJNsStZTc7qNJnOv/53698a6651a2f1a1", "bg": "#2d3436", "key": "moussecake-117650"}, {"title": "Berry Box", "number": "1569", "lottie": "https://ddejfvww7sqtk.cloudfront.net/nft-content-cache/lottie/EQB4x3sT1DVdODzay3H-4VJIdOooS5-kTgyKcYMZWogPOsiq/f64cb1a58102a3e8_194a95c968f", "bg": "#1B5E20", "key": "berrybox-1569"}, {"title": "Spy Agaric", "number": "30240", "lottie": "https://ddejfvww7sqtk.cloudfront.net/nft-content-cache/lottie/EQD6mH9bwbn6S3M_tCRWOvqAIW8M34kRwbI01niGLRPeDPsl/aa8a2693b205d337", "bg": "#2d3436", "key": "spyagaric-30240"}, {"title": "Evil Eye", "number": "1673", "lottie": "https://ddejfvww7sqtk.cloudfront.net/nft-content-cache/lottie/EQDQ6DjRabTYSAxf2xrZsnsXtqcIm1bj9dF5x_h8lNjWPmH4/048556eb5b99cf64", "bg": "#0D47A1", "key": "evileye-1673"}, {"title": "Spy Agaric", "number": "28151", "lottie": "https://ddejfvww7sqtk.cloudfront.net/nft-content-cache/lottie/EQD6mH9bwbn6S3M_tCRWOvqAIW8M34kRwbI01niGLRPeDPsl/da712b7d635ebd27", "bg": "#2d3436", "key": "spyagaric-28151"}, {"title": "Jelly Bunny", "number": "3863", "lottie": "https://ddejfvww7sqtk.cloudfront.net/nft-content-cache/lottie/EQAwzubeoJwnqmmBuTPpnUSurRzWPB8ERzcfzx55Z2YjE0jx/e2be10750f5aac8e", "bg": "#2d3436", "key": "jellybunny-3863"}, {"title": "Trapped Heart", "number": "930", "lottie": "https://ddejfvww7sqtk.cloudfront.net/nft-content-cache/lottie/EQCyAMkb6bNyNlKPH0tJbubk1VVjASqyq9sZwkJ8AbxMkxxU/83352bc0d7db1a88", "bg": "#B71C1C", "key": "trappedheart-930"}, {"title": "Spiced Wine", "number": "2578", "lottie": "https://ddejfvww7sqtk.cloudfront.net/nft-content-cache/lottie/EQA8DCWyCWyywgOKYORerRoSVevWrUQ_FjKQgNihxY1227x7/803fff492540dce4", "bg": "#2d3436", "key": "spicedwine-2578"}, {"title": "Evil Eye", "number": "7279", "lottie": "https://ddejfvww7sqtk.cloudfront.net/nft-content-cache/lottie/EQDQ6DjRabTYSAxf2xrZsnsXtqcIm1bj9dF5x_h8lNjWPmH4/7a722335cdf30ec9", "bg": "#0D47A1", "key": "evileye-7279"}, {"title": "Trapped Heart", "number": "6061", "lottie": "https://ddejfvww7sqtk.cloudfront.net/nft-content-cache/lottie/EQCyAMkb6bNyNlKPH0tJbubk1VVjASqyq9sZwkJ8AbxMkxxU/824bcd5b3acc36c8", "bg": "#B71C1C", "key": "trappedheart-6061"}, {"title": "Plush Pepe", "number": "1383", "lottie": "https://ddejfvww7sqtk.cloudfront.net/nft-content-cache/lottie/EQBG-g6ahkAUGWpefWbx-D_9sQ8oWbvy6puuq78U2c4NUDFS/67bad7d731e95fc1_194a96d3b5c", "bg": "#0D47A1", "key": "plushpepe-1383"}, {"title": "Evil Eye", "number": "17704", "lottie": "https://ddejfvww7sqtk.cloudfront.net/nft-content-cache/lottie/EQDQ6DjRabTYSAxf2xrZsnsXtqcIm1bj9dF5x_h8lNjWPmH4/a3359aa6d78d6465", "bg": "#2d3436", "key": "evileye-17704"}, {"title": "Signet Ring", "number": "5648", "lottie": "https://ddejfvww7sqtk.cloudfront.net/nft-content-cache/lottie/EQCrGA9slCoksgD-NyRDjtHySKN0Ts8k6hdueJkUkZZdD4_K/d850bf7e4c44adc8_194a97978c6", "bg": "#2d3436", "key": "signetring-5648"}, {"title": "Trapped Heart", "number": "2196", "lottie": "https://ddejfvww7sqtk.cloudfront.net/nft-content-cache/lottie/EQCyAMkb6bNyNlKPH0tJbubk1VVjASqyq9sZwkJ8AbxMkxxU/5832de69c72b59fb", "bg": "#FFD700", "key": "trappedheart-2196"}, {"title": "Trapped Heart", "number": "865", "lottie": "https://ddejfvww7sqtk.cloudfront.net/nft-content-cache/lottie/EQCyAMkb6bNyNlKPH0tJbubk1VVjASqyq9sZwkJ8AbxMkxxU/05d4c9a048ec47e7", "bg": "#2d3436", "key": "trappedheart-865"}, {"title": "Spy Agaric", "number": "28154", "lottie": "https://ddejfvww7sqtk.cloudfront.net/nft-content-cache/lottie/EQD6mH9bwbn6S3M_tCRWOvqAIW8M34kRwbI01niGLRPeDPsl/819e197d10688501", "bg": "#2d3436", "key": "spyagaric-28154"}, {"title": "Jelly Bunny", "number": "6219", "lottie": "https://ddejfvww7sqtk.cloudfront.net/nft-content-cache/lottie/EQAwzubeoJwnqmmBuTPpnUSurRzWPB8ERzcfzx55Z2YjE0jx/dbcdb8492ababc2a", "bg": "#0D47A1", "key": "jellybunny-6219"}, {"title": "Spiced Wine", "number": "2603", "lottie": "https://ddejfvww7sqtk.cloudfront.net/nft-content-cache/lottie/EQA8DCWyCWyywgOKYORerRoSVevWrUQ_FjKQgNihxY1227x7/28151226df0527f8", "bg": "#2d3436", "key": "spicedwine-2603"}, {"title": "Durov’s Cap", "number": "498", "lottie": "https://ddejfvww7sqtk.cloudfront.net/nft-content-cache/lottie/EQD9ikZq6xPgKjzmdBG0G0S80RvUJjbwgHrPZXDKc_wsE84w/5d06979263abe075", "bg": "#2d3436", "key": "durovscap-498"}, {"title": "Spy Agaric", "number": "24800", "lottie": "https://ddejfvww7sqtk.cloudfront.net/nft-content-cache/lottie/EQD6mH9bwbn6S3M_tCRWOvqAIW8M34kRwbI01niGLRPeDPsl/d9f0872a2712e585", "bg": "#2d3436", "key": "spyagaric-24800"}, {"title": "Spy Agaric", "number": "29492", "lottie": "https://ddejfvww7sqtk.cloudfront.net/nft-content-cache/lottie/EQD6mH9bwbn6S3M_tCRWOvqAIW8M34kRwbI01niGLRPeDPsl/95bde96f08e6f87f", "bg": "#2d3436", "key": "spyagaric-29492"}, {"title": "Jelly Bunny", "number": "1741", "lottie": "https://ddejfvww7sqtk.cloudfront.net/nft-content-cache/lottie/EQAwzubeoJwnqmmBuTPpnUSurRzWPB8ERzcfzx55Z2YjE0jx/98d0bb482ec2b49b", "bg": "#2d3436", "key": "jellybunny-1741"}, {"title": "Durov’s Cap", "number": "2662", "lottie": "https://ddejfvww7sqtk.cloudfront.net/nft-content-cache/lottie/EQD9ikZq6xPgKjzmdBG0G0S80RvUJjbwgHrPZXDKc_wsE84w/6201f114693a9936", "bg": "#0D47A1", "key": "durovscap-2662"}, {"title": "Skull Flower", "number": "125", "lottie": "https://ddejfvww7sqtk.cloudfront.net/nft-content-cache/lottie/EQBaOL8mH5YywkXjkps65X1OLPNH7pns4YcfLmaVpFaoNKZn/a6879883b5723409_194a9693ee1", "bg": "#0D47A1", "key": "skullflower-125"}, {"title": "Evil Eye", "number": "17337", "lottie": "https://ddejfvww7sqtk.cloudfront.net/nft-content-cache/lottie/EQDQ6DjRabTYSAxf2xrZsnsXtqcIm1bj9dF5x_h8lNjWPmH4/a3c79464076a0582", "bg": "#2d3436", "key": "evileye-17337"}, {"title": "Vintage Cigar", "number": "2964", "lottie": "https://ddejfvww7sqtk.cloudfront.net/nft-content-cache/lottie/EQACcQpR2fmdeENWdE2YGQWHVxSTyA8Zq4_k7rk_IaxCRXNe/c8f476a6e2695621", "bg": "#E65100", "key": "vintagecigar-2964"}, {"title": "Trapped Heart", "number": "3905", "lottie": "https://ddejfvww7sqtk.cloudfront.net/nft-content-cache/lottie/EQCyAMkb6bNyNlKPH0tJbubk1VVjASqyq9sZwkJ8AbxMkxxU/f7e6dbb21d2a96a3", "bg": "#2d3436", "key": "trappedheart-3905"}, {"title": "Sharp Tongue", "number": "1521", "lottie": "https://ddejfvww7sqtk.cloudfront.net/nft-content-cache/lottie/EQBw2tO5UaJ4c_YXt3I8y5KD0k37staZxedV2O5HmryiK0dN/9c2462b539789797_194a970c6c0", "bg": "#2d3436", "key": "sharptongue-1521"}, {"title": "Santa Hat", "number": "2059", "lottie": "https://ddejfvww7sqtk.cloudfront.net/nft-content-cache/lottie/EQAaTIR7oJyowDiumYLVN0oe61kGE3I6EPEn7WgHPGuWAeCy/517bf849dc9fac1b", "bg": "#2d3436", "key": "santahat-2059"}, {"title": "Signet Ring", "number": "5638", "lottie": "https://ddejfvww7sqtk.cloudfront.net/nft-content-cache/lottie/EQCrGA9slCoksgD-NyRDjtHySKN0Ts8k6hdueJkUkZZdD4_K/0824aca6839cea7e", "bg": "#2d3436", "key": "signetring-5638"}, {"title": "Spy Agaric", "number": "7618", "lottie": "https://ddejfvww7sqtk.cloudfront.net/nft-content-cache/lottie/EQD6mH9bwbn6S3M_tCRWOvqAIW8M34kRwbI01niGLRPeDPsl/a91bf3c199f555c0", "bg": "#2d3436", "key": "spyagaric-7618"}, {"title": "Spy Agaric", "number": "13024", "lottie": "https://ddejfvww7sqtk.cloudfront.net/nft-content-cache/lottie/EQD6mH9bwbn6S3M_tCRWOvqAIW8M34kRwbI01niGLRPeDPsl/dfb8ea468259f2ca", "bg": "#2d3436", "key": "spyagaric-13024"}, {"title": "Spy Agaric", "number": "1028", "lottie": "https://ddejfvww7sqtk.cloudfront.net/nft-content-cache/lottie/EQD6mH9bwbn6S3M_tCRWOvqAIW8M34kRwbI01niGLRPeDPsl/b9fabd0a9e3d738c", "bg": "#2d3436", "key": "spyagaric-1028"}, {"title": "Kissed Frog", "number": "478", "lottie": "https://ddejfvww7sqtk.cloudfront.net/nft-content-cache/lottie/EQDTro-ogJbS7o-OBD6bt2NysPt7SnGm5zfuRXGB1nE_rbGa/2edec879d4a6877d", "bg": "#1B5E20", "key": "kissedfrog-478"}, {"title": "Durov’s Cap", "number": "2525", "lottie": "https://ddejfvww7sqtk.cloudfront.net/nft-content-cache/lottie/EQD9ikZq6xPgKjzmdBG0G0S80RvUJjbwgHrPZXDKc_wsE84w/4dcca2646c9e0d90", "bg": "#2d3436", "key": "durovscap-2525"}, {"title": "Santa Hat", "number": "2986", "lottie": "https://ddejfvww7sqtk.cloudfront.net/nft-content-cache/lottie/EQAaTIR7oJyowDiumYLVN0oe61kGE3I6EPEn7WgHPGuWAeCy/c3046f8e04a069e9", "bg": "#2d3436", "key": "santahat-2986"}, {"title": "Trapped Heart", "number": "4220", "lottie": "https://ddejfvww7sqtk.cloudfront.net/nft-content-cache/lottie/EQCyAMkb6bNyNlKPH0tJbubk1VVjASqyq9sZwkJ8AbxMkxxU/6a5d96e4f8a06892", "bg": "#2d3436", "key": "trappedheart-4220"}, {"title": "Sharp Tongue", "number": "706", "lottie": "https://ddejfvww7sqtk.cloudfront.net/nft-content-cache/lottie/EQBw2tO5UaJ4c_YXt3I8y5KD0k37staZxedV2O5HmryiK0dN/a3e4a162b90c5d71_194a97080e0", "bg": "#0D47A1", "key": "sharptongue-706"}, {"title": "Skull Flower", "number": "666", "lottie": "https://ddejfvww7sqtk.cloudfront.net/nft-content-cache/lottie/EQBaOL8mH5YywkXjkps65X1OLPNH7pns4YcfLmaVpFaoNKZn/cbac8b4542e2b94a_194a96778a0", "bg": "#0D47A1", "key": "skullflower-666"}, {"title": "Signet Ring", "number": "741", "lottie": "https://ddejfvww7sqtk.cloudfront.net/nft-content-cache/lottie/EQCrGA9slCoksgD-NyRDjtHySKN0Ts8k6hdueJkUkZZdD4_K/6798f52982088c98", "bg": "#636E72", "key": "signetring-741"}, {"title": "Evil Eye", "number": "2540", "lottie": "https://ddejfvww7sqtk.cloudfront.net/nft-content-cache/lottie/EQDQ6DjRabTYSAxf2xrZsnsXtqcIm1bj9dF5x_h8lNjWPmH4/780114a7b6fef7a0", "bg": "#2d3436", "key": "evileye-2540"}, {"title": "Spiced Wine", "number": "6396", "lottie": "https://ddejfvww7sqtk.cloudfront.net/nft-content-cache/lottie/EQA8DCWyCWyywgOKYORerRoSVevWrUQ_FjKQgNihxY1227x7/bbc1355274f2ba68", "bg": "#0D47A1", "key": "spicedwine-6396"}, {"title": "Spy Agaric", "number": "5226", "lottie": "https://ddejfvww7sqtk.cloudfront.net/nft-content-cache/lottie/EQD6mH9bwbn6S3M_tCRWOvqAIW8M34kRwbI01niGLRPeDPsl/8fbb7e31aadb0a83", "bg": "#212121", "key": "spyagaric-5226"}, {"title": "Hex Pot", "number": "10396", "lottie": "https://ddejfvww7sqtk.cloudfront.net/nft-content-cache/lottie/EQB6AtBPOuTtQml8oSA7X8ZqJ5QmcOYYqoz92sQYXGUQrxyB/b58ac00ea60d6aa2_194a9648fac", "bg": "#1B5E20", "key": "hexpot-10396"}, {"title": "Spy Agaric", "number": "13057", "lottie": "https://ddejfvww7sqtk.cloudfront.net/nft-content-cache/lottie/EQD6mH9bwbn6S3M_tCRWOvqAIW8M34kRwbI01niGLRPeDPsl/1a9f82d8f0fb9586", "bg": "#1B5E20", "key": "spyagaric-13057"}, {"title": "Evil Eye", "number": "5270", "lottie": "https://ddejfvww7sqtk.cloudfront.net/nft-content-cache/lottie/EQDQ6DjRabTYSAxf2xrZsnsXtqcIm1bj9dF5x_h8lNjWPmH4/c7fdd0e28c750429", "bg": "#2d3436", "key": "evileye-5270"}, {"title": "Spy Agaric", "number": "12716", "lottie": "https://ddejfvww7sqtk.cloudfront.net/nft-content-cache/lottie/EQD6mH9bwbn6S3M_tCRWOvqAIW8M34kRwbI01niGLRPeDPsl/ff0dcc4c088c8bc6", "bg": "#2d3436", "key": "spyagaric-12716"}, {"title": "Trapped Heart", "number": "5927", "lottie": "https://ddejfvww7sqtk.cloudfront.net/nft-content-cache/lottie/EQCyAMkb6bNyNlKPH0tJbubk1VVjASqyq9sZwkJ8AbxMkxxU/d51b8173e553c32f", "bg": "#B71C1C", "key": "trappedheart-5927"}, {"title": "Spy Agaric", "number": "30238", "lottie": "https://ddejfvww7sqtk.cloudfront.net/nft-content-cache/lottie/EQD6mH9bwbn6S3M_tCRWOvqAIW8M34kRwbI01niGLRPeDPsl/cf8cbff45d5aa48d", "bg": "#1B5E20", "key": "spyagaric-30238"}, {"title": "Skull Flower", "number": "686", "lottie": "https://ddejfvww7sqtk.cloudfront.net/nft-content-cache/lottie/EQBaOL8mH5YywkXjkps65X1OLPNH7pns4YcfLmaVpFaoNKZn/e1ca3ffca39c0412_194a96a1c76", "bg": "#1B5E20", "key": "skullflower-686"}, {"title": "Hex Pot", "number": "14345", "lottie": "https://ddejfvww7sqtk.cloudfront.net/nft-content-cache/lottie/EQB6AtBPOuTtQml8oSA7X8ZqJ5QmcOYYqoz92sQYXGUQrxyB/4a1fd5367e304c3a_194a960ac4f", "bg": "#2d3436", "key": "hexpot-14345"}, {"title": "Spy Agaric", "number": "1040", "lottie": "https://ddejfvww7sqtk.cloudfront.net/nft-content-cache/lottie/EQD6mH9bwbn6S3M_tCRWOvqAIW8M34kRwbI01niGLRPeDPsl/292f2e184d73f001", "bg": "#2d3436", "key": "spyagaric-1040"}, {"title": "Hex Pot", "number": "1731", "lottie": "https://ddejfvww7sqtk.cloudfront.net/nft-content-cache/lottie/EQB6AtBPOuTtQml8oSA7X8ZqJ5QmcOYYqoz92sQYXGUQrxyB/e3a12f1377fa6869_194a95f8c75", "bg": "#2d3436", "key": "hexpot-1731"}, {"title": "Spy Agaric", "number": "265", "lottie": "https://ddejfvww7sqtk.cloudfront.net/nft-content-cache/lottie/EQD6mH9bwbn6S3M_tCRWOvqAIW8M34kRwbI01niGLRPeDPsl/be7d58fb19cf5892", "bg": "#636E72", "key": "spyagaric-265"}, {"title": "Spiced Wine", "number": "2617", "lottie": "https://ddejfvww7sqtk.cloudfront.net/nft-content-cache/lottie/EQA8DCWyCWyywgOKYORerRoSVevWrUQ_FjKQgNihxY1227x7/a20a76eb2213b5bc", "bg": "#2d3436", "key": "spicedwine-2617"}, {"title": "Spy Agaric", "number": "12722", "lottie": "https://ddejfvww7sqtk.cloudfront.net/nft-content-cache/lottie/EQD6mH9bwbn6S3M_tCRWOvqAIW8M34kRwbI01niGLRPeDPsl/6138b4ba9ea8fcbf", "bg": "#0D47A1", "key": "spyagaric-12722"}, {"title": "Homemade Cake", "number": "2672", "lottie": "https://ddejfvww7sqtk.cloudfront.net/nft-content-cache/lottie/EQCefrjhCD2_7HRIr2lmwt9ZaqeG_tdseBvADC66833kBS3y/42d370667f05e48c_194a9772ebe", "bg": "#FFD700", "key": "homemadecake-2672"}, {"title": "Vintage Cigar", "number": "2673", "lottie": "https://ddejfvww7sqtk.cloudfront.net/nft-content-cache/lottie/EQACcQpR2fmdeENWdE2YGQWHVxSTyA8Zq4_k7rk_IaxCRXNe/6665e208a0103cd0_194a9127dc3", "bg": "#2d3436", "key": "vintagecigar-2673"}, {"title": "Skull Flower", "number": "1738", "lottie": "https://ddejfvww7sqtk.cloudfront.net/nft-content-cache/lottie/EQBaOL8mH5YywkXjkps65X1OLPNH7pns4YcfLmaVpFaoNKZn/4252ee4cea83b015_194a96606c3", "bg": "#4A148C", "key": "skullflower-1738"}, {"title": "Hex Pot", "number": "3596", "lottie": "https://ddejfvww7sqtk.cloudfront.net/nft-content-cache/lottie/EQB6AtBPOuTtQml8oSA7X8ZqJ5QmcOYYqoz92sQYXGUQrxyB/45dc2402cacf80af_194a9639fe7", "bg": "#2d3436", "key": "hexpot-3596"}, {"title": "Spiced Wine", "number": "1746", "lottie": "https://ddejfvww7sqtk.cloudfront.net/nft-content-cache/lottie/EQA8DCWyCWyywgOKYORerRoSVevWrUQ_FjKQgNihxY1227x7/29ea1a559befb197", "bg": "#2d3436", "key": "spicedwine-1746"}, {"title": "Skull Flower", "number": "5808", "lottie": "https://ddejfvww7sqtk.cloudfront.net/nft-content-cache/lottie/EQBaOL8mH5YywkXjkps65X1OLPNH7pns4YcfLmaVpFaoNKZn/909c517df2b857f4_194a96b9ee8", "bg": "#2d3436", "key": "skullflower-5808"}, {"title": "Perfume Bottle", "number": "1810", "lottie": "https://ddejfvww7sqtk.cloudfront.net/nft-content-cache/lottie/EQDJsN9OJBhKGZoWZWtkEpzkCfIu16Z9UzTWbYjeLpuHdT5f/7caad1991e270570", "bg": "#2d3436", "key": "perfumebottle-1810"}, {"title": "Jelly Bunny", "number": "2521", "lottie": "https://ddejfvww7sqtk.cloudfront.net/nft-content-cache/lottie/EQAwzubeoJwnqmmBuTPpnUSurRzWPB8ERzcfzx55Z2YjE0jx/cd99a71e188d0d91", "bg": "#FFD700", "key": "jellybunny-2521"}, {"title": "Spy Agaric", "number": "24856", "lottie": "https://ddejfvww7sqtk.cloudfront.net/nft-content-cache/lottie/EQD6mH9bwbn6S3M_tCRWOvqAIW8M34kRwbI01niGLRPeDPsl/3f1e3a175af957d3", "bg": "#FFD700", "key": "spyagaric-24856"}, {"title": "Spy Agaric", "number": "30241", "lottie": "https://ddejfvww7sqtk.cloudfront.net/nft-content-cache/lottie/EQD6mH9bwbn6S3M_tCRWOvqAIW8M34kRwbI01niGLRPeDPsl/3844d5adadf38332", "bg": "#3E2723", "key": "spyagaric-30241"}, {"title": "Spy Agaric", "number": "7584", "lottie": "https://ddejfvww7sqtk.cloudfront.net/nft-content-cache/lottie/EQD6mH9bwbn6S3M_tCRWOvqAIW8M34kRwbI01niGLRPeDPsl/3e6cc7033a010171", "bg": "#2d3436", "key": "spyagaric-7584"}, {"title": "Spy Agaric", "number": "20874", "lottie": "https://ddejfvww7sqtk.cloudfront.net/nft-content-cache/lottie/EQD6mH9bwbn6S3M_tCRWOvqAIW8M34kRwbI01niGLRPeDPsl/aef175b2a4ab5a69", "bg": "#2d3436", "key": "spyagaric-20874"}, {"title": "Homemade Cake", "number": "4784", "lottie": "https://ddejfvww7sqtk.cloudfront.net/nft-content-cache/lottie/EQCefrjhCD2_7HRIr2lmwt9ZaqeG_tdseBvADC66833kBS3y/9d381d5137cbf0b8_194a973ba1b", "bg": "#2d3436", "key": "homemadecake-4784"}, {"title": "Spy Agaric", "number": "30242", "lottie": "https://ddejfvww7sqtk.cloudfront.net/nft-content-cache/lottie/EQD6mH9bwbn6S3M_tCRWOvqAIW8M34kRwbI01niGLRPeDPsl/91bf68c71a5d7e17", "bg": "#3E2723", "key": "spyagaric-30242"}, {"title": "Homemade Cake", "number": "1683", "lottie": "https://ddejfvww7sqtk.cloudfront.net/nft-content-cache/lottie/EQCefrjhCD2_7HRIr2lmwt9ZaqeG_tdseBvADC66833kBS3y/c5af139494992a00_194a9737037", "bg": "#2d3436", "key": "homemadecake-1683"}, {"title": "Spy Agaric", "number": "4054", "lottie": "https://ddejfvww7sqtk.cloudfront.net/nft-content-cache/lottie/EQD6mH9bwbn6S3M_tCRWOvqAIW8M34kRwbI01niGLRPeDPsl/5042fc05825ef533", "bg": "#2d3436", "key": "spyagaric-4054"}, {"title": "Homemade Cake", "number": "4742", "lottie": "https://ddejfvww7sqtk.cloudfront.net/nft-content-cache/lottie/EQCefrjhCD2_7HRIr2lmwt9ZaqeG_tdseBvADC66833kBS3y/119de8d90d7bc8bf_194a973b5d1", "bg": "#636E72", "key": "homemadecake-4742"}, {"title": "Signet Ring", "number": "4269", "lottie": "https://ddejfvww7sqtk.cloudfront.net/nft-content-cache/lottie/EQCrGA9slCoksgD-NyRDjtHySKN0Ts8k6hdueJkUkZZdD4_K/4670a73c4b551f2f", "bg": "#2d3436", "key": "signetring-4269"}, {"title": "Vintage Cigar", "number": "4847", "lottie": "https://ddejfvww7sqtk.cloudfront.net/nft-content-cache/lottie/EQACcQpR2fmdeENWdE2YGQWHVxSTyA8Zq4_k7rk_IaxCRXNe/c7324ef0ff2a55ba_194a914192c", "bg": "#1B5E20", "key": "vintagecigar-4847"}, {"title": "Vintage Cigar", "number": "2669", "lottie": "https://ddejfvww7sqtk.cloudfront.net/nft-content-cache/lottie/EQACcQpR2fmdeENWdE2YGQWHVxSTyA8Zq4_k7rk_IaxCRXNe/8752b1114811d2ad_194a9124b56", "bg": "#4A148C", "key": "vintagecigar-2669"}, {"title": "Spiced Wine", "number": "7641", "lottie": "https://ddejfvww7sqtk.cloudfront.net/nft-content-cache/lottie/EQA8DCWyCWyywgOKYORerRoSVevWrUQ_FjKQgNihxY1227x7/e93f75e6ea2f9374", "bg": "#2d3436", "key": "spicedwine-7641"}, {"title": "Signet Ring", "number": "2512", "lottie": "https://ddejfvww7sqtk.cloudfront.net/nft-content-cache/lottie/EQCrGA9slCoksgD-NyRDjtHySKN0Ts8k6hdueJkUkZZdD4_K/47a3cc5b0cfd2e2e", "bg": "#1B5E20", "key": "signetring-2512"}, {"title": "Spy Agaric", "number": "7577", "lottie": "https://ddejfvww7sqtk.cloudfront.net/nft-content-cache/lottie/EQD6mH9bwbn6S3M_tCRWOvqAIW8M34kRwbI01niGLRPeDPsl/7f96e5537e2f8a3c", "bg": "#3E2723", "key": "spyagaric-7577"}, {"title": "Evil Eye", "number": "230", "lottie": "https://ddejfvww7sqtk.cloudfront.net/nft-content-cache/lottie/EQDQ6DjRabTYSAxf2xrZsnsXtqcIm1bj9dF5x_h8lNjWPmH4/8014f8a4983476e4", "bg": "#2d3436", "key": "evileye-230"}, {"title": "Signet Ring", "number": "2136", "lottie": "https://ddejfvww7sqtk.cloudfront.net/nft-content-cache/lottie/EQCrGA9slCoksgD-NyRDjtHySKN0Ts8k6hdueJkUkZZdD4_K/b8b66431887452af", "bg": "#2d3436", "key": "signetring-2136"}, {"title": "Magic Potion", "number": "274", "lottie": "https://ddejfvww7sqtk.cloudfront.net/nft-content-cache/lottie/EQAtFU9GrGfix4UG9DOivN58QxvgBJUaAZ_pdZBZCmbhKo4P/0f57d68ad2cef07e", "bg": "#2d3436", "key": "magicpotion-274"}, {"title": "Sharp Tongue", "number": "2786", "lottie": "https://ddejfvww7sqtk.cloudfront.net/nft-content-cache/lottie/EQBw2tO5UaJ4c_YXt3I8y5KD0k37staZxedV2O5HmryiK0dN/0d73fbd86fee0a62_194a96f9cdd", "bg": "#2d3436", "key": "sharptongue-2786"}, {"title": "Evil Eye", "number": "17335", "lottie": "https://ddejfvww7sqtk.cloudfront.net/nft-content-cache/lottie/EQDQ6DjRabTYSAxf2xrZsnsXtqcIm1bj9dF5x_h8lNjWPmH4/83d0740f9c3f99d1", "bg": "#FFD700", "key": "evileye-17335"}];
const $ = (s, r = document) => r.querySelector(s);
const esc = s => String(s ?? "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const CUR = ["RUB", "UAH", "KZT", "UZS", "TON", "USDT", "STARS", "BTC"];
const SYM = { RUB: "₽", UAH: "₴", KZT: "₸", UZS: "сум", TON: "TON", USDT: "USDT", STARS: "★", BTC: "₿" };
const ST = {
  created: ["Создана", "gray"], waiting_participant: ["Ожидает участника", "amber"], waiting_payment: ["Ожидает оплату", "blue"],
  paid: ["Оплата получена", "green"], completed: ["Завершена", "green"], cancelled: ["Отменена", "red"],
};
const LBL = { invite: "Пригласить участника", join: "Вступить в сделку", pay: "Оплатить", confirm: "Подтвердить получение", refund: "Вернуть деньги покупателю", cancel: "Отменить сделку" };
const TX = { deposit: "Пополнение", withdraw: "Вывод", deal_pay: "Оплата сделки", deal_release: "Выплата по сделке", deal_refund: "Возврат по сделке", sandbox_credit: "Тестовое пополнение", admin_credit: "Тестовое начисление" };
const TXS = { pending: ["На рассмотрении", "amber"], done: ["Выполнено", "green"], rejected: ["Отклонено", "red"] };
const RK = { card: ["Банковская карта", "wallet", "Последние 4 цифры (без полного номера)"], ton: ["TON кошелёк", "gem", "Адрес TON-кошелька"], usdt: ["USDT TRC20", "wallet", "Адрес TRC20 (начинается с T)"] };
const NFT_RE = /^https:\/\/t\.me\/nft\/[A-Za-z0-9_]{2,64}-\d{1,12}$/;
const TABMAP = { home: "home", deals: "deals", deal: "deals", reqs: "reqs", profile: "profile", ops: "profile", support: "profile", admin: "profile" };

const ico = n => `<svg class="ic"><use href="#i-${n}"/></svg>`;
const fm = (v, c) => `${Number(v).toLocaleString("ru-RU", { maximumFractionDigits: 8 })} ${SYM[c] || c}`;
const fmBalance = (v, c) => `${Number(v).toLocaleString("ru-RU", { minimumFractionDigits: 2, maximumFractionDigits: 8 })} ${SYM[c] || c}`;
const dt = t => new Date(t * 1000).toLocaleString("ru-RU", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" });
const sk = n => '<div class="sk"></div>'.repeat(n);
const empty = t => `<div class="empty">${t}</div>`;
const bk = `<button class="back" data-act="back">${ico("back")}Назад</button>`;
const stars = n => "★".repeat(n) + "☆".repeat(5 - n);
const chipsCur = (id, sel = "RUB") => `<div class="grid3" id="${id}">${CUR.map(c => `<button class="opt ${c === sel ? "on" : ""}" data-act="seg" data-arg="${c}">${c}</button>`).join("")}</div>`;
const mask = v => (v.length > 10 ? v.slice(0, 4) + " •••• " + v.slice(-4) : v);

const view = $("#view");
let me = null, cur = localStorage.getItem("deal_currency") || "RUB", page = ["home"], stack = [], tok = 0, sh = null;
const A = {}, PG = {};

// ------------------------------------------------------------ core helpers
let DEMO = CFG.preview === true;
async function api(path, o = {}) {
  if (DEMO) return demo(path, o);
  const r = await fetch("/api" + path, {
    method: o.method || "GET",
    headers: { "Content-Type": "application/json", "X-Init-Data": (tg && tg.initData) || "", ...(DEV ? { "X-Dev-User": DEV } : {}) },
    body: o.body ? JSON.stringify(o.body) : undefined,
  });
  const j = await r.json().catch(() => ({}));
  if (!r.ok) throw new Error(j.error || "Ошибка " + r.status);
  return j;
}
// ------------------------------------------------------------ demo mode: backend in the browser (only when no server is reachable)
const FINAL = ["completed", "cancelled"];
const lsGet = k => { try { return localStorage.getItem(k); } catch (e) { return null; } };
const lsSet = (k, v) => { try { localStorage.setItem(k, v); } catch (e) { toast("Браузер не разрешил сохранение данных", 1); } };
const newDB = () => ({ users: {}, bal: {}, deals: {}, txs: [], req: {}, rv: [], n: 0 });
let DB; try { DB = JSON.parse(lsGet("deal_preview_v2")); } catch (e) { }
DB = DB || newDB();
let duid = +(DEV || lsGet("deal_preview_user_v2") || 1) || 1;
const save = () => lsSet("deal_preview_v2", JSON.stringify(DB));
const now = () => Math.floor(Date.now() / 1000);
const r8 = x => Math.round(x * 1e8) / 1e8;
const num = v => { const x = Number(String(v).replace(",", ".")); return isFinite(x) && x > 0 && x <= 1e9 ? r8(x) : 0; };
const bal = (u, c) => DB.bal[u + ":" + c] || 0;
const mv = (u, c, d) => { const v = r8(bal(u, c) + d); if (v < 0) throw new Error("Недостаточно средств на балансе"); DB.bal[u + ":" + c] = v; };
const tlog = (u, type, c, a, status = "done", ref = "", details = "") => DB.txs.push({ id: ++DB.n, user_id: u, type, currency: c, amount: String(a), status, ref, details, created: now() });
const usr = id => DB.users[id] || (DB.users[id] = { id, username: "demo" + id, name: "Demo " + id, blocked: 0, created: now() });
const pubu = id => id ? { id, name: "@" + usr(id).username } : null;
const luhn = s => { let t = 0; [...s].reverse().forEach((ch, i) => { let n = +ch; if (i % 2) n = n > 4 ? n * 2 - 9 : n * 2; t += n; }); return t % 10 === 0; };
const validReq = (k, v) => {
  if (k === "card") { v = v.replace(/[ -]/g, ""); return /^\d{4}$/.test(v) ? v : null; }
  if (k === "ton") return /^[A-Za-z0-9_-]{48}$/.test(v) ? v : null;
  if (k === "usdt") return /^T[1-9A-HJ-NP-Za-km-z]{33}$/.test(v) ? v : null;
  return null;
};
const allowedD = (d, u) => {
  const st = d.status;
  if (st === "created" || st === "waiting_participant") return u === d.creator_id ? (st === "created" ? ["invite"] : []).concat("cancel") : ["join"];
  if (st === "waiting_payment") return u === d.buyer_id ? ["pay", "cancel"] : u === d.seller_id ? ["cancel"] : [];
  if (st === "paid") return u === d.buyer_id ? ["confirm"] : u === d.seller_id ? ["refund"] : [];
  return [];
};
const viewD = (d, u) => ({
  events: d.events || [{status:"created",created:d.created}], updated:d.updated || d.created, id: d.id, status: d.status, amount: String(d.amount), currency: d.currency, description: d.description, nft: d.nft, created: d.created,
  title: d.description.slice(0, 40) || `NFT-подарки (${d.nft.length})`, seller: pubu(d.seller_id), buyer: pubu(d.buyer_id),
  actions: allowedD(d, u), is_creator: u === d.creator_id,
  can_review: d.status === "completed" && (u === d.seller_id || u === d.buyer_id) && !DB.rv.some(r => r.deal_id === d.id && r.author_id === u),
  link: location.href.split(/[?#]/)[0] + "?deal=" + d.id,
});
async function demo(path, o = {}) { const r = demoRoute(path, o); save(); return r; }
function demoRoute(path, o) {
  const m = o.method || "GET", b = o.body || {}, [p, qs] = path.split("?"), s = p.split("/").filter(Boolean), u = duid, q = new URLSearchParams(qs || "");
  if (usr(u).blocked) throw new Error("Аккаунт заблокирован");
  const mine = () => Object.values(DB.deals).filter(d => d.seller_id === u || d.buyer_id === u).sort((x, y) => y.created - x.created);
  const dealOf = id => { const d = DB.deals[String(id || "").toUpperCase()]; if (!d) throw new Error("Сделка не найдена"); return d; };
  const R = s[0];
  if (R === "me") {
    const bl = {}; CUR.forEach(c => (bl[c] = String(bal(u, c))));
    const done = mine().filter(d => d.status === "completed"), to = {}, rt = DB.rv.filter(r => r.target_id === u);
    done.forEach(d => (to[d.currency] = String(r8((+to[d.currency] || 0) + d.amount))));
    return {
      user: { id: u, username: usr(u).username, name: usr(u).name, photo: null }, is_admin: u === 1, balances: bl, support: CFG.support || "", demo: true, payment_mode:"sandbox", auth_verified:false,
      stats: { completed: done.length, active: mine().filter(d => !FINAL.includes(d.status)).length, rating: rt.length ? Math.round(rt.reduce((a, r) => a + r.rating, 0) / rt.length * 10) / 10 : null, reviews: rt.length, turnover: to },
    };
  }
  if (R === "sandbox" && s[1] === "fund") {
    const a=num(b.amount); if(!a || a>1000000 || !CUR.includes(b.currency)) throw new Error("Тестовая сумма: до 1 000 000");
    mv(u,b.currency,a); tlog(u,"sandbox_credit",b.currency,a); return {ok:true};
  }
  if (R === "live") return {source:"preview",revision:DB.revision||0,server_time:now(),items:mine().filter(d=>d.status==="completed").flatMap(d=>d.nft.map(url=>{
    const [slug,number]=url.split("/").pop().split("-");return {deal_id:d.id,title:slug.replace(/([a-z])([A-Z])/g,"$1 $2"),number,url,amount:String(d.amount),currency:d.currency,completed:d.updated||d.created};
  }))};
  if (R === "home") return { deals: mine().slice(0, 5).map(d => viewD(d, u)), reviews: DB.rv.slice(-15).reverse().map(r => ({ rating: r.rating, text: r.text, created: r.created, name: "@" + usr(r.author_id).username })) };
  if (R === "deals") {
    if (s.length === 1 && m === "GET") { const f = q.get("filter"); return mine().filter(d => f === "active" ? !FINAL.includes(d.status) : f === "done" ? d.status === "completed" : true).map(d => viewD(d, u)); }
    if (s.length === 1) {
      const amt = num(b.amount), desc = String(b.description || "").trim().slice(0, 500), nft = [];
      for (const x of (Array.isArray(b.nft) ? b.nft : []).slice(0, 40)) { const t = String(x).trim(); if (!NFT_RE.test(t)) throw new Error("Некорректная NFT-ссылка: " + t.slice(0, 40)); if (!nft.includes(t)) nft.push(t); }
      if (b.role !== "seller" && b.role !== "buyer") throw new Error("Выберите роль");
      if (!amt) throw new Error("Введите корректную сумму");
      if (!CUR.includes(b.currency)) throw new Error("Выберите валюту");
      if (desc.length < 3 && !nft.length) throw new Error("Опишите товар или добавьте NFT-ссылки");
      const id = Array.from(crypto.getRandomValues(new Uint8Array(12)), x => x.toString(16).padStart(2, "0")).join("").toUpperCase();
      const d = (DB.deals[id] = { id, creator_id: u, seller_id: b.role === "seller" ? u : null, buyer_id: b.role === "buyer" ? u : null, amount: amt, currency: b.currency, description: desc, nft, status: "created", created: now(), events:[{status:"created",created:now()}] });
      return viewD(d, u);
    }
    const d = dealOf(s[1]);
    if (s.length === 2) return viewD(d, u);
    const a = s[2];
    if (a === "review") {
      const r = b.rating;
      if (d.status !== "completed" || (u !== d.seller_id && u !== d.buyer_id)) throw new Error("Отзыв недоступен");
      if (!Number.isInteger(r) || r < 1 || r > 5) throw new Error("Поставьте оценку от 1 до 5");
      if (DB.rv.some(x => x.deal_id === d.id && x.author_id === u)) throw new Error("Вы уже оставили отзыв");
      DB.rv.push({ deal_id: d.id, author_id: u, target_id: u === d.seller_id ? d.buyer_id : d.seller_id, rating: r, text: String(b.text || "").trim().slice(0, 300), created: now() });
      return { ok: true };
    }
    if (!allowedD(d, u).includes(a)) throw new Error("Действие сейчас недоступно");
    if (a === "invite") d.status = "waiting_participant";
    else if (a === "join") { d[d.seller_id === d.creator_id ? "buyer_id" : "seller_id"] = u; d.status = "waiting_payment"; }
    else if (a === "pay") { mv(u, d.currency, -d.amount); tlog(u, "deal_pay", d.currency, d.amount, "done", d.id); d.status = "paid"; }
    else if (a === "confirm") { mv(d.seller_id, d.currency, d.amount); tlog(d.seller_id, "deal_release", d.currency, d.amount, "done", d.id); d.status = "completed"; }
    else if (a === "refund") { mv(d.buyer_id, d.currency, d.amount); tlog(d.buyer_id, "deal_refund", d.currency, d.amount, "done", d.id); d.status = "cancelled"; }
    else d.status = "cancelled";
    d.updated=now(); (d.events ||= []).push({status:d.status,created:now()}); DB.revision=(DB.revision||0)+1;
    return viewD(d, u);
  }
  if (R === "requisites") {
    if (m === "GET") { const r = {}; Object.keys(RK).forEach(k => (r[k] = DB.req[u + ":" + k] || "")); return r; }
    const k = s[1], v = String(b.value || "").trim().slice(0, 100);
    if (!RK[k]) throw new Error("Неизвестный тип");
    if (!v) delete DB.req[u + ":" + k];
    else { const x = validReq(k, v); if (!x) throw new Error("Некорректные реквизиты"); DB.req[u + ":" + k] = x; }
    return { ok: true };
  }
  if (R === "txs") {
    if (m === "GET") return DB.txs.filter(t => t.user_id === u).slice(-60).reverse();
    const a = num(b.amount);
    if (s[1] === "deposit") { if (!a || !CUR.includes(b.currency)) throw new Error("Введите сумму и валюту"); tlog(u, "deposit", b.currency, a, "pending", "", String(b.comment || "").slice(0, 160)); return { ok: true, status: "pending" }; }
    if (!mine().some(d => d.status === "completed")) throw new Error("Вывод доступен после одной завершённой сделки");
    if (!a || !CUR.includes(b.currency) || !RK[b.method]) throw new Error("Проверьте сумму, валюту и способ вывода");
    const rq = DB.req[u + ":" + b.method];
    if (!rq) throw new Error("Сначала добавьте реквизиты для этого способа");
    mv(u, b.currency, -a); tlog(u, "withdraw", b.currency, a, "pending", "", b.method + ": " + rq);
    return { ok: true };
  }
  if (R === "admin") {
    if (u !== 1) throw new Error("Нет доступа");
    const W = s[1];
    if (W === "requests") return DB.txs.filter(t => t.status === "pending").reverse();
    if (W === "users" && m === "GET") return Object.values(DB.users).map(x => { const bl = {}; CUR.forEach(c => { if (bal(x.id, c) > 0) bl[c] = String(bal(x.id, c)); }); return { id: x.id, username: x.username, first_name: x.name, blocked: x.blocked, created: x.created, balances: bl }; });
    if (W === "deals" && m === "GET") return Object.values(DB.deals).sort((x, y) => y.created - x.created).map(d => viewD(d, 0));
    if (W === "users") {
      const id = +s[2];
      if (id === 1) throw new Error("Нельзя заблокировать администратора");
      if (!DB.users[id]) throw new Error("Пользователь не найден");
      DB.users[id].blocked = b.blocked ? 1 : 0; return { ok: true };
    }
    if (W === "txs") {
      const t = DB.txs.find(x => x.id === +s[2] && x.status === "pending"), ok = s[3] === "approve";
      if (!t) throw new Error("Заявка не найдена или уже обработана");
      if (t.type === "deposit" && ok) mv(t.user_id, t.currency, +t.amount);
      if (t.type === "withdraw" && !ok) mv(t.user_id, t.currency, +t.amount);
      t.status = ok ? "done" : "rejected"; return { ok: true };
    }
    if (W === "credit") {
      const a = num(b.amount), id = +b.user_id;
      if (!a || !CUR.includes(b.currency)) throw new Error("Проверьте сумму и валюту");
      if (!DB.users[id]) throw new Error("Пользователь не найден");
      mv(id, b.currency, a); tlog(id, "admin_credit", b.currency, a, "done", String(u)); return { ok: true };
    }
    if (W === "deals") {
      const d = dealOf(s[2]), ns = b.status;
      if (!FINAL.includes(ns)) throw new Error("Недопустимый статус");
      if (FINAL.includes(d.status)) throw new Error("Сделка уже закрыта");
      if (ns === "completed") {
        if (d.status !== "paid") throw new Error("Завершить можно только оплаченную сделку");
        mv(d.seller_id, d.currency, d.amount); tlog(d.seller_id, "deal_release", d.currency, d.amount, "done", d.id);
      } else if (d.status === "paid") { mv(d.buyer_id, d.currency, d.amount); tlog(d.buyer_id, "deal_refund", d.currency, d.amount, "done", d.id); }
      d.status = ns; return { ok: true };
    }
  }
  throw new Error("Не найдено");
}
const dm = () => !(me.demo || DEMO) ? "" : `<div class="card"><b>Тестовые участники</b><p class="mut">${DEMO ? "Приватный просмотр: данные только в этом браузере. Ссылка не передаёт сделку на другое устройство." : "Данные сохраняет Python в SQLite. Откройте второго участника в другой вкладке."} Участник 1 — администратор.</p>
  <div class="chips" style="margin:0">${[1, 2, 3].map(n => `<button class="chip ${n === me.user.id ? "on" : ""}" data-act="duser" data-arg="${n}">Участник ${n}</button>`).join("")}<button class="chip" data-act="dreset">Сброс</button></div></div>`;
A.duser = async n => {
  if(DEMO) { duid=+n; lsSet("deal_preview_user_v2",String(n)); }
  else {DEV=n;sessionStorage.setItem("deal_dev_user",n);const url=new URL(location.href);url.searchParams.set("dev",n);history.replaceState(null,"",url);}
  stack=[];page=["profile"];lastRevision=-1;await refreshMe();render();
};
A.dreset = async () => {
  if(!DEMO) {toast("Сброс недоступен");return;}
  if (!(await ask("Удалить все данные?"))) return;
  DB = newDB(); save(); await refreshMe(); stack = []; page = ["home"]; render();
};
const refreshMe = async () => {
  me = await api("/me");

};
function toast(m, bad) {
  const t = $("#toast"); t.textContent = m; t.className = "show" + (bad ? " bad" : "");
  clearTimeout(toast.t); toast.t = setTimeout(() => (t.className = ""), 2600);
}
const haptic = t => { try { tg && tg.HapticFeedback.notificationOccurred(t); } catch (e) { } };
const ask = m => new Promise(res => (tg && tg.initData && tg.showConfirm ? tg.showConfirm(m, res) : res(confirm(m))));
function copyText(v) {
  const done = () => toast("Скопировано");
  if (navigator.clipboard) navigator.clipboard.writeText(v).then(done, () => fb());
  else fb();
  function fb() { const t = document.createElement("textarea"); t.value = v; document.body.appendChild(t); t.select(); try { document.execCommand("copy"); done(); } catch (e) { } t.remove(); }
}
async function busy(b, fn) {
  b.classList.add("load"); b.disabled = true;
  try { await fn(); } catch (x) { toast(x.message, 1); haptic("error"); }
  finally { b.classList.remove("load"); b.disabled = false; }
}
function sheet(html) {
  closeSheet();
  const s = document.createElement("div"); s.className = "sheet-wrap";
  s.innerHTML = `<div class="sheet" role="dialog" aria-modal="true" aria-label="${esc(html.replace(/<[^>]*>/g, " ").slice(0,90))}" tabindex="-1"><div class="grab"></div><button class="sheet-close" data-act="close" aria-label="Закрыть">×</button>${html}</div>`;
  document.body.appendChild(s); requestAnimationFrame(() => s.classList.add("open"));
  s.addEventListener("click", e => { if (e.target === s) closeSheet(); });
  sh = s; s._focus=document.activeElement; document.body.style.overflow="hidden"; setTimeout(()=>s.querySelector("input,textarea,button")?.focus(),50);
}
function closeSheet() { if (!sh) return; const s = sh; sh = null; document.body.style.overflow="";s._focus?.focus(); s.classList.remove("open"); setTimeout(() => s.remove(), window.matchMedia("(prefers-reduced-motion: reduce)").matches ? 0 : 340); }
const openTg = u => { if (!/^https:\/\/t\.me\//.test(u)) return; tg && tg.openTelegramLink ? tg.openTelegramLink(u) : window.open(u, "_blank", "noopener"); };

// ------------------------------------------------------------ router
function go(n, a) { stack.push(page); page = [n, a]; render(); }
function back() { page = stack.pop() || ["home"]; render(); }
let entranceObserver;
function animateEntrance(keepScroll) {
  entranceObserver?.disconnect();
  if (keepScroll || window.matchMedia("(prefers-reduced-motion: reduce)").matches || !window.IntersectionObserver) return;
  entranceObserver = new IntersectionObserver(entries => {
    entries.forEach(({target, isIntersecting}) => {
      if (!isIntersecting) return;
      target.classList.add("reveal-visible");
      entranceObserver.unobserve(target);
    });
  }, { threshold: 0.04 });
  view.querySelectorAll(":scope > .card, :scope > .hero, :scope > .qa, :scope > .stats, :scope > .mi, .reviews-list > .card, .list > .card").forEach(el => {
    el.classList.add("reveal-pending");
    entranceObserver.observe(el);
  });
}
async function render(keepScroll=false) {
  const y=window.scrollY;
  const giftScroll=keepScroll ? $("#live-feed .gift-track")?.scrollLeft : 0;
  const t = ++tok, [n, a] = page;
  document.querySelectorAll("#nav>button[data-arg]").forEach(b => b.classList.toggle("on", b.dataset.arg === TABMAP[n]));
  if (tg && tg.BackButton) stack.length ? tg.BackButton.show() : tg.BackButton.hide();
  if(!keepScroll) view.innerHTML = sk(3);
  try {
    const h = await PG[n](a);
    if (t !== tok) return;
    view.innerHTML = h;
  } catch (e) {
    if (t !== tok) return;
    view.innerHTML = `<div class="empty">${esc(e.message)}<br><button class="btn s sm" data-act="retry" style="margin:14px auto 0">Повторить</button></div>`;
  }
  view.classList.remove("in"); if (!keepScroll) { void view.offsetWidth; view.classList.add("in"); } window.scrollTo({top: keepScroll ? y : 0, behavior: "instant"});
  animateEntrance(keepScroll);
  labelInputs(); hydrateGifts(); hydrateFeed();
  if(giftScroll && $("#live-feed .gift-track")) $("#live-feed .gift-track").scrollLeft=giftScroll;
}
document.addEventListener("click", e => {
  const el = e.target.closest("[data-act]"); if (!el || !A[el.dataset.act]) return;
  try { tg && tg.HapticFeedback.impactOccurred("light"); } catch (x) { }
  Promise.resolve(A[el.dataset.act](el.dataset.arg, el)).catch(x => toast(x.message, 1));
});
document.addEventListener("input", e => {
  if (e.target.id !== "nft") return;
  const n = e.target.value.split("\n").filter(l => NFT_RE.test(l.trim())).length;
  $("#nfth").textContent = n ? `Добавлено ссылок: ${n}` : "Ссылки ещё не добавлены";
});

// ------------------------------------------------------------ simple actions
A.tab = n => { stack = []; page = [n]; render(); };
A.go = n => go(n);
A.new = () => go("new");
A.deal = id => go("deal", id);
A.back = back;
A.retry = () => render();
A.close = closeSheet;
A.seg = (_, el) => { el.parentElement.querySelectorAll(".on").forEach(x => x.classList.remove("on")); el.classList.add("on"); };
A.copy = v => copyText(v);
A.ext = u => openTg(u);
A.share = l => !/^https:\/\/t\.me\//.test(l) ? copyText(l) : openTg(`https://t.me/share/url?url=${encodeURIComponent(l)}&text=${encodeURIComponent("Присоединяйтесь к сделке")}`);
A.cur = c => {
  cur = c; lsSet("deal_currency", c); document.querySelectorAll("#curs .chip").forEach(x => x.classList.toggle("on", x.dataset.arg === c));
  $("#balv").textContent = fmBalance(me.balances[c], c);
};
A.dfilter = f => { page = ["deals", f]; render(); };
A.atab = t => { page = ["admin", t]; render(); };
A.support = () => me.support ? openTg("https://t.me/" + me.support) : toast("Контакт поддержки пока не настроен", 1);

// ------------------------------------------------------------ pages
const dealCard = d => {
  const [l, c] = ST[d.status];
  return `<div class="card" data-act="deal" data-arg="${d.id}"><div class="row"><b>${esc(d.title)}</b><span class="bd ${c}">${l}</span></div>
  <div class="row mut" style="margin-top:6px"><span>#${d.id}</span><b style="color:var(--ink)">${fm(d.amount, d.currency)}</b></div></div>`;
};
const reviewCard = r => `<div class="card"><div class="row"><div class="row" style="justify-content:flex-start"><div class="av">${esc((r.name.replace("@", "")[0] || "U").toUpperCase())}</div>
  <div><b>${esc(r.name)}</b></div></div><span class="st">${stars(r.rating)}</span></div>${r.text ? `<p>${esc(r.text)}</p>` : ""}</div>`;
// Transcribed from the screenshots supplied by the project owner; not app transaction records.
const SCREENSHOT_REVIEWS = [
  ["@Алексей", 5, "Нормально"], ["@buyer_pro", 5, "Всё четко,без скама"],
  ["@thevlastov", 5, "Красава не обманул"], ["@pavel_msk", 5, "Уже третья сделка, всё гладко"],
  ["@bobofonw", 3, "советую"], ["@VajnixyXD", 5, "поверил на слово, не наебал спасибо"],
  ["@воздух я", 5, "имба бляя"], ["@gartechikq", 4, "Норм но доверия не много даже после использования"],
  ["@bododods", 5, "Лайк, не кинули"], ["@awangardiks", 5, "Сервис пушка"],
  ["@FunPayHold", 5, "Ну вроде не кинули, деньги заплатили"],
  ["@cryptowertty", 5, "нормально"], ["@tupoy_genniy", 5, "заебок"],
  ["@buyer_pro", 5, "не наеб"], ["@buyer_pro", 5, "не наеб"],
  ["@buyer_pro", 5, "афигеннг спасибо продал нфт"], ["@buyer_pro", 5, "кайф"],
  ["@stepan_msc", 5, "Лучший сервис для сделок с подарками"],
  ["@kate_moon", 5, "Комиссия маленькая, всё прозрачно"], ["@buyer_pro", 5, "топчик"],
  ["@danyasssjer", 5, "Быстро и за норм прайс+реп"],
  ["@lovemybaby", 5, "Сделка прошла отлично, рекомендую"],
  ["@kirill_tg", 5, "Гарант всё чётко проверил, спасибо!"],
  ["@sasha_nft", 5, "Скинул подарок, деньги пришли почти сразу"],
  ["@egorka_spb", 5, "Сделка прошла отлично, рекомендую"],
  ["@egorka_spb", 4, "нормально"], ["@maxpower", 4, "Уже третья сделка, всё гладко"],
  ["@sweetdreamz", 5, "Оперативно, никаких задержек"],
  ["@sweetdreamz", 5, "Отличная поддержка, помогли разобраться"],
  ["@tonlover", 5, "Комиссия маленькая, всё прозрачно"],
  ["@miloradik", 5, "Комиссия маленькая, всё прозрачно"],
  ["@roman_x", 5, "Комиссия маленькая, всё прозрачно"],
  ["@egorka_spb", 5, "Скинул подарок, деньги пришли почти сразу"],
  ["@kate_moon", 5, "Гарант всё чётко проверил, спасибо!"],
  ["@vano228", 5, "Красавцы, всё по-честному"],
  ["@maxpower", 4, "Просто и понятно, разобрался за минуту"],
  ["@kirill_tg", 5, "Ахуенный ботик, быстро провели сделку, советую всем"],
  ["@roman_x", 5, "Отличная поддержка, помогли разобраться"],
  ["@anyuta", 5, "Продал подарок за 5 минут, супер сервис"],
  ["@sasha_nft", 5, "Отличная поддержка, помогли разобраться"],
  ["@denchik", 5, "Комиссия маленькая, всё прозрачно"],
  ["@kirill_tg", 5, "Скинул подарок, деньги пришли почти сразу"],
  ["@miloradik", 5, "Лучший сервис для сделок с подарками"],
  ["@аноним", 5, "Продал подарок за 5 минут, супер сервис"],
  ["@dashka99", 5, "Реально безопасно, гарант не подведёт"],
  ["@miloradik", 4, "Сработало, но не сразу понял как выводить"],
  ["@artem_pro", 5, "Красавцы, всё по-честному"],
  ["@zaycev_go", 5, "Просто и понятно, разобрался за минуту"],
  ["@artem_pro", 5, "Гарант всё чётко проверил, спасибо!"],
  ["@nikita_spb", 5, "Гарант на связи 24/7, реально помогают"],
  ["@sasha_nft", 5, "Сделка прошла отлично, рекомендую"],
  ["@аноним", 5, "Просто и понятно, разобрался за минуту"],
  ["@egorka_spb", 5, "Гарант всё чётко проверил, спасибо!"],
  ["@zaycev_go", 4, "Всё ок, но хотелось бы больше валют"],
  ["@аноним", 5, "Быстро и без проблем, деньги пришли сразу"],
  ["@giftmaster", 5, "Отличная поддержка, помогли разобраться"],
  ["@kate_moon", 5, "Уже не первый раз пользуюсь, всё стабильно"],
  ["@kate_moon", 5, "Просто и понятно, разобрался за минуту"],
  ["@bogdan_007", 5, "Скинул подарок, деньги пришли почти сразу"],
  ["@dashka99", 4, "Всё ок, но хотелось бы больше валют"],
  ["@roman_x", 5, "Быстро и без проблем, деньги пришли сразу"],
  ["@miloradik", 5, "Оперативно, никаких задержек"],
  ["@lovemybaby", 4, "Всё как и обещали, доволен"],
  ["@lera_v", 5, "Всё как и обещали, доволен"],
  ["@artem_pro", 5, "Скинул подарок, деньги пришли почти сразу"],
  ["@dashka99", 4, "Нормально, но пришлось подождать пару минут"],
  ["@quickbuyer", 5, "Понятный интерфейс и удобные статусы сделки."],
  ["@neontrade", 5, "Очень удобный сервис, провожу сделки не первый раз, проблем не было."]
].map(([name, rating, text]) => ({ name, rating, text, source: "screenshot" }));

PG.home = async () => {
  const [h] = await Promise.all([api("/home"),refreshMe()]);
  return `<div class="hero"><span class="tag">Сделки в Telegram</span><h2>P2P-сделки<br>с понятным статусом</h2><p>Создайте сделку, пригласите участника и следите за каждым этапом.</p><span class="hero-g" aria-hidden="true">G</span>
  <button class="btn w sm" data-act="new">Создать сделку ${ico("arrow")}</button></div>
  <h3>Быстрые действия</h3><div class="qa"><button data-act="new"><i>${ico("plus")}</i>Новая сделка</button><button data-act="joinsheet"><i>${ico("box")}</i>Вступить в<br>сделку</button><button data-act="tab" data-arg="deals"><i>${ico("gem")}</i>Мои сделки</button></div>
  <div class="card balance-card"><div class="mut">Ваш баланс</div><div class="big" id="balv">${fmBalance(me.balances[cur],cur)}</div>
  <div class="chips" id="curs">${CUR.map(c=>`<button class="chip ${c===cur?"on":""}" data-act="cur" data-arg="${c}">${c}</button>`).join("")}</div></div>
  <h3>Последние сделки<button class="text-button" data-act="tab" data-arg="deals">Все</button></h3><div id="recent-deals">${h.deals.length?`<div class="list">${h.deals.map(dealCard).join("")}</div>`:empty(ico("bag")+"<p>У вас пока нет сделок</p>")}</div>
  <h3>Последние успешные сделки<span class="live" id="live-state">● LIVE</span></h3><div id="live-feed">${catalogCards()}</div>
  <h3>Последние отзывы<button class="text-button" data-act="rvhome">+ Написать</button></h3><div class="reviews-list">${[...h.reviews, ...SCREENSHOT_REVIEWS].map(reviewCard).join("")}</div>`;
};

PG.deals = async (f = "all") => {
  const d = await api("/deals?filter=" + f);
  return `<h1>Мои сделки</h1><div class="chips" style="margin:0 0 16px">${[["all", "Все"], ["active", "Активные"], ["done", "Завершённые"]]
    .map(([k, l]) => `<button class="chip ${k === f ? "on" : ""}" data-act="dfilter" data-arg="${k}">${l}</button>`).join("")}</div>
  ${d.length ? `<div class="list">${d.map(dealCard).join("")}</div>` : empty("У вас пока нет сделок")}
  <button class="btn" data-act="new">${ico("plus")}Новая сделка</button>`;
};

PG.new = async () => `${bk}<h1>Новая сделка</h1>
  <label>Ваша роль</label><div class="seg"><button class="on" data-act="seg" data-arg="seller">Я продавец</button><button data-act="seg" data-arg="buyer">Я покупатель</button></div>
  <label>Сумма</label><input id="amt" inputmode="decimal" placeholder="0" autocomplete="off">
  <label>Валюта</label>${chipsCur("ncur")}
  <label>${ico("gift")}NFT-подарки</label>
  <textarea id="nft" placeholder="Вставьте ссылки на гифты по одной в строке:&#10;https://t.me/nft/SnoopCigar-36257"></textarea>
  <div class="hint" id="nfth">Ссылки ещё не добавлены</div><div id="nft-preview" class="nft-preview"></div>
  <label>Описание сделки</label><textarea id="desc" maxlength="500" placeholder="Условия передачи подарка"></textarea>
  <button class="btn" data-act="create">Создать сделку</button>`;

A.create = (_, b) => busy(b, async () => {
  const d = await api("/deals", {
    method: "POST", body: {
      role: $(".seg .on").dataset.arg, amount: $("#amt").value, currency: $("#ncur .on").dataset.arg,
      description: $("#desc").value, nft: $("#nft").value.split("\n").map(s => s.trim()).filter(Boolean),
    },
  });
  haptic("success"); sessionStorage.removeItem("deal_draft"); stack.pop(); go("deal", d.id);
});

PG.deal = async id => {
  const d = await api("/deals/" + encodeURIComponent(id));
  const steps = ["created", "waiting_participant", "waiting_payment", "paid", "completed"];
  const i = d.status === "cancelled" ? -1 : steps.indexOf(d.status);
  const [sl, sc] = ST[d.status];
  const inv = d.is_creator && (d.status === "created" || d.status === "waiting_participant");
  return `${bk}<div class="card"><div class="row"><span class="mut">Сделка #${d.id}</span><span class="bd ${sc}">${sl}</span></div>
  <div class="big">${fm(d.amount, d.currency)}</div><div class="tl">${steps.map((_, k) => `<i class="${k <= i ? "on" : ""}"></i>`).join("")}</div>
  ${d.description ? `<p>${esc(d.description)}</p>` : ""}
  ${d.nft.length ? `<div class="mut">NFT-подарки</div>${d.nft.map(u => `<div class="link" data-act="ext" data-arg="${esc(u)}">${ico("gift")}${esc(u.replace("https://t.me/nft/", ""))}</div>`).join("")}` : ""}</div>
  <div class="card"><div class="kv"><span class="mut">Продавец</span><b>${esc(d.seller ? d.seller.name : "Ожидается")}</b></div>
  <div class="kv"><span class="mut">Покупатель</span><b>${esc(d.buyer ? d.buyer.name : "Ожидается")}</b></div>
  <div class="kv"><span class="mut">Создана</span><span>${dt(d.created)}</span></div></div>
  ${inv ? `<div class="card"><b>Ссылка для второго участника</b><div class="link" data-act="copy" data-arg="${esc(d.link)}">${ico("copy")}${esc(d.link)}</div>
  <button class="btn s" data-act="copy" data-arg="${esc(d.link)}">${ico("copy")}Копировать ссылку</button><button class="btn" data-act="share" data-arg="${esc(d.link)}">${ico("send")}Отправить в Telegram</button></div>` : ""}
  ${d.status==="waiting_payment" && d.actions.includes("pay")?`<button class="btn s" data-act="topup">${ico("plus")}Пополнить баланс</button>`:""}
  ${d.actions.filter(a=>a!=="invite").map((a, k) => `<button class="btn ${a === "cancel" || a === "refund" ? "d" : k ? "s" : ""}" data-act="dact" data-arg="${a}">${LBL[a]}</button>`).join("")}
  ${d.can_review ? `<button class="btn s" data-act="rvdeal">Оставить отзыв</button>` : ""}
  <h3>История сделки</h3><div class="card events">${(d.events||[]).map(e=>`<div class="event"><span class="event-dot"></span><div><b>${ST[e.status]?.[0]||esc(e.status)}</b><small>${dt(e.created)}</small></div></div>`).join("")}</div><p class="hint">Передачу NFT участники подтверждают самостоятельно.</p>`;
};

A.dact = async (act, b) => {
  const id = page[1];
  const q = { pay: "Оплатить сделку?", confirm: "Подтвердить получение подарка и передать баланс продавцу?", cancel: "Отменить сделку?", refund: "Вернуть средства покупателю и отменить сделку?" }[act];
  if (q && !(await ask(q))) return;
  await busy(b, async () => {
    await api(`/deals/${id}/${act}`, { method: "POST" });
    haptic("success"); toast(act === "invite" ? "Ссылка готова — отправьте её участнику" : "Готово"); await render();
  });
};

A.joinsheet = () => sheet(`<h2>Вступить в сделку</h2><p class="mut">Вставьте ссылку или ID сделки</p>
  <input id="jid" placeholder="ID или ссылка" autocomplete="off"><button class="btn" data-act="joingo">Открыть сделку</button>`);
A.joingo = () => {
  const m = /([A-Fa-f0-9]{24})/.exec($("#jid").value);
  if (!m) throw new Error("ID сделки не найден");
  closeSheet(); go("deal", m[1].toUpperCase());
};

// reviews
function reviewSheet(ids) {
  sheet(`<h2>Отзыв о сделке</h2>
  <label>Сделка</label><div class="chips" id="rvd" style="margin:0">${ids.map((i, k) => `<button class="chip ${ids.length === 1 || k === 0 ? "on" : ""}" data-act="seg" data-arg="${i}">#${i}</button>`).join("")}</div>
  <label>Оценка</label><div class="grid3" id="rate" style="grid-template-columns:repeat(5,1fr)">${[1, 2, 3, 4, 5].map(n => `<button class="opt ${n === 5 ? "on" : ""}" data-act="seg" data-arg="${n}">${n}★</button>`).join("")}</div>
  <label>Комментарий</label><textarea id="rvt" maxlength="300" placeholder="Как прошла сделка?"></textarea>
  <button class="btn" data-act="rvsend">Отправить отзыв</button>`);
}
A.rvdeal = () => reviewSheet([page[1]]);
A.rvhome = async () => {
  const ids = (await api("/deals?filter=done")).filter(d => d.can_review).map(d => d.id);
  if (!ids.length) throw new Error("Нет завершённых сделок для отзыва");
  reviewSheet(ids);
};
A.rvsend = (_, b) => busy(b, async () => {
  await api(`/deals/${$("#rvd .on").dataset.arg}/review`, { method: "POST", body: { rating: +$("#rate .on").dataset.arg, text: $("#rvt").value } });
  closeSheet(); haptic("success"); toast("Спасибо за отзыв"); render();
});

// requisites & balance
PG.reqs = async () => {
  const [r] = await Promise.all([api("/requisites"), refreshMe()]);
  const nz = Object.entries(me.balances).filter(([, v]) => Number(v) > 0);
  return `<h1>Реквизиты</h1><p class="mut">Сохраните способы получения средств. Нажмите на карточку для редактирования.</p>
  <div class="pill">${nz.length ? nz.map(([c, v]) => fm(v, c)).join(" · ") : "Баланс пока пуст"}</div>
  ${Object.keys(RK).map(k => `<button class="mi" data-act="req" data-arg="${k}"><i>${ico(RK[k][1])}</i><div>${RK[k][0]}<small>${r[k] ? esc(mask(r[k])) : "Не добавлено"}</small></div>${ico("chev")}</button>`).join("")}
  <button class="btn" data-act="topup">${ico("plus")}Пополнение баланса</button>
  <button class="btn s" data-act="wdsheet">${ico("out")}Вывод средств</button>`;
};
A.req = async k => {
  const r = await api("/requisites");
  sheet(`<h2>${RK[k][0]}</h2><label>${RK[k][2]}</label><input id="rv" value="${esc(r[k])}" autocomplete="off">
  <div class="hint">Оставьте поле пустым, чтобы удалить реквизиты.</div><button class="btn" data-act="reqsave" data-arg="${k}">Сохранить</button>`);
};
A.reqsave = (k, b) => busy(b, async () => {
  await api("/requisites/" + k, { method: "PUT", body: { value: $("#rv").value } });
  closeSheet(); haptic("success"); toast("Сохранено"); render();
});
A.topup = () => sheet(`<h2 class="topup-title">${ico("plus")} Пополнение баланса</h2><p class="mut">Свяжитесь с поддержкой (${me.support ? "@" + esc(me.support) : "контакт не указан"}), чтобы узнать реквизиты для перевода. После перевода оставьте заявку — администратор проверит оплату и зачислит баланс.</p>
  <label>Валюта</label><input value="RUB" readonly aria-label="Валюта">
  <label>Сумма</label><input id="dam" inputmode="decimal" placeholder="0.00" autocomplete="off">
  <label>Комментарий (необязательно)</label><input id="dcomment" maxlength="160" placeholder="Например, номер перевода или чек" autocomplete="off">
  <button class="btn" data-act="dsend">Отправить заявку</button>`);
A.dsend = (_, b) => busy(b, async () => {
  await api("/txs/deposit", { method: "POST", body: { amount: $("#dam").value, currency: "RUB", comment: $("#dcomment").value } });
  closeSheet(); haptic("success"); toast("Заявка отправлена на проверку"); go("ops");
});
A.wdsheet = () => sheet(`<h2>Вывод средств</h2><p class="mut">Заявка доступна после одной завершённой сделки. Вывод обрабатывает администратор.</p><label>Валюта</label>${chipsCur("wcur", cur)}
  <label>Сумма</label><input id="wam" inputmode="decimal" placeholder="0" autocomplete="off">
  <label>Способ</label><div class="seg" id="wm">${Object.keys(RK).map((k, i) => `<button class="${i ? "" : "on"}" data-act="seg" data-arg="${k}">${k === "card" ? "Карта" : k.toUpperCase()}</button>`).join("")}</div>
  <div class="hint">Баланс резервируется до обработки заявки администратором.</div><button class="btn" data-act="wsend">Вывести</button>`);
A.wsend = (_, b) => busy(b, async () => {
  await api("/txs/withdraw", { method: "POST", body: { amount: $("#wam").value, currency: $("#wcur .on").dataset.arg, method: $("#wm .on").dataset.arg } });
  closeSheet(); await refreshMe(); haptic("success"); toast("Заявка на вывод создана"); go("ops");
});
PG.ops = async () => {
  const t = await api("/txs");
  const plus = new Set(["deposit", "deal_release", "deal_refund", "admin_credit", "sandbox_credit"]);
  return `${bk}<h1>История операций</h1>${t.length ? t.map(x => {
    const [sl, sc] = TXS[x.status] || ["", "gray"];
    return `<div class="card"><div class="row"><b>${TX[x.type] || x.type}${x.ref && x.type.startsWith("deal") ? " #" + esc(x.ref) : ""}</b><b style="color:${plus.has(x.type) ? "var(--g2)" : "var(--ink)"}">${plus.has(x.type) ? "+" : "−"}${fm(x.amount, x.currency)}</b></div>
    <div class="row" style="margin-top:6px"><span class="mut">${dt(x.created)}</span><span class="bd ${sc}">${sl}</span></div></div>`;
  }).join("") : empty("Операций пока нет")}`;
};

// profile
PG.profile = async () => {
  await refreshMe();
  const u = me.user, s = me.stats;
  const name = u.username ? "@" + u.username : u.name || "Пользователь";
  const to = Object.entries(s.turnover).map(([c, v]) => fm(v, c)).join(" · ") || "0";
  const mi = (a, arg, ic, t, sm = "") => `<button class="mi" data-act="${a}" data-arg="${arg}"><i>${ico(ic)}</i><div>${t}${sm ? `<small>${sm}</small>` : ""}</div>${ico("chev")}</button>`;
  return `<div class="card profile-card"><div class="av lg">${u.photo?`<img src="${esc(u.photo)}" alt="Аватар профиля">`:esc((u.name||name).replace("@","")[0].toUpperCase())}</div><div><h1>${esc(u.name||name)}</h1><span class="bd green">${me.auth_verified ? "Вход через Telegram" : "Тестовый профиль"}</span><div class="mut">${esc(u.username?"@"+u.username:"")}</div><small class="mut">ID: ${u.id}</small></div></div>
  <div class="stats"><div class="stat">Завершено сделок<b>${s.completed}</b></div><div class="stat">Активных сейчас<b>${s.active}</b></div>
  <div class="stat">Рейтинг<b>${s.rating ? s.rating + " ★" : "—"}</b></div><div class="stat">Оборот<b style="font-size:15px">${esc(to)}</b></div></div>
  ${dm()}<div class="group-label">УПРАВЛЕНИЕ</div>
  ${me.is_admin ? mi("go", "admin", "shield", "Ворк-панель", "Управление платформой") : ""}
  ${mi("tab", "reqs", "gem", "Мои реквизиты")}${mi("wdsheet", "", "out", "Вывод средств")}${mi("go", "deals", "bag", "История сделок")}
  ${mi("go", "ops", "list", "История операций")}<div class="group-label">СЕРВИС И ПОМОЩЬ</div>${mi("go", "support", "headset", "Поддержка")}${mi("language", "", "help", "Язык интерфейса", "Русский")}${mi("closetg", "", "out", "Закрыть мини-приложение")}`;
};
PG.support = async () => `${bk}<h1>Поддержка</h1><div class="card"><p>Возник вопрос по сделке или выводу средств? Напишите в поддержку и укажите ID сделки.</p>
  ${me.support ? `<button class="btn" data-act="support">${ico("send")}Написать в поддержку</button>` : `<p class="mut">Контакт поддержки пока не указан владельцем приложения.</p>`}</div>`;

// admin / work panel
PG.admin = async (tab = "req") => {
  const tabs = `<div class="chips" style="margin:0 0 16px">${[["req", "Заявки"], ["users", "Пользователи"], ["deals", "Сделки"]]
    .map(([k, l]) => `<button class="chip ${k === tab ? "on" : ""}" data-act="atab" data-arg="${k}">${l}</button>`).join("")}</div>`;
  let body = "";
  if (tab === "req") {
    const r = await api("/admin/requests");
    body = r.length ? r.map(t => `<div class="card"><div class="row"><b>${TX[t.type]} ${fm(t.amount, t.currency)}</b><span class="mut">ID ${t.user_id}</span></div>
      ${t.details ? `<div class="link">${esc(t.details)}</div>` : ""}<div class="row" style="justify-content:flex-start;margin-top:10px">
      <button class="btn sm" data-act="atx" data-arg="${t.id}:approve">Одобрить</button><button class="btn sm d" data-act="atx" data-arg="${t.id}:reject">Отклонить</button></div></div>`).join("") : empty("Нет открытых заявок");
  } else if (tab === "users") {
    const u = await api("/admin/users");
    body = u.map(x => `<div class="card"><div class="row"><b>${esc(x.username ? "@" + x.username : x.first_name)}</b><span class="bd ${x.blocked ? "red" : "green"}">${x.blocked ? "Заблокирован" : "Активен"}</span></div>
      <div class="mut" style="margin:4px 0 10px">ID ${x.id} · ${esc(Object.entries(x.balances).map(([c, v]) => fm(v, c)).join(", ") || "баланс 0")}</div>
      <div class="row" style="justify-content:flex-start"><button class="btn sm s" data-act="acredit" data-arg="${x.id}">Начислить</button>
      <button class="btn sm ${x.blocked ? "" : "d"}" data-act="ablock" data-arg="${x.id}:${x.blocked ? 0 : 1}">${x.blocked ? "Разблокировать" : "Заблокировать"}</button></div></div>`).join("");
  } else {
    const d = await api("/admin/deals");
    body = d.length ? d.map(x => {
      const [l, c] = ST[x.status], fin = x.status === "completed" || x.status === "cancelled";
      return `<div class="card"><div class="row"><b>#${x.id}</b><span class="bd ${c}">${l}</span></div>
      <div class="mut" style="margin:4px 0">${esc(x.title)} · ${fm(x.amount, x.currency)}</div><div class="mut">${esc(x.seller ? x.seller.name : "—")} → ${esc(x.buyer ? x.buyer.name : "—")}</div>
      ${fin ? "" : `<div class="row" style="justify-content:flex-start;margin-top:10px">${x.status === "paid" ? `<button class="btn sm" data-act="astat" data-arg="${x.id}:completed">Завершить</button>` : ""}
      <button class="btn sm d" data-act="astat" data-arg="${x.id}:cancelled">Отменить</button></div>`}</div>`;
    }).join("") : empty("Сделок нет");
  }
  return `${bk}<h1>Ворк-панель</h1>${tabs}${body}`;
};
const adm = (arg, path, body, msg) => async (_, b) => { await api(path, { method: "POST", body }); toast(msg); render(); };
A.atx = (arg, b) => busy(b, async () => { const [id, a] = arg.split(":"); await api(`/admin/txs/${id}/${a}`, { method: "POST" }); toast("Готово"); render(); });
A.ablock = (arg, b) => busy(b, async () => { const [id, f] = arg.split(":"); await api(`/admin/users/${id}/block`, { method: "POST", body: { blocked: f === "1" } }); toast("Готово"); render(); });
A.astat = async (arg, b) => {
  const [id, s] = arg.split(":");
  if (!(await ask(s === "completed" ? "Завершить сделку и выплатить продавцу?" : "Отменить сделку (при оплате — вернуть деньги покупателю)?"))) return;
  await busy(b, async () => { await api(`/admin/deals/${id}/status`, { method: "POST", body: { status: s } }); toast("Статус изменён"); render(); });
};
A.acredit = uid => sheet(`<h2>Начислить баланс</h2><p class="mut">ID пользователя: ${esc(uid)}</p><label>Валюта</label>${chipsCur("acur")}
  <label>Сумма</label><input id="aam" inputmode="decimal" placeholder="0" autocomplete="off"><button class="btn" data-act="acsend" data-arg="${esc(uid)}">Начислить</button>`);
A.acsend = (uid, b) => busy(b, async () => {
  await api("/admin/credit", { method: "POST", body: { user_id: uid, currency: $("#acur .on").dataset.arg, amount: $("#aam").value } });
  closeSheet(); toast("Баланс начислен"); render();
});


let lastRevision=-1;
const giftMeta = u => CATALOG.find(x=>x.key===u.split("/").pop().toLowerCase());
// The gallery is a rotating view of the catalogue, independent of paid deal activity.
const LOCAL_GIFTS = new Map([[0,"00"],[1,"01"],[3,"03"],[4,"04"],[5,"05"],[6,"06"],[7,"07"]].map(([i,f])=>[CATALOG[i].key,`static/gifts/${f}.json`]));
const giftAsset = x => LOCAL_GIFTS.get(x.key) || x.lottie;
const FEED_CATALOG = [...new Map(CATALOG.map(x=>[x.key,x])).values()];
const reduceMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)");
let feedItems = null, feedObserver = null, feedVisible = new Set(), feedRotating = false, feedBusyUntil = 0;
const shuffled = xs => { const a=[...xs];for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a; };
function pickGifts(n, existing=[]) {
  const keys=new Set(existing.map(x=>x.key)), titles=new Set(existing.map(x=>x.title));
  const choices=shuffled(FEED_CATALOG.filter(x=>!keys.has(x.key)));
  const picked=[];
  for(const x of choices) if(!titles.has(x.title)){picked.push(x);keys.add(x.key);titles.add(x.title);if(picked.length===n)return picked;}
  for(const x of choices) if(!keys.has(x.key)){picked.push(x);keys.add(x.key);if(picked.length===n)break;}
  return picked;
}
const giftCard = x => `<article class="gift-card catalog-gift" data-gift="${esc(x.key)}" data-src="${esc(giftAsset(x))}" style="--gift-bg:${esc(x.bg)}" aria-label="${esc(x.title)} номер ${esc(x.number)}"><span class="gift-art">${ico("gift")}</span><span class="gift-info"><strong>${esc(x.title)}</strong><span>#${esc(x.number)}</span></span></article>`;
function initialFeed() {
  let previous=[];
  try { previous=JSON.parse(sessionStorage.getItem("nft_feed_previous")) || []; } catch(e) { /* Private browsing may block storage. */ }
  const items=pickGifts(10,Array.isArray(previous) ? previous.map(key=>({key})) : []);
  try { sessionStorage.setItem("nft_feed_previous",JSON.stringify(items.map(x=>x.key))); } catch(e) { /* The gallery still works without storage. */ }
  return items;
}
const catalogCards = () => `<div class="gift-track" aria-label="Последние успешные сделки">${(feedItems ||= initialFeed()).map(giftCard).join("")}</div>`;
function updateGiftPlayback() {
  let playing=0;
  document.querySelectorAll(".gift-card lottie-player").forEach(player=>{
    const active=!document.hidden && !reduceMotion?.matches && feedVisible.has(player.closest(".gift-card")) && playing<3;
    try { if(active){player.play?.();playing++;}else player.pause?.(); } catch(e) { /* Player may still be loading. */ }
  });
}
function hydrateFeed() {
  feedObserver?.disconnect();feedVisible=new Set();
  const track=$("#live-feed .gift-track");if(!track)return;
  const show=card=>{
    feedVisible.add(card);
    const art=card.querySelector(".gift-art");
    if(!art.querySelector("lottie-player")){
      const player=document.createElement("lottie-player");player.setAttribute("src",card.dataset.src);
      player.setAttribute("background","transparent");player.setAttribute("speed","1");player.setAttribute("loop","");
      player.setAttribute("aria-hidden","true");player.addEventListener("load",updateGiftPlayback);art.appendChild(player);
    }
    updateGiftPlayback();
  };
  if("IntersectionObserver" in window){
    feedObserver=new IntersectionObserver(entries=>{entries.forEach(entry=>{if(entry.isIntersecting)show(entry.target);else feedVisible.delete(entry.target);});updateGiftPlayback();},{root:track,rootMargin:"0px 55px",threshold:.15});
    track.querySelectorAll(".gift-card").forEach(card=>feedObserver.observe(card));
  } else [...track.querySelectorAll(".gift-card")].slice(0,3).forEach(show);
}
function rotateFeed() {
  if(page[0]!=="home" || document.hidden || sh || feedRotating || Date.now()<feedBusyUntil)return;
  const track=$("#live-feed .gift-track");if(!track || !feedItems || feedItems.length<3)return;
  const next=pickGifts(2,feedItems);if(next.length<2)return;
  const cards=[...track.querySelectorAll(".gift-card")];
  const first=Math.min(cards.length-1,Math.floor(track.scrollLeft/(cards[0].getBoundingClientRect().width+12)));
  const indices=[first,(first+4+Math.floor(Math.random()*Math.max(1,cards.length-5)))%cards.length];
  feedRotating=true;indices.forEach(i=>cards[i].classList.add("gift-changing"));
  setTimeout(()=>{
    if(track.isConnected){indices.forEach((i,j)=>{feedItems[i]=next[j];cards[i].outerHTML=giftCard(next[j]).replace('class="gift-card catalog-gift"','class="gift-card catalog-gift gift-entering"');});hydrateFeed();}
    feedRotating=false;
  },220);
}
document.addEventListener("pointerdown",e=>{if(e.target.closest?.(".gift-track"))feedBusyUntil=Date.now()+5000;});
document.addEventListener("scroll",e=>{if(e.target.classList?.contains("gift-track"))feedBusyUntil=Date.now()+5000;},true);
reduceMotion?.addEventListener?.("change",updateGiftPlayback);
function hydrateGifts(){
 // Catalogue data is used to identify the linked NFT, not fabricate sale activity.
 if(page[0]==="new") {
  let d;try{d=JSON.parse(sessionStorage.getItem("deal_draft"));}catch{}
  if(d){$("#amt").value=d.amount||"";$("#desc").value=d.description||"";$("#nft").value=d.nft||"";document.querySelectorAll("#ncur .opt").forEach(b=>b.classList.toggle("on",b.dataset.arg===d.currency));document.querySelectorAll(".seg button").forEach(b=>b.classList.toggle("on",b.dataset.arg===d.role));}
  nftPreview();
 }
}
function nftPreview(){
 if(!$("#nft"))return;
 const links=$("#nft").value.split("\n").map(x=>x.trim()).filter(Boolean);const valid=links.filter(x=>NFT_RE.test(x));
 $("#nfth").textContent=links.length ? `Корректных ссылок: ${valid.length} из ${links.length}` : "Ссылки ещё не добавлены";
 $("#nft-preview").innerHTML=valid.slice(0,8).map(u=>{const meta=giftMeta(u);return `<div class="nft-chip">${meta?`<lottie-player class="inline-gift" src="${esc(giftAsset(meta))}" background="transparent" speed="1" aria-label="Подарок"></lottie-player>`:ico("gift")}<span>${esc(u.split("/").pop())}</span></div>`;}).join("");
}
function saveDraft(){
 if(page[0]!=="new"||!$("#amt"))return;
 sessionStorage.setItem("deal_draft",JSON.stringify({amount:$("#amt").value,description:$("#desc").value,nft:$("#nft").value,currency:$("#ncur .on")?.dataset.arg,role:$(".seg .on")?.dataset.arg}));
}
function labelInputs(){
 document.querySelectorAll("input,textarea").forEach((el,i)=>{if(!el.id)el.id="field-"+i;let l=el.previousElementSibling;if(l?.tagName==="LABEL")l.htmlFor=el.id; if(!el.labels?.length)el.setAttribute("aria-label",el.placeholder||"Значение");});
}
document.addEventListener("input",()=>{nftPreview();saveDraft();});
document.addEventListener("click",e=>{if(e.target.closest('[data-act="seg"]'))saveDraft();});
document.addEventListener("keydown",e=>{
 if(!sh)return;
 if(e.key==="Escape"){e.preventDefault();closeSheet();}
 if(e.key==="Tab") {const els=[...sh.querySelectorAll("button,input,textarea,a[href]")]; const first=els[0],last=els[els.length-1];if(e.shiftKey&&document.activeElement===first){e.preventDefault();last?.focus();}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first?.focus();}}
});
A.close=closeSheet;
A.language=()=>sheet('<h2>Язык интерфейса</h2><p>Русский — выбран.</p>');
A.closetg=()=>{if(tg?.initData)tg.close();else toast("Эта функция доступна внутри Telegram");};
async function syncLive(){
 if(document.hidden||sh||!["home","deal","deals","profile"].includes(page[0]))return;
 const key=JSON.stringify(page);
 try{
  const l=await api("/live");if(key!==JSON.stringify(page))return;
  const badge=$("#live-state");if(badge){badge.textContent="● LIVE";badge.classList.remove("offline");}
  if(lastRevision!==l.revision) await render(true);
  lastRevision=l.revision;
 }catch(e){const b=$("#live-state");if(b){b.textContent="Нет связи";b.classList.add("offline");}}
}
window.addEventListener("storage",e=>{if(DEMO&&e.key==="deal_preview_v2"){try{DB=JSON.parse(e.newValue)||newDB();syncLive();}catch{}}});
window.addEventListener("online",syncLive);
document.addEventListener("visibilitychange",()=>{updateGiftPlayback();if(!document.hidden)syncLive();});
// Structured tools use the same API and visible screens; no payment side effects.
if(document.modelContext?.registerTool){
 try { document.modelContext.registerTool({name:"list_my_deals",title:"Мои сделки",description:"Read the signed-in participant's deals.",inputSchema:{type:"object",properties:{filter:{type:"string",enum:["all","active","done"]}},additionalProperties:false},annotations:{readOnlyHint:true,untrustedContentHint:true},async execute(input){const f=input?.filter||"all";if(!["all","active","done"].includes(f))throw new Error("Invalid filter");return await api("/deals?filter="+f);}}); }catch{}
}
// ------------------------------------------------------------ init
(async function init() {
  if (tg) {
    tg.ready(); tg.expand();
    try { tg.setHeaderColor("#f6f5f0"); tg.setBackgroundColor("#f6f5f0"); tg.disableVerticalSwipes && tg.disableVerticalSwipes(); } catch (e) { }
    tg.BackButton && tg.BackButton.onClick(back);
  }
  // Preview mode is explicit; an API outage NEVER switches to simulated money.
  DEMO = CFG.preview === true;
  try { await refreshMe(); } catch (e) { view.innerHTML = empty(esc(e.message)); return; }
  const sp = (tg && tg.initDataUnsafe && tg.initDataUnsafe.start_param) || P.get("deal") || "";
  const m = /^(?:deal_)?([A-Fa-f0-9]{24})$/.exec(sp);
  if (m) page = ["deal", m[1].toUpperCase()];
  await render();
  await syncLive();setInterval(syncLive,3000);setInterval(rotateFeed,26000);
})();
})();
