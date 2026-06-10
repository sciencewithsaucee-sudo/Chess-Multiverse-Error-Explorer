import * as duckdb from "https://cdn.jsdelivr.net/npm/@duckdb/duckdb-wasm@1.29.0/+esm";

const PARQUET_URL = "https://raw.githubusercontent.com/sciencewithsaucee-sudo/Chess-Multiverse-Error-Evaluation-Dataset-CMEED-/main/cmeed_v1.parquet";

// State & Variables
window.expPage = 1;
window.expPageSize = 24;
window.totalExpCount = 0;
window.appState = {
    tab: 'home',
    filters: {
        type: 'all', minDrop: 0, open: '', player: '', event: '', 
        side: 'all', title: 'all', minElo: '', maxElo: '', time: 'all', 
        year: 'all', phase: 'all', sort: 'e_change DESC', criticalOnly: false
    }
};

// Mathematics
window.calcExpect = (e) => 1 / (1 + Math.exp(-e / 2.2));
window.calcEsl = (before, after, side) => {
    let pb = side === 'black' ? -Number(before) : Number(before);
    let pa = side === 'black' ? -Number(after) : Number(after);
    return Math.max(0, window.calcExpect(pb) - window.calcExpect(pa)) * 100;
};

// Global SQL execution queue
window.dbLock = false;
window.execSQL = async function(query) {
    if (!window.cmeedConn) throw new Error("DuckDB not connected");
    while(window.dbLock) { await new Promise(r => setTimeout(r, 50)); }
    window.dbLock = true;
    try {
        return await window.cmeedConn.query(query);
    } catch(e) {
        console.error("SQL Execution Error:", e, "\nQuery:", query);
        throw e;
    } finally {
        window.dbLock = false;
    }
};

// Debounce wrapper
window.cmxTimers = {};
window.debounce = function(key, fn, delay = 500) {
    clearTimeout(window.cmxTimers[key]);
    window.cmxTimers[key] = setTimeout(fn, delay);
};

// Hash Routing & View Sharing
window.hashSet = function() {
    let p = new URLSearchParams();
    p.set("tab", window.appState.tab);
    for(let k in window.appState.filters) {
        let v = window.appState.filters[k];
        if(v && v !== 'all' && v !== false && v !== 'e_change DESC' && v !== 0) {
            p.set(k, String(v));
        }
    }
    history.replaceState(null, "", "#" + p);
};

window.copyShareLink = function() {
    window.hashSet();
    if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(window.location.href)
            .then(() => alert("Link to current view copied to clipboard!"))
            .catch(err => {
                console.error("Could not copy link: ", err);
                prompt("Copy the link manually:", window.location.href);
            });
    } else {
        prompt("Copy the link manually:", window.location.href);
    }
};

