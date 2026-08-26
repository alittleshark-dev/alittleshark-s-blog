// 获取导航按钮
const home = document.getElementById("home");
const archive = document.getElementById("archive");
const firendship = document.getElementById("firendship");
// Shell 窗口
const shell = document.getElementById("shell");
// cmd 输入窗口
var cmdline = document.getElementById("shell-cmd");
// 当前目录
var dir = "home";
var cmdHistory = []; 
var historyIndex = -1;
// 朋友信息
const friendsData = [
        {
            name: "Duo 云站",
            description: "MathForest官方🌲 | 程序及数学可视化✨",
            avatar: "https://www.mduo.cloud/elaina_q.jpg",
            url: "https://www.mduo.cloud/"
        },
        {
            name: "vingturbo",
            description: "一个网站",
            avatar: "https://vingturbo.pages.dev/favicon.png",
            url: "https://vingturbo.pages.dev/",
            backupurl: "https://vingturbo.github.io/web-pages/main.html",
        }
    ];

let isAnimating = false;

/**
 * 【核心通用函数】负责清理旧页面并渲染新内容
 */
function switchPage(newTitle, renderCallback) {
    if (isAnimating) return; 
    isAnimating = true;

    const oldElements = document.querySelectorAll("main, section"); 
    
    oldElements.forEach(el => el.classList.add("chage-out-page"));

    setTimeout(() => {
        oldElements.forEach(el => el.remove());

        renderCallback();

        document.title = newTitle;
        
        isAnimating = false; 
    }, 500); 
}

// ==================== 页面渲染逻辑 ====================

// 首页
function chhome() {
    switchPage("小鲨鱼的主页", () => {
        const main = document.createElement("main");
        main.id = "section-main";
        main.className = "card chage-in-page";
        main.innerHTML = `
            <div class="intro-text">
                <p>你好,我是一条小鲨!<br>欢迎来到我的海域!<br></p>
            </div>
            <div class="intro-avatar">
                <img src="../static/images/icon.jpg" alt="小鲨头像" style="width: 100px; height: 100px; border-radius: 10px;">
            </div>`;

        const hobby = document.createElement("section");
        hobby.id = "section-hobby";
        hobby.className = "card chage-in-page";
        hobby.innerHTML = `<span>♥️</span><p>编程、音乐</p>`;

        const brith = document.createElement("section");
        brith.id = "brith";
        brith.className = "card chage-in-page";
        brith.innerHTML = `<span>🎂</span><p>2/17</p>`;

        // 将新元素依次添加到 body
        document.body.appendChild(main);
        document.body.appendChild(hobby);
        document.body.appendChild(brith);
    });
}

// 文章页
function charchive() {
    switchPage("小鲨的文章", () => {
        const articleSection = document.createElement("section");
        articleSection.id = "section-article";
        articleSection.className = "card chage-in-page";
        articleSection.innerHTML = `<p style="padding:20px;">小鲨的文章...</p>`;

        const end = document.createElement("section");
        end.id = "section-end";
        end.className = "card chage-in-page";
        end.innerHTML = `<p style="padding:20px; opacity:0.6;">---到底了哦---</p>`;

        document.body.appendChild(articleSection);
        document.body.appendChild(end);
    });
}

// 朋友圈页
function chfirendship() {
    switchPage("小鲨的朋友圈~", () => {
        friendsData.forEach(friend => {
            const card = document.createElement("section");
            card.id = "section-friend";
            card.className = "card chage-in-page"; 
            card.innerHTML = `
                <img src="${friend.avatar}" alt="${friend.name}" style="width:60px; height:60px; border-radius:50%; margin-bottom:10px;">
                <h3>${friend.name}</h3>
                <p>${friend.description}</p>
            `;
            
            card.style.cursor = "pointer";
            card.onclick = () => window.open(friend.url, "_blank");
            
            document.body.appendChild(card);
        });
    });
}

function ls(dir) {
    if (dir == "home") {
        return " archive \n firendship";
    }
    if (dir == "archive") {
        return " 没有文章哦 \n home";
    }
    if (dir == "firendship") {
        let output = "";
        friendsData.forEach(friend => {
            output += `${friend.name}\n`;
        });
        return output;
    }
    return "未知目录";
}

// ==================== 绑定点击事件 ====================
home.addEventListener("click", (e) => { 
    e.preventDefault();
    if (document.title === "小鲨鱼的主页") return;
    chhome(); });
archive.addEventListener("click", (e) => {
    e.preventDefault();
    if (document.title === "小鲨的文章") return; 
    charchive(); });
