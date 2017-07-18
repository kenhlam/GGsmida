
## 介绍(Introduce)
layPage是一款非常灵活的分页组件，使用简单得掉渣，但是却需要遵循一定的路由规则，比如：/page/:num，也就是说，它并不支持参数的分页形式，而是采用目录的分页结构。
它提供了数量可观的可选参数，可方便于您对分页样式和风格的定义。官网：[http://www.layui.com](http://www.layui.com)


## 使用(Usage)
下面以Express.js为例

### 第一步：设定分页路由
    var router = require('express').Router();
    var laypage = require('laypage');
    
    //请注意，list部分你可以任意定义，但是后面必须严格遵循 /page/:num 的格式
    router.get('list/page/:num', function(req, res){
      //第二步
    });

### 第二步：作为渲染的参数
    router.get('list/page/:num', function(req, res){
      res.render('模版文件地址', {
        laypage: laypage({
          curr: req.params.page || 1
          ,url: req.url //必传参数，获取当前页的url
          ,pages: 18 //分页总数你需要通过sql查询得到
        })
      })
    });
  
### 第三步：在模版中输出分页
    <html>
      <body>
        <%= laypage %>  <!-- ejs -->
        
        {{ d.laypage }} <!-- laytpl -->
      </body>
    </html>

仅需三步，您就轻松地完成了一个分页的输出，但是laypage并不提供样式，它只动态输出分页的基本结构。下面是我们给的样式例子：
  
    /* laypage分页 */
    .laypage-main,
    .laypage-main *{display:inline-block; *display:inline; *zoom:1; vertical-align:top;}
    .laypage-main{margin:20px 0; border: 1px solid #009E94; border-right: none; border-bottom: none; font-size: 0;}
    .laypage-main *{padding: 0 15px; line-height:28px; border-right: 1px solid #009E94; border-bottom: 1px solid #009E94; font-size:14px;}
    .laypage-main .laypage-curr{background-color:#009E94; color:#fff;}

## 文档(Document)
好了，是时候介绍基础文档了，laypage的调用提供了以下参数（options）的选择
  
    laypage({
      curr: 1 //当前页，通过req.params.page即可得到（必选）
      ,pages: 18  //分页总数，可通过sql查询得到（必选）
      ,url: req.url //当前页的url（必选）
      ,groups: 5 //连续显示的分页数，默认5 （可选）
      ,first: '首页'   //首页显示的文本（可选）
      ,last: '尾页'   //尾页显示的文本（可选）
      ,prev: '上一页' //上一页自定义文本（可选）
      ,next: '下一页' //下一页自定义文本（可选）
      ,skip: false, //是否输出跳页框，默认false（可选）
      ,className: 'laypage' //分页样式的前缀，默认为laypage（可选）
    })

## 协议(License) 
The MIT License

## 备注（Remark） 
官网：[http://www.layui.com](http://www.layui.com)

浏览器版：[http://laypage.layui.com/](http://laypage.layui.com/)