window.hashRead = function() {
    let x = location.hash.replace(/^#/, "");
    if(!x) return;
    let p = new URLSearchParams(x);
    if(p.has("tab")) window.appState.tab = p.get("tab");
    
    for(let k in window.appState.filters) {
        if(p.has(k)) {
            let v = p.get(k);
            if(k === 'criticalOnly') v = (v === 'true');
            window.appState.filters[k] = v;
        }
    }
    // Repopulate UI Elements
    if(document.getElementById('fSearchOpen')) {
        document.getElementById('fSearchOpen').value = window.appState.filters.open || '';
        document.getElementById('fSearchPlayer').value = window.appState.filters.player || '';
        document.getElementById('fSearchEvent').value = window.appState.filters.event || '';
        document.getElementById('fMinElo').value = window.appState.filters.minElo || '';
        document.getElementById('fMaxElo').value = window.appState.filters.maxElo || '';
        document.getElementById('fMinDrop').value = window.appState.filters.minDrop || 0;
        document.getElementById('fSide').value = window.appState.filters.side || 'all';
        document.getElementById('fTitle').value = window.appState.filters.title || 'all';
        document.getElementById('fTime').value = window.appState.filters.time || 'all';
        document.getElementById('fYear').value = window.appState.filters.year || 'all';
        document.getElementById('fPhase').value = window.appState.filters.phase || 'all';
        document.getElementById('dbSort').value = window.appState.filters.sort || 'e_change DESC';
        
        if(window.appState.filters.criticalOnly) {
            document.getElementById('btnCritical').classList.add('btn-primary');
        }
        
        if(window.appState.filters.type) {
            document.querySelectorAll('[id^="fType"]').forEach(b => b.classList.remove('active'));
            let btn = document.getElementById('fType' + window.appState.filters.type.charAt(0).toUpperCase() + window.appState.filters.type.slice(1));
            if(btn) btn.classList.add('active');
        }
    }
};

window.switchTab = function(tabId) {
    document.querySelectorAll('.tab-pane').forEach(el => el.classList.remove('active'));
    const pane = document.getElementById('tab-' + tabId);
    if(pane) pane.classList.add('active');
    window.scrollTo(0,0);
    window.appState.tab = tabId;
    window.hashSet();
};

window.openMobileFilter = function() {
    document.querySelector('.sidebar').classList.add('show');
    document.body.style.overflow = 'hidden';
};

window.closeMobileFilter = function() {
    document.querySelector('.sidebar').classList.remove('show');
    document.body.style.overflow = 'auto';
};

window.closePositionModal = function() {
    document.getElementById('modalBackdrop').classList.remove('show');
    document.body.style.overflow = 'auto';
    if(window.detailBoard) {
        window.detailBoard.destroy(); 
        window.detailBoard = null;
    }
};

window.clearExplorerInputs = function() {
    window.appState.filters = {
        type: 'all', minDrop: 0, open: '', player: '', event: '', 
        side: 'all', title: 'all', minElo: '', maxElo: '', time: 'all', 
        year: 'all', phase: 'all', sort: 'e_change DESC', criticalOnly: false
    };
    
    document.getElementById('fSearchOpen').value = '';
    document.getElementById('fSearchPlayer').value = '';
    document.getElementById('fSearchEvent').value = '';
    document.getElementById('fMinElo').value = '';
    document.getElementById('fMaxElo').value = '';
    document.getElementById('fMinDrop').value = '0';
    document.getElementById('fSide').value = 'all';
    document.getElementById('fTitle').value = 'all';
    document.getElementById('fTime').value = 'all';
    document.getElementById('fYear').value = '';
    document.getElementById('fPhase').value = 'all';
    document.getElementById('dbSort').value = 'e_change DESC';
    document.getElementById('btnCritical').classList.remove('btn-primary');

    document.querySelectorAll('[id^="fType"]').forEach(b => b.classList.remove('active'));
    document.getElementById('fTypeAll').classList.add('active');
};

// INTERCONNECTION ROUTING
window.routeToOpening = function(ecoCode) {
    window.closePositionModal();
    window.clearExplorerInputs();
    let cleanEco = ecoCode.split(' ')[0]; 
    document.getElementById('fSearchOpen').value = cleanEco;
    window.appState.filters.open = cleanEco;
    window.switchTab('explorer');
    window.debounceFilter();
};

window.routeToPlayer = function(playerName) {
    if(!playerName || playerName === 'null') return;
    window.closePositionModal();
    document.getElementById('profileSearch').value = playerName;
    window.switchTab('players');
    window.renderPlayerProfiles();
};

window.routeToPlayerErrors = function(playerName) {
    if(!playerName || playerName === 'null') return;
    window.closePositionModal();
    window.clearExplorerInputs();
    document.getElementById('fSearchPlayer').value = playerName;
    window.appState.filters.player = playerName;
    window.switchTab('explorer');
    window.debounceFilter();
};

window.routeToEvent = function(eventName) {
    if(!eventName || eventName === 'null') return;
    window.closePositionModal();
    window.clearExplorerInputs();
    document.getElementById('fSearchEvent').value = eventName;
    window.appState.filters.event = eventName;
    window.switchTab('explorer');
    window.debounceFilter();
};

// Auto-Run Tutorial Function
window.runNimzoTutorial = function() {
    window.closePositionModal();
    window.clearExplorerInputs();

    document.getElementById('fSearchOpen').value = 'Nimzo-Indian';
    window.appState.filters.open = 'Nimzo-Indian';

    document.getElementById('fTitle').value = 'GM';
    window.appState.filters.title = 'GM';

    document.getElementById('fTime').value = '30s';
    window.appState.filters.time = '30s';

    window.switchTab('explorer');
    window.debounceFilter();

    setTimeout(() => {
        alert("Case Study Loaded: Filtering CMEED for GM errors in the Nimzo-Indian with < 30 seconds on the clock.\n\nYou can now click 'Extract Validation Dataset' to download these exact records.");
    }, 600);
};

// Modal Tools
window.copyFen = function() {
    if(window.detailGame) {
        navigator.clipboard.writeText(window.detailGame.fen());
        alert("FEN copied to clipboard!");
    }
};
window.analyzeLichess = function() {
    if(window.detailGame) {
        let fen = window.detailGame.fen();
        window.open('https://lichess.org/analysis/standard/' + encodeURIComponent(fen.replace(/\s/g, '_')), '_blank');
    }
};
window.copyCitation = function() {
    if(!window.currentError) return;
    let r = window.currentError;
    let text = `Chess Multiverse Error & Evaluation Dataset (CMEED v1.0), ${r.error_id}: ${r.player} ${r.error_type}, ${r.event} (${r.date||r.year}), move ${r.move_number}, ${r.played_move} instead of ${r.best_move}.`;
    navigator.clipboard.writeText(text);
    alert("Citation copied!");
};
window.getMaterialKey = function(fen) {
    let p = {};
    for(let c of String(fen||"").split(" ")[0]) {
        if(/[prnbqkPRNBQK]/.test(c)) p[c] = (p[c]||0)+1;
    }
    return "PNBRQKpnbrqk".split("").map(x => x+(p[x]||0)).join("-");
};

// Playable board handlers
window.onDragStart = function(source, piece, position, orientation) {
    if (!window.detailGame || window.detailGame.game_over()) return false;
    if ((window.detailGame.turn() === 'w' && piece.search(/^b/) !== -1) ||
        (window.detailGame.turn() === 'b' && piece.search(/^w/) !== -1)) {
        return false;
    }
};
window.onDrop = function(source, target) {
    if (!window.detailGame) return 'snapback';
    let move = window.detailGame.move({
        from: source,
        to: target,
        promotion: 'q'
    });
    if (move === null) return 'snapback';
};
window.onSnapEnd = function() {
    if(window.detailBoard && window.detailGame) {
        window.detailBoard.position(window.detailGame.fen());
    }
};

async function initDuckDB() {
    const loaderMsg = document.getElementById('loaderMsg');
    try {
        window.hashRead();

        loaderMsg.innerText = "Connecting to DuckDB WASM Engine...";
        const bundles = duckdb.getJsDelivrBundles();
        const bundle = await duckdb.selectBundle(bundles);

        const workerUrl = URL.createObjectURL(
            new Blob([`importScripts("${bundle.mainWorker}");`], { type: "text/javascript" })
        );

        const worker = new Worker(workerUrl);
        const logger = new duckdb.ConsoleLogger();
        let db = new duckdb.AsyncDuckDB(logger, worker);
        
        await db.instantiate(bundle.mainModule, bundle.pthreadWorker);
        URL.revokeObjectURL(workerUrl);

        window.cmeedConn = await db.connect();
        
        loaderMsg.innerText = "Checking Cache for 58MB Parquet File...";
        let parquetBuffer;
        const cacheName = 'cmeed-parquet-cache-v1';
        const cache = await caches.open(cacheName);
        const cachedResponse = await cache.match(PARQUET_URL);

        if (cachedResponse) {
            loaderMsg.innerText = "Loading Dataset from Disk Cache...";
            parquetBuffer = await cachedResponse.arrayBuffer();
        } else {
            loaderMsg.innerText = "Downloading Dataset (58MB)... Please wait.";
            const response = await fetch(PARQUET_URL);
            if (!response.ok) throw new Error("Network response was not ok");
            cache.put(PARQUET_URL, response.clone());
            parquetBuffer = await response.arrayBuffer();
        }
        
        loaderMsg.innerText = "Mounting Virtual Filesystem...";
        await db.registerFileBuffer('local_cmeed.parquet', new Uint8Array(parquetBuffer));

        loaderMsg.innerText = "Indexing Database...";

        await window.execSQL(`
            CREATE VIEW cmeed AS 
            SELECT *, 
                   CASE WHEN side='white' THEN white_title ELSE black_title END AS player_title,
                   TRY_CAST(eval_before AS DOUBLE) as e_before,
                   TRY_CAST(eval_after AS DOUBLE) as e_after,
                   TRY_CAST(eval_change AS DOUBLE) as e_change,
                   TRY_CAST(clock_seconds AS DOUBLE) as clock_sec,
                   TRY_CAST(move_number AS DOUBLE) as m_number,
                   TRY_CAST(player_elo AS INTEGER) as p_elo,
                   CASE WHEN TRY_CAST(eval_before AS DOUBLE) IS NOT NULL 
                         AND TRY_CAST(eval_change AS DOUBLE) IS NOT NULL 
                         AND ABS(TRY_CAST(eval_before AS DOUBLE)) <= 1.25 
                         AND TRY_CAST(eval_change AS DOUBLE) >= 1.5 
                        THEN true ELSE false END AS is_critical,
                   CASE WHEN TRY_CAST(clock_seconds AS DOUBLE) < 30 THEN '< 30s'
                        WHEN TRY_CAST(clock_seconds AS DOUBLE) >= 30 AND TRY_CAST(clock_seconds AS DOUBLE) < 60 THEN '30-60s'
                        WHEN TRY_CAST(clock_seconds AS DOUBLE) >= 60 AND TRY_CAST(clock_seconds AS DOUBLE) < 300 THEN '1-5m'
                        WHEN TRY_CAST(clock_seconds AS DOUBLE) >= 300 AND TRY_CAST(clock_seconds AS DOUBLE) < 900 THEN '5-15m'
                        WHEN TRY_CAST(clock_seconds AS DOUBLE) >= 900 THEN '15m+'
                        ELSE 'Unknown' END AS clock_bucket
            FROM read_parquet('local_cmeed.parquet');
        `);

        loaderMsg.innerText = "Building Search Indexes...";
        let qPlayers = await window.execSQL(`SELECT DISTINCT player FROM cmeed WHERE player IS NOT NULL ORDER BY player`);
        let pArr = qPlayers.toArray().map(r => r.toJSON().player);
        document.getElementById('playerList').innerHTML = pArr.map(p => `<option value="${p.replace(/"/g, '&quot;')}">`).join('');

        let qEvents = await window.execSQL(`SELECT DISTINCT event FROM cmeed WHERE event IS NOT NULL ORDER BY event`);
        let eArr = qEvents.toArray().map(r => r.toJSON().event);
        document.getElementById('eventList').innerHTML = eArr.map(e => `<option value="${e.replace(/"/g, '&quot;')}">`).join('');

        let qEcos = await window.execSQL(`SELECT DISTINCT eco, split_part(opening, ':', 1) as name FROM cmeed WHERE eco IS NOT NULL`);
        let ecoArr = qEcos.toArray().map(r => r.toJSON());
        document.getElementById('ecoList').innerHTML = ecoArr.map(e => `<option value="${e.eco} - ${e.name.replace(/"/g, '&quot;')}">`).join('');

        loaderMsg.innerText = "Finalizing...";

        let countRes = await window.execSQL(`
            SELECT COUNT(*) as c, COUNT(DISTINCT game_id) as g, 
                   MIN(year) as miny, MAX(year) as maxy, 
                   MIN(date) as mind, MAX(date) as maxd, 
                   COUNT(DISTINCT source_file) as sf 
            FROM cmeed
        `);
        let dataSummary = countRes.toArray()[0].toJSON();
        document.getElementById('homeStatErrors').innerText = Number(dataSummary.c).toLocaleString();
        document.getElementById('homeStatGames').innerText = Number(dataSummary.g).toLocaleString();
        document.getElementById('homeVintage').innerText = `${dataSummary.miny}-${dataSummary.maxy}`;
        
        document.getElementById('cmeedLoader').style.display = 'none';

        window.switchTab(window.appState.tab);
        
        await window.runExplorerFilters();
        
        setTimeout(async () => {
            await window.renderAtlas();
            await window.renderEvents();
            await window.renderPlayerProfiles();
            await window.renderDashboard();
        }, 100);

    } catch(err) {
        console.error("Initialization error:", err);
        loaderMsg.innerHTML = `<span style="color:#ef4444;"><i class="fa-solid fa-triangle-exclamation"></i> Error: ${err.message}</span>`;
    }
}

function readFilterInputsToState() {
    let rawOpen = document.getElementById('fSearchOpen').value;
    window.appState.filters.open = rawOpen.split(' - ')[0].trim(); 
    window.appState.filters.player = document.getElementById('fSearchPlayer').value.trim();
    window.appState.filters.event = document.getElementById('fSearchEvent').value.trim();
    window.appState.filters.minElo = document.getElementById('fMinElo').value;
    window.appState.filters.maxElo = document.getElementById('fMaxElo').value;
    window.appState.filters.minDrop = document.getElementById('fMinDrop').value;
    window.appState.filters.side = document.getElementById('fSide').value;
    window.appState.filters.title = document.getElementById('fTitle').value;
    window.appState.filters.time = document.getElementById('fTime').value;
    window.appState.filters.year = document.getElementById('fYear').value;
    window.appState.filters.phase = document.getElementById('fPhase').value;
    
    let chosenSort = document.getElementById('dbSort').value;
    window.appState.filters.sort = chosenSort ? chosenSort : 'e_change DESC';
}

function generateSQLFilterClause() {
    let rules = [];
    let f = window.appState.filters;

    if (f.type && f.type !== 'all') rules.push(`error_type = '${f.type}'`);
    if (f.year && f.year !== 'all') rules.push(`TRY_CAST(year AS INTEGER) = ${parseInt(f.year)}`);
    if (f.phase && f.phase !== 'all') rules.push(`opening_phase = '${f.phase}'`);
    if (f.side && f.side !== 'all') rules.push(`side = '${f.side}'`);
    
    if (f.title && f.title !== 'all') {
        if (f.title === 'None') rules.push(`(player_title = '' OR player_title IS NULL)`);
        else rules.push(`player_title = '${f.title}'`);
    }
    
    if (f.minElo && parseInt(f.minElo) > 0) rules.push(`p_elo >= ${parseInt(f.minElo)}`);
    if (f.maxElo && parseInt(f.maxElo) < 4000) rules.push(`p_elo <= ${parseInt(f.maxElo)}`);
    if (f.minDrop && parseFloat(f.minDrop) > 0) rules.push(`e_change >= ${parseFloat(f.minDrop)}`);
    
    if (f.criticalOnly) {
        rules.push(`is_critical = true`);
    }
    
    if (f.open) {
        let s = f.open.toLowerCase().replace(/'/g, "''");
        rules.push(`(LOWER(eco) LIKE '%${s}%' OR LOWER(opening) LIKE '%${s}%')`);
    }
    if (f.player) {
        let s = f.player.toLowerCase().replace(/'/g, "''");
        rules.push(`LOWER(player) LIKE '%${s}%'`);
    }
    if (f.event) {
        let s = f.event.toLowerCase().replace(/'/g, "''");
        rules.push(`LOWER(event) LIKE '%${s}%'`);
    }

    if (f.time && f.time !== 'all') {
        if (f.time === '30s') rules.push(`clock_sec < 30`);
        if (f.time === '60s') rules.push(`clock_sec >= 30 AND clock_sec < 60`);
        if (f.time === '5m') rules.push(`clock_sec >= 60 AND clock_sec < 300`);
        if (f.time === '15m') rules.push(`clock_sec >= 300 AND clock_sec < 900`);
        if (f.time === '15m+') rules.push(`clock_sec >= 900`);
    }

    return rules.length ? 'WHERE ' + rules.join(' AND ') : '';
}

window.runExplorerFilters = async function() {
    readFilterInputsToState();
    window.hashSet();
    document.getElementById('expCount').innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> Loading Data...`;
    window.expPage = 1;
    await window.loadExplorerPage();
};

window.changePage = async function(dir) {
    window.expPage += dir;
    await window.loadExplorerPage();
};

window.loadExplorerPage = async function() {
    if (!window.cmeedConn) return;
    try {
        const whereClause = generateSQLFilterClause();
        
        let sortStrategy = window.appState.filters.sort;
        if (!sortStrategy || sortStrategy.includes('eval_change')) {
             sortStrategy = 'e_change DESC';
        }

        let countQuery = await window.execSQL(`SELECT COUNT(*) as total FROM cmeed ${whereClause}`);
        window.totalExpCount = Number(countQuery.toArray()[0].toJSON().total);
        
        let paginationOffset = (window.expPage - 1) * window.expPageSize;
        let mainQuery = `SELECT * FROM cmeed ${whereClause} ORDER BY ${sortStrategy} LIMIT ${window.expPageSize} OFFSET ${paginationOffset}`;
        
        let queryResults = await window.execSQL(mainQuery);
        let arrayChunk = queryResults.toArray().map(r => r.toJSON());

        renderExplorerCards(arrayChunk);
    } catch(err) {
        console.error("SQL Explorer Query Error:", err);
        document.getElementById('expCount').innerHTML = `<span style="color:var(--color-danger);"><i class="fa-solid fa-triangle-exclamation"></i> Filter Criteria Error. Reset Filters.</span>`;
        document.getElementById('explorerGrid').innerHTML = "";
        document.getElementById('explorerPager').innerHTML = "";
    }
};

function renderExplorerCards(records) {
    const targetGrid = document.getElementById('explorerGrid');
    document.getElementById('expCount').innerHTML = `Showing ${window.totalExpCount.toLocaleString()} Human Errors`;
    
    if(records.length === 0) {
        targetGrid.innerHTML = `<div style="grid-column:1/-1;text-align:center;padding:40px;color:var(--color-text-light);">No matching errors found.</div>`;
        document.getElementById('explorerPager').innerHTML = '';
        return;
    }

    targetGrid.innerHTML = records.map(item => {
        let playerTitleString = (item.player_title && item.player_title !== 'None' && item.player_title !== 'null') ? item.player_title + ' ' : '';
        let eslVal = window.calcEsl(item.e_before, item.e_after, item.side);
        
        return `
        <div class="compact-card">
            <div class="cc-header">
                <h3 class="cc-title cmeed-link" onclick="routeToPlayerErrors('${item.player.replace(/'/g, "\\'")}')">${playerTitleString}${item.player}</h3>
                <span class="badge ${window.getBadge(item.error_type)}">${item.error_type}</span>
            </div>
            <div class="cc-body">
                <div class="cc-row"><span>Move</span> <span class="cc-val">${item.move_number}</span></div>
                <div class="cc-row"><span>Played</span> <span class="cc-val" style="color:var(--color-danger);">${item.played_move}</span></div>
                <div class="cc-row"><span>Best</span> <span class="cc-val" style="color:var(--color-success);">${item.best_move}</span></div>
                <div class="cc-row"><span>Exp. Score Loss</span> <span class="cc-val">${eslVal.toFixed(1)}%</span></div>
                <div class="cc-row"><span>Clock</span> <span class="cc-val">${window.formatClock(item.clock_sec)}</span></div>
                <div class="cc-row" style="flex-direction:column; border:none; gap:2px; margin-top:4px;">
                    <span style="font-size:0.7rem;text-transform:uppercase;">Opening</span>
                    <b class="truncate cmeed-link" style="color:var(--color-text-dark);" onclick="routeToOpening('${item.eco}')">${item.eco} - ${(item.opening||'').split(':')[0]}</b>
                </div>
            </div>
            <button class="btn btn-primary w-100" style="margin-top:auto;" onclick="openPositionModal('${item.error_id}')">View Position</button>
        </div>
        `;
    }).join('');

    let totalPagesCount = Math.ceil(window.totalExpCount / window.expPageSize);
    let paginationHtmlMarkup = '';
    if(totalPagesCount > 1) {
        paginationHtmlMarkup += `<button class="btn btn-xs" ${window.expPage===1?'disabled':''} onclick="changePage(-1)">Prev</button>`;
        paginationHtmlMarkup += `<span style="font-size:0.85rem;font-weight:600;padding:0 8px;align-self:center;">Page ${window.expPage}/${totalPagesCount}</span>`;
        paginationHtmlMarkup += `<button class="btn btn-xs" ${window.expPage===totalPagesCount?'disabled':''} onclick="changePage(1)">Next</button>`;
    }
    document.getElementById('explorerPager').innerHTML = paginationHtmlMarkup;
}

window.renderAtlas = async function() {
    if (!window.cmeedConn) return;
    try {
        let qStr = document.getElementById('atlasSearch').value.toLowerCase().replace(/'/g, "''");
        let searchWhereClause = qStr ? `WHERE LOWER(eco) LIKE '%${qStr}%' OR LOWER(opening) LIKE '%${qStr}%'` : '';
        
        let sortMap = { 
            'errors': 'errors DESC', 
            'blunders': 'blunders DESC', 
            'drop': 'avg_loss DESC', 
            'diff': 'odi DESC' 
        };
        let s = sortMap[document.getElementById('atlasSort').value] || 'errors DESC';

        let mappingSqlQuery = `
            SELECT eco, split_part(opening, ':', 1) as name, 
                   COUNT(*) as errors, 
                   SUM(CASE WHEN error_type='Blunder' THEN 1 ELSE 0 END) as blunders, 
                   AVG(e_change) as avg_loss,
                   COUNT(DISTINCT player) as players,
                   AVG(CASE WHEN clock_sec < 60 THEN 1 ELSE 0 END) as pressure
            FROM cmeed 
            ${searchWhereClause}
            GROUP BY eco, split_part(opening, ':', 1) 
        `;
        let outputRecords = await window.execSQL(mappingSqlQuery);
        let entriesArray = outputRecords.toArray().map(r => r.toJSON());

        let maxErr = Math.max(...entriesArray.map(r => Number(r.errors)), 1);
        let maxPl = Math.max(...entriesArray.map(r => Number(r.players)), 1);

        entriesArray = entriesArray.map(r => {
            let e = Number(r.errors);
            let bp = e ? Number(r.blunders) / e : 0;
            let avgD = Number(r.avg_loss);
            let pl = Number(r.players);
            let pr = Number(r.pressure);
            
            let odi = Math.round(100 * ((e / maxErr) * 0.28 + bp * 0.22 + Math.min(avgD / 4, 1) * 0.24 + (pl / maxPl) * 0.14 + pr * 0.12));
            return {...r, bp, odi};
        });

        if(s === 'errors DESC') entriesArray.sort((a,b) => Number(b.errors) - Number(a.errors));
        if(s === 'blunders DESC') entriesArray.sort((a,b) => Number(b.blunders) - Number(a.blunders));
        if(s === 'avg_loss DESC') entriesArray.sort((a,b) => Number(b.avg_loss) - Number(a.avg_loss));
        if(s === 'odi DESC') entriesArray.sort((a,b) => b.odi - a.odi);

        entriesArray = entriesArray.slice(0, 800);

        document.getElementById('atlasBody').innerHTML = entriesArray.map(item => {
            return `<tr>
                <td data-label="ECO"><b class="cmeed-link" onclick="routeToOpening('${item.eco}')">${item.eco}</b></td>
                <td data-label="Opening Family">${item.name}</td>
                <td data-label="Errors Logged">${Number(item.errors).toLocaleString()}</td>
                <td data-label="Blunder %">${(item.bp*100).toFixed(1)}%</td>
                <td data-label="Avg Eval Loss">${Number(item.avg_loss).toFixed(2)}</td>
                <td data-label="Pressure %">${(Number(item.pressure)*100).toFixed(1)}%</td>
                <td data-label="CMX-ODI"><b style="color:var(--color-text-dark);">${item.odi}</b></td>
            </tr>`;
        }).join('');
    } catch(err) { console.error(err); }
};

window.renderEvents = async function() {
    if (!window.cmeedConn) return;
    try {
        let qStr = document.getElementById('eventSearch').value.toLowerCase().replace(/'/g, "''");
        let searchWhereClause = qStr ? `WHERE LOWER(event) LIKE '%${qStr}%'` : '';
        
        let sortMap = { 'errors': 'errors DESC', 'blunders': 'blunders DESC', 'drop': 'avg_loss DESC' };
        let s = sortMap[document.getElementById('eventSort').value];

        let eventSummaryQuery = `
            SELECT event, year, 
                   COUNT(*) as errors, 
                   SUM(CASE WHEN error_type='Blunder' THEN 1 ELSE 0 END) as blunders, 
                   AVG(e_change) as avg_loss,
                   AVG(CASE WHEN clock_sec < 60 THEN 1 ELSE 0 END) as pressure
            FROM cmeed 
            ${searchWhereClause}
            GROUP BY event, year 
            ORDER BY ${s} LIMIT 1000
        `;
        let resultsCollection = await window.execSQL(eventSummaryQuery);
        let tabularRows = resultsCollection.toArray().map(r => r.toJSON());
        
        document.getElementById('eventBody').innerHTML = tabularRows.map(entry => {
            return `<tr>
                <td data-label="Tournament / Event"><b class="cmeed-link" onclick="routeToEvent('${entry.event.replace(/'/g, "\\'")}')">${entry.event}</b></td>
                <td data-label="Year">${entry.year}</td>
                <td data-label="Errors Logged">${Number(entry.errors).toLocaleString()}</td>
                <td data-label="Blunders">${Number(entry.blunders).toLocaleString()}</td>
                <td data-label="Avg Eval Loss">${Number(entry.avg_loss).toFixed(2)}</td>
                <td data-label="Pressure %">${(Number(entry.pressure)*100).toFixed(1)}%</td>
            </tr>`;
        }).join('');
    } catch(err) { console.error(err); }
};

window.renderPlayerProfiles = async function() {
    if (!window.cmeedConn) return;
    try {
        let searchFilterString = document.getElementById('profileSearch').value.toLowerCase().replace(/'/g, "''");
        let criteriaScope = searchFilterString ? `WHERE LOWER(player) LIKE '%${searchFilterString}%'` : '';
        
        let sortMap = { 'errors DESC': 'errors DESC', 'blunders DESC': 'blunders DESC', 'avg_loss DESC': 'avg_loss DESC' };
        let s = sortMap[document.getElementById('playerSort').value] || 'errors DESC';

        let profilingQueryString = `
            SELECT player_title, player, MAX(p_elo) as elo, 
                   COUNT(*) as errors, 
                   SUM(CASE WHEN error_type='Blunder' THEN 1 ELSE 0 END) as blunders, 
                   AVG(e_change) as avg_loss,
                   AVG(CASE WHEN clock_sec < 60 THEN e_change ELSE NULL END) as panic_loss,
                   mode(eco) as topOp
            FROM cmeed 
            ${criteriaScope}
            GROUP BY player_title, player 
            ORDER BY ${s} LIMIT 100
        `;
        let resultsTable = await window.execSQL(profilingQueryString);
        let playersPack = resultsTable.toArray().map(r => r.toJSON());
        
        const destinationBody = document.getElementById('playersBody');
        if(playersPack.length === 0) { destinationBody.innerHTML = '<tr><td colspan="7">No matching profile entries found.</td></tr>'; return; }

        destinationBody.innerHTML = playersPack.map(record => {
            let profilePrefixTitle = (record.player_title && record.player_title !== 'None' && record.player_title !== 'null') ? record.player_title+' ' : '';
            let panic = Number(record.panic_loss) > 0 ? Number(record.panic_loss).toFixed(2) : "N/A";
            return `
            <tr>
                <td data-label="Player"><b class="cmeed-link" onclick="routeToPlayerErrors('${record.player.replace(/'/g, "\\'")}')">${profilePrefixTitle}${record.player}</b></td>
                <td data-label="Peak ELO">${record.elo || 'N/A'}</td>
                <td data-label="Errors">${Number(record.errors).toLocaleString()}</td>
                <td data-label="Blunders"><span style="color:var(--color-danger); font-weight:600;">${Number(record.blunders).toLocaleString()}</span></td>
                <td data-label="Avg Loss">${Number(record.avg_loss).toFixed(2)}</td>
                <td data-label="Panic Avg"><span style="color:var(--color-warning); font-weight:700;">${panic}</span></td>
                <td data-label="Top Opening"><b class="cmeed-link" onclick="routeToOpening('${record.topOp}')">${record.topOp || 'N/A'}</b></td>
            </tr>`;
        }).join('');
    } catch(err) { console.error(err); }
};

window.renderDashboard = async function() {
    if (!window.cmeedConn) return;
    try {
        let dashStatsQuery = await window.execSQL(`
            SELECT COUNT(*) as c, COUNT(DISTINCT game_id) as g,
                   COUNT(DISTINCT player) as p, COUNT(DISTINCT eco) as o
            FROM cmeed
        `);
        let dStats = dashStatsQuery.toArray()[0].toJSON();
        document.getElementById('dashTotErrors').innerText = Number(dStats.c).toLocaleString();
        document.getElementById('dashTotGames').innerText = Number(dStats.g).toLocaleString();
        document.getElementById('dashTotPlayers').innerText = Number(dStats.p).toLocaleString();
        document.getElementById('dashTotOpenings').innerText = Number(dStats.o).toLocaleString();

        let phaseQueryResultObj = await window.execSQL(`SELECT opening_phase as k, COUNT(*) as v FROM cmeed WHERE opening_phase IN ('Opening', 'Middlegame', 'Endgame') GROUP BY k ORDER BY v DESC`);
        let phaseRowsData = phaseQueryResultObj.toArray().map(r => r.toJSON());
        let aggregationsTotalPhases = Math.max(1, phaseRowsData.reduce((sum, item) => sum + Number(item.v), 0));
        document.getElementById('chartPhase').innerHTML = phaseRowsData.map(dataElement => {
            let specificRowPercentage = (Number(dataElement.v)/aggregationsTotalPhases*100).toFixed(1);
            let niceVal = Number(dataElement.v).toLocaleString();
            return `<div class="bar-row"><div class="bar-label">${dataElement.k}</div><div class="bar-track"><div class="bar-fill" style="width:${Math.max(2, specificRowPercentage)}%"></div></div><div class="bar-val" style="width:70px">${niceVal}</div></div>`;
        }).join('');

        let severityQueryResultObj = await window.execSQL(`SELECT error_type as k, COUNT(*) as v FROM cmeed WHERE error_type IN ('Blunder', 'Mistake', 'Inaccuracy') GROUP BY k ORDER BY v DESC`);
        let severityRowsData = severityQueryResultObj.toArray().map(r => r.toJSON());
        let aggregationsTotalSeverities = Math.max(1, severityRowsData.reduce((sum, item) => sum + Number(item.v), 0));
        document.getElementById('chartSeverity').innerHTML = severityRowsData.map(dataElement => {
            let specificRowPercentage = (Number(dataElement.v)/aggregationsTotalSeverities*100).toFixed(1);
            let uniqueBarThemeColor = dataElement.k==='Blunder'?'var(--color-danger)':(dataElement.k==='Mistake'?'var(--color-warning)':'var(--color-accent)');
            let niceVal = Number(dataElement.v).toLocaleString();
            return `<div class="bar-row"><div class="bar-label">${dataElement.k}</div><div class="bar-track"><div class="bar-fill" style="width:${Math.max(2, specificRowPercentage)}%; background:${uniqueBarThemeColor};"></div></div><div class="bar-val" style="width:70px">${niceVal}</div></div>`;
        }).join('');

        let pressureQueryExpression = `
            SELECT clock_bucket as k, AVG(e_change) as a, MIN(clock_sec) as order_col
            FROM cmeed
            WHERE clock_bucket != 'Unknown' AND e_change IS NOT NULL
            GROUP BY 1 ORDER BY 3
        `;
        let pressureQueryResultObj = await window.execSQL(pressureQueryExpression);
        let timeBucketsPack = pressureQueryResultObj.toArray().map(r => r.toJSON());
        let absoluteMaxAvgLossValue = Math.max(...timeBucketsPack.map(b => Number(b.a)), 1);
        
        document.getElementById('chartTimePressure').innerHTML = timeBucketsPack.map(bucket => {
            let val = Number(bucket.a);
            let dynamicBarLengthWidth = (val/absoluteMaxAvgLossValue*100);
            return `<div class="bar-row"><div class="bar-label">${bucket.k}</div><div class="bar-track"><div class="bar-fill" style="width:${Math.max(2, dynamicBarLengthWidth)}%; background:var(--color-text-dark);"></div></div><div class="bar-val" style="width:50px">${val.toFixed(2)}</div></div>`;
        }).join('');

        let colorQuery = await window.execSQL(`SELECT side as k, COUNT(*) as v FROM cmeed WHERE side IN ('white', 'black') GROUP BY k ORDER BY v DESC`);
        let colorData = colorQuery.toArray().map(r => r.toJSON());
        let maxColor = Math.max(...colorData.map(c => Number(c.v)), 1);
        document.getElementById('chartColorBias').innerHTML = colorData.map(c => {
            let pct = (Number(c.v)/maxColor*100).toFixed(1);
            let niceVal = Number(c.v).toLocaleString();
            return `<div class="bar-row"><div class="bar-label" style="text-transform:capitalize;">${c.k}</div><div class="bar-track"><div class="bar-fill" style="width:${pct}%; background:var(--color-success);"></div></div><div class="bar-val" style="width:70px">${niceVal}</div></div>`;
        }).join('');

        let heatQuery = `SELECT CAST(FLOOR(m_number/5)*5 AS INTEGER) AS bucket, COUNT(*) AS c FROM cmeed WHERE m_number IS NOT NULL GROUP BY bucket ORDER BY bucket LIMIT 24`;
        let heatObj = await window.execSQL(heatQuery);
        let heatData = heatObj.toArray().map(r => r.toJSON());
        let maxHeat = Math.max(...heatData.map(r => Number(r.c)), 1);
        
        document.getElementById('chartHeatmap').innerHTML = heatData.map(r => {
            let val = Number(r.c);
            let intensity = Math.max(0.12, val / maxHeat);
            let fontColor = intensity > 0.55 ? '#ffffff' : '#0f172a';
            let rangeEnd = Number(r.bucket) + 4;
            return `<div class="cell" style="background:rgba(37,99,235,${intensity}); color:${fontColor};"><span>${r.bucket}-${rangeEnd}</span><b>${val.toLocaleString()}</b></div>`;
        }).join('');
    } catch(err) { 
        console.error("Dashboard error:", err); 
        document.getElementById('chartHeatmap').innerHTML = "<div style='color:var(--color-danger);'>Dashboard elements failed to render. Check console for SQL query errors.</div>";
    }
};

window.openPositionModal = async function(id) {
    if (!window.cmeedConn) return;
    let positionalQueryResults = await window.execSQL(`SELECT * FROM cmeed WHERE error_id = '${id}'`);
    let specificRowsCollection = positionalQueryResults.toArray().map(r => r.toJSON());
    if(specificRowsCollection.length === 0) return;
    
    window.currentError = specificRowsCollection[0];
    let targetErrorRecord = window.currentError;
    window.detailGame = new Chess(targetErrorRecord.fen_before);

    let structuralTitleString = (targetErrorRecord.player_title && targetErrorRecord.player_title !== 'None' && targetErrorRecord.player_title !== 'null') ? targetErrorRecord.player_title + ' ' : '';
    document.getElementById('mTitle').innerText = `${targetErrorRecord.error_type} by ${structuralTitleString}${targetErrorRecord.player}`;
    document.getElementById('mSubtitle').innerHTML = `${targetErrorRecord.side==='white'?'White':'Black'} to move &bull; Ply ${targetErrorRecord.error_ply}`;
    
    document.getElementById('mPlayed').innerText = targetErrorRecord.played_move + (targetErrorRecord.error_type==='Blunder'?'??':'?');
    document.getElementById('mBest').innerText = targetErrorRecord.best_move;
    
    let evalB = Number(targetErrorRecord.e_before||0);
    let evalA = Number(targetErrorRecord.e_after||0);
    
    document.getElementById('mESL').innerHTML = window.calcEsl(evalB, evalA, targetErrorRecord.side).toFixed(1) + "%";
    document.getElementById('mClock').innerText = window.formatClock(targetErrorRecord.clock_sec);

    document.getElementById('mEvent').innerText = targetErrorRecord.event;
    document.getElementById('mOpening').innerText = `${targetErrorRecord.eco} ${targetErrorRecord.opening}`;
    
    let wEl = document.getElementById('mWhite'); wEl.innerText = `${targetErrorRecord.white} (${targetErrorRecord.white_elo})`; wEl.setAttribute('data-name', targetErrorRecord.white);
    let bEl = document.getElementById('mBlack'); bEl.innerText = `${targetErrorRecord.black} (${targetErrorRecord.black_elo})`; bEl.setAttribute('data-name', targetErrorRecord.black);

    document.getElementById('mResult').innerText = targetErrorRecord.result;
    
    document.getElementById('similarContainer').style.display = 'none';

    window.renderTimeline(evalB, evalA, targetErrorRecord.move_number);

    document.getElementById('modalBackdrop').classList.add('show');
    document.body.style.overflow = 'hidden';

    setTimeout(() => {
        if(window.detailBoard) window.detailBoard.destroy();
        window.detailBoard = Chessboard('modalChessboard', {
            pieceTheme: 'https://cdn.jsdelivr.net/gh/oakmac/chessboardjs@1.0.0/website/img/chesspieces/wikipedia/{piece}.png',
            position: targetErrorRecord.fen_before,
            orientation: targetErrorRecord.side,
            draggable: true,
            onDragStart: window.onDragStart,
            onDrop: window.onDrop,
            onSnapEnd: window.onSnapEnd
        });
    }, 50);
};

window.renderTimeline = function(e1, e2, moveNum) {
    let visualBoundaryClamp1 = Math.max(-10, Math.min(10, e1));
    let visualBoundaryClamp2 = Math.max(-10, Math.min(10, e2));
    let plottedVerticalY1 = 50 - (visualBoundaryClamp1 * 4);
    let plottedVerticalY2 = 50 - (visualBoundaryClamp2 * 4);
    
    let graphSvgCodeMarkup = `
    <svg viewBox="0 0 300 100" width="100%" height="100%" preserveAspectRatio="none" style="background:var(--color-bg-white); border-radius:4px; border:1px solid var(--color-border);">
        <line x1="0" y1="50" x2="300" y2="50" stroke="var(--color-border)" stroke-dasharray="4" stroke-width="2"/>
        <text x="5" y="45" fill="var(--color-text-light)" font-size="10" font-family="sans-serif">0.0</text>
        <line x1="50" y1="${plottedVerticalY1}" x2="250" y2="${plottedVerticalY2}" stroke="var(--color-danger)" stroke-width="3"/>
        <circle cx="50" cy="${plottedVerticalY1}" r="5" fill="var(--color-text-dark)" />
        <text x="50" y="${plottedVerticalY1 - 10}" fill="var(--color-text-dark)" font-size="12" font-weight="bold" font-family="sans-serif" text-anchor="middle">${e1 > 0 ? '+'+e1.toFixed(1) : e1.toFixed(1)}</text>
        <text x="50" y="${plottedVerticalY1 + 18}" fill="var(--color-text-light)" font-size="10" font-family="sans-serif" text-anchor="middle">Move ${moveNum}</text>
        <circle cx="250" cy="${plottedVerticalY2}" r="6" fill="var(--color-danger)" />
        <text x="250" y="${plottedVerticalY2 - 12}" fill="var(--color-danger)" font-size="12" font-weight="bold" font-family="sans-serif" text-anchor="middle">${e2 > 0 ? '+'+e2.toFixed(1) : e2.toFixed(1)}</text>
        <text x="250" y="${plottedVerticalY2 + 20}" fill="var(--color-text-light)" font-size="10" font-family="sans-serif" text-anchor="middle">Played</text>
    </svg>
    `;
    document.getElementById('mTimelineSvg').innerHTML = graphSvgCodeMarkup;
};

window.playModalLine = function(type) {
    if(!window.detailGame || !window.currentError) return;
    window.detailGame.load(window.currentError.fen_before);
    
    let TargetMoveNotationSan = type === 'played' ? window.currentError.played_move : window.currentError.best_move;
    let successfulExecutionMoveObj = window.detailGame.move(TargetMoveNotationSan);
    if(successfulExecutionMoveObj) {
        window.detailBoard.position(window.detailGame.fen());
    } else if(type === 'played' && window.currentError.fen_after) {
        window.detailBoard.position(window.currentError.fen_after);
    }
};

window.resetPositionBoard = function() {
    if(!window.detailGame || !window.currentError || !window.detailBoard) return;
    window.detailGame.load(window.currentError.fen_before);
    window.detailBoard.position(window.currentError.fen_before);
};

window.findSimilarMaterial = async function() {
    if(!window.currentError || !window.cmeedConn) return;
    const container = document.getElementById('similarContainer');
    container.style.display = 'block';
    container.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Searching DuckDB for similar material structures...';
    
    let key = window.getMaterialKey(window.currentError.fen_before);
    let q = `SELECT error_id, player, error_type, eco, move_number, eval_change, fen_before FROM cmeed WHERE opening_phase='${window.currentError.opening_phase.replace(/'/g,"''")}' AND side='${window.currentError.side}' ORDER BY eval_change DESC LIMIT 2500`;
    let res = await window.execSQL(q);
    let data = res.toArray().map(r=>r.toJSON());
    let matches = data.filter(r => r.error_id !== window.currentError.error_id && window.getMaterialKey(r.fen_before) === key).slice(0,8);
    
    if(matches.length){
        container.innerHTML = `<div style="font-weight:700; margin-bottom:8px;">${matches.length} similar material configurations found:</div>` + 
            matches.map(m => `<div><b class="cmeed-link" onclick="openPositionModal('${m.error_id}')">${m.player}</b> &mdash; ${m.error_type} in ${m.eco} (Move ${m.move_number})</div>`).join('');
    } else {
        container.innerHTML = 'No exact material matches found in the current sampled phase slice.';
    }
};

