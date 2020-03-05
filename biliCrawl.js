// ==UserScript==
// @name         bilibili评论crawl
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  try to take over the world!
// @author       Amas
// @match        https://*.bilibili.com/*
// @grant        none
// ==/UserScript==


(function() {
    if (!/(t\.bilibili)|(h\.bilibili)/.test(location.href)) { return }
    var startBtn = document.createElement('button')
    startBtn.innerText = '开始获取评论'
    startBtn.setAttribute('style', 'position:fixed; top: 80px; left: 50px;')
    document.body.append(startBtn)
    console.log('抽奖机可用!')


    const run = function () {
        // 注入Vue
        var script = document.createElement('script')
        script.src = 'https://cdn.jsdelivr.net/npm/vue/dist/vue.js'
        document.head.append(script)
        // 清空DOM
        document.body.innerHTML = ''

        var appNode = document.createElement('div')
        var list = [];
        var total;
        var startFloor = 0
        var endFloor = null
        var selectNumber = 1
        var app;
        const tId = location.href.match(/com\/(\d*)/)[1]

        appNode.setAttribute('id', 'app')
        document.body.append(appNode)

        window._VUEinterval = window.setInterval(() => {
            if (window.Vue) {
                window.clearInterval(window._VUEinterval)
                initVueComponent()
            }
        }, 100)

        /**
         * 初始化VUE的组件
         * @Author   chenht
         * @DateTime 2019-01-17
         * @return   {[type]}   [description]
         */
        const initVueComponent = function () {
            const style = `
                h1{
                    margin: 0;
                    font-size: 17px;
                }
                #excludeName, #excludeMIDString{
                    display: inline-block;
                }
                #totalTable, #excluedTable, #resultTable{
                    max-height: 400px;
                    overflow-y: scroll;
                }
                #resultTable{
                    height: 260px;
                    display: inline-block;
                    width: calc(100% - 350px)
                }
                table{
                    width: 100%;
                    background-color: #666;
                }
                td, th{
                    background-color: #fff;
                }
            `
            const styleDom = document.createElement('style')
            styleDom.innerText = style
            document.head.append(styleDom)
            app = new Vue({
                el: '#app',
                template: `
                    <div>
                        <div id="operation">
                            开始楼层 <input type="text" v-model="startFloor" />
                            结束楼层 <input type="text" v-model="endFloor" />
                            <button :disabled="crawlProgress > 0" @click="crawlAll">获取评论 {{crawlProgress ? crawlProgress + '%' : ''}}</button>
                            <button @click="showList = !showList">显示所有评论</button>
                            <button :disabled="allList.length === 0" @click="clearDuplicated()">删除重复回复</button>
                            <button :disabled="allList.length === 0" @click="removeAllDuplicated()">重复失去资格</button>
                            中奖人数 <input type="text" v-model="selectNumber" />人
                            <button :disabled="allList.length === 0" @click="attempt()">抽奖</button>
                        </div>
                        <div>
                            <div id="resultTable">
                                <h1>抽奖结果:</h1>
                                <table>
                                    <tr>
                                        <th>楼层</th>
                                        <th>用户名</th>
                                        <th>uid</th>
                                        <th>内容</th>
                                    </tr>
                                    <tr v-for="item in resultList">
                                        <td>{{item.floor}}</td>
                                        <td>{{item.member.uname}}</td>
                                        <td>{{item.member.mid}}</td>
                                        <td>{{item.content.message}}</td>
                                    </tr>
                                </table>

                            </div>
                            <div id="excludeName">
                                <p>屏蔽用户名称, 回车分隔</p>
                                <textarea id="" cols="20" rows="15" v-model="excludeNameString"></textarea>
                            </div>
                            <div id="excludeMIDString">
                                <p>屏蔽用户uid, 回车分隔</p>
                                <textarea id="" cols="20" rows="15" v-model="excludeMIDString"></textarea>
                            </div>
                        </div>
                        <div id="totalTable" v-if="showList">
                            <h1>有效评论 {{allList.length}}: </h1>
                            <table>
                                <tr>
                                    <th>楼层</th>
                                    <th>用户名</th>
                                    <th>uid</th>
                                    <th>内容</th>
                                </tr>
                                <tr v-for="item in allList">
                                    <td>{{item.floor}}</td>
                                    <td>{{item.member.uname}}</td>
                                    <td>{{item.member.mid}}</td>
                                    <td>{{item.content.message}}</td>
                                </tr>
                            </table>
                        </div>
                        <div id="excluedTable" v-if="showList">
                            <h1>无效评论 {{dupList.length}}: </h1>
                            <table>
                                <tr>
                                    <th>楼层</th>
                                    <th>用户名</th>
                                    <th>uid</th>
                                    <th>内容</th>
                                </tr>
                                <tr v-for="item in dupList">
                                    <td>{{item.floor}}</td>
                                    <td>{{item.member.uname}}</td>
                                    <td>{{item.member.mid}}</td>
                                    <td>{{item.content.message}}</td>
                                </tr>
                            </table>
                        </div>
                    </div>
                `,
                data () {
                    return {
                        message: 'Hello Vue!',
                        startFloor: 0,
                        endFloor: 0,
                        selectNumber: 1,
                        showList: false,
                        allList: [],
                        dupList: [],
                        resultList: [],
                        crawlProgress: 0,
                        excludeNameString: '',
                        excludeMIDString: ''
                    }
                },
                methods: {
                    crawlAll () {
                        this.allList = []

                        if (!/^\d*$/.test(this.startFloor || '')) {
                            this.startFloor = 0
                        }
                        this.startFloor = parseInt(this.startFloor)
                        if (!/^\d*$/.test(this.endFloor || '')) {
                            this.endFloor = 0
                        }
                        this.endFloor = parseInt(this.endFloor)
                        if (this.endFloor < this.startFloor && this.endFloor) {
                            this.endFloor = this.startFloor
                        }

                        startFloor = this.startFloor
                        endFloor = this.endFloor

                       Ajax.get(`https://api.vc.bilibili.com/dynamic_svr/v1/dynamic_svr/get_dynamic_detail?dynamic_id=${tId}`, res => {
                           tid = JSON.parse(res).data.card.desc.rid;
                           crawlAll(progress => {
                               this.crawlProgress = progress
                           }, (data) => {
                               this.crawlProgress = 0
                               this.allList = data.map(v => Object.assign({}, v))
                           })
                       })

                    },
                    clearDuplicated () {
                        let obj = {}
                        let dup = []
                        this.allList = list.map(v => Object.assign({}, v))
                        this.allList.forEach(v => {
                            if (obj[v.member.mid]) {
                                dup.push(v)
                                v.dup = true
                            }
                            obj[v.member.mid] = 1
                        })
                        this.dupList = dup;
                        this.allList = this.allList.filter(v => !v.dup)
                    },
                    removeAllDuplicated () {
                        let obj = {}
                        let _dup = []
                        this.allList = list.map(v => Object.assign({}, v))
                        this.allList.forEach(v => {
                            if (obj[v.member.mid]) {
                                _dup.push(v)
                                v.dup = true
                            }
                            obj[v.member.mid] = 1
                        })
                        let res = []
                        let dup = []
                        this.allList.forEach(v => {
                            if (_dup.find(u => u.member.mid === v.member.mid)) {
                                dup.push(v)
                            } else {
                                res.push(v)
                            }
                        })
                        this.allList = res
                        this.dupList = dup;
                    },
                    attempt () {
                        var excludeNameList = this.excludeNameString.split(/ |\n|\t/).filter(v => v).map(v => new RegExp(v))
                        var excludeMIDList = this.excludeMIDString.split(/ |\n|\t/).filter(v => v).map(v => new RegExp(v))
                        var toSelectList = this.allList.filter(v => {
                            return !excludeNameList.some(u => u.test(v.member.uname)) && !excludeMIDList.some(u => u.test(v.member.mid))
                        })

                        console.log(toSelectList)

                        if (toSelectList.length < this.selectNumber) {
                            alert('抽选人数不足')
                            return
                        }

                        var res = []

                        for (var i = 0; i < this.selectNumber; i++) {
                            res.push(toSelectList.splice(Math.floor(Math.random() * toSelectList.length), 1)[0])
                        }

                        this.resultList = res

                    }
                },
                mounted () {
                    console.log(this.crawlProgress);
                }
            })
        }

        const Ajax={
            get: function(url, fn) {
                // XMLHttpRequest对象用于在后台与服务器交换数据
                var xhr = new XMLHttpRequest();
                xhr.open('GET', url, true);
                xhr.onreadystatechange = function() {
                    // readyState == 4说明请求已完成
                    if (xhr.readyState == 4 && xhr.status == 200 || xhr.status == 304) {
                        // 从服务器获得数据
                        fn.call(this, xhr.responseText);
                    }
                };
                xhr.send();
            }
        }


        /**
         * 获取所有的评论列表
         * @Author   chenht
         * @DateTime 2019-01-17
         * @return   {[type]}   [description]
         */
        const crawlAll = function (updateProgress, cb) {
            const crawl = function (pageNumber, rev) {
                var url = `https://api.bilibili.com/x/v2/reply?callback=jQuery111308328563511816511_${new Date().getTime()}&jsonp=jsonp&pn=${pageNumber}&type=11&oid=${tid}&sort=2&_=1583416507699`;
                var maxAttemp = 4

                function attempt () {
                    Ajax.get(url, res => {
                        maxAttemp --
                        res = JSON.parse(res.replace(/^.*?\(/, '').replace(/\)$/, ''));
                        res.data.replies = res.data.replies.map(v => {
                            let {content, member, floor} = v
                            return v
                        })
                        if (res.data.replies.every(v => !v || v.member.uname) || !maxAttemp) {
                            total = res.data.page.count;
                            list = list.concat(res.data.replies)
                            updateProgress(Math.min((pageNumber * 20 / (total || Infinity) * 100), 100).toFixed(0))
                            rev()
                        } else {
                            setTimeout(attempt, 100);
                        }
                    })
                }
                attempt()

            }

            list = []

            var promise = new Promise(rev => {
                crawl(1, rev)
            })

            promise = promise.then(() => new Promise (outerRev => {

                for (var i = 20; i < total; i += 20) {
                    ((index) => {
                        promise = promise.then(() => new Promise ((rev) => {
                            setTimeout(function() {

                                crawl(index / 20 + 1, rev)

                            }, 100);
                        }))
                    })(i)
                }

                promise.then(() => {
                    list = list.filter(v => v).sort((a, b) => a.floor - b.floor)
                    if (endFloor && list[list.length - 1].floor > endFloor) {
                        var last = 0;
                        list.forEach((v, i) => v.floor > endFloor && !last && (last = i))
                        list = list.slice(0, last)
                    }
                    if (startFloor && list[0].floor < startFloor) {
                        var first = 0;
                        list.forEach((v, i) => v.floor <= startFloor && (first = i))
                        list = list.slice(first)
                    }

                    cb(list)
                })

                outerRev();

            }))
        }



    }
    startBtn.addEventListener('click', run)
})();
