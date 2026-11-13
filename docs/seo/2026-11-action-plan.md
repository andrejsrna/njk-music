# SEO plán NJK Music, november 2026

Stav: **plánované** (nič z tohto zoznamu nie je nasadené). Nasadené zmeny patria do `docs/seo/gsc-changelog.md` až po live overení.

## 1. Dáta a ich limity

- Zdroj: GSC export „Performance on Search“, **Web (textové), posledné 3 mesiace: 11. 8. – 10. 11. 2026**.
- Súčty z `Graf.csv`: **45 kliknutí, 6 300 zobrazení, CTR 0,71 %**.
- Trend (polovice po 46 dňoch, smerový údaj, nie A/B):

| Obdobie | Kliknutia | Zobrazenia | CTR | Priemerná pozícia (vážená) |
|---|---|---|---|---|
| 11. 8. – 25. 9. | 17 | 1 774 | 0,96 % | 14,4 |
| 26. 9. – 10. 11. | 28 | 4 526 | 0,62 % | 8,7 |

- Zobrazenia vzrástli 2,6x a pozícia sa zlepšila z 14,4 na 8,7. Kliknutia rastú pomalšie než zobrazenia, preto CTR klesá.
- Vzorky sú malé (45 kliknutí). Čokoľvek pod ~10 zobrazení je len hypotéza.
- Tabuľky Dopyty a Strany nie sú prepojené. Neviem, ktorý dopyt priviedol ktorú stránku.
- Export končí 10. 11. **Redizajn a nové eshop stránky z 13. 11. v ňom nie sú.** Efekt redizajnu sa dá hodnotiť najskôr pri exporte z januára.
- Tabuľka dopytov neobsahuje anonymizované vyhľadávania, takže podiely z nej nie sú podiely z celej organiky.

## 2. Hlavné zistenia

1. **98 % zobrazení v dopytoch je brand a jeho preklepy.** Z 4 442 zobrazení v zozname je 4 373 variácií „njk“ (`njk` 4 056, `.njk`, `njk.`, `m njk`, `n j k` a pod.). Nebrandové dopyty dokopy majú ~70 zobrazení.
2. **Dopyt `njk` (4 056 zobr., pozícia 9,4, 1 klik) je pravdepodobne väčšinou nesúvisiaci.** `.njk` je prípona šablón Nunjucks a USA majú 2 052 zobrazení pri CTR 0,24 %. Je to hypotéza podľa vzoru dopytov, nie overené. Odporúčanie: **neoptimalizovať na samotné „njk“**, optimalizovať na „njk music“.
3. **`njk music`: 9 kliknutí z 23 zobrazení, pozícia 3,5.** Brand SERP funguje, ale 3,5 ešte nie je 1.
4. **Domovská stránka dáva 30 z 45 kliknutí** (4 675 zobr., pozícia 8,7, CTR 0,64 %). Jej `<title>` je len „NJK Music“ a popis je všeobecný (`SITE_DESCRIPTION`). Žiadna téma, žiadne kľúčové slovo.
5. **Obsah v pozíciách 6 – 10 s nulovým CTR** (SERP snippet, nie nový text):
   - `/news/best-background-music-for-gaming-videos`: 288 zobr., poz. 8,7, 0 klikov
   - `/news/youtube-streamers-no-copyright-music`: 246 zobr., poz. 9,6, 1 klik
   - `/news/liquid-drum-and-bass`: 233 zobr., poz. 8,0, 3 kliky
   - `/news/make-money-royalty-free`: 94 zobr., poz. 7,8, 0 klikov
   - `/music`: 55 zobr., poz. 7,5; `/labels`: 20 zobr., poz. 7,5