window.exportData = async function(format = 'csv') {
    if (!window.cmeedConn) return;
    try {
        const currentActiveWhereClause = generateSQLFilterClause();
        
        let sortStrategy = window.appState.filters.sort;
        if (!sortStrategy || sortStrategy.includes('eval_change')) { sortStrategy = 'e_change DESC'; }

        let exportSqlQueryExpression = `SELECT * FROM cmeed ${currentActiveWhereClause} ORDER BY ${sortStrategy} LIMIT 3000`;
        let outputDataTable = await window.execSQL(exportSqlQueryExpression);
        let rows = outputDataTable.toArray().map(r => r.toJSON());
        
        if(format === 'md') {
            let md = ["# CMX Decision Lab Research Brief\n", `Dataset: Chess Multiverse Error & Evaluation Dataset (CMEED v1.0)`, `Generated: ${new Date().toISOString()}`, `Filtered records exported: ${rows.length}\n`, "## Top 10 Examples\n"];
            rows.slice(0,10).forEach((r,i) => {
                md.push(`${i+1}. **${r.player}**, ${r.error_type}, ${r.event} (${r.year}), move ${r.move_number}: Played **${r.played_move}** instead of **${r.best_move}**; Expected Score Loss: **${window.calcEsl(r.e_before, r.e_after, r.side).toFixed(1)}%**. FEN: \`${r.fen_before}\``);
            });
            const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([md.join("\n")], { type: 'text/markdown' })); a.download = 'cmeed_brief.md'; a.click();
            return;
        }

        let csvStringDataOutput = "ID,Player,Elo,Event,Opening,Move,Played,Best,EvalChange,Clock\n";
        rows.forEach(o => csvStringDataOutput += `${o.error_id},"${o.player}",${Number(o.p_elo)},"${o.event}","${o.eco}",${Number(o.m_number)},${o.played_move},${o.best_move},${Number(o.e_change)},${Number(o.clock_sec)}\n`);
        const auxiliaryDownloadAnchor = document.createElement('a'); 
        auxiliaryDownloadAnchor.href = URL.createObjectURL(new Blob([csvStringDataOutput], { type: 'text/csv' })); 
        auxiliaryDownloadAnchor.download = 'cmeed_export.csv'; 
        auxiliaryDownloadAnchor.click();
    } catch(err) { console.error("Export Error:", err); }
};

// Run Initialization Pipeline
initDuckDB();
