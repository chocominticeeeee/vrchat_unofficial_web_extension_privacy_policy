const app = {
    lastUrl: "",
};

async function main() {
    await delay(500);
    urlChanged();
    new MutationObserver(urlChanged).observe(document, { subtree: true, childList: true });
}
main();

function urlChanged() {
    const currentUrl = location.href;
    if (currentUrl !== app.lastUrl) {
        app.lastUrl = currentUrl;
        const currentpath = currentUrl.replace("https://vrchat.com/", "");
        // console.log(`URLが変更されました:${currentpath}`);
        switch (currentpath) {
            case "home/avatars":
                p_home_avatars();
                break;

            default:
                break;
        }
    }
}

async function p_home_avatars() {
    await waitForElements("#app main h3", "My Avatars");
    const MyAvatarsContainer = HoyoId(
        "#app > main > div.css-1hxlrwo > div.container-fluid > div > div.col-xs-12.content-scroll > div > div > div > div:nth-child(2) > div",
        "MyAvatarsContainer"
    );
    const MyAvatarsRow = HoyoId(
        "#app > main > div.css-1hxlrwo > div.container-fluid > div > div.col-xs-12.content-scroll > div > div > div > div:nth-child(2) > div > div",
        "MyAvatarsRow"
    );

    autoOpenMyAvatars();
    await delay(1000);
    await autoLoadMoreAvatars();

    // sub Functions
    function autoOpenMyAvatars() {
        const h3Elements = document.querySelectorAll("#app main h3");
        h3Elements.forEach((h3) => {
            if (h3.textContent.includes("My Avatars")) {
                const openBtn = h3.querySelector("button[type='button']");
                if (openBtn) {
                    openBtn.click();
                }
            }
        });
    }

    async function autoLoadMoreAvatars() {
        for (let i = 0; i < 10; i++) {
            const loadMoreButton = document.querySelector(
                "[data-hoyo_id='MyAvatarsRow'] div.text-center.col-md-3 > button"
            );
            if (loadMoreButton) {
                loadMoreButton.click();
                await delay(1000);
            }
        }
    }
}

// utils
function HoyoId(selectorOrElement, targetName) {
    if (typeof selectorOrElement === 'string') {
        const targetElem = document.querySelector(selectorOrElement);
        if (targetElem) {
            targetElem.dataset.hoyo_id = targetName;
            return targetElem;
        } else {
            console.warn(`addDataTarget:selector=${selectorOrElement} がみつからなかったよぉ`);
        }
    } else if (selectorOrElement instanceof Element) {
        selectorOrElement.dataset.hoyo_id = targetName;
        return selectorOrElement;
    }
}

function delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

// 対象の要素がポーリングで読み込まれるまで待機
async function waitForElements(selector, includeText, timeout = 5000, interval = 300) {
    const endTime = Date.now() + timeout;
    while (Date.now() < endTime) {
        const elements = Array.from(document.querySelectorAll(selector));
        const matchingElements = elements.filter((element) => element.textContent.includes(includeText));
        if (matchingElements.length > 0) {
            return matchingElements;
        }
        await delay(interval);
    }
    throw new Error(`要素が見つかりませんでした: ${selector}`);
}
