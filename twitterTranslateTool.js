// ==UserScript==
// @name         Twitter Translate
// @namespace    http://tampermonkey.net/
// @version      0.8
// @require      https://github.com/niklasvh/html2canvas/releases/download/v1.0.0-rc.1/html2canvas.min.js
// @description  try to take over the world!
// @author       Amas.
// @match        https://twitter.com/*
// @grant        none
// ==/UserScript==

(function () {
  'use strict';
  // Your code here...
  const $ = document.querySelector.bind(document)
  let oldHref = location.href
  window.setInterval(() => {
    if (oldHref !== location.href) {
      oldHref = location.href;
      window.TranslateTool.isActivated();
    }
  }, 1000)
  let style = document.createElement('style');
  style.innerText = `.translate-tool{position:fixed;top:0;left:50px;z-index:10000}.translate-tool-arrow{position:absolute;top:-25px;left:0;transform:rotate(45deg);background-color:#f00;width:40px;height:40px;z-index:10}.translate-tool-arrow::after{content:'T';position:absolute;transform:rotate(-45deg);font-size:21px;margin-top:16px;color:#fff;margin-left:23px;font-weight:bold}.translate-tool-tool-bar{position:absolute;top:-240px;left:-30px;width:200px;height:200px;padding:30px 10px 10px 10px;transition:top .5s;background-color:#aaa;user-select:none}.translate-tool-arrow:hover+.translate-tool-tool-bar,.translate-tool-tool-bar:hover{top:0}.translate-tool-tool-bar input[type=checkbox]{display:none;margin:3px 3px 3px 4px;-webkit-appearance:checkbox;box-sizing:border-box;background-color:initial;cursor:default;padding:initial;border:initial}.translate-tool-tool-bar label{background-color:#FFF;padding:6px 43px 8px 9px;border-radius:5px;display:inline-block;position:relative;margin-right:30px;box-shadow:0 0 2px rgba(0,0,0,.3);height:17px;overflow:hidden;font-size:14px!important;color:#464e50;cursor:pointer}.translate-tool-tool-bar label::before{content:' ';position:absolute;background:#6ac6dd;width:0;height:100%;top:0;-webkit-transition:all .3s ease-in;transition:all .3s ease-in;left:0}.translate-tool-tool-bar input[type="checkbox"]:checked+label::before{content:' ';position:absolute;width:100%;height:100%;text-shadow:0 1px 0 rgba(0,0,0,.1);top:0;left:0}.translate-tool-tool-bar label::after{content:'';position:absolute;background:#FFF;top:4px;right:3px;width:24px;display:block;font-size:1em!important;height:16px;border-radius:3px;box-shadow:0 0 1px rgba(0,0,0,.6),inset 0 -18px 15px -10px rgba(0,0,0,.05);padding:4px 0;text-align:center;color:#496f7a}.translate-tool-tool-bar input[type="checkbox"]:checked+label::after{content:'';background-color:#6ac6dd;box-shadow:inset 0 0 0 5px #fff}.translate-tool-tool-bar label>span{position:relative;z-index:99999;font-family:adelle-sans,sans-serif;white-space:nowrap}`
  const DOM = document.createElement('div');
  DOM.innerHTML = `
  <div class="translate-tool">
    <div class="translate-tool-arrow"></div>
    <div class="translate-tool-tool-bar">
      <input type="checkbox" id="toggleShowOriginalText"> <label for="toggleShowOriginalText"><span>隐藏原文</span></label>
      <input type="checkbox" id="toggleConversationLink"> <label for="toggleConversationLink"><span>隐藏回复线</span></label>
      <button class="EdgeButton EdgeButton--primary" id="resetTranslationText"><span>添加/重置翻译文本</span></button><br/>
      <button class="EdgeButton EdgeButton--primary" id="convertTime"><span>时间转换</span></button><br/>
      <button class="EdgeButton EdgeButton--primary" id="export"><span>导出</span></button><br/>
    </div>
  </div>
  `

  let styleList = [
	"fontSize",
	"fontFamily",
	"paddingBottom",
	"fontWeight",
	"color",
	"overflowWrap",
	"minWidth",
	"lineHeight",
	"position",
	"border",
	"boxSizing",
	"color",
	"display",
	"font",
	"marginBottom",
	"marginLeft",
	"marginRight",
	"marginTop",
	"paddingBottom",
	"paddingLeft",
	"paddingRight",
	"paddingTop",
	"whiteSpace",
	"wordWrap",
	"backgroundImage",
	"zIndex",
	"backgroundRepeat",
	"backgroundColor",
	"width",
	"height",
	"position",
	"top",
	"right",
	"left",
	"bottom",
	"display",
	"MsFlexAlign",
	"MsFlexDirection",
	"MsFlexNegative",
	"MsFlexPreferredSize",
	"WebkitAlignItems",
	"WebkitBoxAlign",
	"WebkitBoxDirection",
	"WebkitBoxOrient",
	"WebkitFlexBasis",
	"WebkitFlexDirection",
	"WebkitFlexShrink",
	"alignItems",
	"border",
	"boxSizing",
	"flexBasis",
	"flexDirection",
	"flexShrink",
	"marginBottom",
	"marginLeft",
	"marginRight",
	"marginTop",
	"minHeight",
	"minWidth",
	"paddingBottom",
	"paddingLeft",
	"paddingRight",
	"paddingTop"
  ];

  let nameTranslateMap = {
  "犬山たまき": "犬山玉姬",
  "織田信姫": "织田信姬",
  "佃煮のりお": "佃煮海苔男",
  "風宮まつり": "风宫祭",
  "神楽めあ": "神乐Mea",
  "湊あくあ": "湊阿库娅",
  "宇森ひなこ": "宇森Hinako",
  "白上フブキ": "白上吹雪",
  "夏色まつり": "夏色祭",
  "高槻りつ": "高槻律",
  "花野蜜": "花野蜜",
  "癒月ちょこ": "癒月巧可",
  "黒猫ななし": "黑猫Nanashi",
  "ふくやマスタ": "福山Master",
  "ゆゆうた": "YYUT",
  "ゆゆちゃん": "YY酱",
  "ロボ子": "萝卜子",
  "紫咲シオン": "紫咲诗音",
  "宗谷いちか": "宗谷Ichika",
  "シスター・クレア": "修女克蕾雅",
  "皆守ひいろ": "皆守Hero",
  "兎鞠まり": "兔鞠Mari",
  "有閑喫茶あにまーれ": "有闲咖啡AniMare",
  "YMN姉貴": "YMN大姐头",
  "本間ひまわり": "本间向日葵",
  "因幡はねる": "因幡Haneru",
  "大神ミオ": "大神澪",
  "百鬼あやめ": "百鬼绫目",
  "大空スバル": "大空昴",
  "アキロゼ": "亚绮罗森",
  "夜空メル": "夜空梅露",
  "さくらみこ": "樱巫女",
  "赤井はあと": "赤井心",
  "ときのそら": "时乃空",
  "もののべありす ": "物述有栖-爱丽丝",
  "オバママ": "张京华",
  "ユメノシオリ": "梦乃栞",
  "魔王マグロナ": "魔王玛格萝娜",
  "マグロナ": "玛格萝娜",
  "白雪みしろ": "白雪深白",
  "やごー": "Yagoo",
  "千条アリア": "千条亚里亚",
  "AZKi": "AZKi",
  "闇夜乃モルル": "闇夜乃莫露露",
  "HIMEHINA": "田中姬铃木雏",
  "星乃めあ": "星乃Mea",
  "神楽なな": "神乐七奈",
  "笹木咲": "笹木咲",
  "森永みう": "森永miu",
  "花園セレナ": "花园serena",
  "乙女おと": "乙女音",
  "もちひよこ": "Mochi Hiyoko",
  "千草はな": "千草Hana",
  "蒼乃ゆうき": "蒼乃幽姬",
  "有栖マナ": "有栖mana",
  "輝夜月": "辉夜月",
  "椎名唯華": "椎名唯华",
  "猫宮ひなた": "猫宫日向",
  "道明寺ここあ": "道明寺可可亚",
  "夢咲楓": "梦咲枫",
  "桜樹みりあ": "樱树米莉亚",
  "真白くま": "真白Kuma",
  "花芽すみれ": "花芽堇",
  "花芽なずな": "花芽薺",
  "花譜": "花谱",
  "YuNi": "YuNi",
  "七瀬すばる": "七濑昴",
  "ベルモンド・バンデラス": "贝尔蒙德班德拉斯",
  "周防パトラ": "周防Patra",
  "宇志海いちご": "宇志海莓",
  "來夢めると": "来梦meruto",
  "夢月ロア": "梦月roa",
  "花京院ちえり": "花京院樱桃",
  "風宮まつり": "风宫祭",
  "歌衣メイカ": "歌衣makea",
  "音羽ララ": "音羽拉拉",
  "富士葵": "富士葵",
  "燦鳥ノム": "璨鸟瑙舞",
  "月ノ美兎": "月之美兔",
  "社築": "社筑",
  "名取さな": "名取sana",
  "愛園愛美": "爱园爱美",
  "赤羽葉子": "赤羽叶子",
  "飛鳥ひな": "飞鸟雏   ",
  "遠北千南": "远北千南",
  "安土桃": "安土桃",
  "アンジュ・カトリーナ": "安洁・卡特莉娜",
  "家長むぎ": "家长麦",
  "出雲霞": "出云霞",
  "戌亥とこ": "戌亥床",
  "卯月コウ": "卯月光",
  "雨森小夜": "雨森小夜",
  "える": "艾露",
  "御伽原江良": "御伽原江良",
  "小野町春香": "小野町春香",
  "語部紡": "语部纺",
  "叶": "叶",
  "神田笑一": "神田笑一",
  "ギルザレンⅢ世": "吉尔扎伦三世",
  "葛葉": "葛叶",
  "久遠千歳": "久远千岁",
  "黒井しば": "黑井柴",
  "郡道美玲": "郡道美玲",
  "剣持刀也": "剑持刀也",
  "桜凛月": "樱凛月",
  "静凛": "静凛",
  "渋谷ハジメ": "涩谷初",
  "ジョー・力一": "周・力一",
  "鈴鹿詩子": "铃鹿诗子",
  "鈴木勝": "铃木胜",
  "鈴谷アキ": "铃谷秋",
  "雪汝": "雪汝",
  "瀬戸美夜子": "濑户美夜子",
  "鷹宮リオン": "鹰宫莉音",
  "月見しずく": "月见雫",
  "でびでび・でびる": "德比德比・德比鲁",
  "ドーラ": "多拉",
  "轟京子": "轰京子",
  "名伽尾アズマ": "名伽尾吾妻",
  "成瀬鳴": "成濑鸣",
  "花畑チャイカ": "花畑嘉依卡",
  "春崎エアル": "春崎艾尔",
  "樋口楓": "樋口枫",
  "伏見ガク": "伏见学",
  "文野環": "文野环",
  "舞元啓介": "舞元启介",
  "魔界ノりりむ": "魔界之莉莉姆",
  "町田ちま": "町田千麻",
  "三枝明那": "三枝明那",
  "モイラ": "摩伊拉",
  "物述有栖": "物述有栖",
  "森中花咲": "森中花咲",
  "矢車りね": "矢车理音",
  "勇気ちひろ": "勇气千寻",
  "夕陽リリ": "夕阳莉莉",
  "夢追翔": "梦追翔",
  "リゼ・ヘルエスタ": "莉泽・赫露艾斯塔",
  "緑仙": "绿仙",
  "竜胆尊": "龙胆尊",
  "童田明治": "童田明治",
  "天開司": "天开司",
  "皇牙サキ": "皇牙Saki",
  "ふぇありす": "Fairys",
  "戌神ころね": "戌神沁音",
  "日ノ隈らん": "日之隈Ran",
  "しぐれうい": "时雨羽衣",
  "宝鐘マリン": "宝钟玛琳",
  "風見くく": "风见Kuku",
  "柚原いづみ": "柚原Izumi",
  "星街すいせい": "星街彗星",
  "愛宮みるく": "爱宫Milk",
  "潤羽るしあ": "润羽露西娅",
  "不知火フレア": "不知火芙蕾雅",
  "白銀ノエル": "白银诺艾尔",
  "メンバー限定": "会员限定",
  "姫咲ゆずる": "姫咲柚流",
  "熊谷タクマ": "熊谷Takuma",
  "姫森ルーナ": "姬森璐娜",
  "鬼灯わらべ": "鬼灯Warabe",
  "夢乃リリス": "梦乃Lilith",
  "伊東ライフ": "伊东Life",
};

  let phraseMap = {
      "のりおママです": "大家好我是海苔男妈妈",
      "本日も応援よろしくお願いします": "今天也请大家多多关照哦",
      "配信告知": "直播预告",
      "コラボ": "联动",
      "本日": "今天",
      "の配信予定": "的直播日程",
      "のりプロ": "NoriPro",
      "配信タグ": "直播Tag",
      "夜の予定は当日の朝7点にお知らせします": "晚上的日程将于当天早上7点之后公布",
  };

  (function () {
  	let obj = {}
  	styleList = styleList.filter(v => !obj[v] && (obj[v] = 1))
  })();

  DOM.style.display = 'none'
  document.body.append(style);
  document.body.append(DOM);
  window.TranslateTool = {
    activated: false,
    currentTweet: null,
    currentTweetOriginalText: null,
    transitionText: null,
    isActivated () {
      this.activated = oldHref.indexOf('/status') > -1
      if (this.activated) {
        DOM.style.display = 'block';
        this.currentTweet = (document.querySelector('article') || {}).parentNode
        let article = this.currentTweet.children[0]
        this.currentTweetHeader = article.children[0].children[0].children[0].children[1]
        this.currentTweetOriginalTextWrapper = this.currentTweetHeader.nextSibling
        this.currentTweetOriginalText = this.currentTweetOriginalTextWrapper && this.currentTweetOriginalTextWrapper.firstChild
        this.timetagNode = this.currentTweetOriginalTextWrapper.children[this.currentTweetOriginalTextWrapper.children.length - 3]
        this.timetag = this.timetagNode.firstChild.firstChild.innerText
      } else {
        DOM.style.display = 'none';
      }
    },
    toggleShowOriginalText () {
      this.currentTweetOriginalText.style.display = document.querySelector('#toggleShowOriginalText').checked ? 'none' : 'block';
    },
    resetTranslationText () {
      this.transitionText && this.transitionText.remove();
      this.transitionText = document.createElement('div');
      this.transitionText.addEventListener('blur', (e) => {
        sessionStorage[this.timetag] = this.transitionText.firstChild.innerHTML;
      })
      this.transitionText.contentEditable = 'true';
      this.transitionText.id = 'translate-tool-translation-text'
      this.transitionText.className = this.currentTweetOriginalTextWrapper.className
      this.transitionText.style = `display: block; width: 100%; font-family: 'Microsoft Yahei'; font-weight: bold; color: #444;border:none; margin-top: 15px;`;
      this.transitionText.innerHTML = this.currentTweetOriginalText.firstChild.outerHTML.replace(/href=\".*?\"/g, '');
      this.currentTweetOriginalTextWrapper.children[0].after(this.transitionText)
      let _innerHTML
      if (_innerHTML = sessionStorage[this.timetag]) {
      	this.transitionText.firstChild.innerHTML = _innerHTML;
      }
    },
    toggleConversationLink () {
      document.querySelector('#toggleConversationLink').checked ?
        this.currentTweet.parentNode.classList.remove('permalink-tweet-container') :
        this.currentTweet.parentNode.classList.add('permalink-tweet-container')
    },
    convertTime () {
      if (!this.transitionText) { return; }
      let innerHTML = this.transitionText.innerHTML;
      innerHTML = innerHTML.replace(/(\d{1,2})時/g, (str, v) => (+v === 0 ? v + 23 : v - 1) + '点')
      innerHTML = innerHTML.replace(/(\d{1,2}):(\d\d)/g, (str, v, u) => (+v === 0 ? v + 23 : +v - 1) + ':' + u)


      for (let i in nameTranslateMap) {
        innerHTML = innerHTML.replace(new RegExp(`${i}様|${i}`, 'g'), nameTranslateMap[i]);
      }
      for (let i in phraseMap) {
        innerHTML = innerHTML.replace(new RegExp(i, 'g'), phraseMap[i]);
      }

      this.transitionText.innerHTML = innerHTML
    },
    export () {
      this.stylizeElement()
      html2canvas(this.currentTweet, {
        useCORS: true,
        logging: false
      }).then(canvas => {
        canvas.toBlob((img) => {
          var url = URL.createObjectURL(img);
          var link = document.createElement("a");
          link.download = this.timetag.replace(':', ' ') + '.png';
          link.href = url;
          var event = document.createEvent("MouseEvent");
          event.initEvent("click", !0, !0, window, 1, 0, 0, 0, 0, !1, !1, !1, !1, 0, null);
          link.dispatchEvent(event);
        });
      });
    },
    stylizeElement () {
    	let svg = this.currentTweet.querySelector('svg')
    	svg && svg.remove()
    	let group = this.currentTweet.querySelector('[role="group"]')
    	group && group.remove()
    	this.timetagNode.style="margin-top:10px;"
    	let list = [];
    	const traversal = node => {
    		list.push(node)
    		Array.prototype.forEach.call(node.children, traversal)
    	}
    	traversal(this.currentTweet)
    	list.forEach(v => this.addStyle(v))
    },
    addStyle (element) {
    	const parents = (node, parent) => {
    		while (node.parentNode) {
    			if (node === parent) { return true; }
    			node = node.parentNode
    		}
    		return false;
    	}
    	let map = window.getComputedStyle(element)
    	let style = '';
    	styleList.forEach(v => {
    		style += `${v.replace(/[A-Z]/g, (a) => '-' + a.toLowerCase())}:${map[v]};`
    	})
    	if (map['backgroundImage'].indexOf('svg') > -1 && (parents(element, this.currentTweetOriginalText) || parents(element, this.transitionText))) {
    		style += 'background-size: 220% 220%;background-position: 0% -10%;'
    	}
    	if (map['backgroundImage'].indexOf('svg') > -1 && parents(element, this.currentTweetHeader)) {
    		style += 'background-size: 280% 280%;background-position: 0% 0%;'
    	}
    	element.setAttribute('style', style);
    }
  }
  document.getElementById('toggleShowOriginalText').addEventListener('click', TranslateTool.toggleShowOriginalText.bind(TranslateTool));
  document.getElementById('toggleConversationLink').addEventListener('click', TranslateTool.toggleConversationLink.bind(TranslateTool));
  document.getElementById('convertTime').addEventListener('click', TranslateTool.convertTime.bind(TranslateTool));
  document.getElementById('resetTranslationText').addEventListener('click', TranslateTool.resetTranslationText.bind(TranslateTool));
  document.getElementById('export').addEventListener('click', TranslateTool.export.bind(TranslateTool));
  setTimeout(() => {window.TranslateTool.isActivated();}, 2000)


  document.addEventListener('copy', function(e){
    const map = [
        ['带有脸的太阳', '🌞'],
        ['日本食人魔', '👹'],
        ['上弦月脸', '🌛'],
        ['奶瓶', '🍼'],
        ['闪耀的心', '💖'],
        ['狗脸', '🐕'],
        ['🐶', '🐕'],
        ['蓝心', '💙'],
        ['雪花', '❄'],
        ['兔脸', '🐰'],
        ['写字的手', '✍'],
        ['熊脸', '🐻'],
        ['冰淇淋', '🍨'],
        ['爱情酒店', '🏩'],
        ['箭从中穿过的心', '💘']
    ]

    async function fn () {
      let text = await navigator.clipboard.readText()
      map.forEach(v => {
        const regExp = new RegExp(v[0], 'g')
        text = text.replace(regExp, v[1])
      })
      console.log(text)
    }
    fn()
  });
})();