6. **Koldman:** dopyt `koldman` (23 zobr., poz. 4,5) a `/labels/koldman` (29 zobr., poz. 4,9) bez kliknutia. Title „Koldman Label | Bass Rap and Dubstep Energy“ nepomenúva žáner pre vyhľadávača jasne.
7. **Liquid DnB a jazz klaster** (malé čísla, ale najbližšie k tomu, čo web reálne ponúka): `what is liquid dnb`, `whats liquid dnb`, `liquid jazz`, `jazzy drum and bass`, `drum and bass jazz`, `jazz n bass`. V katalógu je **28 z 63 releasov Liquid DnB**, 32 spomína jazz.
8. **Content ID / DistroKid:** `whitelist distrokid`, `distrokid allowlist`, `allowlist distrokid`, `distrokid content id whitelist`, `content id music` (spolu ~12 zobr., pozície 55 – 78). `/help/content-id` má 52 zobr. na pozícii 68. Zámer nie je „kúpiť hudbu“, ale „ako odblokovať claim“.
9. **`is this ai music?`**: 1 kliknutie, pozícia 2. Dôvera v pôvod hudby je reálny dopyt. Stránka `/ai-usage` má 6 zobr. na pozícii 18.
10. **Krajiny:** Rusko 14 klikov (65 zobr., CTR 21,5 %) a Irán 5 klikov (52 zobr.) = 19 z 45 klikov. USA 2 052 zobr. a 5 klikov. Pôvod RU/IR kliknutí je nejasný (poslucháči, VPN alebo boty), nepoužiť ako cieľový trh.
11. **Zariadenia:** desktop 3 215 zobr. / 27 klikov, mobil 2 790 / 18, tablet 295 / 0.

## 3. Technické nálezy (overené curlom 13. 11. 2026)

| Nález | Stav | Akcia |
|---|---|---|
| `http://…` a `https://www.…` presmerujú **302** (dočasne) na `https://njkmusic.com/` | overené | Zmeniť na **301** (Coolify/Traefik alebo Cloudflare redirect). Nie je to v kóde appky, nerobiť bez rozhodnutia. |
| Domovská stránka nemá v HTML `<link rel="canonical">` | grep v surovom HTML nič nenašiel | Doplniť `alternates.canonical` do `app/page.tsx` (`getCanonicalUrl("/")`). V Strany.csv sa objavuje aj `http://www.njkmusic.com/`. |
| Home `<title>` = „NJK Music“ | overené | Viď P0 nižšie. |
| Sitemap | 102 URL, 72 z toho `/news/` a `/music/` | Po pridaní nových URL skontrolovať počet. |

## 4. Akčný plán

### P0: týždeň 1 (snippety, bez nového obsahu)

Platia pravidlá zo skillu: title začať presným dopytom, nesľubovať v ňom nič, čo telo stránky nemá.

| Stránka | Teraz | Návrh | Dôvod |
|---|---|---|---|
| `/` | „NJK Music“ | `NJK Music \| No Copyright Gaming Music & Liquid Drum and Bass` | 4 675 zobr., 30 klikov, brand + 2 hlavné témy katalógu |
| `/` meta description | všeobecná | „NJK Music is a label collective: no copyright gaming music, liquid drum and bass and chill beats for streamers and YouTube creators. Preview tracks, buy WAV for €1.50, license for monetized videos.“ | vychádza z reálnej ponuky (WAV 1,50 €) |
| `/labels/koldman` | „Koldman Label \| Bass Rap and Dubstep Energy“ | `Koldman \| Bass Rap & Dubstep Music \| NJK Music` | dopyt `koldman`, poz. 4,5, 0 klikov |
| `/labels/jazz-and-bass` | „Jazz & Bass Label \| Liquid Drum and Bass for Creators“ | `Jazz & Bass \| Jazzy Liquid Drum and Bass Music` | dopyty `jazz n bass`, `jazzy drum and bass`; stránka poz. 16, 43 zobr., 3 kliky (7 %) |
| `/news/liquid-drum-and-bass` | „Liquid Drum and Bass: What It Is, Why It Works, and Where to Start“ | `What Is Liquid Drum and Bass (Liquid DnB)? Guide + Where to Start` | dopyty `what is liquid dnb`, `whats liquid dnb` |
| `/news/best-background-music-for-gaming-videos` | „Best Background Music for Gaming Videos: How to Choose the Right Track“ | `Best Background Music for Gaming Videos (Copyright-Safe Picks)` | 288 zobr., poz. 8,7, 0 klikov |
| `/news/gaming-genres-music` | „Top 10 Gaming Genres and the Music That Matches Them“ | `Video Game Music Genres: Top 10 and the Tracks That Match` | dopyt `video game music genres` (poz. 54), stránka poz. 17 |
| `/help/content-id` | „Content ID \| NJK Music“ | `Content ID Whitelist for Licensed Creators (Claims Help)` | klaster whitelist/allowlist |
| `/ai-usage` | „AI Usage Information \| NJK Music“ | `Is NJK Music AI Music? AI Usage Information` | `is this ai music?`; **vyžaduje súhlas, text stránky musí na otázku priamo odpovedať** |
| `/music` | „NJK Music Label Library“ | `Music Library: No Copyright Gaming, Liquid DnB & Lofi \| NJK Music` | poz. 7,5, 55 zobr. |

