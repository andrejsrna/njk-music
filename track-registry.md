# NJK Music — Register názvov trackov

Tento súbor slúži ako **centrálna evidencia všetkých názvov trackov** naprieč
labelmi, aby sa mená neopakovali medzi releasmi. Pri každom novom
tracku/EP sem pridaj nový záznam predtým, než ho zverejníš.

> Zdroj dát: `content/music/*.md` (pole `Tracklist` alebo `Title` pri single
> releasoch). Automaticky vygenerované pomocou `scripts/list_tracks.py`
> (spusti znova po pridaní nových releasov, aby si skontroloval duplicity).

## Jazz & Bass (liquidfunk DnB)

- Absinthe
- Aquatic Harmony
- Balcony Spliff
- Play That Funky Music, Intense Connection, This One Is for You, Classic FM Calm, Deep Blue Eyes *(Berts Jazz Bar)*
- Get Down
- It's All Right Sis
- Jazz, Bass and Acoustic Guitar
- Jazz Kung Fu
- Liquid DnB Is Not Dead
- Liquid Flow - Smooth Drum & Bass Journey
- Liquid Smooth
- Clockwork, Marigold, Salsa, Tequila, Thunderclap *(Mexico EP)*
- Neon Rivers
- Palm
- Samojed, First Light Over Harlem, Sable Current, Velvet *(Samojed)*
- Saxy Expectations
- Serene Solitude
- Silent Parade
- Silly Dancing
- Summertime Sadness
- Supposed To Be
- The Love That Swings
- Toxic
- Twilight Groove
- London, Manchester, Birmingham, Bristol, Echoes After You *(United Kingdom)*
- Walking in the Sun
- Why Not

## Chill Music Motif

- Caramel, No Worries, Sweaty Shirt, Let Me Cry, Past Present Future *(Caramel EP)*
- Late Night LoFi Study Sessions
- Slice and Dice, Pump and Dump, From The Bottom, I Heard That, Let's Do It *(Move Your Head)*
- Calm Crossword Clue, Forest Focus, Nello Super Calm, Pasteurised Orange Juice, Study Group Kdrama *(Polar Chill: UK Temperatures)*

## No Copyright Gaming Music

- Minmaxing, Ibiza, Let Me Through, Clearheaded, bb gn *(HTMN – Gaming Leaks)*
- Power Surge *(Intense Gaming Music Vol. 1)*
- Code Review, Git Commit Git Push, I am a Software Engineer, Rust On Satin, Shattered Amp *(Push That Code)*
- Critical Hit *(single, Rock / Dubstep)*
- Ostatné (bez konkrétneho tracklistu v md): Emo Drill Tape Vol. 1, Gaming Music Tape Vol. 2/3, LoFi Gamer Tape, Lofi Gaming Tape, Lofi Gaming Tape Vol. 2, No Copyright Gaming Music Presents Liquid DnB, No Copyright Gaming Music Presents East Coast Hip Hop, No Copyright Gaming Music Presents Hard Rock, No Copyright West Coast Hip Hop Beats & Instrumentals, Phonk Songs Ultimate, Summer Mix

## Koldman (rap)

- hillbilly wobble rap

## Ľudovky od Andreja (rozprávky pre deti)

- Malé svetlo v Malinovom lese: Rozprávka pre deti na spanie
- Strom, ktorý si želal byť loďou: Rozprávka na dobrú noc

## Calm Spirit Music

- 528Hz The Miracle
- Calm Kettle, Losing Myself, Right Hemisphere, Buzzy Speaker, Myslivec *(Calm Kettle: Micro Downtempo)*
- Meditation Journey: Calm Ambient Music

---

## Rozpracované / navrhované (zatiaľ nepoužité, čakajú na finálne rozhodnutie)

### No Copyright Gaming Music — nový single (návrh)
- Overdrive
- Boss Fight Protocol
- Adrenaline Rush
- Final Stage

### Calm Spirit Music — EP "Forest Walk" (5 trackov, navrhované SEO-friendly názvy)
- Forest Walk – Morning Mist (Ambient Nature Sounds)
- Deep Woods Meditation (Relaxing Ambient Music)
- Whispering Pines (Calm Music for Sleep & Study)
- Rainfall in the Forest (Peaceful Ambient Soundscape)
- Sunset Trail (Stress Relief & Relaxation Music)

---

**Postup pri novom releasi:**
1. Skontroluj tento súbor (Ctrl+F na navrhovaný názov), či sa už nepoužil.
2. Po finálnom výbere názvov ich presuň z "Rozpracované" do sekcie labelu vyššie.
3. Spusti `python3 scripts/list_tracks.py` po pridaní nového `.md` súboru do `content/music/`, aby sa dáta zosynchronizovali (vygeneruje `scripts/tracks_export.json`).
