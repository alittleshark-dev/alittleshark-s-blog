/* ============================================================
   1. 全局变量
   ============================================================ */

// 导航按钮
const home       = document.getElementById("home");
const archive    = document.getElementById("archive");
const retreated  = document.getElementById("retreated");
const photohub   = document.getElementById("photos");
const friendship = document.getElementById("friendship");

// Shell 窗口与输入框
const shell   = document.getElementById("shell");
var   cmdline = document.getElementById("shell-cmd");

// 当前目录与命令历史
var dir          = "home";
var cmdHistory   = [];
var historyIndex = -1;

// 分页配置
const PAGE_SIZE   = 6;   // 每页显示几个
let   archivePage = 1;   // 文章当前页
let   friendPage  = 1;   // 友链当前页

// 相册图片数量
const photonum = 3;

// 动画锁
let isAnimating = false;


/* ============================================================
   2. 数据源
   ============================================================ */

// 朋友信息
const friendsData = [
    {
        name: "Albert Kilonova's blog",
        description: "一只普通且平凡的小狼",
        avatar: "https://alkilo.top/favicon.ico",
        url: "https://alkilo.top/"
    },
    {
        name: "Duo 云站",
        description: "MathForest官方🌲 | 程序及数学可视化✨",
        avatar: "https://www.mduo.cloud/elaina_q.jpg",
        url: "https://www.mduo.cloud/"
    },
    {
        name: "枕的小屋",
        description: "YxPil 的个人博客",
        avatar: "https://yxpil.com/uploads/stickers/emoji-21-cutesy-20261001105730298.png",
        url: "https://yxpil.com/"
    },
    {
        name: "nhir",
        description: "用一切去守护那属于我、却脆弱的四方晶系。",
        avatar: "https://wy.ci/file/nhirsama.png",
        url: "https://wy.ci"
    },
    {
        name: "SQY的个人主页",
        description: "🎂 2010.04.19 | 🧠 ENTP一枚～ | ❤️ 喜欢数学. 爱你😘",
        avatar: "https://upload-static.saobby.com/static/upload/zAC4gHRwCLILYOQd.png",
        url: "https://sqy419.axolotlpower.com/"
    },
    {
        name: "vingturbo",
        description: "一个网站",
        avatar: "https://vingturbo.pages.dev/favicon.png",
        url: "https://vingturbo.pages.dev/",
        backupurl: "https://vingturbo.github.io/web-pages/main.html",
    },
    {
        name: "北浅_awa",
        description: "",
        avatar: "./images/beiqian.jpg",
        url: "https://me.beiqian.fun",
    },
    {
        name: "小恐龙",
        description: "",
        avatar: "",
        url: "https://www.konglong.ink/"
    },
    {
        name: "mail_set的铺子",
        description: "批量出售低脂文章www",
        avatar: "https://www.mailset.top/img/favicon.png",
        url: "https://www.mailset.top"
    },
    {
        name: "小世界中转站",
        description: "我不喜欢这个世界但我|任然满怀热情",
        avatar: "https://shijieheping.top/tupian/169959361.jpg",
        url: "https://shijieheping.top/"
    },
    {
        name: "Clover Yan 的小屋",
        description: "生命是灰色的，理论之树常青。",
        avatar: "https://cloveryan.com/favicon.png",
        url: "https://cloveryan.com/"
    }
];

// 文章信息
const archives = [
    {
        title: "Asm: 入门",
        url: "./archive/asm/",
        date: "26-9-23",
        tags: ["汇编语言"]
    },
    {
        title: "Asm: 第一章 通用寄存器",
        url: "./archive/asm/register/",
        date: "26-9-24",
        tags: ["汇编语言"]
    },
    {
        title: "Asm: 第二章 基础指令",
        url: "./archive/asm/instr/",
        date: "26-9-28",
        tags: ["汇编语言"]
    },
    {
        title: "Hello World!",
        url: "./archive/hello/",
        date: "26-9-18",
        tags: ["hello world"]
    },
];


/* ============================================================
   3. 通用函数
   ============================================================ */

/**
 * 渲染分页条
 * @param {HTMLElement} container 要插入的父容器
 * @param {number} total      总条数
 * @param {number} current    当前页（从 1 开始）
 * @param {number} pageSize   每页条数
 * @param {function} onPage   点击页码时的回调，参数是新页码
 */