Zmeniť aj `og:title`/`twitter:title` zhodne. Pri titloch pod 60 znakov (alebo skrátiť prefix „NJK Music“).

### P1: týždne 2 – 3 (rozšírenie existujúceho, nie duplikáty)

Nevytvárať nový URL, ak už dopyt zbiera existujúca stránka (kanibalizácia).

1. **Liquid DnB**: do `content/posts/liquid-drum-and-bass.md` pridať:
   - H2 „What is liquid DnB?“ s 2 – 3 vetami hneď po úvode (priama odpoveď),
   - H2 „Jazzy liquid drum and bass“ s odkazom na `/labels/jazz-and-bass`,
   - FAQ (3 otázky: čo je liquid dnb, čím sa líši od neurofunku, kde začať) a odkaz na vybrané releasy.
   - Existujúci článok má 176 riadkov, najprv prečítať a nepridávať duplicitu.
2. **Interné linky**:
   - z `/news/best-background-music-for-gaming-videos` na `/music` a `/labels/no-copyright-gaming-music` hneď po úvode,
   - z `/news/liquid-drum-and-bass` na `/labels/jazz-and-bass`,
   - z domovskej na tri najsilnejšie články (zobrazenia) v sekcii news.
3. **Nové releasy s WAV** (Frostbolt, Greatest Feeling, Overdrive): doplniť do popisu použitie (racing, FPS highlights, speedrun) ako pri Overdrive a pridať odkaz na článok o genre. Overdrive má 15 zobr. na pozícii 6,3 a 2 kliky (13 %), je to najlepší sampler nového formátu.
4. **Canonical na domovskej** a zmena redirectov na 301 (viď §3).

### P2: týždne 4 – 6 (nové stránky, len ak sa potvrdí dopyt)

Pred písaním načítať oficiálnu dokumentáciu a použiť len overené fakty (skill: tool/how-to články).

| Nápad | Dôvod | Podmienka |
|---|---|---|
| **„How to whitelist DistroKid music on YouTube (Content ID)“** | klaster whitelist/allowlist DistroKid, aktuálne len `/help/content-id` na poz. 68 | Overiť v dokumentácii YouTube/DistroKid, čo skutočne platí. Ak NJK nie je distribuovaný cez DistroKid, formulovať neutrálne („ak je skladba distribuovaná cez agregátor“). |
| Landing **„Liquid DnB for creators“** (`/music?genre=Liquid DnB` alebo samostatná stránka) | 28 releasov, najväčšie genre | Ak existuje filter v `MusicBrowser`, prehodnotiť, či má dostať samostatný indexovateľný URL. Zatiaľ len ak sa po P0/P1 zvýši počet liquid dopytov. |
| Článok „Music for video game editing / montages“ | dopyty `music for video game editing`, `modern gaming`, `best songs for gaming videos` | Najprv skontrolovať, či to nepokrýva `best-background-music…` (pravdepodobne áno, potom len sekcia). |

### Čo zámerne nerobiť

- Neoptimalizovať na `njk`, `.njk`, `njk.com` a ich preklepy.
- Necieliť na Rusko, Irán ani iné krajiny len podľa kliknutí (pôvod neznámy).
- Netvoriť stránku „music for X“ bez dopytu v GSC.
- Neodstraňovať `/help/*` ani právne stránky z indexu (majú malé zobrazenia, ale nie sú na škodu).

## 5. Meranie

