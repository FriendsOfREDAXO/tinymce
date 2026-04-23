/* ==================================================================
 *  for_chars_symbols – TinyMCE plugin (FriendsOfREDAXO)
 *  ------------------------------------------------------------------
 *  Ein vereinter Picker für:
 *   - Sonderzeichen (nach Kategorien, suchbar)
 *   - Native Emojis (nach Kategorien, suchbar, Skintone optional)
 *   - Typografie-Helfer (unsichtbare Zeichen, Ellipse, Gedankenstrich,
 *     korrekte Anführungszeichen für DE/DE-CH/EN/FR, Dash-/NBSP-
 *     Normalisierung auf der Selektion)
 *   - Favoriten (pro Browser via localStorage) + Zuletzt verwendet
 *
 *  Toolbar:     for_chars_symbols
 *  Menü:        for_chars_symbols
 *  Shortcut:    Strg/⌘ + Shift + I
 *  Commands:    forCharsSymbolsOpen
 *
 *  Optionale Editor-Parameter:
 *      for_chars_symbols_locale: 'de' | 'de-ch' | 'en' | 'fr'   (default: 'de')
 *      for_chars_symbols_autoreplace: true|false                (default: false)
 *
 *  Save-Strategie: Es werden echte Unicode-Zeichen eingefügt
 *  (—, „, ", …), außer bei sonst unsichtbaren Steuerzeichen:
 *  &shy; und &nbsp; werden als HTML-Entity eingefügt, damit sie
 *  im Quelltext erkennbar bleiben.
 *  ================================================================== */