function renderPager(container, total, current, pageSize, onPage) {
    const totalPages = Math.ceil(total / pageSize);
    if (totalPages <= 1) return;   // 只有一页就不显示

    const pager = document.createElement("div");
    pager.className = "pager chage-in-page";

    // 生成单个按钮
    const makeBtn = (text, page, disabled, active) => {
        const btn = document.createElement("span");
        btn.className = "pager-btn";
        if (active)   btn.classList.add("active");
        if (disabled) btn.classList.add("disabled");
        btn.textContent = text;
        if (!disabled && !active) {
            btn.onclick = () => onPage(page);
        }
        return btn;
    };

    // 上一页
    pager.appendChild(makeBtn("上一页", current - 1, current === 1, false));

    // 页码（简单版：全部显示；页多了可以省略中间）
    for (let i = 1; i <= totalPages; i++) {
        pager.appendChild(makeBtn(String(i), i, false, i === current));
    }

    // 下一页
    pager.appendChild(makeBtn("下一页", current + 1, current === totalPages, false));

    container.appendChild(pager);
}

/**
 * 整页切换：先让旧内容滑出，再渲染新内容
 */
function switchPage(newTitle, renderCallback) {
    if (isAnimating) return;
    isAnimating = true;

    const container   = document.getElementById("page-container");
    const oldElements = Array.from(container.children);

    oldElements.forEach(el => el.classList.add("chage-out-page"));

    setTimeout(() => {
        oldElements.forEach(el => el.remove());

        renderCallback();

        document.title  = newTitle;
        isAnimating     = false;
    }, 500);
}


/* ============================================================
   4. 页面渲染
   ============================================================ */

/* ---------- 首页 ---------- */
function chhome() {
    dir = "home";
    switchPage("小鲨鱼的主页", () => {
        const container = document.getElementById("page-container");

        const main = document.createElement("main");
        main.id        = "section-main";
        main.className = "card chage-in-page";
        main.innerHTML = `
            <div class="intro-text">
                <p>你好,我是一条小鲨!<br>欢迎来到我的海域!</p>
            </div>
            <div class="intro-avatar">
                <img src="./images/icon.jpg" alt="小鲨头像" style="width: 100px; height: 100px; border-radius: 10px;">
            </div>`;

        const about = document.createElement("section");
        about.id        = "section-about";
        about.className = "card chage-in-page";
        about.innerHTML = `
        <h3>关于我</h3>
        <p>一个学生, 中专在读, 平时喜欢玩玩游戏, 搞搞音乐
        </p>
        `;

        const skill = document.createElement("section");
        skill.id        = "section-skill";
        skill.className = "card chage-in-page";
        skill.innerHTML = `
        <h3>会的不多</h3>
            <img src="https://skillicons.dev/icons?i=python,cpp,arch,java,dart" alt="技能" style="height:40px;">
        <h3>在学</h3>
            <img src="https://skillicons.dev/icons?i=java,cpp,rust,typescript,lua,dart,kotlin" alt="正在学" style="height:40px;">
        `;

        const hobby = document.createElement("section");
        hobby.id        = "section-hobby";
        hobby.className = "card chage-in-page";
        hobby.innerHTML = `<span>♥️</span><p>编程、音乐</p>`;

        const birth = document.createElement("section");
        birth.id        = "brith";
        birth.className = "card chage-in-page";
        birth.innerHTML = `<span>🎂</span><p>2/17</p>`;

        const frag = document.createDocumentFragment();
        frag.append(main, about, skill, hobby, birth);
        container.appendChild(frag);
    });
}