- Ďalší export: **január 2027 (3 mesiace)** alebo 28 dní po nasadení P0 (priebežne).
- Nepočítať súčty medzi exportmi s rôznym rozsahom. Porovnávať riadky dopytov a stránok.
- Úspech P0:
  - domovská CTR nad 1,2 % pri polohe ≤ 9,
  - `koldman` aspoň 1 klik,
  - `/news/liquid-drum-and-bass` aspoň 6 klikov za 3 mesiace.
- Kľúčové dopyty na sledovanie: `njk music`, `koldman`, `what is liquid dnb`, `jazzy drum and bass`, `video game music genres`, `distrokid whitelist`.
- Brandové zobrazenia rastú rýchlo (2,6x), ale 3 mesiace a 45 klikov nestačia na záver o kauzalite. Kontrolovať aj to, či sa „njk music“ drží na pozícii ≤ 3.

## 6. Čo neviem

- Z ktorých stránok pochádzajú konkrétne dopyty.
- Skutočnú objemnosť dopytov (GSC ukazuje zobrazenia, nie vyhľadávanosť).
- Pôvod RU/IR návštev.
- Či je 302 redirect v Cloudflare, Traefik alebo Coolify (nepozeral som konfiguráciu).
- Efekt redizajnu zo 13. 11. a nových titulov Eshopu.

## 7. Rozšírenie: Ahrefs exporty z M_SEARCH (spracované)

**Zdroj:** Coolify app `M_SEARCH` (id 37, `search.andrejsrna.sk`, repo `andrejsrna/search`, lokálna kópia `/root/search-repo`). Služba je za autentifikáciou (401), dáta som čítal z repa a kontajnera.

**Čo to je:** Ahrefs „Matching terms“ exporty (Keyword, Country, Difficulty, Volume, Traffic potential, Intents). Pre NJK sú relevantné súbory v `music/` z **13. 2. 2026**: seedy `dnb`, `drum-and-bass`, `liquid-dnb`, `neurofunk`, `gaming`, `no-copyright`, `lofi`, `chill`, `calm`, `focus`, `study`, `jazz`, `music` (trh **GB**, každý max. 2 500 riadkov) + `cz liquid-dnb`. Slovenské `google_sk_rozpravky` a `us rap/drill/trap` sú z iných projektov (zdieľaný repozitár).

**Limity:**
- Objem je mesačný z Ahrefs pre **GB** (ostatné trhy v týchto súboroch nie sú). Snapshot je z februára 2026, nie z novembra.
- Export obsahuje len frázy obsahujúce seed. Fráza, ktorá v exporte chýba, **neznamená nulový dopyt**, len že nebola v prvých 2 500 riadkoch seedu.
- Seed `no-copyright` a `jazz` vrátil hlavne šum (obrázky, basgitary Fender/Squier). Pre „jazz drum and bass“, „jazzy drum and bass“, „liquid jazz“ **nemám žiadne dáta o objeme**.
- Číslo Ahrefs nie je zobrazenie v GSC. Porovnávať ich ako rády, nie ako rovnaké jednotky.

### Čo dáta potvrdzujú a menia

