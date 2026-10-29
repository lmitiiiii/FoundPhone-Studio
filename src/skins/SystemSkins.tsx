export { WeatherSkin, HealthSkin } from "./CalibratedSystemApps";
import { AudioPlayer, useTrack } from "../audio";
import { useSkinState } from "../skinState";
import {
  Calendar,
  Camera,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  Clock,
  Download,
  FileText,
  Folder,
  Globe,
  Grid,
  Heart,
  Image,
  LockKeyhole,
  MapPin,
  MoreHorizontal,
  Bookmark,
  Share,
  Music,
  Phone,
  Search,
  SkipForward,
  Star,
  Users,
  Wallet,
} from "lucide-react";
import { useEffect, useState } from "react";
import { download } from "../io";
import { safeMedia, type Item } from "../schema";
import {
  Add,
  Avatar,
  Empty,
  groupItems,
  Header,
  Media,
  meta,
  Row,
  SearchBox,
  Tabs,
  useContent,
  type Props,
} from "./shared";
export function PhoneSkin(p: Props) {
  const { tab, setTab, q, setQ, items } = useContent(p, "最近通话");
  const [digits, setDigits] = useState(""),
    [call, setCall] = useState("");
  const list = tab === "收藏" ? items.filter((i) => i.favorite) : items;
  return (
    <div className="catalog-skin native-phone">
      <Header p={p} />
      <div className="catalog-scroll">
        <h1>{tab}</h1>
        {tab === "拨号键盘" ? (
          <div className="dialer">
            <output>{digits || "输入号码"}</output>
            <div>
              {["1", "2", "3", "4", "5", "6", "7", "8", "9", "*", "0", "#"].map(
                (k) => (
                  <button key={k} onClick={() => setDigits((s) => s + k)}>
                    {k}
                    <small>
                      {
                        (
                          {
                            "2": "ABC",
                            "3": "DEF",
                            "4": "GHI",
                            "5": "JKL",
                            "6": "MNO",
                            "7": "PQRS",
                            "8": "TUV",
                            "9": "WXYZ",
                          } as Record<string, string>
                        )[k]
                      }
                    </small>
                  </button>
                ),
              )}
            </div>
            <button
              className="dial-call"
              disabled={!digits}
              aria-label="模拟拨号"
              onClick={() => {
                setCall(digits);
                const i = items.find((i) => meta(i, "number") === digits);
                if (i) p.onRead(i.id);
              }}
            >
              <Phone size={24} />
            </button>
            <button onClick={() => setDigits((s) => s.slice(0, -1))}>
              删除
            </button>
          </div>
        ) : (
          <>
            <SearchBox value={q} set={setQ} />
            {list.map((i) => (
              <button
                className={`call-row ${meta(i, "status") === "未接" ? "missed" : ""}`}
                key={i.id}
                onClick={() => p.onItem(i)}
              >
                <Phone size={17} />
                <span>
                  <strong>{i.title}</strong>
                  <small>
                    {meta(i, "number", i.sender)} ·{" "}
                    {meta(i, "status", "通话记录")}
                  </small>
                </span>
                <time>{i.time.slice(5, 10)}</time>
              </button>
            ))}
            <Empty items={list} />
          </>
        )}
      </div>
      <Tabs
        tabs={["收藏", "最近通话", "通讯录", "拨号键盘"]}
        value={tab}
        set={setTab}
        icons={[<Star />, <Clock />, <Users />, <Grid />]}
      />
      {call && (
        <div className="virtual-call">
          <small>虚拟通话</small>
          <Avatar name={call} />
          <h2>{call}</h2>
          <p>这是作品内的通话模拟</p>
          <button aria-label="挂断" onClick={() => setCall("")}>
            <Phone />
          </button>
        </div>
      )}
    </div>
  );
}
export function ContactsSkin(p: Props) {
  const { q, setQ, items } = useContent(p, "所有联系人");
  return (
    <div className="catalog-skin native-contacts">
      <Header p={p} />
      <div className="catalog-scroll">
        <h1>通讯录</h1>
        <SearchBox value={q} set={setQ} />
        <button
          className="contact-self"
          onClick={() => {
            if (items[0]) p.onItem(items[0]);
            else if (p.creator) p.onAdd();
          }}
        >
          <Avatar name={p.owner ?? "我"} />
          <span>
            <strong>{p.owner ?? "我的名片"}</strong>
            <small>我的名片</small>
          </span>
        </button>
        {groupItems(items, "所有联系人").map((g) => (
          <section key={g}>
            <h4 className="native-section">{g}</h4>
            {items
              .filter((i) => (i.folder || "所有联系人") === g)
              .sort((a, b) => a.title.localeCompare(b.title, "zh-CN"))
              .map((i) => (
                <Row
                  key={i.id}
                  item={i}
                  onItem={p.onItem}
                  leading={<Avatar name={i.title} />}
                />
              ))}
          </section>
        ))}
        <Empty items={items} />
      </div>
    </div>
  );
}
export function PhotosSkin(p: Props) {
  const { tab, setTab, q, setQ, items } = useContent(p, "图库");
  const [album, setAlbum] = useState("");
  const list =
    tab === "收藏"
      ? items.filter((i) => i.favorite)
      : album
        ? items.filter((i) => (i.folder || "未分类") === album)
        : items;
  return (
    <div className="catalog-skin native-photos">
      <Header p={p} />
      <div className="catalog-scroll">
        <h1>{album || tab}</h1>
        {tab === "相簿" && !album ? (
          <div className="album-grid">
            {groupItems(items, "未分类").map((g) => (
              <button key={g} onClick={() => setAlbum(g)}>
                <Media
                  item={items.find((i) => (i.folder || "未分类") === g)!}
                />
                <strong>{g}</strong>
                <small>
                  {items.filter((i) => (i.folder || "未分类") === g).length} 项
                </small>
              </button>
            ))}
          </div>
        ) : (
          <>
            <SearchBox value={q} set={setQ} />
            <div className="photo-mosaic">
              {list.map((i) => (
                <button
                  aria-label={`查看${i.title}`}
                  key={i.id}
                  onClick={() => p.onItem(i)}
                >
                  <Media item={i} />
                  {i.favorite && <Heart size={12} fill="white" />}
                </button>
              ))}
            </div>
            <p className="media-count">{list.length} 个项目</p>
          </>
        )}
        <Empty items={list} />
      </div>
      <Tabs
        tabs={["图库", "相簿", "收藏"]}
        value={tab}
        set={(t) => {
          setTab(t);
          setAlbum("");
        }}
        icons={[<Image />, <Folder />, <Heart />]}
      />
    </div>
  );
}
export function CameraSkin(p: Props) {
  const [mode, setMode] = useState("照片"),
    [index, setIndex] = useState(0);
  const frames = p.items.filter((i) =>
    mode === "视频" ? i.kind === "video" : i.kind !== "video",
  );
  const frame = frames[index % Math.max(frames.length, 1)];
  return (
    <div className="catalog-skin native-camera">
      <Header p={p} />
      <div className="camera-top">
        <span>闪光灯关闭</span>
        <span>{mode === "视频" ? "HD · 30" : "4:3"}</span>
      </div>
      <div className="camera-view">
        {frame ? <Media item={frame} /> : <p>未设置取景画面</p>}
        <div className="camera-grid" />
      </div>
      <div className="camera-mode">
        {["视频", "照片"].map((m) => (
          <button
            className={mode === m ? "selected" : ""}
            key={m}
            onClick={() => {
              setMode(m);
              setIndex(0);
            }}
          >
            {m}
          </button>
        ))}
      </div>
      <div className="camera-controls">
        <button
          aria-label="查看上一画面"
          disabled={!frames.length}
          onClick={() => setIndex((i) => (i + 1) % frames.length)}
        >
          <Image size={24} />
        </button>
        <button
          className="camera-shutter"
          aria-label={p.creator ? "编辑拍摄画面" : "查看拍摄内容"}
          disabled={!p.creator && !frame}
          onClick={() => (p.creator ? p.onAdd() : frame && p.onItem(frame))}
        >
          <span />
        </button>
        <button
          aria-label="切换取景画面"
          disabled={frames.length < 2}
          onClick={() => setIndex((i) => i + 1)}
        >
          <Camera size={24} />
        </button>
      </div>
      <small className="camera-caption">作者设置的虚构取景内容</small>
    </div>
  );
}
export function SafariSkin(p: Props) {
  const [q, setQ] = useState(""),
    [tab, setTab] = useState("书签"),
    [selectedQuery, setSelectedQuery] = useState(""),
    [selectedResult, setSelectedResult] = useState<number | null>(null);
  const items = p.items
    .filter((i) => (i.title + i.body + meta(i, "url")).toLowerCase().includes(q.toLowerCase()))
    .filter((i) => tab === "书签" ? i.favorite || i.folder !== "历史记录" : i.folder === "历史记录");
  const searchResults = (query: string): {title:string; description:string; site:string; domain:string; body:string[]}[] => {
    if (query.includes("赏樱")) return [
      {title:"首尔赏樱路线：汝矣岛、石村湖和南山",description:"整理首尔春季赏樱地点、交通方式与散步路线。想看樱花和汉江景色，可以从汝矣岛一带开始。",site:"首尔旅行笔记",domain:"seoul-guide.kr",body:["汝矣岛汉江公园：沿着汉江步道散步，花期时可以看到成排樱花。","石村湖：环湖步道适合拍照，傍晚湖面和城市灯光很漂亮。","南山公园：适合安排一段轻松的登山散步，出发前可以查看花期和天气。"]},
      {title:"汝矣岛汉江公园樱花散步攻略",description:"交通、赏花路线和野餐建议，适合安排半天的春日行程。",site:"周末去哪儿",domain:"weekend-note.kr",body:["建议搭乘地铁前往，花期周末人流较多。","可以准备野餐垫和饮料，傍晚留下来看汉江夜景。"]},
      {title:"首尔适合拍樱花照片的地方",description:"从首尔林到南山步道，收集适合散步和拍照的赏花地点。",site:"城市散步指南",domain:"walk-in-seoul.com",body:["首尔林适合慢慢散步，也有不少可以取景的林荫路。","花期每年略有不同，出门前最好确认当地最新花况。"]}
    ];
    if (query.includes("泡菜汤")) return [
      {title:"韩式泡菜汤做法：五花肉豆腐版",description:"用熟成泡菜、五花肉和嫩豆腐煮出浓郁汤底，做法简单，适合配米饭。",site:"韩国家常食谱",domain:"k-food-table.kr",body:["1. 五花肉切片，下锅煸炒至出油。","2. 加入泡菜翻炒约两分钟，让香味出来。","3. 加水，放入豆腐和适量韩式辣酱。","4. 转小火煮约十分钟，尝味后即可上桌。"]},
      {title:"Kimchi jjigae｜经典韩式泡菜锅",description:"泡菜的酸香搭配五花肉，炖煮后汤汁更浓郁。",site:"今天吃什么",domain:"today-meal.kr",body:["使用偏酸的熟成泡菜风味更好。","可以依口味加入洋葱、葱花或金枪鱼。"]},
      {title:"泡菜汤配什么吃？",description:"米饭、煎蛋和简单小菜就能组成一顿舒服的韩式晚餐。",site:"餐桌日记",domain:"table-diary.kr",body:["热腾腾的泡菜汤适合搭配白米饭。","如果泡菜本身很咸，调味时可以少放酱料。"]}
    ];
    if (query.includes("襄阳")) return [
      {title:"首尔出发：襄阳一日游路线",description:"海边散步、当地咖啡馆和海岸风景，安排一日轻旅行。",site:"韩国周末旅行",domain:"weekend-korea.kr",body:["上午从首尔出发，先确认巴士或火车班次。","抵达后可以安排海边散步、竹岛一带和咖啡馆。","回程前预留交通时间，避免把行程排得太紧。"]},
      {title:"襄阳海边旅行准备清单",description:"防晒、墨镜、薄外套和充电宝是海边出行的实用物品。",site:"轻旅行手册",domain:"trip-note.kr",body:["海边风比较大，带一件薄外套会更舒服。","如果计划拍照，可以把日落时间留在行程里。"]},
      {title:"襄阳咖啡馆与海岸散步",description:"沿着海边慢慢走，找一家咖啡馆休息，适合不赶时间的旅行。",site:"沿海慢生活",domain:"coast-life.kr",body:["可以把午餐和咖啡安排在海边附近。","周末出行建议提前确认店铺营业时间。"]}
    ];
    if (query.includes("情侣") || query.includes("江边")) return [
      {title:"首尔汉江公园情侣散步路线",description:"盘浦适合看夜景，汝矣岛适合沿江散步和野餐，选一段路线慢慢走就很好。",site:"首尔约会地图",domain:"date-map.kr",body:["盘浦汉江公园：适合傍晚散步，天气好时可以看城市夜景。","汝矣岛汉江公园：沿江步道比较开阔，适合带饮料散步。","出发前查看天气，晚上记得带一件薄外套。"]},
      {title:"首尔夜景散步：汉江沿岸",description:"日落前出发，沿着江边走到天色变暗，安排一场轻松的夜间约会。",site:"城市夜游指南",domain:"nightwalk.kr",body:["建议选交通方便的公园入口。","可以在散步后去便利店买饮料和小零食。"]},
      {title:"适合两个人的首尔周末约会",description:"汉江野餐、沿江骑行和便利店夜宵，都是轻松又不赶时间的选择。",site:"两个人的周末",domain:"two-weekend.kr",body:["根据天气选择野餐或散步。","如果准备骑行，记得确认租车点和归还时间。"]}
    ];
    if (query.includes("男朋友") || query.includes("生气")) return [
      {title:"惹男朋友生气了怎么哄？先认真沟通",description:"先听听对方为什么不开心，承认自己造成的影响。比起急着解释，真诚道歉并给彼此一点时间更重要。",site:"恋爱关系小指南",domain:"love-note.kr",body:["等双方情绪平稳后再谈发生了什么。","说清楚自己理解到的问题，避免用“但是”把道歉变成辩解。","如果对方需要一点空间，可以约定晚些时候再继续聊。"]},
      {title:"情侣吵架后怎么和好",description:"从自己的感受和需求出发，具体说清楚问题，避免把讨论变成指责。",site:"亲密关系笔记",domain:"relationship-note.kr",body:["先确认对方是否愿意现在沟通。","讨论具体行为，而不是给对方贴标签。","和好之后，也可以一起商量下次遇到类似情况怎么处理。"]},
      {title:"一句真诚的道歉可以怎么说",description:"认真承认影响、表达歉意，并用行动兑现承诺。",site:"好好说话",domain:"say-it-well.kr",body:["可以说：“我知道这件事让你难过了，对不起。我想听听你的感受。”","道歉之后留出时间，让对方回应，不要要求对方马上原谅。"]}
    ];
    return [
      {title:query+"｜相关内容与实用指南",description:"围绕“"+query+"”整理的相关信息、经验分享与实用建议。",site:"搜索精选",domain:"search-notes.kr",body:["先明确自己最想解决的问题，再查看对应的步骤和建议。","不同情况可能需要不同做法，可以结合实际情况判断。"]},
      {title:"关于“"+query+"”的详细指南",description:"从基础信息到实用小贴士，快速了解重点。",site:"生活指南",domain:"daily-guide.kr",body:["这里汇总了相关主题的重点信息。","可以继续修改搜索词，查找更具体的内容。"]},
      {title:"更多经验分享与推荐",description:"看看不同人的经验，挑选适合自己的方案。",site:"经验分享",domain:"community-note.kr",body:["参考不同观点，结合自己的需求选择。"]}
    ];
  };
  const results = selectedQuery ? searchResults(selectedQuery) : [];
  const backToResults = () => setSelectedResult(null);
  return (
    <div className="catalog-skin native-safari">
      <Header p={p} />
      {selectedQuery ? (
        <div className="safari-browser-page">
          <div className="safari-browser-toolbar">
            <button aria-label="返回" onClick={() => selectedResult !== null ? backToResults() : setSelectedQuery("")}><ChevronLeft size={23}/></button>
            <form className="safari-browser-address" onSubmit={(e) => {e.preventDefault(); if(q.trim()){setSelectedQuery(q.trim());setSelectedResult(null);}}}>
              <LockKeyhole size={12}/><input value={q || selectedQuery} onChange={(e)=>setQ(e.target.value)} aria-label="地址或搜索词"/><Search size={15}/>
            </form>
            <button aria-label="更多" onClick={() => {setSelectedQuery("");setSelectedResult(null);setTab("历史记录");}}><MoreHorizontal size={21}/></button>
          </div>
          {selectedResult === null ? (
            <>
              <div className="safari-search-tabs"><span className="active">全部</span><span>图片</span><span>视频</span><span>地图</span><span>新闻</span></div>
              <div className="safari-google-results">
                <div className="safari-results-count">找到与“{selectedQuery}”相关的结果</div>
                {results.map((result,index)=>(
                  <button className="safari-google-result" key={result.title} onClick={()=>setSelectedResult(index)}>
                    <div className="safari-site-line"><span className="safari-favicon">{result.site.slice(0,1)}</span><span><strong>{result.site}</strong><small>{result.domain}</small></span><MoreHorizontal size={15}/></div>
                    <h3>{result.title}</h3><p>{result.description}</p>
                  </button>
                ))}
                <button className="safari-more-results" onClick={()=>setSelectedQuery(selectedQuery+" 推荐")}>查看更多相关结果 <ChevronRight size={15}/></button>
              </div>
            </>
          ) : (
            <div className="safari-article-scroll">
              <div className="safari-article-source"><span className="safari-favicon">{results[selectedResult].site.slice(0,1)}</span><div><strong>{results[selectedResult].site}</strong><small>{results[selectedResult].domain} › 文章</small></div></div>
              <article className="safari-article">
                <h1>{results[selectedResult].title}</h1>
                <div className="safari-article-meta">阅读时间约 3 分钟 · 编辑整理</div>
                <p className="safari-article-intro">{results[selectedResult].description}</p>
                {results[selectedResult].body.map((paragraph,index)=><section key={index}><h2>{index===0?"出行与准备":index===1?"路线与建议":"实用小贴士"}</h2><p>{paragraph}</p></section>)}
                <div className="safari-article-footer">本文为手机剧情中的模拟网页内容</div>
              </article>
              <button className="safari-back-search" onClick={backToResults}><ChevronLeft size={16}/> 返回搜索结果</button>
            </div>
          )}
          <div className="safari-bottom-bar">
            <button aria-label="后退" onClick={() => selectedResult !== null ? backToResults() : setSelectedQuery("")}><ChevronLeft size={21}/></button>
            <button aria-label="前进" onClick={() => {if(selectedResult===null && results.length) setSelectedResult(0);}}><ChevronRight size={21}/></button>
            <button aria-label="分享"><Share size={18}/></button>
            <button aria-label="书签" onClick={() => {setSelectedQuery("");setSelectedResult(null);setTab("书签");}}><Bookmark size={18}/></button>
            <button aria-label="标签页" onClick={() => {setSelectedQuery("");setSelectedResult(null);setTab("历史记录");}}><Grid size={18}/></button>
          </div>
        </div>
      ) : (
        <>
          <div className="catalog-scroll">
            <h1>{tab}</h1>
            <div className={tab === "历史记录" ? "safari-favorites safari-history" : "safari-favorites"}>
              {items.map((i) => (
                <button key={i.id} onClick={() => tab === "历史记录" ? (setSelectedQuery(i.title), setQ(i.title), setSelectedResult(null)) : p.onItem(i)}>
                  <span><Globe size={tab === "历史记录" ? 18 : 28}/></span><strong>{i.title}</strong>
                  {tab === "书签" && <small>{meta(i,"url")}</small>}
                  {tab === "历史记录" && <small><ChevronRight size={15}/></small>}
                </button>
              ))}
            </div>
            <Empty items={items} label="没有匹配的虚构网页"/>
          </div>
          <label className="safari-address"><LockKeyhole size={13}/><input value={q} onChange={(e)=>setQ(e.target.value)} placeholder="搜索或输入虚构网址" aria-label="地址栏" onKeyDown={(e)=>{if(e.key==="Enter"&&q.trim()){setSelectedQuery(q.trim());setSelectedResult(null);}}}/><Search size={16}/></label>
          <Tabs tabs={["书签","历史记录"]} value={tab} set={setTab} icons={[<Globe/>,<Clock/>]}/>
        </>
      )}
    </div>
  );
}
export function NotesSkin(p: Props) {
  const { q, setQ, items } = useContent(p, "备忘录");
  const [folder, setFolder] = useState<string | null>(null);
  const list = folder
    ? items.filter((i) => (i.folder || "备忘录") === folder)
    : items;
  return (
    <div className="catalog-skin native-notes">
      <Header p={p} />
      <div className="catalog-scroll">
        <button className="notes-back" onClick={() => setFolder(null)}>
          <Folder size={17} />
          文件夹
        </button>
        <h1>{folder || "所有备忘录"}</h1>
        <SearchBox value={q} set={setQ} />
        {!folder && (
          <div className="note-folders">
            {groupItems(items, "备忘录").map((g) => (
              <button key={g} onClick={() => setFolder(g)}>
                <Folder size={17} />
                {g}
                <small>
                  {items.filter((i) => (i.folder || "备忘录") === g).length}
                </small>
              </button>
            ))}
          </div>
        )}
        <div className="notes-list">
          {list.map((i) => (
            <button key={i.id} onClick={() => p.onItem(i)}>
              <strong>
                {i.password && <LockKeyhole size={12} />} {i.title}
              </strong>
              <p>
                <time>{i.time.slice(5, 10)}</time>{" "}
                {i.password ? "已锁定的备忘录" : i.body.split("\n")[0]}
              </p>
              <small>{i.folder}</small>
            </button>
          ))}
        </div>
        <Empty items={list} />
      </div>
      <div className="notes-footer">
        <span>{list.length} 则备忘录</span>
        <Add p={p} label="新建备忘录" />
      </div>
    </div>
  );
}
export function CalendarSkin(p: Props) {
  const [month, setMonth] = useState(8),
    [year, setYear] = useState(2026),
    [day, setDay] = useState(1);
  const prefix = `${year}-${String(month + 1).padStart(2, "0")}`;
  const list = p.items.filter((i) =>
    i.time.startsWith(`${prefix}-${String(day).padStart(2, "0")}`),
  );
  const move = (d: number) => {
    const date = new Date(Date.UTC(year, month + d, 1));
    setYear(date.getUTCFullYear());
    setMonth(date.getUTCMonth());
    setDay(1);
  };
  const first = new Date(Date.UTC(year, month, 1)).getUTCDay(),
    days = new Date(Date.UTC(year, month + 1, 0)).getUTCDate();
  return (
    <div className="catalog-skin native-calendar">
      <Header p={p} />
      <div className="catalog-scroll">
        <div className="month-title">
          <button aria-label="上个月" onClick={() => move(-1)}>
            <ChevronLeft />
          </button>
          <h2>
            {year} 年 {month + 1} 月
          </h2>
          <button aria-label="下个月" onClick={() => move(1)}>
            <ChevronRight />
          </button>
        </div>
        <div className="calendar-grid">
          {["日", "一", "二", "三", "四", "五", "六"].map((t) => (
            <small key={t}>{t}</small>
          ))}
          {Array.from({ length: first }, (_, i) => (
            <span key={"blank" + i} />
          ))}
          {Array.from({ length: days }, (_, i) => (
            <button
              className={day === i + 1 ? "selected" : ""}
              key={i}
              onClick={() => setDay(i + 1)}
            >
              {i + 1}
              {p.items.some((x) =>
                x.time.startsWith(
                  `${prefix}-${String(i + 1).padStart(2, "0")}`,
                ),
              ) && <i />}
            </button>
          ))}
        </div>
        <h4 className="native-section">
          {month + 1} 月 {day} 日
        </h4>
        {list.map((i) => (
          <button
            className="calendar-event"
            key={i.id}
            onClick={() => p.onItem(i)}
          >
            <time>{i.time.slice(-5)}</time>
            <div>
              <strong>{i.title}</strong>
              <p>{meta(i, "location", i.body)}</p>
            </div>
          </button>
        ))}
        <Empty items={list} label="当天没有日程" />
        <Add p={p} label="添加日程" />
      </div>
    </div>
  );
}
export function MailSkin(p: Props) {
  const { tab, setTab, q, setQ, items } = useContent(p, "收件箱");
  const list = items.filter(
    (i) =>
      tab === "全部邮件" ||
      i.folder === tab ||
      (tab === "收件箱" &&
        (!i.folder || !["草稿", "已发送"].includes(i.folder))),
  );
  return (
    <div className="catalog-skin native-mail">
      <Header p={p} />
      <div className="mail-folders">
        {["收件箱", "草稿", "已发送", "全部邮件"].map((t) => (
          <button
            key={t}
            className={tab === t ? "selected" : ""}
            onClick={() => setTab(t)}
          >
            {t}
          </button>
        ))}
      </div>
      <div className="catalog-scroll">
        <h1>{tab}</h1>
        <SearchBox value={q} set={setQ} />
        {list.map((i) => (
          <button
            className="mail-preview"
            key={i.id}
            onClick={() => p.onItem(i)}
          >
            <i className={!i.read ? "unread" : ""} />
            <div>
              <strong>{i.sender}</strong>
              <h3>{i.title}</h3>
              <p>{i.body}</p>
            </div>
            <time>{i.time.slice(5, 10)}</time>
          </button>
        ))}
        <Empty items={list} />
      </div>
      <footer className="mail-footer">
        <span>{list.length} 封邮件</span>
        <Add p={p} label="写邮件" />
      </footer>
    </div>
  );
}
export function ClockSkin(p: Props) {
  const { tab, setTab, items } = useContent(p, "闹钟");
  const [enabled, setEnabled] = useSkinState<string[]>(p, "alarms", []),
    [seconds, setSeconds] = useState(0),
    [running, setRunning] = useState(false);
  useEffect(() => {
    if (!running) return;
    const timer = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(timer);
  }, [running]);
  return (
    <div className="catalog-skin native-clock">
      <Header p={p} />
      <div className="catalog-scroll">
        <h1>{tab}</h1>
        {tab === "秒表" ? (
          <div className="stopwatch">
            <output>
              {String(Math.floor(seconds / 60)).padStart(2, "0")}:
              {String(seconds % 60).padStart(2, "0")}
            </output>
            <div>
              <button
                onClick={() => {
                  setSeconds(0);
                  setRunning(false);
                }}
              >
                复位
              </button>
              <button onClick={() => setRunning(!running)}>
                {running ? "暂停" : "开始"}
              </button>
            </div>
          </div>
        ) : (
          items.map((i) => (
            <div className="alarm-row" key={i.id}>
              <button onClick={() => p.onItem(i)}>
                <time>{meta(i, "clock", i.time.slice(-5))}</time>
                <small>
                  {tab === "世界时钟" ? meta(i, "city", i.title) : i.title}
                </small>
              </button>
              {tab === "闹钟" ? (
                <button
                  role="switch"
                  aria-label={`闹钟${i.title}`}
                  aria-checked={enabled.includes(i.id)}
                  className={`native-switch ${enabled.includes(i.id) ? "on" : ""}`}
                  onClick={() =>
                    setEnabled(
                      enabled.includes(i.id)
                        ? enabled.filter((x) => x !== i.id)
                        : [...enabled, i.id],
                    )
                  }
                >
                  <span />
                </button>
              ) : (
                <Clock size={35} />
              )}
            </div>
          ))
        )}
      </div>
      <Tabs
        tabs={["世界时钟", "闹钟", "秒表"]}
        value={tab}
        set={setTab}
        icons={[<Globe />, <Clock />, <Clock />]}
      />
    </div>
  );
}
export function RemindersSkin(p: Props) {
  const { tab, setTab, q, setQ, items } = useContent(p, "全部");
  const [checked, setChecked] = useSkinState<string[]>(p, "checked", []);
  const list =
    tab === "已完成"
      ? items.filter((i) => checked.includes(i.id))
      : items.filter((i) => !checked.includes(i.id));
  return (
    <div className="catalog-skin native-reminders">
      <Header p={p} />
      <div className="catalog-scroll">
        <SearchBox value={q} set={setQ} />
        <div className="reminder-categories">
          {["全部", "已完成"].map((t) => (
            <button key={t} onClick={() => setTab(t)}>
              <Calendar size={22} />
              <strong>
                {t === "全部" ? items.length - checked.length : checked.length}
              </strong>
              <span>{t}</span>
            </button>
          ))}
        </div>
        <h1>{tab}</h1>
        {list.map((i) => (
          <div className="reminder-row" key={i.id}>
            <button
              aria-label={`完成${i.title}`}
              role="checkbox"
              aria-checked={checked.includes(i.id)}
              onClick={() =>
                setChecked(
                  checked.includes(i.id)
                    ? checked.filter((x) => x !== i.id)
                    : [...checked, i.id],
                )
              }
            >
              <CheckCircle size={21} />
            </button>
            <button onClick={() => p.onItem(i)}>
              <strong>{i.title}</strong>
              <small>
                {i.time} · {i.folder}
              </small>
            </button>
          </div>
        ))}
        <Add p={p} label="新提醒事项" />
      </div>
    </div>
  );
}
export function FilesSkin(p: Props) {
  const { tab, setTab, q, setQ, items } = useContent(p, "最近项目");
  const [folder, setFolder] = useState("");
  const list = folder
    ? items.filter((i) => (i.folder || "我的iPhone") === folder)
    : items;
  return (
    <div className="catalog-skin native-files">
      <Header p={p} />
      <div className="catalog-scroll">
        <h1>{folder || tab}</h1>
        <SearchBox value={q} set={setQ} />
        {tab === "浏览" && !folder ? (
          <div className="file-folders">
            {groupItems(items, "我的iPhone").map((g) => (
              <button key={g} onClick={() => setFolder(g)}>
                <Folder size={45} />
                <strong>{g}</strong>
              </button>
            ))}
          </div>
        ) : (
          <div className="file-grid">
            {list.map((i) => (
              <div key={i.id}>
                <button onClick={() => p.onItem(i)}>
                  {i.media ? <Media item={i} /> : <FileText size={49} />}
                  <strong>{i.title}</strong>
                  <small>
                    {meta(i, "extension", "文件")} ·{" "}
                    {meta(i, "size", i.time.slice(0, 10))}
                  </small>
                </button>
                <button
                  aria-label={`下载${i.title}文本`}
                  onClick={() =>
                    download(
                      new Blob([i.body], { type: "text/plain" }),
                      `${i.title}.txt`,
                    )
                  }
                >
                  <Download size={13} />
                </button>
              </div>
            ))}
          </div>
        )}
        <Empty items={list} />
      </div>
      <Tabs
        tabs={["最近项目", "浏览"]}
        value={tab}
        set={(t) => {
          setTab(t);
          setFolder("");
        }}
        icons={[<Clock />, <Folder />]}
      />
    </div>
  );
}
export function MusicSkin(p: Props) {
  const { tab, setTab, items } = useContent(p, "资料库");
  const [song, setSong] = useTrack(p, items);
  return (
    <div className="catalog-skin native-music">
      <Header p={p} />
      <div className="catalog-scroll">
        <h1>{tab}</h1>
        {tab === "歌单" ? (
          <div className="music-albums">
            {groupItems(items, "我的音乐").map((g) => (
              <button
                key={g}
                onClick={() => {
                  const i = items.find((i) => (i.folder || "我的音乐") === g);
                  if (i) setSong(i);
                }}
              >
                <Music size={51} />
                <strong>{g}</strong>
              </button>
            ))}
          </div>
        ) : (
          items.map((i) => (
            <button
              className="music-track"
              key={i.id}
              onClick={() => {
                setSong(i);
              }}
            >
              <span
                aria-hidden="true"
                style={{ width: 42, height: 42, borderRadius: 7, display: "grid", placeItems: "center", overflow: "hidden", flexShrink: 0, background: "linear-gradient(135deg, #f5b5ca, #b8a8f8, #4c4c68)" }}
              >
                {safeMedia(meta(i, "coverUrl")) ? (
                  <img src={safeMedia(meta(i, "coverUrl"))} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                ) : (
                  <Music size={20} color="white" />
                )}
              </span>
              <span>
                <strong>{i.title}</strong>
                <small>
                  {i.sender} · {meta(i, "album")}
                </small>
              </span>
              <span>{meta(i, "duration")}</span>
            </button>
          ))
        )}
        <Empty items={items} />
      </div>
      {song && (
        <div className="native-now-playing">
          <button onClick={() => p.onItem(song)}>
            <Music size={20} />
            {song.title}
          </button>
          {song.kind === "audio" && safeMedia(song.media || meta(song, "audioUrl")) ? (
            <AudioPlayer p={p} item={{ ...song, media: song.media || meta(song, "audioUrl") }} />
          ) : (
            <button onClick={() => p.onItem(song)}>查看歌曲内容</button>
          )}
          <button
            aria-label="下一首"
            onClick={() =>
              setSong(
                items[
                  (items.findIndex((i) => i.id === song.id) + 1) % items.length
                ],
              )
            }
          >
            <SkipForward size={18} />
          </button>
        </div>
      )}
      <Tabs
        tabs={["资料库", "歌单"]}
        value={tab}
        set={setTab}
        icons={[<Music />, <Folder />]}
      />
    </div>
  );
}
function LocationMap({
  items,
  onItem,
  find = false,
}: {
  items: Item[];
  onItem: (i: Item) => void;
  find?: boolean;
}) {
  return (
    <div className={`fiction-map ${find ? "find-map" : ""}`}>
      <svg viewBox="0 0 300 300" aria-label="原创虚构地图">
        <rect width="300" height="300" fill="#e4e5d8" />
        {[35, 100, 190, 260].map((n) => (
          <path
            key={n}
            d={`M0 ${n} H300 M${n} 0 V300`}
            stroke="#fff"
            strokeWidth="11"
          />
        ))}
        <path
          d="M20 0 Q190 110 120 300"
          stroke="#b6d8df"
          strokeWidth="24"
          fill="none"
        />
        <rect x="205" y="112" width="42" height="65" rx="7" fill="#bdcfac" />
      </svg>
      {items.map((i, n) => (
        <button
          key={i.id}
          aria-label={`地图位置${i.title}`}
          className="map-pin"
          style={{
            left: `${Math.max(5, Math.min(90, Number(meta(i, "x", String(20 + ((n * 17) % 65))))))}%`,
            top: `${Math.max(8, Math.min(80, Number(meta(i, "y", String(25 + ((n * 13) % 50))))))}%`,
          }}
          onClick={() => onItem(i)}
        >
          {find ? <Avatar name={i.title} /> : <MapPin size={24} />}
        </button>
      ))}
    </div>
  );
}
export function MapsSkin(p: Props) {
  const { q, setQ, items } = useContent(p, "地点");
  return (
    <div className="catalog-skin native-maps">
      <Header p={p} />
      <LocationMap items={items} onItem={p.onItem} />
      <div className="map-sheet">
        <SearchBox value={q} set={setQ} placeholder="搜索虚构地点" />
        <div className="map-places">
          {items.map((i) => (
            <Row key={i.id} item={i} onItem={p.onItem} leading={<MapPin />} />
          ))}
        </div>
      </div>
    </div>
  );
}
export function WalletSkin(p: Props) {
  const [selected, setSelected] = useState("");
  const cards = p.items.filter((i) => i.folder !== "交易"),
    transactions = p.items.filter((i) => i.folder === "交易");
  return (
    <div className="catalog-skin native-wallet">
      <Header p={p} />
      <div className="catalog-scroll">
        <h1>钱包</h1>
        <div className="wallet-stack">
          {cards.map((i, n) => (
            <button
              key={i.id}
              className={selected === i.id ? "selected" : ""}
              style={{
                background: ["#252d38", "#716456", "#4a655d", "#735e6b"][n % 4],
              }}
              onClick={() => {
                setSelected(i.id);
                p.onItem(i);
              }}
            >
              <strong>{i.title}</strong>
              <span>{meta(i, "number", "••••")}</span>
              <small>{meta(i, "amount", i.sender)}</small>
            </button>
          ))}
        </div>
        <h4 className="native-section">交易记录</h4>
        {transactions.map((i) => (
          <Row key={i.id} item={i} onItem={p.onItem} leading={<Wallet />}>
            <strong>{meta(i, "amount")}</strong>
          </Row>
        ))}
        <Empty items={p.items} />
      </div>
    </div>
  );
}
export function FindSkin(p: Props) {
  const { tab, setTab, items } = useContent(p, "设备");
  const list = items.filter((i) =>
    tab === "设备" ? i.folder !== "人物" : i.folder === "人物",
  );
  return (
    <div className="catalog-skin native-find">
      <Header p={p} />
      <LocationMap items={list} onItem={p.onItem} find />
      <div className="find-sheet">
        <h2>{tab}</h2>
        {list.map((i) => (
          <Row
            key={i.id}
            item={i}
            onItem={p.onItem}
            leading={<Avatar name={i.title} />}
          >
            {meta(i, "status", "位置记录")}
          </Row>
        ))}
        <Empty items={list} />
      </div>
      <Tabs
        tabs={["人物", "设备"]}
        value={tab}
        set={setTab}
        icons={[<Users />, <MapPin />]}
      />
    </div>
  );
}