firendship.addEventListener("click", (e) => {
    e.preventDefault();
    if (document.title === "小鲨的朋友圈~") return; 
    chfirendship(); });

// ==================== Shell 窗口事件 ====================
function handleShellKeydown(e) {
    if (e.key === "Enter") {
        e.preventDefault();
        const cmd = this.value.trim();

        // 2. 处理命令
        if (cmd) {
            cmdHistory.push(cmd);
            historyIndex = -1;
            const parts = cmd.split(" ");
            if (parts[0] === "clear") {
                // 清屏：清空后重建初始提示行
                shell.innerHTML = '';
                const initPrompt = document.createElement('span');
                initPrompt.textContent = '[user@WebOS ' + dir + ']$ ';
                initPrompt.className = 'shell-prompt';
                shell.appendChild(initPrompt);

                const newCmd = document.createElement('input');
                newCmd.id = 'shell-cmd';
                newCmd.type = 'text';
                newCmd.autocomplete = 'off';
                shell.appendChild(newCmd);

                cmdline = newCmd;
                newCmd.addEventListener("keydown", handleShellKeydown);
                newCmd.focus();
                return;
            }

            const output = document.createElement('div');
            output.className = 'shell-output';

            if (parts[0] === "ls") {
                output.textContent = ls(dir) || "";
            }
            else if (parts[0] === "cd") {
                const target = parts.slice(1).join(" ");

                if (target === "archive") {
                    dir = "archive"
                    charchive();
                }
                
                else if (target === "firendship") {
                    dir = "firendship";
                    chfirendship();
                }
                
                else if (target === ".." && (dir === "firendship" || dir === "archive")) {
                    dir = "home";
                    chhome();
                }
                
                else if (target === "home" && (dir === "firendship" || dir === "archive")) {
                    dir = "home";
                    chhome();
                }

                else{
                    const found = friendsData.find(item => item.name === target);
                    if (found) {
                        window.open(found.url, "_blank");
                        output.textContent = "Open " + found.name + " (" + found.url + ")...";
                    } else {
                        output.textContent = "cd: " + target + ": 没有那个文件或目录";
                    }
                }
            }
            
            else if (parts[0] === "help") {
                output.textContent = `help    查看帮助
clear   清屏
ls      查看当前目录下的目录和文件
cd      切换当前目录
histroy 查看历史命令`
            }

            else if (parts[0] === "history") {
                if (cmdHistory.length === 0) {
                    output.textContent = "暂无历史记录";
                }

                else if (parts[1] === "-c") {
                    cmdHistory = [];
                    historyIndex = -1;
                    output.textContent = "history clear.";
                }

                else {
                    output.textContent = cmdHistory.map((cmd, i) => 
                        "  " + (i + 1) + "  " + cmd
                    ).join("\n");
                }
            }

            else if (parts[0] === "fastfetch") {
                output.textContent = `user@WebOS
OS: WebOS xJs
Shell: WebShell
Kernel: Linux 7.1.9-zen`;
            }
            else {
                output.textContent = cmd + ": 未找到命令";
            }

            shell.appendChild(output);
        }

        // 3. 创建新的输入行
        const newCmd = document.createElement('input');
        newCmd.id = 'shell-cmd';
        newCmd.type = 'text';
        newCmd.autocomplete = 'off';

        const promptSpan = document.createElement('span');
        promptSpan.textContent = '[user@WebOS ' + dir + ']$ ';
        promptSpan.className = 'shell-prompt';

        shell.appendChild(promptSpan);
        shell.appendChild(newCmd);

        // 4. 更新变量并绑定事件
        cmdline = newCmd;
        newCmd.addEventListener("keydown", handleShellKeydown);

        // 5. 滚动到底部并聚焦
        shell.scrollTop = shell.scrollHeight;
        newCmd.focus();
    }

    // 查看历史命令
    if (e.key === "ArrowUp") {
        e.preventDefault();
        if (cmdHistory.length === 0) return;
        if (historyIndex < cmdHistory.length - 1) {
            historyIndex++;
        }
        this.value = cmdHistory[cmdHistory.length - 1 - historyIndex];
        return;
    }

    // 查看下一条历史命令
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

// 初始化绑定
cmdline.addEventListener("keydown", handleShellKeydown);

window.onload = () => {
    const promptSpan = document.createElement('span');
    promptSpan.textContent = '[user@WebOS ' + dir + ']$ ';
    promptSpan.className = 'shell-prompt';
    shell.appendChild(promptSpan);
    shell.appendChild(cmdline);
}