| Fráza (GB, Ahrefs) | Objem/mes. | KD | Dôsledok pre plán |
|---|---|---|---|
| `drum and bass` | 4 100 | 12 | široký termín, KD nízka, patrí na `/music` a liquid článok |
| `liquid drum and bass` | 500 | 0 | **hlavná fráza** pre liquid článok, silnejšia ako „what is liquid dnb“ |
| `liquid dnb` | 150 | 6 | do title/H1 |
| `dnb music` | 500 | 6 | doplniť do popisu `/music` a liquid článku |
| `drum and bass songs` | 500 | 1 | kandidát na sekciu/zoznam „Best liquid DnB songs“ z vlastných releasov |
| `best drum and bass songs` | 200 | 2 | rovnaký obsah |
| `what is dnb` / `whats dnb` / `what is drum and bass` | 200 / 70 / 80 | 47 / 0 / 6 | zámer „čo je“ je skôr o **DnB všeobecne**, nie o liquide |
| `what is liquid dnb` | **10** | 9 | **P1 návrh upraviť: nepostaviť titulok na tejto fráze, má zanedbateľný objem** |
| `neurofunk` | 90 | 0 | malé, nerobiť |
| `gaming music` | 450 | 7 | KD nízka, **patrí do `/labels/no-copyright-gaming-music`** |
| `epic music` | 350 | 2 | vhodné pre Frostbolt / epic gaming tracky |
| `video game music` | 700 | 54 | stredne ťažké, `gaming-genres-music` článok |
| `no copyright music` | 600 | 76 | veľmi konkurenčné, bez backlinkov nereálne |
| `copyright free music` / `royalty free music` | 5 700 / 13 000 | 84 / 78 | **necieliť**, KD 78 – 84 |
| `vlog music no copyright free download` | 90 | 0 | malé |
| `calm music` / `calming music` / `relaxing music` | 7 200 / 11 000 / 14 000 | 23 / 32 / 24 | **najväčšia príležitosť pre label Calm Spirit Music** |
| `calm background music` | 100 | 0 | rovnaký label |
| `focus music` / `concentration music` / `study music` | 1 300 / 350 / 1 000 | 17 / 17 / 31 | label Chill Music Motif (lofi/study) |
| `lofi music` / `lofi beats` | 300 / 250 | 61 / 51 | ťažké, len ako podpora |

### Úpravy plánu z týchto dát

1. **P0, `/news/liquid-drum-and-bass`:** title zmeniť na `Liquid Drum and Bass: What Is Liquid DnB? Guide & Where to Start`. Hlavná fráza je „liquid drum and bass“ (500, KD 0), „what is liquid dnb“ je len doplnok.
2. **P0, `/labels/no-copyright-gaming-music`:** pridať `Gaming Music`: `Gaming Music (No Copyright) | NJK Music Label`. Dopyt „gaming music“ 450, KD 7. Stránka má v GSC 34 zobr., poz. 13,9.
3. **P0, `/labels/calm-spirit-music`:** `Calm Music & Relaxing Ambient | Calm Spirit Music`. „calm music“ 7 200, KD 23, stránka má v GSC 29 zobr. na poz. 12,8. Pred nasadením skontrolovať, že obsah label stránky túto tému skutočne pokrýva (popis hovorí o soothing ambient).
4. **P0, `/labels/chill-music-motif`:** `Focus & Study Music | Chill Music Motif`. „focus music“ 1 300, KD 17. GSC: 10 zobr., poz. 12.
5. **P1, nová sekcia na `/music` alebo článok „Best liquid DnB songs“:** frázy `drum and bass songs` (500, KD 1), `dnb music` (500, KD 6). Zoznam z reálnych releasov (28 liquid DnB), nie vymyslený. Jeden URL, nie dva.
6. **P1, kanibalizácia:** `/music` je v GSC na poz. 7,5. Ak sa naň pridá „drum and bass“, nesmie bojovať s liquid článkom. Pravidlo: `/music` = katalóg a žánre, `/news/liquid-drum-and-bass` = vysvetlenie.
7. **Zámerne vynechať:** `royalty free music`, `copyright free music`, `no copyright music` (KD 76 – 84). Platí aj pre „jazz drum and bass“: pre ňu nemáme čísla, nechať ako vedľajšiu frázu v title Jazz & Bass a po 28 dňoch pozrieť GSC.

### Nepatrí do NJK (iný projekt)

- `google_sk_rozpravky`: `rozpravky na dobru noc` 7 200 (KD 24), `audio rozpravky` 3 700 (KD 0). Týka sa label **Ľudovky od Andreja** (slovenské bedtime stories). Je to samostatný SK-trh a iný zámer ako zvyšok webu. Nezapísal som to do P0. Ak to chceš rozvíjať, treba ho posúdiť zvlášť (a v GSC má `/labels/ludovky-od-andreja` len 6 zobrazení).

### Ďalší krok

Na overenie týchto fráz po nasadení P0: po 28 dňoch exportovať GSC a porovnať riadky `gaming music`, `calm music`, `focus music`, `liquid drum and bass`, `dnb music`. Ak by si chcel novšie čísla, treba nový export z Ahrefs (snapshot je z februára).
