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
        },
        {
            name: 'Einheiten & Messung',
            items: [
                ['°', 'Grad'], ['℃', 'Grad Celsius'], ['℉', 'Grad Fahrenheit'], ['K', 'Kelvin'],
                ['Å', 'Ångström'], ['µ', 'Mikro (µ)'], ['Ω', 'Ohm'], ['℧', 'Mho (Leitwert)'],
                ['㎛', 'Mikrometer'], ['㎜', 'Millimeter'], ['㎝', 'Zentimeter'], ['㎞', 'Kilometer'],
                ['㎡', 'Quadratmeter'], ['㎢', 'Quadratkilometer'], ['㎥', 'Kubikmeter'],
                ['㎎', 'Milligramm'], ['㎏', 'Kilogramm'], ['㎍', 'Mikrogramm'], ['㎖', 'Milliliter'],
                ['㎗', 'Deziliter'], ['㎘', 'Hektoliter (kl)'], ['㎐', 'Hertz'], ['㎑', 'Kilohertz'],
                ['㎒', 'Megahertz'], ['㎓', 'Gigahertz'], ['㎾', 'Kilowatt'], ['㎿', 'Megawatt'],
                ['㎸', 'Kilovolt'], ['㎹', 'Megavolt'], ['㎃', 'Milliampere'], ['㎂', 'Mikroampere'],
                ['㎅', 'Kilobyte'], ['㎆', 'Megabyte'], ['㎇', 'Gigabyte'], ['㏄', 'Kubikzentimeter'],
                ['㏎', 'Kilometer (km)'], ['㏑', 'Natürlicher Logarithmus'], ['㏒', 'Logarithmus'],
                ['′', 'Minute / Fuß'], ['″', 'Sekunde / Zoll'], ['‰', 'Promille'], ['‱', 'Pro Zehntausend'],
                ['№', 'Nummer']
            ]
        },
        {
            name: 'Maschinenbau & Technik',
            items: [
                ['⌀', 'Durchmesser'], ['Ø', 'Durchschnitt / Durchmesser'], ['⊥', 'Senkrecht (perpendicular)'],
                ['∥', 'Parallel'], ['∡', 'Winkel (gemessen)'], ['∠', 'Winkel'], ['∢', 'Kugelwinkel'],
                ['⊾', 'Rechter Winkel'], ['⌒', 'Kreisbogen'], ['⌓', 'Segment'], ['△', 'Dreieck'],
                ['▽', 'Dreieck unten'], ['□', 'Quadrat'], ['▭', 'Rechteck'], ['○', 'Kreis'],
                ['◯', 'Großer Kreis'], ['⬡', 'Hexagon'], ['⬢', 'Hexagon gefüllt'], ['⌘', 'Command'],
                ['⌥', 'Option / Alt'], ['⇧', 'Shift'], ['⎋', 'Escape'], ['⏎', 'Return / Enter'],
                ['⌫', 'Backspace / Delete'], ['⌦', 'Forward Delete'], ['⇥', 'Tab'], ['⇤', 'Home'],
                ['⇥', 'End'], ['⏏', 'Eject'], ['⏻', 'Power'], ['⏼', 'Power Toggle'], ['⏽', 'Power On'],
                ['⭘', 'Power Off'], ['⚡', 'Blitz'], ['⏱', 'Stoppuhr'], ['⏲', 'Timer'],
                ['⚙', 'Zahnrad'], ['⚒', 'Hammer & Pickel'], ['⛭', 'Zahnrad (alt)'], ['⛮', 'Zahnrad groß'],
                ['⌁', 'Spannung'], ['⎓', 'Gleichstrom (DC)'], ['⏦', 'Wechselstrom (AC)'],
                ['⏚', 'Erdung'], ['⎔', 'Dodekaeder'], ['◉', 'Fisheye'], ['◎', 'Bullseye'],
                ['⊕', 'Plus im Kreis'], ['⊖', 'Minus im Kreis'], ['⊗', 'Mal im Kreis'],
                ['⊙', 'Punkt im Kreis'], ['⌬', 'Benzol-Ring'], ['⌭', 'Zylinder'], ['⌶', 'APL-Symbol I-Balken']
            ]
        },
        {
            name: 'Medizin & Biologie',
            items: [
                ['☤', 'Caduceus'], ['⚕', 'Äskulapstab / Medizinisches Zeichen'], ['☥', 'Ankh'],
                ['♀', 'Weiblich'], ['♂', 'Männlich'], ['⚥', 'Inter / Männlich-Weiblich'],
                ['⚧', 'Transgender'], ['⚦', 'Männlich-gestrichen'], ['⚨', 'Vertikal männlich-weiblich'],
                ['⚩', 'Weiblich-horizontal'], ['⚭', 'Ehe-Zeichen'], ['⚮', 'Scheidungs-Zeichen'],
                ['⚯', 'Unverheiratet'], ['☣', 'Biohazard'], ['☢', 'Radioaktiv'], ['☠', 'Gefahr (Totenkopf)'],
                ['⚠', 'Warnung'], ['☤', 'Caduceus'], ['℞', 'Rezept (Rx)'], ['℟', 'Response'],
                ['✚', 'Dickes griechisches Kreuz'], ['✛', 'Mittelblockkreuz'], ['✜', 'Offenes Kreuz'],
                ['⊹', 'Plus-Kreuz dünn'], ['†', 'Dagger / Kreuz'],
                ['α', 'alpha'], ['β', 'beta'], ['γ', 'gamma'], ['Δ', 'Delta (Differenz)'],
                ['μ', 'mikro'], ['∅', 'Nullmenge / kein'], ['∞', 'unendlich']
            ]
        },
        {
            name: 'Musik',
            items: [
                ['♩', 'Viertelnote'], ['♪', 'Achtelnote'], ['♫', 'Zwei Achtelnoten'],
                ['♬', 'Zwei Sechzehntel'], ['♭', 'Be (flat)'], ['♮', 'Auflösungszeichen'],
                ['♯', 'Kreuz (sharp)'], ['𝄞', 'Violinschlüssel'], ['𝄢', 'Bassschlüssel'],
                ['𝄐', 'Fermate'], ['𝄡', 'C-Schlüssel']
            ]
        },
        {
            name: 'Recht & Verwaltung',
            items: [
                ['§', 'Paragraph'], ['¶', 'Absatz'], ['※', 'Hinweis'], ['†', 'Gestorben'],
                ['‡', 'Doppeldagger'], ['№', 'Nummer'], ['℗', 'Tonträger-Copyright'],
                ['©', 'Copyright'], ['®', 'Registered'], ['™', 'Trademark'], ['℠', 'Service Mark'],
                ['⁂', 'Asterismus'], ['❧', 'Hederae'], ['※', 'Anmerkung'], ['℀', 'Account of'],
                ['℁', 'Addressed to'], ['℅', 'Care of (c/o)'], ['℆', 'Cada una'], ['℡', 'Telefon'],
                ['℻', 'Fax'], ['☎', 'Telefon'], ['✆', 'Hörer'], ['✉', 'Brief'], ['✍', 'Unterschrift'],
                ['✎', 'Bleistift'], ['✏', 'Bleistift gefüllt'], ['✂', 'Schere'], ['✄', 'Schneidezeichen']
            ]
        },
        {
            name: 'Aufzählungs-Symbole',
            items: [
                ['•', 'Bullet'], ['◦', 'Weißer Bullet'], ['▪', 'Schwarzes Quadrat klein'],
                ['▫', 'Weißes Quadrat klein'], ['■', 'Quadrat schwarz'], ['□', 'Quadrat weiß'],
                ['●', 'Kreis schwarz'], ['○', 'Kreis weiß'], ['◆', 'Raute schwarz'], ['◇', 'Raute weiß'],
                ['▸', 'Pfeilspitze rechts'], ['▹', 'Pfeilspitze rechts weiß'], ['★', 'Stern'],
                ['☆', 'Stern weiß'], ['✓', 'Haken'], ['✔', 'Haken fett'], ['✗', 'Kreuz'],
                ['✘', 'Kreuz fett'], ['➤', 'Pfeil dreieckig'], ['➥', 'Pfeil nach unten-rechts'],
                ['➔', 'Pfeil rechts'], ['❖', 'Vier Diamanten'], ['❯', 'Single Right-Pointing'],
                ['❮', 'Single Left-Pointing']
            ]
        }
    ];

    /* ---------------- Daten: Emojis (curated) ---------------- */

    var EMOJI_GROUPS = [
        {
            name: 'Smileys',
            items: [
                ['😀','grinning'],['😃','smiley'],['😄','smile'],['😁','grin'],['😆','laughing'],
                ['😅','sweat_smile'],['🤣','rofl'],['😂','joy'],['🙂','slight_smile'],['🙃','upside_down'],
                ['🫠','melting'],['😉','wink'],['😊','blush'],['😇','innocent'],
                ['🥰','smiling_face_with_hearts'],['😍','heart_eyes'],['🤩','star_struck'],
                ['😘','kissing_heart'],['😗','kissing'],['☺️','smiling'],['😚','kissing_closed_eyes'],
                ['😙','kissing_smiling_eyes'],['🥲','smiling_tear'],['😋','yum'],['😛','stuck_out_tongue'],
                ['😜','stuck_out_tongue_winking_eye'],['🤪','zany'],['😝','stuck_out_tongue_closed_eyes'],
                ['🤑','money_mouth'],['🤗','hugging'],['🤭','hand_over_mouth'],['🫢','open_eyes_hand'],
                ['🫣','peeking'],['🤫','shushing'],['🤔','thinking'],['🫡','saluting'],
                ['🤐','zipper_mouth'],['🤨','raised_eyebrow'],['😐','neutral'],['😑','expressionless'],
                ['😶','no_mouth'],['🫥','dotted_line_face'],['😶‍🌫️','face_in_clouds'],
                ['😏','smirk'],['😒','unamused'],['🙄','rolling_eyes'],['😬','grimacing'],
                ['😮‍💨','exhaling'],['🤥','lying'],['🫨','shaking'],['😌','relieved'],['😔','pensive'],
                ['😪','sleepy'],['🤤','drooling'],['😴','sleeping'],['😷','mask'],
                ['🤒','thermometer_face'],['🤕','bandage'],['🤢','nauseated'],['🤮','vomiting'],
                ['🤧','sneezing'],['🥵','hot'],['🥶','cold'],['🥴','woozy'],['😵','dizzy'],
                ['😵‍💫','spiral_eyes'],['🤯','exploding_head'],['🤠','cowboy'],['🥳','partying'],
                ['🥸','disguised'],['😎','sunglasses'],['🤓','nerd'],['🧐','monocle'],
                ['😕','confused'],['🫤','diagonal_mouth'],['😟','worried'],['🙁','slightly_frowning'],
                ['☹️','frowning'],['😮','open_mouth'],['😯','hushed'],['😲','astonished'],
                ['😳','flushed'],['🥺','pleading'],['🥹','holding_back_tears'],['😦','frowning_open'],
                ['😧','anguished'],['😨','fearful'],['😰','cold_sweat'],['😥','disappointed_relieved'],
                ['😢','tear'],['😭','crying'],['😱','scream'],['😖','confounded'],['😣','persevering'],
                ['😞','disappointed'],['😓','sweat'],['😩','weary'],['😫','tired'],['🥱','yawning'],
                ['😤','triumph'],['😡','rage'],['😠','angry'],['🤬','cursing'],['😈','devil'],
                ['👿','imp'],['💀','skull'],['☠️','skull_crossbones'],['💩','poop'],['🤡','clown'],
                ['👹','ogre'],['👺','goblin'],['👻','ghost'],['👽','alien'],['👾','space_invader'],
                ['🤖','robot'],['😺','smiley_cat'],['😸','grinning_cat'],['😹','joy_cat'],
                ['😻','heart_eyes_cat'],['😼','smirk_cat'],['😽','kissing_cat'],['🙀','scream_cat'],
                ['😿','crying_cat'],['😾','pouting_cat']
            ]
        },
        {
            name: 'Gesten & Körper',
            items: [
                ['👋','wave'],['🤚','back_of_hand'],['🖐️','open_hand'],['✋','raised_hand'],
                ['🖖','vulcan'],['🫱','rightwards'],['🫲','leftwards'],['🫳','palm_down'],
                ['🫴','palm_up'],['🫷','leftwards_pushing'],['🫸','rightwards_pushing'],
                ['👌','ok'],['🤌','pinched_fingers'],['🤏','pinch'],['✌️','victory'],
                ['🤞','crossed_fingers'],['🫰','finger_thumb'],['🤟','love_you'],['🤘','rock'],
                ['🤙','call_me'],['👈','left'],['👉','right'],['👆','up'],['🖕','middle_finger'],
                ['👇','down'],['☝️','index'],['🫵','pointing_at_you'],['👍','thumbs_up'],
                ['👎','thumbs_down'],['✊','fist'],['👊','punch'],['🤛','left_facing_fist'],
                ['🤜','right_facing_fist'],['👏','clap'],['🙌','raising_hands'],
                ['🫶','heart_hands'],['👐','open_hands'],['🤲','palms_up_together'],
                ['🤝','handshake'],['🙏','pray'],['✍️','writing'],['💅','nail_care'],
                ['🤳','selfie'],['💪','muscle'],['🦾','mechanical_arm'],['🦵','leg'],
                ['🦿','mechanical_leg'],['🦶','foot'],['👂','ear'],['🦻','ear_hearing_aid'],
                ['👃','nose'],['🧠','brain'],['🫀','anatomical_heart'],['🫁','lungs'],
                ['🦷','tooth'],['🦴','bone'],['👀','eyes'],['👁️','eye'],['👅','tongue'],
                ['👄','mouth'],['🫦','biting_lip']
            ]
        },
        {
            name: 'Menschen',
            items: [
                ['👶','baby'],['🧒','child'],['👦','boy'],['👧','girl'],['🧑','person'],
                ['👨','man'],['👩','woman'],['🧓','older'],['👴','grandpa'],['👵','grandma'],
                ['👱','blonde'],['👨‍🦰','man_red_hair'],['👩‍🦰','woman_red_hair'],
                ['👨‍🦱','man_curly'],['👩‍🦱','woman_curly'],['👨‍🦳','man_white_hair'],
                ['👩‍🦳','woman_white_hair'],['👨‍🦲','man_bald'],['👩‍🦲','woman_bald'],
                ['🧔','beard'],['🧔‍♂️','man_beard'],['🧔‍♀️','woman_beard'],
                ['👨‍⚕️','man_doctor'],['👩‍⚕️','woman_doctor'],['👨‍🎓','man_student'],
                ['👩‍🎓','woman_student'],['👨‍🏫','man_teacher'],['👩‍🏫','woman_teacher'],
                ['👨‍⚖️','man_judge'],['👩‍⚖️','woman_judge'],['👨‍🌾','man_farmer'],
                ['👩‍🌾','woman_farmer'],['👨‍🍳','man_cook'],['👩‍🍳','woman_cook'],
                ['👨‍🔧','man_mechanic'],['👩‍🔧','woman_mechanic'],['👨‍🏭','man_factory'],
                ['👩‍🏭','woman_factory'],['👨‍💼','man_office'],['👩‍💼','woman_office'],
                ['👨‍🔬','man_scientist'],['👩‍🔬','woman_scientist'],['👨‍💻','man_tech'],
                ['👩‍💻','woman_tech'],['👨‍🎤','man_singer'],['👩‍🎤','woman_singer'],
                ['👨‍🎨','man_artist'],['👩‍🎨','woman_artist'],['👨‍✈️','man_pilot'],
                ['👩‍✈️','woman_pilot'],['👨‍🚀','man_astronaut'],['👩‍🚀','woman_astronaut'],
                ['👨‍🚒','man_firefighter'],['👩‍🚒','woman_firefighter'],['👮','police_officer'],
                ['🕵️','detective'],['💂','guard'],['🥷','ninja'],['👷','construction_worker'],
                ['🫅','royalty'],['🤴','prince'],['👸','princess'],['👳','turban'],
                ['👲','skullcap'],['🧕','headscarf'],['🤵','tuxedo'],['👰','bride'],
                ['🤱','breastfeeding'],['🧑‍🍼','person_baby'],['👼','angel'],['🎅','santa'],
                ['🤶','mrs_claus'],['🦸','superhero'],['🦹','supervillain'],['🧙','mage'],
                ['🧚','fairy'],['🧛','vampire'],['🧜','merperson'],['🧝','elf'],['🧞','genie'],
                ['🧟','zombie'],['🧌','troll'],['💆','massage'],['💇','haircut'],
                ['🚶','walking'],['🧍','standing'],['🧎','kneeling'],['🏃','running'],
                ['💃','dancer'],['🕺','man_dancing'],['🕴️','levitate'],['👯','dancers'],
                ['🧘','yoga'],['🛀','bath'],['🛌','sleeping_bed'],
                ['🙋','raising_hand'],['🤷','shrug'],['🙅','no_good'],['🙆','ok_person'],
                ['💁','tipping_hand'],['🙇','bowing'],['🤦','facepalm'],['👥','busts'],
                ['👤','bust'],['👪','family'],['🧑‍🤝‍🧑','people_holding_hands']
            ]
        },
        {
            name: 'Tiere & Natur',
            items: [
                ['🐶','dog'],['🐱','cat'],['🐭','mouse'],['🐹','hamster'],['🐰','rabbit'],
                ['🦊','fox'],['🐻','bear'],['🐻‍❄️','polar_bear'],['🐼','panda'],['🐨','koala'],
                ['🐯','tiger'],['🦁','lion'],['🐮','cow'],['🐷','pig'],['🐽','pig_nose'],
                ['🐸','frog'],['🐵','monkey'],['🙈','see_no_evil'],['🙉','hear_no_evil'],
                ['🙊','speak_no_evil'],['🐒','monkey_full'],['🐔','chicken'],['🐧','penguin'],
                ['🐦','bird'],['🐤','chick'],['🐣','hatching_chick'],['🐥','front_chick'],
                ['🦆','duck'],['🦅','eagle'],['🦉','owl'],['🦇','bat'],['🐺','wolf'],
                ['🐗','boar'],['🐴','horse'],['🦄','unicorn'],['🐝','bee'],['🪱','worm'],
                ['🐛','bug'],['🦋','butterfly'],['🐌','snail'],['🐞','ladybug'],['🐜','ant'],
                ['🪰','fly'],['🪲','beetle'],['🦂','scorpion'],['🕷️','spider'],['🕸️','web'],
                ['🦟','mosquito'],['🦗','cricket'],['🐢','turtle'],['🐍','snake'],
                ['🦎','lizard'],['🦖','t_rex'],['🦕','sauropod'],['🐙','octopus'],
                ['🦑','squid'],['🦐','shrimp'],['🦞','lobster'],['🦀','crab'],['🐡','blowfish'],
                ['🐠','tropical_fish'],['🐟','fish'],['🐬','dolphin'],['🐳','whale'],
                ['🐋','whale2'],['🦈','shark'],['🐊','crocodile'],['🐅','tiger2'],
                ['🐆','leopard'],['🦓','zebra'],['🦍','gorilla'],['🦧','orangutan'],
                ['🐘','elephant'],['🦣','mammoth'],['🦛','hippo'],['🦏','rhino'],
                ['🐪','camel'],['🐫','two_hump_camel'],['🦒','giraffe'],['🦘','kangaroo'],
                ['🦬','bison'],['🐃','water_buffalo'],['🐂','ox'],['🐄','cow2'],
                ['🐎','racehorse'],['🐖','pig2'],['🐏','ram'],['🐑','sheep'],['🦙','llama'],
                ['🐐','goat'],['🦌','deer'],['🐕','dog2'],['🐩','poodle'],['🦮','guide_dog'],
                ['🐕‍🦺','service_dog'],['🐈','cat2'],['🐈‍⬛','black_cat'],['🪶','feather'],
                ['🐓','rooster'],['🦃','turkey'],['🦤','dodo'],['🦚','peacock'],
                ['🦜','parrot'],['🦢','swan'],['🦩','flamingo'],['🕊️','dove'],
                ['🐇','rabbit2'],['🦝','raccoon'],['🦨','skunk'],['🦡','badger'],
                ['🦫','beaver'],['🦦','otter'],['🦥','sloth'],['🐁','mouse2'],
                ['🐀','rat'],['🐿️','chipmunk'],['🦔','hedgehog'],
                ['🌵','cactus'],['🎄','christmas_tree'],['🌲','evergreen'],['🌳','deciduous'],
                ['🌴','palm_tree'],['🪵','wood'],['🌱','seedling'],['🌿','herb'],
                ['☘️','shamrock'],['🍀','four_leaf'],['🎍','bamboo'],['🪴','potted_plant'],
                ['🎋','tanabata'],['🍃','leaves'],['🍂','fallen_leaf'],['🍁','maple'],
                ['🪺','nest_eggs'],['🪹','empty_nest'],['🍄','mushroom'],['🐚','shell'],
                ['🪨','rock'],['🪸','coral'],['💐','bouquet'],['🌷','tulip'],
                ['🌹','rose'],['🥀','wilted_flower'],['🪻','hyacinth'],['🪷','lotus'],
                ['🌺','hibiscus'],['🌸','cherry_blossom'],['🌼','blossom'],['🌻','sunflower']
            ]
        },
        {
            name: 'Essen & Trinken',
            items: [
                ['🍎','apple'],['🍐','pear'],['🍊','orange'],['🍋','lemon'],['🍌','banana'],
                ['🍉','watermelon'],['🍇','grapes'],['🍓','strawberry'],['🫐','blueberries'],
                ['🍒','cherries'],['🍑','peach'],['🥭','mango'],['🍍','pineapple'],['🥥','coconut'],
                ['🥝','kiwi'],['🍅','tomato'],['🍆','eggplant'],['🥑','avocado'],['🥦','broccoli'],
                ['🥬','leafy_green'],['🥒','cucumber'],['🌶️','chili'],['🫑','bell_pepper'],
                ['🌽','corn'],['🥕','carrot'],['🫒','olive'],['🧄','garlic'],['🧅','onion'],
                ['🥔','potato'],['🍠','sweet_potato'],['🥐','croissant'],['🥯','bagel'],
                ['🍞','bread'],['🥖','baguette'],['🫓','flatbread'],['🥨','pretzel'],
                ['🧀','cheese'],['🥚','egg'],['🍳','cooking'],['🧈','butter'],['🥞','pancakes'],
                ['🧇','waffle'],['🥓','bacon'],['🥩','steak'],['🍗','poultry_leg'],
                ['🍖','meat_on_bone'],['🦴','bone'],['🌭','hot_dog'],['🍔','burger'],
                ['🍟','fries'],['🍕','pizza'],['🥪','sandwich'],['🥙','stuffed_flatbread'],
                ['🧆','falafel'],['🌮','taco'],['🌯','burrito'],['🫔','tamale'],
                ['🥗','salad'],['🥘','shallow_pan'],['🫕','fondue'],['🍝','spaghetti'],
                ['🍜','ramen'],['🍲','pot_of_food'],['🍛','curry'],['🍣','sushi'],
                ['🍱','bento'],['🥟','dumpling'],['🦪','oyster'],['🍤','fried_shrimp'],
                ['🍙','rice_ball'],['🍚','rice'],['🍘','rice_cracker'],['🥠','fortune_cookie'],
                ['🥮','moon_cake'],['🍢','oden'],['🍡','dango'],['🍧','shaved_ice'],
                ['🍨','ice_cream'],['🍦','soft_ice_cream'],['🥧','pie'],['🧁','cupcake'],
                ['🍰','cake'],['🎂','birthday_cake'],['🍮','custard'],['🍭','lollipop'],
                ['🍬','candy'],['🍫','chocolate'],['🍿','popcorn'],['🍩','doughnut'],
                ['🍪','cookie'],['🌰','chestnut'],['🥜','peanuts'],['🫘','beans'],['🍯','honey'],
                ['🥛','milk'],['🍼','baby_bottle'],['☕','coffee'],['🫖','teapot'],
                ['🍵','tea'],['🧃','juice_box'],['🥤','drink'],['🧋','bubble_tea'],
                ['🍶','sake'],['🍺','beer'],['🍻','beers'],['🥂','clinking_glasses'],
                ['🍷','wine'],['🥃','whiskey'],['🍸','cocktail'],['🍹','tropical_drink'],
                ['🍾','champagne'],['🧊','ice'],['🥄','spoon'],['🍴','fork_knife'],
                ['🍽️','plate'],['🥢','chopsticks'],['🧂','salt']
            ]
        },
        {
            name: 'Reisen & Orte',
            items: [
                ['🚗','car'],['🚕','taxi'],['🚙','suv'],['🚌','bus'],['🚎','trolleybus'],
                ['🏎️','racing_car'],['🚓','police_car'],['🚑','ambulance'],['🚒','fire_engine'],
                ['🚐','minibus'],['🛻','pickup'],['🚚','delivery_truck'],['🚛','articulated_lorry'],
                ['🚜','tractor'],['🦯','white_cane'],['🦽','manual_wheelchair'],
                ['🦼','motor_wheelchair'],['🛴','scooter'],['🚲','bicycle'],['🛵','motor_scooter'],
                ['🏍️','motorcycle'],['🛺','auto_rickshaw'],['🛞','wheel'],['🚨','police_light'],
                ['🚔','oncoming_police_car'],['🚍','oncoming_bus'],['🚘','oncoming_automobile'],
                ['🚖','oncoming_taxi'],['🚡','aerial_tramway'],['🚠','mountain_cableway'],
                ['🚟','suspension_railway'],['🚃','railway_car'],['🚋','tram_car'],
                ['🚞','mountain_railway'],['🚝','monorail'],['🚄','high_speed_train'],
                ['🚅','bullet_train'],['🚈','light_rail'],['🚂','steam_locomotive'],
                ['🚆','train'],['🚇','metro'],['🚊','tram'],['🛤️','railway_track'],
                ['🛣️','motorway'],['⛽','fuel'],['🛢️','oil_drum'],['🚧','construction'],
                ['🚦','traffic_light'],['🚥','horizontal_traffic_light'],['🗺️','map'],
                ['🗿','moai'],['🗽','statue_of_liberty'],['🗼','tokyo_tower'],
                ['🏰','castle'],['🏯','japanese_castle'],['🏟️','stadium'],['🎡','ferris_wheel'],
                ['🎢','roller_coaster'],['🎠','carousel'],['🛝','playground_slide'],
                ['⛲','fountain'],['⛱️','umbrella_on_ground'],['🏖️','beach_umbrella'],
                ['🏝️','desert_island'],['🏜️','desert'],['🌋','volcano'],['⛰️','mountain'],
                ['🏔️','snowy_mountain'],['🗻','mount_fuji'],['🏕️','camping'],['⛺','tent'],
                ['🛖','hut'],['🏠','house'],['🏡','house_garden'],['🏘️','houses'],
                ['🏚️','derelict_house'],['🏗️','construction_building'],['🏭','factory'],
                ['🏢','office'],['🏬','department_store'],['🏣','japanese_post_office'],
                ['🏤','european_post_office'],['🏥','hospital'],['🏦','bank'],['🏨','hotel'],
                ['🏪','convenience_store'],['🏫','school'],['🏩','love_hotel'],
                ['💒','wedding'],['🏛️','classical_building'],['⛪','church'],['🕌','mosque'],
                ['🕍','synagogue'],['🛕','hindu_temple'],['🕋','kaaba'],['⛩️','shinto_shrine'],
                ['🛐','place_of_worship'],['✈️','airplane'],['🛫','takeoff'],['🛬','landing'],
                ['🛩️','small_airplane'],['💺','seat'],['🚀','rocket'],['🛸','ufo'],
                ['🚁','helicopter'],['🛶','canoe'],['⛵','sailboat'],['🚤','speedboat'],
                ['🛥️','motor_boat'],['🛳️','cruise_ship'],['⛴️','ferry'],['🚢','ship'],
                ['⚓','anchor'],['🪝','hook'],['⛽','fuel'],['🚏','bus_stop'],
                ['🏁','checkered_flag'],['🚩','triangular_flag'],['🎌','crossed_flags'],
                ['🏳️','white_flag'],['🏴','black_flag'],['🏳️‍🌈','rainbow_flag'],
                ['🏳️‍⚧️','transgender_flag'],['🏴‍☠️','pirate_flag']
            ]
        },
        {
            name: 'Aktivitäten & Sport',
            items: [
                ['⚽','soccer'],['🏀','basketball'],['🏈','football'],['⚾','baseball'],
                ['🥎','softball'],['🎾','tennis'],['🏐','volleyball'],['🏉','rugby'],
                ['🥏','flying_disc'],['🎱','8ball'],['🪀','yo_yo'],['🏓','ping_pong'],
                ['🏸','badminton'],['🏒','ice_hockey'],['🏑','field_hockey'],['🥍','lacrosse'],
                ['🏏','cricket_game'],['🪃','boomerang'],['🥅','goal_net'],['⛳','flag_in_hole'],
                ['🪁','kite'],['🏹','bow_and_arrow'],['🎣','fishing'],['🤿','diving_mask'],
                ['🥊','boxing_glove'],['🥋','martial_arts'],['🎽','running_shirt'],['🛹','skateboard'],
                ['🛼','roller_skate'],['🛷','sled'],['⛸️','ice_skate'],['🥌','curling'],
                ['🎿','ski'],['⛷️','skier'],['🏂','snowboarder'],['🪂','parachute'],
                ['🏋️','weight_lifting'],['🤼','wrestling'],['🤸','cartwheel'],['⛹️','person_bouncing'],
                ['🤺','fencing'],['🤾','handball'],['🏌️','golf'],['🏇','horse_racing'],
                ['🧘','yoga'],['🏄','surfing'],['🏊','swimming'],['🤽','water_polo'],
                ['🚣','rowboat'],['🧗','climbing'],['🚵','mountain_biker'],['🚴','biker'],
                ['🏆','trophy'],['🥇','gold_medal'],['🥈','silver_medal'],['🥉','bronze_medal'],
                ['🏅','sports_medal'],['🎖️','military_medal'],['🏵️','rosette'],['🎗️','reminder_ribbon'],
                ['🎫','ticket'],['🎟️','admission_ticket'],['🎪','circus'],['🤹','juggling'],
                ['🎭','performing_arts'],['🩰','ballet'],['🎨','artist_palette'],['🎬','clapper'],
                ['🎤','microphone'],['🎧','headphone'],['🎼','musical_score'],['🎹','piano'],
                ['🥁','drum'],['🪘','long_drum'],['🎷','saxophone'],['🎺','trumpet'],
                ['🎸','guitar'],['🪕','banjo'],['🎻','violin'],['🪗','accordion'],
                ['🪇','maracas'],['🪈','flute'],['🎲','die'],['♟️','chess_pawn'],
                ['🎯','dart'],['🎳','bowling'],['🎮','video_game'],['🎰','slot_machine'],
                ['🧩','puzzle']
            ]
        },
        {
            name: 'Objekte',
            items: [
                ['⌚','watch'],['📱','phone'],['📲','mobile_arrow'],['💻','laptop'],
                ['⌨️','keyboard'],['🖥️','desktop'],['🖨️','printer'],['🖱️','mouse'],
                ['🖲️','trackball'],['🕹️','joystick'],['🗜️','clamp'],['💽','minidisc'],
                ['💾','floppy'],['💿','cd'],['📀','dvd'],['📼','videotape'],['📷','camera'],
                ['📸','camera_flash'],['📹','videocamera'],['🎥','movie_camera'],
                ['🎞️','film_strip'],['📽️','projector'],['🎬','clapper'],['📞','phone_receiver'],
                ['☎️','telephone'],['📟','pager'],['📠','fax'],['📺','tv'],['📻','radio'],
                ['🎙️','mic'],['🎚️','level_slider'],['🎛️','control_knobs'],['🧭','compass'],
                ['⏱️','stopwatch'],['⏲️','timer'],['⏰','alarm_clock'],['🕰️','mantelpiece_clock'],
                ['⌛','hourglass'],['⏳','hourglass_flowing'],['📡','satellite_antenna'],
                ['🔋','battery'],['🪫','low_battery'],['🔌','plug'],['💡','bulb'],
                ['🔦','flashlight'],['🕯️','candle'],['🪔','diya'],['🧯','fire_extinguisher'],
                ['🛢️','oil_drum'],['💸','money_with_wings'],['💵','dollar_banknote'],
                ['💴','yen_banknote'],['💶','euro_banknote'],['💷','pound_banknote'],
                ['🪙','coin'],['💰','money_bag'],['💳','credit_card'],['💎','diamond'],
                ['⚖️','balance'],['🪜','ladder'],['🧰','toolbox'],['🪛','screwdriver'],
                ['🔧','wrench'],['🔨','hammer'],['⚒️','hammer_pick'],['🛠️','hammer_and_wrench'],
                ['⛏️','pick'],['🪚','saw'],['🔩','nut_and_bolt'],['⚙️','gear'],
                ['🪤','mouse_trap'],['🧱','bricks'],['⛓️','chains'],['🧲','magnet'],
                ['🔫','water_pistol'],['💣','bomb'],['🧨','firecracker'],['🪓','axe'],
                ['🔪','kitchen_knife'],['🗡️','dagger'],['⚔️','crossed_swords'],['🛡️','shield'],
                ['🚬','cigarette'],['⚰️','coffin'],['🪦','headstone'],['⚱️','funeral_urn'],
                ['🏺','amphora'],['🔮','crystal_ball'],['📿','prayer_beads'],['🧿','nazar_amulet'],
                ['🪬','hamsa'],['💈','barber_pole'],['⚗️','alembic'],['🔭','telescope'],
                ['🔬','microscope'],['🕳️','hole'],['🩹','adhesive_bandage'],['🩺','stethoscope'],
                ['💊','pill'],['💉','syringe'],['🩸','blood'],['🧬','dna'],['🦠','microbe'],
                ['🧫','petri_dish'],['🧪','test_tube'],['🌡️','thermometer'],['🧹','broom'],
                ['🧺','basket'],['🧻','toilet_paper'],['🪣','bucket'],['🧼','soap'],
                ['🪥','toothbrush'],['🪒','razor'],['🧽','sponge'],['🪡','sewing_needle'],
                ['🧷','safety_pin'],['🧴','lotion_bottle'],['🛎️','bellhop_bell'],['🔑','key'],
                ['🗝️','old_key'],['🔐','locked_with_key'],['🔒','locked'],['🔓','unlocked'],
                ['🔏','locked_with_pen'],['✉️','envelope'],['📨','envelope_arrow'],
                ['📧','email'],['💌','love_letter'],['📥','inbox'],['📤','outbox'],
                ['📦','package'],['🏷️','label'],['🔖','bookmark'],['📑','bookmark_tabs'],
                ['📒','ledger'],['📕','closed_book'],['📗','green_book'],['📘','blue_book'],
                ['📙','orange_book'],['📚','books'],['📓','notebook'],['📔','notebook_decorative'],
                ['📰','newspaper'],['🗞️','rolled_newspaper'],['📃','page_with_curl'],
                ['📜','scroll'],['📄','page'],['📋','clipboard'],['📅','calendar'],
                ['📆','tear_off_calendar'],['🗓️','spiral_calendar'],['📇','card_index'],
                ['🗃️','card_file_box'],['🗳️','ballot_box'],['🗄️','file_cabinet'],
                ['📁','file_folder'],['📂','open_file_folder'],['🗂️','card_index_dividers'],
                ['📊','bar_chart'],['📈','chart_up'],['📉','chart_down'],['📌','pushpin'],
                ['📍','round_pushpin'],['📎','paperclip'],['🖇️','linked_paperclips'],
                ['📏','ruler'],['📐','triangular_ruler'],['✂️','scissors'],['🖊️','pen'],
                ['🖋️','fountain_pen'],['✒️','black_nib'],['🖌️','paintbrush'],['🖍️','crayon'],
                ['📝','memo'],['✏️','pencil']
            ]
        },
        {
            name: 'Kleidung',
            items: [
                ['👓','glasses'],['🕶️','sunglasses'],['🥽','goggles'],['🥼','lab_coat'],
                ['🦺','safety_vest'],['👔','necktie'],['👕','t_shirt'],['👖','jeans'],
                ['🧣','scarf'],['🧤','gloves'],['🧥','coat'],['🧦','socks'],['👗','dress'],
                ['👘','kimono'],['🥻','sari'],['🩱','one_piece_swimsuit'],['🩲','swim_brief'],
                ['🩳','shorts'],['👙','bikini'],['👚','womans_clothes'],['🪭','folding_fan'],
                ['👛','purse'],['👜','handbag'],['👝','clutch'],['🛍️','shopping_bags'],
                ['🎒','school_backpack'],['🩴','thong_sandal'],['👞','mans_shoe'],
                ['👟','running_shoe'],['🥾','hiking_boot'],['🥿','flat_shoe'],['👠','high_heel'],
                ['👡','womans_sandal'],['🩰','ballet_shoes'],['👢','boot'],['🪮','pick_comb'],
                ['👑','crown'],['👒','womans_hat'],['🎩','top_hat'],['🎓','mortar_board'],
                ['🧢','billed_cap'],['🪖','military_helmet'],['⛑️','rescue_helmet'],
                ['💄','lipstick'],['💍','ring'],['💼','briefcase']
            ]
        },
        {
            name: 'Symbole',
            items: [
                ['❤️','red_heart'],['🧡','orange_heart'],['💛','yellow_heart'],['💚','green_heart'],
                ['💙','blue_heart'],['💜','purple_heart'],['🖤','black_heart'],['🤍','white_heart'],
                ['🤎','brown_heart'],['🩷','pink_heart'],['🩵','light_blue_heart'],['🩶','grey_heart'],
                ['💔','broken_heart'],['❤️‍🔥','heart_on_fire'],['❤️‍🩹','mending_heart'],
                ['💕','two_hearts'],['💞','revolving_hearts'],['💖','sparkling_heart'],
                ['💘','heart_arrow'],['💝','heart_ribbon'],['💟','heart_decoration'],
                ['☮️','peace'],['✝️','cross'],['☪️','star_crescent'],['🕉️','om'],
                ['☸️','dharma'],['✡️','star_of_david'],['🔯','dotted_star'],['🕎','menorah'],
                ['☯️','yin_yang'],['☦️','orthodox_cross'],['🛐','worship'],['⛎','ophiuchus'],
                ['♈','aries'],['♉','taurus'],['♊','gemini'],['♋','cancer'],['♌','leo'],
                ['♍','virgo'],['♎','libra'],['♏','scorpio'],['♐','sagittarius'],
                ['♑','capricorn'],['♒','aquarius'],['♓','pisces'],['⚛️','atom'],
                ['🆔','id'],['⚠️','warning'],['🚸','children_crossing'],['⛔','no_entry'],
                ['🚫','prohibited'],['🚳','no_bicycles'],['🚭','no_smoking'],['🚯','no_littering'],
                ['🚱','non_potable_water'],['🚷','no_pedestrians'],['📵','no_mobile_phones'],
                ['🔞','underage'],['☢️','radioactive'],['☣️','biohazard'],['⬆️','arrow_up'],
                ['↗️','arrow_upper_right'],['➡️','arrow_right'],['↘️','arrow_lower_right'],
                ['⬇️','arrow_down'],['↙️','arrow_lower_left'],['⬅️','arrow_left'],
                ['↖️','arrow_upper_left'],['↕️','arrow_up_down'],['↔️','left_right'],
                ['↩️','leftwards_curving'],['↪️','rightwards_curving'],['⤴️','arrow_heading_up'],
                ['⤵️','arrow_heading_down'],['🔃','clockwise_arrows'],['🔄','counter_clockwise'],
                ['🔙','back'],['🔚','end'],['🔛','on'],['🔜','soon'],['🔝','top'],
                ['🆗','ok_button'],['🆕','new_button'],['🆓','free'],['🆙','up_button'],
                ['🆒','cool'],['🆘','sos'],['🆚','vs'],['❌','x'],['❎','negative_squared_cross'],
                ['✅','check_mark'],['✔️','heavy_check'],['☑️','ballot_check'],
                ['🔀','shuffle'],['🔁','repeat'],['🔂','repeat_one'],['▶️','play'],
                ['⏩','fast_forward'],['⏭️','next_track'],['⏯️','play_pause'],['◀️','reverse'],
                ['⏪','rewind'],['⏮️','prev_track'],['🔼','up_button_filled'],['⏫','fast_up'],
                ['🔽','down_button_filled'],['⏬','fast_down'],['⏸️','pause'],['⏹️','stop'],
                ['⏺️','record'],['⏏️','eject'],['🎦','cinema'],['🔅','dim'],['🔆','bright'],
                ['📶','signal'],['📳','vibration'],['📴','mobile_off'],['♀️','female'],
                ['♂️','male'],['⚧️','transgender'],['✖️','heavy_multiplication'],
                ['➕','plus'],['➖','minus'],['➗','division'],['🟰','heavy_equals'],
                ['♾️','infinity'],['‼️','exclamation_double'],['⁉️','interrobang'],
                ['❓','red_question'],['❔','white_question'],['❕','white_exclamation'],
                ['❗','red_exclamation'],['〰️','wavy_dash'],['💱','currency_exchange'],
                ['💲','dollar'],['⚕️','medical'],['♻️','recycling'],['⚜️','fleur_de_lis'],
                ['🔱','trident'],['📛','name_badge'],['🔰','beginner'],['⭕','o'],
                ['🛑','stop'],['💯','100'],['💢','anger'],['💥','boom'],['💫','dizzy2'],
                ['💦','sweat_drops'],['💨','dash'],['🕳️','hole'],['💬','speech'],
                ['👁️‍🗨️','eye_speech'],['🗨️','left_speech'],['🗯️','anger_bubble'],
                ['💭','thought'],['💤','zzz'],['⭐','star'],['🌟','glowing_star'],
                ['✨','sparkles'],['⚡','lightning'],['🔥','fire'],['🔔','bell'],
                ['🔕','bell_off'],['🎵','note'],['🎶','notes']
            ]
        },
        {
            name: 'Flaggen Europa',
            items: [
                ['🇪🇺','eu europa'],['🇩🇪','deutschland'],['🇦🇹','österreich'],['🇨🇭','schweiz'],
                ['🇱🇮','liechtenstein'],['🇱🇺','luxemburg'],['🇫🇷','frankreich'],['🇮🇹','italien'],
                ['🇪🇸','spanien'],['🇵🇹','portugal'],['🇳🇱','niederlande'],['🇧🇪','belgien'],
                ['🇬🇧','uk vereinigtes_königreich'],['🏴󠁧󠁢󠁥󠁮󠁧󠁿','england'],['🏴󠁧󠁢󠁳󠁣󠁴󠁿','schottland'],
                ['🏴󠁧󠁢󠁷󠁬󠁳󠁿','wales'],['🇮🇪','irland'],['🇮🇸','island'],['🇳🇴','norwegen'],
                ['🇸🇪','schweden'],['🇩🇰','dänemark'],['🇫🇮','finnland'],['🇪🇪','estland'],
                ['🇱🇻','lettland'],['🇱🇹','litauen'],['🇵🇱','polen'],['🇨🇿','tschechien'],
                ['🇸🇰','slowakei'],['🇭🇺','ungarn'],['🇷🇴','rumänien'],['🇧🇬','bulgarien'],
                ['🇬🇷','griechenland'],['🇨🇾','zypern'],['🇲🇹','malta'],['🇸🇮','slowenien'],
                ['🇭🇷','kroatien'],['🇷🇸','serbien'],['🇧🇦','bosnien_herzegowina'],
                ['🇲🇪','montenegro'],['🇽🇰','kosovo'],['🇦🇱','albanien'],['🇲🇰','nordmazedonien'],
                ['🇲🇩','moldau moldawien'],['🇺🇦','ukraine'],['🇧🇾','belarus weißrussland'],
                ['🇷🇺','russland'],['🇹🇷','türkei'],['🇦🇩','andorra'],['🇲🇨','monaco'],
                ['🇸🇲','san_marino'],['🇻🇦','vatikan'],['🇫🇴','färöer'],['🇬🇮','gibraltar'],
                ['🇬🇬','guernsey'],['🇯🇪','jersey'],['🇮🇲','isle_of_man'],['🇦🇽','åland'],
                ['🇸🇯','svalbard'],['🇬🇪','georgien'],['🇦🇲','armenien'],['🇦🇿','aserbaidschan'],
                ['🇰🇿','kasachstan']
            ]
        },
        {
            name: 'Flaggen Welt',
            items: [
                ['🇺🇸','usa'],['🇨🇦','kanada'],['🇲🇽','mexiko'],['🇯🇵','japan'],['🇨🇳','china'],
                ['🇰🇷','südkorea'],['🇰🇵','nordkorea'],['🇹🇼','taiwan'],['🇭🇰','hongkong'],
                ['🇸🇬','singapur'],['🇹🇭','thailand'],['🇻🇳','vietnam'],['🇮🇩','indonesien'],
                ['🇵🇭','philippinen'],['🇲🇾','malaysia'],['🇮🇳','indien'],['🇵🇰','pakistan'],
                ['🇦🇪','vae'],['🇸🇦','saudi_arabien'],['🇮🇱','israel'],['🇮🇷','iran'],
                ['🇪🇬','ägypten'],['🇿🇦','südafrika'],['🇳🇬','nigeria'],['🇲🇦','marokko'],
                ['🇧🇷','brasilien'],['🇦🇷','argentinien'],['🇨🇱','chile'],['🇨🇴','kolumbien'],
                ['🇵🇪','peru'],['🇻🇪','venezuela'],['🇺🇾','uruguay'],['🇦🇺','australien'],
                ['🇳🇿','neuseeland'],['🏳️','weiße_flagge'],['🏴','schwarze_flagge'],
                ['🏁','zielflagge'],['🚩','dreieck_flagge'],['🎌','gekreuzte_flaggen'],
                ['🏳️‍🌈','regenbogen'],['🏳️‍⚧️','transgender'],['🏴‍☠️','pirat']
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
        { id: 'phone_intl',   label: 'Telefonnummer(n) → international (E.164, +49 …)' },
        { id: 'phone_nat',    label: 'Telefonnummer(n) → national (0 …)' }
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
        return groupsHtml('char', CHAR_GROUPS);
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

    function favsPanelHtml() {
        // Favs/Recent-Tab: Wrapper-Divs mit data-fcs-*-section, damit
        // refreshFavsAndRecent() nach einem Toggle die Inhalte live ersetzen kann.
        var html = ''
            + '<div data-fcs-favs-section>' + favsBlockHtml() + '</div>'
            + '<div data-fcs-recent-section>' + recentBlockHtml() + '</div>';
        if (!getFavs().length && !getRecent().length) {
            html += '<div class="fcs-empty">Noch keine Favoriten oder zuletzt verwendeten Zeichen. Nutze den Stern ☆ neben einem Zeichen, um es als Favorit zu markieren.</div>';
        }
        return html;
    }

    function refreshFavsAndRecent(root) {
        root.querySelectorAll('[data-fcs-favs-section]').forEach(function (el) { el.innerHTML = favsBlockHtml(); });
        root.querySelectorAll('[data-fcs-recent-section]').forEach(function (el) { el.innerHTML = recentBlockHtml(); });
        // Wenn der Favoriten-Tab sichtbar ist und leer war, Empty-State aktualisieren.
        var favPane = root.querySelector('[data-fcs-pane="favs"]');
        if (favPane) {
            var hasContent = !!favPane.querySelector('.fcs-group--pinned');
            var empty = favPane.querySelector('.fcs-empty');
            if (hasContent && empty) { empty.remove(); }
            if (!hasContent && !empty) {
                var div = document.createElement('div');
                div.className = 'fcs-empty';
                div.textContent = 'Noch keine Favoriten oder zuletzt verwendeten Zeichen. Nutze den Stern ☆ neben einem Zeichen, um es als Favorit zu markieren.';
                favPane.appendChild(div);
            }
        }
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

    /* ---------------- CSS (einmalig in document.head) ---------------- */

    var CSS = '\
.fcs-panel{position:fixed;z-index:100100;width:520px;max-width:95vw;max-height:80vh;display:flex;flex-direction:column;background:#fff;color:#222;border:1px solid rgba(0,0,0,.15);border-radius:6px;box-shadow:0 10px 40px rgba(0,0,0,.25);font:13px/1.4 -apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif}\
.fcs-panel[hidden]{display:none!important}\
.fcs-panel__head{display:flex;align-items:center;gap:8px;padding:8px 10px;border-bottom:1px solid rgba(0,0,0,.08);cursor:move;user-select:none;background:linear-gradient(#fafafa,#f1f1f1);border-radius:6px 6px 0 0}\
.fcs-panel__title{flex:1;font-weight:600;font-size:13px}\
.fcs-panel__close{border:0;background:transparent;font-size:18px;line-height:1;cursor:pointer;width:24px;height:24px;border-radius:50%;color:#666}\
.fcs-panel__close:hover{background:rgba(0,0,0,.08);color:#222}\
.fcs-panel__collapse{border:0;background:transparent;font-size:16px;line-height:1;cursor:pointer;width:24px;height:24px;border-radius:50%;color:#666}\
.fcs-panel__collapse:hover{background:rgba(0,0,0,.08);color:#222}\
.fcs-panel.is-collapsed{max-height:none;height:auto;width:auto;min-width:260px}\
.fcs-panel.is-collapsed .fcs-panel__head{border-bottom:0;border-radius:6px}\
.fcs-panel.is-collapsed .fcs-panel__tabs,.fcs-panel.is-collapsed .fcs-panel__body{display:none}\
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
.fcs-empty{padding:24px 16px;text-align:center;color:#888;font-size:13px;line-height:1.5;border:1px dashed rgba(0,0,0,.15);border-radius:6px;background:rgba(0,0,0,.02)}\
body.rex-theme-dark .fcs-empty{color:#aaa;border-color:rgba(255,255,255,.15);background:rgba(255,255,255,.03)}\
.fcs-grid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:6px}\
.fcs-cell{position:relative;display:flex}\
.fcs-btn{flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:4px;padding:8px 4px;background:transparent;border:1px solid transparent;border-radius:4px;cursor:pointer;min-height:60px;color:inherit;font:inherit;text-align:center;overflow:hidden}\
.fcs-btn:hover,.fcs-btn:focus-visible{background:rgba(75,154,217,.12);border-color:rgba(75,154,217,.4);outline:none}\
.fcs-glyph{font-size:22px;line-height:1;min-height:22px;display:inline-block}\
.fcs-glyph--invisible{color:#8a94a3;font-weight:400;opacity:.8}\
.fcs-name{font-size:11px;line-height:1.25;color:#666;word-break:break-word;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;text-overflow:ellipsis}\
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
body.rex-theme-dark .fcs-panel__collapse{color:#a9b0bc}\
body.rex-theme-dark .fcs-panel__collapse:hover{background:rgba(255,255,255,.08);color:#fff}\
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
@media (prefers-color-scheme: dark){\
body.rex-has-theme:not(.rex-theme-light) .fcs-panel{background:#23272e;color:#e6e9ef;border-color:#3a3e47}\
body.rex-has-theme:not(.rex-theme-light) .fcs-panel__head{background:linear-gradient(#2a2e36,#23272e);border-bottom-color:#3a3e47}\
body.rex-has-theme:not(.rex-theme-light) .fcs-panel__close{color:#a9b0bc}\
body.rex-has-theme:not(.rex-theme-light) .fcs-panel__close:hover{background:rgba(255,255,255,.08);color:#fff}\
body.rex-has-theme:not(.rex-theme-light) .fcs-panel__collapse{color:#a9b0bc}\
body.rex-has-theme:not(.rex-theme-light) .fcs-panel__collapse:hover{background:rgba(255,255,255,.08);color:#fff}\
body.rex-has-theme:not(.rex-theme-light) .fcs-panel__tabs{background:#1e2127;border-bottom-color:#3a3e47}\
body.rex-has-theme:not(.rex-theme-light) .fcs-panel__tab{color:#a9b0bc}\
body.rex-has-theme:not(.rex-theme-light) .fcs-panel__tab:hover{background:rgba(255,255,255,.05)}\
body.rex-has-theme:not(.rex-theme-light) .fcs-panel__tab.is-active{background:#23272e;border-color:#3a3e47;color:#fff}\
body.rex-has-theme:not(.rex-theme-light) .fcs-searchbar{background:#23272e}\
body.rex-has-theme:not(.rex-theme-light) .fcs-search{background:#1e2127;border-color:#3a3e47;color:#e6e9ef}\
body.rex-has-theme:not(.rex-theme-light) .fcs-name,body.rex-has-theme:not(.rex-theme-light) .fcs-hint,body.rex-has-theme:not(.rex-theme-light) .fcs-group-title{color:#a9b0bc}\
body.rex-has-theme:not(.rex-theme-light) .fcs-row-btn .fcs-name{color:#dde2ea}\
body.rex-has-theme:not(.rex-theme-light) .fcs-btn:hover,body.rex-has-theme:not(.rex-theme-light) .fcs-btn:focus-visible,body.rex-has-theme:not(.rex-theme-light) .fcs-row-btn:hover,body.rex-has-theme:not(.rex-theme-light) .fcs-row-btn:focus-visible{background:rgba(90,170,230,.18)}\
body.rex-has-theme:not(.rex-theme-light) .fcs-glyph--invisible{color:#7a8599}\
body.rex-has-theme:not(.rex-theme-light) .fcs-action{background:#2b2e34;border-color:#3a3e47;color:#dde2ea}\
body.rex-has-theme:not(.rex-theme-light) .fcs-action:hover{background:#33414f;border-color:#4b9ad9}\
body.rex-has-theme:not(.rex-theme-light) .fcs-group--pinned{background:rgba(246,166,35,.08);border-color:rgba(246,166,35,.28)}\
body.rex-has-theme:not(.rex-theme-light) .fcs-group--pinned .fcs-group-title{color:#f6c772}\
body.rex-has-theme:not(.rex-theme-light) .fcs-empty{color:#aaa;border-color:rgba(255,255,255,.15);background:rgba(255,255,255,.03)}\
}\
';

    var EDITOR_CSS = '\
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
        // Direktes DOM-Range-Insert: NICHT execCommand('mceInsertContent') und NICHT insertContent(),
        // weil die den Inhalt durch die TinyMCE Content-Parser-Pipeline schicken. Bei gewissen
        // Konfigurationen (cleanpaste, paste-events, forced_root_block-Verhalten bei bestimmten
        // Zeichen) entstehen dort leere <p>-Blöcke. Hier fügen wir einen reinen Text-Node am
        // aktuellen Cursor ein – das ist sowohl für Sonderzeichen als auch für Emojis korrekt.
        if (!value) { return; }
        var sel = editor.selection;
        if (!sel) { return; }
        var rng = sel.getRng();
        if (!rng) { return; }
        // Falls der Cursor außerhalb des Editor-Body ist (kann bei Focus-Wechseln passieren),
        // stellen wir ihn ans Ende des Body, aber ohne neuen Block zu erzeugen.
        var body = editor.getBody();
        if (body && !body.contains(rng.startContainer)) {
            rng = editor.getDoc().createRange();
            if (body.lastChild) {
                rng.selectNodeContents(body.lastChild);
                rng.collapse(false);
            } else {
                rng.selectNodeContents(body);
                rng.collapse(false);
            }
        }
        // Selektion löschen und Text einfügen.
        try { rng.deleteContents(); } catch (_e) {}
        var textNode = editor.getDoc().createTextNode(value);
        rng.insertNode(textNode);
        // Cursor hinter dem eingefügten Zeichen positionieren.
        rng.setStartAfter(textNode);
        rng.collapse(true);
        sel.setRng(rng);
        // TinyMCE informieren, damit Undo-Stack und Dirty-State korrekt sind.
        try { editor.undoManager.add(); } catch (_e) {}
        try { editor.setDirty(true); } catch (_e) {}
        try { editor.nodeChanged(); } catch (_e) {}
    }

    /* ---------------- Telefonnummern-Normalisierung ---------------- */

    // Eine pragmatische Country-Code-Liste. „nat" = nationaler Trunk-Prefix
    // (üblich „0"; USA/Kanada „1" innerhalb des NANP, in der Praxis aber leer).
    var PHONE_COUNTRIES = [
        { cc: '49',  name: 'Deutschland',       nat: '0' },
        { cc: '43',  name: 'Österreich',        nat: '0' },
        { cc: '41',  name: 'Schweiz',           nat: '0' },
        { cc: '33',  name: 'Frankreich',        nat: '0' },
        { cc: '39',  name: 'Italien',           nat: ''  },
        { cc: '34',  name: 'Spanien',           nat: ''  },
        { cc: '31',  name: 'Niederlande',       nat: '0' },
        { cc: '32',  name: 'Belgien',           nat: '0' },
        { cc: '352', name: 'Luxemburg',         nat: ''  },
        { cc: '45',  name: 'Dänemark',          nat: ''  },
        { cc: '46',  name: 'Schweden',          nat: '0' },
        { cc: '47',  name: 'Norwegen',          nat: ''  },
        { cc: '358', name: 'Finnland',          nat: '0' },
        { cc: '48',  name: 'Polen',             nat: ''  },
        { cc: '420', name: 'Tschechien',        nat: ''  },
        { cc: '421', name: 'Slowakei',          nat: '0' },
        { cc: '36',  name: 'Ungarn',            nat: '06' },
        { cc: '30',  name: 'Griechenland',      nat: ''  },
        { cc: '351', name: 'Portugal',          nat: ''  },
        { cc: '353', name: 'Irland',            nat: '0' },
        { cc: '44',  name: 'Großbritannien',    nat: '0' },
        { cc: '1',   name: 'USA/Kanada',        nat: '1' }
    ];

    function countryByCc(cc) {
        for (var i = 0; i < PHONE_COUNTRIES.length; i++) {
            if (PHONE_COUNTRIES[i].cc === cc) { return PHONE_COUNTRIES[i]; }
        }
        return null;
    }

    function localeDefaultCc(locale) {
        switch ((locale || '').toLowerCase()) {
            case 'de-ch':
            case 'ch':     return '41';
            case 'at':     return '43';
            case 'en':
            case 'en-us':
            case 'us':     return '1';
            case 'en-gb':
            case 'gb':     return '44';
            case 'fr':     return '33';
            case 'de':
            default:       return '49';
        }
    }

    // Normalisiert einen Rohstring zu { cc: '49', rest: '3012345678' } oder { cc: null, rest: '...' }.
    function parsePhone(raw) {
        var s = String(raw || '').trim();
        if (!s) { return null; }
        // Typische „(0)"-Zwischenschreibweise entfernen („+49 (0)30 …")
        s = s.replace(/\((0)\)/g, '');
        // Schreibtrenner entfernen: Leerzeichen, nbsp, /, -, en-dash, em-dash, ., Unterstrich
        s = s.replace(/[\s\u00A0\u202F./_\-\u2013\u2014]/g, '');
        // Reste-Klammern weg
        s = s.replace(/[()\[\]]/g, '');
        // 00-Prefix als internationale Vorwahl akzeptieren
        if (/^00\d/.test(s)) { s = '+' + s.substring(2); }
        // Doppelte „+" killen
        s = s.replace(/^\++/, '+');
        // Nur Ziffern (und ggf. führendes +) beibehalten
        if (s.charAt(0) === '+') {
            var rest = s.substring(1).replace(/\D/g, '');
            // Länger-zuerst-Match auf Country-Codes
            for (var len = 3; len >= 1; len--) {
                var cand = rest.substring(0, len);
                if (countryByCc(cand)) {
                    return { cc: cand, rest: rest.substring(len), hadPlus: true };
                }
            }
            return { cc: null, rest: rest, hadPlus: true };
        }
        return { cc: null, rest: s.replace(/\D/g, ''), hadPlus: false };
    }

    // Entfernt führenden nationalen Trunk-Prefix (meist „0") aus dem Subscriber-Part.
    function stripNationalPrefix(rest, country) {
        if (!country) { return rest; }
        if (country.nat && rest.indexOf(country.nat) === 0) {
            return rest.substring(country.nat.length);
        }
        // Fallback: führende 0 wegschneiden für die meisten europäischen Länder
        if ('' === country.nat && /^0\d/.test(rest)) {
            return rest.substring(1);
        }
        return rest;
    }

    // Gruppiert die Teilnehmernummer locker in 2er-Blöcke von hinten (zur besseren Lesbarkeit).
    function groupDigits(digits) {
        var out = '';
        for (var i = digits.length; i > 0; i -= 2) {
            var start = Math.max(0, i - 2);
            out = digits.substring(start, i) + (out ? ' ' + out : '');
        }
        return out;
    }

    function formatIntl(cc, rest) {
        var country = countryByCc(cc);
        var local = stripNationalPrefix(rest, country);
        if (!local) { return '+' + cc; }
        // Grobe Vorwahl-Abtrennung: für DE/AT/CH/NL typische 2–4-stellige Ortsvorwahl
        var area = '', subscriber = local;
        if (cc === '49' && local.length >= 8) { area = local.substring(0, local.length > 10 ? 4 : 3); subscriber = local.substring(area.length); }
        else if (cc === '41' && local.length >= 8) { area = local.substring(0, 2); subscriber = local.substring(2); }
        else if (cc === '43' && local.length >= 7) { area = local.substring(0, local.length > 9 ? 3 : 2); subscriber = local.substring(area.length); }
        else if (cc === '1' && local.length === 10) { area = local.substring(0, 3); subscriber = local.substring(3); }
        else if (cc === '44' && local.length >= 9) { area = local.substring(0, local.length > 9 ? 4 : 3); subscriber = local.substring(area.length); }
        if (area) {
            return '+' + cc + ' ' + area + ' ' + groupDigits(subscriber);
        }
        return '+' + cc + ' ' + groupDigits(local);
    }

    function formatNat(cc, rest) {
        var country = countryByCc(cc);
        var local = stripNationalPrefix(rest, country);
        if (!local) { return ''; }
        var prefix = (country && country.nat) || '0';
        // Formatierung: prefix + Ortsvorwahl + „ " + Rest
        var area = '', subscriber = local;
        if (cc === '49' && local.length >= 8) { area = local.substring(0, local.length > 10 ? 4 : 3); subscriber = local.substring(area.length); }
        else if (cc === '41' && local.length >= 8) { area = local.substring(0, 2); subscriber = local.substring(2); }
        else if (cc === '43' && local.length >= 7) { area = local.substring(0, local.length > 9 ? 3 : 2); subscriber = local.substring(area.length); }
        else if (cc === '1' && local.length === 10) { area = local.substring(0, 3); subscriber = local.substring(3); }
        else if (cc === '44' && local.length >= 9) { area = local.substring(0, local.length > 9 ? 4 : 3); subscriber = local.substring(area.length); }
        if (area) {
            return prefix + area + ' ' + groupDigits(subscriber);
        }
        return prefix + groupDigits(local);
    }

    // Erkennt „telefon-artige" Tokens im Text (muss mindestens 6 Ziffern enthalten).
    var PHONE_TOKEN_REGEX = /(\+?\s*\d[\d\s.()\/\-\u2013\u2014\u00A0\u202F]{5,}\d)/g;

    function transformPhonesInText(text, mode, defaultCc) {
        return text.replace(PHONE_TOKEN_REGEX, function (match) {
            // Mindestens 6 Ziffern?
            var digitCount = (match.match(/\d/g) || []).length;
            if (digitCount < 6) { return match; }
            var parsed = parsePhone(match);
            if (!parsed || !parsed.rest) { return match; }
            var cc = parsed.cc || defaultCc;
            if (!cc) { return match; }
            return mode === 'intl' ? formatIntl(cc, parsed.rest) : formatNat(cc, parsed.rest);
        });
    }

    // Prüft, ob für die Aktion ein Länder-Dialog nötig ist (keine eindeutige Country-Info im Text).
    function phoneNeedsPrompt(text, defaultCc) {
        // Wenn ein Token ohne „+"/„00"-Prefix erkannt wird und kein Default gesetzt ist → Prompt
        if (defaultCc) { return false; }
        var m = text.match(PHONE_TOKEN_REGEX);
        if (!m) { return false; }
        for (var i = 0; i < m.length; i++) {
            var p = parsePhone(m[i]);
            if (p && p.rest && !p.cc) { return true; }
        }
        return false;
    }

    function promptCountry(editor, cb) {
        var options = PHONE_COUNTRIES.map(function (c) {
            return { text: '+' + c.cc + ' – ' + c.name, value: c.cc };
        });
        editor.windowManager.open({
            title: 'Landesvorwahl wählen',
            body: {
                type: 'panel',
                items: [
                    { type: 'alertbanner', level: 'info', icon: 'info', text: 'Für diese Nummer(n) konnte keine Landesvorwahl erkannt werden. Bitte wählen:' },
                    { type: 'selectbox', name: 'cc', label: 'Land', items: options }
                ]
            },
            buttons: [
                { type: 'cancel', text: 'Abbrechen' },
                { type: 'submit', text: 'Übernehmen', primary: true }
            ],
            initialData: { cc: '49' },
            onSubmit: function (api) {
                var data = api.getData();
                api.close();
                cb(data.cc);
            }
        });
    }

    function runPhoneAction(editor, mode, locale) {
        var selection = editor.selection;
        var content = selection.getContent({ format: 'text' }) || '';
        if (!content) {
            try { editor.notificationManager.open({ text: 'Kein Text markiert.', type: 'info', timeout: 2500 }); } catch (_e) {}
            return;
        }
        // Default aus Editor-Param, sonst aus Locale ableiten
        var defaultCc = editor.getParam('for_chars_symbols_phone_default') || '';
        if (!defaultCc && locale) { defaultCc = localeDefaultCc(locale); }

        // Für international: Prompt nur, wenn gar nichts mit + erkannt wird UND defaultCc leer ist.
        var needsPrompt = phoneNeedsPrompt(content, defaultCc);
        if (needsPrompt) {
            promptCountry(editor, function (cc) {
                selection.setContent(esc(transformPhonesInText(content, mode, cc)));
            });
            return;
        }
        selection.setContent(esc(transformPhonesInText(content, mode, defaultCc)));
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
            case 'phone_intl':  runPhoneAction(editor, 'intl', locale); return;
            case 'phone_nat':   runPhoneAction(editor, 'nat', locale); return;
            default: break;
        }
        if (!content) {
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
        { id: 'favs',    title: 'Favoriten',   render: favsPanelHtml },
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
            +   '<button type="button" class="fcs-panel__collapse" data-fcs-collapse aria-label="Einklappen" title="Einklappen">–</button>'
            +   '<button type="button" class="fcs-panel__close" data-fcs-close aria-label="Schließen">×</button>'
            + '</div>'
            + '<div class="fcs-panel__tabs" role="tablist">' + tabsHtml + '</div>'
            + '<div class="fcs-panel__body">' + panesHtml + '</div>';

        document.body.appendChild(root);

        // Initiale Position: rechts oben in Editor-Nähe.
        var container = editor.getContainer();
        var rect = container ? container.getBoundingClientRect() : { top: 80, right: window.innerWidth - 20 };
        var panelW = 520;
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
            if (e.target.closest('[data-fcs-collapse]')) { return; }
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
            var collapseBtn = e.target.closest('[data-fcs-collapse]');
            if (collapseBtn) {
                e.preventDefault();
                var collapsed = root.classList.toggle('is-collapsed');
                collapseBtn.textContent = collapsed ? '▢' : '–';
                collapseBtn.setAttribute('aria-label', collapsed ? 'Ausklappen' : 'Einklappen');
                collapseBtn.setAttribute('title', collapsed ? 'Ausklappen' : 'Einklappen');
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
                // Kein editor.focus() hier – mousedown preventDefault hält den Editor-Focus,
                // mceInsertContent nutzt die bestehende Selektion.
                renderAndInsert(editor, val);
                addRecent({ kind: kind, value: val, label: label, invisible: invisible || undefined, hint: hint });
                refreshFavsAndRecent(root);
                return;
            }
            var action = e.target.closest('[data-fcs-action]');
            if (action) {
                e.preventDefault();
                performAction(editor, action.getAttribute('data-fcs-action'));
                return;
            }
        });

        // Mousedown im Panel darf dem Editor nicht den Fokus klauen –
        // sonst verliert die Selektion ihren Anchor und neue <p>-Blöcke werden erzeugt.
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
    });
})();