(function () {
    'use strict';

    /* ---------------- Daten: Sonderzeichen ---------------- */

    var CHAR_GROUPS = [
        {
            name: 'Währung',
            items: [
                ['€', 'Euro'], ['$', 'US-Dollar'], ['£', 'Pfund'], ['¥', 'Yen / Yuan'],
                ['¢', 'Cent'], ['₣', 'Franc'], ['₤', 'Lira'], ['₩', 'Won'], ['₪', 'Schekel'],
                ['₫', 'Dong'], ['₱', 'Peso'], ['₲', 'Guaraní'], ['₴', 'Hrywnja'], ['₵', 'Cedi'],
                ['₹', 'Rupie'], ['₺', 'Lira (TR)'], ['₽', 'Rubel'], ['₡', 'Colón'], ['ƒ', 'Gulden']
            ]
        },
        {
            name: 'Mathematik',
            items: [
                ['±', 'Plus/Minus'], ['×', 'Mal'], ['÷', 'Geteilt'], ['=', 'Gleich'],
                ['≠', 'Ungleich'], ['≈', 'Ungefähr'], ['≡', 'Identisch'], ['≤', 'Kleiner-gleich'],
                ['≥', 'Größer-gleich'], ['∞', 'Unendlich'], ['√', 'Wurzel'], ['∑', 'Summe'],
                ['∏', 'Produkt'], ['∫', 'Integral'], ['∂', 'Partielle Ableitung'], ['∆', 'Delta'],
                ['π', 'Pi'], ['Ω', 'Omega'], ['µ', 'Mikro'], ['°', 'Grad'],
                ['′', 'Minute / Prime'], ['″', 'Sekunde / Doppelprime'], ['‰', 'Promille'],
                ['¼', 'Ein Viertel'], ['½', 'Ein Halb'], ['¾', 'Drei Viertel'],
                ['¹', 'Hoch 1'], ['²', 'Hoch 2'], ['³', 'Hoch 3']
            ]
        },
        {
            name: 'Pfeile',
            items: [
                ['←', 'Pfeil links'], ['→', 'Pfeil rechts'], ['↑', 'Pfeil oben'], ['↓', 'Pfeil unten'],
                ['↔', 'Pfeil links/rechts'], ['↕', 'Pfeil oben/unten'],
                ['⇐', 'Doppelpfeil links'], ['⇒', 'Doppelpfeil rechts'], ['⇑', 'Doppelpfeil oben'],
                ['⇓', 'Doppelpfeil unten'], ['⇔', 'Doppelpfeil links/rechts'],
                ['↩', 'Zurück'], ['↪', 'Vorwärts'], ['↻', 'Wiederholen'], ['↺', 'Rückgängig'],
                ['➜', 'Pfeil rechts (fett)'], ['➔', 'Pfeil rechts (schmal)']
            ]
        },
        {
            name: 'Typografie',
            items: [
                ['–', 'Halbgeviertstrich (en-dash)'], ['—', 'Geviertstrich (em-dash)'],
                ['…', 'Auslassungspunkte'], ['•', 'Bullet'], ['‣', 'Triangle bullet'],
                ['·', 'Mittelpunkt'], ['※', 'Hinweis'],
                ['¡', 'Ausrufezeichen invers'], ['¿', 'Fragezeichen invers'],
                ['©', 'Copyright'], ['®', 'Registered'], ['™', 'Trademark'],
                ['§', 'Paragraph'], ['¶', 'Absatz'], ['†', 'Dagger'], ['‡', 'Double Dagger'],
                ['№', 'Nummer'], ['℗', 'Produced'], ['℠', 'Service Mark']
            ]
        },
        {
            name: 'Anführungszeichen',
            items: [
                ['„', 'DE Anführung unten'], ['"', 'DE Anführung oben'],
                ['‚', 'DE Halbanführung unten'], ['\u2019', 'DE Halbanführung oben'],
                ['«', 'FR Guillemet links'], ['»', 'FR Guillemet rechts'],
                ['‹', 'FR Guillemet einfach links'], ['›', 'FR Guillemet einfach rechts'],
                ['\u201C', 'EN Anführung links'], ['\u201D', 'EN Anführung rechts'],
                ['\u2018', 'EN Halbanführung links'], ['\u2019', 'EN Halbanführung rechts'],
                ['"', 'Gerade doppelt'], ["'", 'Gerade einfach']
            ]
        },
        {
            name: 'Unsichtbar / Steuerzeichen',
            items: [
                ['\u00A0', 'Geschütztes Leerzeichen (nbsp)',            { invisible: true, glyph: '\u2423', hint: 'nbsp' }],
                ['\u2009', 'Schmales Leerzeichen (thinsp)',             { invisible: true, glyph: '\u2423', hint: 'thin' }],
                ['\u202F', 'Schmales geschütztes Leerzeichen (nnbsp)',  { invisible: true, glyph: '\u2423', hint: 'nnbsp' }],
                ['\u00AD', 'Weiches Trennzeichen (shy)',                { invisible: true, glyph: '\u00AC', hint: 'shy' }],
                ['\u200B', 'Zero-width space',                          { invisible: true, glyph: '\u25CC', hint: 'zwsp' }],
                ['\u200D', 'Zero-width joiner',                         { invisible: true, glyph: '\u25CC', hint: 'zwj' }],
                ['\u200C', 'Zero-width non-joiner',                     { invisible: true, glyph: '\u25CC', hint: 'zwnj' }],
                ['\u200E', 'Left-to-right Mark',                        { invisible: true, glyph: '\u2192', hint: 'lrm' }],
                ['\u200F', 'Right-to-left Mark',                        { invisible: true, glyph: '\u2190', hint: 'rlm' }]
            ]
        },
        {
            name: 'Griechisch',
            items: [
                ['α', 'alpha'], ['β', 'beta'], ['γ', 'gamma'], ['δ', 'delta'],
                ['ε', 'epsilon'], ['ζ', 'zeta'], ['η', 'eta'], ['θ', 'theta'],
                ['ι', 'iota'], ['κ', 'kappa'], ['λ', 'lambda'], ['μ', 'mu'],
                ['ν', 'nu'], ['ξ', 'xi'], ['ο', 'omikron'], ['π', 'pi'],
                ['ρ', 'rho'], ['σ', 'sigma'], ['τ', 'tau'], ['υ', 'ypsilon'],
                ['φ', 'phi'], ['χ', 'chi'], ['ψ', 'psi'], ['ω', 'omega'],
                ['Α', 'Alpha'], ['Β', 'Beta'], ['Γ', 'Gamma'], ['Δ', 'Delta'],
                ['Θ', 'Theta'], ['Λ', 'Lambda'], ['Π', 'Pi'], ['Σ', 'Sigma'],
                ['Φ', 'Phi'], ['Ψ', 'Psi'], ['Ω', 'Omega']
            ]
        }
    ];

    /* ---------------- Daten: Emojis (curated) ---------------- */

    var EMOJI_GROUPS = [
        {
            name: 'Smileys',
            items: [
                ['😀','grinning'],['😃','smiley'],['😄','smile'],['😁','grin'],['😆','laughing'],
                ['😅','sweat_smile'],['😂','joy'],['🤣','rofl'],['🙂','slight_smile'],['🙃','upside_down'],
                ['😉','wink'],['😊','blush'],['😇','innocent'],['🥰','smiling_face_with_hearts'],
                ['😍','heart_eyes'],['🤩','star_struck'],['😘','kissing_heart'],['😋','yum'],
                ['😛','stuck_out_tongue'],['😜','stuck_out_tongue_winking_eye'],['🤪','zany'],
                ['🤑','money_mouth'],['🤗','hugging'],['🤭','hand_over_mouth'],['🤫','shushing'],
                ['🤔','thinking'],['🤨','raised_eyebrow'],['😐','neutral'],['😑','expressionless'],
                ['😶','no_mouth'],['😏','smirk'],['😒','unamused'],['🙄','rolling_eyes'],
                ['😬','grimacing'],['😌','relieved'],['😔','pensive'],['😴','sleeping'],
                ['😷','mask'],['🤒','thermometer face'],['🤕','bandage'],['🤢','nauseated'],
                ['🤮','vomiting'],['🤧','sneezing'],['🥵','hot'],['🥶','cold'],['😵','dizzy'],
                ['🤯','exploding_head'],['🤠','cowboy'],['🥳','partying'],['😎','sunglasses'],
                ['🤓','nerd'],['🧐','monocle'],['😭','crying'],['😢','tear'],['😤','triumph'],
                ['😠','angry'],['😡','rage'],['🥺','pleading'],['🙏','pray'],['👻','ghost'],
                ['💀','skull'],['👽','alien'],['🤖','robot'],['💩','poop'],['😈','devil']
            ]
        },
        {
            name: 'Gesten',
            items: [
                ['👍','thumbs_up daumen hoch'],['👎','thumbs_down daumen runter'],['👌','ok'],
                ['🤏','pinch'],['✌️','victory'],['🤞','crossed_fingers'],['🤟','love_you'],
                ['🤘','rock'],['🤙','call_me'],['👈','left'],['👉','right'],['👆','up'],
                ['👇','down'],['☝️','index'],['✋','raised_hand'],['🤚','back_of_hand'],
                ['🖐️','open_hand'],['🖖','vulcan'],['👋','wave'],['🤝','handshake'],
                ['🙏','pray'],['💪','muscle'],['🙌','raising_hands'],['👏','clap'],['🫶','heart_hands']
            ]
        },
        {
            name: 'Menschen',
            items: [
                ['👶','baby'],['🧒','child'],['👦','boy'],['👧','girl'],['🧑','person'],
                ['👨','man'],['👩','woman'],['🧓','older'],['👴','grandpa'],['👵','grandma'],
                ['🙋','raising_hand'],['🤷','shrug'],['🙅','no_good'],['🙆','ok_person'],
                ['💁','tipping_hand'],['🙇','bowing'],['🤦','facepalm']
            ]
        },
        {
            name: 'Tiere',
            items: [
                ['🐶','dog'],['🐱','cat'],['🐭','mouse'],['🐹','hamster'],['🐰','rabbit'],
                ['🦊','fox'],['🐻','bear'],['🐼','panda'],['🐨','koala'],['🐯','tiger'],
                ['🦁','lion'],['🐮','cow'],['🐷','pig'],['🐸','frog'],['🐵','monkey'],
                ['🙈','see_no_evil'],['🐔','chicken'],['🐧','penguin'],['🦅','eagle'],
                ['🦉','owl'],['🦇','bat'],['🐺','wolf'],['🐴','horse'],['🦓','zebra'],
                ['🦒','giraffe'],['🐘','elephant'],['🐪','camel'],['🐝','bee'],['🐛','bug'],
                ['🦋','butterfly'],['🐌','snail'],['🐞','ladybug'],['🐜','ant'],['🦂','scorpion'],
                ['🐙','octopus'],['🦑','squid'],['🐠','fish'],['🐟','tropical_fish'],['🐬','dolphin'],
                ['🐳','whale'],['🦈','shark']
            ]
        },
        {
            name: 'Essen',
            items: [
                ['🍎','apple'],['🍐','pear'],['🍊','orange'],['🍋','lemon'],['🍌','banana'],
                ['🍉','watermelon'],['🍇','grapes'],['🍓','strawberry'],['🫐','blueberries'],
                ['🍒','cherries'],['🍑','peach'],['🥭','mango'],['🍍','pineapple'],['🥥','coconut'],
                ['🥝','kiwi'],['🍅','tomato'],['🍆','eggplant'],['🥑','avocado'],['🥦','broccoli'],
                ['🥕','carrot'],['🌽','corn'],['🌶️','chili'],['🥔','potato'],['🧄','garlic'],
                ['🧅','onion'],['🍞','bread'],['🥐','croissant'],['🧀','cheese'],['🥚','egg'],
                ['🍳','cooking'],['🥞','pancakes'],['🥩','steak'],['🍔','burger'],['🍟','fries'],
                ['🍕','pizza'],['🌮','taco'],['🌯','burrito'],['🥗','salad'],['🍝','spaghetti'],
                ['🍜','ramen'],['🍣','sushi'],['🍱','bento'],['🍪','cookie'],['🎂','birthday_cake'],
                ['🍰','cake'],['🧁','cupcake'],['🍩','doughnut'],['🍿','popcorn'],['🍫','chocolate'],
                ['☕','coffee'],['🫖','teapot'],['🍵','tea'],['🥤','drink'],['🧋','bubble_tea'],
                ['🍺','beer'],['🍷','wine'],['🥂','clinking_glasses'],['🍾','champagne']
            ]
        },
        {
            name: 'Reisen',
            items: [
                ['🚗','car'],['🚕','taxi'],['🚌','bus'],['🏎️','racing_car'],['🚓','police_car'],
                ['🚑','ambulance'],['🚒','fire_engine'],['🚚','delivery_truck'],['🚜','tractor'],
                ['🛴','scooter'],['🚲','bicycle'],['🛵','motor_scooter'],['🏍️','motorcycle'],
                ['🚨','police_light'],['🚆','train'],['🚇','metro'],['🚊','tram'],['🚄','high_speed_train'],
                ['✈️','airplane'],['🛫','takeoff'],['🛬','landing'],['🚀','rocket'],['🛸','ufo'],
                ['🚁','helicopter'],['⛵','sailboat'],['🚤','speedboat'],['🛳️','cruise_ship'],
                ['🚢','ship'],['⚓','anchor'],['⛽','fuel'],['🚧','construction'],['🚦','traffic_light'],
                ['🏁','checkered_flag'],['🗺️','map']
            ]
        },
        {
            name: 'Objekte',
            items: [
                ['📱','phone'],['💻','laptop'],['⌨️','keyboard'],['🖥️','desktop'],['🖨️','printer'],
                ['🖱️','mouse'],['💾','floppy'],['💿','cd'],['📀','dvd'],['📷','camera'],
                ['📹','videocamera'],['🎥','movie_camera'],['🎞️','film_strip'],['📞','phone_receiver'],
                ['📺','tv'],['📻','radio'],['🎙️','mic'],['⏰','alarm_clock'],['⌛','hourglass'],
                ['⏳','hourglass_flowing'],['🔋','battery'],['🔌','plug'],['💡','bulb'],
                ['🔦','flashlight'],['🕯️','candle'],['💸','money_with_wings'],['💵','dollar_banknote'],
                ['💴','yen_banknote'],['💶','euro_banknote'],['💷','pound_banknote'],['🪙','coin'],
                ['💰','money_bag'],['💳','credit_card'],['💎','diamond'],['⚖️','balance'],
                ['🔧','wrench'],['🔨','hammer'],['🛠️','hammer_and_wrench'],['⛏️','pick'],
                ['🔩','nut_and_bolt'],['⚙️','gear'],['🧲','magnet'],['🔭','telescope'],
                ['🔬','microscope'],['💊','pill'],['💉','syringe'],['🩸','blood'],['🌡️','thermometer']
            ]
        },
        {
            name: 'Symbole',
            items: [
                ['❤️','red_heart'],['🧡','orange_heart'],['💛','yellow_heart'],['💚','green_heart'],
                ['💙','blue_heart'],['💜','purple_heart'],['🖤','black_heart'],['🤍','white_heart'],
                ['🤎','brown_heart'],['💔','broken_heart'],['💕','two_hearts'],['💞','revolving_hearts'],
                ['💖','sparkling_heart'],['💘','heart_arrow'],['💝','heart_ribbon'],['💟','heart_decoration'],
                ['☮️','peace'],['✝️','cross'],['☸️','dharma'],['✡️','star_of_david'],['☯️','yin_yang'],
                ['⚛️','atom'],['☢️','radioactive'],['☣️','biohazard'],['❌','x'],['⭕','o'],['🛑','stop'],
                ['⛔','no_entry'],['🚫','prohibited'],['💯','100'],['‼️','exclamation_double'],
                ['⁉️','interrobang'],['⚠️','warning'],['🔰','beginner'],['♻️','recycling'],
                ['✅','check_mark'],['✔️','heavy_check'],['☑️','ballot_check'],['⭐','star'],
                ['🌟','glowing_star'],['🔥','fire'],['💥','boom'],['💢','anger'],['💤','zzz'],
                ['🔔','bell'],['🔕','bell_off'],['🎵','note'],['🎶','notes'],['💬','speech'],
                ['💭','thought'],['🗯️','anger_bubble']
            ]
        },
        {
            name: 'Flaggen',
            items: [
                ['🇩🇪','deutschland'],['🇦🇹','österreich'],['🇨🇭','schweiz'],['🇪🇺','eu'],
                ['🇬🇧','uk'],['🇺🇸','usa'],['🇫🇷','frankreich'],['🇮🇹','italien'],['🇪🇸','spanien'],
                ['🇳🇱','niederlande'],['🇧🇪','belgien'],['🇵🇱','polen'],['🇨🇿','tschechien'],
                ['🇭🇺','ungarn'],['🇩🇰','dänemark'],['🇸🇪','schweden'],['🇳🇴','norwegen'],
                ['🇫🇮','finnland'],['🇮🇸','island'],['🇮🇪','irland'],['🇵🇹','portugal'],
                ['🇬🇷','griechenland'],['🇹🇷','türkei'],['🇺🇦','ukraine'],['🇯🇵','japan'],
                ['🇨🇳','china'],['🇰🇷','korea'],['🇮🇳','indien'],['🇧🇷','brasilien'],['🇨🇦','kanada'],
                ['🇦🇺','australien'],['🇲🇽','mexiko'],['🏳️','weiße_flagge'],['🏴','schwarze_flagge'],
                ['🏳️‍🌈','regenbogen'],['🏴‍☠️','pirat']
            ]
        }
    ];

    /* ---------------- Typografie-Helfer ---------------- */

    var HELPER_INSERTS = [
        { label: 'Geschütztes Leerzeichen (nbsp)', value: '\u00A0', invisible: true, glyph: '\u2423' },
        { label: 'Schmales geschütztes Leerzeichen (nnbsp)', value: '\u202F', invisible: true, glyph: '\u2423' },
        { label: 'Weiches Trennzeichen (shy)', value: '\u00AD', invisible: true, glyph: '\u00AC' },
        { label: 'Halbgeviertstrich (en-dash)', value: '\u2013' },
        { label: 'Geviertstrich (em-dash)', value: '\u2014' },
        { label: 'Auslassungspunkte', value: '\u2026' },
        { label: 'Copyright', value: '\u00A9' },
        { label: 'Registered', value: '\u00AE' },
        { label: 'Trademark', value: '\u2122' }
    ];

    var HELPER_ACTIONS = [
        { id: 'quotes_de',    label: 'Markierung in „deutsche Anführungszeichen" setzen' },
        { id: 'quotes_dech',  label: 'Markierung in «Schweizer Anführungszeichen» setzen' },
        { id: 'quotes_en',    label: 'Markierung in "englische Anführungszeichen" setzen' },
        { id: 'quotes_fr',    label: 'Markierung in « französische Anführungszeichen » setzen' },
        { id: 'normalize',    label: 'Typografie normalisieren (Dashes, Ellipse, Quotes, ...)' },
        { id: 'dash_numbers', label: 'Bindestriche in Zahlenbereichen → en-dash (1990-2000 → 1990–2000)' },
        { id: 'nbsp_units',   label: 'Geschütztes Leerzeichen vor Einheiten setzen (5 kg → 5 kg)' },
        { id: 'softhyphen',   label: 'Weiche Trennstellen in langen Wörtern vorschlagen' },
        { id: 'find_wrong',   label: 'Typografische „Sünden" im Editor visuell markieren' }
    ];

    /* ---------------- Storage: Favoriten + Recent ---------------- */

    var LS_FAV = 'forCharsSymbols.favs';
    var LS_RECENT = 'forCharsSymbols.recent';
    var RECENT_MAX = 24;

    function readLs(key) {
        try { return JSON.parse(window.localStorage.getItem(key) || '[]'); }
        catch (_e) { return []; }
    }
    function writeLs(key, list) {
        try { window.localStorage.setItem(key, JSON.stringify(list.slice(0, 120))); }
        catch (_e) { /* quota / private mode – ignore */ }
    }
    function getFavs()   { return readLs(LS_FAV); }
    function getRecent() { return readLs(LS_RECENT); }

    function sameItem(a, b) {
        return a && b && a.kind === b.kind && a.value === b.value;
    }
    function toggleFav(item) {
        var list = getFavs();
        var idx = -1;
        for (var i = 0; i < list.length; i++) { if (sameItem(list[i], item)) { idx = i; break; } }
        if (idx >= 0) { list.splice(idx, 1); }
        else { list.unshift(item); }
        writeLs(LS_FAV, list);
        return idx < 0; // true, wenn neu aufgenommen
    }
    function isFav(item) {
        var list = getFavs();
        for (var i = 0; i < list.length; i++) { if (sameItem(list[i], item)) { return true; } }
        return false;
    }
    function addRecent(item) {
        var list = getRecent();
        for (var i = list.length - 1; i >= 0; i--) { if (sameItem(list[i], item)) { list.splice(i, 1); } }
        list.unshift(item);
        if (list.length > RECENT_MAX) { list.length = RECENT_MAX; }
        writeLs(LS_RECENT, list);
    }

    /* ---------------- Typografie-Transformationen ---------------- */

    var QUOTE_PRESETS = {
        de:    { open: '\u201E', close: '\u201C', innerOpen: '\u201A', innerClose: '\u2018' },
        'de-ch': { open: '\u00AB', close: '\u00BB', innerOpen: '\u2039', innerClose: '\u203A' },
        en:    { open: '\u201C', close: '\u201D', innerOpen: '\u2018', innerClose: '\u2019' },
        fr:    { open: '\u00AB\u00A0', close: '\u00A0\u00BB', innerOpen: '\u2039\u00A0', innerClose: '\u00A0\u203A' }
    };

    function wrapQuotes(text, locale) {
        var q = QUOTE_PRESETS[locale] || QUOTE_PRESETS.de;
        // Innere gerade Quotes hochleveln.
        var inner = text.replace(/"([^"]*)"/g, q.innerOpen + '$1' + q.innerClose)
                        .replace(/'([^']*)'/g, q.innerOpen + '$1' + q.innerClose);
        return q.open + inner + q.close;
    }

    // Unit-Liste für NBSP vor Einheiten.
    var UNITS = ['kg','g','mg','µg','t','l','ml','cl','dl','m','cm','mm','km','km/h','mph',
                 'h','min','s','ms','Hz','kHz','MHz','GHz','%','\u2030','\u00B0C','\u00B0F','K',
                 'W','kW','MW','V','mV','A','mA','\u03A9','\u00B0','\u20AC','EUR','USD','CHF','GBP'];

    function insertNbspBeforeUnits(text) {
        var pattern = new RegExp('(\\d)\\s+(' + UNITS.map(escRegex).join('|') + ')\\b', 'g');
        return text.replace(pattern, '$1\u00A0$2');
    }
    function escRegex(s) { return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); }

    function enDashNumberRanges(text) {
        // 1990-2000, aber nicht in Bindestrich-Wörtern wie „E-Mail".
        return text.replace(/(\d)\s?-\s?(\d)/g, '$1\u2013$2');
    }

    function normalizeTypography(text, locale) {
        var out = text;
        // Dreipunkt → Ellipse.
        out = out.replace(/\.{3}/g, '\u2026');
        // Doppelter Bindestrich → em-dash.
        out = out.replace(/--/g, '\u2014');
        // Zahlenbereiche → en-dash.
        out = enDashNumberRanges(out);
        // Falsch gerade doppelte Quotes → locale-spezifisch (paarweise).
        var q = QUOTE_PRESETS[locale] || QUOTE_PRESETS.de;
        var flip = true;
        out = out.replace(/"/g, function () { flip = !flip; return flip ? q.close : q.open; });
        flip = true;
        out = out.replace(/'/g, function () { flip = !flip; return flip ? q.innerClose : q.innerOpen; });
        // Doppelte Spaces reduzieren.
        out = out.replace(/ {2,}/g, ' ');
        // NBSP vor Einheiten.
        out = insertNbspBeforeUnits(out);
        // z. B. / z.B. → z.\u00a0B.
        out = out.replace(/\bz\.\s?B\./g, 'z.\u00A0B.').replace(/\bd\.\s?h\./g, 'd.\u00A0h.').replace(/\bu\.\s?a\./g, 'u.\u00A0a.');
        return out;
    }

    function suggestSoftHyphens(text) {
        // Brich nur lange Wörter (>10 Zeichen) an typischen Silbengrenzen.
        return text.replace(/[A-Za-zÄÖÜäöüß]{11,}/g, function (word) {
            var out = '';
            for (var i = 0; i < word.length; i++) {
                out += word[i];
                if (i > 2 && i < word.length - 3 && (i - 3) % 4 === 0) {
                    out += '\u00AD'; // soft hyphen
                }
            }
            return out;
        });
    }

    function highlightWrongTypography(body) {
        if (!body) { return 0; }
        var html = body.innerHTML;
        var count = 0;
        var patterns = [
            { re: /(?<!class="[^"]*fcs-warn[^"]*")"[^"<>]{1,200}?"/g, msg: 'Gerade "Anführungszeichen"' },
            { re: /'[^'<>\n]{1,80}'/g, msg: "Gerade 'Halbanführungszeichen'" },
            { re: /\.{3}/g, msg: 'Dreipunkt statt Ellipse' },
            { re: /--/g, msg: 'Doppelter Bindestrich statt Gedankenstrich' },
            { re: / {2,}/g, msg: 'Doppelte Leerzeichen' }
        ];
        // Primitive Ersetzung – wir kapseln passende Textpassagen in <span class="fcs-warn">.
        // Achtung: Das passiert im Dom des Editors (Save würde die Spans mitnehmen), deshalb
        // fügen wir eine data-mce-temp Marker-Klasse nach, die beim Save wieder entfernt werden kann.
        html = html.replace(/>([^<]+)</g, function (_m, textSeg) {
            var seg = textSeg;
            patterns.forEach(function (p) {
                seg = seg.replace(p.re, function (hit) {
                    count++;
                    return '<span class="fcs-warn" data-mce-bogus="1" title="' + p.msg.replace(/"/g,'&quot;') + '">' + hit + '</span>';
                });
            });
            return '>' + seg + '<';
        });
        body.innerHTML = html;
        return count;
    }

    /* ---------------- HTML-Panels (für TinyMCE Dialog) ---------------- */

    function esc(s) {
        return String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;')
            .replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/'/g, '&#039;');
    }

    function cellHtml(kind, rawValue, label, extra) {
        extra = extra || {};
        var display = extra.invisible ? (extra.glyph || '\u2423') : esc(rawValue);
        var title = esc(label + ' · U+' + rawValue.codePointAt(0).toString(16).toUpperCase());
        return '<div class="fcs-cell" role="gridcell">'
            + '<button type="button" class="fcs-btn" title="' + title + '"'
            +   ' data-fcs-insert="' + esc(rawValue) + '"'
            +   ' data-fcs-kind="' + esc(kind) + '"'
            +   ' data-fcs-label="' + esc(label) + '"'
            +   (extra.invisible ? ' data-fcs-invisible="1"' : '')
            +   (extra.hint ? ' data-fcs-hint="' + esc(extra.hint) + '"' : '')
            + '>'
            +   '<span class="fcs-glyph' + (extra.invisible ? ' fcs-glyph--invisible' : '') + '" aria-hidden="true">' + display + '</span>'
            +   '<span class="fcs-name">' + esc(label) + '</span>'
            + '</button>'
            + '<button type="button" class="fcs-fav" aria-label="Favorit umschalten"'
            +   ' data-fcs-fav-toggle="1"'
            +   ' data-fcs-kind="' + esc(kind) + '"'
            +   ' data-fcs-value="' + esc(rawValue) + '"'
            +   ' data-fcs-label="' + esc(label) + '"'
            +   (extra.invisible ? ' data-fcs-invisible="1"' : '')
            +   (extra.hint ? ' data-fcs-hint="' + esc(extra.hint) + '"' : '')
            + '></button>'
            + '</div>';
    }

    function groupsHtml(kind, groups) {
        var html = ''
            + '<div class="fcs-searchbar">'
            +   '<input type="search" class="fcs-search" data-fcs-search placeholder="Suchen (Name, Zeichen, Codepoint) …" />'
            + '</div>';
        groups.forEach(function (g) {
            html += '<section class="fcs-group" data-fcs-group="' + esc(g.name) + '">';
            html += '<h4 class="fcs-group-title">' + esc(g.name) + '</h4>';
            html += '<div class="fcs-grid" role="grid">';
            g.items.forEach(function (it) {
                var val = it[0];
                var lbl = it[1];
                var extra = it[2] || {};
                html += cellHtml(kind, val, lbl, extra);
            });
            html += '</div></section>';
        });
        return html;
    }

    function charsPanelHtml() {
        // Favoriten + Zuletzt verwendet werden als kompakte Sektionen vor die Zeichen-Gruppen gesetzt.
        return ''
            + '<div data-fcs-favs-section>' + favsBlockHtml() + '</div>'
            + '<div data-fcs-recent-section>' + recentBlockHtml() + '</div>'
            + groupsHtml('char', CHAR_GROUPS);
    }
    function emojiPanelHtml() { return groupsHtml('emoji', EMOJI_GROUPS); }

    function favsBlockHtml() {
        var favs = getFavs();
        if (!favs.length) { return ''; }
        var html = '<section class="fcs-group fcs-group--pinned" data-fcs-pinned="favs">';
        html += '<h4 class="fcs-group-title"><span class="fcs-pin-icon" aria-hidden="true">★</span> Favoriten</h4>';
        html += '<div class="fcs-grid">';
        favs.forEach(function (f) { html += cellHtml(f.kind, f.value, f.label, { invisible: !!f.invisible, glyph: f.glyph, hint: f.hint }); });
        html += '</div></section>';
        return html;
    }

    function recentBlockHtml() {
        var recent = getRecent();
        if (!recent.length) { return ''; }
        var html = '<section class="fcs-group fcs-group--pinned" data-fcs-pinned="recent">';
        html += '<h4 class="fcs-group-title"><span class="fcs-pin-icon" aria-hidden="true">⏱</span> Zuletzt verwendet</h4>';
        html += '<div class="fcs-grid">';
        recent.forEach(function (f) { html += cellHtml(f.kind, f.value, f.label, { invisible: !!f.invisible, glyph: f.glyph, hint: f.hint }); });
        html += '</div></section>';
        return html;
    }

    function refreshFavsAndRecent(root) {
        root.querySelectorAll('[data-fcs-favs-section]').forEach(function (el) { el.innerHTML = favsBlockHtml(); });
        root.querySelectorAll('[data-fcs-recent-section]').forEach(function (el) { el.innerHTML = recentBlockHtml(); });
        refreshFavsIndicators(root);
    }

    function helpersPanelHtml() {
        var html = '<div class="fcs-helpers">';
        html += '<h4 class="fcs-group-title">Einfügen</h4>';
        html += '<div class="fcs-list">';
        HELPER_INSERTS.forEach(function (h) {
            var display = h.invisible ? (h.glyph || '\u2423') : esc(h.value);
            html += '<div class="fcs-row">'
                + '<button type="button" class="fcs-row-btn"'
                + ' data-fcs-insert="' + esc(h.value) + '"'
                + ' data-fcs-kind="helper"'
                + ' data-fcs-label="' + esc(h.label) + '"'
                + (h.invisible ? ' data-fcs-invisible="1"' : '')
                + ' title="' + esc(h.label) + '">'
                + '<span class="fcs-glyph' + (h.invisible ? ' fcs-glyph--invisible' : '') + '" aria-hidden="true">' + display + '</span>'
                + '<span class="fcs-name">' + esc(h.label) + '</span>'
                + '</button>'
                + '<button type="button" class="fcs-fav" aria-label="Favorit umschalten"'
                + ' data-fcs-fav-toggle="1" data-fcs-kind="helper"'
                + ' data-fcs-value="' + esc(h.value) + '"'
                + ' data-fcs-label="' + esc(h.label) + '"'
                + (h.invisible ? ' data-fcs-invisible="1"' : '')
                + '></button>'
                + '</div>';
        });
        html += '</div>';

        html += '<h4 class="fcs-group-title">Aktionen auf der Markierung</h4>';
        html += '<div class="fcs-actions">';
        HELPER_ACTIONS.forEach(function (a) {
            html += '<button type="button" class="fcs-action" data-fcs-action="' + esc(a.id) + '">'
                + esc(a.label) + '</button>';
        });
        html += '</div>';
        html += '<p class="fcs-hint">Tipp: Text im Editor markieren, dann hier auf eine Aktion klicken. Das Ergebnis ist per „Rückgängig" umkehrbar.</p>';
        html += '</div>';
        return html;
    }

    function favsPanelHtml() {
        // Legacy – wird nicht mehr als eigener Tab verwendet. Favs/Recent leben jetzt im "Zeichen"-Tab.
        return favsBlockHtml() + recentBlockHtml();
    }

    /* ---------------- CSS (einmalig in document.head) ---------------- */

    var CSS = '\
.fcs-panel{position:fixed;z-index:100100;width:460px;max-width:95vw;max-height:80vh;display:flex;flex-direction:column;background:#fff;color:#222;border:1px solid rgba(0,0,0,.15);border-radius:6px;box-shadow:0 10px 40px rgba(0,0,0,.25);font:13px/1.4 -apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif}\
.fcs-panel[hidden]{display:none!important}\
.fcs-panel__head{display:flex;align-items:center;gap:8px;padding:8px 10px;border-bottom:1px solid rgba(0,0,0,.08);cursor:move;user-select:none;background:linear-gradient(#fafafa,#f1f1f1);border-radius:6px 6px 0 0}\
.fcs-panel__title{flex:1;font-weight:600;font-size:13px}\
.fcs-panel__close{border:0;background:transparent;font-size:18px;line-height:1;cursor:pointer;width:24px;height:24px;border-radius:50%;color:#666}\
.fcs-panel__close:hover{background:rgba(0,0,0,.08);color:#222}\
.fcs-panel__tabs{display:flex;gap:2px;padding:6px 8px 0;border-bottom:1px solid rgba(0,0,0,.06);background:#f7f7f7}\
.fcs-panel__tab{border:0;background:transparent;padding:6px 12px;cursor:pointer;font:inherit;color:#555;border-radius:4px 4px 0 0;border:1px solid transparent;border-bottom:0;margin-bottom:-1px}\
.fcs-panel__tab:hover{background:rgba(0,0,0,.04)}\
.fcs-panel__tab.is-active{background:#fff;border-color:rgba(0,0,0,.08);color:#222;font-weight:600}\
.fcs-panel__body{flex:1;overflow:auto;padding:10px 12px}\
.fcs-panel__pane{display:none}\
.fcs-panel__pane.is-active{display:block}\
.fcs-searchbar{position:sticky;top:-10px;z-index:2;background:#fff;padding:8px 0;margin:-10px 0 8px;border-bottom:1px solid rgba(0,0,0,.06)}\
.fcs-search{width:100%;box-sizing:border-box;padding:6px 10px;border:1px solid rgba(0,0,0,.15);border-radius:4px;font:inherit}\
.fcs-group-title{margin:14px 0 6px;font-size:11px;text-transform:uppercase;letter-spacing:.04em;color:#666;font-weight:600}\
.fcs-group--pinned{background:rgba(246,166,35,.06);border:1px solid rgba(246,166,35,.2);border-radius:6px;padding:6px 10px 8px;margin-bottom:10px}\
.fcs-group--pinned .fcs-group-title{margin-top:2px;color:#b07a16}\
.fcs-pin-icon{color:#f6a623;margin-right:4px}\
body.rex-theme-dark .fcs-group--pinned{background:rgba(246,166,35,.08);border-color:rgba(246,166,35,.28)}\
body.rex-theme-dark .fcs-group--pinned .fcs-group-title{color:#f6c772}\
.fcs-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(64px,1fr));gap:4px}\
.fcs-cell{position:relative;display:flex}\
.fcs-btn{flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:4px;padding:8px 4px;background:transparent;border:1px solid transparent;border-radius:4px;cursor:pointer;min-height:60px;color:inherit;font:inherit;text-align:center;overflow:hidden}\
.fcs-btn:hover,.fcs-btn:focus-visible{background:rgba(75,154,217,.12);border-color:rgba(75,154,217,.4);outline:none}\
.fcs-glyph{font-size:22px;line-height:1;min-height:22px;display:inline-block}\
.fcs-glyph--invisible{color:#8a94a3;font-weight:400;opacity:.8}\
.fcs-name{font-size:11px;line-height:1.25;color:#666;word-break:break-word}\
.fcs-fav{position:absolute;top:2px;right:2px;width:20px;height:20px;border:0;background:transparent;color:#c0c4ca;cursor:pointer;padding:0;font-size:14px;line-height:20px;text-align:center;border-radius:50%}\
.fcs-fav:hover{color:#f6a623;background:rgba(246,166,35,.12)}\
.fcs-fav.is-fav{color:#f6a623}\
.fcs-fav::before{content:"☆"}\
.fcs-fav.is-fav::before{content:"★"}\
.fcs-list{display:flex;flex-direction:column;gap:2px}\
.fcs-row{position:relative;display:flex;align-items:stretch}\
.fcs-row-btn{flex:1;display:flex;align-items:center;gap:12px;padding:6px 32px 6px 10px;background:transparent;border:1px solid transparent;border-radius:4px;cursor:pointer;font:inherit;color:inherit;text-align:left;min-height:36px}\
.fcs-row-btn:hover,.fcs-row-btn:focus-visible{background:rgba(75,154,217,.12);border-color:rgba(75,154,217,.4);outline:none}\
.fcs-row-btn .fcs-glyph{font-size:16px;min-width:24px;text-align:center}\
.fcs-row-btn .fcs-name{font-size:12px;color:#333;flex:1}\
.fcs-row .fcs-fav{top:50%;transform:translateY(-50%);right:6px}\
.fcs-actions{display:flex;flex-wrap:wrap;gap:6px}\
.fcs-action{padding:6px 10px;border:1px solid rgba(0,0,0,.15);background:#fafafa;border-radius:4px;cursor:pointer;font:inherit;color:inherit}\
.fcs-action:hover{background:#eef4fb;border-color:#4b9ad9}\
.fcs-hint{color:#666;font-size:12px;margin:8px 0 0}\
.fcs-hide{display:none!important}\
body.rex-theme-dark .fcs-panel{background:#23272e;color:#e6e9ef;border-color:#3a3e47}\
body.rex-theme-dark .fcs-panel__head{background:linear-gradient(#2a2e36,#23272e);border-bottom-color:#3a3e47}\
body.rex-theme-dark .fcs-panel__close{color:#a9b0bc}\
body.rex-theme-dark .fcs-panel__close:hover{background:rgba(255,255,255,.08);color:#fff}\
body.rex-theme-dark .fcs-panel__tabs{background:#1e2127;border-bottom-color:#3a3e47}\
body.rex-theme-dark .fcs-panel__tab{color:#a9b0bc}\
body.rex-theme-dark .fcs-panel__tab:hover{background:rgba(255,255,255,.05)}\
body.rex-theme-dark .fcs-panel__tab.is-active{background:#23272e;border-color:#3a3e47;color:#fff}\
body.rex-theme-dark .fcs-searchbar{background:#23272e}\
body.rex-theme-dark .fcs-search{background:#1e2127;border-color:#3a3e47;color:#e6e9ef}\
body.rex-theme-dark .fcs-name,body.rex-theme-dark .fcs-hint,body.rex-theme-dark .fcs-group-title{color:#a9b0bc}\
body.rex-theme-dark .fcs-row-btn .fcs-name{color:#dde2ea}\
body.rex-theme-dark .fcs-btn:hover,body.rex-theme-dark .fcs-btn:focus-visible,body.rex-theme-dark .fcs-row-btn:hover,body.rex-theme-dark .fcs-row-btn:focus-visible{background:rgba(90,170,230,.18)}\
body.rex-theme-dark .fcs-glyph--invisible{color:#7a8599}\
body.rex-theme-dark .fcs-action{background:#2b2e34;border-color:#3a3e47;color:#dde2ea}\
body.rex-theme-dark .fcs-action:hover{background:#33414f;border-color:#4b9ad9}\
@media (prefers-color-scheme: dark){body.rex-has-theme:not(.rex-theme-light) .fcs-panel{background:#23272e;color:#e6e9ef;border-color:#3a3e47}body.rex-has-theme:not(.rex-theme-light) .fcs-name,body.rex-has-theme:not(.rex-theme-light) .fcs-hint,body.rex-has-theme:not(.rex-theme-light) .fcs-group-title{color:#a9b0bc}}\
';

    var EDITOR_CSS = '\
.fcs-warn{background:rgba(246,166,35,.25);outline:1px dashed rgba(246,166,35,.8);border-radius:2px}\
.fcs-inv-mark{background:rgba(75,154,217,.18);border-radius:2px;color:#4b6fa5;font-weight:600;padding:0 1px;outline:1px dashed rgba(75,154,217,.4)}\
.fcs-inv-mark::before{content:attr(data-fcs-inv-label);font-size:.75em;opacity:.9}\
';

    var cssInjected = false;
    function ensureCss() {
        if (cssInjected) { return; }
        var style = document.createElement('style');
        style.setAttribute('data-fcs-style', '1');
        style.textContent = CSS;
        document.head.appendChild(style);
        cssInjected = true;
    }

    /* ---------------- Insert-Helfer ---------------- */

    function renderAndInsert(editor, value) {
        // Echte Unicode-Zeichen einfügen (keine HTML-Entities, damit nichts escaped wird).
        editor.insertContent(value);
    }

    function performAction(editor, actionId) {
        var locale = (editor.getParam('for_chars_symbols_locale') || 'de').toLowerCase();
        var selection = editor.selection;
        var content = selection.getContent({ format: 'text' });

        switch (actionId) {
            case 'quotes_de':   selection.setContent(esc(wrapQuotes(content || '', 'de'))); break;
            case 'quotes_dech': selection.setContent(esc(wrapQuotes(content || '', 'de-ch'))); break;
            case 'quotes_en':   selection.setContent(esc(wrapQuotes(content || '', 'en'))); break;
            case 'quotes_fr':   selection.setContent(esc(wrapQuotes(content || '', 'fr'))); break;
            case 'normalize':   selection.setContent(esc(normalizeTypography(content || '', locale))); break;
            case 'dash_numbers':selection.setContent(esc(enDashNumberRanges(content || ''))); break;
            case 'nbsp_units':  selection.setContent(esc(insertNbspBeforeUnits(content || ''))); break;
            case 'softhyphen':  selection.setContent(esc(suggestSoftHyphens(content || ''))); break;
            case 'find_wrong':
                var body = editor.getBody();
                var n = highlightWrongTypography(body);
                editor.windowManager.alert(n + ' typografische Hinweise markiert. Rückgängig über Strg+Z.');
                break;
            default: break;
        }
        if (actionId !== 'find_wrong' && !content) {
            // Leichter Hinweis statt blockierender Alert – das Panel bleibt offen.
            try { editor.notificationManager.open({ text: 'Kein Text markiert.', type: 'info', timeout: 2500 }); } catch (_e) {}
        }
    }

    /* ---------------- Live-Suche ---------------- */

    function applyFilter(root, query) {
        var q = query.trim().toLowerCase();
        var groups = root.querySelectorAll('[data-fcs-group]');
        groups.forEach(function (g) {
            var cells = g.querySelectorAll('.fcs-cell');
            var anyVisible = false;
            cells.forEach(function (cell) {
                if (!q) { cell.classList.remove('fcs-hide'); anyVisible = true; return; }
                var btn = cell.querySelector('.fcs-btn');
                var label = (btn.getAttribute('data-fcs-label') || '').toLowerCase();
                var value = (btn.getAttribute('data-fcs-insert') || '').toLowerCase();
                var cp = '';
                try { cp = 'u+' + value.codePointAt(0).toString(16).toUpperCase(); } catch (_e) {}
                var hit = label.indexOf(q) >= 0 || value.indexOf(q) >= 0 || cp.toLowerCase().indexOf(q) >= 0;
                if (hit) { cell.classList.remove('fcs-hide'); anyVisible = true; }
                else { cell.classList.add('fcs-hide'); }
            });
            g.classList.toggle('fcs-hide', !anyVisible);
        });
    }

    /* ---------------- Dialog öffnen ---------------- */

    function refreshFavsIndicators(root) {
        root.querySelectorAll('[data-fcs-fav-toggle]').forEach(function (btn) {
            var item = {
                kind: btn.getAttribute('data-fcs-kind'),
                value: btn.getAttribute('data-fcs-value'),
                label: btn.getAttribute('data-fcs-label'),
                invisible: btn.getAttribute('data-fcs-invisible') === '1' || undefined,
                hint: btn.getAttribute('data-fcs-hint') || undefined
            };
            btn.classList.toggle('is-fav', isFav(item));
        });
    }

    /* ---------------- Floating Panel (draggable, non-modal) ---------------- */

    var TABS = [
        { id: 'chars',   title: 'Zeichen',     render: charsPanelHtml },
        { id: 'emoji',   title: 'Emoji',       render: emojiPanelHtml },
        { id: 'helpers', title: 'Typografie',  render: helpersPanelHtml }
    ];

    // Ein Panel pro Editor (Instanzen nicht doppeln).
    var panelsByEditor = new WeakMap();

    function buildPanel(editor) {
        var root = document.createElement('div');
        root.className = 'fcs-panel';
        root.setAttribute('role', 'dialog');
        root.setAttribute('aria-label', 'Zeichen, Symbole & Emoji');

        var tabsHtml = TABS.map(function (t, i) {
            return '<button type="button" class="fcs-panel__tab' + (i === 0 ? ' is-active' : '') + '" data-fcs-tab="' + t.id + '">' + esc(t.title) + '</button>';
        }).join('');

        var panesHtml = TABS.map(function (t, i) {
            return '<div class="fcs-panel__pane' + (i === 0 ? ' is-active' : '') + '" data-fcs-pane="' + t.id + '">' + t.render() + '</div>';
        }).join('');

        root.innerHTML = ''
            + '<div class="fcs-panel__head" data-fcs-drag>'
            +   '<span class="fcs-panel__title">Zeichen, Symbole &amp; Emoji</span>'
            +   '<button type="button" class="fcs-panel__close" data-fcs-close aria-label="Schließen">×</button>'
            + '</div>'
            + '<div class="fcs-panel__tabs" role="tablist">' + tabsHtml + '</div>'
            + '<div class="fcs-panel__body">' + panesHtml + '</div>';

        document.body.appendChild(root);

        // Initiale Position: rechts oben in Editor-Nähe.
        var container = editor.getContainer();
        var rect = container ? container.getBoundingClientRect() : { top: 80, right: window.innerWidth - 20 };
        var panelW = 460;
        var left = Math.max(12, Math.min(window.innerWidth - panelW - 12, (rect.right || window.innerWidth) - panelW));
        var top = Math.max(12, (rect.top || 80));
        root.style.left = left + 'px';
        root.style.top = top + 'px';

        wireDrag(root);
        wireTabs(root);
        wireActions(editor, root);
        refreshFavsIndicators(root);

        return root;
    }

    function wireDrag(root) {
        var head = root.querySelector('[data-fcs-drag]');
        var dragging = false;
        var startX = 0, startY = 0, startLeft = 0, startTop = 0;

        head.addEventListener('mousedown', function (e) {
            if (e.target.closest('[data-fcs-close]')) { return; }
            dragging = true;
            startX = e.clientX;
            startY = e.clientY;
            var r = root.getBoundingClientRect();
            startLeft = r.left;
            startTop = r.top;
            e.preventDefault();
        });
        document.addEventListener('mousemove', function (e) {
            if (!dragging) { return; }
            var nx = startLeft + (e.clientX - startX);
            var ny = startTop + (e.clientY - startY);
            // In den Viewport klemmen.
            nx = Math.max(0, Math.min(window.innerWidth - 60, nx));
            ny = Math.max(0, Math.min(window.innerHeight - 40, ny));
            root.style.left = nx + 'px';
            root.style.top = ny + 'px';
        });
        document.addEventListener('mouseup', function () { dragging = false; });
    }

    function wireTabs(root) {
        root.querySelectorAll('[data-fcs-tab]').forEach(function (tab) {
            tab.addEventListener('click', function () {
                var id = tab.getAttribute('data-fcs-tab');
                root.querySelectorAll('[data-fcs-tab]').forEach(function (t) { t.classList.toggle('is-active', t === tab); });
                root.querySelectorAll('[data-fcs-pane]').forEach(function (p) {
                    p.classList.toggle('is-active', p.getAttribute('data-fcs-pane') === id);
                });
                if (id === 'chars') {
                    // Favs/Recent im Zeichen-Tab bei jedem Tab-Wechsel frisch rendern.
                    refreshFavsAndRecent(root);
                }
            });
        });
    }

    function wireActions(editor, root) {
        root.addEventListener('click', function (e) {
            if (e.target.closest('[data-fcs-close]')) {
                e.preventDefault();
                root.hidden = true;
                return;
            }
            var favBtn = e.target.closest('[data-fcs-fav-toggle]');
            if (favBtn) {
                e.preventDefault();
                e.stopPropagation();
                var item = {
                    kind: favBtn.getAttribute('data-fcs-kind'),
                    value: favBtn.getAttribute('data-fcs-value'),
                    label: favBtn.getAttribute('data-fcs-label'),
                    invisible: favBtn.getAttribute('data-fcs-invisible') === '1' || undefined,
                    hint: favBtn.getAttribute('data-fcs-hint') || undefined
                };
                toggleFav(item);
                refreshFavsAndRecent(root);
                return;
            }
            var insertBtn = e.target.closest('[data-fcs-insert]');
            if (insertBtn) {
                e.preventDefault();
                var val = insertBtn.getAttribute('data-fcs-insert');
                var kind = insertBtn.getAttribute('data-fcs-kind') || 'char';
                var label = insertBtn.getAttribute('data-fcs-label') || val;
                var invisible = insertBtn.getAttribute('data-fcs-invisible') === '1';
                var hint = insertBtn.getAttribute('data-fcs-hint') || undefined;
                try { editor.focus(); } catch (_e) {}
                renderAndInsert(editor, val);
                addRecent({ kind: kind, value: val, label: label, invisible: invisible || undefined, hint: hint });
                // Recent-Sektion im Zeichen-Tab live aktualisieren.
                refreshFavsAndRecent(root);
                return;
            }
            var action = e.target.closest('[data-fcs-action]');
            if (action) {
                e.preventDefault();
                try { editor.focus(); } catch (_e) {}
                performAction(editor, action.getAttribute('data-fcs-action'));
                return;
            }
        });

        // Mousedown im Panel darf dem Editor nicht den Fokus klauen (sonst verliert die Selektion ihren Anchor).
        root.addEventListener('mousedown', function (e) {
            if (!e.target.closest('input, textarea, [contenteditable="true"]')) {
                e.preventDefault();
            }
        });

        root.addEventListener('input', function (e) {
            var search = e.target.closest('[data-fcs-search]');
            if (!search) { return; }
            var pane = search.closest('[data-fcs-pane]') || root;
            applyFilter(pane, search.value || '');
        });

        // ESC schließt das Panel.
        root.addEventListener('keydown', function (e) {
            if (e.key === 'Escape') { root.hidden = true; }
        });
    }

    function openPicker(editor) {
        ensureCss();
        var root = panelsByEditor.get(editor);
        if (!root || !root.isConnected) {
            root = buildPanel(editor);
            panelsByEditor.set(editor, root);
            // Beim Entfernen des Editors das Panel ebenfalls entsorgen.
            editor.on('remove', function () {
                if (root && root.parentNode) { root.parentNode.removeChild(root); }
                panelsByEditor.delete(editor);
            });
        } else {
            root.hidden = false;
            // Favs/Recent im Zeichen-Tab bei jedem Öffnen auffrischen.
            refreshFavsAndRecent(root);
        }
    }

    /* ---------------- Invisibles im Editor sichtbar machen ---------------- */

    // Zeichen, die im WYSIWYG sichtbar gemacht werden sollen.
    var INV_MAP = {
        '\u00A0': 'nbsp',
        '\u202F': 'nnbsp',
        '\u2009': 'thin',
        '\u00AD': 'shy',
        '\u200B': 'zwsp',
        '\u200C': 'zwnj',
        '\u200D': 'zwj',
        '\u200E': 'lrm',
        '\u200F': 'rlm'
    };
    var INV_CHARS = Object.keys(INV_MAP).join('');
    var INV_REGEX = new RegExp('[' + INV_CHARS.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&') + ']', 'g');

    function markInvisibles(editor) {
        var body = editor.getBody();
        if (!body) { return; }
        var walker = document.createTreeWalker(body, NodeFilter.SHOW_TEXT, {
            acceptNode: function (n) {
                if (n.parentNode && n.parentNode.nodeType === 1 && (n.parentNode.classList || { contains: function () { return false; } }).contains('fcs-inv-mark')) {
                    return NodeFilter.FILTER_REJECT;
                }
                return INV_REGEX.test(n.nodeValue) ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT;
            }
        });
        var nodes = [];
        var node;
        while ((node = walker.nextNode())) { nodes.push(node); }
        nodes.forEach(function (n) {
            var text = n.nodeValue;
            var frag = document.createDocumentFragment();
            var last = 0;
            INV_REGEX.lastIndex = 0;
            var m;
            while ((m = INV_REGEX.exec(text)) !== null) {
                if (m.index > last) { frag.appendChild(document.createTextNode(text.slice(last, m.index))); }
                var span = document.createElement('span');
                span.className = 'fcs-inv-mark';
                span.setAttribute('data-mce-bogus', '1');
                span.setAttribute('data-fcs-inv-label', INV_MAP[m[0]] || 'inv');
                span.setAttribute('contenteditable', 'false');
                span.textContent = m[0];
                frag.appendChild(span);
                last = m.index + m[0].length;
            }
            if (last < text.length) { frag.appendChild(document.createTextNode(text.slice(last))); }
            n.parentNode.replaceChild(frag, n);
        });
    }

    function unmarkInvisibles(editor) {
        var body = editor.getBody();
        if (!body) { return; }
        var marks = body.querySelectorAll('.fcs-inv-mark');
        marks.forEach(function (m) {
            var text = m.textContent || '';
            m.parentNode.replaceChild(document.createTextNode(text), m);
        });
        // Normalisiere zusammenhängende Textknoten.
        try { body.normalize(); } catch (_e) {}
    }

    function setInvisiblesState(editor, on) {
        editor.__fcsInvOn = !!on;
        if (on) {
            markInvisibles(editor);
        } else {
            unmarkInvisibles(editor);
        }
    }

    /* ---------------- Plugin-Registrierung ---------------- */

    // eslint-disable-next-line no-undef
    tinymce.PluginManager.add('for_chars_symbols', function (editor) {
        editor.on('init', function () {
            try { editor.dom.addStyle(EDITOR_CSS); } catch (_e) {}
        });

        // Vor dem Speichern: Marker entfernen (fallback falls data-mce-bogus versagt).
        editor.on('PreProcess', function (e) {
            if (!e || !e.node) { return; }
            var marks = e.node.querySelectorAll('.fcs-inv-mark');
            marks.forEach(function (m) {
                var text = m.textContent || '';
                m.parentNode.replaceChild(m.ownerDocument.createTextNode(text), m);
            });
        });

        // Bei Edits im Invisibles-Modus neue invisibles nachträglich markieren.
        editor.on('input SetContent', function () {
            if (editor.__fcsInvOn) {
                // defer, damit TinyMCE seine eigenen Mutationen abschließt
                setTimeout(function () { if (editor.__fcsInvOn) { markInvisibles(editor); } }, 30);
            }
        });

        editor.ui.registry.addButton('for_chars_symbols', {
            icon: 'insert-character',
            tooltip: 'Zeichen, Symbole & Emoji einfügen',
            onAction: function () { openPicker(editor); }
        });

        editor.ui.registry.addMenuItem('for_chars_symbols', {
            icon: 'insert-character',
            text: 'Zeichen, Symbole & Emoji',
            onAction: function () { openPicker(editor); }
        });

        // Schnell-Einfüge-Menu-Items für Kontextmenü und Einfügen-Menü.
        editor.ui.registry.addMenuItem('fcs_insert_nbsp', {
            text: 'Geschütztes Leerzeichen (nbsp)',
            onAction: function () { editor.insertContent('\u00A0'); }
        });
        editor.ui.registry.addMenuItem('fcs_insert_nnbsp', {
            text: 'Schmales geschütztes Leerzeichen (nnbsp)',
            onAction: function () { editor.insertContent('\u202F'); }
        });
        editor.ui.registry.addMenuItem('fcs_insert_shy', {
            text: 'Weiches Trennzeichen (shy)',
            onAction: function () { editor.insertContent('\u00AD'); }
        });
        editor.ui.registry.addMenuItem('fcs_insert_zwsp', {
            text: 'Nullbreites Leerzeichen (zwsp)',
            onAction: function () { editor.insertContent('\u200B'); }
        });
        editor.ui.registry.addNestedMenuItem('fcs_insert_invisibles', {
            text: 'Unsichtbare Trenner einfügen',
            icon: 'character-count',
            getSubmenuItems: function () {
                return 'fcs_insert_nbsp fcs_insert_nnbsp fcs_insert_shy fcs_insert_zwsp';
            }
        });

        // Toggle-Button: unsichtbare Zeichen im Editor sichtbar machen.
        editor.ui.registry.addToggleButton('for_chars_symbols_invisibles', {
            icon: 'visualchars',
            tooltip: 'Unsichtbare Zeichen (nbsp, shy, zwsp …) sichtbar machen',
            onAction: function (api) {
                var next = !editor.__fcsInvOn;
                setInvisiblesState(editor, next);
                api.setActive(next);
            },
            onSetup: function (api) {
                api.setActive(!!editor.__fcsInvOn);
                return function () {};
            }
        });
        editor.ui.registry.addMenuItem('for_chars_symbols_invisibles', {
            icon: 'visualchars',
            text: 'Unsichtbare Zeichen anzeigen',
            onAction: function () { setInvisiblesState(editor, !editor.__fcsInvOn); }
        });

        editor.addCommand('forCharsSymbolsOpen', function () { openPicker(editor); });
        editor.addCommand('forCharsSymbolsToggleInvisibles', function () { setInvisiblesState(editor, !editor.__fcsInvOn); });
        editor.addShortcut('meta+shift+i', 'Zeichen, Symbole & Emoji einfügen', 'forCharsSymbolsOpen');

        // Kontextmenü-Eintrag (nur aktiv, wenn das Profil 'for_chars_symbols' in 'contextmenu' auflistet).
        editor.ui.registry.addContextMenu('for_chars_symbols', {
            update: function () {
                return 'fcs_insert_nbsp fcs_insert_nnbsp fcs_insert_shy | for_chars_symbols_invisibles | for_chars_symbols';
            }
        });
    });
})();