/* ---------- 文章页 ---------- */
function charchive() {
    dir = "archive";
    switchPage("小鲨的文章", () => {
        const container = document.getElementById("page-container");

        // 标签总览栏
        const allTags = [...new Set(archives.flatMap(a => a.tags || []))];
        const tagBar  = document.createElement("section");
        tagBar.className = "card chage-in-page";
        tagBar.innerHTML = `
            <div class="tag-overview">
                <span class="tag-filter active" data-tag="">全部</span>
                ${allTags.map(t => `<span class="tag-filter" data-tag="${t}">#${t}</span>`).join("")}
            </div>
        `;
        container.appendChild(tagBar);

        // 分页切片
        const start     = (archivePage - 1) * PAGE_SIZE;
        const pageItems = archives.slice(start, start + PAGE_SIZE);

        pageItems.forEach(archive => {
            const card = document.createElement("section");
            card.className    = "card chage-in-page archive-card";
            card.dataset.tags = (archive.tags || []).join(",");
            card.innerHTML    = `
                <div class="archive-tags">
                    ${(archive.tags || []).map(t => `<span class="tag">#${t}</span>`).join("")}
                </div>
                <div class="archive-line">
                    <h3>${archive.title}</h3>
                    <p>${archive.date}</p>
                </div>
            `;
            card.style.cursor = "pointer";
            card.onclick      = () => window.open(archive.url, "_blank");

            // 点击标签 → 触发对应筛选
            card.querySelectorAll(".tag").forEach(el => {
                el.style.cursor = "pointer";
                el.onclick = (e) => {
                    e.stopPropagation();
                    const tag    = el.textContent.slice(1);
                    const filter = document.querySelector(`.tag-filter[data-tag="${tag}"]`);
                    if (filter) filter.click();
                };
            });

            container.appendChild(card);
        });

        // 分页条
        renderPager(container, archives.length, archivePage, PAGE_SIZE, (p) => {
            archivePage = p;
            charchive();
        });

        // 筛选逻辑（只作用于当前页）
        document.querySelectorAll(".tag-filter").forEach(el => {
            el.onclick = () => {
                const tag = el.dataset.tag;

                // 再点一次已激活的非“全部”标签 → 回到“全部”
                if (el.classList.contains("active") && tag !== "") {
                    document.querySelector('.tag-filter[data-tag=""]').click();
                    return;
                }

                document.querySelectorAll(".tag-filter").forEach(x => x.classList.remove("active"));
                el.classList.add("active");

                document.querySelectorAll(".archive-card").forEach(card => {
                    const cardTags = card.dataset.tags.split(",");
                    const show     = !tag || cardTags.includes(tag);
                    card.style.display = show ? "" : "none";
                });
            };
        });
    });
}

/* ---------- 归档页（时间轴） ---------- */
function chretreated() {
    dir = "retreated";
    switchPage("过去的文章", () => {
        const container = document.getElementById("page-container");

        const card = document.createElement("section");
        card.className = "card chage-in-page";
        card.innerHTML = `
            <div style="padding: 20px;">
                <h2 style="margin: 0 0 16px;">归档</h2>
                <div class="timeline">
                    ${archives.map(a => `
                        <div class="timeline-item" data-url="${a.url}">
                            <div class="timeline-dot"></div>
                            <div class="timeline-content">
                                <h3>${a.title}</h3>
                                <p>${a.date} ${(a.tags || []).map(t => `<span class="tag">#${t}</span>`).join("")}</p>
                            </div>
                        </div>
                    `).join("")}
                </div>
            </div>
        `;
        container.appendChild(card);

        // 点击跳转
        card.querySelectorAll(".timeline-item").forEach(el => {
            el.style.cursor = "pointer";
            el.onclick      = () => window.open(el.dataset.url, "_blank");
        });
    });
}

/* ---------- 相册页 ---------- */
function chphotohub() {
    dir = "photos";
    switchPage("好看的图片", () => {
        const container = document.getElementById("page-container");

        const card = document.createElement("section");
        card.id        = "section-gallery";
        card.className = "card chage-in-page";

        let html = "";
        for (let i = 1; i <= photonum; i++) {
            html += `<div class="photo"><img src="./images/photohub/${i}.png" alt="${i}.png"></div>`;
        }
        card.innerHTML = html;

        card.style.display             = "grid";
        card.style.gridTemplateColumns = "repeat(auto-fill, minmax(160px, 1fr))";
        card.style.gap                 = "12px";
        card.style.padding             = "12px";

        card.querySelectorAll(".photo").forEach((el) => {
            el.style.cursor = "pointer";
            el.onclick      = () => window.open(el.querySelector("img").src, "_blank");
        });

        container.appendChild(card);
    });
}

/* ---------- 朋友圈页 ---------- */
function chfirendship() {
    dir = "friendship";
    switchPage("小鲨的朋友圈~", () => {
        const container = document.getElementById("page-container");

        // 分页切片
        const start     = (friendPage - 1) * PAGE_SIZE;
        const pageItems = friendsData.slice(start, start + PAGE_SIZE);

        pageItems.forEach(friend => {
            const card = document.createElement("section");
            card.id        = "section-friend";
            card.className = "card chage-in-page";

            if (friend.avatar != "") {
                card.innerHTML = `
                    <img src="${friend.avatar}" alt="${friend.name}" style="width:60px; height:60px; border-radius:50%; margin-bottom:10px;">
                    <h3>${friend.name}</h3>
                    <p>${friend.description}</p>
                `;
            } else {
                card.innerHTML = `
                    <h3>${friend.name}</h3>
                    <p>${friend.description}</p>
                `;
            }

            card.style.cursor = "pointer";
            card.onclick      = () => window.open(friend.url, "_blank");

            container.appendChild(card);
        });

        // 分页条
        renderPager(container, friendsData.length, friendPage, PAGE_SIZE, (p) => {
            friendPage = p;
            chfirendship();
        });
    });
}


/* ============================================================
   5. Shell：ls / tree
   ============================================================ */

function ls(dir) {
    if (dir === "home")       return "archive  friendship  photos  retreated";
    if (dir === "archive")    return archives.map(a => a.title).join("\n");
    if (dir === "friendship") return friendsData.map(f => f.name).join("\n");
    if (dir === "retreated")  return archives.map(a => a.title).join("\n");

    if (dir === "photos") {
        let out = [];
        for (let i = 1; i <= photonum; i++) out.push(i + ".png");
        return out.join("\n");
    }

    return "未知目录";
}

function tree(dir) {
    if (dir === "home") {
        return [
            "home",
            "├── archive/",
            "│   ├── Asm | 第二章 基础指令(待修订)",
            "│   ├── Asm | 第一章 寄存器(待修订)",
            "│   ├── Asm入门",
            "│   └── Hello World!",
            "├── friendship/",
            friendsData.map((f, i) => {
                const isLast = i === friendsData.length - 1;
                return `│   ${isLast ? "└── " : "├── "}${f.name}`;
            }).join("\n"),
            "├── photos/",
            Array.from({ length: photonum }, (_, i) => {
                const isLast = i === photonum - 1;
                return `│   ${isLast ? "└── " : "├── "}${i + 1}.png`;
            }).join("\n"),
            "└── retreated/",
            archives.map((a, i) => {
                const isLast = i === archives.length - 1;
                return `    ${isLast ? "└── " : "├── "}${a.title}`;
            }).join("\n"),
        ].join("\n");
    }

    if (dir === "archive" || dir === "retreated") {
        const lines = [dir + "/"];
        archives.forEach((a, i) => {
            const isLast = i === archives.length - 1;
            lines.push(`${isLast ? "└── " : "├── "}${a.title}`);
        });
        return lines.join("\n");
    }

    if (dir === "friendship") {
        const lines = ["friendship/"];
        friendsData.forEach((f, i) => {
            const isLast = i === friendsData.length - 1;
            lines.push(`${isLast ? "└── " : "├── "}${f.name}`);
        });
        return lines.join("\n");
    }

    if (dir === "photos") {
        const lines = ["photos/"];
        for (let i = 1; i <= photonum; i++) {
            const isLast = i === photonum;
            lines.push(`${isLast ? "└── " : "├── "}${i}.png`);
        }
        return lines.join("\n");
    }

    return "未知目录";
}


/* ============================================================
   6. 导航按钮绑定
   ============================================================ */

home.addEventListener("click", (e) => {
    e.preventDefault();
    if (document.title === "小鲨鱼的主页") return;
    chhome();
});

archive.addEventListener("click", (e) => {
    e.preventDefault();
    if (document.title === "小鲨的文章") return;
    charchive();
});

retreated.addEventListener("click", (e) => {
    e.preventDefault();
    if (document.title === "过去的文章") return;
    chretreated();
});

photohub.addEventListener("click", (e) => {
    e.preventDefault();
    if (document.title === "好看的图片") return;
    chphotohub();
});

friendship.addEventListener("click", (e) => {
    e.preventDefault();
    if (document.title === "小鲨的朋友圈~") return;
    chfirendship();
});


/* ============================================================
   7. Shell 键盘事件
   ============================================================ */
function handleShellKeydown(e) {
    /* ---------- 回车：执行命令 ---------- */
    if (e.key === "Enter") {
        e.preventDefault();
        const cmd = this.value.trim();

        if (cmd) {
            cmdHistory.push(cmd);
            historyIndex = -1;
            const parts = cmd.split(" ");

            /* clear */
            if (parts[0] === "clear") {
                shell.innerHTML = '';
                const initPrompt = document.createElement('span');
                initPrompt.textContent = '[user@WebOS ' + dir + ']$ ';
                initPrompt.className   = 'shell-prompt';
                shell.appendChild(initPrompt);

                const newCmd = document.createElement('input');
                newCmd.id           = 'shell-cmd';
                newCmd.type         = 'text';
                newCmd.autocomplete = 'off';
                shell.appendChild(newCmd);

                cmdline = newCmd;
                newCmd.addEventListener("keydown", handleShellKeydown);
                newCmd.focus();
                return;
            }

            const output = document.createElement('div');
            output.className = 'shell-output';

            /* ls */
            if (parts[0] === "ls") {
                const target = parts.slice(1).join(" ");
                if (!target) {
                    output.textContent = ls(dir) || "";
                } else if (["home", "archive", "friendship", "photos", "retreated"].includes(target)) {
                    output.textContent = ls(target) || "";
                } else {
                    output.textContent = "ls: " + target + ": 没有那个文件或目录";
                }
            }

            /* cd */
            else if (parts[0] === "cd") {
                const target = parts.slice(1).join(" ");
                if (target === ".." || target === "" || target === "home") {
                    if (dir !== "home") {
                        dir = "home";
                        chhome();
                    }
                }
                else if (target === "archive") {
                    dir = "archive";
                    charchive();
                }
                else if (target === "friendship") {
                    dir = "friendship";
                    chfirendship();
                }
                else if (target === "photos") {
                    dir = "photos";
                    chphotohub();
                }
                else if (target === "retreated") {
                    dir = "retreated";
                    chretreated();
                }
                else if (dir === "archive") {
                    const found = archives.find(a => a.title === target);
                    if (found) {
                        window.open(found.url, "_blank");
                        output.textContent = "Open " + found.title + " (" + found.url + ")...";
                    } else {
                        output.textContent = "cd: " + target + ": 没有那个文件或目录";
                    }
                }
                else if (dir === "friendship") {
                    const found = friendsData.find(f => f.name === target);
                    if (found) {
                        window.open(found.url, "_blank");
                        output.textContent = "Open " + found.name + " (" + found.url + ")...";
                    } else {
                        output.textContent = "cd: " + target + ": 没有那个文件或目录";
                    }
                }
                else if (dir === "photos") {
                    const name = target.replace(".png", "");
                    const i    = parseInt(name, 10);
                    if (!isNaN(i) && i >= 1 && i <= photonum) {
                        window.open(`./images/photohub/${i}.png`, "_blank");
                        output.textContent = "Open " + i + ".png";
                    } else {
                        output.textContent = "cd: " + target + ": 没有那个文件或目录";
                    }
                }
                else {
                    const found        = friendsData.find(item => item.name === target);
                    const archivefound = archives.find(item => item.title === target);
                    if (found) {
                        window.open(found.url, "_blank");
                        output.textContent = "Open " + found.name + " (" + found.url + ")...";
                    }
                    else if (archivefound) {
                        window.open(archivefound.url, "_blank");
                        output.textContent = "Open " + archivefound.title + " (" + archivefound.url + ")...";
                    }
                    else {
                        output.textContent = "cd: " + target + ": 没有那个文件或目录";
                    }
                }
            }

            /* help */
            else if (parts[0] === "help") {
                output.textContent = `可用命令列表：
help       显示所有可用命令
clear      清空终端
go         跳转页面（参数：home/archive/friend/photos/retreated）
ls         列出可访问页面
whoami     我是谁
pwd        当前路径
date       当前时间
uptime     运行时长
uname      主机名字
history    显示命令历史
echo       回显参数
hello      打个招呼
ping       测试连接
rm         删除
sudo       不讲不讲
exit       退出终端
tree       树状查看目录
cd         切换目录
chcolor    切换颜色模式`;
            }

            /* chcolor */
            else if (parts[0] == "chcolor") {
                chcolor();
            }

            /* history */
            else if (parts[0] === "history") {
                if (cmdHistory.length === 0) {
                    output.textContent = "暂无历史记录";
                }
                else if (parts[1] === "-c") {
                    cmdHistory   = [];
                    historyIndex = -1;
                    output.textContent = "history clear.";
                }
                else {
                    output.textContent = cmdHistory.map((cmd, i) =>
                        "  " + (i + 1) + "  " + cmd
                    ).join("\n");
                }
            }

            /* tree */
            else if (parts[0] === "tree") {
                output.textContent = tree(dir) || "";
            }

            /* fastfetch */
            else if (parts[0] === "fastfetch") {
                const seconds = Math.floor((Date.now() - (window.startTime || Date.now())) / 1000);
                const h       = Math.floor(seconds / 3600);
                const m       = Math.floor((seconds % 3600) / 60);
                const s       = seconds % 60;
                const uptime  = `${h}h ${m}m ${s}s`;

                output.textContent = `user@WebOS
OS: WebOS
Shell: WebShell-v1.0
Kernel: ${navigator.platform}
Uptime: ${uptime}`;
            }

            /* go：跳转页面 */
            else if (parts[0] === "go") {
                const target = parts[1];

                if (!target) {
                    output.textContent = "go: 缺少参数\n可用页面: home/archive/friend/photos/retreated";
                } else if (target === "home") {
                    chhome();
                    output.textContent = "-> home";
                } else if (target === "archive") {
                    charchive();
                    output.textContent = "-> " + target + "";
                } else if (target === "friends") {
                    chfirendship();
                    output.textContent = "-> friendship";
                } else if (target === "photos") {
                    chphotohub();
                    output.textContent = "-> photos";
                } else if (target === "retreated") {
                    chretreated();
                    output.textContent = "-> retreated";
                } else {
                    output.textContent = "go: " + target + ": 未知页面";
                }
            }

            /* whoami */
            else if (parts[0] === "whoami") {
                output.textContent = "你好!我是小鲨!这里是我的终端!";
            }

            /* pwd */
            else if (parts[0] === "pwd") {
                output.textContent = "/" + dir;
            }

            /* date / time */
            else if (parts[0] === "date" || parts[0] === "time") {
                output.textContent = new Date().toLocaleString();
            }

            /* uptime */
            else if (parts[0] === "uptime") {
                const seconds = Math.floor((Date.now() - (window.startTime || Date.now())) / 1000);
                const h       = Math.floor(seconds / 3600);
                const m       = Math.floor((seconds % 3600) / 60);
                const s       = seconds % 60;
                output.textContent = `up ${h}h ${m}m ${s}s`;
            }

            /* uname */
            else if (parts[0] === "uname") {
                if (parts[1] === "-a") {
                    output.textContent = `${navigator.platform} WebOS WebShell-v1.0 ${navigator.userAgent}`;
                } else {
                    output.textContent = "WebOS";
                }
            }

            /* echo */
            else if (parts[0] === "echo") {
                output.textContent = parts.slice(1).join(" ");
            }

            /* hello */
            else if (parts[0] === "hello") {
                output.textContent = "你好呀！我是一条小鲨!";
            }

            /* ping */
            else if (parts[0] === "ping") {
                const target = parts[1] || "localhost";
                output.textContent = `PING ${target} ...\n来自 ${target} 的回复: 时间<1ms\n来自 ${target} 的回复: 时间<1ms\n来自 ${target} 的回复: 时间<1ms\n--- ${target} ping 统计 ---\n3 个包已发送，3 个已接收，0% 丢失`;
            }

            /* rm */
            else if (parts[0] === "rm") {
                output.textContent = "rm：你确定吗？";
                if (confirm("真的删吗？")) {
                output.textContent = "WebOS: Failed! Please refresh the page or contact the website administrator!";
                }
            }

            /* sudo */
            else if (parts[0] === "sudo") {
                output.textContent = "失败! 请使用root用户尝试!";
            }

            /* exit */
            else if (parts[0] === "exit") {
                output.textContent = "WebOS: Bye~";
            }

            /* 未知命令 */
            else {
                output.textContent = cmd + ": Not mush Command!";
            }

            shell.appendChild(output);
        }

        const newCmd = document.createElement('input');
        newCmd.id           = 'shell-cmd';
        newCmd.type         = 'text';
        newCmd.autocomplete = 'off';

        const promptSpan = document.createElement('span');
        promptSpan.textContent = '[user@WebOS ' + dir + ']$ ';
        promptSpan.className   = 'shell-prompt';

        shell.appendChild(promptSpan);
        shell.appendChild(newCmd);

        cmdline = newCmd;
        newCmd.addEventListener("keydown", handleShellKeydown);

        shell.scrollTop = shell.scrollHeight;
        newCmd.focus();
    }

    /* ---------- Tab：补全 ---------- */
    if (e.key == "Tab") {
        e.preventDefault();

        const commands = [
            "help", "clear", "go", "ls", "video", "open", "whoami", "pwd",
            "date", "time", "uptime", "uname", "history", "banner", "echo",
            "hello", "ping", "rm", "sudo", "exit", "tree", "cd", "chcolor",
            "fastfetch"
        ];
        const input = this.value;

        // 情况 1：补全路径（cd / ls 后面）
        if (input.startsWith("cd ") || input.startsWith("ls ")) {
            const prefix = input.split(" ").slice(1).join(" ");

            let candidates = [];
            if (dir === "home") {
                candidates = ["archive", "friendship", "photos", "retreated", "..", "home"];
            } else if (dir === "archive") {
                candidates = archives.map(a => a.title).concat(["..", "home"]);
            } else if (dir === "friendship") {
                candidates = friendsData.map(f => f.name).concat(["..", "home"]);
            } else if (dir === "photos") {
                candidates = [];
                for (let i = 1; i <= photonum; i++) candidates.push(i + ".png");
                candidates = candidates.concat(["..", "home"]);
            } else if (dir === "retreated") {
                candidates = ["..", "home"];
            }

            const matches = candidates.filter(c => c.startsWith(prefix));
            const cmd     = input.split(" ")[0];

            if (matches.length === 1) {
                this.value = cmd + " " + matches[0];
            } else if (matches.length > 1) {
                const output = document.createElement("div");
                output.className   = "shell-output";
                output.textContent = matches.join("  ");
                shell.appendChild(output);
                shell.scrollTop = shell.scrollHeight;

                const common = matches.reduce((a, b) => {
                    let i = 0;
                    while (i < a.length && i < b.length && a[i] === b[i]) i++;
                    return a.slice(0, i);
                });
                if (common.length > prefix.length) {
                    this.value = cmd + " " + common;
                }
            }
            return;
        }

        // 情况 2：补全命令
        if (!input) return;
        const matches = commands.filter(cmd => cmd.startsWith(input));

        if (matches.length === 1) {
            this.value = matches[0] + " ";
        } else if (matches.length > 1) {
            const output = document.createElement("div");
            output.className   = "output";
            output.textContent = matches.join("  ");
            shell.appendChild(output);
            shell.scrollTop = shell.scrollHeight;

            const common = matches.reduce((a, b) => {
                let i = 0;
                while (i < a.length && i < b.length && a[i] === b[i]) i++;
                return a.slice(0, i);
            });
            if (common.length > input.length) {
                this.value = common;
            }
        }
    }

    /* ---------- 上箭头：历史 ---------- */
    if (e.key === "ArrowUp") {
        e.preventDefault();
        if (cmdHistory.length === 0) return;
        if (historyIndex < cmdHistory.length - 1) {
            historyIndex++;
        }
        this.value = cmdHistory[cmdHistory.length - 1 - historyIndex];
        return;
    }

    /* ---------- 下箭头：历史 ---------- */
    if (e.key === "ArrowDown") {
        e.preventDefault();
        if (historyIndex <= 0) {
            historyIndex = -1;
            this.value = "";
            return;
        }
        historyIndex--;
        this.value = cmdHistory[cmdHistory.length - 1 - historyIndex];
        return;
    }
}

/* ============================================================
   8. 初始化
   ============================================================ */

cmdline.addEventListener("keydown", handleShellKeydown);

window.onload = () => {
    window.startTime = Date.now();

    const promptSpan = document.createElement('span');
    promptSpan.textContent = '[user@WebOS ' + dir + ']$ ';
    promptSpan.className   = 'shell-prompt';
    shell.appendChild(promptSpan);
    shell.appendChild(cmdline);

    chhome();
};